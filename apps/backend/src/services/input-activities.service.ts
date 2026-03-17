import type { PrismaClient } from "../../generated/prisma/client.js";

export class InputActivitiesService {
  constructor(private prisma: PrismaClient) {}

  async listByActivity(idDlkActivities: number) {
    return this.prisma.mdInputActivities.findMany({
      where: { idDlkActivities, flgStatutActif: 1 },
      orderBy: { idDlkInputActivities: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdInputActivities.findUnique({
      where: { idDlkInputActivities: id },
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
    codInputActivities?: string;
    nameInputActivities: string;
    descriptionInputActivities?: string;
    typeInputActivities?: string;
    amountRequiredActivities?: string;
    unitMeasureActivities?: string;
    sourceInputActivities?: string | null;
    technicalSpecActivities?: string | null;
    criticalCheckActivities?: string | null;
    stateInputActivities?: number;
  }) {
    return this.prisma.mdInputActivities.create({
      data: {
        idDlkActivities: data.idDlkActivities,
        codInputActivities: data.codInputActivities?.trim() ?? "",
        nameInputActivities: data.nameInputActivities,
        descriptionInputActivities: data.descriptionInputActivities ?? "",
        typeInputActivities: data.typeInputActivities ?? "",
        amountRequiredActivities: data.amountRequiredActivities ?? "",
        unitMeasureActivities: data.unitMeasureActivities ?? "",
        sourceInputActivities: data.sourceInputActivities ?? null,
        technicalSpecActivities: data.technicalSpecActivities ?? null,
        criticalCheckActivities: data.criticalCheckActivities ?? null,
        stateInputActivities: data.stateInputActivities ?? 1,
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
      codInputActivities: string;
      nameInputActivities: string;
      descriptionInputActivities: string;
      typeInputActivities: string;
      amountRequiredActivities: string;
      unitMeasureActivities: string;
      sourceInputActivities: string | null;
      technicalSpecActivities: string | null;
      criticalCheckActivities: string | null;
      stateInputActivities: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codInputActivities",
      "nameInputActivities",
      "descriptionInputActivities",
      "typeInputActivities",
      "amountRequiredActivities",
      "unitMeasureActivities",
      "sourceInputActivities",
      "technicalSpecActivities",
      "criticalCheckActivities",
      "stateInputActivities",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdInputActivities.update({
      where: { idDlkInputActivities: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdInputActivities.update({
      where: { idDlkInputActivities: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
