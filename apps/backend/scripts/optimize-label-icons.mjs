/**
 * Optimiza los iconos de etiquetas:
 *  - Resize a 256 px (más que suficiente para 7 mm a 300 DPI).
 *  - Convierte el fondo claro de los JPEG a transparencia.
 *  - Comprime a PNG con paleta indexada (pequeño y sin pérdida visual).
 *
 * Uso: pnpm tsx ../backend/scripts/optimize-label-icons.mjs
 *
 * Sobreescribe los archivos en src/assets/label-icons/. Después de correrlo,
 * todos los iconos quedan en formato .png y label-pdf.ts los lee como PNG.
 */
import sharp from "sharp";
import { readdirSync, statSync, renameSync, unlinkSync, existsSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, "..", "src", "assets", "label-icons");

const TARGET = 256;
const LIGHT_THRESHOLD = 215; // ≥ este lum → transparente
const DARK_THRESHOLD = 110;  // ≤ este lum → negro puro opaco

async function optimize(file) {
  const inputPath = join(ICONS_DIR, file);
  const ext = extname(file).toLowerCase();
  const base = basename(file, ext);
  const outputPath = join(ICONS_DIR, `${base}.png`);
  const tmpPath = join(ICONS_DIR, `${base}.tmp.png`);

  const sizeBefore = statSync(inputPath).size;

  // Resize y obtenemos RGBA crudo para procesar fondo.
  const { data, info } = await sharp(inputPath)
    .resize(TARGET, TARGET, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Pixel a pixel: fondo claro → transparente, gris medio → alpha gradiente,
  // negro → opaco con color forzado a (0,0,0).
  for (let i = 0; i < data.length; i += 4) {
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (lum >= LIGHT_THRESHOLD) {
      data[i + 3] = 0;
    } else if (lum >= DARK_THRESHOLD) {
      const a = Math.round((255 * (LIGHT_THRESHOLD - lum)) / (LIGHT_THRESHOLD - DARK_THRESHOLD));
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = a;
    } else {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: true, quality: 100, effort: 10 })
    .toFile(tmpPath);

  // Si el archivo de origen no era PNG, lo borramos.
  if (ext !== ".png") unlinkSync(inputPath);
  if (existsSync(outputPath) && outputPath !== inputPath) unlinkSync(outputPath);
  renameSync(tmpPath, outputPath);

  const sizeAfter = statSync(outputPath).size;
  console.log(
    `  ${file.padEnd(30)} ${(sizeBefore / 1024).toFixed(1).padStart(8)} KB → ${(sizeAfter / 1024).toFixed(1).padStart(7)} KB  (${info.width}×${info.height})`
  );
}

console.log(`Optimizando iconos en ${ICONS_DIR}\n`);
const files = readdirSync(ICONS_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));
for (const f of files) await optimize(f);
console.log("\nListo.");
