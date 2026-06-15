import type { PrismaClient } from "../../generated/prisma/client.js";

export type IngestScanInput = {
  url: string;
  scannedAt?: string | null;
  typeEvent?: string | null;
  idItemUnicoIot?: string | null;
  observation?: string | null;
  codUsuario: string;
};

export type IngestScanResult =
  | { idDlkUnitTrace: number }
  | { notFound: true };

export class UnitTraceService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Ingesta un escaneo DPP: resuelve la prenda por su URL (= OD_ORDER_LABEL_DETAIL.urlDppFull)
   * y crea el evento en OD_UNIT_TRACE. Cada escaneo es un evento (no se deduplica).
   * Guarda la URL cruda recibida en urlDppTrace y la hora del escaneo en eventTime.
   */
  async ingestScan(input: IngestScanInput): Promise<IngestScanResult> {
    const url = input.url.trim();
    const unit = await this.prisma.odOrderLabelDetail.findFirst({
      where: { urlDppFull: url },
      select: { idDlkOrderLabelDetail: true },
    });
    if (!unit) return { notFound: true };

    let eventTime: Date | undefined;
    if (input.scannedAt) {
      const d = new Date(input.scannedAt);
      if (!Number.isNaN(d.getTime())) eventTime = d;
    }

    const created = await this.prisma.odUnitTrace.create({
      data: {
        idDlkOrderLabelDetail: unit.idDlkOrderLabelDetail,
        urlDppTrace: url.slice(0, 1000),
        ...(eventTime ? { eventTime } : {}),
        typeEvent: (input.typeEvent?.trim() || "SCAN").slice(0, 50),
        idItemUnicoIot: input.idItemUnicoIot ? input.idItemUnicoIot.slice(0, 50) : null,
        observationUnitTrace: input.observation ? input.observation.slice(0, 255) : null,
        codUsuarioCargaDl: input.codUsuario.slice(0, 20),
      },
      select: { idDlkUnitTrace: true },
    });
    return created;
  }
}
