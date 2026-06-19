/**
 * Script puntual de recuperación: regenera la etiqueta del colorway OP-28-26-1
 * (OD_ORDER_DETAIL id 23) borrada por error. Usa el servicio real para que
 * sGTIN / URL DPP / correlativos sean idénticos a los del sistema.
 */
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { OrderLabelService } from "../src/services/order-label.service.js";

// La conexión sale de DATABASE_URL (nunca credenciales en el código). Para
// apuntar a prod, exportá la URL de prod antes de correr el script, ej.:
//   DATABASE_URL="mysql://USER:PASS@HOST:PORT/DB" npx tsx scripts/restore-label-23.ts
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL es requerida (exportala antes de correr el script)");
const u = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: u.hostname,
  port: u.port ? parseInt(u.port, 10) : 3306,
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.replace(/^\//, ""),
  connectionLimit: 5,
  acquireTimeout: 60000,
  connectTimeout: 15000,
});
const prisma = new PrismaClient({ adapter });
const svc = new OrderLabelService(prisma);

const created = await svc.create({
  idDlkOrderHead: 2,
  idDlkDigitalIdentifier: 1, // IDE-1 (QR, Chaqueta)
  idDlkOrderDetail: 23, // colorway OP-28-26-1 NAVY PEONY
  codGtin: "07750549420014",
  identifierMaterial: "Polyester",
  identifierLocation: "Lado izquierdo del cuerpo (Chaqueta manga larga)",
  esSet: 0,
  codUsuarioCargaDl: "SYSTEM",
});

const details = await prisma.odOrderLabelDetail.findMany({
  where: { idDlkOrderLabelHead: created.idDlkOrderLabelHead },
  orderBy: { itemGlobal: "asc" },
});

console.log("=== LabelHead creada ===");
console.log("  id:", created.idDlkOrderLabelHead);
console.log("  GTIN:", created.codGtin, "| tipo:", created.identifierType);
console.log("  rango:", created.inicioSerializacion, "-", created.finSerializacion, "| total:", created.totalLabel);
console.log("=== Unidades serializadas:", details.length, "===");
const bySize: Record<string, number> = {};
for (const d of details) bySize[d.size ?? "(sin)"] = (bySize[d.size ?? "(sin)"] ?? 0) + 1;
console.log("  por talla:", bySize);
console.log("  primera:", details[0]?.sgtinFull, "|", details[0]?.urlDppFull);
console.log("  ultima :", details.at(-1)?.sgtinFull, "|", details.at(-1)?.urlDppFull);

await prisma.$disconnect();
