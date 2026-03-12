import type { PrismaClient } from "../../generated/prisma/client.js";

export class InputProcessService {
  constructor(private prisma: PrismaClient) {}

  async listByProcess(idDlkProcess: number) {
    return this.prisma.mdInputProcess.findMany({
      where: { idDlkProcess, flgStatutActif: 1 },
      orderBy: { idDlkInputProcess: "asc" },
    });
  }

  async list() {
    return this.prisma.mdInputProcess.findMany({
      where: { flgStatutActif: 1 },
      include: { process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } } },
      orderBy: { idDlkInputProcess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdInputProcess.findUnique({
      where: { idDlkInputProcess: id },
      include: { process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } } },
    });
  }

  async create(data: {
    idDlkProcess: number;
    codInputProcess?: string;
    nameInputProcess: string;
    descriptionInputProcess?: string;
    typeInputProcess?: string;
    originInputProcess?: string;
    amountInputProcess?: string;
    unitQuantity?: string;
    supplierInputProcess?: string | null;
    certificationInputProcess?: string | null;
    observationInputProcess?: string | null;
    stateInputProcess?: number;
  }) {
    return this.prisma.mdInputProcess.create({
      data: {
        idDlkProcess: data.idDlkProcess,
        codInputProcess: data.codInputProcess?.trim() ?? "",
        nameInputProcess: data.nameInputProcess,
        descriptionInputProcess: data.descriptionInputProcess ?? "",
        typeInputProcess: data.typeInputProcess ?? "",
        originInputProcess: data.originInputProcess ?? "",
        amountInputProcess: data.amountInputProcess ?? "",
        unitQuantity: data.unitQuantity ?? "",
        supplierInputProcess: data.supplierInputProcess ?? null,
        certificationInputProcess: data.certificationInputProcess ?? null,
        observationInputProcess: data.observationInputProcess ?? null,
        stateInputProcess: data.stateInputProcess ?? 1,
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
      codInputProcess: string;
      nameInputProcess: string;
      descriptionInputProcess: string;
      typeInputProcess: string;
      originInputProcess: string;
      amountInputProcess: string;
      unitQuantity: string;
      supplierInputProcess: string | null;
      certificationInputProcess: string | null;
      observationInputProcess: string | null;
      stateInputProcess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codInputProcess",
      "nameInputProcess",
      "descriptionInputProcess",
      "typeInputProcess",
      "originInputProcess",
      "amountInputProcess",
      "unitQuantity",
      "supplierInputProcess",
      "certificationInputProcess",
      "observationInputProcess",
      "stateInputProcess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdInputProcess.update({
      where: { idDlkInputProcess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdInputProcess.update({
      where: { idDlkInputProcess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
