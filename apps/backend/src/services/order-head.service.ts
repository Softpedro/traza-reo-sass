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
  brand: {
    select: { idDlkBrand: true, nameBrand: true, codBrand: true },
  },
} as const;

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
  brand: { idDlkBrand: number; nameBrand: string; codBrand: string } | null;
};

export type OrderHeadCreateResult = OrderHeadListRow & {
  /** Filas insertadas en OD_ORDER_DETAIL al importar Excel en el mismo POST. */
  importedDetailCount?: number;
};

/** Fila OD_ORDER_DETAIL tal como la expone el API (sin blobs grandes en listados). */
export type OrderDetailListRow = {
  idDlkOrderDetail: number;
  idDlkOrderHead: number | null;
  codOrderDetail: string | null;
  codEstilo: string | null;
  desTela: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  fondoTela: string | null;
  versionTela: string | null;
  orderSample: number | null;
  size00: number | null;
  size1_2: number | null;
  size2: number | null;
  size2_3: number | null;
  size4: number | null;
  size4_5: number | null;
  size5: number | null;
  size6: number | null;
  size7: number | null;
  size8: number | null;
  size9: number | null;
  size10: number | null;
  size11: number | null;
  size12: number | null;
  size13: number | null;
  size14: number | null;
  size15: number | null;
  size16: number | null;
  sizeL: number | null;
  sizeM: number | null;
  sizeS: number | null;
  sizeXl: number | null;
  sizeXs: number | null;
  sizeXxl: number | null;
  sizeXxs: number | null;
  totalEstilo: number | null;
  hasSupplyFile: boolean;
  stateOrderDetail: number | null;
  flgStatutActif: number | null;
};

export class OrderHeadService {
  constructor(private prisma: PrismaClient) {}

  async list(): Promise<OrderHeadListRow[]> {
    const rows = await this.prisma.odOrderHead.findMany({
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
      },
    });
    if (!row) return null;
    const { fileOrderHead: _blob, ...rest } = row;
    return {
      ...rest,
      hasArchivo: row.fileOrderHead != null && row.fileOrderHead.byteLength > 0,
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
        size00: true,
        size1_2: true,
        size2: true,
        size2_3: true,
        size4: true,
        size4_5: true,
        size5: true,
        size6: true,
        size7: true,
        size8: true,
        size9: true,
        size10: true,
        size11: true,
        size12: true,
        size13: true,
        size14: true,
        size15: true,
        size16: true,
        sizeL: true,
        sizeM: true,
        sizeS: true,
        sizeXl: true,
        sizeXs: true,
        sizeXxl: true,
        sizeXxs: true,
        totalEstilo: true,
        supplyFile: true,
        stateOrderDetail: true,
        flgStatutActif: true,
      },
    });

    return rows.map((r) => {
      const { supplyFile, ...rest } = r;
      return {
        ...rest,
        hasSupplyFile: supplyFile != null && supplyFile.byteLength > 0,
      };
    }) as OrderDetailListRow[];
  }

  /** Imagen incrustada importada en OD_ORDER_DETAIL.SUPPLY_FILE (misma cabecera). */
  async getDetailImage(
    headId: number,
    detailId: number
  ): Promise<{ buffer: Buffer; contentType: string } | null> {
    const row = await this.prisma.odOrderDetail.findFirst({
      where: { idDlkOrderDetail: detailId, idDlkOrderHead: headId },
      select: { supplyFile: true },
    });
    if (!row?.supplyFile || row.supplyFile.byteLength === 0) return null;
    const buffer = Buffer.from(row.supplyFile);
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

    const headData: Prisma.OdOrderHeadUncheckedCreateInput = {
      idDlkBrand: body.idDlkBrand,
      codOrderHead: body.codOrderHead.trim(),
      quantityOrderHead: body.quantityOrderHead ?? null,
      fecEntry: parseOptionalDate(body.fecEntry ?? null),
      dateProbableDespatch: parseOptionalDate(body.dateProbableDespatch ?? null),
      fileOrderHead: toBytes(fileBuf),
      stageOrderHead: body.stageOrderHead ?? 1,
      statusStageOrderHead: body.statusStageOrderHead ?? 1,
      stateOrderHead: null,
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
    if (body.quantityOrderHead !== undefined) data.quantityOrderHead = body.quantityOrderHead;
    if (body.fecEntry !== undefined) {
      data.fecEntry = parseOptionalDate(body.fecEntry);
    }
    if (body.dateProbableDespatch !== undefined) {
      data.dateProbableDespatch = parseOptionalDate(body.dateProbableDespatch);
    }
    if (body.stageOrderHead !== undefined) data.stageOrderHead = body.stageOrderHead;
    if (body.statusStageOrderHead !== undefined) data.statusStageOrderHead = body.statusStageOrderHead;
    if (body.flgStatutActif !== undefined) data.flgStatutActif = body.flgStatutActif;
    if (body.codUsuarioCargaDl !== undefined) data.codUsuarioCargaDl = body.codUsuarioCargaDl;

    if (body.clearArchivo) {
      data.fileOrderHead = null;
    } else if (body.archivoBase64?.trim()) {
      const raw = body.archivoBase64.replace(/^data:[^;]+;base64,/, "");
      data.fileOrderHead = toBytes(Buffer.from(raw, "base64"));
    }

    const updated = await this.prisma.odOrderHead.update({
      where: { idDlkOrderHead: id },
      data,
      select: listSelect,
    });
    return updated as unknown as OrderHeadListRow;
  }
}
