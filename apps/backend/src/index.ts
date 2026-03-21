import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { ParentCompanyService } from "./services/parent-company.service.js";
import { parentCompanyRoutes } from "./routes/parent-company.routes.js";
import { FacilityService } from "./services/facility.service.js";
import { facilityRoutes } from "./routes/facility.routes.js";
import { MaquilaService } from "./services/maquila.service.js";
import { maquilaRoutes } from "./routes/maquila.routes.js";
import { FacilityMaquilaService } from "./services/facility-maquila.service.js";
import { facilityMaquilaRoutes } from "./routes/facility-maquila.routes.js";
import { BrandService } from "./services/brand.service.js";
import { brandRoutes } from "./routes/brand.routes.js";
import { SubbrandService } from "./services/subbrand.service.js";
import { subbrandRoutes } from "./routes/subbrand.routes.js";
import { UserReoService } from "./services/user-reo.service.js";
import { userReoRoutes } from "./routes/user-reo.routes.js";
import { ProductionChainService } from "./services/production-chain.service.js";
import { productionChainRoutes } from "./routes/production-chain.routes.js";
import { ProcessService } from "./services/process.service.js";
import { processRoutes } from "./routes/process.routes.js";
import { InputProcessService } from "./services/input-process.service.js";
import { inputProcessRoutes } from "./routes/input-process.routes.js";
import { OutputProcessService } from "./services/output-process.service.js";
import { outputProcessRoutes } from "./routes/output-process.routes.js";
import { ProcedureProcessService } from "./services/procedure-process.service.js";
import { procedureProcessRoutes } from "./routes/procedure-process.routes.js";
import { SubprocessService } from "./services/subprocess.service.js";
import { subprocessRoutes } from "./routes/subprocess.routes.js";
import { ProcedureSubprocessService } from "./services/procedure-subprocess.service.js";
import { procedureSubprocessRoutes } from "./routes/procedure-subprocess.routes.js";
import { InputSubprocessService } from "./services/input-subprocess.service.js";
import { inputSubprocessRoutes } from "./routes/input-subprocess.routes.js";
import { OutputSubprocessService } from "./services/output-subprocess.service.js";
import { outputSubprocessRoutes } from "./routes/output-subprocess.routes.js";
import { ActivityService } from "./services/activity.service.js";
import { activityRoutes } from "./routes/activity.routes.js";
import { ProcedureActivitiesService } from "./services/procedure-activities.service.js";
import { procedureActivitiesRoutes } from "./routes/procedure-activities.routes.js";
import { InputActivitiesService } from "./services/input-activities.service.js";
import { inputActivitiesRoutes } from "./routes/input-activities.routes.js";
import { OutputActivitiesService } from "./services/output-activities.service.js";
import { outputActivitiesRoutes } from "./routes/output-activities.routes.js";

function parseDatabaseUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, "") || "traza",
  };
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is required");
const dbConfig = parseDatabaseUrl(dbUrl);

console.log(`[DB] Conectando a ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} como ${dbConfig.user}`);

const adapter = new PrismaMariaDb({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: 5,
  acquireTimeout: 60000,
  connectTimeout: 15000,
});
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT ?? 4000;

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === corsOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// Logos/fotos en base64 superan el límite por defecto (~100kb) y provocan 413 Payload Too Large
const jsonBodyLimit = process.env.JSON_BODY_LIMIT ?? "15mb";
app.use(express.json({ limit: jsonBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: jsonBodyLimit }));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    res.json({ status: "ok", service: "backend", db: "connected" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    res.status(503).json({ status: "error", service: "backend", db: msg });
  }
});

// ── Servicios ────────────────────────────────────────────────────────
const parentCompanyService = new ParentCompanyService(prisma);
const facilityService = new FacilityService(prisma);
const maquilaService = new MaquilaService(prisma);
const facilityMaquilaService = new FacilityMaquilaService(prisma);
const brandService = new BrandService(prisma);
const subbrandService = new SubbrandService(prisma);
const userReoService = new UserReoService(prisma);
const productionChainService = new ProductionChainService(prisma);
const processService = new ProcessService(prisma);
const inputProcessService = new InputProcessService(prisma);
const outputProcessService = new OutputProcessService(prisma);
const procedureProcessService = new ProcedureProcessService(prisma);
const subprocessService = new SubprocessService(prisma);
const procedureSubprocessService = new ProcedureSubprocessService(prisma);
const inputSubprocessService = new InputSubprocessService(prisma);
const outputSubprocessService = new OutputSubprocessService(prisma);
const activityService = new ActivityService(prisma);
const procedureActivitiesService = new ProcedureActivitiesService(prisma);
const inputActivitiesService = new InputActivitiesService(prisma);
const outputActivitiesService = new OutputActivitiesService(prisma);

// ── Rutas ────────────────────────────────────────────────────────────
app.use("/api/parent-companies", parentCompanyRoutes(parentCompanyService));
app.use("/api/facilities", facilityRoutes(facilityService));
app.use("/api/maquilas", maquilaRoutes(maquilaService));
app.use("/api/facilities-maquila", facilityMaquilaRoutes(facilityMaquilaService));
app.use("/api/brands", brandRoutes(brandService));
app.use("/api/subbrands", subbrandRoutes(subbrandService));
app.use("/api/users", userReoRoutes(userReoService));
app.use("/api/production-chains", productionChainRoutes(productionChainService));
app.use("/api/processes", processRoutes(processService));
app.use("/api/input-processes", inputProcessRoutes(inputProcessService));
app.use("/api/output-processes", outputProcessRoutes(outputProcessService));
app.use("/api/procedure-processes", procedureProcessRoutes(procedureProcessService));
app.use("/api/subprocesses", subprocessRoutes(subprocessService));
app.use("/api/procedure-subprocesses", procedureSubprocessRoutes(procedureSubprocessService));
app.use("/api/input-subprocesses", inputSubprocessRoutes(inputSubprocessService));
app.use("/api/output-subprocesses", outputSubprocessRoutes(outputSubprocessService));
app.use("/api/activities", activityRoutes(activityService));
app.use("/api/procedure-activities", procedureActivitiesRoutes(procedureActivitiesService));
app.use("/api/input-activities", inputActivitiesRoutes(inputActivitiesService));
app.use("/api/output-activities", outputActivitiesRoutes(outputActivitiesService));

// ── Ubigeo ───────────────────────────────────────────────────────────

// ── Helper de errores ─────────────────────────────────────────────
function errorResponse(e: unknown) {
  const message = e instanceof Error ? e.message : "Error desconocido";
  const isPoolError = message.includes("pool timeout") || message.includes("connection");
  return {
    status: isPoolError ? 503 : 500,
    body: {
      error: message,
      type: isPoolError ? "DB_CONNECTION" : "INTERNAL",
    },
  };
}

app.get("/api/ubigeo", async (req, res) => {
  try {
    // Sin `limit` (o limit=all): devuelve todo el maestro (~1.9k filas Perú).
    // Con limit=N: paginación opcional (máx. 25000). Antes el tope 500 ocultaba departamentos.
    const raw = req.query.limit;
    const wantAll =
      raw === undefined || raw === "" || String(raw).toLowerCase() === "all";
    const parsedNum = wantAll ? NaN : Number(raw);
    const take =
      wantAll || !Number.isFinite(parsedNum) || parsedNum <= 0
        ? undefined
        : Math.min(parsedNum, 25000);

    const list = await prisma.mdUbigeo.findMany({
      ...(take !== undefined ? { take } : {}),
      orderBy: { codUbigeo: "asc" },
    });
    res.json(list);
  } catch (e) {
    console.error("[ubigeo:list]", e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }
});

// ── Ordenes de Pedido ──────────────────────────────────────────────

app.get("/api/ordenes", async (_req, res) => {
  try {
    const list = await prisma.mdOrdenPedido.findMany({
      where: { flgStatutActif: 1 },
      include: { parentCompany: { select: { nameParentCompany: true } } },
      orderBy: { idDlkOrdenPedido: "desc" },
    });
    res.json(list);
  } catch (e) {
    console.error("[ordenes:list]", e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }
});

app.get("/api/ordenes/:id", async (req, res) => {
  try {
    const orden = await prisma.mdOrdenPedido.findUnique({
      where: { idDlkOrdenPedido: Number(req.params.id) },
      include: { parentCompany: { select: { nameParentCompany: true } } },
    });
    if (!orden) return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
    res.json(orden);
  } catch (e) {
    console.error("[ordenes:getById]", e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }
});

app.post("/api/ordenes", async (req, res) => {
  try {
    const {
      codOrdenPedido,
      idDlkParentCompany,
      cantidad,
      fechaIngreso,
      probableDespacho,
      etapa,
      estado,
    } = req.body;

    const orden = await prisma.mdOrdenPedido.create({
      data: {
        codOrdenPedido,
        idDlkParentCompany,
        cantidad,
        fechaIngreso: new Date(fechaIngreso),
        probableDespacho: new Date(probableDespacho),
        etapa,
        estado,
        codUsuarioCargaDl: "SYSTEM",
        desAccion: "INSERT",
      },
    });
    res.status(201).json(orden);
  } catch (e) {
    console.error("[ordenes:create]", e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }
});

app.put("/api/ordenes/:id", async (req, res) => {
  try {
    const { codOrdenPedido, idDlkParentCompany, cantidad, fechaIngreso, probableDespacho, etapa, estado } = req.body;

    const orden = await prisma.mdOrdenPedido.update({
      where: { idDlkOrdenPedido: Number(req.params.id) },
      data: {
        ...(codOrdenPedido !== undefined && { codOrdenPedido }),
        ...(idDlkParentCompany !== undefined && { idDlkParentCompany }),
        ...(cantidad !== undefined && { cantidad }),
        ...(fechaIngreso !== undefined && { fechaIngreso: new Date(fechaIngreso) }),
        ...(probableDespacho !== undefined && { probableDespacho: new Date(probableDespacho) }),
        ...(etapa !== undefined && { etapa }),
        ...(estado !== undefined && { estado }),
        desAccion: "UPDATE",
      },
    });
    res.json(orden);
  } catch (e) {
    console.error("[ordenes:update]", e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }
});

app.delete("/api/ordenes/:id", async (req, res) => {
  try {
    await prisma.mdOrdenPedido.update({
      where: { idDlkOrdenPedido: Number(req.params.id) },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
    res.json({ message: "Orden eliminada" });
  } catch (e) {
    console.error("[ordenes:delete]", e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }
});

// ── Levantar servidor inmediatamente, luego verificar DB ─────────
app.listen(Number(PORT), "0.0.0.0", () => {

  prisma.$queryRawUnsafe("SELECT 1")
    .then(() => console.log("[DB] Conexión verificada correctamente"))
    .catch((e) => {
      console.error("[DB] ERROR: No se pudo conectar a la base de datos:", e instanceof Error ? e.message : e);
      console.error("[DB] Verifica que MariaDB esté corriendo en", `${dbConfig.host}:${dbConfig.port}`);
    });
});
