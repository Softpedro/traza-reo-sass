import { Router, type Response } from "express";
import {
  CarbonFootprintError,
  type CarbonFootprintService,
} from "../services/carbon-footprint.service.js";
import { errorResponse } from "../lib/http-error.js";

/** Número obligatorio y > 0 (peso y CO2 son DECIMAL NOT NULL). */
function parsePositiveNumber(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Checkbox "Valor estimado" → TINYINT 0/1. */
function parseFlag(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (value === true || value === 1 || value === "1" || value === "true") return 1;
  return 0;
}

export function carbonFootprintRoutes(service: CarbonFootprintService): Router {
  const router = Router();

  /** Traduce los errores de negocio antes de caer en el 500 genérico. */
  function sendError(res: Response, e: unknown, tag: string) {
    if (e instanceof CarbonFootprintError) {
      return res.status(e.status).json({ error: e.message, type: e.code });
    }
    console.error(tag, e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }

  // GET /api/carbon-footprints → huellas cargadas, con su orden de pedido y marca.
  router.get("/", async (_req, res) => {
    try {
      res.json(await service.list());
    } catch (e) {
      sendError(res, e, "[carbon-footprints:list]");
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const row = await service.getById(id);
      if (!row) {
        return res.status(404).json({ error: "Huella de CO2 no encontrada", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      sendError(res, e, "[carbon-footprints:getById]");
    }
  });

  // Descarga del informe (PDF) adjunto a la huella.
  router.get("/:id/report", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const file = await service.getReportFile(id);
      if (!file) {
        return res.status(404).json({ error: "Informe no encontrado", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(file.filename)}"`
      );
      res.send(file.buffer);
    } catch (e) {
      sendError(res, e, "[carbon-footprints:report]");
    }
  });

  router.post("/", async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;

      const idDlkOrderDetail = Number(body.idDlkOrderDetail);
      if (!Number.isFinite(idDlkOrderDetail) || idDlkOrderDetail <= 0) {
        return res
          .status(400)
          .json({ error: "Debes seleccionar la orden de producción", type: "VALIDATION" });
      }
      const size = typeof body.size === "string" ? body.size.trim() : "";
      if (!size) {
        return res.status(400).json({ error: "Debes seleccionar la talla", type: "VALIDATION" });
      }
      const weight = parsePositiveNumber(body.weight);
      if (weight == null) {
        return res
          .status(400)
          .json({ error: "El peso debe ser un número mayor a 0", type: "VALIDATION" });
      }
      const carbonFootprint = parsePositiveNumber(body.carbonFootprint);
      if (carbonFootprint == null) {
        return res
          .status(400)
          .json({ error: "El CO2 debe ser un número mayor a 0", type: "VALIDATION" });
      }
      const unitDescription =
        typeof body.unitDescription === "string" ? body.unitDescription.trim() : "";
      if (!unitDescription) {
        return res
          .status(400)
          .json({ error: "La unidad de medición es obligatoria", type: "VALIDATION" });
      }
      const scope = typeof body.scope === "string" ? body.scope.trim() : "";
      if (!scope) {
        return res.status(400).json({ error: "El alcance es obligatorio", type: "VALIDATION" });
      }

      const created = await service.create({
        idDlkOrderDetail,
        size,
        weight,
        carbonFootprint,
        estimatedValue: parseFlag(body.estimatedValue),
        unitDescription,
        scope,
        report: body.report != null ? String(body.report) : undefined,
        reportFileBase64:
          typeof body.reportFileBase64 === "string" ? body.reportFileBase64 : undefined,
        stateCarbonFootprint:
          body.stateCarbonFootprint === undefined
            ? undefined
            : Number(body.stateCarbonFootprint),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      res.status(201).json(created);
    } catch (e) {
      sendError(res, e, "[carbon-footprints:create]");
    }
  });

  // La orden de producción y la talla identifican la huella: no se actualizan.
  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;

      const patch: Parameters<CarbonFootprintService["update"]>[1] = {};

      if (body.weight !== undefined) {
        const weight = parsePositiveNumber(body.weight);
        if (weight == null) {
          return res
            .status(400)
            .json({ error: "El peso debe ser un número mayor a 0", type: "VALIDATION" });
        }
        patch.weight = weight;
      }
      if (body.carbonFootprint !== undefined) {
        const carbonFootprint = parsePositiveNumber(body.carbonFootprint);
        if (carbonFootprint == null) {
          return res
            .status(400)
            .json({ error: "El CO2 debe ser un número mayor a 0", type: "VALIDATION" });
        }
        patch.carbonFootprint = carbonFootprint;
      }
      if (body.unitDescription !== undefined) {
        const unitDescription = String(body.unitDescription).trim();
        if (!unitDescription) {
          return res
            .status(400)
            .json({ error: "La unidad de medición es obligatoria", type: "VALIDATION" });
        }
        patch.unitDescription = unitDescription;
      }
      if (body.scope !== undefined) {
        const scope = String(body.scope).trim();
        if (!scope) {
          return res.status(400).json({ error: "El alcance es obligatorio", type: "VALIDATION" });
        }
        patch.scope = scope;
      }
      if (body.estimatedValue !== undefined) patch.estimatedValue = parseFlag(body.estimatedValue);
      if (body.stateCarbonFootprint !== undefined) {
        patch.stateCarbonFootprint = Number(body.stateCarbonFootprint);
      }
      if (body.report !== undefined) patch.report = body.report == null ? null : String(body.report);
      if (typeof body.reportFileBase64 === "string") {
        patch.reportFileBase64 = body.reportFileBase64;
      }
      if (body.clearReportFile === true) patch.clearReportFile = true;
      if (body.codUsuarioCargaDl != null) patch.codUsuarioCargaDl = String(body.codUsuarioCargaDl);

      const updated = await service.update(id, patch);
      if (!updated) {
        return res.status(404).json({ error: "Huella de CO2 no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      sendError(res, e, "[carbon-footprints:update]");
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      await service.softDelete(id);
      res.status(204).send();
    } catch (e) {
      sendError(res, e, "[carbon-footprints:delete]");
    }
  });

  return router;
}
