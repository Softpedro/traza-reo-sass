import { Router } from "express";
import {
  parseUbigeoParentCompanyInput,
  type ParentCompanyService,
} from "../services/parent-company.service.js";

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

export function parentCompanyRoutes(service: ParentCompanyService): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      const list = await service.list();
      res.json(list);
    } catch (e) {
      console.error("[parent-company:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const empresa = await service.getById(Number(req.params.id));
      if (!empresa) return res.status(404).json({ error: "Empresa no encontrada", type: "NOT_FOUND" });
      res.json(empresa);
    } catch (e) {
      console.error("[parent-company:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      if (!req.body.nameParentCompany?.trim()) {
        return res.status(400).json({ error: "La razón social es obligatoria", type: "VALIDATION" });
      }
      const codUbigeo = parseUbigeoParentCompanyInput(req.body.codUbigeoParentCompany);
      if (!codUbigeo) {
        return res.status(400).json({
          error: "El ubigeo es obligatorio. Selecciona departamento, provincia y distrito.",
          type: "VALIDATION",
        });
      }
      const empresa = await service.create(req.body);
      res.status(201).json(empresa);
    } catch (e) {
      console.error("[parent-company:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const empresa = await service.update(Number(req.params.id), req.body);
      res.json(empresa);
    } catch (e) {
      console.error("[parent-company:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.softDelete(Number(req.params.id));
      res.json({ message: "Empresa eliminada" });
    } catch (e) {
      console.error("[parent-company:delete]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
