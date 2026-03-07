import { Router } from "express";
import type { FacilityMaquilaService } from "../services/facility-maquila.service.js";

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

export function facilityMaquilaRoutes(service: FacilityMaquilaService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[facility-maquila:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) {
        return res.status(404).json({ error: "Fábrica de Maquila no encontrada", type: "NOT_FOUND" });
      }
      res.json(item);
    } catch (e) {
      console.error("[facility-maquila:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameFacilityMaquila?.trim()) {
        return res.status(400).json({ error: "El nombre de la fábrica es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.idDlkMaquila || !req.body.codMaquila) {
        return res.status(400).json({ error: "Debe seleccionar la maquila", type: "VALIDATION" });
      }
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[facility-maquila:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[facility-maquila:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Fábrica de Maquila eliminada" });
    } catch (e) {
      console.error("[facility-maquila:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}

