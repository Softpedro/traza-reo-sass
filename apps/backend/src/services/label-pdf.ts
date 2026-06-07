/**
 * Renderizador del PDF de etiquetas (Pasaporte Digital de Producto).
 *
 * 1 página = 1 etiqueta. Tamaño físico: 40 × 100 mm (única opción).
 * Pensado para impresora GODEX G500 (203 dpi).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFImage, PDFPage, RGB } from "pdf-lib";
import QRCode from "qrcode";

const MM_TO_PT = 72 / 25.4;

/** Tamaño del QR fijo (legible, deja espacio para iconos y texto). */
const QR_SIZE_MM = 22;
/** Quiet zone (margen blanco obligatorio) alrededor del QR. */
const QR_QUIET_MM = 2;

/** Grosor uniforme y fino de las líneas divisorias (en pt). */
const LINE_THICKNESS = 0.25;

export type LabelSizeKey = "40x100";

/** Único tamaño soportado. */
export const LABEL_SIZES: Record<LabelSizeKey, { wMm: number; hMm: number; label: string }> = {
  "40x100": { wMm: 40, hMm: 100, label: "40 × 100 mm" },
};

export function isLabelSize(v: unknown): v is LabelSizeKey {
  return v === "40x100";
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
 * Íconos de sostenibilidad cargados desde apps/backend/src/assets/label-icons/.
 * Se leen una vez al iniciar el módulo y se reutilizan en cada PDF.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, "..", "assets", "label-icons");

type IconAsset = { bytes: Uint8Array; kind: "png" | "jpg" };

function loadIcon(filename: string): IconAsset {
  const bytes = new Uint8Array(readFileSync(join(ICONS_DIR, filename)));
  const kind = detectImageKind(bytes);
  if (!kind) throw new Error(`Icono inválido: ${filename}`);
  return { bytes, kind };
}

/** Orden de presentación en la fila inferior de la etiqueta. */
const ICON_FILES: { file: string; alt: string }[] = [
  { file: "trazabilidad.png", alt: "Trazabilidad" },
  { file: "circular.png", alt: "Economía circular" },
  { file: "carbono.png", alt: "Huella de carbono" },
  { file: "agua.png", alt: "Agua" },
  { file: "no-toxico.png", alt: "No tóxico" },
];

const ICON_ASSETS: IconAsset[] = ICON_FILES.map((i) => loadIcon(i.file));

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

/** Dibuja varios segmentos (cada uno con su font) como una sola línea centrada. */
function drawCenteredSegments(
  page: PDFPage,
  segments: { text: string; font: PDFFont }[],
  fs: number,
  pageW: number,
  baselineY: number,
  color: RGB
) {
  const totalW = segments.reduce((a, s) => a + s.font.widthOfTextAtSize(s.text, fs), 0);
  let x = (pageW - totalW) / 2;
  for (const s of segments) {
    page.drawText(s.text, { x, y: baselineY, size: fs, font: s.font, color });
    x += s.font.widthOfTextAtSize(s.text, fs);
  }
}

function hr(page: PDFPage, x1: number, x2: number, y: number, color: RGB) {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness: LINE_THICKNESS,
    color,
  });
}

/* ----------------------------- render ----------------------------- */

const SUBTITLE = "Escanea para ver el Pasaporte Digital del Producto";

type DrawCtx = {
  w: number;
  h: number;
  unit: LabelUnit;
  logo: PDFImage | null;
  qrImg: PDFImage;
  icons: PDFImage[];
  font: PDFFont;
  fontBold: PDFFont;
  brandName: string;
};

/** Dibuja una etiqueta completa en su página. */
function drawLabel(page: PDFPage, ctx: DrawCtx) {
  const { w, h, unit, logo, qrImg, icons, font, fontBold, brandName } = ctx;
  const black = rgb(0, 0, 0);
  const mx = w * 0.08;
  const innerW = w - 2 * mx;

  // ---------- Spacing rítmico ----------
  // GAP = espacio base entre bloques. Todos los gaps verticales son múltiplos de GAP
  // para mantener la etiqueta visualmente uniforme.
  const GAP = 3 * MM_TO_PT;       // 3 mm entre bloques de texto/separadores
  const BIG_GAP = 4 * MM_TO_PT;   // 4 mm alrededor de la fila de iconos (más aire)

  // Alturas reservadas (en mm) para tener layout estable en 40 × 100.
  // topMargin = 10 mm: zona de costura. La etiqueta se cose por arriba y esos
  // primeros 10 mm quedan ocultos dentro del dobladillo — nada visible va ahí.
  const topMargin = 10 * MM_TO_PT;
  const bottomMargin = 3 * MM_TO_PT;
  const footerLineH = 2.6 * MM_TO_PT;
  const footerH = footerLineH * 3;
  const iconSize = 4 * MM_TO_PT;      // 4 mm cuadrado: aire amplio entre iconos
  // Bloque inferior: footer + gap + iconos + gap + línea separadora superior.
  const bottomBlockTop = bottomMargin + footerH + BIG_GAP + iconSize + BIG_GAP;

  let y = h - topMargin; // cursor descendente desde el borde superior

  // Logo de marca (o nombre de la marca si no hay logo).
  // El logo ocupa todo el ancho de la etiqueta (de inicio a fin). La altura se
  // limita para no invadir el contenido inferior, pero para logos anchos manda
  // el ancho, así que queda lo más grande posible.
  const logoMaxW = w;
  const logoMaxH = 16 * MM_TO_PT;
  if (logo) {
    const s = Math.min(logoMaxW / logo.width, logoMaxH / logo.height);
    const lw = logo.width * s;
    const lh = logo.height * s;
    page.drawImage(logo, { x: (w - lw) / 2, y: y - lh, width: lw, height: lh });
    y -= lh;
  } else {
    const fs = fitFont(brandName, fontBold, innerW, 13);
    y -= fs;
    drawCentered(page, brandName, fontBold, fs, w, y, black);
  }
  y -= GAP;

  hr(page, mx, w - mx, y, black);
  y -= GAP;

  // sGTIN — código grande, centrado.
  const gFs = fitFont(unit.sgtinFull, fontBold, innerW, 11);
  y -= gFs;
  drawCentered(page, unit.sgtinFull, fontBold, gFs, w, y, black);
  y -= GAP;

  hr(page, mx, w - mx, y, black);
  y -= GAP;

  // Subtítulo.
  const subFs = 6.5;
  for (const ln of wrap(SUBTITLE, font, subFs, innerW)) {
    y -= subFs * 1.18;
    drawCentered(page, ln, font, subFs, w, y, black);
  }
  y -= GAP;

  // QR — 22 mm. El espacio sobrante se reparte 70% arriba / 30% abajo para que
  // el QR quede más cerca de los iconos (visualmente "centrado bajo").
  const qrSide = QR_SIZE_MM * MM_TO_PT;
  const qrPad = QR_QUIET_MM * MM_TO_PT;
  const band = y - bottomBlockTop;
  const QR_TOP_BIAS = 0.7;
  const qrTop = y - Math.max(0, (band - qrSide) * QR_TOP_BIAS);
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

  // Posicionamiento de los iconos (sin línea separadora arriba).
  const iconsBottom = bottomMargin + footerH + BIG_GAP;

  // Fila de 5 íconos uniformemente repartidos.
  const slot = (w - 2 * mx) / icons.length;
  for (let i = 0; i < icons.length; i++) {
    const img = icons[i];
    // Encajar el icono manteniendo aspect ratio dentro de iconSize × iconSize.
    const ratio = img.width / img.height;
    const iw = ratio >= 1 ? iconSize : iconSize * ratio;
    const ih = ratio >= 1 ? iconSize / ratio : iconSize;
    const cx = mx + slot * (i + 0.5);
    page.drawImage(img, {
      x: cx - iw / 2,
      y: iconsBottom + (iconSize - ih) / 2,
      width: iw,
      height: ih,
    });
  }

  // Pie (3 líneas).
  const footerFs = 5.5;
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
  drawCenteredSegments(
    page,
    [
      { text: "Plataforma ", font },
      { text: "TRAZA", font: fontBold },
      { text: " SaaS DPP", font },
    ],
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

  // Iconos: se embeben una sola vez por documento.
  const icons: PDFImage[] = [];
  for (const asset of ICON_ASSETS) {
    icons.push(
      asset.kind === "png"
        ? await doc.embedPng(asset.bytes)
        : await doc.embedJpg(asset.bytes)
    );
  }

  for (const unit of units) {
    const page = doc.addPage([w, h]);
    const qrPng = await QRCode.toBuffer(unit.urlDppFull || unit.sgtinFull, {
      errorCorrectionLevel: "M",
      margin: 0,
      width: 1200,
      color: { dark: "#000000", light: "#ffffff" },
    });
    const qrImg = await doc.embedPng(qrPng);
    drawLabel(page, {
      w,
      h,
      unit,
      logo,
      qrImg,
      icons,
      font,
      fontBold,
      brandName: opts.brandName,
    });
  }

  return doc.save();
}
