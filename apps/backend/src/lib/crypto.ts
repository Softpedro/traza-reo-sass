import { Buffer } from "node:buffer";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * AES-256-GCM para campos pequeños y sensibles (TOTP secret, etc.).
 * Formato del payload: base64(iv (12B) || ciphertext || authTag (16B)).
 *
 * La clave se lee de TWO_FACTOR_ENCRYPTION_KEY: cualquier string de 32+ bytes.
 * Si la app reinicia con otra clave, los secretos guardados quedan ilegibles —
 * por eso es CRÍTICO no rotar esta key sin migrar los registros existentes.
 */

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const raw = process.env.TWO_FACTOR_ENCRYPTION_KEY;
  if (!raw) throw new Error("TWO_FACTOR_ENCRYPTION_KEY no configurado");
  // Aceptamos hex (64 chars) o base64 (44 chars) o utf8 (>= 32 chars).
  let key: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) key = Buffer.from(raw, "hex");
  else if (/^[A-Za-z0-9+/]{43,44}={0,2}$/.test(raw)) key = Buffer.from(raw, "base64");
  else key = Buffer.from(raw, "utf8");
  if (key.length < 32) {
    throw new Error("TWO_FACTOR_ENCRYPTION_KEY debe tener al menos 32 bytes");
  }
  cachedKey = key.subarray(0, 32);
  return cachedKey;
}

export function encryptSecret(plainText: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ciphertext, tag]).toString("base64");
}

export function decryptSecret(payload: string): string {
  const key = getKey();
  const buf = Buffer.from(payload, "base64");
  if (buf.length < IV_LEN + TAG_LEN + 1) throw new Error("Payload cifrado inválido");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}
