import type { PrismaClient } from "../../generated/prisma/client.js";

export class OutputProcessService {
  constructor(private prisma: PrismaClient) {}

  async listByProcess(idDlkProcess: number) {
    return this.prisma.mdOutputProcess.findMany({
      where: { idDlkProcess, flgStatutActif: 1 },
      orderBy: { idDlkOutputProcess: "asc" },
    });
  }

  async list() {
    return this.prisma.mdOutputProcess.findMany({
      where: { flgStatutActif: 1 },
      include: { process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } } },
      orderBy: { idDlkOutputProcess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdOutputProcess.findUnique({
      where: { idDlkOutputProcess: id },
      include: { process: { select: { idDlkProcess: true, codProcess: true, nameProcess: true } } },
    });
  }

  async create(data: {
    idDlkProcess: number;
    codOutputProcess?: string;
    nameOutputProcess: string;
    descriptionOutputProcess?: string;
    typeOutputProcess?: string;
    destinationOutputProcess?: string;
    amountOutputProcess?: string;
    unitQuantity?: string;
    stateOutputProcess?: string;
    certificationOutputProcess?: string | null;
    observationOutputProcess?: string | null;
    stateOutput?: number;
  }) {
    return this.prisma.mdOutputProcess.create({
      data: {
        idDlkProcess: data.idDlkProcess,
        codOutputProcess: data.codOutputProcess?.trim() ?? "",
        nameOutputProcess: data.nameOutputProcess,
        descriptionOutputProcess: data.descriptionOutputProcess ?? "",
        typeOutputProcess: data.typeOutputProcess ?? "",
        destinationOutputProcess: data.destinationOutputProcess ?? "",
        amountOutputProcess: data.amountOutputProcess ?? "",
        unitQuantity: data.unitQuantity ?? "",
        stateOutputProcess: data.stateOutputProcess ?? "",
        certificationOutputProcess: data.certificationOutputProcess ?? null,
        observationOutputProcess: data.observationOutputProcess ?? null,
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
      codOutputProcess: string;
      nameOutputProcess: string;
      descriptionOutputProcess: string;
      typeOutputProcess: string;
      destinationOutputProcess: string;
      amountOutputProcess: string;
      unitQuantity: string;
      stateOutputProcess: string;
      certificationOutputProcess: string | null;
      observationOutputProcess: string | null;
      stateOutput: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codOutputProcess",
      "nameOutputProcess",
      "descriptionOutputProcess",
      "typeOutputProcess",
      "destinationOutputProcess",
      "amountOutputProcess",
      "unitQuantity",
      "stateOutputProcess",
      "certificationOutputProcess",
      "observationOutputProcess",
      "stateOutput",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdOutputProcess.update({
      where: { idDlkOutputProcess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdOutputProcess.update({
      where: { idDlkOutputProcess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
