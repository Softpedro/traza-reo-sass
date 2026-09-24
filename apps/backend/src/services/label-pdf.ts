/**
 * Renderizador del PDF de etiquetas (Pasaporte Digital de Producto).
 *
 * 1 página = 1 etiqueta. Tamaño físico: 40 × 100 mm (única opción).
 * Pensado para impresora GODEX G500 (203 dpi).
 *
 * El PDF se genera en streaming con PDFKit: cada página se escribe en la salida en
 * cuanto se termina y se libera, así que la memoria no crece con la cantidad de
 * etiquetas. Con pdf-lib el documento entero vivía en memoria hasta `save()`
 * (~0.7 MB por página): una orden de 682 unidades se comía ~470 MB, el contenedor
 * moría por OOM y el proxy devolvía 502.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PassThrough, type Writable } from "node:stream";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const MM_TO_PT = 72 / 25.4;

/** Tamaño del QR fijo (legible, deja espacio para iconos y texto). */
const QR_SIZE_MM = 22;
/** Piso del QR. Por debajo de esto la lectura con cámara de celular se vuelve incómoda. */
const QR_MIN_MM = 16;
/** Quiet zone (margen blanco obligatorio) alrededor del QR. */
const QR_QUIET_MM = 2;

/** Grosor uniforme y fino de las líneas divisorias (en pt). */
const LINE_THICKNESS = 0.25;

/**
 * Cada cuántas páginas se cede el event loop. Generar una etiqueta es CPU pura (QR +
 * texto): sin ceder, una orden grande bloquearía al resto de peticiones del backend
 * mientras dura.
 */
const PAGES_PER_TICK = 20;

export type LabelSizeKey = "40x100";

/** Único tamaño soportado. */
export const LABEL_SIZES: Record<LabelSizeKey, { wMm: number; hMm: number; label: string }> = {
  "40x100": { wMm: 40, hMm: 100, label: "40 × 100 mm" },
};

export function isLabelSize(v: unknown): v is LabelSizeKey {
  return v === "40x100";
}

export type LabelUnit = {
  sgtinFull: string;
  urlDppFull: string;
  /** Nombre comercial del modelo (MD_MODEL.NAME_MODEL), p. ej. "Dream Garden Amore Natural". */
  modelName?: string | null;
  /** Pieza y su posición en el set: "Chaqueta m/c (Set 2 piezas, 1/2)". */
  pieceLabel?: string | null;
  /** Nº de producto: la prenda física. Las piezas de un mismo set lo comparten. */
  productNumber?: number | null;
};

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

function loadIcon(filename: string): Buffer {
  const bytes = readFileSync(join(ICONS_DIR, filename));
  if (!detectImageKind(bytes)) throw new Error(`Icono inválido: ${filename}`);
  return bytes;
}

/** Orden de presentación en la fila inferior de la etiqueta. */
const ICON_FILES: { file: string; alt: string }[] = [
  { file: "circular.png", alt: "Economía circular" },
  { file: "no-toxico.png", alt: "No tóxico" },
  { file: "trazabilidad.png", alt: "Trazabilidad" },
  { file: "carbono.png", alt: "Huella de carbono" },
  { file: "agua.png", alt: "Agua" },
];

const ICON_ASSETS: Buffer[] = ICON_FILES.map((i) => loadIcon(i.file));

/* ----------------------------- lienzo ----------------------------- */

type Doc = PDFKit.PDFDocument;

/** Imagen ya abierta por PDFKit: se embebe una vez por documento y se reutiliza. */
type OpenedImage = { width: number; height: number };

type FontName = "Helvetica" | "Helvetica-Bold";

/**
 * Primitivas de dibujo con el origen abajo a la izquierda y el eje Y hacia arriba,
 * como en pdf-lib: así el layout de `drawLabel` se mantiene tal cual se calibró para
 * la GODEX. PDFKit tiene el origen arriba, de ahí el `h - y` en cada primitiva.
 */
class Canvas {
  constructor(
    readonly doc: Doc,
    readonly h: number
  ) {}

  width(text: string, font: FontName, fs: number): number {
    return this.doc.font(font).fontSize(fs).widthOfString(text);
  }

  /** Texto con la línea base en `baselineY`. */
  text(text: string, x: number, baselineY: number, font: FontName, fs: number) {
    this.doc
      .font(font)
      .fontSize(fs)
      .fillColor("black")
      .text(text, x, this.h - baselineY, { baseline: "alphabetic", lineBreak: false });
  }

  /** Imagen con su esquina inferior izquierda en (x, y). */
  image(img: OpenedImage, x: number, y: number, width: number, height: number) {
    this.doc.image(img as unknown as Buffer, x, this.h - y - height, { width, height });
  }

  hr(x1: number, x2: number, y: number) {
    this.doc
      .moveTo(x1, this.h - y)
      .lineTo(x2, this.h - y)
      .lineWidth(LINE_THICKNESS)
      .strokeColor("black")
      .stroke();
  }

  /** Rectángulo blanco con su esquina inferior izquierda en (x, y). */
  whiteRect(x: number, y: number, width: number, height: number) {
    this.doc.rect(x, this.h - y - height, width, height).fill("white");
  }

  /** Path SVG (eje Y hacia abajo) con su origen en (x, top). */
  svgPath(d: string, x: number, top: number) {
    this.doc.save().translate(x, this.h - top).path(d).fill("black").restore();
  }
}

/* ----------------------------- QR ----------------------------- */
/**
 * Matriz de módulos del QR. Se dibuja como vector (ver `drawQr`), no como imagen:
 * nitidez independiente del dpi (la GODEX imprime a 203, pero el mismo PDF sirve
 * para cualquier impresora) y un coste de memoria despreciable.
 */
type QrMatrix = { size: number; data: Uint8Array };

function qrMatrix(text: string): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  return { size: qr.modules.size, data: qr.modules.data };
}

/**
 * Dibuja el QR como un único path vectorial con (x, top) en su esquina superior
 * izquierda. Los módulos contiguos de una misma fila se funden en un solo tramo, lo
 * que reduce el path a ~1/3 y evita costuras entre ellos.
 */
function drawQr(c: Canvas, qr: QrMatrix, x: number, top: number, side: number) {
  const n = qr.size;
  const cell = side / n;
  const f = (v: number) => v.toFixed(3);
  let d = "";
  for (let row = 0; row < n; row++) {
    let col = 0;
    while (col < n) {
      if (!qr.data[row * n + col]) {
        col++;
        continue;
      }
      let run = 1;
      while (col + run < n && qr.data[row * n + col + run]) run++;
      const w = run * cell;
      // Subpath cerrado y en el mismo sentido para todos: con winding "nonzero"
      // ningún tramo se convierte en agujero del anterior.
      d += `M${f(col * cell)} ${f(row * cell)}h${f(w)}v${f(cell)}h-${f(w)}Z`;
      col += run;
    }
  }
  c.svgPath(d, x, top);
}

/* ----------------------------- helpers de texto ----------------------------- */

/** Reduce el tamaño de fuente hasta que el texto entre en maxW. */
function fitFont(c: Canvas, text: string, font: FontName, maxW: number, desired: number): number {
  let fs = desired;
  while (fs > 2 && c.width(text, font, fs) > maxW) fs -= 0.25;
  return fs;
}

/** Parte el texto en líneas que caben en maxW. */
function wrap(c: Canvas, text: string, font: FontName, fs: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (c.width(candidate, font, fs) <= maxW || !line) {
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
  c: Canvas,
  text: string,
  font: FontName,
  fs: number,
  pageW: number,
  baselineY: number
) {
  const tw = c.width(text, font, fs);
  c.text(text, (pageW - tw) / 2, baselineY, font, fs);
}

/** Dibuja varios segmentos (cada uno con su font) como una sola línea centrada. */
function drawCenteredSegments(
  c: Canvas,
  segments: { text: string; font: FontName }[],
  fs: number,
  pageW: number,
  baselineY: number
) {
  const totalW = segments.reduce((a, s) => a + c.width(s.text, s.font, fs), 0);
  let x = (pageW - totalW) / 2;
  for (const s of segments) {
    c.text(s.text, x, baselineY, s.font, fs);
    x += c.width(s.text, s.font, fs);
  }
}

/* ----------------------------- render ----------------------------- */

const SUBTITLE = "Escanea para ver el Pasaporte Digital del Producto";

const FONT: FontName = "Helvetica";
const FONT_BOLD: FontName = "Helvetica-Bold";

type DrawCtx = {
  w: number;
  h: number;
  unit: LabelUnit;
  logo: OpenedImage | null;
  qr: QrMatrix;
  icons: OpenedImage[];
  brandName: string;
};

/** Dibuja una etiqueta completa en la página actual. */
function drawLabel(c: Canvas, ctx: DrawCtx) {
  const { w, h, unit, logo, qr, icons, brandName } = ctx;
  const font = FONT;
  const fontBold = FONT_BOLD;
  const mx = w * 0.08;
  const innerW = w - 2 * mx;

  // ---------- Spacing rítmico ----------
  // GAP = espacio base entre bloques. Todos los gaps verticales son múltiplos de GAP
  // para mantener la etiqueta visualmente uniforme.
  // El reparto se ajustó para devolverle tamaño al QR: con los valores anteriores
  // (3 / 4 / 4 mm) la cabecera consumía 56 de los 100 mm y el QR bajaba a 16.
  const GAP = 2 * MM_TO_PT;       // 2 mm entre bloques de texto/separadores
  const BIG_GAP = 3 * MM_TO_PT;   // 3 mm alrededor de la fila de iconos

  // Alturas reservadas (en mm) para tener layout estable en 40 × 100.
  // topMargin = 10 mm: zona de costura. La etiqueta se cose por arriba y esos
  // primeros 10 mm quedan ocultos dentro del dobladillo — nada visible va ahí.
  const topMargin = 10 * MM_TO_PT;
  const bottomMargin = 3 * MM_TO_PT;
  const footerLineH = 2.6 * MM_TO_PT;
  const footerH = footerLineH * 3;
  const iconSize = 3 * MM_TO_PT;      // 3 mm cuadrado
  const ICON_GAP = 1.5 * MM_TO_PT;    // separación entre iconos
  const ICON_ROW_GAP = 1.5 * MM_TO_PT; // aire entre la fila de iconos y el pie
  const sgtinFs = 8;
  // Bloque inferior: footer + iconos + el sGTIN, que va debajo del QR.
  // La línea del sGTIN se reserva exacta (su alto + un GAP a cada lado): reservar de
  // más aquí se lo quitaba al QR, que es lo único de la etiqueta que tiene que ser
  // legible por una cámara.
  const iconsTop = bottomMargin + footerH + ICON_ROW_GAP + iconSize;
  const sgtinBaseline = iconsTop + GAP;
  const bottomBlockTop = sgtinBaseline + sgtinFs + GAP;

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
    c.image(logo, (w - lw) / 2, y - lh, lw, lh);
    y -= lh;
  } else {
    const fs = fitFont(c, brandName, fontBold, innerW, 13);
    y -= fs;
    drawCentered(c, brandName, fontBold, fs, w, y);
  }
  y -= GAP;

  c.hr(mx, w - mx, y);
  y -= GAP;

  // Identificación del producto: modelo, pieza y nº de producto.
  if (unit.modelName) {
    const fs = fitFont(c, unit.modelName, fontBold, innerW, 9);
    for (const ln of wrap(c, unit.modelName, fontBold, fs, innerW)) {
      y -= fs * 1.2;
      drawCentered(c, ln, fontBold, fs, w, y);
    }
  }
  if (unit.pieceLabel) {
    const fs = fitFont(c, unit.pieceLabel, font, innerW, 7);
    for (const ln of wrap(c, unit.pieceLabel, font, fs, innerW)) {
      y -= fs * 1.25;
      drawCentered(c, ln, font, fs, w, y);
    }
  }
  if (unit.productNumber != null) {
    const fs = 9;
    y -= fs * 1.35;
    drawCentered(c, `N° ${unit.productNumber}`, fontBold, fs, w, y);
  }
  y -= GAP;

  c.hr(mx, w - mx, y);
  y -= GAP;

  // Subtítulo.
  const subFs = 6.5;
  for (const ln of wrap(c, SUBTITLE, font, subFs, innerW)) {
    y -= subFs * 1.18;
    drawCentered(c, ln, font, subFs, w, y);
  }
  y -= GAP;

  // QR — 22 mm cuando hay sitio. El espacio sobrante se reparte 70% arriba / 30% abajo
  // para que quede más cerca de los iconos (visualmente "centrado bajo").
  const qrPad = QR_QUIET_MM * MM_TO_PT;
  const band = y - bottomBlockTop;
  // Se encoge si el bloque de identificación creció (nombre de modelo largo, pieza en
  // dos líneas). Antes era fijo: al no caber, el QR se dibujaba sobre el sGTIN y los
  // iconos, y un QR pisado no escanea.
  // Nunca puede exceder la banda: un QR que invade el sGTIN o los iconos no escanea.
  // Si `band` bajara de QR_MIN_MM habría que replantear el reparto vertical, porque el
  // código quedaría por debajo de lo que una cámara de celular lee con comodidad.
  const qrSide = Math.min(band, QR_SIZE_MM * MM_TO_PT);
  const QR_TOP_BIAS = 0.7;
  const qrTop = y - Math.max(0, (band - qrSide) * QR_TOP_BIAS);
  const qrX = (w - qrSide) / 2;
  const qrBottom = qrTop - qrSide;
  c.whiteRect(qrX - qrPad, qrBottom - qrPad, qrSide + 2 * qrPad, qrSide + 2 * qrPad);
  drawQr(c, qr, qrX, qrTop, qrSide);

  // Posicionamiento de los iconos (sin línea separadora arriba).
  const iconsBottom = bottomMargin + footerH + ICON_ROW_GAP;

  // sGTIN — entre el QR y los iconos, centrado en el hueco que reserva sgtinBlockH.
  const sgtinFsFit = fitFont(c, unit.sgtinFull, fontBold, innerW, sgtinFs);
  drawCentered(c, unit.sgtinFull, fontBold, sgtinFsFit, w, sgtinBaseline);

  // Fila de iconos: bloque centrado con separación fija entre ellos. Antes se repartía
  // todo el ancho útil, así que los iconos quedaban desperdigados de borde a borde.
  const slot = iconSize + ICON_GAP;
  const rowW = icons.length * iconSize + (icons.length - 1) * ICON_GAP;
  const rowX = (w - rowW) / 2;
  for (let i = 0; i < icons.length; i++) {
    const img = icons[i];
    // Encajar el icono manteniendo aspect ratio dentro de iconSize × iconSize.
    const ratio = img.width / img.height;
    const iw = ratio >= 1 ? iconSize : iconSize * ratio;
    const ih = ratio >= 1 ? iconSize / ratio : iconSize;
    const cx = rowX + slot * i + iconSize / 2;
    c.image(img, cx - iw / 2, iconsBottom + (iconSize - ih) / 2, iw, ih);
  }

  // Pie (3 líneas).
  const footerFs = 5.5;
  drawCentered(
    c,
    "Proveedor del servicio:",
    font,
    footerFs,
    w,
    bottomMargin + footerLineH * 2 + footerFs * 0.2
  );
  drawCentered(
    c,
    "UMA TECHNOLOGY S.A.C.",
    fontBold,
    footerFs,
    w,
    bottomMargin + footerLineH + footerFs * 0.2
  );
  drawCenteredSegments(
    c,
    [
      { text: "Plataforma ", font },
      { text: "TRAZA", font: fontBold },
      { text: " SaaS DPP", font },
    ],
    footerFs,
    w,
    bottomMargin + footerFs * 0.2
  );
}

/** `doc.openImage` existe en PDFKit pero no está en @types/pdfkit. */
function openImage(doc: Doc, bytes: Uint8Array): OpenedImage {
  return (doc as unknown as { openImage(src: Buffer): OpenedImage }).openImage(
    Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  );
}

/** Espera a que `out` acepte más datos; si el cliente cortó antes, no se queda colgado. */
function drainOrClose(out: Writable): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      out.off("drain", done);
      out.off("close", done);
      resolve();
    };
    out.once("drain", done);
    out.once("close", done);
  });
}

/**
 * Escribe en `out` un PDF con una página por unidad y resuelve cuando `out` recibió
 * el documento completo. `units` puede traer las unidades de una sola etiqueta o de
 * varias.
 *
 * Las páginas se escriben a medida que se generan, respetando la contrapresión de
 * `out`: si el cliente descarga lento, la generación espera en vez de acumular el
 * PDF en memoria.
 */
export async function writeLabelsPdf(
  units: LabelUnit[],
  opts: LabelPdfOptions,
  out: Writable
): Promise<void> {
  const size = LABEL_SIZES[opts.size];
  const w = size.wMm * MM_TO_PT;
  const h = size.hMm * MM_TO_PT;

  const doc = new PDFDocument({ size: [w, h], margin: 0, autoFirstPage: false });
  const finished = new Promise<void>((resolve, reject) => {
    out.once("finish", resolve);
    out.once("close", resolve);
    out.once("error", reject);
    doc.once("error", reject);
  });
  doc.pipe(out);

  // El logo y los iconos se embeben una sola vez y se reutilizan en todas las páginas.
  let logo: OpenedImage | null = null;
  if (opts.logo) {
    try {
      logo = openImage(doc, opts.logo.bytes);
    } catch {
      logo = null;
    }
  }
  const icons = ICON_ASSETS.map((bytes) => openImage(doc, bytes));

  const canvas = new Canvas(doc, h);
  for (let i = 0; i < units.length; i++) {
    // El cliente cortó la descarga: no tiene sentido seguir generando.
    if (out.destroyed) break;

    const unit = units[i];
    doc.addPage({ size: [w, h], margin: 0 });
    drawLabel(canvas, {
      w,
      h,
      unit,
      logo,
      qr: qrMatrix(unit.urlDppFull || unit.sgtinFull),
      icons,
      brandName: opts.brandName,
    });

    if (out.writableNeedDrain) {
      await drainOrClose(out);
    } else if ((i + 1) % PAGES_PER_TICK === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  doc.end();
  await finished;
}

/** Variante en memoria (tests y scripts): junta el PDF completo en un Buffer. */
export async function buildLabelsPdf(units: LabelUnit[], opts: LabelPdfOptions): Promise<Buffer> {
  const sink = new PassThrough();
  const collected = (async () => {
    const chunks: Buffer[] = [];
    for await (const chunk of sink) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks);
  })();
  await writeLabelsPdf(units, opts, sink);
  return collected;
}
