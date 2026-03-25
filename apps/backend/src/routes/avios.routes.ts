import { Router } from "express";
import { isMissingMdAviosTable, type AviosService } from "../services/avios.service.js";

const MISSING_MD_AVIOS = {
  error:
    "La tabla MD_AVIOS no existe en esta base de datos. Ejecuta en MariaDB/MySQL el archivo apps/backend/prisma/manual/20250329_md_avios.sql (la tabla MD_SUPPLIER debe existir antes por la clave foránea).",
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

export function aviosRoutes(service: AviosService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[avios:list]", e);
      if (isMissingMdAviosTable(e)) {
        return res.status(503).json(MISSING_MD_AVIOS);
      }
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const row = await service.getById(Number(req.params.id));
      if (!row) {
        return res.status(404).json({ error: "Avío no encontrado", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[avios:getById]", e);
      if (isMissingMdAviosTable(e)) {
        return res.status(503).json(MISSING_MD_AVIOS);
      }
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameAvios?.trim()) {
        return res.status(400).json({ error: "El nombre del avío es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.idDlkSupplier || Number(req.body.idDlkSupplier) <= 0) {
        return res.status(400).json({ error: "Debes seleccionar el proveedor", type: "VALIDATION" });
      }
      const row = await service.create(req.body);
      res.status(201).json(row);
    } catch (e) {
      console.error("[avios:create]", e);
      if (isMissingMdAviosTable(e)) {
        return res.status(503).json(MISSING_MD_AVIOS);
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
      console.error("[avios:update]", e);
      if (isMissingMdAviosTable(e)) {
        return res.status(503).json(MISSING_MD_AVIOS);
      }
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Avío eliminado" });
    } catch (e) {
      console.error("[avios:delete]", e);
      if (isMissingMdAviosTable(e)) {
        return res.status(503).json(MISSING_MD_AVIOS);
      }
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
