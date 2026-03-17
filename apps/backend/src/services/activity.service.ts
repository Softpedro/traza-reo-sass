import type { PrismaClient } from "../../generated/prisma/client.js";

export class ActivityService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdActivities.findMany({
      where: { flgStatutActif: 1 },
      include: {
        subprocess: {
          include: {
            process: {
              include: {
                productionChain: true,
              },
            },
          },
        },
      },
      orderBy: [
        { subprocess: { process: { ordenPrecedenciaProcess: "asc" } } },
        { subprocess: { ordenPrecedenciaSubprocess: "asc" } },
        { orderActivities: "asc" },
        { idDlkActivities: "asc" },
      ],
    });
  }

  async getById(id: number) {
    return this.prisma.mdActivities.findUnique({
      where: { idDlkActivities: id },
      include: {
        subprocess: {
          include: {
            process: {
              include: {
                productionChain: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    idDlkSubprocess: number;
    codActivities?: string;
    nameActivities: string;
    descriptionActivities?: string;
    typeActivities?: string;
    orderActivities?: number | null;
    estimatedTimeActivities?: string | null;
    machineRequired?: string | null;
    skillRequired?: string | null;
    checklistActivities?: string | null;
    stateActivities?: number;
  }) {
    return this.prisma.mdActivities.create({
      data: {
        idDlkSubprocess: data.idDlkSubprocess,
        codActivities: data.codActivities?.trim() ?? "",
        nameActivities: data.nameActivities,
        descriptionActivities: data.descriptionActivities ?? "",
        typeActivities: data.typeActivities ?? "",
        orderActivities: data.orderActivities ?? null,
        estimatedTimeActivities: data.estimatedTimeActivities ?? null,
        machineRequired: data.machineRequired ?? null,
        skillRequired: data.skillRequired ?? null,
        checklistActivities: data.checklistActivities ?? null,
        stateActivities: data.stateActivities ?? 1,
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
      idDlkSubprocess: number;
      codActivities: string;
      nameActivities: string;
      descriptionActivities: string;
      typeActivities: string;
      orderActivities: number | null;
      estimatedTimeActivities: string | null;
      machineRequired: string | null;
      skillRequired: string | null;
      checklistActivities: string | null;
      stateActivities: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "idDlkSubprocess",
      "codActivities",
      "nameActivities",
      "descriptionActivities",
      "typeActivities",
      "orderActivities",
      "estimatedTimeActivities",
      "machineRequired",
      "skillRequired",
      "checklistActivities",
      "stateActivities",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdActivities.update({
      where: { idDlkActivities: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdActivities.update({
      where: { idDlkActivities: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
