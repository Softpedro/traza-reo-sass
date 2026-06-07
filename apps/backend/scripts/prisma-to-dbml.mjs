// Convierte prisma/schema.prisma a un archivo DBML (dbdiagram.io).
// Usa nombres físicos (@map / @@map) y resuelve relaciones desde @relation.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma');
const outPath = join(__dirname, '..', 'prisma', 'schema.dbml');

const raw = readFileSync(schemaPath, 'utf8');
const lines = raw.split('\n');

// ---- Paso 1: parsear modelos y enums ----
const enums = {}; // enumName -> [values]
const models = {}; // modelName -> { table, fields, relations }
const modelNames = new Set();
const enumNames = new Set();

for (const line of lines) {
  const t = line.trim();
  let m;
  if ((m = t.match(/^model\s+(\w+)\s*\{/))) modelNames.add(m[1]);
  else if ((m = t.match(/^enum\s+(\w+)\s*\{/))) enumNames.add(m[1]);
}

let i = 0;
while (i < lines.length) {
  const line = lines[i].trim();
  let m;
  if ((m = line.match(/^enum\s+(\w+)\s*\{/))) {
    const name = m[1];
    const vals = [];
    i++;
    while (i < lines.length && !lines[i].trim().startsWith('}')) {
      const v = lines[i].trim();
      if (v && !v.startsWith('//') && !v.startsWith('@') && !v.startsWith('/') && !v.startsWith('*')) {
        vals.push(v.split(/\s+/)[0]);
      }
      i++;
    }
    enums[name] = vals;
  } else if ((m = line.match(/^model\s+(\w+)\s*\{/))) {
    const name = m[1];
    const model = { table: name, fields: [], relations: [] };
    i++;
    while (i < lines.length && !lines[i].trim().startsWith('}')) {
      const l = lines[i].trim();
      i++;
      if (!l || l.startsWith('//') || l.startsWith('/*') || l.startsWith('*')) continue;
      if (l.startsWith('@@map')) {
        const mm = l.match(/@@map\("([^"]+)"\)/);
        if (mm) model.table = mm[1];
        continue;
      }
      if (l.startsWith('@@')) continue; // index/unique compuesto -> omitido
      const fm = l.match(/^(\w+)\s+([\w\[\]\?]+)(.*)$/);
      if (!fm) continue;
      const fname = fm[1];
      const ftypeRaw = fm[2];
      const rest = fm[3] || '';
      const nullable = ftypeRaw.endsWith('?');
      const baseType = ftypeRaw.replace(/[\[\]\?]/g, '');

      // Relación a otro modelo
      if (modelNames.has(baseType)) {
        const relMatch = rest.match(/@relation\(([^)]*)\)/);
        if (relMatch) {
          const fieldsM = relMatch[1].match(/fields:\s*\[([^\]]+)\]/);
          const refsM = relMatch[1].match(/references:\s*\[([^\]]+)\]/);
          if (fieldsM && refsM) {
            model.relations.push({
              localFields: fieldsM[1].split(',').map((s) => s.trim()),
              target: baseType,
              targetFields: refsM[1].split(',').map((s) => s.trim()),
            });
          }
        }
        continue; // los campos objeto de relación no son columnas
      }

      // columna escalar (incluye enums)
      const colM = rest.match(/@map\("([^"]+)"\)/);
      const col = colM ? colM[1] : fname;
      const dbM = rest.match(/@db\.(\w+(?:\([^)]*\))?)/);
      let dbType;
      if (dbM) dbType = dbM[1];
      else if (enumNames.has(baseType)) dbType = baseType;
      else dbType = prismaToSql(baseType);

      model.fields.push({
        name: fname,
        col,
        type: dbType,
        pk: /@id\b/.test(rest),
        unique: /@unique\b/.test(rest),
        nullable,
      });
    }
    models[name] = model;
  }
  i++;
}

function prismaToSql(t) {
  switch (t) {
    case 'Int': return 'int';
    case 'BigInt': return 'bigint';
    case 'String': return 'varchar';
    case 'Boolean': return 'boolean';
    case 'DateTime': return 'datetime';
    case 'Float': return 'double';
    case 'Decimal': return 'decimal';
    case 'Bytes': return 'blob';
    case 'Json': return 'json';
    default: return t.toLowerCase();
  }
}

// ---- Paso 2: emitir DBML ----
const out = [];
out.push('// Generado desde prisma/schema.prisma');
out.push('// Pega este contenido en https://dbdiagram.io/d para visualizar\n');

for (const [name, vals] of Object.entries(enums)) {
  out.push(`Enum ${name} {`);
  for (const v of vals) out.push(`  ${v}`);
  out.push('}\n');
}

for (const model of Object.values(models)) {
  out.push(`Table ${model.table} {`);
  for (const f of model.fields) {
    const attrs = [];
    if (f.pk) attrs.push('pk');
    if (f.unique && !f.pk) attrs.push('unique');
    if (!f.nullable && !f.pk) attrs.push('not null');
    const attrStr = attrs.length ? ` [${attrs.join(', ')}]` : '';
    out.push(`  ${f.col} ${f.type}${attrStr}`);
  }
  out.push('}\n');
}

const refs = [];
for (const model of Object.values(models)) {
  for (const rel of model.relations) {
    const target = models[rel.target];
    if (!target) continue;
    rel.localFields.forEach((lf, idx) => {
      const localCol = model.fields.find((x) => x.name === lf)?.col;
      const tf = rel.targetFields[idx] ?? rel.targetFields[0];
      const targetCol = target.fields.find((x) => x.name === tf)?.col;
      if (localCol && targetCol) {
        refs.push(`Ref: ${model.table}.${localCol} > ${target.table}.${targetCol}`);
      }
    });
  }
}
out.push(...refs);

writeFileSync(outPath, out.join('\n') + '\n', 'utf8');
console.log(`OK -> ${outPath}`);
console.log(`Modelos: ${Object.keys(models).length}, Enums: ${Object.keys(enums).length}, Refs: ${refs.length}`);
