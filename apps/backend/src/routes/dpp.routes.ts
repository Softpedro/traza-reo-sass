import { Router } from "express";
import type { PrismaClient } from "../../generated/prisma/client.js";
import type { UnitTraceService } from "../services/unit-trace.service.js";
import { apiKeyMiddleware, type ApiClientRequest } from "../middleware/api-key.middleware.js";

// Dominios DPP permitidos para la ingesta de escaneos. Configurable por env
// (DPP_ALLOWED_HOSTS, hosts separados por coma) para no tocar código al cambiar
// de dominio. El default incluye el dominio actual y el anterior (transición).
const DPP_ALLOWED_HOSTS = (
  process.env.DPP_ALLOWED_HOSTS ?? "dpp.kusacotton.com,dpp.qapary.com"
)
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

/** true si la URL es http(s) y su host está en la lista de dominios DPP permitidos. */
function isAllowedDppUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    return DPP_ALLOWED_HOSTS.includes(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Endpoints de ingesta DPP (máquina-a-máquina), protegidos por API Key (X-API-Key).
 * Montar FUERA del guard JWT.
 */
export function dppRoutes(service: UnitTraceService, prisma: PrismaClient): Router {
  const router = Router();
  router.use(apiKeyMiddleware(prisma));

  // Registra un escaneo de etiqueta DPP por un lector externo.
  router.post("/scan", async (req: ApiClientRequest, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const url = typeof body.url === "string" ? body.url.trim() : "";
      if (!url) {
        return res.status(400).json({ error: "url es obligatoria", type: "VALIDATION" });
      }
      if (!isAllowedDppUrl(url)) {
        return res
          .status(422)
          .json({ error: "La URL no corresponde al dominio DPP", type: "VALIDATION" });
      }
      const phase = typeof body.phase === "string" ? body.phase.trim().toLowerCase() : "";
      if (phase !== "inicio" && phase !== "fin") {
        return res
          .status(400)
          .json({ error: 'phase es obligatoria y debe ser "inicio" o "fin"', type: "VALIDATION" });
      }
      const result = await service.ingestScan({
        url,
        phase,
        scannedAt: typeof body.scannedAt === "string" ? body.scannedAt : null,
        typeEvent: typeof body.typeEvent === "string" ? body.typeEvent : null,
        idItemUnicoIot:
          typeof body.deviceId === "string"
            ? body.deviceId
            : typeof body.idItemUnicoIot === "string"
              ? body.idItemUnicoIot
              : null,
        observation: typeof body.observation === "string" ? body.observation : null,
        codUsuario: req.apiClient?.nameApiClient ?? "API_DPP",
      });
      if ("notFound" in result) {
        return res
          .status(404)
          .json({ error: "Prenda no encontrada para esa URL", type: "NOT_FOUND" });
      }
      res.status(201).json({ ok: true });
    } catch (e) {
      console.error("[dpp:scan]", e);
      res.status(500).json({ error: "Error interno", type: "INTERNAL" });
    }
  });

  return router;
}
