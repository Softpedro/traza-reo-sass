/**
 * Backfill: siembra Inputs/Procedimientos/Outputs desde el maestro hacia las tablas de ruta
 * (proceso/subproceso/actividad) para TODAS las rutas ya existentes. Idempotente.
 *
 * Uso:
 *   # local (toma DATABASE_URL del .env vía prisma.config)
 *   npx tsx scripts/backfill-route-io.ts
 *   # contra prod
 *   DATABASE_URL="mysql://USER:PASS@HOST:PORT/DB" npx tsx scripts/backfill-route-io.ts
 */
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { seedRouteIoFromMaster } from "../src/services/route-io-seed.js";

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
  const routes = await prisma.odProcessRoute.findMany({
    select: {
      idDlkProcessRoute: true,
      codProcess: true,
      orderComponent: { select: { codUsuarioCargaDl: true } },
    },
    orderBy: { idDlkProcessRoute: "asc" },
  });
  console.log(`Rutas de proceso encontradas: ${routes.length}`);

  for (const r of routes) {
    await seedRouteIoFromMaster(
      prisma,
      r.idDlkProcessRoute,
      r.orderComponent?.codUsuarioCargaDl ?? "SYSTEM"
    );
    console.log(`  ✓ process-route ${r.idDlkProcessRoute} (${r.codProcess})`);
  }

  // Resumen de conteos tras el backfill.
  const [inP, prP, outP, inS, prS, outS] = await Promise.all([
    prisma.odInputProcessRoute.count(),
    prisma.odProcedureProcessRoute.count(),
    prisma.odOutputProcessRoute.count(),
    prisma.odInputSubprocessRoute.count(),
    prisma.odProcedureSubprocessRoute.count(),
    prisma.odOutputSubprocessRoute.count(),
  ]);
  console.log("Totales tras backfill:");
  console.log(`  Proceso    → in:${inP} proc:${prP} out:${outP}`);
  console.log(`  Subproceso → in:${inS} proc:${prS} out:${outS}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
