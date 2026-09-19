import { Router, type Response } from "express";
import {
  CircularEconomyError,
  type CircularEconomyService,
} from "../services/circular-economy.service.js";
import { errorResponse } from "../lib/http-error.js";

/** Texto opcional del formulario: `undefined` = no tocar, "" = limpiar. */
function optionalText(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value);
}

export function circularEconomyRoutes(service: CircularEconomyService): Router {
  const router = Router();

  /** Traduce los errores de negocio antes de caer en el 500 genérico. */
  function sendError(res: Response, e: unknown, tag: string) {
    if (e instanceof CircularEconomyError) {
      return res.status(e.status).json({ error: e.message, type: e.code });
    }
    console.error(tag, e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }

  // GET /api/circular-economies → fichas cargadas, con su orden de pedido y marca.
  // La imagen viene como data URL porque la tabla la muestra como miniatura.
  router.get("/", async (_req, res) => {
    try {
      res.json(await service.list());
    } catch (e) {
      sendError(res, e, "[circular-economies:list]");
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
        return res.status(404).json({ error: "Economía circular no encontrada", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      sendError(res, e, "[circular-economies:getById]");
    }
  });

  // Descarga del informe (PDF) adjunto a la ficha.
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
      sendError(res, e, "[circular-economies:report]");
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
      const circularEconomy =
        typeof body.circularEconomy === "string" ? body.circularEconomy.trim() : "";
      if (!circularEconomy) {
        return res
          .status(400)
          .json({ error: "La economía circular es obligatoria", type: "VALIDATION" });
      }

      const created = await service.create({
        idDlkOrderDetail,
        circularEconomy,
        image: optionalText(body.image),
        imageBase64: typeof body.imageBase64 === "string" ? body.imageBase64 : undefined,
        description: optionalText(body.description),
        topic: optionalText(body.topic),
        content: optionalText(body.content),
        report: optionalText(body.report),
        reportFileBase64:
          typeof body.reportFileBase64 === "string" ? body.reportFileBase64 : undefined,
        stateCircularEconomy:
          body.stateCircularEconomy === undefined
            ? undefined
            : Number(body.stateCircularEconomy),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      res.status(201).json(created);
    } catch (e) {
      sendError(res, e, "[circular-economies:create]");
    }
  });

  // La orden de producción identifica la ficha: no se actualiza.
  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;

      const patch: Parameters<CircularEconomyService["update"]>[1] = {};

      if (body.circularEconomy !== undefined) {
        const circularEconomy = String(body.circularEconomy).trim();
        if (!circularEconomy) {
          return res
            .status(400)
            .json({ error: "La economía circular es obligatoria", type: "VALIDATION" });
        }
        patch.circularEconomy = circularEconomy;
      }
      if (body.description !== undefined) patch.description = optionalText(body.description);
      if (body.topic !== undefined) patch.topic = optionalText(body.topic);
      if (body.content !== undefined) patch.content = optionalText(body.content);
      if (body.image !== undefined) patch.image = optionalText(body.image);
      if (body.report !== undefined) patch.report = optionalText(body.report);
      if (body.stateCircularEconomy !== undefined) {
        patch.stateCircularEconomy = Number(body.stateCircularEconomy);
      }
      if (typeof body.imageBase64 === "string") patch.imageBase64 = body.imageBase64;
      if (typeof body.reportFileBase64 === "string") {
        patch.reportFileBase64 = body.reportFileBase64;
      }
      if (body.clearImage === true) patch.clearImage = true;
      if (body.clearReportFile === true) patch.clearReportFile = true;
      if (body.codUsuarioCargaDl != null) patch.codUsuarioCargaDl = String(body.codUsuarioCargaDl);

      const updated = await service.update(id, patch);
      if (!updated) {
        return res.status(404).json({ error: "Economía circular no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      sendError(res, e, "[circular-economies:update]");
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
      sendError(res, e, "[circular-economies:delete]");
    }
  });

  return router;
}
