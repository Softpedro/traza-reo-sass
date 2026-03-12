import { Router } from "express";
import type { ProcessService } from "../services/process.service.js";

function errorResponse(e: unknown) {
  const message = e instanceof Error ? e.message : "Error desconocido";
  const isPoolError = message.includes("pool timeout") || message.includes("connection");
  return {
    status: isPoolError ? 503 : 500,
    body: { error: message, type: isPoolError ? "DB_CONNECTION" : "INTERNAL" },
  };
}

export function processRoutes(service: ProcessService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[process:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) return res.status(404).json({ error: "Proceso no encontrado", type: "NOT_FOUND" });
      res.json(item);
    } catch (e) {
      console.error("[process:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameProcess?.trim()) {
        return res.status(400).json({ error: "El nombre del proceso es obligatorio", type: "VALIDATION" });
      }
      if (req.body.idDlkParentCompany == null || req.body.idDlkProductionChain == null) {
        return res.status(400).json({ error: "Empresa y Cadena de Producción son obligatorios", type: "VALIDATION" });
      }
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[process:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[process:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Proceso eliminado" });
    } catch (e) {
      console.error("[process:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
