import { Router } from "express";
import type { OutputActivitiesService } from "../services/output-activities.service.js";
import { errorResponse } from "../lib/http-error.js";

export function outputActivitiesRoutes(service: OutputActivitiesService): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const activityId = req.query.activityId;
      if (activityId == null) return res.status(400).json({ error: "activityId es requerido", type: "VALIDATION" });
      const list = await service.listByActivity(Number(activityId));
      res.json(list);
    } catch (e) {
      console.error("[output-activities:list]", e);
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
      console.error("[output-activities:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameOutputActivities?.trim())
        return res.status(400).json({ error: "El nombre del output es obligatorio", type: "VALIDATION" });
      if (req.body.idDlkActivities == null)
        return res.status(400).json({ error: "La actividad es obligatoria", type: "VALIDATION" });
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      console.error("[output-activities:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      res.json(item);
    } catch (e) {
      console.error("[output-activities:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Output eliminado" });
    } catch (e) {
      console.error("[output-activities:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
