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

/**
 * A diferencia de las otras fichas de sostenibilidad, ésta cuelga de la MARCA: son
 * datos de la empresa (fuerza laboral, liderazgo, compromiso OIT), no de una prenda.
 */
const listSelect = {
  idDlkSocialImpact: true,
  idDlkBrand: true,
  codSocialImpact: true,
  socialImpact: true,
  femaleWorkforce: true,
  leadership: true,
  workingConditions: true,
  commitmentOit: true,
  scope: true,
  referenceStandard: true,
  report: true,
  stateSocialImpact: true,
  codUsuarioCargaDl: true,
  fecProcesoCargaDl: true,
  fecProcesoModifDl: true,
  flgStatutActif: true,
  brand: { select: { idDlkBrand: true, codBrand: true, nameBrand: true } },
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

export type SocialImpactInput = {
  idDlkBrand: number;
  socialImpact: string;
  femaleWorkforce?: string | null;
  leadership?: string | null;
  workingConditions?: string | null;
  commitmentOit?: string | null;
  scope?: string | null;
  referenceStandard?: string | null;
  /** Nombre del PDF; `null` lo borra. */
  report?: string | null;
  /** PDF en base64 (data URL o pelado). */
  reportFileBase64?: string | null;
  stateSocialImpact?: number;
  codUsuarioCargaDl?: string;
};

/**
 * Error de negocio con mensaje para el usuario. `errorResponse` oculta el detalle de
 * cualquier excepción (devuelve 500 genérico), así que las rutas lo interceptan antes,
 * igual que hacen con AuthError.
 */
export class SocialImpactError extends Error {
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

/** Campos de texto largos y libres de la ficha. */
const TEXT_FIELDS = [
  "femaleWorkforce",
  "leadership",
  "workingConditions",
  "commitmentOit",
  "scope",
  "referenceStandard",
] as const;

export class SocialImpactService {
  constructor(private prisma: PrismaClient) {}

  /** Fichas cargadas, de la más reciente a la más antigua, con su marca. */
  async list() {
    return this.prisma.odSocialImpact.findMany({
      select: listSelect,
      orderBy: { idDlkSocialImpact: "desc" },
    });
  }

  async getById(id: number) {
    const row = await this.prisma.odSocialImpact.findUnique({
      where: { idDlkSocialImpact: id },
      select: { ...listSelect, reportFile: true },
    });
    return row ? mapDetailForApi(row) : null;
  }

  /** PDF del informe para descarga; `null` si la ficha no existe o no tiene adjunto. */
  async getReportFile(id: number): Promise<{ buffer: Buffer; filename: string } | null> {
    const row = await this.prisma.odSocialImpact.findUnique({
      where: { idDlkSocialImpact: id },
      select: { report: true, reportFile: true, codSocialImpact: true },
    });
    if (!row?.reportFile || row.reportFile.byteLength === 0) return null;
    return {
      buffer: Buffer.from(row.reportFile),
      filename: row.report?.trim() || `${row.codSocialImpact}.pdf`,
    };
  }

  private async assertBrandExists(idDlkBrand: number) {
    const brand = await this.prisma.mdBrand.findUnique({
      where: { idDlkBrand },
      select: { idDlkBrand: true },
    });
    if (!brand) {
      throw new SocialImpactError("VALIDATION", "La marca no existe");
    }
  }

  /** Una sola ficha de impacto social por marca. */
  private async assertNoDuplicate(idDlkBrand: number) {
    const existing = await this.prisma.odSocialImpact.findFirst({
      where: { idDlkBrand },
      select: { idDlkSocialImpact: true },
    });
    if (existing) {
      throw new SocialImpactError(
        "CONFLICT",
        "Esa marca ya tiene cargado su impacto social"
      );
    }
  }

  /** COD_SOCIAL_IMPACT correlativo: SI-1, SI-2… */
  private async nextCode(): Promise<string> {
    const last = await this.prisma.odSocialImpact.findFirst({
      orderBy: { idDlkSocialImpact: "desc" },
      select: { codSocialImpact: true },
    });
    const lastNum = last?.codSocialImpact
      ? parseInt(last.codSocialImpact.replace(/\D/g, ""), 10) || 0
      : 0;
    return `SI-${lastNum + 1}`;
  }

  private reportFileBytes(base64: string): PrismaBytes | null {
    const buf = base64ToBuffer(base64);
    if (buf.length > MAX_REPORT_BYTES) {
      throw new SocialImpactError("VALIDATION", "El informe supera los 10 MB");
    }
    return toBytes(buf);
  }

  async create(data: SocialImpactInput) {
    await this.assertBrandExists(data.idDlkBrand);
    await this.assertNoDuplicate(data.idDlkBrand);

    const created = await this.prisma.odSocialImpact.create({
      data: {
        idDlkBrand: data.idDlkBrand,
        codSocialImpact: await this.nextCode(),
        socialImpact: data.socialImpact,
        femaleWorkforce: data.femaleWorkforce?.trim() || null,
        leadership: data.leadership?.trim() || null,
        workingConditions: data.workingConditions?.trim() || null,
        commitmentOit: data.commitmentOit?.trim() || null,
        scope: data.scope?.trim() || null,
        referenceStandard: data.referenceStandard?.trim() || null,
        report: data.report?.trim() || null,
        ...(data.reportFileBase64
          ? { reportFile: this.reportFileBytes(data.reportFileBase64) }
          : {}),
        stateSocialImpact: data.stateSocialImpact ?? 1,
        codUsuarioCargaDl: data.codUsuarioCargaDl ?? "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(created);
  }

  /**
   * Sólo cambian los datos de la ficha: la marca la identifica, por eso el modal
   * la muestra bloqueada.
   */
  async update(
    id: number,
    data: Partial<Omit<SocialImpactInput, "idDlkBrand"> & { clearReportFile: boolean }>
  ) {
    const current = await this.prisma.odSocialImpact.findUnique({
      where: { idDlkSocialImpact: id },
      select: { idDlkSocialImpact: true },
    });
    if (!current) return null;

    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    if (data.socialImpact !== undefined) updateData.socialImpact = data.socialImpact;
    for (const f of TEXT_FIELDS) {
      if (data[f] !== undefined) updateData[f] = data[f]?.trim() || null;
    }
    for (const f of ["stateSocialImpact", "codUsuarioCargaDl"] as const) {
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

    const updated = await this.prisma.odSocialImpact.update({
      where: { idDlkSocialImpact: id },
      data: updateData,
      select: { ...listSelect, reportFile: true },
    });
    return mapDetailForApi(updated);
  }

  /** Baja lógica: desaparece del listado sin perder el histórico. */
  async softDelete(id: number) {
    return this.prisma.odSocialImpact.update({
      where: { idDlkSocialImpact: id },
      data: { flgStatutActif: 0, stateSocialImpact: 0, desAccion: "DELETE" },
    });
  }
}
