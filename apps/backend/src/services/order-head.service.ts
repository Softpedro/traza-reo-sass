import { Buffer } from "node:buffer";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { Criticality } from "../../generated/prisma/enums.js";
import {
  isExcelFilename,
  isProbablyExcelBuffer,
  parseOrderExcelDetails,
} from "./order-excel-parser.js";
import { seedRouteIoFromMaster } from "./route-io-seed.js";

type PrismaBytes = Uint8Array<ArrayBuffer>;

function toBytes(buf: Buffer | null): PrismaBytes | null {
  if (!buf || buf.length === 0) return null;
  return Uint8Array.from(buf) as unknown as PrismaBytes;
}

/** Orden de presentación de tallas (para ordenar las tallas cubiertas en Ruta). */
const SIZE_ORDER = [
  "0-3", "3-6", "0-6", "6-12", "12-18",
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
  "XS", "S", "M", "L", "XL", "XXL",
];
function sizeOrder(s: string): number {
  const i = SIZE_ORDER.indexOf(s.trim().toUpperCase());
  const j = SIZE_ORDER.indexOf(s.trim());
  const idx = i >= 0 ? i : j;
  return idx < 0 ? 999 : idx;
}

/** COD_ORDER_DETAIL: `{codOrdenPedido}-{n}` p. ej. 135-24-1 (@db.VarChar(50)). */
function buildCodOrderDetail(codOrderHead: string, sequence1Based: number): string {
  const base = codOrderHead.trim();
  const full = `${base}-${sequence1Based}`;
  return full.length <= 50 ? full : full.slice(0, 50);
}

function imageContentType(buf: Buffer): string {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }
  if (buf.length >= 6) {
    const head = buf.subarray(0, 6).toString("ascii");
    if (head === "GIF87a" || head === "GIF89a") return "image/gif";
  }
  return "application/octet-stream";
}

/** ISO date o datetime; null si vacío o inválido (@db.Date). */
function parseOptionalDate(s: string | null | undefined): Date | null {
  if (!s?.trim()) return null;
  const d = new Date(s.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

const listSelect = {
  idDlkOrderHead: true,
  idDlkBrand: true,
  codOrderHead: true,
  quantityOrderHead: true,
  fecEntry: true,
  dateProbableDespatch: true,
  stageOrderHead: true,
  statusStageOrderHead: true,
  stateOrderHead: true,
  codUsuarioCargaDl: true,
  fecProcesoCargaDl: true,
  fecProcesoModifDl: true,
  desAccion: true,
  flgStatutActif: true,
  fehFileSuppliesUdp: true,
  fehFileSuppliesProd: true,
  fehFileSuppliesFinal: true,
  brand: {
    select: { idDlkBrand: true, nameBrand: true, codBrand: true },
  },
} as const;

/** Tipos de archivo de suministro que se guardan en OD_ORDER_HEAD. */
export type SuministroFileKind = "udp" | "prod" | "final";

type SuministroFieldSet = {
  blob: "fileSuppliesUdp" | "fileSuppliesProd" | "fileSuppliesFinal";
  date: "fehFileSuppliesUdp" | "fehFileSuppliesProd" | "fehFileSuppliesFinal";
  label: string;
};

const SUMINISTRO_FIELDS: Record<SuministroFileKind, SuministroFieldSet> = {
  udp: { blob: "fileSuppliesUdp", date: "fehFileSuppliesUdp", label: "UDP" },
  prod: { blob: "fileSuppliesProd", date: "fehFileSuppliesProd", label: "PROD" },
  final: { blob: "fileSuppliesFinal", date: "fehFileSuppliesFinal", label: "FINAL" },
};

export type OrderHeadListRow = {
  idDlkOrderHead: number;
  idDlkBrand: number | null;
  codOrderHead: string | null;
  quantityOrderHead: number | null;
  fecEntry: Date | null;
  dateProbableDespatch: Date | null;
  stageOrderHead: number | null;
  statusStageOrderHead: number | null;
  stateOrderHead: number | null;
  codUsuarioCargaDl: string | null;
  fecProcesoCargaDl: Date | null;
  fecProcesoModifDl: Date | null;
  desAccion: string | null;
  flgStatutActif: number | null;
  fehFileSuppliesUdp: Date | null;
  fehFileSuppliesProd: Date | null;
  fehFileSuppliesFinal: Date | null;
  brand: { idDlkBrand: number; nameBrand: string; codBrand: string } | null;
};

export type OrderHeadCreateResult = OrderHeadListRow & {
  /** Filas insertadas en OD_ORDER_DETAIL al importar Excel en el mismo POST. */
  importedDetailCount?: number;
};

/** Fila OD_ORDER_DETAIL tal como la expone el API (sin blobs grandes en listados). */
export type OrderDetailListRow = {
  idDlkOrderDetail: number;
  idDlkOrderHead: number;
  codOrderDetail: string | null;
  codEstilo: string | null;
  desTela: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  fondoTela: string | null;
  versionTela: string | null;
  orderSample: number | null;
  size0_3: number | null;
  size3_6: number | null;
  size0_6: number | null;
  size6_12: number | null;
  size12_18: number | null;
  size2: number | null;
  size3: number | null;
  size4: number | null;
  size5: number | null;
  size6: number | null;
  size7: number | null;
  size8: number | null;
  size9: number | null;
  size10: number | null;
  size11: number | null;
  size12: number | null;
  size14: number | null;
  size16: number | null;
  sizeXs: number | null;
  sizeS: number | null;
  sizeM: number | null;
  sizeL: number | null;
  sizeXl: number | null;
  sizeXxl: number | null;
  totalEstilo: number | null;
  esSet: number | null;
  numPiezas: number | null;
  hasImgEstilo: boolean;
  stateOrderDetail: number | null;
  flgStatutActif: number | null;
};

export class OrderHeadService {
  constructor(private prisma: PrismaClient) {}

  async list(filter?: { stage?: number | null }): Promise<OrderHeadListRow[]> {
    const where: Prisma.OdOrderHeadWhereInput = {};
    if (filter?.stage != null && Number.isFinite(filter.stage)) {
      where.stageOrderHead = filter.stage;
    }
    const rows = await this.prisma.odOrderHead.findMany({
      where,
      select: listSelect,
      orderBy: { idDlkOrderHead: "desc" },
    });
    return rows as unknown as OrderHeadListRow[];
  }

  async getById(id: number) {
    const row = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: {
        ...listSelect,
        fileOrderHead: true,
        fileSuppliesUdp: true,
        fileSuppliesProd: true,
        fileSuppliesFinal: true,
      },
    });
    if (!row) return null;
    const {
      fileOrderHead,
      fileSuppliesUdp,
      fileSuppliesProd,
      fileSuppliesFinal,
      ...rest
    } = row;
    return {
      ...rest,
      hasArchivo: fileOrderHead != null && fileOrderHead.byteLength > 0,
      hasFileSuppliesUdp: fileSuppliesUdp != null && fileSuppliesUdp.byteLength > 0,
      hasFileSuppliesProd: fileSuppliesProd != null && fileSuppliesProd.byteLength > 0,
      hasFileSuppliesFinal: fileSuppliesFinal != null && fileSuppliesFinal.byteLength > 0,
    };
  }

  /** Detalles de la orden; `null` si no existe la cabecera. */
  async listDetailsByHeadId(headId: number): Promise<OrderDetailListRow[] | null> {
    const head = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: headId },
      select: { idDlkOrderHead: true },
    });
    if (!head) return null;

    const rows = await this.prisma.odOrderDetail.findMany({
      where: { idDlkOrderHead: headId },
      orderBy: { idDlkOrderDetail: "asc" },
      select: {
        idDlkOrderDetail: true,
        idDlkOrderHead: true,
        codOrderDetail: true,
        codEstilo: true,
        desTela: true,
        nomEstilo: true,
        colorAway: true,
        fondoTela: true,
        versionTela: true,
        orderSample: true,
        size0_3: true,
        size3_6: true,
        size0_6: true,
        size6_12: true,
        size12_18: true,
        size2: true,
        size3: true,
        size4: true,
        size5: true,
        size6: true,
        size7: true,
        size8: true,
        size9: true,
        size10: true,
        size11: true,
        size12: true,
        size14: true,
        size16: true,
        sizeXs: true,
        sizeS: true,
        sizeM: true,
        sizeL: true,
        sizeXl: true,
        sizeXxl: true,
        totalEstilo: true,
        esSet: true,
        numPiezas: true,
        imgEstilo: true,
        stateOrderDetail: true,
        flgStatutActif: true,
      },
    });

    return rows.map((r) => {
      const { imgEstilo, ...rest } = r;
      return {
        ...rest,
        hasImgEstilo: imgEstilo != null && imgEstilo.byteLength > 0,
      };
    }) as OrderDetailListRow[];
  }

  /** Imagen del estilo incrustada en OD_ORDER_DETAIL.IMG_ESTILO. */
  async getDetailImage(
    headId: number,
    detailId: number
  ): Promise<{ buffer: Buffer; contentType: string } | null> {
    const row = await this.prisma.odOrderDetail.findFirst({
      where: { idDlkOrderDetail: detailId, idDlkOrderHead: headId },
      select: { imgEstilo: true },
    });
    if (!row?.imgEstilo || row.imgEstilo.byteLength === 0) return null;
    const buffer = Buffer.from(row.imgEstilo);
    return { buffer, contentType: imageContentType(buffer) };
  }

  async getArchivo(id: number): Promise<{ buffer: Buffer; filename: string } | null> {
    const row = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: { fileOrderHead: true, codOrderHead: true },
    });
    if (!row?.fileOrderHead || row.fileOrderHead.byteLength === 0) return null;
    const buffer = Buffer.from(row.fileOrderHead);
    const base = row.codOrderHead?.trim().replace(/[^\w.-]+/g, "_") || `orden-${id}`;
    const filename = base.includes(".") ? base : `${base}.bin`;
    return { buffer, filename };
  }

  async create(body: {
    idDlkBrand: number;
    codOrderHead: string;
    quantityOrderHead?: number | null;
    fecEntry?: string | null;
    dateProbableDespatch?: string | null;
    stageOrderHead?: number | null;
    statusStageOrderHead?: number | null;
    archivoBase64?: string | null;
    /** Nombre del archivo adjunto (ayuda a detectar .xlsx si el buffer no tiene firma clara). */
    archivoNombre?: string | null;
    codUsuarioCargaDl?: string;
  }): Promise<OrderHeadCreateResult> {
    const now = new Date();
    let fileBuf: Buffer | null = null;
    if (body.archivoBase64?.trim()) {
      const raw = body.archivoBase64.replace(/^data:[^;]+;base64,/, "");
      fileBuf = Buffer.from(raw, "base64");
    }

    const codDl = body.codUsuarioCargaDl?.trim() || "SYSTEM";

    let detailDrafts: Awaited<ReturnType<typeof parseOrderExcelDetails>> = [];
    const tryExcel =
      fileBuf &&
      fileBuf.length > 0 &&
      (isProbablyExcelBuffer(fileBuf) || isExcelFilename(body.archivoNombre));
    if (tryExcel && fileBuf) {
      detailDrafts = await parseOrderExcelDetails(fileBuf);
    }

    const quantity =
      body.quantityOrderHead == null ? null : Number(body.quantityOrderHead);
    if (quantity == null || !Number.isFinite(quantity)) {
      throw new Error("La cantidad total de la orden es obligatoria");
    }
    const fecEntryDate = parseOptionalDate(body.fecEntry ?? null);
    if (!fecEntryDate) {
      throw new Error("La fecha de ingreso es obligatoria");
    }
    const dispatchDate = parseOptionalDate(body.dateProbableDespatch ?? null);
    if (!dispatchDate) {
      throw new Error("La fecha probable de despacho es obligatoria");
    }

    const headData: Prisma.OdOrderHeadUncheckedCreateInput = {
      idDlkBrand: body.idDlkBrand,
      codOrderHead: body.codOrderHead.trim(),
      quantityOrderHead: quantity,
      fecEntry: fecEntryDate,
      dateProbableDespatch: dispatchDate,
      fileOrderHead: toBytes(fileBuf),
      stageOrderHead: body.stageOrderHead ?? 1,
      statusStageOrderHead: body.statusStageOrderHead ?? 1,
      stateOrderHead: 1,
      codUsuarioCargaDl: codDl,
      fecProcesoCargaDl: now,
      fecProcesoModifDl: now,
      desAccion: "I",
      flgStatutActif: 1,
    };

    const created = await this.prisma.$transaction(async (tx) => {
      const head = await tx.odOrderHead.create({
        data: headData,
        select: { idDlkOrderHead: true },
      });

      if (detailDrafts.length > 0) {
        const codHead = body.codOrderHead.trim();
        await tx.odOrderDetail.createMany({
          data: detailDrafts.map((d, idx) => ({
            ...d,
            idDlkOrderHead: head.idDlkOrderHead,
            codOrderDetail: buildCodOrderDetail(codHead, idx + 1),
            codUsuarioCargaDl: codDl,
            fecProcesoCargaDl: now,
            fecProcesoModifDl: now,
          })),
        });
      }

      return tx.odOrderHead.findUniqueOrThrow({
        where: { idDlkOrderHead: head.idDlkOrderHead },
        select: listSelect,
      });
    });

    const row = created as unknown as OrderHeadListRow;
    if (detailDrafts.length > 0) {
      return { ...row, importedDetailCount: detailDrafts.length };
    }
    return row;
  }

  async update(
    id: number,
    body: {
      codOrderHead?: string;
      idDlkBrand?: number;
      quantityOrderHead?: number | null;
      fecEntry?: string | null;
      dateProbableDespatch?: string | null;
      stageOrderHead?: number | null;
      statusStageOrderHead?: number | null;
      flgStatutActif?: number | null;
      archivoBase64?: string | null;
      clearArchivo?: boolean;
      codUsuarioCargaDl?: string;
    }
  ) {
    const now = new Date();

    const data: Prisma.OdOrderHeadUncheckedUpdateInput = {
      fecProcesoModifDl: now,
      desAccion: "U",
    };

    if (body.codOrderHead !== undefined) data.codOrderHead = body.codOrderHead.trim();
    if (body.idDlkBrand !== undefined) data.idDlkBrand = body.idDlkBrand;
    if (body.quantityOrderHead != null) data.quantityOrderHead = Number(body.quantityOrderHead);
    if (body.fecEntry !== undefined) {
      const d = parseOptionalDate(body.fecEntry);
      if (!d) throw new Error("La fecha de ingreso es obligatoria");
      data.fecEntry = d;
    }
    if (body.dateProbableDespatch !== undefined) {
      const d = parseOptionalDate(body.dateProbableDespatch);
      if (!d) throw new Error("La fecha probable de despacho es obligatoria");
      data.dateProbableDespatch = d;
    }
    if (body.stageOrderHead !== undefined) data.stageOrderHead = body.stageOrderHead;
    if (body.statusStageOrderHead !== undefined) data.statusStageOrderHead = body.statusStageOrderHead;
    if (body.flgStatutActif != null) data.flgStatutActif = Number(body.flgStatutActif);
    if (body.codUsuarioCargaDl !== undefined) data.codUsuarioCargaDl = body.codUsuarioCargaDl;

    if (body.clearArchivo) {
      data.fileOrderHead = null;
    } else if (body.archivoBase64?.trim()) {
      const raw = body.archivoBase64.replace(/^data:[^;]+;base64,/, "");
      data.fileOrderHead = toBytes(Buffer.from(raw, "base64"));
    }

    // Regla de transición: al cerrar Registro (stage=1 + status=2 "Concluido"),
    // la orden pasa a Suministro (stage=2 + status=1 "Sin Iniciar"). Ocurre
    // automáticamente para mantener la progresión secuencial del flujo.
    const resolvedStage =
      data.stageOrderHead !== undefined
        ? (data.stageOrderHead as number | null | undefined)
        : undefined;
    const resolvedStatus =
      data.statusStageOrderHead !== undefined
        ? (data.statusStageOrderHead as number | null | undefined)
        : undefined;
    if (resolvedStage !== undefined || resolvedStatus !== undefined) {
      const current = await this.prisma.odOrderHead.findUnique({
        where: { idDlkOrderHead: id },
        select: { stageOrderHead: true, statusStageOrderHead: true },
      });
      if (current) {
        const finalStage =
          resolvedStage !== undefined ? resolvedStage : current.stageOrderHead;
        const finalStatus =
          resolvedStatus !== undefined ? resolvedStatus : current.statusStageOrderHead;
        if (finalStage === 1 && finalStatus === 2) {
          data.stageOrderHead = 2;
          data.statusStageOrderHead = 1;
        }
      }
    }

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
  }

  /**
   * Edita una fila de OD_ORDER_DETAIL respetando la cabecera (headId).
   * codOrderDetail y codEstilo son inmutables; se ignoran si llegan en el body.
   * Devuelve null si la fila no pertenece a la cabecera indicada.
   */
  async updateDetail(
    headId: number,
    detailId: number,
    body: {
      nomEstilo?: string | null;
      desTela?: string | null;
      colorAway?: string | null;
      fondoTela?: string | null;
      versionTela?: string | null;
      orderSample?: number | null;
      size0_3?: number | null;
      size3_6?: number | null;
      size0_6?: number | null;
      size6_12?: number | null;
      size12_18?: number | null;
      size2?: number | null;
      size3?: number | null;
      size4?: number | null;
      size5?: number | null;
      size6?: number | null;
      size7?: number | null;
      size8?: number | null;
      size9?: number | null;
      size10?: number | null;
      size11?: number | null;
      size12?: number | null;
      size14?: number | null;
      size16?: number | null;
      sizeXs?: number | null;
      sizeS?: number | null;
      sizeM?: number | null;
      sizeL?: number | null;
      sizeXl?: number | null;
      sizeXxl?: number | null;
      totalEstilo?: number | null;
      stateOrderDetail?: number | null;
      flgStatutActif?: number | null;
      imgEstiloBase64?: string | null;
      clearImgEstilo?: boolean;
      codUsuarioCargaDl?: string;
    }
  ): Promise<OrderDetailListRow | null> {
    const existing = await this.prisma.odOrderDetail.findFirst({
      where: { idDlkOrderDetail: detailId, idDlkOrderHead: headId },
      select: { idDlkOrderDetail: true },
    });
    if (!existing) return null;

    const data: Prisma.OdOrderDetailUncheckedUpdateInput = {
      fecProcesoModifDl: new Date(),
      desAccion: "U",
    };

    const setStr = (key: keyof typeof body, target: keyof Prisma.OdOrderDetailUncheckedUpdateInput) => {
      const v = body[key];
      if (v === undefined) return;
      (data as Record<string, unknown>)[target] = v == null || v === "" ? null : String(v);
    };
    const setNum = (key: keyof typeof body, target: keyof Prisma.OdOrderDetailUncheckedUpdateInput) => {
      const v = body[key];
      if (v === undefined) return;
      (data as Record<string, unknown>)[target] = v == null || v === "" ? null : Number(v);
    };

    setStr("nomEstilo", "nomEstilo");
    setStr("desTela", "desTela");
    setStr("colorAway", "colorAway");
    setStr("fondoTela", "fondoTela");
    setStr("versionTela", "versionTela");
    setNum("orderSample", "orderSample");
    setNum("size0_3", "size0_3");
    setNum("size3_6", "size3_6");
    setNum("size0_6", "size0_6");
    setNum("size6_12", "size6_12");
    setNum("size12_18", "size12_18");
    setNum("size2", "size2");
    setNum("size3", "size3");
    setNum("size4", "size4");
    setNum("size5", "size5");
    setNum("size6", "size6");
    setNum("size7", "size7");
    setNum("size8", "size8");
    setNum("size9", "size9");
    setNum("size10", "size10");
    setNum("size11", "size11");
    setNum("size12", "size12");
    setNum("size14", "size14");
    setNum("size16", "size16");
    setNum("sizeXs", "sizeXs");
    setNum("sizeS", "sizeS");
    setNum("sizeM", "sizeM");
    setNum("sizeL", "sizeL");
    setNum("sizeXl", "sizeXl");
    setNum("sizeXxl", "sizeXxl");
    setNum("totalEstilo", "totalEstilo");
    setNum("stateOrderDetail", "stateOrderDetail");
    setNum("flgStatutActif", "flgStatutActif");
    if (body.codUsuarioCargaDl !== undefined) data.codUsuarioCargaDl = body.codUsuarioCargaDl;

    if (body.clearImgEstilo) {
      data.imgEstilo = null;
    } else if (body.imgEstiloBase64?.trim()) {
      const raw = body.imgEstiloBase64.replace(/^data:[^;]+;base64,/, "");
      data.imgEstilo = toBytes(Buffer.from(raw, "base64"));
    }

    await this.prisma.odOrderDetail.update({
      where: { idDlkOrderDetail: detailId },
      data,
    });

    const rows = await this.listDetailsByHeadId(headId);
    return rows?.find((r) => r.idDlkOrderDetail === detailId) ?? null;
  }

  /**
   * Actualiza los 3 archivos de suministro (UDP, PROD, FINAL) con sus fechas,
   * además del sub-estado de la etapa (STATUS_STAGE_ORDER_HEAD) y el flag activo.
   * Reglas:
   *  - Al subir un archivo, si no se envía fecha explícita, se persiste la fecha actual.
   *  - Cada archivo es independiente: se pueden enviar 1, 2 o los 3 en una sola llamada.
   *  - `stageOrderHead` se fuerza a 2 (Suministro) porque es la etapa dueña de estos campos.
   */
  async updateSuministro(
    id: number,
    body: {
      fileUdpBase64?: string | null;
      fileUdpDate?: string | null;
      clearFileUdp?: boolean;
      fileProdBase64?: string | null;
      fileProdDate?: string | null;
      clearFileProd?: boolean;
      fileFinalBase64?: string | null;
      fileFinalDate?: string | null;
      clearFileFinal?: boolean;
      statusStageOrderHead?: number | null;
      flgStatutActif?: number | null;
      codUsuarioCargaDl?: string;
    }
  ): Promise<OrderHeadListRow | null> {
    const existing = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: { idDlkOrderHead: true },
    });
    if (!existing) return null;

    const now = new Date();
    const data: Prisma.OdOrderHeadUncheckedUpdateInput = {
      stageOrderHead: 2,
      fecProcesoModifDl: now,
      desAccion: "U",
    };

    const applyFile = (
      kind: SuministroFileKind,
      clear: boolean | undefined,
      base64: string | null | undefined,
      dateIso: string | null | undefined
    ) => {
      const fields = SUMINISTRO_FIELDS[kind];
      if (clear) {
        (data as Record<string, unknown>)[fields.blob] = null;
        (data as Record<string, unknown>)[fields.date] = null;
        return;
      }
      if (base64?.trim()) {
        const raw = base64.replace(/^data:[^;]+;base64,/, "");
        (data as Record<string, unknown>)[fields.blob] = toBytes(
          Buffer.from(raw, "base64")
        );
        const parsed = parseOptionalDate(dateIso ?? null);
        (data as Record<string, unknown>)[fields.date] = parsed ?? now;
        return;
      }
      if (dateIso !== undefined) {
        const parsed = parseOptionalDate(dateIso);
        (data as Record<string, unknown>)[fields.date] = parsed;
      }
    };

    applyFile("udp", body.clearFileUdp, body.fileUdpBase64, body.fileUdpDate);
    applyFile("prod", body.clearFileProd, body.fileProdBase64, body.fileProdDate);
    applyFile("final", body.clearFileFinal, body.fileFinalBase64, body.fileFinalDate);

    if (body.statusStageOrderHead !== undefined) {
      data.statusStageOrderHead =
        body.statusStageOrderHead == null ? null : Number(body.statusStageOrderHead);
    }
    if (body.flgStatutActif != null) {
      data.flgStatutActif = Number(body.flgStatutActif);
    }
    if (body.codUsuarioCargaDl !== undefined) {
      data.codUsuarioCargaDl = body.codUsuarioCargaDl;
    }

    // Regla de transición: al cerrar Suministro (status=2 "Concluido"),
    // la orden pasa a Etiqueta (stage=3 + status=1 "Iniciado").
    if (data.statusStageOrderHead === 2) {
      data.stageOrderHead = 3;
      data.statusStageOrderHead = 1;
    }

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
  }

  /**
   * Actualiza el sub-estado de la etapa Etiqueta (stage=3) en OD_ORDER_HEAD.
   * Modelo de 3 estados: 1=Sin Iniciar, 2=Iniciado, 3=Concluido.
   * Regla de transición: al Concluir Etiqueta (status=3) la orden pasa a
   * Ruta (stage=4 + status=1 "Sin Iniciar") y deja de listarse en Etiqueta.
   */
  async updateEtiquetaEstado(
    id: number,
    body: { statusStageOrderHead?: number | null; codUsuarioCargaDl?: string }
  ): Promise<OrderHeadListRow | null> {
    const existing = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: { idDlkOrderHead: true },
    });
    if (!existing) return null;

    const status =
      body.statusStageOrderHead == null ? 1 : Number(body.statusStageOrderHead);

    const data: Prisma.OdOrderHeadUncheckedUpdateInput = {
      stageOrderHead: 3,
      statusStageOrderHead: status,
      fecProcesoModifDl: new Date(),
      desAccion: "U",
    };
    if (body.codUsuarioCargaDl !== undefined) {
      data.codUsuarioCargaDl = body.codUsuarioCargaDl;
    }

    // Al Concluir Etiqueta, la orden avanza a Ruta (stage=4) en estado Sin Iniciar.
    if (status === 3) {
      data.stageOrderHead = 4;
      data.statusStageOrderHead = 1;
    }

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
  }

  /**
   * Actualiza el sub-estado de la etapa Ruta (stage=4) y el flag activo en OD_ORDER_HEAD.
   * Modelo de 3 estados: 1=Sin Iniciar, 2=Iniciado, 3=Concluido.
   * Regla de transición: al Concluir Ruta (status=3) la orden pasa a
   * Trazabilidad (stage=5 + status=1 "Sin Iniciar") y deja de listarse en Ruta.
   */
  async updateRutaEstado(
    id: number,
    body: {
      statusStageOrderHead?: number | null;
      flgStatutActif?: number | null;
      codUsuarioCargaDl?: string;
    }
  ): Promise<OrderHeadListRow | null> {
    const existing = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: { idDlkOrderHead: true },
    });
    if (!existing) return null;

    const status =
      body.statusStageOrderHead == null ? 1 : Number(body.statusStageOrderHead);

    const data: Prisma.OdOrderHeadUncheckedUpdateInput = {
      stageOrderHead: 4,
      statusStageOrderHead: status,
      fecProcesoModifDl: new Date(),
      desAccion: "U",
    };
    if (body.flgStatutActif != null) {
      data.flgStatutActif = Number(body.flgStatutActif);
    }
    if (body.codUsuarioCargaDl !== undefined) {
      data.codUsuarioCargaDl = body.codUsuarioCargaDl;
    }

    // Al Concluir Ruta, la orden avanza a Trazabilidad (stage=5) en estado Sin Iniciar.
    if (status === 3) {
      data.stageOrderHead = 5;
      data.statusStageOrderHead = 1;
    }

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
  }

  /**
   * Actualiza el sub-estado de la etapa Trazabilidad (stage=5) y el flag activo en OD_ORDER_HEAD.
   * Modelo de 3 estados: 1=Sin Iniciar, 2=Iniciado, 3=Concluido.
   * Regla de transición: al Concluir Trazabilidad (status=3) la orden pasa a
   * Lista Negra (stage=6 + status=1 "Sin Iniciar") y deja de listarse en Trazabilidad.
   */
  async updateTrazabilidadEstado(
    id: number,
    body: {
      statusStageOrderHead?: number | null;
      flgStatutActif?: number | null;
      codUsuarioCargaDl?: string;
    }
  ): Promise<OrderHeadListRow | null> {
    const existing = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: { idDlkOrderHead: true },
    });
    if (!existing) return null;

    const status =
      body.statusStageOrderHead == null ? 1 : Number(body.statusStageOrderHead);

    const data: Prisma.OdOrderHeadUncheckedUpdateInput = {
      stageOrderHead: 5,
      statusStageOrderHead: status,
      fecProcesoModifDl: new Date(),
      desAccion: "U",
    };
    if (body.flgStatutActif != null) {
      data.flgStatutActif = Number(body.flgStatutActif);
    }
    if (body.codUsuarioCargaDl !== undefined) {
      data.codUsuarioCargaDl = body.codUsuarioCargaDl;
    }

    // Al Concluir Trazabilidad, la orden avanza a Lista Negra (stage=6) en estado Sin Iniciar.
    if (status === 3) {
      data.stageOrderHead = 6;
      data.statusStageOrderHead = 1;
    }

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
  }

  /**
   * Lista los componentes (piezas) de una orden para la pantalla de Ruta.
   * Genera los faltantes desde OD_ORDER_DETAIL: no-set = 1 componente;
   * set = numPiezas componentes (NAME_COMPONENT = "Pieza N", editable luego).
   * Solo genera para detalles que aún no tienen ningún componente (idempotente).
   * El estado de Ruta se toma de OD_ORDER_HEAD.statusStageOrderHead.
   */
  /**
   * Lista las piezas (componentes) de una orden para la pantalla de Ruta, derivadas de la
   * ETIQUETA: solo entran los colorways que tienen ≥1 etiqueta con GTIN; las piezas y su
   * carácter de set salen de OD_ORDER_LABEL_COMPONENT, y las tallas de las cabeceras con GTIN.
   *
   * La unidad ruteable sigue siendo (colorway × pieza) = OD_ORDER_COMPONENT (ruta compartida
   * entre tallas). Se sincroniza con las piezas de la etiqueta sin borrar rutas ya creadas.
   */
  async listComponents(orderHeadId: number) {
    const head = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: orderHeadId },
      select: {
        idDlkOrderHead: true,
        codOrderHead: true,
        statusStageOrderHead: true,
        stageOrderHead: true,
        flgStatutActif: true,
        codUsuarioCargaDl: true,
        brand: { select: { idDlkBrand: true, nameBrand: true, codBrand: true } },
      },
    });
    if (!head) return null;

    // Etiquetas con GTIN: definen qué colorways entran a Ruta, sus tallas y sus piezas.
    const labelHeads = await this.prisma.odOrderLabelHead.findMany({
      where: { idDlkOrderHead: orderHeadId, flgStatutActif: 1, codGtin: { not: null } },
      select: {
        size: true,
        codGtin: true,
        orderDetail: {
          select: {
            idDlkOrderDetail: true,
            codOrderDetail: true,
            codEstilo: true,
            nomEstilo: true,
            colorAway: true,
            fondoTela: true,
          },
        },
        components: {
          select: { numPiece: true, nameComponent: true },
          orderBy: { numPiece: "asc" },
        },
      },
      orderBy: { idDlkOrderLabelHead: "asc" },
    });

    // Agrupa por colorway (OD_ORDER_DETAIL): tallas cubiertas + piezas (de la etiqueta).
    type ColInfo = {
      detailId: number;
      codOrderDetail: string | null;
      codEstilo: string | null;
      nomEstilo: string | null;
      colorAway: string | null;
      fondoTela: string | null;
      sizes: Set<string>;
      isSet: boolean;
      pieces: Map<number, string | null>;
    };
    const byColorway = new Map<number, ColInfo>();
    for (const lh of labelHeads) {
      if (!lh.codGtin || !lh.codGtin.trim()) continue;
      const det = lh.orderDetail;
      if (!det) continue;
      let info = byColorway.get(det.idDlkOrderDetail);
      if (!info) {
        info = {
          detailId: det.idDlkOrderDetail,
          codOrderDetail: det.codOrderDetail,
          codEstilo: det.codEstilo,
          nomEstilo: det.nomEstilo,
          colorAway: det.colorAway,
          fondoTela: det.fondoTela,
          sizes: new Set<string>(),
          isSet: false,
          pieces: new Map<number, string | null>(),
        };
        byColorway.set(det.idDlkOrderDetail, info);
      }
      if (lh.size) info.sizes.add(lh.size);
      if (lh.components.length > 0) {
        info.isSet = true;
        for (const c of lh.components) {
          if (!info.pieces.has(c.numPiece)) info.pieces.set(c.numPiece, c.nameComponent);
        }
      }
    }

    // Sincroniza OD_ORDER_COMPONENT (unidad ruteable) con las piezas de la etiqueta.
    // No borra: crea faltantes, renombra y desactiva sobrantes (preserva rutas existentes).
    const codDl = head.codUsuarioCargaDl ?? "SYSTEM";
    for (const info of byColorway.values()) {
      const desired = info.isSet
        ? [...info.pieces.entries()].sort((a, b) => a[0] - b[0]).map(([, name]) => name)
        : [null];

      const existing = await this.prisma.odOrderComponent.findMany({
        where: { idDlkOrderDetail: info.detailId, flgStatutActif: 1 },
        orderBy: { idDlkOrderComponent: "asc" },
        select: { idDlkOrderComponent: true },
      });

      for (let i = existing.length; i < desired.length; i++) {
        await this.prisma.odOrderComponent.create({
          data: {
            idDlkOrderHead: orderHeadId,
            idDlkOrderDetail: info.detailId,
            nameComponent: desired[i],
            codUsuarioCargaDl: codDl,
          },
        });
      }
      for (let i = 0; i < Math.min(existing.length, desired.length); i++) {
        await this.prisma.odOrderComponent.update({
          where: { idDlkOrderComponent: existing[i].idDlkOrderComponent },
          data: { nameComponent: desired[i], desAccion: "U", fecProcesoModifDl: new Date() },
        });
      }
      for (let i = desired.length; i < existing.length; i++) {
        await this.prisma.odOrderComponent.update({
          where: { idDlkOrderComponent: existing[i].idDlkOrderComponent },
          data: { flgStatutActif: 0, desAccion: "U", fecProcesoModifDl: new Date() },
        });
      }
    }

    // Grupos: una fila por colorway × pieza, con las tallas cubiertas.
    type Group = {
      key: string;
      codEstilo: string | null;
      nomEstilo: string | null;
      color: string | null;
      fondoTela: string | null;
      esSet: boolean;
      ordinal: number | null;
      pieza: string | null;
      tallas: string[];
      ordenesProduccion: string[];
      componentIds: number[];
    };
    const groups: Group[] = [];
    const colorways = [...byColorway.values()].sort((a, b) => a.detailId - b.detailId);
    for (const info of colorways) {
      const comps = await this.prisma.odOrderComponent.findMany({
        where: { idDlkOrderDetail: info.detailId, flgStatutActif: 1 },
        orderBy: { idDlkOrderComponent: "asc" },
        select: { idDlkOrderComponent: true, nameComponent: true },
      });
      const tallas = [...info.sizes].sort((a, b) => sizeOrder(a) - sizeOrder(b));
      comps.forEach((comp, idx) => {
        groups.push({
          key: `${info.detailId}#${idx + 1}`,
          codEstilo: info.codEstilo,
          nomEstilo: info.nomEstilo,
          color: info.colorAway,
          fondoTela: info.fondoTela,
          esSet: info.isSet,
          ordinal: info.isSet ? idx + 1 : null,
          pieza: comp.nameComponent ?? (info.isSet ? `Pieza ${idx + 1}` : null),
          tallas,
          ordenesProduccion: info.codOrderDetail ? [info.codOrderDetail] : [],
          componentIds: [comp.idDlkOrderComponent],
        });
      });
    }

    return { order: head, groups };
  }

  /**
   * Actualiza el nombre de pieza (NAME_COMPONENT) de uno o varios componentes
   * (todos los del grupo de un estilo×pieza comparten el mismo nombre).
   */
  async updateComponentsName(
    componentIds: number[],
    name: string | null
  ): Promise<boolean> {
    if (!componentIds.length) return false;
    const result = await this.prisma.odOrderComponent.updateMany({
      where: { idDlkOrderComponent: { in: componentIds } },
      data: {
        nameComponent: name && name.trim() ? name.trim() : null,
        fecProcesoModifDl: new Date(),
        desAccion: "U",
      },
    });
    return result.count > 0;
  }

  /**
   * Árbol maestro (MD_PROCESS → MD_SUBPROCESS → MD_ACTIVITIES) para el modal "Crear ruta",
   * scopeado al parent company de la marca de la orden.
   */
  async getRouteMasterTree(orderHeadId: number) {
    const head = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: orderHeadId },
      select: { idDlkOrderHead: true, brand: { select: { idDlkParentCompany: true } } },
    });
    if (!head) return null;
    const idDlkParentCompany = head.brand?.idDlkParentCompany;

    const processes = await this.prisma.mdProcess.findMany({
      where: {
        flgStatutActif: 1,
        ...(idDlkParentCompany ? { idDlkParentCompany } : {}),
      },
      select: {
        idDlkProcess: true,
        codProcess: true,
        nameProcess: true,
        ordenPrecedenciaProcess: true,
        subprocesses: {
          where: { flgStatutActif: 1 },
          select: {
            idDlkSubprocess: true,
            codSubprocess: true,
            nameSubprocess: true,
            ordenPrecedenciaSubprocess: true,
            activities: {
              where: { flgStatutActif: 1 },
              select: {
                idDlkActivities: true,
                codActivities: true,
                nameActivities: true,
                orderActivities: true,
              },
              orderBy: [{ orderActivities: "asc" }, { idDlkActivities: "asc" }],
            },
          },
          orderBy: [{ ordenPrecedenciaSubprocess: "asc" }, { idDlkSubprocess: "asc" }],
        },
      },
      orderBy: [{ ordenPrecedenciaProcess: "asc" }, { idDlkProcess: "asc" }],
    });

    return { processes };
  }

  /**
   * Crea la ruta de producción de uno o varios componentes a partir de los nodos
   * marcados del árbol maestro. Reemplaza la ruta previa de cada componente
   * (delete + insert) y la persiste de forma independiente por componente.
   */
  async createRouteFromMaster(
    orderHeadId: number,
    input: {
      componentIds: number[];
      processIds: number[];
      subprocessIds: number[];
      activityIds: number[];
    }
  ): Promise<{ components: number; processes: number } | null> {
    const comps = await this.prisma.odOrderComponent.findMany({
      where: {
        idDlkOrderComponent: { in: input.componentIds },
        idDlkOrderHead: orderHeadId,
      },
      select: { idDlkOrderComponent: true, codUsuarioCargaDl: true },
    });
    if (!comps.length) return null;

    // Cierre de selección: incluye los padres necesarios para integridad de FK.
    const activityIds = new Set(input.activityIds ?? []);
    const acts = activityIds.size
      ? await this.prisma.mdActivities.findMany({
          where: { idDlkActivities: { in: [...activityIds] } },
        })
      : [];
    const subprocessIds = new Set(input.subprocessIds ?? []);
    acts.forEach((a) => subprocessIds.add(a.idDlkSubprocess));
    const subs = subprocessIds.size
      ? await this.prisma.mdSubprocess.findMany({
          where: { idDlkSubprocess: { in: [...subprocessIds] } },
        })
      : [];
    const processIds = new Set(input.processIds ?? []);
    subs.forEach((s) => processIds.add(s.idDlkProcess));
    const procs = processIds.size
      ? await this.prisma.mdProcess.findMany({
          where: { idDlkProcess: { in: [...processIds] } },
        })
      : [];
    if (!procs.length) {
      throw new Error("Debes seleccionar al menos un proceso");
    }

    // La criticidad maestra puede venir como texto (LOW/MEDIUM/HIGH, BAJA/ALTA)
    // o como código numérico (1=LOW, 2=MEDIUM, 3=HIGH).
    const mapCrit = (v?: string | null): Criticality => {
      const u = (v ?? "").trim().toUpperCase();
      if (["1", "LOW", "BAJA", "BAJO"].includes(u)) return "LOW" as Criticality;
      if (["3", "HIGH", "ALTA", "ALTO"].includes(u)) return "HIGH" as Criticality;
      return "MEDIUM" as Criticality;
    };
    const mapBool = (v?: string | null): number => {
      const u = (v ?? "").trim().toUpperCase();
      return ["1", "SI", "SÍ", "YES", "TRUE", "TERCERIZADO", "X"].includes(u) ? 1 : 0;
    };
    const toInt = (v: unknown): number => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    };

    const sortedProcs = procs
      .slice()
      .sort(
        (a, b) =>
          (a.ordenPrecedenciaProcess ?? 0) - (b.ordenPrecedenciaProcess ?? 0) ||
          a.idDlkProcess - b.idDlkProcess
      );

    await this.prisma.$transaction(async (tx) => {
      for (const comp of comps) {
        const user = comp.codUsuarioCargaDl ?? "SYSTEM";
        // Reemplaza la ruta previa (cascade borra subprocesos/actividades/inputs/outputs).
        await tx.odProcessRoute.deleteMany({
          where: { idDlkOrderComponent: comp.idDlkOrderComponent },
        });

        let pOrd = 0;
        for (const p of sortedProcs) {
          pOrd += 1;
          const pr = await tx.odProcessRoute.create({
            data: {
              idDlkOrderComponent: comp.idDlkOrderComponent,
              ordenPrecedenciaProcess: pOrd,
              codProcess: p.codProcess,
              nameProcess: p.nameProcess,
              criticalityProcess: mapCrit(p.criticalityProcess),
              outsourcedProcess: mapBool(p.outsourcedProcess),
              estimatedTimeProcess: toInt(p.estimatedTimeProcess),
              responsibleUnit: p.responsibleUnit ?? "",
              responsibleProcess: p.responsibleProcess ?? "",
              codUsuarioCargaDl: user,
            },
            select: { idDlkProcessRoute: true },
          });

          const childSubs = subs
            .filter((s) => s.idDlkProcess === p.idDlkProcess)
            .sort(
              (a, b) =>
                (a.ordenPrecedenciaSubprocess ?? 0) - (b.ordenPrecedenciaSubprocess ?? 0) ||
                a.idDlkSubprocess - b.idDlkSubprocess
            );
          let sOrd = 0;
          for (const s of childSubs) {
            sOrd += 1;
            const sr = await tx.odSubprocessRoute.create({
              data: {
                idDlkProcessRoute: pr.idDlkProcessRoute,
                ordenPrecedenciaSubprocess: sOrd,
                codSubprocess: s.codSubprocess,
                nameSubprocess: s.nameSubprocess,
                criticalitySubprocess: mapCrit(s.criticalitySubprocess),
                outsourcedSubprocess: mapBool(s.outsourcedSubprocess),
                estimatedTimeSubprocess: toInt(s.estimatedTimeSubprocess),
                responsibleUnit: s.responsibleUnit ?? null,
                responsibleRole: s.responsibleRole ?? null,
                codUsuarioCargaDl: user,
              },
              select: { idDlkSubprocessRoute: true },
            });

            const childActs = acts
              .filter((a) => a.idDlkSubprocess === s.idDlkSubprocess)
              .sort(
                (a, b) =>
                  (a.orderActivities ?? 0) - (b.orderActivities ?? 0) ||
                  a.idDlkActivities - b.idDlkActivities
              );
            let aOrd = 0;
            for (const a of childActs) {
              aOrd += 1;
              await tx.odActivitiesRoute.create({
                data: {
                  idDlkSubprocessRoute: sr.idDlkSubprocessRoute,
                  codActivities: a.codActivities,
                  nameActivities: a.nameActivities,
                  typeActivities: a.typeActivities,
                  orderActivities: aOrd,
                  estimatedTimeActivities: toInt(a.estimatedTimeActivities),
                  responsibleName: null,
                  codUsuarioCargaDl: user,
                },
              });
            }
          }
        }
      }
    });

    // Sembrar Inputs/Procedimientos/Outputs desde el maestro (proceso/subproceso/actividad)
    // para todas las rutas recién creadas. Idempotente.
    const createdRoutes = await this.prisma.odProcessRoute.findMany({
      where: { idDlkOrderComponent: { in: comps.map((c) => c.idDlkOrderComponent) } },
      select: {
        idDlkProcessRoute: true,
        orderComponent: { select: { codUsuarioCargaDl: true } },
      },
    });
    for (const pr of createdRoutes) {
      await seedRouteIoFromMaster(
        this.prisma,
        pr.idDlkProcessRoute,
        pr.orderComponent?.codUsuarioCargaDl ?? "SYSTEM"
      );
    }

    return { components: comps.length, processes: sortedProcs.length };
  }

  /**
   * Devuelve los códigos de proceso/subproceso/actividad ya instanciados en la ruta
   * de un componente, para pre-marcar el árbol maestro en Editar/Ver.
   */
  async getRouteSelection(componentId: number) {
    const procs = await this.prisma.odProcessRoute.findMany({
      where: { idDlkOrderComponent: componentId },
      select: {
        codProcess: true,
        subprocesses: {
          select: {
            codSubprocess: true,
            activities: { select: { codActivities: true } },
          },
        },
      },
    });
    const processCods = new Set<string>();
    const subprocessCods = new Set<string>();
    const activityCods = new Set<string>();
    for (const p of procs) {
      processCods.add(p.codProcess);
      for (const s of p.subprocesses) {
        subprocessCods.add(s.codSubprocess);
        for (const a of s.activities) activityCods.add(a.codActivities);
      }
    }
    return {
      processCods: Array.from(processCods),
      subprocessCods: Array.from(subprocessCods),
      activityCods: Array.from(activityCods),
    };
  }

  /** Descarga un archivo de suministro (UDP/PROD/FINAL) con un nombre sugerido. */
  async getSuministroFile(
    id: number,
    kind: SuministroFileKind
  ): Promise<{ buffer: Buffer; filename: string } | null> {
    const fields = SUMINISTRO_FIELDS[kind];
    const row = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: id },
      select: {
        codOrderHead: true,
        [fields.blob]: true,
      } as Prisma.OdOrderHeadSelect,
    });
    if (!row) return null;
    const blob = (row as Record<string, unknown>)[fields.blob] as
      | Uint8Array
      | null
      | undefined;
    if (!blob || blob.byteLength === 0) return null;
    const buffer = Buffer.from(blob);
    const base =
      row.codOrderHead?.trim().replace(/[^\w.-]+/g, "_") || `orden-${id}`;
    const filename = `suministro_${base}_${fields.label}.xlsx`;
    return { buffer, filename };
  }

  // ---------- Trazabilidad · nivel Proceso ----------

  /** Lista los procesos instanciados de la ruta de un componente (para Trazabilidad). */
  async listComponentProcessRoutes(orderHeadId: number, componentId: number) {
    const comp = await this.prisma.odOrderComponent.findFirst({
      where: { idDlkOrderComponent: componentId, idDlkOrderHead: orderHeadId },
      select: { idDlkOrderComponent: true },
    });
    if (!comp) return null;
    return this.prisma.odProcessRoute.findMany({
      where: { idDlkOrderComponent: componentId },
      orderBy: { ordenPrecedenciaProcess: "asc" },
      select: {
        idDlkProcessRoute: true,
        codProcess: true,
        nameProcess: true,
        ordenPrecedenciaProcess: true,
      },
    });
  }

  /** Detalle de un proceso de la ruta: campos + inputs/procedimientos/outputs (con nombre de archivo). */
  async getProcessRouteDetail(
    orderHeadId: number,
    componentId: number,
    processRouteId: number
  ) {
    return this.prisma.odProcessRoute.findFirst({
      where: {
        idDlkProcessRoute: processRouteId,
        idDlkOrderComponent: componentId,
        orderComponent: { idDlkOrderHead: orderHeadId },
      },
      select: {
        idDlkProcessRoute: true,
        codProcess: true,
        nameProcess: true,
        criticalityProcess: true,
        outsourcedProcess: true,
        estimatedTimeProcess: true,
        responsibleUnit: true,
        responsibleProcess: true,
        idDlkFacility: true,
        inputTimeProcessRoute: true,
        outputTimeProcessRoute: true,
        inputs: {
          where: { flgStatutActif: 1 },
          orderBy: { idDlkInputProcessRoute: "asc" },
          select: {
            idDlkInputProcessRoute: true,
            codInputProcess: true,
            nameInputProcess: true,
            fileInputProcessRoute: true,
          },
        },
        procedures: {
          where: { flgStatutActif: 1 },
          orderBy: { idDlkProcedureProcess: "asc" },
          select: {
            idDlkProcedureProcess: true,
            codProcedureProcess: true,
            nameProcedureProcess: true,
            fileProcedureProcess: true,
          },
        },
        outputs: {
          where: { flgStatutActif: 1 },
          orderBy: { idDlkOutputProcess: "asc" },
          select: {
            idDlkOutputProcess: true,
            codOutputProcess: true,
            nameOutputProcess: true,
            fileOutputProcessRoute: true,
          },
        },
      },
    });
  }

  /**
   * Guarda en sitio los campos editables del proceso de la ruta (Trazabilidad):
   * Fábrica, Tercerizado, Duración, Responsable e Inicio/Fin.
   */
  async updateProcessRoute(
    orderHeadId: number,
    componentId: number,
    processRouteId: number,
    body: {
      outsourcedProcess?: number | null;
      estimatedTimeProcess?: number | null;
      responsibleProcess?: string | null;
      idDlkFacility?: number | null;
      inputTimeProcessRoute?: string | null;
      outputTimeProcessRoute?: string | null;
    }
  ): Promise<{ idDlkProcessRoute: number } | null> {
    const existing = await this.prisma.odProcessRoute.findFirst({
      where: {
        idDlkProcessRoute: processRouteId,
        idDlkOrderComponent: componentId,
        orderComponent: { idDlkOrderHead: orderHeadId },
      },
      select: { idDlkProcessRoute: true },
    });
    if (!existing) return null;

    const data: Prisma.OdProcessRouteUncheckedUpdateInput = {};
    if (body.outsourcedProcess !== undefined && body.outsourcedProcess !== null) {
      data.outsourcedProcess = Number(body.outsourcedProcess) ? 1 : 0;
    }
    if (body.estimatedTimeProcess !== undefined && body.estimatedTimeProcess !== null) {
      const n = Number(body.estimatedTimeProcess);
      data.estimatedTimeProcess = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
    }
    if (body.responsibleProcess !== undefined) {
      data.responsibleProcess = body.responsibleProcess ?? "";
    }
    if (body.idDlkFacility !== undefined) {
      data.idDlkFacility = body.idDlkFacility == null ? null : Number(body.idDlkFacility);
    }
    if (body.inputTimeProcessRoute !== undefined) {
      data.inputTimeProcessRoute = body.inputTimeProcessRoute
        ? new Date(body.inputTimeProcessRoute)
        : null;
    }
    if (body.outputTimeProcessRoute !== undefined) {
      data.outputTimeProcessRoute = body.outputTimeProcessRoute
        ? new Date(body.outputTimeProcessRoute)
        : null;
    }

    return this.prisma.odProcessRoute.update({
      where: { idDlkProcessRoute: processRouteId },
      data,
      select: { idDlkProcessRoute: true },
    });
  }

  /** Guarda el NOMBRE de archivo de un input/procedimiento/output del proceso (sin binario). */
  async setProcessRouteFileName(
    orderHeadId: number,
    componentId: number,
    processRouteId: number,
    kind: "input" | "procedure" | "output",
    rowId: number,
    fileName: string | null
  ): Promise<boolean> {
    const pr = await this.prisma.odProcessRoute.findFirst({
      where: {
        idDlkProcessRoute: processRouteId,
        idDlkOrderComponent: componentId,
        orderComponent: { idDlkOrderHead: orderHeadId },
      },
      select: { idDlkProcessRoute: true },
    });
    if (!pr) return false;
    const name = fileName && fileName.trim() ? fileName.trim().slice(0, 255) : null;
    if (kind === "input") {
      const r = await this.prisma.odInputProcessRoute.updateMany({
        where: { idDlkInputProcessRoute: rowId, idDlkProcessRoute: processRouteId },
        data: { fileInputProcessRoute: name },
      });
      return r.count > 0;
    }
    if (kind === "procedure") {
      const r = await this.prisma.odProcedureProcessRoute.updateMany({
        where: { idDlkProcedureProcess: rowId, idDlkProcessRoute: processRouteId },
        data: { fileProcedureProcess: name },
      });
      return r.count > 0;
    }
    const r = await this.prisma.odOutputProcessRoute.updateMany({
      where: { idDlkOutputProcess: rowId, idDlkProcessRoute: processRouteId },
      data: { fileOutputProcessRoute: name },
    });
    return r.count > 0;
  }
}
