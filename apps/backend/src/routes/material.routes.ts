import { Router } from "express";
import type { MaterialService } from "../services/material.service.js";

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

export function materialRoutes(service: MaterialService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[materials:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const row = await service.getById(Number(req.params.id));
      if (!row) {
        return res.status(404).json({ error: "Material no encontrado", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[materials:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.idDlkSupplier || Number(req.body.idDlkSupplier) <= 0) {
        return res.status(400).json({ error: "Debes seleccionar el proveedor", type: "VALIDATION" });
      }
      const row = await service.create(req.body);
      res.status(201).json(row);
    } catch (e) {
      console.error("[materials:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const row = await service.update(Number(req.params.id), req.body);
      res.json(row);
    } catch (e) {
      console.error("[materials:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Material eliminado" });
    } catch (e) {
      console.error("[materials:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/template/download", (_req, res) => {
    try {
      const buf = service.buildTemplate();
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="plantilla_materiales.xlsx"');
      res.send(buf);
    } catch (e) {
      console.error("[materials:template]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/bulk-upload", async (req, res) => {
    try {
      const fileBase64 = req.body?.fileBase64;
      if (!fileBase64 || typeof fileBase64 !== "string") {
        return res.status(400).json({ error: "Falta fileBase64", type: "VALIDATION" });
      }
      const result = await service.bulkCreate(fileBase64);
      res.json(result);
    } catch (e) {
      console.error("[materials:bulk-upload]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
