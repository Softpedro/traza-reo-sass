import { Router, type Response } from "express";
import {
  SocialImpactError,
  type SocialImpactService,
} from "../services/social-impact.service.js";
import { errorResponse } from "../lib/http-error.js";

/** Texto opcional del formulario: `undefined` = no tocar, "" = limpiar. */
function optionalText(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value);
}

/** Campos de texto libres de la ficha, tal como los nombra el formulario. */
const TEXT_FIELDS = [
  "femaleWorkforce",
  "leadership",
  "workingConditions",
  "commitmentOit",
  "scope",
  "referenceStandard",
] as const;

export function socialImpactRoutes(service: SocialImpactService): Router {
  const router = Router();

  /** Traduce los errores de negocio antes de caer en el 500 genérico. */
  function sendError(res: Response, e: unknown, tag: string) {
    if (e instanceof SocialImpactError) {
      return res.status(e.status).json({ error: e.message, type: e.code });
    }
    console.error(tag, e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }

  // GET /api/social-impacts → fichas cargadas, con su marca.
  router.get("/", async (_req, res) => {
    try {
      res.json(await service.list());
    } catch (e) {
      sendError(res, e, "[social-impacts:list]");
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
        return res.status(404).json({ error: "Impacto social no encontrado", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      sendError(res, e, "[social-impacts:getById]");
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
      sendError(res, e, "[social-impacts:report]");
    }
  });

  router.post("/", async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;

      const idDlkBrand = Number(body.idDlkBrand);
      if (!Number.isFinite(idDlkBrand) || idDlkBrand <= 0) {
        return res
          .status(400)
          .json({ error: "Debes seleccionar la marca", type: "VALIDATION" });
      }
      const socialImpact =
        typeof body.socialImpact === "string" ? body.socialImpact.trim() : "";
      if (!socialImpact) {
        return res
          .status(400)
          .json({ error: "El impacto social es obligatorio", type: "VALIDATION" });
      }

      const created = await service.create({
        idDlkBrand,
        socialImpact,
        femaleWorkforce: optionalText(body.femaleWorkforce),
        leadership: optionalText(body.leadership),
        workingConditions: optionalText(body.workingConditions),
        commitmentOit: optionalText(body.commitmentOit),
        scope: optionalText(body.scope),
        referenceStandard: optionalText(body.referenceStandard),
        report: optionalText(body.report),
        reportFileBase64:
          typeof body.reportFileBase64 === "string" ? body.reportFileBase64 : undefined,
        stateSocialImpact:
          body.stateSocialImpact === undefined ? undefined : Number(body.stateSocialImpact),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      res.status(201).json(created);
    } catch (e) {
      sendError(res, e, "[social-impacts:create]");
    }
  });

  // La marca identifica la ficha: no se actualiza.
  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;

      const patch: Parameters<SocialImpactService["update"]>[1] = {};

      if (body.socialImpact !== undefined) {
        const socialImpact = String(body.socialImpact).trim();
        if (!socialImpact) {
          return res
            .status(400)
            .json({ error: "El impacto social es obligatorio", type: "VALIDATION" });
        }
        patch.socialImpact = socialImpact;
      }
      for (const f of TEXT_FIELDS) {
        if (body[f] !== undefined) patch[f] = optionalText(body[f]);
      }
      if (body.report !== undefined) patch.report = optionalText(body.report);
      if (body.stateSocialImpact !== undefined) {
        patch.stateSocialImpact = Number(body.stateSocialImpact);
      }
      if (typeof body.reportFileBase64 === "string") {
        patch.reportFileBase64 = body.reportFileBase64;
      }
      if (body.clearReportFile === true) patch.clearReportFile = true;
      if (body.codUsuarioCargaDl != null) patch.codUsuarioCargaDl = String(body.codUsuarioCargaDl);

      const updated = await service.update(id, patch);
      if (!updated) {
        return res.status(404).json({ error: "Impacto social no encontrado", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      sendError(res, e, "[social-impacts:update]");
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
      sendError(res, e, "[social-impacts:delete]");
    }
  });

  return router;
}
