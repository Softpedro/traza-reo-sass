import { Router } from "express";
import type { MaquilaService } from "../services/maquila.service.js";
import { errorResponse } from "../lib/http-error.js";

export function maquilaRoutes(service: MaquilaService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[maquila:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const maquila = await service.getById(Number(req.params.id));
      if (!maquila) {
        return res.status(404).json({ error: "Maquila no encontrada", type: "NOT_FOUND" });
      }
      res.json(maquila);
    } catch (e) {
      console.error("[maquila:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameMaquila?.trim()) {
        return res.status(400).json({ error: "El nombre de la maquila es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.numRucMaquila?.trim()) {
        return res.status(400).json({ error: "El RUC es obligatorio", type: "VALIDATION" });
      }
      const maquila = await service.create(req.body);
      res.status(201).json(maquila);
    } catch (e) {
      console.error("[maquila:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const maquila = await service.update(Number(req.params.id), req.body);
      res.json(maquila);
    } catch (e) {
      console.error("[maquila:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Maquila eliminada" });
    } catch (e) {
      console.error("[maquila:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}

