import * as XLSX from "xlsx";
import type { Prisma } from "../../generated/prisma/client.js";
import { extractFirstSheetImagesByRow } from "./order-excel-images.js";

type PrismaBytes = Uint8Array<ArrayBuffer>;

function toBlobBytes(buf: Buffer): PrismaBytes {
  return Uint8Array.from(buf) as unknown as PrismaBytes;
}

export type OrderDetailDraft = Omit<
  Prisma.OdOrderDetailCreateManyInput,
  "idDlkOrderHead" | "codUsuarioCargaDl" | "fecProcesoCargaDl" | "fecProcesoModifDl"
>;

export function isProbablyExcelBuffer(buf: Buffer): boolean {
  if (buf.length < 4) return false;
  if (buf[0] === 0x50 && buf[1] === 0x4b) return true;
  if (buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0) return true;
  return false;
}

export function isExcelFilename(name: string | null | undefined): boolean {
  if (!name?.trim()) return false;
  const l = name.trim().toLowerCase();
  return l.endsWith(".xlsx") || l.endsWith(".xls");
}

function normalizeHeader(raw: unknown): string {
  if (raw == null) return "";
  return String(raw)
    .replace(/\s+/g, " ")
    .replace(/\./g, "")
    .trim()
    .toUpperCase();
}

function mapSizeHeaderToField(h: string): keyof Prisma.OdOrderDetailCreateManyInput | null {
  const s = h.replace(/\s+/g, "").replace(/\./g, "");
  // Curva bebé (meses): 0-3, 3-6, 0-6, 6-12, 12-18
  if (s === "0-3" || s === "0/3") return "size0_3";
  if (s === "3-6" || s === "3/6") return "size3_6";
  if (s === "0-6" || s === "0/6") return "size0_6";
  if (s === "6-12" || s === "6/12") return "size6_12";
  if (s === "12-18" || s === "12/18") return "size12_18";
  // Tallas letra
  if (s === "S") return "sizeS";
  if (s === "M") return "sizeM";
  if (s === "L") return "sizeL";
  if (s === "XL") return "sizeXl";
  if (s === "XXL") return "sizeXxl";
  // Tallas numéricas (2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16)
  if (/^\d+$/.test(s)) {
    // "23" suele ser columna de total en OP (evitar confusión)
    if (s === "23") return null;
    const map: Record<string, keyof Prisma.OdOrderDetailCreateManyInput> = {
      "2": "size2",
      "3": "size3",
      "4": "size4",
      "5": "size5",
      "6": "size6",
      "7": "size7",
      "8": "size8",
      "9": "size9",
      "10": "size10",
      "11": "size11",
      "12": "size12",
      "14": "size14",
      "16": "size16",
    };
    return map[s] ?? null;
  }
  return null;
}

type SizeCol = { index: number; field: keyof Prisma.OdOrderDetailCreateManyInput };

type ColMap = {
  tela?: number;
  codEstilo?: number;
  nomEstilo?: number;
  colorAway?: number;
  fondoTela?: number;
  versionTela?: number;
  imagen?: number;
  total?: number;
  sizeCols: SizeCol[];
};

function buildColMap(headerCells: unknown[]): ColMap {
  const map: ColMap = { sizeCols: [] };
  headerCells.forEach((raw, idx) => {
    const h = normalizeHeader(raw);
    if (!h) return;

    if (h === "TELA" || h.startsWith("TELA")) {
      map.tela = idx;
      return;
    }
    if ((h.includes("COD") && h.includes("ESTILO")) || h === "CODESTILO") {
      map.codEstilo = idx;
      return;
    }
    if ((h.includes("NOM") && h.includes("ESTILO")) || h === "NOMBRE ESTILO") {
      map.nomEstilo = idx;
      return;
    }
    if (h === "ESTILO" && !h.includes("COD") && !h.includes("TOTAL")) {
      map.nomEstilo = idx;
      return;
    }
    if (h === "COLORWAY" || h.includes("COLORWAY")) {
      map.colorAway = idx;
      return;
    }
    if (h.includes("FONDO") && h.includes("TELA")) {
      map.fondoTela = idx;
      return;
    }
    if (h.includes("VERSION") && h.includes("TELA")) {
      map.versionTela = idx;
      return;
    }
    if (h === "IMAGEN" || h.includes("IMAGEN") || h.includes("FOTO")) {
      map.imagen = idx;
      return;
    }
    if (h === "TOTAL" && !h.includes("ESTILO") && !h.includes("POR")) {
      map.total = idx;
      return;
    }

    const field = mapSizeHeaderToField(h);
    if (field) {
      map.sizeCols.push({ index: idx, field });
    }
  });
  return map;
}

function cellText(row: unknown[], idx: number | undefined): string {
  if (idx == null || idx < 0 || idx >= row.length) return "";
  const v = row[idx];
  if (v == null) return "";
  if (typeof v === "number" && Number.isFinite(v)) return String(Math.trunc(v));
  return String(v).trim();
}

function cellInt(row: unknown[], idx: number | undefined): number | null {
  const s = cellText(row, idx);
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

/**
 * Primera hoja OP: importa todos los campos mapeados por fila.
 * Solo se inserta si en **esa fila** del Excel hay texto en COD ESTILO y en ESTILO (no se rellenan desde filas anteriores).
 * TELA y demás pueden seguir usando arrastre por celdas combinadas.
 */
export async function parseOrderExcelDetails(buf: Buffer): Promise<OrderDetailDraft[]> {
  const wb = XLSX.read(buf, { type: "buffer", cellDates: false, raw: false });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) {
    throw new Error("El Excel no tiene hojas.");
  }
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" }) as unknown[][];

  let headerRowIdx = -1;
  let colMap: ColMap | null = null;

  for (let i = 0; i < rows.length; i++) {
    const labels = rows[i].map((c) => normalizeHeader(c));
    const hasCodEstilo = labels.some((l) => l.includes("COD") && l.includes("ESTILO"));
    const hasTelaColor = labels.includes("TELA") && labels.some((l) => l.includes("COLORWAY"));
    if (!(hasCodEstilo || hasTelaColor)) continue;

    const trial = buildColMap(rows[i]);
    if (trial.codEstilo == null || trial.nomEstilo == null) continue;

    headerRowIdx = i;
    colMap = trial;
    break;
  }

  if (headerRowIdx < 0 || !colMap) {
    throw new Error(
      "No se reconoce el formato del Excel. Se necesitan columnas COD ESTILO y ESTILO (y el layout habitual de OP: TELA/COLORWAY o tallas)."
    );
  }

  if (colMap.sizeCols.length === 0 && colMap.total == null) {
    throw new Error("No se encontraron columnas de tallas (2, 4, 6, S, M, L, OS, etc.) ni TOTAL.");
  }

  const imagesByRow = await extractFirstSheetImagesByRow(buf, colMap.imagen);

  const out: OrderDetailDraft[] = [];
  let carryTela = "";

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const joined = row.map((c) => String(c ?? "").toUpperCase()).join(" ");
    if (joined.includes("TOTAL POR ESTILO")) continue;

    const rawTela = cellText(row, colMap.tela);
    const rawCod = cellText(row, colMap.codEstilo);
    const rawNom = cellText(row, colMap.nomEstilo);

    if (rawTela) carryTela = rawTela;

    if (!rawCod.trim() || !rawNom.trim()) continue;

    const rawColor = cellText(row, colMap.colorAway);
    const rawFondo = cellText(row, colMap.fondoTela);
    const rawVer = cellText(row, colMap.versionTela);

    let sumSizes = 0;
    let anySize = false;
    const sizeValues: Partial<Record<keyof Prisma.OdOrderDetailCreateManyInput, number | null>> = {};
    for (const sc of colMap.sizeCols) {
      const v = cellInt(row, sc.index);
      (sizeValues as Record<string, number | null>)[sc.field as string] = v;
      if (v != null) {
        sumSizes += v;
        anySize = true;
      }
    }

    const rawTotalCol = cellInt(row, colMap.total);

    const tela = rawTela || carryTela;
    const cod = rawCod.trim();
    const nom = rawNom.trim();

    const color = rawColor;
    const fondo = rawFondo;
    const ver = rawVer;

    let totalEstilo = rawTotalCol;
    if (totalEstilo == null && anySize) {
      totalEstilo = sumSizes;
    }

    const emb = imagesByRow.get(i);
    const base = {
      desTela: tela || null,
      codEstilo: cod,
      nomEstilo: nom,
      colorAway: color || null,
      fondoTela: fondo || null,
      versionTela: ver || null,
      totalEstilo,
      desAccion: "I",
      flgStatutActif: 1,
      ...(emb ? { imgEstilo: toBlobBytes(emb.buffer) } : {}),
    };
    out.push({ ...base, ...sizeValues } as OrderDetailDraft);
  }

  if (out.length === 0) {
    throw new Error(
      "No se importó ninguna fila: cada línea debe tener COD ESTILO y ESTILO informados en la misma fila del Excel."
    );
  }

  return out;
}
