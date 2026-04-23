import { Buffer } from "node:buffer";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import {
  isExcelFilename,
  isProbablyExcelBuffer,
  parseOrderExcelDetails,
} from "./order-excel-parser.js";

type PrismaBytes = Uint8Array<ArrayBuffer>;

function toBytes(buf: Buffer | null): PrismaBytes | null {
  if (!buf || buf.length === 0) return null;
  return Uint8Array.from(buf) as unknown as PrismaBytes;
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
  sizeS: number | null;
  sizeM: number | null;
  sizeL: number | null;
  sizeXl: number | null;
  sizeXxl: number | null;
  totalEstilo: number | null;
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
        sizeS: true,
        sizeM: true,
        sizeL: true,
        sizeXl: true,
        sizeXxl: true,
        totalEstilo: true,
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

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
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
}
