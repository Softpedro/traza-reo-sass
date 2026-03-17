import type { PrismaClient } from "../../generated/prisma/client.js";

export class ProcedureActivitiesService {
  constructor(private prisma: PrismaClient) {}

  async listByActivity(idDlkActivities: number) {
    return this.prisma.mdProcedureActivities.findMany({
      where: { idDlkActivities, flgStatutActif: 1 },
      orderBy: { idDlkProcedureActivities: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdProcedureActivities.findUnique({
      where: { idDlkProcedureActivities: id },
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
    codProcedureActivities?: string;
    nameProcedureActivities: string;
    descriptionProcedureActivities?: string;
    typeProcedureActivities?: string;
    responsibleExecution?: string;
    estimatedTimeProcedure?: string;
    criticalPointActivities?: string;
    safetyRequirement?: string;
    validationMethod?: string;
    stateProcedureActivities?: number;
  }) {
    return this.prisma.mdProcedureActivities.create({
      data: {
        idDlkActivities: data.idDlkActivities,
        codProcedureActivities: data.codProcedureActivities?.trim() ?? "",
        nameProcedureActivities: data.nameProcedureActivities,
        descriptionProcedureActivities: data.descriptionProcedureActivities ?? "",
        typeProcedureActivities: data.typeProcedureActivities ?? "",
        responsibleExecution: data.responsibleExecution ?? "",
        estimatedTimeProcedure: data.estimatedTimeProcedure ?? "0",
        criticalPointActivities: data.criticalPointActivities ?? "",
        safetyRequirement: data.safetyRequirement ?? "",
        validationMethod: data.validationMethod ?? "",
        stateProcedureActivities: data.stateProcedureActivities ?? 1,
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
      codProcedureActivities: string;
      nameProcedureActivities: string;
      descriptionProcedureActivities: string;
      typeProcedureActivities: string;
      responsibleExecution: string;
      estimatedTimeProcedure: string;
      criticalPointActivities: string;
      safetyRequirement: string;
      validationMethod: string;
      stateProcedureActivities: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codProcedureActivities",
      "nameProcedureActivities",
      "descriptionProcedureActivities",
      "typeProcedureActivities",
      "responsibleExecution",
      "estimatedTimeProcedure",
      "criticalPointActivities",
      "safetyRequirement",
      "validationMethod",
      "stateProcedureActivities",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdProcedureActivities.update({
      where: { idDlkProcedureActivities: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdProcedureActivities.update({
      where: { idDlkProcedureActivities: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
