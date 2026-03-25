import { Router } from "express";
import { isMissingMdMaterialsTable, type MaterialService } from "../services/material.service.js";

const MISSING_MD_MATERIALS = {
  error:
    "La tabla MD_MATERIALS no existe en esta base de datos. Ejecuta en MariaDB/MySQL el archivo apps/backend/prisma/manual/20250328_md_material.sql (la tabla MD_SUPPLIER debe existir antes por la clave foránea).",
  type: "MISSING_TABLE" as const,
};

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
      if (isMissingMdMaterialsTable(e)) {
        return res.status(503).json(MISSING_MD_MATERIALS);
      }
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
      if (isMissingMdMaterialsTable(e)) {
        return res.status(503).json(MISSING_MD_MATERIALS);
      }
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameMaterial?.trim()) {
        return res.status(400).json({ error: "El nombre del material es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.idDlkSupplier || Number(req.body.idDlkSupplier) <= 0) {
        return res.status(400).json({ error: "Debes seleccionar el proveedor", type: "VALIDATION" });
      }
      const row = await service.create(req.body);
      res.status(201).json(row);
    } catch (e) {
      console.error("[materials:create]", e);
      if (isMissingMdMaterialsTable(e)) {
        return res.status(503).json(MISSING_MD_MATERIALS);
      }
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
      if (isMissingMdMaterialsTable(e)) {
        return res.status(503).json(MISSING_MD_MATERIALS);
      }
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
      if (isMissingMdMaterialsTable(e)) {
        return res.status(503).json(MISSING_MD_MATERIALS);
      }
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
