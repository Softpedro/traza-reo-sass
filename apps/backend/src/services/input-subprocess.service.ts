import type { PrismaClient } from "../../generated/prisma/client.js";

export class InputSubprocessService {
  constructor(private prisma: PrismaClient) {}

  async listBySubprocess(idDlkSubprocess: number) {
    return this.prisma.mdInputSubprocess.findMany({
      where: { idDlkSubprocess, flgStatutActif: 1 },
      orderBy: { idDlkInputSubprocess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdInputSubprocess.findUnique({
      where: { idDlkInputSubprocess: id },
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
    codInputSubprocess?: string;
    nameInputSubprocess: string;
    descriptionInputSubprocess?: string;
    typeInputSubprocess?: string;
    originInputSubprocess?: string;
    amountInputSubprocess?: string;
    unitQuantity?: string;
    supplierInputSubprocess?: string | null;
    certificationInputSubprocess?: string | null;
    observationInputSubprocess?: string | null;
    stateInputSubprocess?: number;
  }) {
    return this.prisma.mdInputSubprocess.create({
      data: {
        idDlkSubprocess: data.idDlkSubprocess,
        codInputSubprocess: data.codInputSubprocess?.trim() ?? "",
        nameInputSubprocess: data.nameInputSubprocess,
        descriptionInputSubprocess: data.descriptionInputSubprocess ?? "",
        typeInputSubprocess: data.typeInputSubprocess ?? "",
        originInputSubprocess: data.originInputSubprocess ?? "",
        amountInputSubprocess: data.amountInputSubprocess ?? "",
        unitQuantity: data.unitQuantity ?? "",
        supplierInputSubprocess: data.supplierInputSubprocess ?? null,
        certificationInputSubprocess: data.certificationInputSubprocess ?? null,
        observationInputSubprocess: data.observationInputSubprocess ?? null,
        stateInputSubprocess: data.stateInputSubprocess ?? 1,
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
      codInputSubprocess: string;
      nameInputSubprocess: string;
      descriptionInputSubprocess: string;
      typeInputSubprocess: string;
      originInputSubprocess: string;
      amountInputSubprocess: string;
      unitQuantity: string;
      supplierInputSubprocess: string | null;
      certificationInputSubprocess: string | null;
      observationInputSubprocess: string | null;
      stateInputSubprocess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codInputSubprocess",
      "nameInputSubprocess",
      "descriptionInputSubprocess",
      "typeInputSubprocess",
      "originInputSubprocess",
      "amountInputSubprocess",
      "unitQuantity",
      "supplierInputSubprocess",
      "certificationInputSubprocess",
      "observationInputSubprocess",
      "stateInputSubprocess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdInputSubprocess.update({
      where: { idDlkInputSubprocess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdInputSubprocess.update({
      where: { idDlkInputSubprocess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
