/**
 * Crea un cliente externo (socio) con su API Key para la ingesta DPP.
 * La clave se muestra UNA SOLA VEZ (se guarda solo su hash SHA-256).
 *
 * Uso:
 *   npx tsx scripts/create-api-client.ts "Nombre del socio"
 *   # contra prod:
 *   DATABASE_URL="mysql://USER:PASS@HOST:PORT/DB" npx tsx scripts/create-api-client.ts "Socio Prod"
 */
import "dotenv/config";
import { randomBytes, createHash } from "node:crypto";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is required");
const u = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: u.hostname,
  port: u.port ? parseInt(u.port, 10) : 3306,
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.replace(/^\//, "") || "traza",
  connectionLimit: 5,
  connectTimeout: 15000,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error('Uso: npx tsx scripts/create-api-client.ts "Nombre del socio"');
    process.exit(1);
  }
  const key = `qpk_${randomBytes(24).toString("base64url")}`;
  const keyHash = createHash("sha256").update(key).digest("hex");
  const keyPrefix = key.slice(0, 12);

  const row = await prisma.mdApiClient.create({
    data: {
      nameApiClient: name,
      keyHash,
      keyPrefix,
      scopeApiClient: "dpp:scan",
      codUsuarioCargaDl: "SYSTEM",
    },
    select: { idDlkApiClient: true },
  });

  console.log(`Cliente creado: #${row.idDlkApiClient} — ${name}`);
  console.log(`Prefijo: ${keyPrefix}`);
  console.log("API KEY (guárdala YA, se muestra solo una vez):");
  console.log(key);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
