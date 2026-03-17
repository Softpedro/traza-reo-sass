import type { PrismaClient } from "../../generated/prisma/client.js";

export class OutputActivitiesService {
  constructor(private prisma: PrismaClient) {}

  async listByActivity(idDlkActivities: number) {
    return this.prisma.mdOutputActivities.findMany({
      where: { idDlkActivities, flgStatutActif: 1 },
      orderBy: { idDlkOutputActivities: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdOutputActivities.findUnique({
      where: { idDlkOutputActivities: id },
      include: {
        activities: {
          include: {
            subprocess: {
              include: {
                process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } },
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    idDlkActivities: number;
    codOutputActivities?: string;
    nameOutputActivities: string;
    descriptionOutputActivities?: string;
    typeOutputActivities?: string;
    amountExpectedActivities?: string;
    unitMeasureOutput?: string;
    nextDestinationActivities?: string | null;
    qualityStandardActivities?: string | null;
    stateOutputActivities?: number;
  }) {
    return this.prisma.mdOutputActivities.create({
      data: {
        idDlkActivities: data.idDlkActivities,
        codOutputActivities: data.codOutputActivities?.trim() ?? "",
        nameOutputActivities: data.nameOutputActivities,
        descriptionOutputActivities: data.descriptionOutputActivities ?? "",
        typeOutputActivities: data.typeOutputActivities ?? "",
        amountExpectedActivities: data.amountExpectedActivities ?? "",
        unitMeasureOutput: data.unitMeasureOutput ?? "",
        nextDestinationActivities: data.nextDestinationActivities ?? null,
        qualityStandardActivities: data.qualityStandardActivities ?? null,
        stateOutputActivities: data.stateOutputActivities ?? 1,
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
      codOutputActivities: string;
      nameOutputActivities: string;
      descriptionOutputActivities: string;
      typeOutputActivities: string;
      amountExpectedActivities: string;
      unitMeasureOutput: string;
      nextDestinationActivities: string | null;
      qualityStandardActivities: string | null;
      stateOutputActivities: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codOutputActivities",
      "nameOutputActivities",
      "descriptionOutputActivities",
      "typeOutputActivities",
      "amountExpectedActivities",
      "unitMeasureOutput",
      "nextDestinationActivities",
      "qualityStandardActivities",
      "stateOutputActivities",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdOutputActivities.update({
      where: { idDlkOutputActivities: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdOutputActivities.update({
      where: { idDlkOutputActivities: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
