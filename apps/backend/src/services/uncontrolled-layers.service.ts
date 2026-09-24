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

/** Tope del certificado: MEDIUMBLOB llega a 16 MB y el body de Express a 15 MB. */
const MAX_CERTIFICATE_BYTES = 10 * 1024 * 1024;

/**
 * Tiers no controladas, todas en OD_UNCONTROLLED_LAYERS:
 *   2 = Producción de materiales (tela): hasta 3 registros por OP, uno por servicio.
 *   3 = Procesamiento de materias primas (hilo): uno por OP.
 *   4 = Origen de la fibra: uno por OP, con ORIGIN.
 */
export const TIERS = [2, 3, 4] as const;
export type Tier = (typeof TIERS)[number];

export function isTier(value: number): value is Tier {
  return (TIERS as readonly number[]).includes(value);
}

/** SERVICE de Tier 2, en el orden en que se procesa la tela. */
export const SERVICE_TEJIDO = 1;
export const SERVICE_TENIDO = 2;
export const SERVICE_ESTAMPADO = 3;
export const TIER2_SERVICES = [SERVICE_TEJIDO, SERVICE_TENIDO, SERVICE_ESTAMPADO] as const;

const SERVICE_LABEL: Record<number, string> = {
  [SERVICE_TEJIDO]: "Tejido",
  [SERVICE_TENIDO]: "Teñido",
  [SERVICE_ESTAMPADO]: "Estampado",
};

const listSelect = {
  idDlkUncontrolledLayers: true,
  idDlkOrderDetail: true,
  codUncontrolledLayers: true,
  tier: true,
  product: true,
  supplier: true,
  service: true,
  origin: true,
  certificate: true,
  transmitter: true,
  certificateNumber: true,
  dateOfIssue: true,
  expirationDate: true,
  startDate: true,
  endDate: true,
  stateUncontrolledLayers: true,
  codUsuarioCargaDl: true,
  fecProcesoCargaDl: true,
  fecProcesoModifDl: true,
  flgStatutActif: true,
  orderDetail: {
    select: {
      idDlkOrderDetail: true,
      codOrderDetail: true,
      nomEstilo: true,
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
 * Cambia el blob del certificado por un booleano. Sólo lo usan las respuestas de una
 * sola fila: el listado nunca trae los PDFs.
 */
function mapDetailForApi<T extends { certificateSheet: Uint8Array | null }>(row: T) {
  const { certificateSheet, ...rest } = row;
  return {
    ...rest,
    hasCertificateSheet: certificateSheet != null && certificateSheet.byteLength > 0,
  };
}

export type UncontrolledLayersInput = {
  idDlkOrderDetail: number;
  tier: Tier;
  product?: string | null;
  supplier?: string | null;
  /** Obligatorio en Tier 2; se ignora en los demás. */
  service?: number | null;
  /** Sólo Tier 4: "DEPARTAMENTO / PAÍS" o "PAÍS". */
  origin?: string | null;
  certificate?: string | null;
  transmitter?: string | null;
  certificateNumber?: string | null;
  dateOfIssue?: Date | null;
  expirationDate?: Date | null;
  /** PDF en base64 (data URL o pelado). */
  certificateSheetBase64?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  stateUncontrolledLayers?: number;
  codUsuarioCargaDl?: string;
};

/** La OP, el tier y el servicio identifican el registro: no se actualizan. */
export type UncontrolledLayersPatch = Partial<
  Omit<UncontrolledLayersInput, "idDlkOrderDetail" | "tier" | "service"> & {
    clearCertificateSheet: boolean;
  }
>;

/**
 * Error de negocio con mensaje para el usuario. `errorResponse` oculta el detalle de
 * cualquier excepción (devuelve 500 genérico), así que las rutas lo interceptan antes.
 */
export class UncontrolledLayersError extends Error {
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

const TEXT_FIELDS = [
  "product",
  "supplier",
  "certificate",
  "transmitter",
  "certificateNumber",
] as const;

const DATE_FIELDS = ["dateOfIssue", "expirationDate", "startDate", "endDate"] as const;

export class UncontrolledLayersService {
  constructor(private prisma: PrismaClient) {}

  /** Registros activos de un tier, del más reciente al más antiguo, con su orden y marca. */
  async list(tier: Tier) {
    return this.prisma.odUncontrolledLayers.findMany({
      where: { tier, flgStatutActif: 1 },
      select: listSelect,
      orderBy: { idDlkUncontrolledLayers: "desc" },
    });
  }

  async getById(id: number) {
    const row = await this.prisma.odUncontrolledLayers.findUnique({
      where: { idDlkUncontrolledLayers: id },
      select: { ...listSelect, certificateSheet: true },
    });
    return row ? mapDetailForApi(row) : null;
  }

  /** PDF del certificado para descarga; `null` si el registro no existe o no tiene adjunto. */
  async getCertificateSheet(id: number): Promise<{ buffer: Buffer; filename: string } | null> {
    const row = await this.prisma.odUncontrolledLayers.findUnique({
      where: { idDlkUncontrolledLayers: id },
      select: { certificateSheet: true, codUncontrolledLayers: true },
    });
    if (!row?.certificateSheet || row.certificateSheet.byteLength === 0) return null;
    return {
      buffer: Buffer.from(row.certificateSheet),
      filename: `${row.codUncontrolledLayers}.pdf`,
    };
  }

  private async assertOrderDetailExists(idDlkOrderDetail: number) {
    const detail = await this.prisma.odOrderDetail.findUnique({
      where: { idDlkOrderDetail },
      select: { idDlkOrderDetail: true },
    });
    if (!detail) {
      throw new UncontrolledLayersError("VALIDATION", "La orden de producción no existe");
    }
  }

  /** Servicios de Tier 2 ya cargados (activos) para la OP. */
  private async tier2Services(idDlkOrderDetail: number): Promise<Set<number>> {
    const rows = await this.prisma.odUncontrolledLayers.findMany({
      where: { idDlkOrderDetail, tier: 2, flgStatutActif: 1 },
      select: { service: true },
    });
    return new Set(rows.map((r) => r.service).filter((s): s is number => s != null));
  }

  /**
   * Tier 2: uno por servicio, y Teñido/Estampado exigen el Tejido previo de la tela.
   * Tier 3 y 4: uno por OP.
   */
  private async assertCanCreate(idDlkOrderDetail: number, tier: Tier, service: number | null) {
    if (tier === 2) {
      if (service == null || !(TIER2_SERVICES as readonly number[]).includes(service)) {
        throw new UncontrolledLayersError("VALIDATION", "Debes seleccionar el servicio");
      }
      const loaded = await this.tier2Services(idDlkOrderDetail);
      if (loaded.has(service)) {
        throw new UncontrolledLayersError(
          "CONFLICT",
          `Esa orden de producción ya tiene cargado el ${SERVICE_LABEL[service]} de tela`
        );
      }
      if (service !== SERVICE_TEJIDO && !loaded.has(SERVICE_TEJIDO)) {
        throw new UncontrolledLayersError(
          "VALIDATION",
          `Primero registrá el Tejido de tela: el ${SERVICE_LABEL[service]} se hace sobre la tela tejida`
        );
      }
      return;
    }

    const existing = await this.prisma.odUncontrolledLayers.findFirst({
      where: { idDlkOrderDetail, tier, flgStatutActif: 1 },
      select: { idDlkUncontrolledLayers: true },
    });
    if (existing) {
      throw new UncontrolledLayersError(
        "CONFLICT",
        `Esa orden de producción ya tiene cargado su Tier ${tier}`
      );
    }
  }

  /** COD_UNCONTROLLED_LAYERS correlativo por tier: T2-1, T3-1, T4-1… */
  private async nextCode(tier: Tier): Promise<string> {
    const last = await this.prisma.odUncontrolledLayers.findFirst({
      where: { tier },
      orderBy: { idDlkUncontrolledLayers: "desc" },
      select: { codUncontrolledLayers: true },
    });
    const lastNum = last?.codUncontrolledLayers
      ? parseInt(last.codUncontrolledLayers.split("-").pop() ?? "", 10) || 0
      : 0;
    return `T${tier}-${lastNum + 1}`;
  }

  private certificateSheetBytes(base64: string): PrismaBytes | null {
    const buf = base64ToBuffer(base64);
    if (buf.length > MAX_CERTIFICATE_BYTES) {
      throw new UncontrolledLayersError("VALIDATION", "El certificado supera los 10 MB");
    }
    return toBytes(buf);
  }

  async create(data: UncontrolledLayersInput) {
    const service = data.tier === 2 ? (data.service ?? null) : null;
    await this.assertOrderDetailExists(data.idDlkOrderDetail);
    await this.assertCanCreate(data.idDlkOrderDetail, data.tier, service);

    const created = await this.prisma.odUncontrolledLayers.create({
      data: {
        idDlkOrderDetail: data.idDlkOrderDetail,
        codUncontrolledLayers: await this.nextCode(data.tier),
        tier: data.tier,
        product: data.product?.trim() || null,
        supplier: data.supplier?.trim() || null,
        // SERVICE sólo aplica a Tier 2 y ORIGIN sólo a Tier 4.
        service,
        origin: data.tier === 4 ? data.origin?.trim() || null : null,
        certificate: data.certificate?.trim() || null,
        transmitter: data.transmitter?.trim() || null,
        certificateNumber: data.certificateNumber?.trim() || null,
        dateOfIssue: data.dateOfIssue ?? null,
        expirationDate: data.expirationDate ?? null,
        ...(data.certificateSheetBase64
          ? { certificateSheet: this.certificateSheetBytes(data.certificateSheetBase64) }
          : {}),
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        stateUncontrolledLayers: data.stateUncontrolledLayers ?? 1,
        codUsuarioCargaDl: data.codUsuarioCargaDl ?? "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
      select: { ...listSelect, certificateSheet: true },
    });
    return mapDetailForApi(created);
  }

  /**
   * Sólo cambian los datos del registro: la OP, el tier y el servicio lo identifican,
   * por eso el modal los muestra bloqueados.
   */
  async update(id: number, data: UncontrolledLayersPatch) {
    const current = await this.prisma.odUncontrolledLayers.findUnique({
      where: { idDlkUncontrolledLayers: id },
      select: { tier: true },
    });
    if (!current) return null;

    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    for (const f of TEXT_FIELDS) {
      if (data[f] !== undefined) updateData[f] = data[f]?.trim() || null;
    }
    for (const f of DATE_FIELDS) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    if (data.origin !== undefined && current.tier === 4) {
      updateData.origin = data.origin?.trim() || null;
    }
    for (const f of ["stateUncontrolledLayers", "codUsuarioCargaDl"] as const) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    if (data.clearCertificateSheet) {
      updateData.certificateSheet = null;
    } else if (data.certificateSheetBase64) {
      updateData.certificateSheet = this.certificateSheetBytes(data.certificateSheetBase64);
    }

    const updated = await this.prisma.odUncontrolledLayers.update({
      where: { idDlkUncontrolledLayers: id },
      data: updateData,
      select: { ...listSelect, certificateSheet: true },
    });
    return mapDetailForApi(updated);
  }

  /**
   * Baja lógica: desaparece del listado sin perder el histórico. El Tejido no se puede
   * dar de baja mientras la OP tenga Teñido o Estampado, que dependen de él.
   */
  async softDelete(id: number) {
    const current = await this.prisma.odUncontrolledLayers.findUnique({
      where: { idDlkUncontrolledLayers: id },
      select: { tier: true, service: true, idDlkOrderDetail: true },
    });
    if (!current) return null;

    if (current.tier === 2 && current.service === SERVICE_TEJIDO) {
      const loaded = await this.tier2Services(current.idDlkOrderDetail);
      if (loaded.has(SERVICE_TENIDO) || loaded.has(SERVICE_ESTAMPADO)) {
        throw new UncontrolledLayersError(
          "CONFLICT",
          "No se puede eliminar el Tejido mientras la OP tenga Teñido o Estampado"
        );
      }
    }

    return this.prisma.odUncontrolledLayers.update({
      where: { idDlkUncontrolledLayers: id },
      data: { flgStatutActif: 0, stateUncontrolledLayers: 0, desAccion: "DELETE" },
    });
  }
}
