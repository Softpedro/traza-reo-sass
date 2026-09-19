import { Buffer } from "node:buffer";

/**
 * Bytes de una imagen → data URL para el frontend, detectando el tipo por la firma
 * del archivo. Es la misma conversión que hacen brand.service y care.service con sus
 * logos; acá vive suelta para que los servicios nuevos no vuelvan a copiarla.
 */
export function imageBytesToDataUrl(
  img: Uint8Array | Buffer | null | undefined
): string | null {
  if (img == null || img.byteLength === 0) return null;
  const buf = Buffer.isBuffer(img) ? img : Buffer.from(img);
  const b64 = buf.toString("base64");
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    return `data:image/jpeg;base64,${b64}`;
  }
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return `data:image/png;base64,${b64}`;
  }
  if (buf.length >= 3 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return `data:image/gif;base64,${b64}`;
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return `data:image/webp;base64,${b64}`;
  }
  return `data:image/png;base64,${b64}`;
}
