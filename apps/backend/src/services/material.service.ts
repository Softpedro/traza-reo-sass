import { Buffer } from "node:buffer";
import * as XLSX from "xlsx";
import { Prisma, type PrismaClient } from "../../generated/prisma/client.js";

function num(v: number | bigint): number {
  return typeof v === "bigint" ? Number(v) : v;
}

/** Quita tildes y normaliza espacios/casing para comparar headers del Excel. */
function normHeader(v: unknown): string {
  const base = String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  return base;
}

/** Interpreta celdas tipo "Sí", "SI", "1", 1, true, "1-Si", "0-No" como 1/0. */
function parseYesNo(v: unknown): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "number") return v === 1 ? 1 : 0;
  const s = String(v).trim().toUpperCase();
  // Formatos "1-SI", "0-NO" (excel del cliente)
  const mLead = s.match(/^(\d+)\s*[-\s]/);
  if (mLead) return Number(mLead[1]) === 1 ? 1 : 0;
  if (s === "SI" || s === "SÍ" || s === "1" || s === "YES" || s === "TRUE" || s === "X") return 1;
  if (s === "NO" || s === "0" || s === "FALSE" || s === "") return 0;
  return null;
}

function toStr(v: unknown): string | null {
  return v == null || v === "" ? null : String(v);
}

function toNum(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  // Prisma.Decimal u objetos con toNumber()
  if (typeof v === "object" && typeof (v as { toNumber?: () => number }).toNumber === "function") {
    const n = (v as { toNumber: () => number }).toNumber();
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function nullableText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function nullableNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function boolFlag(v: unknown, fallback = 0): number {
  if (v === true || v === 1 || v === "1") return 1;
  if (v === false || v === 0 || v === "0") return 0;
  const n = Number(v);
  if (Number.isFinite(n)) return n === 1 ? 1 : 0;
  return fallback;
}

type MaterialRow = {
  idDlkMaterial: number;
  idDlkSupplier: number;
  codSupplier: string;
  codMaterial: string | null;
  material: string | null;
  contentNameMaterial: string | null;
  contentValueMaterial: number | null;
  contentSourceMaterials: string | null;
  materialTradeMarks: string | null;
  recycled: number | null;
  percentageRecycledMaterials: number | null;
  recycledInputSource: string | null;
  renewableMaterial: number | null;
  percentageRenewableMaterial: number | null;
  renewableInputSource: string | null;
  typeDyes: string | null;
  dyeClass: string | null;
  classStandardDyes: string | null;
  finishes: string | null;
  patterns: string | null;
  recoveryMaterials: string | null;
  certification: string | null;
  stateMaterials: number | null;
  codUsuarioCargaDl: string | null;
  fehProcesoCargaDl: Date | null;
  fehProcesoModifDl: Date | null;
  desAccion: string | null;
  flgStatutActif: number | null;
  supplier: {
    idDlkSupplier: number;
    codSupplier: string;
    nameSupplier: string;
  } | null;
};

type RawJoinRow = Record<string, unknown>;

function mapRawToMaterialRow(r: RawJoinRow): MaterialRow {
  const supId = r.supplier_idDlkSupplier;
  return {
    idDlkMaterial: num(r.idDlkMaterial as number | bigint),
    idDlkSupplier: num(r.idDlkSupplier as number | bigint),
    codSupplier: String(r.supplier_codSupplier ?? ""),
    codMaterial: toStr(r.codMaterial),
    material: toStr(r.material),
    contentNameMaterial: toStr(r.contentNameMaterial),
    contentValueMaterial: toNum(r.contentValueMaterial),
    contentSourceMaterials: toStr(r.contentSourceMaterials),
    materialTradeMarks: toStr(r.materialTradeMarks),
    recycled: toNum(r.recycled),
    percentageRecycledMaterials: toNum(r.percentageRecycledMaterials),
    recycledInputSource: toStr(r.recycledInputSource),
    renewableMaterial: toNum(r.renewableMaterial),
    percentageRenewableMaterial: toNum(r.percentageRenewableMaterial),
    renewableInputSource: toStr(r.renewableInputSource),
    typeDyes: toStr(r.typeDyes),
    dyeClass: toStr(r.dyeClass),
    classStandardDyes: toStr(r.classStandardDyes),
    finishes: toStr(r.finishes),
    patterns: toStr(r.patterns),
    recoveryMaterials: toStr(r.recoveryMaterials),
    certification: toStr(r.certification),
    stateMaterials: toNum(r.stateMaterials),
    codUsuarioCargaDl: toStr(r.codUsuarioCargaDl),
    fehProcesoCargaDl: (r.fehProcesoCargaDl as Date | null) ?? null,
    fehProcesoModifDl: (r.fehProcesoModifDl as Date | null) ?? null,
    desAccion: toStr(r.desAccion),
    flgStatutActif: toNum(r.flgStatutActif),
    supplier:
      supId != null
        ? {
            idDlkSupplier: num(supId as number | bigint),
            codSupplier: String(r.supplier_codSupplier ?? ""),
            nameSupplier: String(r.supplier_nameSupplier ?? ""),
          }
        : null,
  };
}

function mapMaterialForApi(row: MaterialRow) {
  return {
    ...row,
    codMaterial: row.codMaterial ?? "",
  };
}

const materialSelectBase = Prisma.sql`
  SELECT
    m.ID_DLK_MATERIAL AS idDlkMaterial,
    m.ID_DLK_SUPPLIER AS idDlkSupplier,
    m.COD_MATERIAL AS codMaterial,
    m.MATERIAL AS material,
    m.CONTENT_NAME_MATERIAL AS contentNameMaterial,
    m.CONTENT_VALUE_MATERIAL AS contentValueMaterial,
    m.CONTENT_SOURCE_MATERIALS AS contentSourceMaterials,
    m.MATERIAL_TRADE_MARKS AS materialTradeMarks,
    m.RECYCLED AS recycled,
    m.PERCENTAGE_RECYCLED_MATERIALS AS percentageRecycledMaterials,
    m.RECYCLED_INPUT_SOURCE AS recycledInputSource,
    m.RENEWABLE_MATERIAL AS renewableMaterial,
    m.PERCENTAGE_RENEWABLE_MATERIAL AS percentageRenewableMaterial,
    m.RENEWABLE_INPUT_SOURCE AS renewableInputSource,
    m.TYPE_DYES AS typeDyes,
    m.DYE_CLASS AS dyeClass,
    m.CLASS_STANDARD_DYES AS classStandardDyes,
    m.FINISHES AS finishes,
    m.PATTERNS AS patterns,
    m.RECOVERY_MATERIALS AS recoveryMaterials,
    m.CERTIFICATION AS certification,
    m.STATE_MATERIALS AS stateMaterials,
    m.COD_USUARIO_CARGA_DL AS codUsuarioCargaDl,
    m.FEH_PROCESO_CARGA_DL AS fehProcesoCargaDl,
    m.FEH_PROCESO_MODIF_DL AS fehProcesoModifDl,
    m.DES_ACCION AS desAccion,
    m.FLG_STATUT_ACTIF AS flgStatutActif,
    s.ID_DLK_SUPPLIER AS supplier_idDlkSupplier,
    s.COD_SUPPLIER AS supplier_codSupplier,
    s.NAME_SUPPLIER AS supplier_nameSupplier
  FROM MD_MATERIAL m
  INNER JOIN MD_SUPPLIER s ON s.ID_DLK_SUPPLIER = m.ID_DLK_SUPPLIER
`;

export type MaterialCreateInput = {
  idDlkSupplier: number;
  codMaterial?: string;
  material?: string | null;
  contentNameMaterial?: string | null;
  contentValueMaterial?: number | string | null;
  contentSourceMaterials?: string | null;
  materialTradeMarks?: string | null;
  recycled?: number | boolean | null;
  percentageRecycledMaterials?: number | string | null;
  recycledInputSource?: string | null;
  renewableMaterial?: number | boolean | null;
  percentageRenewableMaterial?: number | string | null;
  renewableInputSource?: string | null;
  typeDyes?: string | null;
  dyeClass?: string | null;
  classStandardDyes?: string | null;
  finishes?: string | null;
  patterns?: string | null;
  recoveryMaterials?: string | null;
  certification?: string | null;
  stateMaterials?: number;
};

export type MaterialUpdateInput = Partial<MaterialCreateInput>;

export class MaterialService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
      ${materialSelectBase}
      WHERE m.FLG_STATUT_ACTIF = 1
      ORDER BY m.ID_DLK_MATERIAL DESC
    `);
    return rows.map((r) => mapMaterialForApi(mapRawToMaterialRow(r)));
  }

  async getById(id: number) {
    const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
      ${materialSelectBase}
      WHERE m.ID_DLK_MATERIAL = ${id}
      LIMIT 1
    `);
    const r = rows[0];
    return r ? mapMaterialForApi(mapRawToMaterialRow(r)) : null;
  }

  async create(data: MaterialCreateInput) {
    let codMaterial = data.codMaterial?.trim() || null;
    if (!codMaterial) {
      const lastRows = await this.prisma.$queryRaw<{ cod: string | null }[]>(Prisma.sql`
        SELECT COD_MATERIAL AS cod FROM MD_MATERIAL
        ORDER BY ID_DLK_MATERIAL DESC
        LIMIT 1
      `);
      const last = lastRows[0]?.cod;
      const lastNum = last ? parseInt(String(last).replace(/\D/g, ""), 10) || 0 : 0;
      codMaterial = `MAT-${lastNum + 1}`;
    }

    const now = new Date();
    const stateMaterials = data.stateMaterials ?? 1;

    const newId = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO MD_MATERIAL (
          ID_DLK_SUPPLIER,
          COD_MATERIAL,
          MATERIAL,
          CONTENT_NAME_MATERIAL,
          CONTENT_VALUE_MATERIAL,
          CONTENT_SOURCE_MATERIALS,
          MATERIAL_TRADE_MARKS,
          RECYCLED,
          PERCENTAGE_RECYCLED_MATERIALS,
          RECYCLED_INPUT_SOURCE,
          RENEWABLE_MATERIAL,
          PERCENTAGE_RENEWABLE_MATERIAL,
          RENEWABLE_INPUT_SOURCE,
          TYPE_DYES,
          DYE_CLASS,
          CLASS_STANDARD_DYES,
          FINISHES,
          PATTERNS,
          RECOVERY_MATERIALS,
          CERTIFICATION,
          STATE_MATERIALS,
          COD_USUARIO_CARGA_DL,
          FEH_PROCESO_CARGA_DL,
          FEH_PROCESO_MODIF_DL,
          DES_ACCION,
          FLG_STATUT_ACTIF
        ) VALUES (
          ${data.idDlkSupplier},
          ${codMaterial},
          ${nullableText(data.material)},
          ${nullableText(data.contentNameMaterial)},
          ${nullableNum(data.contentValueMaterial)},
          ${nullableText(data.contentSourceMaterials)},
          ${nullableText(data.materialTradeMarks)},
          ${boolFlag(data.recycled, 0)},
          ${nullableNum(data.percentageRecycledMaterials)},
          ${nullableText(data.recycledInputSource)},
          ${boolFlag(data.renewableMaterial, 0)},
          ${nullableNum(data.percentageRenewableMaterial)},
          ${nullableText(data.renewableInputSource)},
          ${nullableText(data.typeDyes)},
          ${nullableText(data.dyeClass)},
          ${nullableText(data.classStandardDyes)},
          ${nullableText(data.finishes)},
          ${nullableText(data.patterns)},
          ${nullableText(data.recoveryMaterials)},
          ${nullableText(data.certification)},
          ${stateMaterials},
          ${"SYSTEM"},
          ${now},
          ${now},
          ${"INSERT"},
          ${1}
        )
      `);
      const idRows = await tx.$queryRaw<{ id: number | bigint }[]>(Prisma.sql`
        SELECT LAST_INSERT_ID() AS id
      `);
      return num(idRows[0]?.id ?? 0);
    });

    const created = await this.getById(newId);
    if (!created) throw new Error("No se pudo leer el material recién creado");
    return created;
  }

  async update(id: number, data: MaterialUpdateInput) {
    const parts: Prisma.Sql[] = [Prisma.sql`DES_ACCION = ${"UPDATE"}`];

    if (data.codMaterial !== undefined) parts.push(Prisma.sql`COD_MATERIAL = ${nullableText(data.codMaterial)}`);
    if (data.idDlkSupplier !== undefined) parts.push(Prisma.sql`ID_DLK_SUPPLIER = ${data.idDlkSupplier}`);
    if (data.material !== undefined) parts.push(Prisma.sql`MATERIAL = ${nullableText(data.material)}`);
    if (data.contentNameMaterial !== undefined) parts.push(Prisma.sql`CONTENT_NAME_MATERIAL = ${nullableText(data.contentNameMaterial)}`);
    if (data.contentValueMaterial !== undefined) parts.push(Prisma.sql`CONTENT_VALUE_MATERIAL = ${nullableNum(data.contentValueMaterial)}`);
    if (data.contentSourceMaterials !== undefined) parts.push(Prisma.sql`CONTENT_SOURCE_MATERIALS = ${nullableText(data.contentSourceMaterials)}`);
    if (data.materialTradeMarks !== undefined) parts.push(Prisma.sql`MATERIAL_TRADE_MARKS = ${nullableText(data.materialTradeMarks)}`);
    if (data.recycled !== undefined) parts.push(Prisma.sql`RECYCLED = ${boolFlag(data.recycled, 0)}`);
    if (data.percentageRecycledMaterials !== undefined) parts.push(Prisma.sql`PERCENTAGE_RECYCLED_MATERIALS = ${nullableNum(data.percentageRecycledMaterials)}`);
    if (data.recycledInputSource !== undefined) parts.push(Prisma.sql`RECYCLED_INPUT_SOURCE = ${nullableText(data.recycledInputSource)}`);
    if (data.renewableMaterial !== undefined) parts.push(Prisma.sql`RENEWABLE_MATERIAL = ${boolFlag(data.renewableMaterial, 0)}`);
    if (data.percentageRenewableMaterial !== undefined) parts.push(Prisma.sql`PERCENTAGE_RENEWABLE_MATERIAL = ${nullableNum(data.percentageRenewableMaterial)}`);
    if (data.renewableInputSource !== undefined) parts.push(Prisma.sql`RENEWABLE_INPUT_SOURCE = ${nullableText(data.renewableInputSource)}`);
    if (data.typeDyes !== undefined) parts.push(Prisma.sql`TYPE_DYES = ${nullableText(data.typeDyes)}`);
    if (data.dyeClass !== undefined) parts.push(Prisma.sql`DYE_CLASS = ${nullableText(data.dyeClass)}`);
    if (data.classStandardDyes !== undefined) parts.push(Prisma.sql`CLASS_STANDARD_DYES = ${nullableText(data.classStandardDyes)}`);
    if (data.finishes !== undefined) parts.push(Prisma.sql`FINISHES = ${nullableText(data.finishes)}`);
    if (data.patterns !== undefined) parts.push(Prisma.sql`PATTERNS = ${nullableText(data.patterns)}`);
    if (data.recoveryMaterials !== undefined) parts.push(Prisma.sql`RECOVERY_MATERIALS = ${nullableText(data.recoveryMaterials)}`);
    if (data.certification !== undefined) parts.push(Prisma.sql`CERTIFICATION = ${nullableText(data.certification)}`);
    if (data.stateMaterials !== undefined) {
      const s = Number(data.stateMaterials);
      parts.push(Prisma.sql`STATE_MATERIALS = ${s}`);
      parts.push(Prisma.sql`FLG_STATUT_ACTIF = ${s === 1 ? 1 : 0}`);
    }

    parts.push(Prisma.sql`FEH_PROCESO_MODIF_DL = ${new Date()}`);

    if (parts.length <= 2) {
      const row = await this.getById(id);
      if (!row) throw new Error("Material no encontrado");
      return row;
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_MATERIAL SET ${Prisma.join(parts, ", ")}
      WHERE ID_DLK_MATERIAL = ${id}
    `);

    const updated = await this.getById(id);
    if (!updated) throw new Error("Material no encontrado");
    return updated;
  }

  async softDelete(id: number) {
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_MATERIAL
      SET FLG_STATUT_ACTIF = 0, STATE_MATERIALS = 0, DES_ACCION = ${"DELETE"}
      WHERE ID_DLK_MATERIAL = ${id}
    `);
  }

  /** Descarga de plantilla .xlsx con headers + fila de ejemplo. */
  buildTemplate(): Buffer {
    const headers = MATERIAL_TEMPLATE_HEADERS.map((h) => h.header);
    // Valores en el mismo orden que MATERIAL_TEMPLATE_HEADERS
    const example = [
      "", // CODIGO (auto)
      "PRV-1", // PROVEEDOR
      "100% Algodón pima", // MATERIAL
      "Algodón", // NOMBRE (tipo de fibra)
      100, // % VALOR
      "Perú", // CONTENIDO (fuente)
      "Pima Supreme", // NOMBRE COMERCIAL
      "No", // RECICLADO
      0, // % RECICLADO
      "", // FUENTE RECICLADO
      "No", // RENOVABLE
      0, // % RENOVABLE
      "", // FUENTE RENOVABLE
      "Reactiva", // TIPO TINTE
      "Por agotamiento", // CLASE TINTE
      "GOTS", // ESTANDAR CLASE TINTE
      "Sanforizado", // ACABADO
      "Liso", // PATRON
      "", // MATERIAL RECUPERACION
      "GOTS, OEKO-TEX", // CERTIFICACION
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "Materiales");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" }) as Buffer;
    return buf;
  }

  async bulkCreate(
    fileBase64: string
  ): Promise<{ inserted: number; errors: { row: number; error: string }[] }> {
    if (!fileBase64 || typeof fileBase64 !== "string") {
      throw new Error("El archivo no llegó correctamente");
    }
    const cleaned = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buf = Buffer.from(cleaned, "base64");

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buf, { type: "buffer" });
    } catch {
      throw new Error("No se pudo leer el Excel. Verifica que sea un .xlsx válido.");
    }

    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) throw new Error("El Excel no tiene hojas");
    const sheet = workbook.Sheets[firstSheet];
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
      raw: false, // strings, fechas ya formateadas
    });

    if (raw.length === 0) {
      return { inserted: 0, errors: [] };
    }

    // Mapear headers del archivo a nuestras keys. sheet_to_json usa el header tal como viene.
    // Construimos un índice de normalizado→key canónica usando todos los aliases.
    const headerToKey = new Map<string, MaterialField>();
    for (const h of MATERIAL_HEADER_ALIASES) {
      headerToKey.set(normHeader(h.header), h.field);
    }

    // Resolver proveedores por codSupplier (cache). Acepta valores con sufijo tipo "PRV-1-Creditex":
    // busca primero match exacto; si no, busca el COD_SUPPLIER más largo que sea prefijo seguido de '-'.
    const supplierCache = new Map<string, number>();
    async function resolveSupplier(this: MaterialService, code: string): Promise<number | null> {
      const key = code.trim().toUpperCase();
      if (!key) return null;
      if (supplierCache.has(key)) return supplierCache.get(key)!;
      const rows = await this.prisma.$queryRaw<{ id: number | bigint }[]>(Prisma.sql`
        SELECT ID_DLK_SUPPLIER AS id FROM MD_SUPPLIER
        WHERE (
          UPPER(COD_SUPPLIER) = ${key}
          OR ${key} LIKE CONCAT(UPPER(COD_SUPPLIER), '-%')
        ) AND FLG_STATUT_ACTIF = 1
        ORDER BY LENGTH(COD_SUPPLIER) DESC
        LIMIT 1
      `);
      const id = rows[0]?.id;
      if (id == null) {
        supplierCache.set(key, 0);
        return null;
      }
      const nId = num(id as number | bigint);
      supplierCache.set(key, nId);
      return nId;
    }

    const errors: { row: number; error: string }[] = [];
    let inserted = 0;

    for (let i = 0; i < raw.length; i++) {
      const rowIdx = i + 2; // 1=headers, 2=primera fila de data
      const row = raw[i];

      // Normalizar row por key canónica
      const data: Partial<Record<MaterialField, unknown>> = {};
      for (const [origHeader, value] of Object.entries(row)) {
        const key = headerToKey.get(normHeader(origHeader));
        if (key) data[key] = value;
      }

      const codSup = data.codSupplier == null ? "" : String(data.codSupplier).trim();
      if (!codSup) {
        errors.push({ row: rowIdx, error: "Código de proveedor vacío" });
        continue;
      }

      const supplierId = await resolveSupplier.call(this, codSup);
      if (!supplierId) {
        errors.push({ row: rowIdx, error: `Proveedor '${codSup}' no existe` });
        continue;
      }

      try {
        await this.create({
          idDlkSupplier: supplierId,
          codMaterial: data.codMaterial ? String(data.codMaterial).trim() : undefined,
          material: data.material == null ? null : String(data.material),
          materialTradeMarks: data.materialTradeMarks == null ? null : String(data.materialTradeMarks),
          contentNameMaterial: data.contentNameMaterial == null ? null : String(data.contentNameMaterial),
          contentValueMaterial: data.contentValueMaterial as number | string | null,
          contentSourceMaterials: data.contentSourceMaterials == null ? null : String(data.contentSourceMaterials),
          recycled: parseYesNo(data.recycled) ?? 0,
          percentageRecycledMaterials: data.percentageRecycledMaterials as number | string | null,
          recycledInputSource: data.recycledInputSource == null ? null : String(data.recycledInputSource),
          renewableMaterial: parseYesNo(data.renewableMaterial) ?? 0,
          percentageRenewableMaterial: data.percentageRenewableMaterial as number | string | null,
          renewableInputSource: data.renewableInputSource == null ? null : String(data.renewableInputSource),
          typeDyes: data.typeDyes == null ? null : String(data.typeDyes),
          dyeClass: data.dyeClass == null ? null : String(data.dyeClass),
          classStandardDyes: data.classStandardDyes == null ? null : String(data.classStandardDyes),
          finishes: data.finishes == null ? null : String(data.finishes),
          patterns: data.patterns == null ? null : String(data.patterns),
          recoveryMaterials: data.recoveryMaterials == null ? null : String(data.recoveryMaterials),
          certification: data.certification == null ? null : String(data.certification),
        });
        inserted++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error al insertar";
        errors.push({ row: rowIdx, error: msg });
      }
    }

    return { inserted, errors };
  }
}

type MaterialField =
  | "codSupplier"
  | "codMaterial"
  | "material"
  | "materialTradeMarks"
  | "contentNameMaterial"
  | "contentValueMaterial"
  | "contentSourceMaterials"
  | "recycled"
  | "percentageRecycledMaterials"
  | "recycledInputSource"
  | "renewableMaterial"
  | "percentageRenewableMaterial"
  | "renewableInputSource"
  | "typeDyes"
  | "dyeClass"
  | "classStandardDyes"
  | "finishes"
  | "patterns"
  | "recoveryMaterials"
  | "certification";

/** Orden y headers usados para la plantilla descargable. Refleja el formato que usa el cliente. */
const MATERIAL_TEMPLATE_HEADERS: { header: string; field: MaterialField }[] = [
  { header: "CODIGO", field: "codMaterial" },
  { header: "PROVEEDOR", field: "codSupplier" },
  { header: "MATERIAL", field: "material" },
  { header: "NOMBRE", field: "contentNameMaterial" },
  { header: "% VALOR", field: "contentValueMaterial" },
  { header: "CONTENIDO", field: "contentSourceMaterials" },
  { header: "NOMBRE COMERCIAL", field: "materialTradeMarks" },
  { header: "RECICLADO", field: "recycled" },
  { header: "% RECICLADO", field: "percentageRecycledMaterials" },
  { header: "FUENTE RECICLADO", field: "recycledInputSource" },
  { header: "RENOVABLE", field: "renewableMaterial" },
  { header: "% RENOVABLE", field: "percentageRenewableMaterial" },
  { header: "FUENTE RENOVABLE", field: "renewableInputSource" },
  { header: "TIPO TINTE", field: "typeDyes" },
  { header: "CLASE TINTE", field: "dyeClass" },
  { header: "ESTANDAR CLASE TINTE", field: "classStandardDyes" },
  { header: "ACABADO", field: "finishes" },
  { header: "PATRON", field: "patterns" },
  { header: "MATERIAL RECUPERACION", field: "recoveryMaterials" },
  { header: "CERTIFICACION", field: "certification" },
];

/** Headers aceptados por el parser de carga masiva. Incluye aliases para tolerar variantes. */
const MATERIAL_HEADER_ALIASES: { header: string; field: MaterialField }[] = [
  ...MATERIAL_TEMPLATE_HEADERS,
  // Aliases legacy / naming alternativo
  { header: "Código Proveedor", field: "codSupplier" },
  { header: "Código Material", field: "codMaterial" },
  { header: "Tipo de Fibra", field: "contentNameMaterial" },
  { header: "% Fibra", field: "contentValueMaterial" },
  { header: "% de Fibra", field: "contentValueMaterial" },
  { header: "Fuente de Fibra", field: "contentSourceMaterials" },
  { header: "Reciclado (Sí/No)", field: "recycled" },
  { header: "Renovable (Sí/No)", field: "renewableMaterial" },
  { header: "Fuente de Reciclado", field: "recycledInputSource" },
  { header: "Fuente del Reciclado", field: "recycledInputSource" },
  { header: "Tipo de Tinta", field: "typeDyes" },
  { header: "Clase de Teñido", field: "dyeClass" },
  { header: "Estándar de Teñido", field: "classStandardDyes" },
  { header: "Materiales Recuperados", field: "recoveryMaterials" },
  { header: "Material Recuperado", field: "recoveryMaterials" },
  { header: "Certificaciones", field: "certification" },
  { header: "Certificado", field: "certification" },
];
