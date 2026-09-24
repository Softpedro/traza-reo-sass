import { Router, type Response } from "express";
import {
  UncontrolledLayersError,
  isTier,
  type Tier,
  type UncontrolledLayersService,
} from "../services/uncontrolled-layers.service.js";
import { errorResponse } from "../lib/http-error.js";

/** Texto opcional del formulario: `undefined` = no tocar, "" = limpiar. */
function optionalText(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value);
}

/** Fecha `YYYY-MM-DD` del input date: `undefined` = no tocar, "" / null = limpiar. */
function optionalDate(value: unknown, label: string): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const text = String(value);
  const date = new Date(`${text}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(date.getTime())) {
    throw new UncontrolledLayersError("VALIDATION", `${label}: fecha inválida`);
  }
  return date;
}

function parseTier(value: unknown): Tier {
  const n = Number(value);
  if (!isTier(n)) {
    throw new UncontrolledLayersError("VALIDATION", "Tier inválido: debe ser 2, 3 o 4");
  }
  return n;
}

/** Campos comunes a crear y actualizar; los ausentes quedan en `undefined`. */
function parseFields(body: Record<string, unknown>) {
  const fields = {
    product: optionalText(body.product),
    supplier: optionalText(body.supplier),
    origin: optionalText(body.origin),
    certificate: optionalText(body.certificate),
    transmitter: optionalText(body.transmitter),
    certificateNumber: optionalText(body.certificateNumber),
    dateOfIssue: optionalDate(body.dateOfIssue, "Fecha de expedición"),
    expirationDate: optionalDate(body.expirationDate, "Fecha de caducidad"),
    startDate: optionalDate(body.startDate, "Fecha de inicio"),
    endDate: optionalDate(body.endDate, "Fecha de término"),
    certificateSheetBase64:
      typeof body.certificateSheetBase64 === "string" ? body.certificateSheetBase64 : undefined,
    stateUncontrolledLayers:
      body.stateUncontrolledLayers === undefined
        ? undefined
        : Number(body.stateUncontrolledLayers),
    codUsuarioCargaDl:
      body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
  };
  if (fields.dateOfIssue && fields.expirationDate && fields.expirationDate < fields.dateOfIssue) {
    throw new UncontrolledLayersError(
      "VALIDATION",
      "La fecha de caducidad no puede ser anterior a la de expedición"
    );
  }
  if (fields.startDate && fields.endDate && fields.endDate < fields.startDate) {
    throw new UncontrolledLayersError(
      "VALIDATION",
      "La fecha de término no puede ser anterior a la de inicio"
    );
  }
  return fields;
}

export function uncontrolledLayersRoutes(service: UncontrolledLayersService): Router {
  const router = Router();

  /** Traduce los errores de negocio antes de caer en el 500 genérico. */
  function sendError(res: Response, e: unknown, tag: string) {
    if (e instanceof UncontrolledLayersError) {
      return res.status(e.status).json({ error: e.message, type: e.code });
    }
    console.error(tag, e);
    const err = errorResponse(e);
    res.status(err.status).json(err.body);
  }

  // GET /api/uncontrolled-layers?tier=2 → registros del tier, con su orden y marca.
  router.get("/", async (req, res) => {
    try {
      res.json(await service.list(parseTier(req.query.tier)));
    } catch (e) {
      sendError(res, e, "[uncontrolled-layers:list]");
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
        return res.status(404).json({ error: "Registro no encontrado", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      sendError(res, e, "[uncontrolled-layers:getById]");
    }
  });

  // Descarga del certificado (PDF) adjunto.
  router.get("/:id/certificate", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const file = await service.getCertificateSheet(id);
      if (!file) {
        return res.status(404).json({ error: "Certificado no encontrado", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(file.filename)}"`
      );
      res.send(file.buffer);
    } catch (e) {
      sendError(res, e, "[uncontrolled-layers:certificate]");
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

      const created = await service.create({
        idDlkOrderDetail,
        tier: parseTier(body.tier),
        service: body.service == null || body.service === "" ? null : Number(body.service),
        ...parseFields(body),
      });
      res.status(201).json(created);
    } catch (e) {
      sendError(res, e, "[uncontrolled-layers:create]");
    }
  });

  // La OP, el tier y el servicio identifican el registro: no se actualizan.
  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;

      const updated = await service.update(id, {
        ...parseFields(body),
        clearCertificateSheet: body.clearCertificateSheet === true,
      });
      if (!updated) {
        return res.status(404).json({ error: "Registro no encontrado", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      sendError(res, e, "[uncontrolled-layers:update]");
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const deleted = await service.softDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: "Registro no encontrado", type: "NOT_FOUND" });
      }
      res.status(204).send();
    } catch (e) {
      sendError(res, e, "[uncontrolled-layers:delete]");
    }
  });

  return router;
}
