import { Buffer } from "node:buffer";
import type { PrismaClient } from "../../generated/prisma/client.js";

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
  idDlkRestrictedSubstances: true,
  idDlkOrderDetail: true,
  codRestrictedSubstances: true,
  restrictedSubstances: true,
  topic: true,
  content: true,
  chemicalScope: true,
  report: true,
  stateRestrictedSubstances: true,
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

/**
 * Cambia el blob del informe por un booleano. Sólo lo usan las respuestas de una
 * sola fila: el listado nunca trae los PDFs.
 */
function mapDetailForApi<T extends { reportFile: Uint8Array | null }>(row: T) {
  const { reportFile, ...rest } = row;
  return {
    ...rest,
    hasReportFile: reportFile != null && reportFile.byteLength > 0,
  };
}

export type RestrictedSubstancesInput = {
  idDlkOrderDetail: number;
  restrictedSubstances: string;
  topic?: string | null;
  content?: string | null;
  chemicalScope?: string | null;
  /** Nombre del PDF; `null` lo borra. */
  report?: string | null;
  /** PDF en base64 (data URL o pelado). */
  reportFileBase64?: string | null;
  stateRestrictedSubstances?: number;
  codUsuarioCargaDl?: string;
};

/**
 * Error de negocio con mensaje para el usuario. `errorResponse` oculta el detalle de
 * cualquier excepción (devuelve 500 genérico), así que las rutas lo interceptan antes,
 * igual que hacen con AuthError.
 */
export class RestrictedSubstancesError extends Error {
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

export class RestrictedSubstancesService {
  constructor(private prisma: PrismaClient) {}

  /** Fichas cargadas, de la más reciente a la más antigua, con su orden y marca. */
  async list() {
    return this.prisma.odRestrictedSubstances.findMany({
      select: listSelect,
      orderBy: { idDlkRestrictedSubstances: "desc" },
    });
  }

  async getById(id: number) {
    const row = await this.prisma.odRestrictedSubstances.findUnique({
      where: { idDlkRestrictedSubstances: id },
      select: { ...listSelect, reportFile: true },
    });
    return row ? mapDetailForApi(row) : null;
  }

  /** PDF del informe para descarga; `null` si la ficha no existe o no tiene adjunto. */
  async getReportFile(id: number): Promise<{ buffer: Buffer; filename: string } | null> {
    const row = await this.prisma.odRestrictedSubstances.findUnique({
      where: { idDlkRestrictedSubstances: id },
      select: { report: true, reportFile: true, codRestrictedSubstances: true },
    });
    if (!row?.reportFile || row.reportFile.byteLength === 0) return null;
    return {
      buffer: Buffer.from(row.reportFile),
      filename: row.report?.trim() || `${row.codRestrictedSubstances}.pdf`,
    };
  }

  private async assertOrderDetailExists(idDlkOrderDetail: number) {
    const detail = await this.prisma.odOrderDetail.findUnique({
      where: { idDlkOrderDetail },
      select: { idDlkOrderDetail: true },
    });
    if (!detail) {
      throw new RestrictedSubstancesError("VALIDATION", "La orden de producción no existe");
    }
  }

  /** Una sola ficha por orden de producción (no hay desglose por talla). */
  private async assertNoDuplicate(idDlkOrderDetail: number) {
    const existing = await this.prisma.odRestrictedSubstances.findFirst({
      where: { idDlkOrderDetail },
      select: { idDlkRestrictedSubstances: true },
    });
    if (existing) {
      throw new RestrictedSubstancesError(
        "CONFLICT",
        "Esa orden de producción ya tiene cargadas sus sustancias restringidas"
      );
    }
  }

  /** COD_RESTRICTED_SUBSTANCES correlativo: RS-1, RS-2… */
  private async nextCode(): Promise<string> {
    const last = await this.prisma.odRestrictedSubstances.findFirst({
      orderBy: { idDlkRestrictedSubstances: "desc" },
      select: { codRestrictedSubstances: true },
    });
    const lastNum = last?.codRestrictedSubstances
      ? parseInt(last.codRestrictedSubstances.replace(/\D/g, ""), 10) || 0
      : 0;
    return `RS-${lastNum + 1}`;
  }

  private reportFileBytes(base64: string): PrismaBytes | null {
    const buf = base64ToBuffer(base64);
    if (buf.length > MAX_REPORT_BYTES) {
      throw new RestrictedSubstancesError("VALIDATION", "El informe supera los 10 MB");
    }
    return toBytes(buf);
  }

  async create(data: RestrictedSubstancesInput) {
    await this.assertOrderDetailExists(data.idDlkOrderDetail);
    await this.assertNoDuplicate(data.idDlkOrderDetail);

    const created = await this.prisma.odRestrictedSubstances.create({
      data: {
        idDlkOrderDetail: data.idDlkOrderDetail,
        codRestrictedSubstances: await this.nextCode(),
        restrictedSubstances: data.restrictedSubstances,
        topic: data.topic?.trim() || null,
        content: data.content?.trim() || null,
        chemicalScope: data.chemicalScope?.trim() || null,
        report: data.report?.trim() || null,
        ...(data.reportFileBase64
          ? { reportFile: this.reportFileBytes(data.reportFileBase64) }
          : {}),
        stateRestrictedSubstances: data.stateRestrictedSubstances ?? 1,
        codUsuarioCargaDl: data.codUsuarioCargaDl ?? "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(created);
  }

  /**
   * Sólo cambian los datos de la ficha: la orden de producción la identifica, por eso
   * el modal la muestra bloqueada.
   */
  async update(
    id: number,
    data: Partial<
      Omit<RestrictedSubstancesInput, "idDlkOrderDetail"> & { clearReportFile: boolean }
    >
  ) {
    const current = await this.prisma.odRestrictedSubstances.findUnique({
      where: { idDlkRestrictedSubstances: id },
      select: { idDlkRestrictedSubstances: true },
    });
    if (!current) return null;

    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    if (data.restrictedSubstances !== undefined) {
      updateData.restrictedSubstances = data.restrictedSubstances;
    }
    for (const f of ["topic", "content", "chemicalScope"] as const) {
      if (data[f] !== undefined) updateData[f] = data[f]?.trim() || null;
    }
    for (const f of ["stateRestrictedSubstances", "codUsuarioCargaDl"] as const) {
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

    const updated = await this.prisma.odRestrictedSubstances.update({
      where: { idDlkRestrictedSubstances: id },
      data: updateData,
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(updated);
  }

  /** Baja lógica: desaparece del listado sin perder el histórico. */
  async softDelete(id: number) {
    return this.prisma.odRestrictedSubstances.update({
      where: { idDlkRestrictedSubstances: id },
      data: { flgStatutActif: 0, stateRestrictedSubstances: 0, desAccion: "DELETE" },
    });
  }
}
