import { Router } from "express";
import type { BrandService } from "../services/brand.service.js";

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

export function brandRoutes(service: BrandService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[brands:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const marca = await service.getById(Number(req.params.id));
      if (!marca) {
        return res.status(404).json({ error: "Marca no encontrada", type: "NOT_FOUND" });
      }
      res.json(marca);
    } catch (e) {
      console.error("[brands:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameBrand?.trim()) {
        return res.status(400).json({ error: "El nombre de la marca es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.idDlkParentCompany || !req.body.codParentCompany) {
        return res.status(400).json({ error: "Debes seleccionar la empresa", type: "VALIDATION" });
      }
      const marca = await service.create(req.body);
      res.status(201).json(marca);
    } catch (e) {
      console.error("[brands:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const marca = await service.update(Number(req.params.id), req.body);
      res.json(marca);
    } catch (e) {
      console.error("[brands:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Marca eliminada" });
    } catch (e) {
      console.error("[brands:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}

