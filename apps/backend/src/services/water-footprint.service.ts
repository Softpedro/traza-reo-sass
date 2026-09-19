import { Buffer } from "node:buffer";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { SIZE_SELECT, sizeLabel, sizeQuantity } from "../lib/sizes.js";

type PrismaBytes = Uint8Array<ArrayBuffer>;

function toBytes(buf: Buffer | null): PrismaBytes | null {
  if (!buf || buf.length === 0) return null;
  return Uint8Array.from(buf) as unknown as PrismaBytes;
}

/** El PDF viaja como data URL (`data:application/pdf;base64,...`) o base64 pelado. */
function base64ToBuffer(base64: string): Buffer {
  const raw = base64.replace(/^data:[^;]+;base64,/, "");
  return Buffer.from(raw, "base64");
}

/** Tope del informe: MEDIUMBLOB llega a 16 MB y el body de Express a 15 MB. */
const MAX_REPORT_BYTES = 10 * 1024 * 1024;

const listSelect = {
  idDlkWaterFootprint: true,
  idDlkOrderDetail: true,
  codWaterFootprint: true,
  size: true,
  weight: true,
  waterFootprint: true,
  estimatedValue: true,
  unitDescription: true,
  scope: true,
  report: true,
  stateWaterFootprint: true,
  codUsuarioCargaDl: true,
  fecProcesoCargaDl: true,
  fecProcesoModifDl: true,
  flgStatutActif: true,
  orderDetail: {
    select: {
      idDlkOrderDetail: true,
      codOrderDetail: true,
      nomEstilo: true,
      colorAway: true,
      fondoTela: true,
      orderHead: {
        select: {
          idDlkOrderHead: true,
          codOrderHead: true,
          brand: { select: { idDlkBrand: true, codBrand: true, nameBrand: true } },
        },
      },
    },
  },
} as const;

type DecimalRow = { weight: unknown; waterFootprint: unknown };

/** Decimal de Prisma → number: el front trabaja con números, no con strings. */
function mapForApi<T extends DecimalRow>(row: T) {
  return {
    ...row,
    weight: row.weight == null ? null : Number(row.weight),
    waterFootprint: row.waterFootprint == null ? null : Number(row.waterFootprint),
  };
}

/**
 * Igual que mapForApi, pero cambia el blob del informe por un booleano. Sólo lo usan
 * las respuestas de una sola fila: el listado nunca trae los PDFs.
 */
function mapDetailForApi<T extends DecimalRow & { reportFile: Uint8Array | null }>(row: T) {
  const { reportFile, ...rest } = row;
  return {
    ...mapForApi(rest as unknown as T),
    hasReportFile: reportFile != null && reportFile.byteLength > 0,
  };
}

export type WaterFootprintInput = {
  idDlkOrderDetail: number;
  size: string;
  weight: number;
  waterFootprint: number;
  estimatedValue?: number;
  unitDescription: string;
  scope: string;
  /** Nombre del PDF; `null` lo borra. */
  report?: string | null;
  /** PDF en base64 (data URL o pelado); `null` borra el adjunto. */
  reportFileBase64?: string | null;
  stateWaterFootprint?: number;
  codUsuarioCargaDl?: string;
};

/**
 * Error de negocio con mensaje para el usuario. `errorResponse` oculta el detalle de
 * cualquier excepción (devuelve 500 genérico), así que las rutas lo interceptan antes,
 * igual que hacen con AuthError.
 */
export class WaterFootprintError extends Error {
  constructor(
    public code: "VALIDATION" | "CONFLICT",
    message: string
  ) {
    super(message);
  }

  get status(): number {
    return this.code === "CONFLICT" ? 409 : 400;
  }
}

export class WaterFootprintService {
  constructor(private prisma: PrismaClient) {}

  /** Huellas cargadas, de la más reciente a la más antigua, con su orden y marca. */
  async list() {
    const rows = await this.prisma.odWaterFootprint.findMany({
      select: listSelect,
      orderBy: { idDlkWaterFootprint: "desc" },
    });
    return rows.map(mapForApi);
  }

  async getById(id: number) {
    const row = await this.prisma.odWaterFootprint.findUnique({
      where: { idDlkWaterFootprint: id },
      select: { ...listSelect, reportFile: true },
    });
    return row ? mapDetailForApi(row) : null;
  }

  /** PDF del informe para descarga; `null` si la huella no existe o no tiene adjunto. */
  async getReportFile(id: number): Promise<{ buffer: Buffer; filename: string } | null> {
    const row = await this.prisma.odWaterFootprint.findUnique({
      where: { idDlkWaterFootprint: id },
      select: { report: true, reportFile: true, codWaterFootprint: true },
    });
    if (!row?.reportFile || row.reportFile.byteLength === 0) return null;
    return {
      buffer: Buffer.from(row.reportFile),
      filename: row.report?.trim() || `${row.codWaterFootprint}.pdf`,
    };
  }

  /**
   * Valida que la talla exista en el colorway con cantidad > 0: el select del
   * modal ya la filtra, pero el endpoint no puede confiar en eso.
   */
  private async assertSizeBelongsToDetail(idDlkOrderDetail: number, size: string) {
    const detail = await this.prisma.odOrderDetail.findUnique({
      where: { idDlkOrderDetail },
      select: SIZE_SELECT,
    });
    if (!detail) {
      throw new WaterFootprintError("VALIDATION", "La orden de producción no existe");
    }
    const label = sizeLabel(size);
    if (!label) {
      throw new WaterFootprintError("VALIDATION", `Talla inválida: ${size}`);
    }
    const qty = sizeQuantity(detail, label);
    if (qty == null || qty <= 0) {
      throw new WaterFootprintError(
        "VALIDATION",
        `La orden de producción no tiene unidades en la talla ${label}`
      );
    }
    return label;
  }

  /** Una sola huella por (orden de producción × talla). */
  private async assertNoDuplicate(idDlkOrderDetail: number, size: string) {
    const existing = await this.prisma.odWaterFootprint.findFirst({
      where: { idDlkOrderDetail, size },
      select: { idDlkWaterFootprint: true },
    });
    if (existing) {
      throw new WaterFootprintError(
        "CONFLICT",
        `Esa orden de producción ya tiene una huella hídrica para la talla ${size}`
      );
    }
  }

  /** COD_WATER_FOOTPRINT correlativo: WF-1, WF-2… */
  private async nextCode(): Promise<string> {
    const last = await this.prisma.odWaterFootprint.findFirst({
      orderBy: { idDlkWaterFootprint: "desc" },
      select: { codWaterFootprint: true },
    });
    const lastNum = last?.codWaterFootprint
      ? parseInt(last.codWaterFootprint.replace(/\D/g, ""), 10) || 0
      : 0;
    return `WF-${lastNum + 1}`;
  }

  private reportFileBytes(base64: string): PrismaBytes | null {
    const buf = base64ToBuffer(base64);
    if (buf.length > MAX_REPORT_BYTES) {
      throw new WaterFootprintError("VALIDATION", "El informe supera los 10 MB");
    }
    return toBytes(buf);
  }

  async create(data: WaterFootprintInput) {
    const size = await this.assertSizeBelongsToDetail(data.idDlkOrderDetail, data.size);
    await this.assertNoDuplicate(data.idDlkOrderDetail, size);

    const created = await this.prisma.odWaterFootprint.create({
      data: {
        idDlkOrderDetail: data.idDlkOrderDetail,
        codWaterFootprint: await this.nextCode(),
        size,
        weight: data.weight,
        waterFootprint: data.waterFootprint,
        estimatedValue: data.estimatedValue ?? 0,
        unitDescription: data.unitDescription,
        scope: data.scope,
        report: data.report?.trim() || null,
        ...(data.reportFileBase64
          ? { reportFile: this.reportFileBytes(data.reportFileBase64) }
          : {}),
        stateWaterFootprint: data.stateWaterFootprint ?? 1,
        codUsuarioCargaDl: data.codUsuarioCargaDl ?? "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(created);
  }

  /**
   * Sólo cambian los datos de la huella: la identidad (orden de producción y talla)
   * queda fija, por eso el modal la muestra bloqueada.
   */
  async update(
    id: number,
    data: Partial<
      Omit<WaterFootprintInput, "idDlkOrderDetail" | "size"> & { clearReportFile: boolean }
    >
  ) {
    const current = await this.prisma.odWaterFootprint.findUnique({
      where: { idDlkWaterFootprint: id },
      select: { idDlkWaterFootprint: true },
    });
    if (!current) return null;

    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "weight",
      "waterFootprint",
      "estimatedValue",
      "unitDescription",
      "scope",
      "stateWaterFootprint",
      "codUsuarioCargaDl",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    if (data.report !== undefined) {
      updateData.report = data.report?.trim() || null;
    }
    if (data.clearReportFile) {
      updateData.reportFile = null;
      updateData.report = null;
    } else if (data.reportFileBase64) {
      updateData.reportFile = this.reportFileBytes(data.reportFileBase64);
    }

    const updated = await this.prisma.odWaterFootprint.update({
      where: { idDlkWaterFootprint: id },
      data: updateData,
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(updated);
  }

  /** Baja lógica: desaparece del listado sin perder el histórico. */
  async softDelete(id: number) {
    return this.prisma.odWaterFootprint.update({
      where: { idDlkWaterFootprint: id },
      data: { flgStatutActif: 0, stateWaterFootprint: 0, desAccion: "DELETE" },
    });
  }
}
