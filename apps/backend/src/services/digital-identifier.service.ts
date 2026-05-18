import type { PrismaClient } from "../../generated/prisma/client.js";

/** Campos devueltos al cliente. Se omite SPECIFICATION_DIGITAL_IDENTIFIER (BLOB). */
const selectFields = {
  idDlkDigitalIdentifier: true,
  codDigitalIdentifier: true,
  typeDigitalIdentifier: true,
  materialDigitalIdentifier: true,
  locationDigitalIdentifier: true,
  standardIsoDigitalIdentifier: true,
  supplierDigitalIdentifier: true,
  modelDigitalIdentifier: true,
  observationDigitalIdentifier: true,
  stateDigitalIdentifier: true,
  fecProcesoCargaDl: true,
  fecProcesoModifDl: true,
} as const;

export type DigitalIdentifierCreateInput = {
  codDigitalIdentifier?: string;
  typeDigitalIdentifier?: string | null;
  materialDigitalIdentifier?: string | null;
  locationDigitalIdentifier?: string | null;
  standardIsoDigitalIdentifier?: string | null;
  stateDigitalIdentifier?: number;
  codUsuarioCargaDl?: string;
};

export type DigitalIdentifierUpdateInput = Partial<DigitalIdentifierCreateInput>;

export class DigitalIdentifierService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdDigitalIdentifier.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkDigitalIdentifier: "asc" },
      select: selectFields,
    });
  }

  async getById(id: number) {
    return this.prisma.mdDigitalIdentifier.findUnique({
      where: { idDlkDigitalIdentifier: id },
      select: selectFields,
    });
  }

  /** Genera el siguiente código IDE-N en base al último registro. */
  private async nextCod(): Promise<string> {
    const last = await this.prisma.mdDigitalIdentifier.findFirst({
      orderBy: { idDlkDigitalIdentifier: "desc" },
      select: { codDigitalIdentifier: true },
    });
    const lastNum = last?.codDigitalIdentifier
      ? parseInt(last.codDigitalIdentifier.replace(/\D/g, ""), 10) || 0
      : 0;
    return `IDE-${lastNum + 1}`;
  }

  async create(data: DigitalIdentifierCreateInput) {
    const cod = data.codDigitalIdentifier?.trim() || (await this.nextCod());
    return this.prisma.mdDigitalIdentifier.create({
      data: {
        codDigitalIdentifier: cod,
        typeDigitalIdentifier: data.typeDigitalIdentifier ?? null,
        materialDigitalIdentifier: data.materialDigitalIdentifier ?? null,
        locationDigitalIdentifier: data.locationDigitalIdentifier ?? null,
        standardIsoDigitalIdentifier: data.standardIsoDigitalIdentifier ?? null,
        stateDigitalIdentifier: data.stateDigitalIdentifier ?? 1,
        codUsuarioCargaDl: data.codUsuarioCargaDl ?? "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
      select: selectFields,
    });
  }

  async update(id: number, data: DigitalIdentifierUpdateInput) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    if (data.codDigitalIdentifier !== undefined)
      updateData.codDigitalIdentifier = data.codDigitalIdentifier;
    if (data.typeDigitalIdentifier !== undefined)
      updateData.typeDigitalIdentifier = data.typeDigitalIdentifier;
    if (data.materialDigitalIdentifier !== undefined)
      updateData.materialDigitalIdentifier = data.materialDigitalIdentifier;
    if (data.locationDigitalIdentifier !== undefined)
      updateData.locationDigitalIdentifier = data.locationDigitalIdentifier;
    if (data.standardIsoDigitalIdentifier !== undefined)
      updateData.standardIsoDigitalIdentifier = data.standardIsoDigitalIdentifier;
    if (data.stateDigitalIdentifier !== undefined)
      updateData.stateDigitalIdentifier = data.stateDigitalIdentifier;

    return this.prisma.mdDigitalIdentifier.update({
      where: { idDlkDigitalIdentifier: id },
      data: updateData,
      select: selectFields,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdDigitalIdentifier.update({
      where: { idDlkDigitalIdentifier: id },
      data: { flgStatutActif: 0, stateDigitalIdentifier: 0, desAccion: "DELETE" },
      select: selectFields,
    });
  }
}
