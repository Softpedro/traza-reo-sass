/**
 * One-off: rehashea passwords en plaintext de MD_USER_REO usando bcrypt.
 * Detecta hashes válidos por prefijo `$2a$/$2b$/$2y$` y los respeta.
 *
 * Uso:
 *   npx tsx scripts/migrate-passwords.ts            # produccion (DATABASE_URL del .env)
 *   DATABASE_URL=... npx tsx scripts/migrate-passwords.ts
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const BCRYPT_ROUNDS = 12;

function parseDatabaseUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  };
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL no configurado");
  const cfg = parseDatabaseUrl(dbUrl);
  console.log(`[migrate] DB: ${cfg.host}:${cfg.port}/${cfg.database}`);

  const adapter = new PrismaMariaDb({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    connectionLimit: 2,
  });
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.mdUserReo.findMany({
    select: { idDlkUserReo: true, userLogin: true, password: true },
  });

  let migrated = 0;
  let skipped = 0;
  for (const u of users) {
    if (/^\$2[aby]\$/.test(u.password)) {
      skipped++;
      console.log(`  - ${u.userLogin}: ya hasheado, skip`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, BCRYPT_ROUNDS);
    await prisma.mdUserReo.update({
      where: { idDlkUserReo: u.idDlkUserReo },
      data: { password: hash },
    });
    migrated++;
    console.log(`  ✔ ${u.userLogin}: rehasheado`);
  }

  await prisma.$disconnect();
  console.log(`\nTotal: ${users.length} | rehasheados: ${migrated} | ya estaban: ${skipped}`);
}

main().catch((e) => {
  console.error("[migrate] error:", e);
  process.exit(1);
});
