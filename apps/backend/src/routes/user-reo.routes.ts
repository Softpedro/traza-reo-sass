import { Router } from "express";
import type { UserReoService } from "../services/user-reo.service.js";

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

export function userReoRoutes(service: UserReoService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[users:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const usuario = await service.getById(Number(req.params.id));
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado", type: "NOT_FOUND" });
      }
      res.json(usuario);
    } catch (e) {
      console.error("[users:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameUser?.trim()) {
        return res.status(400).json({ error: "El nombre es obligatorio", type: "VALIDATION" });
      }
      if (!req.body.idDlkParentCompany || !req.body.codParentCompany) {
        return res.status(400).json({ error: "Debes seleccionar la empresa", type: "VALIDATION" });
      }
      if (!req.body.documentType || !req.body.documentNumber?.trim()) {
        return res.status(400).json({ error: "Tipo y número de documento son obligatorios", type: "VALIDATION" });
      }
      if (!req.body.userLogin?.trim() || !req.body.password?.trim()) {
        return res.status(400).json({ error: "Usuario y contraseña son obligatorios", type: "VALIDATION" });
      }
      const usuario = await service.create(req.body);
      res.status(201).json(usuario);
    } catch (e) {
      console.error("[users:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const usuario = await service.update(Number(req.params.id), req.body);
      res.json(usuario);
    } catch (e) {
      console.error("[users:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Usuario eliminado" });
    } catch (e) {
      console.error("[users:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}

