import { Router } from "express";
import type {
  OrderHeadService,
  SuministroFileKind,
} from "../services/order-head.service.js";

const SUMINISTRO_KINDS = new Set<SuministroFileKind>(["udp", "prod", "final"]);

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

/** Acepta cuerpo nuevo (`fecEntry`) o legado (`fecEntryDate`) por compatibilidad. */
function pickFecEntry(body: Record<string, unknown>): string | null | undefined {
  if (body.fecEntry !== undefined) return body.fecEntry as string | null;
  if (body.fecEntryDate !== undefined) return body.fecEntryDate as string | null;
  return undefined;
}

function pickDateProbableDespatch(body: Record<string, unknown>): string | null | undefined {
  if (body.dateProbableDespatch !== undefined) return body.dateProbableDespatch as string | null;
  if (body.dateProbableDespatchDate !== undefined) {
    return body.dateProbableDespatchDate as string | null;
  }
  return undefined;
}

export function orderHeadRoutes(service: OrderHeadService): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const rawStage = req.query.stage;
      const stage =
        rawStage === undefined || rawStage === "" ? undefined : Number(rawStage);
      const list = await service.list(
        stage !== undefined && Number.isFinite(stage) ? { stage } : undefined
      );
      res.json(list);
    } catch (e) {
      console.error("[order-heads:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/file", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const file = await service.getArchivo(id);
      if (!file) {
        return res.status(404).json({ error: "Archivo no encontrado", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.filename)}"`);
      res.send(file.buffer);
    } catch (e) {
      console.error("[order-heads:file]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/details/:detailId/image", async (req, res) => {
    try {
      const headId = Number(req.params.id);
      const detailId = Number(req.params.detailId);
      if (!Number.isFinite(headId) || !Number.isFinite(detailId)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const img = await service.getDetailImage(headId, detailId);
      if (!img) {
        return res.status(404).json({ error: "Imagen no encontrada", type: "NOT_FOUND" });
      }
      res.setHeader("Content-Type", img.contentType);
      res.setHeader("Cache-Control", "private, max-age=86400");
      res.send(img.buffer);
    } catch (e) {
      console.error("[order-heads:detail-image]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/details", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const rows = await service.listDetailsByHeadId(id);
      if (rows === null) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(rows);
    } catch (e) {
      console.error("[order-heads:details]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const row = await service.getById(id);
      if (!row) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[order-heads:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const idBrand = Number(req.body.idDlkBrand);
      if (!req.body.codOrderHead?.trim()) {
        return res.status(400).json({ error: "El código de orden es obligatorio", type: "VALIDATION" });
      }
      if (!Number.isFinite(idBrand) || idBrand <= 0) {
        return res.status(400).json({ error: "Debes seleccionar una marca", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const created = await service.create({
        idDlkBrand: idBrand,
        codOrderHead: String(req.body.codOrderHead),
        quantityOrderHead:
          req.body.quantityOrderHead === undefined || req.body.quantityOrderHead === ""
            ? null
            : Number(req.body.quantityOrderHead),
        fecEntry: pickFecEntry(body) ?? null,
        dateProbableDespatch: pickDateProbableDespatch(body) ?? null,
        stageOrderHead:
          req.body.stageOrderHead === undefined || req.body.stageOrderHead === ""
            ? undefined
            : Number(req.body.stageOrderHead),
        statusStageOrderHead:
          req.body.statusStageOrderHead === undefined || req.body.statusStageOrderHead === ""
            ? undefined
            : Number(req.body.statusStageOrderHead),
        archivoBase64: req.body.archivoBase64 ?? null,
        archivoNombre:
          req.body.archivoNombre != null && String(req.body.archivoNombre).trim()
            ? String(req.body.archivoNombre).trim()
            : null,
        codUsuarioCargaDl: req.body.codUsuarioCargaDl,
      });
      res.status(201).json(created);
    } catch (e) {
      console.error("[order-heads:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id/details/:detailId", async (req, res) => {
    try {
      const headId = Number(req.params.id);
      const detailId = Number(req.params.detailId);
      if (!Number.isFinite(headId) || !Number.isFinite(detailId)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const updated = await service.updateDetail(headId, detailId, body);
      if (!updated) {
        return res.status(404).json({ error: "Línea no encontrada para esta orden", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:updateDetail]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:id/suministro/file/:kind", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const kind = String(req.params.kind).toLowerCase() as SuministroFileKind;
      if (!SUMINISTRO_KINDS.has(kind)) {
        return res
          .status(400)
          .json({ error: "Tipo de archivo inválido (udp|prod|final)", type: "VALIDATION" });
      }
      const file = await service.getSuministroFile(id, kind);
      if (!file) {
        return res.status(404).json({ error: "Archivo no encontrado", type: "NOT_FOUND" });
      }
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(file.filename)}"`
      );
      res.send(file.buffer);
    } catch (e) {
      console.error("[order-heads:suministro-file]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id/suministro", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const updated = await service.updateSuministro(id, {
        fileUdpBase64: body.fileUdpBase64 as string | null | undefined,
        fileUdpDate: body.fileUdpDate as string | null | undefined,
        clearFileUdp: body.clearFileUdp === true,
        fileProdBase64: body.fileProdBase64 as string | null | undefined,
        fileProdDate: body.fileProdDate as string | null | undefined,
        clearFileProd: body.clearFileProd === true,
        fileFinalBase64: body.fileFinalBase64 as string | null | undefined,
        fileFinalDate: body.fileFinalDate as string | null | undefined,
        clearFileFinal: body.clearFileFinal === true,
        statusStageOrderHead:
          body.statusStageOrderHead === undefined || body.statusStageOrderHead === ""
            ? undefined
            : body.statusStageOrderHead === null
              ? null
              : Number(body.statusStageOrderHead),
        flgStatutActif:
          body.flgStatutActif === undefined || body.flgStatutActif === ""
            ? undefined
            : body.flgStatutActif === null
              ? null
              : Number(body.flgStatutActif),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      if (!updated) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:updateSuministro]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Actualiza el sub-estado de la etapa Etiqueta (stage=3). Al Concluir avanza a Ruta.
  router.put("/:id/etiqueta-estado", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const updated = await service.updateEtiquetaEstado(id, {
        statusStageOrderHead:
          body.statusStageOrderHead === undefined || body.statusStageOrderHead === ""
            ? undefined
            : body.statusStageOrderHead === null
              ? null
              : Number(body.statusStageOrderHead),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      if (!updated) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:updateEtiquetaEstado]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Actualiza el sub-estado de la etapa Ruta (stage=4) + flag activo. Al Concluir avanza a Trazabilidad.
  router.put("/:id/ruta-estado", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const updated = await service.updateRutaEstado(id, {
        statusStageOrderHead:
          body.statusStageOrderHead === undefined || body.statusStageOrderHead === ""
            ? undefined
            : body.statusStageOrderHead === null
              ? null
              : Number(body.statusStageOrderHead),
        flgStatutActif:
          body.flgStatutActif === undefined || body.flgStatutActif === ""
            ? undefined
            : body.flgStatutActif === null
              ? null
              : Number(body.flgStatutActif),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      if (!updated) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:updateRutaEstado]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Actualiza el sub-estado de la etapa Trazabilidad (stage=5) + flag activo. Al Concluir avanza a Lista Negra.
  router.put("/:id/trazabilidad-estado", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const updated = await service.updateTrazabilidadEstado(id, {
        statusStageOrderHead:
          body.statusStageOrderHead === undefined || body.statusStageOrderHead === ""
            ? undefined
            : body.statusStageOrderHead === null
              ? null
              : Number(body.statusStageOrderHead),
        flgStatutActif:
          body.flgStatutActif === undefined || body.flgStatutActif === ""
            ? undefined
            : body.flgStatutActif === null
              ? null
              : Number(body.flgStatutActif),
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      if (!updated) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:updateTrazabilidadEstado]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Lista los componentes (piezas) de la orden para la pantalla de Ruta (genera los faltantes).
  router.get("/:id/components", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const result = await service.listComponents(id);
      if (!result) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(result);
    } catch (e) {
      console.error("[order-heads:listComponents]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Actualiza el nombre de pieza (NAME_COMPONENT) de un grupo de componentes (mismo estilo×pieza).
  router.put("/:id/components/name", async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const ids = Array.isArray(body.componentIds)
        ? body.componentIds.map((v) => Number(v)).filter((n) => Number.isFinite(n))
        : [];
      if (!ids.length) {
        return res.status(400).json({ error: "componentIds requerido", type: "VALIDATION" });
      }
      const name =
        body.nameComponent === undefined || body.nameComponent === null
          ? null
          : String(body.nameComponent);
      const ok = await service.updateComponentsName(ids, name);
      if (!ok) {
        return res.status(404).json({ error: "Componentes no encontrados", type: "NOT_FOUND" });
      }
      res.json({ ok: true });
    } catch (e) {
      console.error("[order-heads:updateComponentsName]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Árbol maestro (MD_PROCESS → MD_SUBPROCESS → MD_ACTIVITIES) para el modal "Crear ruta".
  router.get("/:id/route-master-tree", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const tree = await service.getRouteMasterTree(id);
      if (!tree) {
        return res.status(404).json({ error: "Orden no encontrada", type: "NOT_FOUND" });
      }
      res.json(tree);
    } catch (e) {
      console.error("[order-heads:getRouteMasterTree]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Códigos de la ruta ya instanciada de un componente (para pre-marcar en Editar/Ver).
  router.get("/:id/components/:componentId/route-selection", async (req, res) => {
    try {
      const componentId = Number(req.params.componentId);
      if (!Number.isFinite(componentId)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const sel = await service.getRouteSelection(componentId);
      res.json(sel);
    } catch (e) {
      console.error("[order-heads:getRouteSelection]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // Crea la ruta de los componentes a partir de los nodos marcados del árbol maestro.
  router.post("/:id/components/route", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const toIds = (v: unknown): number[] =>
        Array.isArray(v) ? v.map((x) => Number(x)).filter((n) => Number.isFinite(n)) : [];
      const componentIds = toIds(body.componentIds);
      if (!componentIds.length) {
        return res.status(400).json({ error: "componentIds requerido", type: "VALIDATION" });
      }
      const result = await service.createRouteFromMaster(id, {
        componentIds,
        processIds: toIds(body.processIds),
        subprocessIds: toIds(body.subprocessIds),
        activityIds: toIds(body.activityIds),
      });
      if (!result) {
        return res.status(404).json({ error: "Componentes no encontrados", type: "NOT_FOUND" });
      }
      res.status(201).json(result);
    } catch (e) {
      console.error("[order-heads:createRouteFromMaster]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "ID inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const fec = pickFecEntry(body);
      const dpd = pickDateProbableDespatch(body);
      const updated = await service.update(id, {
        ...(body.codOrderHead !== undefined && { codOrderHead: String(body.codOrderHead) }),
        ...(body.idDlkBrand !== undefined && { idDlkBrand: Number(body.idDlkBrand) }),
        ...(body.quantityOrderHead !== undefined && {
          quantityOrderHead:
            body.quantityOrderHead === "" || body.quantityOrderHead === null
              ? null
              : Number(body.quantityOrderHead),
        }),
        ...(fec !== undefined && { fecEntry: fec }),
        ...(dpd !== undefined && { dateProbableDespatch: dpd }),
        ...(body.stageOrderHead !== undefined && {
          stageOrderHead:
            body.stageOrderHead === "" || body.stageOrderHead === null
              ? null
              : Number(body.stageOrderHead),
        }),
        ...(body.statusStageOrderHead !== undefined && {
          statusStageOrderHead:
            body.statusStageOrderHead === "" || body.statusStageOrderHead === null
              ? null
              : Number(body.statusStageOrderHead),
        }),
        ...(body.flgStatutActif !== undefined && {
          flgStatutActif:
            body.flgStatutActif === "" || body.flgStatutActif === null
              ? null
              : Number(body.flgStatutActif),
        }),
        ...(body.archivoBase64 !== undefined && { archivoBase64: body.archivoBase64 as string | null }),
        ...(body.clearArchivo === true && { clearArchivo: true }),
        ...(body.codUsuarioCargaDl !== undefined && {
          codUsuarioCargaDl: String(body.codUsuarioCargaDl),
        }),
      });
      res.json(updated);
    } catch (e) {
      console.error("[order-heads:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
