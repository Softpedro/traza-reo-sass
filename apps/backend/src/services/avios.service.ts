import { Buffer } from "node:buffer";
import * as XLSX from "xlsx";
import { Prisma, type PrismaClient } from "../../generated/prisma/client.js";

function num(v: number | bigint): number {
  return typeof v === "bigint" ? Number(v) : v;
}

function normHeader(v: unknown): string {
  return String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function parseYesNo(v: unknown): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "number") return v === 1 ? 1 : 0;
  const s = String(v).trim().toUpperCase();
  // Formatos "1-SI", "0-NO"
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

type AvioRow = {
  idDlkAvio: number;
  idDlkSupplier: number;
  codSupplier: string;
  codAvio: string | null;
  typeAvio: string | null;
  nameAvio: string | null;
  materialAvio: string | null;
  contentValueMaterial: number | null;
  contentSourceMaterial: string | null;
  materialTradeMarks: string | null;
  color: string | null;
  weight: number | null;
  unitMeasurement: string | null;
  recycled: number | null;
  percentageRecycledMaterials: number | null;
  recycledInputSource: string | null;
  certificates: string | null;
  observation: string | null;
  stateAvios: number | null;
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

function mapRawToAvioRow(r: RawJoinRow): AvioRow {
  const supId = r.supplier_idDlkSupplier;
  return {
    idDlkAvio: num(r.idDlkAvio as number | bigint),
    idDlkSupplier: num(r.idDlkSupplier as number | bigint),
    codSupplier: String(r.supplier_codSupplier ?? ""),
    codAvio: toStr(r.codAvio),
    typeAvio: toStr(r.typeAvio),
    nameAvio: toStr(r.nameAvio),
    materialAvio: toStr(r.materialAvio),
    contentValueMaterial: toNum(r.contentValueMaterial),
    contentSourceMaterial: toStr(r.contentSourceMaterial),
    materialTradeMarks: toStr(r.materialTradeMarks),
    color: toStr(r.color),
    weight: toNum(r.weight),
    unitMeasurement: toStr(r.unitMeasurement),
    recycled: toNum(r.recycled),
    percentageRecycledMaterials: toNum(r.percentageRecycledMaterials),
    recycledInputSource: toStr(r.recycledInputSource),
    certificates: toStr(r.certificates),
    observation: toStr(r.observation),
    stateAvios: toNum(r.stateAvios),
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

function mapAvioForApi(row: AvioRow) {
  return {
    ...row,
    codAvio: row.codAvio ?? "",
  };
}

const avioSelectBase = Prisma.sql`
  SELECT
    a.ID_DLK_AVIO AS idDlkAvio,
    a.ID_DLK_SUPPLIER AS idDlkSupplier,
    a.COD_AVIO AS codAvio,
    a.TYPE_AVIO AS typeAvio,
    a.NAME_AVIO AS nameAvio,
    a.MATERIAL_AVIO AS materialAvio,
    a.CONTENT_VALUE_MATERIAL AS contentValueMaterial,
    a.CONTENT_SOURCE_MATERIAL AS contentSourceMaterial,
    a.MATERIAL_TRADE_MARKS AS materialTradeMarks,
    a.COLOR AS color,
    a.WEIGHT AS weight,
    a.UNIT_MEASUREMENT AS unitMeasurement,
    a.RECYCLED AS recycled,
    a.PERCENTAGE_RECYCLED_MATERIALS AS percentageRecycledMaterials,
    a.RECYCLED_INPUT_SOURCE AS recycledInputSource,
    a.CERTIFICATES AS certificates,
    a.OBSERVATION AS observation,
    a.STATE_AVIOS AS stateAvios,
    a.COD_USUARIO_CARGA_DL AS codUsuarioCargaDl,
    a.FEH_PROCESO_CARGA_DL AS fehProcesoCargaDl,
    a.FEH_PROCESO_MODIF_DL AS fehProcesoModifDl,
    a.DES_ACCION AS desAccion,
    a.FLG_STATUT_ACTIF AS flgStatutActif,
    s.ID_DLK_SUPPLIER AS supplier_idDlkSupplier,
    s.COD_SUPPLIER AS supplier_codSupplier,
    s.NAME_SUPPLIER AS supplier_nameSupplier
  FROM MD_AVIO a
  INNER JOIN MD_SUPPLIER s ON s.ID_DLK_SUPPLIER = a.ID_DLK_SUPPLIER
`;

export type AvioCreateInput = {
  idDlkSupplier: number;
  codAvio?: string;
  typeAvio?: string | null;
  nameAvio?: string | null;
  materialAvio?: string | null;
  contentValueMaterial?: number | string | null;
  contentSourceMaterial?: string | null;
  materialTradeMarks?: string | null;
  color?: string | null;
  weight?: number | string | null;
  unitMeasurement?: string | null;
  recycled?: number | boolean | null;
  percentageRecycledMaterials?: number | string | null;
  recycledInputSource?: string | null;
  certificates?: string | null;
  observation?: string | null;
  stateAvios?: number;
};

export type AvioUpdateInput = Partial<AvioCreateInput>;

export class AviosService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
      ${avioSelectBase}
      WHERE a.FLG_STATUT_ACTIF = 1
      ORDER BY a.ID_DLK_AVIO DESC
    `);
    return rows.map((r) => mapAvioForApi(mapRawToAvioRow(r)));
  }

  async getById(id: number) {
    const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
      ${avioSelectBase}
      WHERE a.ID_DLK_AVIO = ${id}
      LIMIT 1
    `);
    const r = rows[0];
    return r ? mapAvioForApi(mapRawToAvioRow(r)) : null;
  }

  async create(data: AvioCreateInput) {
    let codAvio = data.codAvio?.trim() || null;
    if (!codAvio) {
      const lastRows = await this.prisma.$queryRaw<{ cod: string | null }[]>(Prisma.sql`
        SELECT COD_AVIO AS cod FROM MD_AVIO
        ORDER BY ID_DLK_AVIO DESC
        LIMIT 1
      `);
      const last = lastRows[0]?.cod;
      const lastNum = last ? parseInt(String(last).replace(/\D/g, ""), 10) || 0 : 0;
      codAvio = `AVI-${lastNum + 1}`;
    }

    const now = new Date();
    const stateAvios = data.stateAvios ?? 1;

    const newId = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO MD_AVIO (
          ID_DLK_SUPPLIER,
          COD_AVIO,
          TYPE_AVIO,
          NAME_AVIO,
          MATERIAL_AVIO,
          CONTENT_VALUE_MATERIAL,
          CONTENT_SOURCE_MATERIAL,
          MATERIAL_TRADE_MARKS,
          COLOR,
          WEIGHT,
          UNIT_MEASUREMENT,
          RECYCLED,
          PERCENTAGE_RECYCLED_MATERIALS,
          RECYCLED_INPUT_SOURCE,
          CERTIFICATES,
          OBSERVATION,
          STATE_AVIOS,
          COD_USUARIO_CARGA_DL,
          FEH_PROCESO_CARGA_DL,
          FEH_PROCESO_MODIF_DL,
          DES_ACCION,
          FLG_STATUT_ACTIF
        ) VALUES (
          ${data.idDlkSupplier},
          ${codAvio},
          ${nullableText(data.typeAvio)},
          ${nullableText(data.nameAvio)},
          ${nullableText(data.materialAvio)},
          ${nullableNum(data.contentValueMaterial)},
          ${nullableText(data.contentSourceMaterial)},
          ${nullableText(data.materialTradeMarks)},
          ${nullableText(data.color)},
          ${nullableNum(data.weight)},
          ${nullableText(data.unitMeasurement)},
          ${boolFlag(data.recycled, 0)},
          ${nullableNum(data.percentageRecycledMaterials)},
          ${nullableText(data.recycledInputSource)},
          ${nullableText(data.certificates)},
          ${nullableText(data.observation)},
          ${stateAvios},
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
    if (!created) throw new Error("No se pudo leer el avío recién creado");
    return created;
  }

  async update(id: number, data: AvioUpdateInput) {
    const parts: Prisma.Sql[] = [Prisma.sql`DES_ACCION = ${"UPDATE"}`];

    if (data.codAvio !== undefined) parts.push(Prisma.sql`COD_AVIO = ${nullableText(data.codAvio)}`);
    if (data.idDlkSupplier !== undefined) parts.push(Prisma.sql`ID_DLK_SUPPLIER = ${data.idDlkSupplier}`);
    if (data.typeAvio !== undefined) parts.push(Prisma.sql`TYPE_AVIO = ${nullableText(data.typeAvio)}`);
    if (data.nameAvio !== undefined) parts.push(Prisma.sql`NAME_AVIO = ${nullableText(data.nameAvio)}`);
    if (data.materialAvio !== undefined) parts.push(Prisma.sql`MATERIAL_AVIO = ${nullableText(data.materialAvio)}`);
    if (data.contentValueMaterial !== undefined) parts.push(Prisma.sql`CONTENT_VALUE_MATERIAL = ${nullableNum(data.contentValueMaterial)}`);
    if (data.contentSourceMaterial !== undefined) parts.push(Prisma.sql`CONTENT_SOURCE_MATERIAL = ${nullableText(data.contentSourceMaterial)}`);
    if (data.materialTradeMarks !== undefined) parts.push(Prisma.sql`MATERIAL_TRADE_MARKS = ${nullableText(data.materialTradeMarks)}`);
    if (data.color !== undefined) parts.push(Prisma.sql`COLOR = ${nullableText(data.color)}`);
    if (data.weight !== undefined) parts.push(Prisma.sql`WEIGHT = ${nullableNum(data.weight)}`);
    if (data.unitMeasurement !== undefined) parts.push(Prisma.sql`UNIT_MEASUREMENT = ${nullableText(data.unitMeasurement)}`);
    if (data.recycled !== undefined) parts.push(Prisma.sql`RECYCLED = ${boolFlag(data.recycled, 0)}`);
    if (data.percentageRecycledMaterials !== undefined) parts.push(Prisma.sql`PERCENTAGE_RECYCLED_MATERIALS = ${nullableNum(data.percentageRecycledMaterials)}`);
    if (data.recycledInputSource !== undefined) parts.push(Prisma.sql`RECYCLED_INPUT_SOURCE = ${nullableText(data.recycledInputSource)}`);
    if (data.certificates !== undefined) parts.push(Prisma.sql`CERTIFICATES = ${nullableText(data.certificates)}`);
    if (data.observation !== undefined) parts.push(Prisma.sql`OBSERVATION = ${nullableText(data.observation)}`);
    if (data.stateAvios !== undefined) {
      const s = Number(data.stateAvios);
      parts.push(Prisma.sql`STATE_AVIOS = ${s}`);
      parts.push(Prisma.sql`FLG_STATUT_ACTIF = ${s === 1 ? 1 : 0}`);
    }

    parts.push(Prisma.sql`FEH_PROCESO_MODIF_DL = ${new Date()}`);

    if (parts.length <= 2) {
      const row = await this.getById(id);
      if (!row) throw new Error("Avío no encontrado");
      return row;
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_AVIO SET ${Prisma.join(parts, ", ")}
      WHERE ID_DLK_AVIO = ${id}
    `);

    const updated = await this.getById(id);
    if (!updated) throw new Error("Avío no encontrado");
    return updated;
  }

  async softDelete(id: number) {
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_AVIO
      SET FLG_STATUT_ACTIF = 0, STATE_AVIOS = 0, DES_ACCION = ${"DELETE"}
      WHERE ID_DLK_AVIO = ${id}
    `);
  }

  buildTemplate(): Buffer {
    const headers = AVIO_TEMPLATE_HEADERS.map((h) => h.header);
    const example = [
      "", // CODIGO
      "PRV-1", // PROVEEDOR
      "cierre", // TIPO
      "YKK 20cm", // NOMBRE
      "Poliéster", // MATERIAL
      100, // % VALOR
      "Japón", // FUENTE MATERIAL
      "YKK Excella", // NOMBRE COMERCIAL
      "Negro", // COLOR
      5.5, // PESO
      "gr", // UNIDAD MEDIDA
      "No", // RECICLADO
      0, // % RECICLADO
      "", // FUENTE RECICLADO
      "OEKO-TEX", // CERTIFICADO
      "", // OBSERVACION
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "Avios");
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
      raw: false,
    });

    if (raw.length === 0) {
      return { inserted: 0, errors: [] };
    }

    const headerToKey = new Map<string, AvioField>();
    for (const h of AVIO_HEADER_ALIASES) {
      headerToKey.set(normHeader(h.header), h.field);
    }

    const supplierCache = new Map<string, number>();
    async function resolveSupplier(this: AviosService, code: string): Promise<number | null> {
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
      const rowIdx = i + 2;
      const row = raw[i];

      const data: Partial<Record<AvioField, unknown>> = {};
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
          codAvio: data.codAvio ? String(data.codAvio).trim() : undefined,
          typeAvio: data.typeAvio == null ? null : String(data.typeAvio),
          nameAvio: data.nameAvio == null ? null : String(data.nameAvio),
          materialAvio: data.materialAvio == null ? null : String(data.materialAvio),
          contentValueMaterial: data.contentValueMaterial as number | string | null,
          contentSourceMaterial: data.contentSourceMaterial == null ? null : String(data.contentSourceMaterial),
          materialTradeMarks: data.materialTradeMarks == null ? null : String(data.materialTradeMarks),
          color: data.color == null ? null : String(data.color),
          weight: data.weight as number | string | null,
          unitMeasurement: data.unitMeasurement == null ? null : String(data.unitMeasurement),
          recycled: parseYesNo(data.recycled) ?? 0,
          percentageRecycledMaterials: data.percentageRecycledMaterials as number | string | null,
          recycledInputSource: data.recycledInputSource == null ? null : String(data.recycledInputSource),
          certificates: data.certificates == null ? null : String(data.certificates),
          observation: data.observation == null ? null : String(data.observation),
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

type AvioField =
  | "codSupplier"
  | "codAvio"
  | "typeAvio"
  | "nameAvio"
  | "materialAvio"
  | "contentValueMaterial"
  | "contentSourceMaterial"
  | "materialTradeMarks"
  | "color"
  | "weight"
  | "unitMeasurement"
  | "recycled"
  | "percentageRecycledMaterials"
  | "recycledInputSource"
  | "certificates"
  | "observation";

/** Orden y headers usados para la plantilla descargable. */
const AVIO_TEMPLATE_HEADERS: { header: string; field: AvioField }[] = [
  { header: "CODIGO", field: "codAvio" },
  { header: "PROVEEDOR", field: "codSupplier" },
  { header: "TIPO", field: "typeAvio" },
  { header: "NOMBRE", field: "nameAvio" },
  { header: "MATERIAL", field: "materialAvio" },
  { header: "% VALOR", field: "contentValueMaterial" },
  { header: "FUENTE MATERIAL", field: "contentSourceMaterial" },
  { header: "NOMBRE COMERCIAL", field: "materialTradeMarks" },
  { header: "COLOR", field: "color" },
  { header: "PESO", field: "weight" },
  { header: "UNIDAD MEDIDA", field: "unitMeasurement" },
  { header: "RECICLADO", field: "recycled" },
  { header: "% RECICLADO", field: "percentageRecycledMaterials" },
  { header: "FUENTE RECICLADO", field: "recycledInputSource" },
  { header: "CERTIFICADO", field: "certificates" },
  { header: "OBSERVACION", field: "observation" },
];

/** Headers aceptados por el parser de carga masiva. Incluye aliases para tolerar variantes. */
const AVIO_HEADER_ALIASES: { header: string; field: AvioField }[] = [
  ...AVIO_TEMPLATE_HEADERS,
  { header: "Código Proveedor", field: "codSupplier" },
  { header: "Código Avío", field: "codAvio" },
  { header: "Tipo Avío", field: "typeAvio" },
  { header: "Nombre Avío", field: "nameAvio" },
  { header: "% Material", field: "contentValueMaterial" },
  { header: "% Contenido", field: "contentValueMaterial" },
  { header: "Fuente del Material", field: "contentSourceMaterial" },
  { header: "Unidad de Medida", field: "unitMeasurement" },
  { header: "Reciclado (Sí/No)", field: "recycled" },
  { header: "Fuente del Reciclado", field: "recycledInputSource" },
  { header: "Certificados", field: "certificates" },
  { header: "Observaciones", field: "observation" },
];
