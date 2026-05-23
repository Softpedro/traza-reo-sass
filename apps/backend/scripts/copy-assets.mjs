/**
 * Copia recursivamente apps/backend/src/assets → apps/backend/dist/src/assets.
 *
 * Necesario porque `tsc` solo emite .js — los binarios (iconos, etc.) que se leen
 * con fs.readFileSync en runtime no se copian solos. Se ejecuta como parte del
 * script "build" (después de tsc).
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src", "assets");
const DST = join(__dirname, "..", "dist", "src", "assets");

if (!existsSync(SRC)) {
  console.log("[copy-assets] No hay src/assets, nada que copiar.");
  process.exit(0);
}

mkdirSync(dirname(DST), { recursive: true });
cpSync(SRC, DST, { recursive: true });
console.log(`[copy-assets] ${SRC} → ${DST}`);
