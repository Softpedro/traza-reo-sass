import { Router } from "express";
import type { ModelService } from "../services/model.service.js";

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

export function modelRoutes(service: ModelService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[models:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Descarga de la ficha técnica (PDF) — antes de "/:id" no aplica, va con sufijo.
  router.get("/:id/ficha", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const ficha = await service.getFicha(id);
      if (!ficha) {
        return res.status(404).json({ error: "Ficha técnica no encontrada", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(ficha.filename)}"`
      );
      res.send(ficha.buffer);
    } catch (e) {
      console.error("[models:ficha]", e);
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
        return res.status(404).json({ error: "Modelo no encontrado", type: "NOT_FOUND" });
      }
      res.json(item);
    } catch (e) {
      console.error("[models:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const idDlkBrand = Number(req.body.idDlkBrand);
      if (!Number.isFinite(idDlkBrand) || idDlkBrand <= 0) {
        return res.status(400).json({ error: "Debes seleccionar la marca", type: "VALIDATION" });
      }
      if (!req.body.nameModel?.trim()) {
        return res.status(400).json({ error: "El nombre del modelo es obligatorio", type: "VALIDATION" });
      }
      const item = await service.create({ ...req.body, idDlkBrand });
      res.status(201).json(item);
    } catch (e) {
      console.error("[models:create]", e);
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
      console.error("[models:update]", e);
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
      res.json({ message: "Modelo eliminado" });
    } catch (e) {
      console.error("[models:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
