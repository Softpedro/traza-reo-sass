import type { PrismaClient } from "../../generated/prisma/client.js";

export class ProcedureSubprocessService {
  constructor(private prisma: PrismaClient) {}

  async listBySubprocess(idDlkSubprocess: number) {
    return this.prisma.mdProcedureSubprocess.findMany({
      where: { idDlkSubprocess, flgStatutActif: 1 },
      orderBy: { idDlkProcedureSubprocess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdProcedureSubprocess.findUnique({
      where: { idDlkProcedureSubprocess: id },
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
    codProcedureSubprocess?: string;
    nameProcedureSubprocess: string;
    descriptionProcedureSubprocess?: string;
    typeProcedureSubprocess?: string;
    responsibleProcedureSubprocess?: string;
    estimatedTimeSubprocess?: string;
    criticalitySubprocess?: string;
    validationMethodSubprocess?: string;
    pccSubprocess?: string;
    stateProcedureSubprocess?: number;
  }) {
    return this.prisma.mdProcedureSubprocess.create({
      data: {
        idDlkSubprocess: data.idDlkSubprocess,
        codProcedureSubprocess: data.codProcedureSubprocess?.trim() ?? "",
        nameProcedureSubprocess: data.nameProcedureSubprocess,
        descriptionProcedureSubprocess: data.descriptionProcedureSubprocess ?? "",
        typeProcedureSubprocess: data.typeProcedureSubprocess ?? "",
        responsibleProcedureSubprocess: data.responsibleProcedureSubprocess ?? "",
        estimatedTimeSubprocess: data.estimatedTimeSubprocess ?? "0",
        criticalitySubprocess: data.criticalitySubprocess ?? "",
        validationMethodSubprocess: data.validationMethodSubprocess ?? "",
        pccSubprocess: data.pccSubprocess ?? "",
        stateProcedureSubprocess: data.stateProcedureSubprocess ?? 1,
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
      codProcedureSubprocess: string;
      nameProcedureSubprocess: string;
      descriptionProcedureSubprocess: string;
      typeProcedureSubprocess: string;
      responsibleProcedureSubprocess: string;
      estimatedTimeSubprocess: string;
      criticalitySubprocess: string;
      validationMethodSubprocess: string;
      pccSubprocess: string;
      stateProcedureSubprocess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codProcedureSubprocess",
      "nameProcedureSubprocess",
      "descriptionProcedureSubprocess",
      "typeProcedureSubprocess",
      "responsibleProcedureSubprocess",
      "estimatedTimeSubprocess",
      "criticalitySubprocess",
      "validationMethodSubprocess",
      "pccSubprocess",
      "stateProcedureSubprocess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdProcedureSubprocess.update({
      where: { idDlkProcedureSubprocess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdProcedureSubprocess.update({
      where: { idDlkProcedureSubprocess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
