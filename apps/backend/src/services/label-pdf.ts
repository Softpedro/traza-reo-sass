/**
 * Renderizador del PDF de etiquetas (Pasaporte Digital de Producto).
 *
 * Cada unidad serializada (OD_ORDER_LABEL_DETAIL) se dibuja como una página
 * cuyo tamaño físico es exactamente la etiqueta elegida — formato pensado para
 * la impresora GODEX G500 (203 dpi, versión con cutter): 1 página = 1 etiqueta.
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFImage, PDFPage, RGB } from "pdf-lib";
import QRCode from "qrcode";

const MM_TO_PT = 72 / 25.4;

/** El QR se imprime a un tamaño fijo de 15 × 15 mm: legible y cabe en ambas etiquetas. */
const QR_SIZE_MM = 15;
/** Quiet zone (margen blanco obligatorio) alrededor del QR. */
const QR_QUIET_MM = 2;

export type LabelSizeKey = "25x50" | "40x50";

/** Tamaños ofrecidos en el modal. Coinciden con las dos páginas del PDF de referencia. */
export const LABEL_SIZES: Record<LabelSizeKey, { wMm: number; hMm: number; label: string }> = {
  "25x50": { wMm: 25, hMm: 50, label: "25 × 50 mm" },
  "40x50": { wMm: 40, hMm: 50, label: "40 × 50 mm" },
};

export function isLabelSize(v: unknown): v is LabelSizeKey {
  return v === "25x50" || v === "40x50";
}

export type LabelUnit = { sgtinFull: string; urlDppFull: string };

export type LabelLogo = { bytes: Uint8Array; kind: "png" | "jpg" };

export type LabelPdfOptions = {
  size: LabelSizeKey;
  brandName: string;
  logo?: LabelLogo | null;
};

/** Detecta PNG/JPEG por número mágico; null si el blob no es ninguno de los dos. */
export function detectImageKind(bytes: Uint8Array): "png" | "jpg" | null {
  if (
    bytes.length > 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  return null;
}

/* ----------------------------- íconos ----------------------------- */
/**
 * Íconos de sostenibilidad como paths SVG (viewBox 24×24, un solo trazo).
 * Aproximaciones limpias de los del PDF de referencia; se pueden sustituir
 * por los SVG exactos si la marca los provee.
 */
const ICON_PATHS: string[] = [
  // Pin de trazabilidad
  "M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z",
  // Flechas circulares (reúso / circularidad)
  "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z",
  // (índice 2 reservado para la huella de carbono — se dibuja con primitivas)
  "",
  // Gota de agua
  "M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z",
  // Hoja (no tóxico)
  "M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93-2.77 2.34-4.71 5.61-5.39 9.32 2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z",
];

/** Dibuja la huella de carbono con primitivas (suela + dedos). */
function drawFoot(page: PDFPage, cx: number, topY: number, size: number, color: RGB) {
  // Suela
  page.drawEllipse({
    x: cx,
    y: topY - size * 0.6,
    xScale: size * 0.26,
    yScale: size * 0.33,
    color,
  });
  // Dedos: uno grande + tres pequeños sobre un arco.
  page.drawCircle({ x: cx - size * 0.16, y: topY - size * 0.13, size: size * 0.115, color });
  const toes = [0.06, 0.2, 0.32];
  const toeY = [0.16, 0.2, 0.27];
  for (let i = 0; i < toes.length; i++) {
    page.drawCircle({
      x: cx + size * toes[i],
      y: topY - size * toeY[i],
      size: size * 0.075,
      color,
    });
  }
}

/** Fila de 5 íconos repartidos uniformemente entre x1 y x2. */
function drawIconRow(
  page: PDFPage,
  x1: number,
  x2: number,
  topY: number,
  size: number,
  color: RGB
) {
  const slot = (x2 - x1) / 5;
  for (let i = 0; i < 5; i++) {
    const cx = x1 + slot * (i + 0.5);
    if (i === 2) {
      drawFoot(page, cx, topY, size, color);
      continue;
    }
    page.drawSvgPath(ICON_PATHS[i], {
      x: cx - size / 2,
      y: topY,
      scale: size / 24,
      color,
    });
  }
}

/* ----------------------------- helpers de texto ----------------------------- */

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Reduce el tamaño de fuente hasta que el texto entre en maxW. */
function fitFont(text: string, font: PDFFont, maxW: number, desired: number): number {
  let fs = desired;
  while (fs > 2 && font.widthOfTextAtSize(text, fs) > maxW) fs -= 0.25;
  return fs;
}

/** Parte el texto en líneas que caben en maxW. */
function wrap(text: string, font: PDFFont, fs: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fs) <= maxW || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawCentered(
  page: PDFPage,
  text: string,
  font: PDFFont,
  fs: number,
  pageW: number,
  baselineY: number,
  color: RGB
) {
  const tw = font.widthOfTextAtSize(text, fs);
  page.drawText(text, { x: (pageW - tw) / 2, y: baselineY, size: fs, font, color });
}

function hr(page: PDFPage, x1: number, x2: number, y: number, color: RGB) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 0.5, color });
}

/* ----------------------------- render ----------------------------- */

const SUBTITLE = "Escanea para ver el Pasaporte Digital del Producto";

type DrawCtx = {
  w: number;
  h: number;
  unit: LabelUnit;
  logo: PDFImage | null;
  qrImg: PDFImage;
  font: PDFFont;
  fontBold: PDFFont;
  brandName: string;
};

/** Dibuja una etiqueta completa en su página. */
function drawLabel(page: PDFPage, ctx: DrawCtx) {
  const { w, h, unit, logo, qrImg, font, fontBold, brandName } = ctx;
  const black = rgb(0, 0, 0);
  const mx = w * 0.085;
  const innerW = w - 2 * mx;

  // Bloque inferior (íconos + pie): se reserva su altura para que el QR ocupe el resto.
  const footerFs = clamp(h * 0.026, 3, 7);
  const footerLineH = footerFs * 1.25;
  const footerH = footerLineH * 3;
  const iconSize = h * 0.06;
  const bottomMargin = h * 0.05;
  const iconsGap = h * 0.02;
  const bottomBlockTop = bottomMargin + footerH + iconsGap + iconSize;

  let y = h - h * 0.05; // cursor descendente desde el borde superior

  // Logo de marca (o nombre de la marca si no hay logo).
  const logoMaxH = h * 0.085;
  if (logo) {
    const s = Math.min(innerW / logo.width, logoMaxH / logo.height);
    const lw = logo.width * s;
    const lh = logo.height * s;
    page.drawImage(logo, { x: (w - lw) / 2, y: y - lh, width: lw, height: lh });
    y -= lh;
  } else {
    const fs = fitFont(brandName, fontBold, innerW, h * 0.05);
    y -= fs;
    drawCentered(page, brandName, fontBold, fs, w, y, black);
  }
  y -= h * 0.024;

  hr(page, mx, w - mx, y, black);
  y -= h * 0.028;

  // sGTIN — código grande, centrado.
  const gFs = fitFont(unit.sgtinFull, fontBold, innerW, h * 0.055);
  y -= gFs;
  drawCentered(page, unit.sgtinFull, fontBold, gFs, w, y, black);
  y -= h * 0.016;

  hr(page, mx, w - mx, y, black);
  y -= h * 0.024;

  // Subtítulo (ajustado en líneas).
  const subFs = clamp(h * 0.027, 3.2, 8);
  for (const ln of wrap(SUBTITLE, font, subFs, innerW)) {
    y -= subFs * 1.18;
    drawCentered(page, ln, font, subFs, w, y, black);
  }
  y -= h * 0.018;

  // QR — tamaño fijo 15 × 15 mm, centrado en el espacio libre, con quiet zone
  // blanca alrededor (negro sobre blanco, sin texto ni íconos pegados).
  const qrSide = QR_SIZE_MM * MM_TO_PT;
  const qrPad = QR_QUIET_MM * MM_TO_PT;
  const band = y - bottomBlockTop;
  const qrTop = y - Math.max(0, (band - qrSide) / 2);
  const qrX = (w - qrSide) / 2;
  const qrBottom = qrTop - qrSide;
  page.drawRectangle({
    x: qrX - qrPad,
    y: qrBottom - qrPad,
    width: qrSide + 2 * qrPad,
    height: qrSide + 2 * qrPad,
    color: rgb(1, 1, 1),
  });
  page.drawImage(qrImg, { x: qrX, y: qrBottom, width: qrSide, height: qrSide });

  // Fila de íconos.
  drawIconRow(page, mx, w - mx, bottomMargin + footerH + iconsGap + iconSize, iconSize, black);

  // Pie (3 líneas).
  drawCentered(
    page,
    "Proveedor del servicio:",
    font,
    footerFs,
    w,
    bottomMargin + footerLineH * 2 + footerFs * 0.2,
    black
  );
  drawCentered(
    page,
    "UMA TECHNOLOGY S.A.C.",
    fontBold,
    footerFs,
    w,
    bottomMargin + footerLineH + footerFs * 0.2,
    black
  );
  drawCentered(
    page,
    "Plataforma TRAZA SaaS DPP",
    font,
    footerFs,
    w,
    bottomMargin + footerFs * 0.2,
    black
  );
}

/**
 * Construye un PDF con una página por unidad. Devuelve los bytes del PDF.
 * `units` puede traer las unidades de una sola etiqueta o de varias.
 */
export async function buildLabelsPdf(
  units: LabelUnit[],
  opts: LabelPdfOptions
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const size = LABEL_SIZES[opts.size];
  const w = size.wMm * MM_TO_PT;
  const h = size.hMm * MM_TO_PT;

  // El logo se embebe una sola vez y se reutiliza en todas las páginas.
  let logo: PDFImage | null = null;
  if (opts.logo) {
    try {
      logo =
        opts.logo.kind === "png"
          ? await doc.embedPng(opts.logo.bytes)
          : await doc.embedJpg(opts.logo.bytes);
    } catch {
      logo = null;
    }
  }

  for (const unit of units) {
    const page = doc.addPage([w, h]);
    // QR del DPP: 1000 px (≫300 dpi a 15 mm), negro puro sobre blanco.
    // margin 0 = la imagen es exactamente el código; la quiet zone se dibuja
    // como recuadro blanco en la etiqueta para que el QR mida 15 mm netos.
    const qrPng = await QRCode.toBuffer(unit.urlDppFull || unit.sgtinFull, {
      errorCorrectionLevel: "M",
      margin: 0,
      width: 1000,
      color: { dark: "#000000", light: "#ffffff" },
    });
    const qrImg = await doc.embedPng(qrPng);
    drawLabel(page, { w, h, unit, logo, qrImg, font, fontBold, brandName: opts.brandName });
  }

  return doc.save();
}
