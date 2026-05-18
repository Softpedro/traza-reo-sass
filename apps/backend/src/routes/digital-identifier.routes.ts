import { Router } from "express";
import type { DigitalIdentifierService } from "../services/digital-identifier.service.js";

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

function parseId(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function digitalIdentifierRoutes(service: DigitalIdentifierService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      res.json(await service.list());
    } catch (e) {
      console.error("[digital-identifiers:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const id = parseId(String(req.params.id));
      if (!id) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const row = await service.getById(id);
      if (!row) {
        return res
          .status(404)
          .json({ error: "Identificador digital no encontrado", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[digital-identifiers:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
    } catch (e) {
      console.error("[digital-identifiers:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const id = parseId(String(req.params.id));
      if (!id) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const updated = await service.update(id, req.body);
      res.json(updated);
    } catch (e) {
      console.error("[digital-identifiers:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = parseId(String(req.params.id));
      if (!id) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      await service.softDelete(id);
      res.json({ message: "Identificador digital eliminado" });
    } catch (e) {
      console.error("[digital-identifiers:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
