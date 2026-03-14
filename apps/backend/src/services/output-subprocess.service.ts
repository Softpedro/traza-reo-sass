import type { PrismaClient } from "../../generated/prisma/client.js";

export class OutputSubprocessService {
  constructor(private prisma: PrismaClient) {}

  async listBySubprocess(idDlkSubprocess: number) {
    return this.prisma.mdOutputSubprocess.findMany({
      where: { idDlkSubprocess, flgStatutActif: 1 },
      orderBy: { idDlkOutputSubprocess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdOutputSubprocess.findUnique({
      where: { idDlkOutputSubprocess: id },
      include: {
        subprocess: {
          include: {
            process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } },
          },
        },
      },
    });
  }

  async create(data: {
    idDlkSubprocess: number;
    codOutputSubprocess?: string;
    nameOutputSubprocess: string;
    descriptionOutputSubprocess?: string;
    typeOutputSubprocess?: string;
    destinationOutputSubprocess?: string;
    amountOutputSubprocess?: string;
    unitQuantity?: string;
    stateOutputSubprocess?: string;
    certificationOutputSubprocess?: string | null;
    observationOutputSubprocess?: string | null;
    stateOutput?: number;
  }) {
    return this.prisma.mdOutputSubprocess.create({
      data: {
        idDlkSubprocess: data.idDlkSubprocess,
        codOutputSubprocess: data.codOutputSubprocess?.trim() ?? "",
        nameOutputSubprocess: data.nameOutputSubprocess,
        descriptionOutputSubprocess: data.descriptionOutputSubprocess ?? "",
        typeOutputSubprocess: data.typeOutputSubprocess ?? "",
        destinationOutputSubprocess: data.destinationOutputSubprocess ?? "",
        amountOutputSubprocess: data.amountOutputSubprocess ?? "",
        unitQuantity: data.unitQuantity ?? "",
        stateOutputSubprocess: data.stateOutputSubprocess ?? "",
        certificationOutputSubprocess: data.certificationOutputSubprocess ?? null,
        observationOutputSubprocess: data.observationOutputSubprocess ?? null,
        stateOutput: data.stateOutput ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        fehProcesoCargaDl: new Date(),
        fehProcesoModifDl: null,
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      codOutputSubprocess: string;
      nameOutputSubprocess: string;
      descriptionOutputSubprocess: string;
      typeOutputSubprocess: string;
      destinationOutputSubprocess: string;
      amountOutputSubprocess: string;
      unitQuantity: string;
      stateOutputSubprocess: string;
      certificationOutputSubprocess: string | null;
      observationOutputSubprocess: string | null;
      stateOutput: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codOutputSubprocess",
      "nameOutputSubprocess",
      "descriptionOutputSubprocess",
      "typeOutputSubprocess",
      "destinationOutputSubprocess",
      "amountOutputSubprocess",
      "unitQuantity",
      "stateOutputSubprocess",
      "certificationOutputSubprocess",
      "observationOutputSubprocess",
      "stateOutput",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdOutputSubprocess.update({
      where: { idDlkOutputSubprocess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdOutputSubprocess.update({
      where: { idDlkOutputSubprocess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
