import { Router } from "express";
import type { OrderLabelService } from "../services/order-label.service.js";
import { isLabelSize } from "../services/label-pdf.js";

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

function parseId(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function orderLabelRoutes(service: OrderLabelService): Router {
  // mergeParams: el router se monta en /api/order-heads/:id/labels y necesita leer :id.
  const router = Router({ mergeParams: true });

  router.get("/", async (req, res) => {
    try {
      const orderHeadId = parseId(String((req.params as Record<string, string>).id));
      if (!orderHeadId) {
        return res.status(400).json({ error: "ID de orden inválido", type: "VALIDATION" });
      }
      const list = await service.listByOrder(orderHeadId);
      res.json(list);
    } catch (e) {
      console.error("[order-labels:list]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const orderHeadId = parseId(String((req.params as Record<string, string>).id));
      if (!orderHeadId) {
        return res.status(400).json({ error: "ID de orden inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const idDigital = Number(body.idDlkDigitalIdentifier);
      if (!Number.isFinite(idDigital) || idDigital <= 0) {
        return res
          .status(400)
          .json({ error: "Debes seleccionar un identificador digital", type: "VALIDATION" });
      }
      const created = await service.create({
        idDlkOrderHead: orderHeadId,
        idDlkDigitalIdentifier: idDigital,
        idDlkOrderDetail:
          body.idDlkOrderDetail === "" || body.idDlkOrderDetail == null
            ? null
            : Number(body.idDlkOrderDetail),
        codOrderLabel: body.codOrderLabel == null ? null : String(body.codOrderLabel),
        codEstilo: body.codEstilo == null ? null : String(body.codEstilo),
        nameEstilo: body.nameEstilo == null ? null : String(body.nameEstilo),
        descriptionEstilo:
          body.descriptionEstilo == null ? null : String(body.descriptionEstilo),
        genderEstilo: body.genderEstilo == null ? null : String(body.genderEstilo),
        seasonEstilo: body.seasonEstilo == null ? null : String(body.seasonEstilo),
        codGtin: body.codGtin == null ? null : String(body.codGtin),
        estampado: body.estampado == null ? null : String(body.estampado),
        identifierType: body.identifierType == null ? null : String(body.identifierType),
        identifierMaterial:
          body.identifierMaterial == null ? null : String(body.identifierMaterial),
        identifierLocation:
          body.identifierLocation == null ? null : String(body.identifierLocation),
        inicioSerializacion:
          body.inicioSerializacion === "" || body.inicioSerializacion == null
            ? null
            : Number(body.inicioSerializacion),
        finSerializacion:
          body.finSerializacion === "" || body.finSerializacion == null
            ? null
            : Number(body.finSerializacion),
        totalLabel:
          body.totalLabel === "" || body.totalLabel == null ? null : Number(body.totalLabel),
        size: body.size == null ? null : String(body.size),
        color: body.color == null ? null : String(body.color),
        print: body.print == null ? null : String(body.print),
        pieceTypes: Array.isArray(body.pieceTypes)
          ? (body.pieceTypes as unknown[]).map((p) => String(p))
          : null,
        esSet:
          body.esSet == null || body.esSet === ""
            ? null
            : body.esSet === true || body.esSet === 1 || body.esSet === "1",
        numPiezas:
          body.numPiezas === "" || body.numPiezas == null ? null : Number(body.numPiezas),
        sizeBreakdown: Array.isArray(body.sizeBreakdown)
          ? (body.sizeBreakdown as unknown[]).map((s) => {
              const o = (s ?? {}) as Record<string, unknown>;
              return { size: String(o.size ?? ""), qty: Number(o.qty) || 0 };
            })
          : null,
        codUsuarioCargaDl:
          body.codUsuarioCargaDl != null ? String(body.codUsuarioCargaDl) : undefined,
      });
      res.status(201).json(created);
    } catch (e) {
      console.error("[order-labels:create]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // PDF con TODAS las etiquetas de la orden. Va antes de "/:labelId" para que
  // el segmento literal "pdf" no se interprete como un labelId.
  router.get("/pdf", async (req, res) => {
    try {
      const orderHeadId = parseId(String((req.params as Record<string, string>).id));
      if (!orderHeadId) {
        return res.status(400).json({ error: "ID de orden inválido", type: "VALIDATION" });
      }
      const size = String(req.query.size ?? "");
      if (!isLabelSize(size)) {
        return res
          .status(400)
          .json({ error: "Tamaño inválido (usa 25x50 o 40x50)", type: "VALIDATION" });
      }
      const { pdf, count } = await service.buildAllLabelsPdf(orderHeadId, size);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="etiquetas-orden-${orderHeadId}-${size}.pdf"`
      );
      res.setHeader("X-Label-Count", String(count));
      res.send(Buffer.from(pdf));
    } catch (e) {
      console.error("[order-labels:pdf-all]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:labelId", async (req, res) => {
    try {
      const labelId = parseId(String(req.params.labelId));
      if (!labelId) {
        return res.status(400).json({ error: "ID de etiqueta inválido", type: "VALIDATION" });
      }
      const row = await service.getById(labelId);
      if (!row) {
        return res.status(404).json({ error: "Etiqueta no encontrada", type: "NOT_FOUND" });
      }
      res.json(row);
    } catch (e) {
      console.error("[order-labels:getById]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.get("/:labelId/details", async (req, res) => {
    try {
      const labelId = parseId(String(req.params.labelId));
      if (!labelId) {
        return res.status(400).json({ error: "ID de etiqueta inválido", type: "VALIDATION" });
      }
      const skip = req.query.skip ? Number(req.query.skip) : undefined;
      const take = req.query.take ? Number(req.query.take) : undefined;
      const result = await service.listDetails(labelId, { skip, take });
      res.json(result);
    } catch (e) {
      console.error("[order-labels:details]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  // PDF imprimible de una etiqueta (una página por unidad serializada).
  router.get("/:labelId/pdf", async (req, res) => {
    try {
      const orderHeadId = parseId(String((req.params as Record<string, string>).id));
      const labelId = parseId(String(req.params.labelId));
      if (!orderHeadId || !labelId) {
        return res.status(400).json({ error: "IDs inválidos", type: "VALIDATION" });
      }
      const size = String(req.query.size ?? "");
      if (!isLabelSize(size)) {
        return res
          .status(400)
          .json({ error: "Tamaño inválido (usa 25x50 o 40x50)", type: "VALIDATION" });
      }
      const { pdf, count } = await service.buildLabelPdf(orderHeadId, labelId, size);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="etiqueta-${labelId}-${size}.pdf"`
      );
      res.setHeader("X-Label-Count", String(count));
      res.send(Buffer.from(pdf));
    } catch (e) {
      console.error("[order-labels:pdf]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:labelId", async (req, res) => {
    try {
      const labelId = parseId(String(req.params.labelId));
      if (!labelId) {
        return res.status(400).json({ error: "ID de etiqueta inválido", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const updated = await service.update(labelId, {
        ...(body.codOrderLabel !== undefined && {
          codOrderLabel: body.codOrderLabel == null ? null : String(body.codOrderLabel),
        }),
        ...(body.codEstilo !== undefined && {
          codEstilo: body.codEstilo == null ? null : String(body.codEstilo),
        }),
        ...(body.nameEstilo !== undefined && {
          nameEstilo: body.nameEstilo == null ? null : String(body.nameEstilo),
        }),
        ...(body.descriptionEstilo !== undefined && {
          descriptionEstilo:
            body.descriptionEstilo == null ? null : String(body.descriptionEstilo),
        }),
        ...(body.genderEstilo !== undefined && {
          genderEstilo: body.genderEstilo == null ? null : String(body.genderEstilo),
        }),
        ...(body.seasonEstilo !== undefined && {
          seasonEstilo: body.seasonEstilo == null ? null : String(body.seasonEstilo),
        }),
        ...(body.codGtin !== undefined && {
          codGtin: body.codGtin == null ? null : String(body.codGtin),
        }),
        ...(body.estampado !== undefined && {
          estampado: body.estampado == null ? null : String(body.estampado),
        }),
        ...(body.identifierType !== undefined && {
          identifierType: body.identifierType == null ? null : String(body.identifierType),
        }),
        ...(body.identifierMaterial !== undefined && {
          identifierMaterial:
            body.identifierMaterial == null ? null : String(body.identifierMaterial),
        }),
        ...(body.identifierLocation !== undefined && {
          identifierLocation:
            body.identifierLocation == null ? null : String(body.identifierLocation),
        }),
        ...(body.signOpenResponsible !== undefined && {
          signOpenResponsible:
            body.signOpenResponsible == null ? null : String(body.signOpenResponsible),
        }),
        ...(body.signCloseResponsible !== undefined && {
          signCloseResponsible:
            body.signCloseResponsible == null ? null : String(body.signCloseResponsible),
        }),
        ...(body.digitalCertificateId !== undefined && {
          digitalCertificateId:
            body.digitalCertificateId == null ? null : String(body.digitalCertificateId),
        }),
        ...(body.stateOrderLabelHead !== undefined && {
          stateOrderLabelHead:
            body.stateOrderLabelHead === "" || body.stateOrderLabelHead == null
              ? null
              : Number(body.stateOrderLabelHead),
        }),
        ...(body.flgStatutActif !== undefined && {
          flgStatutActif:
            body.flgStatutActif === "" || body.flgStatutActif == null
              ? null
              : Number(body.flgStatutActif),
        }),
        ...(body.statusStageOrderHead !== undefined && {
          statusStageOrderHead:
            body.statusStageOrderHead === "" || body.statusStageOrderHead == null
              ? null
              : Number(body.statusStageOrderHead),
        }),
        ...(body.codUsuarioCargaDl !== undefined && {
          codUsuarioCargaDl: String(body.codUsuarioCargaDl),
        }),
      });
      if (!updated) {
        return res.status(404).json({ error: "Etiqueta no encontrada", type: "NOT_FOUND" });
      }
      res.json(updated);
    } catch (e) {
      console.error("[order-labels:update]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  router.put("/:labelId/details/:detailId/blacklist", async (req, res) => {
    try {
      const labelId = parseId(String(req.params.labelId));
      const detailId = parseId(String(req.params.detailId));
      if (!labelId || !detailId) {
        return res.status(400).json({ error: "IDs inválidos", type: "VALIDATION" });
      }
      const body = req.body as Record<string, unknown>;
      const isBlacklisted = body.isBlacklisted === true || body.isBlacklisted === 1;
      const reason = body.reason == null ? null : String(body.reason);
      const auditor = body.auditor == null ? null : String(body.auditor);
      const updated = await service.setBlacklist(detailId, isBlacklisted, reason, auditor);
      res.json(updated);
    } catch (e) {
      console.error("[order-labels:blacklist]", e);
      const err = errorResponse(e);
      res.status(err.status).json(err.body);
    }
  });

  return router;
}
