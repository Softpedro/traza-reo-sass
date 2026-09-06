/**
 * Reduce imágenes en el navegador antes de subirlas como base64.
 *
 * Las fotos de piezas salen del celular con 3-4 MB cada una. Como el modelo entero viaja
 * en un solo JSON (hasta 10 piezas x 4 perspectivas), el alta se pasaba del límite de body
 * del backend y devolvía 413. A 1600 px de lado mayor y JPEG 0.8 una foto queda en
 * ~200-400 KB, de sobra para lo que se muestra en el pasaporte DPP.
 *
 * Nunca falla de forma dura: si el navegador no puede decodificar el archivo, o si
 * recodificar lo dejaría más pesado, devuelve el original.
 */

const DEFAULTS = {
  /** Lado mayor del resultado. No agranda imágenes que ya sean más chicas. */
  maxDimension: 1600,
  /** Calidad JPEG/WebP (0-1). Ignorada por PNG. */
  quality: 0.8,
  mimeType: "image/jpeg",
};

export type CompressImageOptions = Partial<typeof DEFAULTS>;

export type CompressedImage = {
  /** data URL listo para usar en `<img src>`. */
  dataUrl: string;
  /** Lo que viaja al backend: el data URL sin el prefijo `data:...;base64,`. */
  base64: string;
  /** Bytes aproximados del binario resultante. */
  bytes: number;
};

function splitDataUrl(dataUrl: string): { base64: string; bytes: number } {
  const i = dataUrl.indexOf(",");
  const base64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return { base64, bytes: Math.max(0, (base64.length * 3) / 4 - padding) };
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

type Decoded = {
  width: number;
  height: number;
  source: CanvasImageSource;
  release: () => void;
};

/**
 * `createImageBitmap` respeta la orientación EXIF, que es lo que evita que las fotos
 * verticales de celular queden acostadas. Si no existe, se cae a `<img>`.
 */
async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return {
      width: bitmap.width,
      height: bitmap.height,
      source: bitmap,
      release: () => bitmap.close(),
    };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Formato de imagen no soportado"));
      el.src = url;
    });
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      source: img,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressedImage> {
  const { maxDimension, quality, mimeType } = { ...DEFAULTS, ...options };

  const originalDataUrl = await readAsDataUrl(file);
  const original = { dataUrl: originalDataUrl, ...splitDataUrl(originalDataUrl) };

  // SVG es vectorial (rasterizarlo sólo empeora) y el GIF perdería la animación.
  if (file.type === "image/svg+xml" || file.type === "image/gif") return original;

  let decoded: Decoded;
  try {
    decoded = await decode(file);
  } catch {
    // Formato que este navegador no decodifica (HEIC de iPhone en varios casos).
    return original;
  }

  try {
    const { width, height, source } = decoded;
    if (!width || !height) return original;

    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.imageSmoothingQuality = "high";
    // JPEG no tiene canal alfa: sin este relleno, un PNG transparente sale con fondo negro.
    if (mimeType === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const compressed = { dataUrl, ...splitDataUrl(dataUrl) };
    // Recodificar puede engordar un PNG chico o una imagen ya optimizada: gana el menor.
    return compressed.bytes < original.bytes ? compressed : original;
  } finally {
    decoded.release();
  }
}
