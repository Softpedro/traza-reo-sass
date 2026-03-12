import { Router } from "express";
import type { OutputProcessService } from "../services/output-process.service.js";

function errorResponse(e: unknown) {
  const message = e instanceof Error ? e.message : "Error desconocido";
  const isPoolError = message.includes("pool timeout") || message.includes("connection");
  return {
    status: isPoolError ? 503 : 500,
    body: { error: message, type: isPoolError ? "DB_CONNECTION" : "INTERNAL" },
  };
}

export function outputProcessRoutes(service: OutputProcessService): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const processId = req.query.processId;
      if (processId != null) {
        const list = await service.listByProcess(Number(processId));
        return res.json(list);
      }
      const list = await service.list();
      return res.json(list);
    } catch (e) {
      console.error("[output-process:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) return res.status(404).json({ error: "Output no encontrado", type: "NOT_FOUND" });
      res.json(item);
    } catch (e) {
      console.error("[output-process:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameOutputProcess?.trim()) {
        return res.status(400).json({ error: "El nombre del output es obligatorio", type: "VALIDATION" });
      }
      if (req.body.idDlkProcess == null) {
        return res.status(400).json({ error: "El proceso es obligatorio", type: "VALIDATION" });
      }
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[output-process:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[output-process:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Output eliminado" });
    } catch (e) {
      console.error("[output-process:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
