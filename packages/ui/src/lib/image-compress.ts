/**
 * Reduce imágenes en el navegador antes de subirlas como base64.
 *
 * Todas las imágenes de la app viajan dentro del JSON de su formulario. Las fotos de
 * celular pesan 3-4 MB cada una, y el alta de un modelo manda hasta 40 (10 piezas x 4
 * perspectivas): se pasaba del límite de body del backend y devolvía 413. A 1600 px de
 * lado mayor y JPEG 0.8 una foto queda en ~200-400 KB, de sobra para lo que se muestra
 * en el pasaporte DPP.
 *
 * Nunca falla de forma dura: si el navegador no puede decodificar el archivo, o si
 * recodificar lo dejaría más pesado, devuelve el original tal cual.
 */

export type CompressFormat = "auto" | "auto-webp" | "jpeg" | "png" | "webp";

const DEFAULTS = {
  /** Lado mayor del resultado. Nunca agranda una imagen que ya sea más chica. */
  maxDimension: 1600,
  /** Calidad JPEG (0-1). PNG es sin pérdida y la ignora. */
  quality: 0.8,
  /**
   * Qué formato emitir:
   *   "auto"      -> PNG si hay píxeles transparentes, JPEG si no.
   *   "auto-webp" -> WebP si hay transparencia, JPEG si no.
   *
   * La distinción importa. Los logos usan "auto" porque el PDF de etiqueta sólo sabe
   * embeber PNG/JPG (`detectImageKind`), y un logo WebP haría que la etiqueta imprimiera
   * el nombre de la marca en lugar del logo.
   *
   * Las fotos de pieza usan "auto-webp": son recortes con fondo transparente (medidos:
   * 45-71% de píxeles transparentes), así que aplanarlos contra blanco los arruina. Pero
   * en PNG pesan ~760 KB y 40 fotos no caben en el límite de body; en WebP son ~38 KB.
   */
  format: "jpeg" as CompressFormat,
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

/**
 * Tipos del archivo original que se pueden conservar tal cual por cada perfil. Fuera de
 * esta lista siempre gana el recomprimido, aunque pese más: guardar un formato que el
 * consumidor no sabe leer es peor que guardar unos KB de más.
 */
const ACEPTA_ORIGINAL: Record<CompressFormat, string[]> = {
  // Los logos acaban en el PDF de etiqueta, que sólo embebe PNG y JPG.
  auto: ["data:image/png", "data:image/jpeg"],
  // Las fotos sólo se muestran en web; WebP también vale.
  "auto-webp": ["data:image/png", "data:image/jpeg", "data:image/webp"],
  jpeg: ["data:image/jpeg"],
  png: ["data:image/png"],
  webp: ["data:image/webp"],
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

/** ¿Algún píxel no es completamente opaco? El canvas no está contaminado: la fuente es un File local. */
function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressedImage> {
  const { maxDimension, quality, format } = { ...DEFAULTS, ...options };

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
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

    const conAlfa =
      format === "auto" || format === "auto-webp"
        ? hasTransparency(ctx, canvas.width, canvas.height)
        : false;
    let mimeType =
      format === "auto"
        ? conAlfa
          ? "image/png"
          : "image/jpeg"
        : format === "auto-webp"
          ? conAlfa
            ? "image/webp"
            : "image/jpeg"
          : `image/${format}`;

    if (mimeType === "image/jpeg") {
      // JPEG no tiene canal alfa y sin fondo lo transparente sale negro. `destination-over`
      // pinta el blanco *detrás* de lo ya dibujado, sin tener que redibujar la imagen.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    }

    let dataUrl = canvas.toDataURL(mimeType, quality);
    // `toDataURL` cae a PNG en silencio si el navegador no soporta el tipo pedido. Se
    // detecta por el prefijo para no etiquetar mal los bytes: un PNG con alfa es peor
    // opción que WebP, pero sigue siendo correcto.
    if (!dataUrl.startsWith(`data:${mimeType}`)) {
      mimeType = dataUrl.slice(5, dataUrl.indexOf(";"));
      if (mimeType === "image/png" && !conAlfa) {
        // Sin transparencia que preservar, JPEG pesa mucho menos que el PNG de reserva.
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }
    }
    const compressed = { dataUrl, ...splitDataUrl(dataUrl) };
    // Recodificar puede engordar un PNG chico o una imagen ya optimizada: gana el menor,
    // salvo que conservar el original signifique guardar un tipo que el destino no sabe
    // leer. Un AVIF de 3 KB nunca pierde por tamaño, pero el PDF de etiqueta sólo embebe
    // PNG y JPG (`detectImageKind`): al no reconocerlo imprimía el nombre de la marca en
    // vez del logo.
    const originalCompatible = ACEPTA_ORIGINAL[format].some((t) => originalDataUrl.startsWith(t));
    if (!originalCompatible) return compressed;
    return compressed.bytes < original.bytes ? compressed : original;
  } finally {
    decoded.release();
  }
}

/** Fotos: piezas de modelo, estilos de orden, foto de usuario. */
export function compressPhoto(file: File): Promise<CompressedImage> {
  return compressImage(file, { maxDimension: 1600, format: "auto-webp" });
}

/**
 * Documentos capturados o escaneados: fichas de medidas, cuadros de tallas.
 * Más resolución y calidad que una foto porque llevan texto y números chicos que
 * tienen que quedar legibles, y `auto` conserva el PNG de una captura de pantalla:
 * para una tabla de texto pesa menos y se lee mejor que el mismo contenido en JPEG.
 */
export function compressDocument(file: File): Promise<CompressedImage> {
  return compressImage(file, { maxDimension: 2400, quality: 0.92, format: "auto" });
}

/**
 * Logos y pictogramas de cuidado. Más chicos que una foto y con la transparencia
 * preservada cuando la traen.
 */
export function compressLogo(file: File): Promise<CompressedImage> {
  return compressImage(file, { maxDimension: 512, format: "auto" });
}
