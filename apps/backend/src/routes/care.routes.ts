import { Router } from "express";
import type { CareService } from "../services/care.service.js";

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

export function careRoutes(service: CareService): Router {
  const router = Router();

  // GET /api/cares?modelId=N  → cuidados de un modelo
  router.get("/", async (req, res) => {
    try {
      const modelId = Number(req.query.modelId);
      if (!Number.isFinite(modelId) || modelId <= 0) {
        return res.status(400).json({ error: "modelId es obligatorio", type: "VALIDATION" });
      }
      const list = await service.listByModel(modelId);
      res.json(list);
    } catch (e) {
      console.error("[cares:list]", e);
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
      const item = await service.getById(id);
      if (!item) {
        return res.status(404).json({ error: "Cuidado no encontrado", type: "NOT_FOUND" });
      }
      res.json(item);
    } catch (e) {
      console.error("[cares:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const idDlkModel = Number(req.body.idDlkModel);
      if (!Number.isFinite(idDlkModel) || idDlkModel <= 0) {
        return res.status(400).json({ error: "Debes seleccionar un modelo", type: "VALIDATION" });
      }
      if (!req.body.nombCare?.trim()) {
        return res.status(400).json({ error: "El nombre del cuidado es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.carDescription?.trim()) {
        return res.status(400).json({ error: "La descripción del cuidado es obligatoria", type: "VALIDATION" });
      }
      const item = await service.create({ ...req.body, idDlkModel });
      res.status(201).json(item);
    } catch (e) {
      console.error("[cares:create]", e);
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
      const item = await service.update(id, req.body);
      res.json(item);
    } catch (e) {
      console.error("[cares:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      await service.softDelete(id);
      res.json({ message: "Cuidado eliminado" });
    } catch (e) {
      console.error("[cares:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
