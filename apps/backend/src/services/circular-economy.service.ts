import { Buffer } from "node:buffer";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { imageBytesToDataUrl } from "../lib/images.js";

type PrismaBytes = Uint8Array<ArrayBuffer>;

function toBytes(buf: Buffer | null): PrismaBytes | null {
  if (!buf || buf.length === 0) return null;
  return Uint8Array.from(buf) as unknown as PrismaBytes;
}

/** El archivo viaja como data URL (`data:<tipo>;base64,...`) o base64 pelado. */
function base64ToBuffer(base64: string): Buffer {
  const raw = base64.replace(/^data:[^;]+;base64,/, "");
  return Buffer.from(raw, "base64");
}

/** Tope de cada adjunto: MEDIUMBLOB llega a 16 MB y el body de Express a 15 MB. */
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/**
 * La imagen va en el listado (la tabla la muestra como miniatura), así que se
 * selecciona siempre. El informe no: ese PDF sólo se pide de a una fila.
 */
const listSelect = {
  idDlkCircularEconomy: true,
  idDlkOrderDetail: true,
  codCircularEconomy: true,
  circularEconomy: true,
  image: true,
  imageFile: true,
  description: true,
  topic: true,
  content: true,
  report: true,
  stateCircularEconomy: true,
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

type ImageRow = { imageFile: Uint8Array | null };

/** Los bytes de la imagen salen como data URL; `image` sigue siendo el nombre del archivo. */
function mapForApi<T extends ImageRow>(row: T) {
  const { imageFile, ...rest } = row;
  return { ...rest, imageDataUrl: imageBytesToDataUrl(imageFile) };
}

/** Igual que mapForApi, más el booleano del informe. Sólo para respuestas de una fila. */
function mapDetailForApi<T extends ImageRow & { reportFile: Uint8Array | null }>(row: T) {
  const { reportFile, ...rest } = row;
  return {
    ...mapForApi(rest as unknown as T),
    hasReportFile: reportFile != null && reportFile.byteLength > 0,
  };
}

export type CircularEconomyInput = {
  idDlkOrderDetail: number;
  circularEconomy: string;
  /** Nombre de la imagen; el archivo va en imageBase64. */
  image?: string | null;
  imageBase64?: string | null;
  description?: string | null;
  topic?: string | null;
  content?: string | null;
  /** Nombre del PDF; el archivo va en reportFileBase64. */
  report?: string | null;
  reportFileBase64?: string | null;
  stateCircularEconomy?: number;
  codUsuarioCargaDl?: string;
};

/**
 * Error de negocio con mensaje para el usuario. `errorResponse` oculta el detalle de
 * cualquier excepción (devuelve 500 genérico), así que las rutas lo interceptan antes,
 * igual que hacen con AuthError.
 */
export class CircularEconomyError extends Error {
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

export class CircularEconomyService {
  constructor(private prisma: PrismaClient) {}

  /** Fichas cargadas, de la más reciente a la más antigua, con su orden y marca. */
  async list() {
    const rows = await this.prisma.odCircularEconomy.findMany({
      select: listSelect,
      orderBy: { idDlkCircularEconomy: "desc" },
    });
    return rows.map(mapForApi);
  }

  async getById(id: number) {
    const row = await this.prisma.odCircularEconomy.findUnique({
      where: { idDlkCircularEconomy: id },
      select: { ...listSelect, reportFile: true },
    });
    return row ? mapDetailForApi(row) : null;
  }

  /** PDF del informe para descarga; `null` si la ficha no existe o no tiene adjunto. */
  async getReportFile(id: number): Promise<{ buffer: Buffer; filename: string } | null> {
    const row = await this.prisma.odCircularEconomy.findUnique({
      where: { idDlkCircularEconomy: id },
      select: { report: true, reportFile: true, codCircularEconomy: true },
    });
    if (!row?.reportFile || row.reportFile.byteLength === 0) return null;
    return {
      buffer: Buffer.from(row.reportFile),
      filename: row.report?.trim() || `${row.codCircularEconomy}.pdf`,
    };
  }

  private async assertOrderDetailExists(idDlkOrderDetail: number) {
    const detail = await this.prisma.odOrderDetail.findUnique({
      where: { idDlkOrderDetail },
      select: { idDlkOrderDetail: true },
    });
    if (!detail) {
      throw new CircularEconomyError("VALIDATION", "La orden de producción no existe");
    }
  }

  /** Una sola ficha de economía circular por orden de producción. */
  private async assertNoDuplicate(idDlkOrderDetail: number) {
    const existing = await this.prisma.odCircularEconomy.findFirst({
      where: { idDlkOrderDetail },
      select: { idDlkCircularEconomy: true },
    });
    if (existing) {
      throw new CircularEconomyError(
        "CONFLICT",
        "Esa orden de producción ya tiene cargada su economía circular"
      );
    }
  }

  /** COD_CIRCULAR_ECONOMY correlativo: CE-1, CE-2… */
  private async nextCode(): Promise<string> {
    const last = await this.prisma.odCircularEconomy.findFirst({
      orderBy: { idDlkCircularEconomy: "desc" },
      select: { codCircularEconomy: true },
    });
    const lastNum = last?.codCircularEconomy
      ? parseInt(last.codCircularEconomy.replace(/\D/g, ""), 10) || 0
      : 0;
    return `CE-${lastNum + 1}`;
  }

  private fileBytes(base64: string, label: string): PrismaBytes | null {
    const buf = base64ToBuffer(base64);
    if (buf.length > MAX_FILE_BYTES) {
      throw new CircularEconomyError("VALIDATION", `${label} supera los 10 MB`);
    }
    return toBytes(buf);
  }

  async create(data: CircularEconomyInput) {
    await this.assertOrderDetailExists(data.idDlkOrderDetail);
    await this.assertNoDuplicate(data.idDlkOrderDetail);

    const created = await this.prisma.odCircularEconomy.create({
      data: {
        idDlkOrderDetail: data.idDlkOrderDetail,
        codCircularEconomy: await this.nextCode(),
        circularEconomy: data.circularEconomy,
        image: data.image?.trim() || null,
        ...(data.imageBase64
          ? { imageFile: this.fileBytes(data.imageBase64, "La imagen") }
          : {}),
        description: data.description?.trim() || null,
        topic: data.topic?.trim() || null,
        content: data.content?.trim() || null,
        report: data.report?.trim() || null,
        ...(data.reportFileBase64
          ? { reportFile: this.fileBytes(data.reportFileBase64, "El informe") }
          : {}),
        stateCircularEconomy: data.stateCircularEconomy ?? 1,
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
      Omit<CircularEconomyInput, "idDlkOrderDetail"> & {
        clearImage: boolean;
        clearReportFile: boolean;
      }
    >
  ) {
    const current = await this.prisma.odCircularEconomy.findUnique({
      where: { idDlkCircularEconomy: id },
      select: { idDlkCircularEconomy: true },
    });
    if (!current) return null;

    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    if (data.circularEconomy !== undefined) updateData.circularEconomy = data.circularEconomy;
    for (const f of ["description", "topic", "content"] as const) {
      if (data[f] !== undefined) updateData[f] = data[f]?.trim() || null;
    }
    for (const f of ["stateCircularEconomy", "codUsuarioCargaDl"] as const) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.clearImage) {
      updateData.imageFile = null;
      updateData.image = null;
    } else if (data.imageBase64) {
      updateData.imageFile = this.fileBytes(data.imageBase64, "La imagen");
      if (data.image !== undefined) updateData.image = data.image?.trim() || null;
    } else if (data.image !== undefined) {
      updateData.image = data.image?.trim() || null;
    }

    if (data.clearReportFile) {
      updateData.reportFile = null;
      updateData.report = null;
    } else if (data.reportFileBase64) {
      updateData.reportFile = this.fileBytes(data.reportFileBase64, "El informe");
      if (data.report !== undefined) updateData.report = data.report?.trim() || null;
    } else if (data.report !== undefined) {
      updateData.report = data.report?.trim() || null;
    }

    const updated = await this.prisma.odCircularEconomy.update({
      where: { idDlkCircularEconomy: id },
      data: updateData,
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(updated);
  }

  /** Baja lógica: desaparece del listado sin perder el histórico. */
  async softDelete(id: number) {
    return this.prisma.odCircularEconomy.update({
      where: { idDlkCircularEconomy: id },
      data: { flgStatutActif: 0, stateCircularEconomy: 0, desAccion: "DELETE" },
    });
  }
}
