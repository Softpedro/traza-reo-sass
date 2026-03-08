import { Router } from "express";
import type { ProductionChainService } from "../services/production-chain.service.js";

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

export function productionChainRoutes(service: ProductionChainService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[production-chain:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) return res.status(404).json({ error: "Eslabón no encontrado", type: "NOT_FOUND" });
      res.json(item);
    } catch (e) {
      console.error("[production-chain:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameProductionChain?.trim()) {
        return res.status(400).json({ error: "El nombre del eslabón es obligatorio", type: "VALIDATION" });
      }
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[production-chain:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[production-chain:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Eslabón eliminado" });
    } catch (e) {
      console.error("[production-chain:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
