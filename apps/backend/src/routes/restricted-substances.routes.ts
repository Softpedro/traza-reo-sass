import { Router, type Response } from "express";
import {
  RestrictedSubstancesError,
  type RestrictedSubstancesService,
} from "../services/restricted-substances.service.js";
import { errorResponse } from "../lib/http-error.js";

/** Texto opcional del formulario: `undefined` = no tocar, "" = limpiar. */
function optionalText(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value);
}

export function restrictedSubstancesRoutes(service: RestrictedSubstancesService): Router {
  const router = Router();

  /** Traduce los errores de negocio antes de caer en el 500 genérico. */
  function sendError(res: Response, e: unknown, tag: string) {
    if (e instanceof RestrictedSubstancesError) {
      return res.status(e.status).json({ error: e.message, type: e.code });
    }
    console.error(tag, e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }

  // GET /api/restricted-substances → fichas cargadas, con su orden de pedido y marca.
  router.get("/", async (_req, res) => {
    try {
      res.json(await service.list());
    } catch (e) {
      sendError(res, e, "[restricted-substances:list]");
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
        return res
          .status(404)
          .json({ error: "Sustancias restringidas no encontradas", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      sendError(res, e, "[restricted-substances:getById]");
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
      sendError(res, e, "[restricted-substances:report]");
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
      const restrictedSubstances =
        typeof body.restrictedSubstances === "string" ? body.restrictedSubstances.trim() : "";
      if (!restrictedSubstances) {
        return res
          .status(400)
          .json({ error: "Las sustancias restringidas son obligatorias", type: "VALIDATION" });
      }

      const created = await service.create({
        idDlkOrderDetail,
        restrictedSubstances,
        topic: optionalText(body.topic),
        content: optionalText(body.content),
        chemicalScope: optionalText(body.chemicalScope),
        report: optionalText(body.report),
        reportFileBase64:
          typeof body.reportFileBase64 === "string" ? body.reportFileBase64 : undefined,
        stateRestrictedSubstances:
          body.stateRestrictedSubstances === undefined
            ? undefined
            : Number(body.stateRestrictedSubstances),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      res.status(201).json(created);
    } catch (e) {
      sendError(res, e, "[restricted-substances:create]");
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

      const patch: Parameters<RestrictedSubstancesService["update"]>[1] = {};

      if (body.restrictedSubstances !== undefined) {
        const restrictedSubstances = String(body.restrictedSubstances).trim();
        if (!restrictedSubstances) {
          return res
            .status(400)
            .json({ error: "Las sustancias restringidas son obligatorias", type: "VALIDATION" });
        }
        patch.restrictedSubstances = restrictedSubstances;
      }
      if (body.topic !== undefined) patch.topic = optionalText(body.topic);
      if (body.content !== undefined) patch.content = optionalText(body.content);
      if (body.chemicalScope !== undefined) patch.chemicalScope = optionalText(body.chemicalScope);
      if (body.report !== undefined) patch.report = optionalText(body.report);
      if (body.stateRestrictedSubstances !== undefined) {
        patch.stateRestrictedSubstances = Number(body.stateRestrictedSubstances);
      }
      if (typeof body.reportFileBase64 === "string") {
        patch.reportFileBase64 = body.reportFileBase64;
      }
      if (body.clearReportFile === true) patch.clearReportFile = true;
      if (body.codUsuarioCargaDl != null) patch.codUsuarioCargaDl = String(body.codUsuarioCargaDl);

      const updated = await service.update(id, patch);
      if (!updated) {
        return res
          .status(404)
          .json({ error: "Sustancias restringidas no encontradas", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      sendError(res, e, "[restricted-substances:update]");
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
      sendError(res, e, "[restricted-substances:delete]");
    }
  });

  return router;
}
