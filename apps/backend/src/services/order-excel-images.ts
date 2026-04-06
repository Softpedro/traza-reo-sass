import ExcelJS from "exceljs";

export type EmbeddedRowImage = {
  buffer: Buffer;
  extension: string;
};

/**
 * Imágenes incrustadas en la primera hoja, por fila (0-based, alineada con sheet_to_json).
 * Con `imagenCol0`, solo anclas en esa columna (cabecera IMAGEN / FOTO).
 */
export async function extractFirstSheetImagesByRow(
  buf: Buffer,
  imagenCol0?: number
): Promise<Map<number, EmbeddedRowImage>> {
  const wb = new ExcelJS.Workbook();
  try {
    await (wb.xlsx.load as unknown as (data: Uint8Array) => Promise<void>)(new Uint8Array(buf));
  } catch {
    return new Map();
  }

  const ws = wb.worksheets[0];
  if (!ws) return new Map();

  type Cand = { col: number; buffer: Buffer; extension: string };
  const best = new Map<number, Cand>();

  for (const item of ws.getImages()) {
    const id = Number.parseInt(item.imageId, 10);
    if (!Number.isFinite(id)) continue;

    let image: ExcelJS.Image;
    try {
      image = wb.getImage(id);
    } catch {
      continue;
    }

    const raw = image.buffer;
    if (raw == null) continue;
    const buffer = Buffer.from(raw);
    if (buffer.byteLength === 0) continue;

    const tl = item.range.tl;
    const row = Math.floor(tl.row);
    const col = Math.floor(tl.col);
    if (imagenCol0 != null && col !== imagenCol0) continue;

    const extension = image.extension || "png";
    const prev = best.get(row);
    if (!prev || col < prev.col) {
      best.set(row, { col, buffer, extension });
    }
  }

  const out = new Map<number, EmbeddedRowImage>();
  best.forEach((v, row) => {
    out.set(row, { buffer: v.buffer, extension: v.extension });
  });
  return out;
}
