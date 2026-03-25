import { Router } from "express";
import type { SupplierService } from "../services/supplier.service.js";

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

export function supplierRoutes(service: SupplierService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[suppliers:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const row = await service.getById(Number(req.params.id));
      if (!row) {
        return res.status(404).json({ error: "Proveedor no encontrado", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[suppliers:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameSupplier?.trim()) {
        return res.status(400).json({ error: "La razón social es obligatoria", type: "VALIDATION" });
      }
      const ruc = String(req.body.numRucSupplier ?? req.body.rucSupplier ?? "").trim();
      if (!ruc) {
        return res.status(400).json({ error: "El RUC es obligatorio", type: "VALIDATION" });
      }
      if (ruc.length > 11) {
        return res.status(400).json({ error: "El RUC no puede superar 11 caracteres", type: "VALIDATION" });
      }
      const u = Number(req.body.codUbigeoSupplier);
      if (!u) {
        return res.status(400).json({ error: "Debes seleccionar ubigeo completo", type: "VALIDATION" });
      }
      const row = await service.create(req.body);
      res.status(201).json(row);
    } catch (e) {
      console.error("[suppliers:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const row = await service.update(Number(req.params.id), req.body);
      res.json(row);
    } catch (e) {
      console.error("[suppliers:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Proveedor eliminado" });
    } catch (e) {
      console.error("[suppliers:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
