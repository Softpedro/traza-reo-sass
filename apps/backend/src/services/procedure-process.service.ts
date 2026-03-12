import type { PrismaClient } from "../../generated/prisma/client.js";

export class ProcedureProcessService {
  constructor(private prisma: PrismaClient) {}

  async listByProcess(idDlkProcess: number) {
    return this.prisma.mdProcedureProcess.findMany({
      where: { idDlkProcess, flgStatutActif: 1 },
      orderBy: { idDlkProcedureProcess: "asc" },
    });
  }

  async list() {
    return this.prisma.mdProcedureProcess.findMany({
      where: { flgStatutActif: 1 },
      include: { process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } } },
      orderBy: { idDlkProcedureProcess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdProcedureProcess.findUnique({
      where: { idDlkProcedureProcess: id },
      include: { process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } } },
    });
  }

  async create(data: {
    idDlkProcess: number;
    codProcedureProcess?: string;
    nameProcedureProcess: string;
    descriptionProcedureProcess?: string;
    responsibleProcedureProcess?: string;
    timeProcedureProcess?: string;
    criticallyProcedureProcess?: string;
    validationProcedureProcess?: string;
    pccProcedureProcess?: string;
    stateProcedureProcess?: number;
  }) {
    return this.prisma.mdProcedureProcess.create({
      data: {
        idDlkProcess: data.idDlkProcess,
        codProcedureProcess: data.codProcedureProcess?.trim() ?? "",
        nameProcedureProcess: data.nameProcedureProcess,
        descriptionProcedureProcess: data.descriptionProcedureProcess ?? "",
        responsibleProcedureProcess: data.responsibleProcedureProcess ?? "",
        timeProcedureProcess: data.timeProcedureProcess ?? "0",
        criticallyProcedureProcess: data.criticallyProcedureProcess ?? "",
        validationProcedureProcess: data.validationProcedureProcess ?? "",
        pccProcedureProcess: data.pccProcedureProcess ?? "0",
        stateProcedureProcess: data.stateProcedureProcess ?? 1,
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
      codProcedureProcess: string;
      nameProcedureProcess: string;
      descriptionProcedureProcess: string;
      responsibleProcedureProcess: string;
      timeProcedureProcess: string;
      criticallyProcedureProcess: string;
      validationProcedureProcess: string;
      pccProcedureProcess: string;
      stateProcedureProcess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codProcedureProcess",
      "nameProcedureProcess",
      "descriptionProcedureProcess",
      "responsibleProcedureProcess",
      "timeProcedureProcess",
      "criticallyProcedureProcess",
      "validationProcedureProcess",
      "pccProcedureProcess",
      "stateProcedureProcess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdProcedureProcess.update({
      where: { idDlkProcedureProcess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdProcedureProcess.update({
      where: { idDlkProcedureProcess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
