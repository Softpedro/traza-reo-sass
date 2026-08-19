import { Router } from "express";
import type { InputProcessService } from "../services/input-process.service.js";
import { errorResponse } from "../lib/http-error.js";

export function inputProcessRoutes(service: InputProcessService): Router {
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
      console.error("[input-process:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) return res.status(404).json({ error: "Input no encontrado", type: "NOT_FOUND" });
      res.json(item);
    } catch (e) {
      console.error("[input-process:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameInputProcess?.trim()) {
        return res.status(400).json({ error: "El nombre del input es obligatorio", type: "VALIDATION" });
      }
      if (req.body.idDlkProcess == null) {
        return res.status(400).json({ error: "El proceso es obligatorio", type: "VALIDATION" });
      }
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[input-process:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[input-process:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Input eliminado" });
    } catch (e) {
      console.error("[input-process:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
