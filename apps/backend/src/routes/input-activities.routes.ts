import { Router } from "express";
import type { InputActivitiesService } from "../services/input-activities.service.js";

function errorResponse(e: unknown) {
  const message = e instanceof Error ? e.message : "Error desconocido";
  const isPoolError = message.includes("pool timeout") || message.includes("connection");
  return { status: isPoolError ? 503 : 500, body: { error: message, type: isPoolError ? "DB_CONNECTION" : "INTERNAL" } };
}

export function inputActivitiesRoutes(service: InputActivitiesService): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const activityId = req.query.activityId;
      if (activityId == null) return res.status(400).json({ error: "activityId es requerido", type: "VALIDATION" });
      const list = await service.listByActivity(Number(activityId));
      res.json(list);
    } catch (e) {
      console.error("[input-activities:list]", e);
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
      console.error("[input-activities:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameInputActivities?.trim())
        return res.status(400).json({ error: "El nombre del input es obligatorio", type: "VALIDATION" });
      if (req.body.idDlkActivities == null)
        return res.status(400).json({ error: "La actividad es obligatoria", type: "VALIDATION" });
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[input-activities:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[input-activities:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Input eliminado" });
    } catch (e) {
      console.error("[input-activities:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
