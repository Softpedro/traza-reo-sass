import { Router } from "express";
import type { OrderHeadService } from "../services/order-head.service.js";

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

/** Acepta cuerpo nuevo (`fecEntry`) o legado (`fecEntryDate`) por compatibilidad. */
function pickFecEntry(body: Record<string, unknown>): string | null | undefined {
  if (body.fecEntry !== undefined) return body.fecEntry as string | null;
  if (body.fecEntryDate !== undefined) return body.fecEntryDate as string | null;
  return undefined;
}

function pickDateProbableDespatch(body: Record<string, unknown>): string | null | undefined {
  if (body.dateProbableDespatch !== undefined) return body.dateProbableDespatch as string | null;
  if (body.dateProbableDespatchDate !== undefined) {
    return body.dateProbableDespatchDate as string | null;
  }
  return undefined;
}

export function orderHeadRoutes(service: OrderHeadService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[order-heads:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/file", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const file = await service.getArchivo(id);
      if (!file) {
        return res.status(404).json({ error: "Archivo no encontrado", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.filename)}"`);
      res.send(file.buffer);
    } catch (e) {
      console.error("[order-heads:file]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/details/:detailId/image", async (req, res) => {
    try {
      const headId = Number(req.params.id);
      const detailId = Number(req.params.detailId);
      if (!Number.isFinite(headId) || !Number.isFinite(detailId)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const img = await service.getDetailImage(headId, detailId);
      if (!img) {
        return res.status(404).json({ error: "Imagen no encontrada", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", img.contentType);
      res.setHeader("Cache-Control", "private, max-age=86400");
      res.send(img.buffer);
    } catch (e) {
      console.error("[order-heads:detail-image]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/details", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const rows = await service.listDetailsByHeadId(id);
      if (rows === null) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(rows);
    } catch (e) {
      console.error("[order-heads:details]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
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
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[order-heads:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const idBrand = Number(req.body.idDlkBrand);
      if (!req.body.codOrderHead?.trim()) {
        return res.status(400).json({ error: "El código de orden es obligatorio", type: "VALIDATION" });
      }
      if (!Number.isFinite(idBrand) || idBrand <= 0) {
        return res.status(400).json({ error: "Debes seleccionar una marca", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const created = await service.create({
        idDlkBrand: idBrand,
        codOrderHead: String(req.body.codOrderHead),
        quantityOrderHead:
          req.body.quantityOrderHead === undefined || req.body.quantityOrderHead === ""
            ? null
            : Number(req.body.quantityOrderHead),
        fecEntry: pickFecEntry(body) ?? null,
        dateProbableDespatch: pickDateProbableDespatch(body) ?? null,
        stageOrderHead:
          req.body.stageOrderHead === undefined || req.body.stageOrderHead === ""
            ? undefined
            : Number(req.body.stageOrderHead),
        statusStageOrderHead:
          req.body.statusStageOrderHead === undefined || req.body.statusStageOrderHead === ""
            ? undefined
            : Number(req.body.statusStageOrderHead),
        archivoBase64: req.body.archivoBase64 ?? null,
        archivoNombre:
          req.body.archivoNombre != null && String(req.body.archivoNombre).trim()
            ? String(req.body.archivoNombre).trim()
            : null,
        codUsuarioCargaDl: req.body.codUsuarioCargaDl,
      });
      res.status(201).json(created);
    } catch (e) {
      console.error("[order-heads:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const fec = pickFecEntry(body);
      const dpd = pickDateProbableDespatch(body);
      const updated = await service.update(id, {
        ...(body.codOrderHead !== undefined && { codOrderHead: String(body.codOrderHead) }),
        ...(body.idDlkBrand !== undefined && { idDlkBrand: Number(body.idDlkBrand) }),
        ...(body.quantityOrderHead !== undefined && {
          quantityOrderHead:
            body.quantityOrderHead === "" || body.quantityOrderHead === null
              ? null
              : Number(body.quantityOrderHead),
        }),
        ...(fec !== undefined && { fecEntry: fec }),
        ...(dpd !== undefined && { dateProbableDespatch: dpd }),
        ...(body.stageOrderHead !== undefined && {
          stageOrderHead:
            body.stageOrderHead === "" || body.stageOrderHead === null
              ? null
              : Number(body.stageOrderHead),
        }),
        ...(body.statusStageOrderHead !== undefined && {
          statusStageOrderHead:
            body.statusStageOrderHead === "" || body.statusStageOrderHead === null
              ? null
              : Number(body.statusStageOrderHead),
        }),
        ...(body.flgStatutActif !== undefined && {
          flgStatutActif:
            body.flgStatutActif === "" || body.flgStatutActif === null
              ? null
              : Number(body.flgStatutActif),
        }),
        ...(body.archivoBase64 !== undefined && { archivoBase64: body.archivoBase64 as string | null }),
        ...(body.clearArchivo === true && { clearArchivo: true }),
        ...(body.codUsuarioCargaDl !== undefined && {
          codUsuarioCargaDl: String(body.codUsuarioCargaDl),
        }),
      });
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
