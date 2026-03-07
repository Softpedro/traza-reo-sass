import { Router } from "express";
import type { FacilityService } from "../services/facility.service.js";

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

export function facilityRoutes(service: FacilityService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[facility:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const fabrica = await service.getById(Number(req.params.id));
      if (!fabrica) {
        return res.status(404).json({ error: "Fábrica no encontrada", type: "NOT_FOUND" });
      }
      res.json(fabrica);
    } catch (e) {
      console.error("[facility:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameFacility?.trim()) {
        return res.status(400).json({ error: "El nombre de la fábrica es obligatorio", type: "VALIDATION" });
      }
      const fabrica = await service.create(req.body);
      res.status(201).json(fabrica);
    } catch (e) {
      console.error("[facility:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const fabrica = await service.update(Number(req.params.id), req.body);
      res.json(fabrica);
    } catch (e) {
      console.error("[facility:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Fábrica eliminada" });
    } catch (e) {
      console.error("[facility:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}

