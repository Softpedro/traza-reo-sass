import { Router } from "express";
import type { UnitTraceService } from "../services/unit-trace.service.js";

/**
 * Lectura del historial de trazabilidad unitaria (eventos por prenda).
 * Protegido por JWT (se monta dentro del guard de /api).
 */
export function unitTraceRoutes(service: UnitTraceService): Router {
  const router = Router();

  // GET /api/unit-traces?labelDetailId=N  |  ?sgtin=...  |  ?url=...
  router.get("/", async (req, res) => {
    try {
      const labelDetailId =
        req.query.labelDetailId !== undefined && req.query.labelDetailId !== ""
          ? Number(req.query.labelDetailId)
          : undefined;
      const sgtin = typeof req.query.sgtin === "string" ? req.query.sgtin.trim() : undefined;
      const url = typeof req.query.url === "string" ? req.query.url.trim() : undefined;

      if (labelDetailId === undefined && !sgtin && !url) {
        return res.status(400).json({
          error: "Indica labelDetailId, sgtin o url",
          type: "VALIDATION",
        });
      }
      if (labelDetailId !== undefined && !Number.isFinite(labelDetailId)) {
        return res.status(400).json({ error: "labelDetailId inválido", type: "VALIDATION" });
      }

      const unit = await service.getUnitWithTraces({ labelDetailId, sgtin, url });
      if (!unit) {
        return res.status(404).json({ error: "Prenda no encontrada", type: "NOT_FOUND" });
      }
      res.json(unit);
    } catch (e) {
      console.error("[unit-traces:list]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      const isPool = message.includes("pool timeout") || message.includes("connection");
      res
        .status(isPool ? 503 : 500)
        .json({ error: message, type: isPool ? "DB_CONNECTION" : "INTERNAL" });
    }
  });

  return router;
}
