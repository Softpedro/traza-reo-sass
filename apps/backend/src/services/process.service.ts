import type { PrismaClient } from "../../generated/prisma/client.js";

export class ProcessService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdProcess.findMany({
      where: { flgStatutActif: 1 },
      include: {
        productionChain: true,
        parentCompany: { select: { idDlkParentCompany: true, codParentCompany: true, nameParentCompany: true } },
      },
      orderBy: [{ ordenPrecedenciaProcess: "asc" }, { idDlkProcess: "asc" }],
    });
  }

  async getById(id: number) {
    return this.prisma.mdProcess.findUnique({
      where: { idDlkProcess: id },
      include: {
        productionChain: true,
        parentCompany: { select: { idDlkParentCompany: true, codParentCompany: true, nameParentCompany: true } },
      },
    });
  }

  async create(data: {
    idDlkParentCompany: number;
    idDlkProductionChain: number;
    ordenPrecedenciaProcess?: number;
    codProcess?: string;
    nameProcess: string;
    desProcess?: string;
    objetiveProcess?: string;
    criticalityProcess?: string;
    outsourcedProcess?: string;
    estimatedTimeProcess?: number;
    responsibleUnit?: string;
    responsibleProcess?: string;
    processCertification?: string | null;
    stateProcess?: number;
  }) {
    const orden = data.ordenPrecedenciaProcess ?? 1;
    return this.prisma.mdProcess.create({
      data: {
        idDlkParentCompany: data.idDlkParentCompany,
        idDlkProductionChain: data.idDlkProductionChain,
        ordenPrecedenciaProcess: orden,
        codProcess: data.codProcess?.trim() ?? "",
        nameProcess: data.nameProcess,
        desProcess: data.desProcess ?? "",
        objetiveProcess: data.objetiveProcess ?? "",
        criticalityProcess: data.criticalityProcess ?? "",
        outsourcedProcess: data.outsourcedProcess ?? "",
        estimatedTimeProcess: data.estimatedTimeProcess ?? 0,
        responsibleUnit: data.responsibleUnit ?? "",
        responsibleProcess: data.responsibleProcess ?? "",
        processCertification: data.processCertification ?? null,
        stateProcess: data.stateProcess ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        fehProcesoCargaDl: new Date(),
        fehProcesoModifDl: new Date(),
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      idDlkProductionChain: number;
      ordenPrecedenciaProcess: number;
      codProcess: string;
      nameProcess: string;
      desProcess: string;
      objetiveProcess: string;
      criticalityProcess: string;
      outsourcedProcess: string;
      estimatedTimeProcess: number;
      responsibleUnit: string;
      responsibleProcess: string;
      processCertification: string | null;
      stateProcess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "idDlkProductionChain",
      "ordenPrecedenciaProcess",
      "codProcess",
      "nameProcess",
      "desProcess",
      "objetiveProcess",
      "criticalityProcess",
      "outsourcedProcess",
      "estimatedTimeProcess",
      "responsibleUnit",
      "responsibleProcess",
      "processCertification",
      "stateProcess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdProcess.update({
      where: { idDlkProcess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdProcess.update({
      where: { idDlkProcess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
