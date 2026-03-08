import type { PrismaClient } from "../../generated/prisma/client.js";

export class ProductionChainService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdProductionChain.findMany({
      where: { flgStatutActif: 1 },
      orderBy: [{ numPrecedenciaProductiva: "asc" }, { idDlkProductionChain: "asc" }],
    });
  }

  async getById(id: number) {
    return this.prisma.mdProductionChain.findUnique({
      where: { idDlkProductionChain: id },
    });
  }

  async create(data: {
    codProductionChain?: string;
    codCategoryProductionChain?: number;
    numPrecedenciaTrazabilidad?: number;
    numPrecedenciaProductiva?: number;
    nameProductionChain: string;
    desProductionChain?: string;
    stateProductionChain?: number;
  }) {
    let codProductionChain = data.codProductionChain;
    if (!codProductionChain?.trim()) {
      const last = await this.prisma.mdProductionChain.findFirst({
        orderBy: { idDlkProductionChain: "desc" },
        select: { codProductionChain: true },
      });
      const lastNum = last?.codProductionChain
        ? parseInt(last.codProductionChain.replace(/\D/g, ""), 10) || 0
        : 0;
      codProductionChain = `CP-${lastNum + 1}`;
    }

    return this.prisma.mdProductionChain.create({
      data: {
        codProductionChain: codProductionChain.trim(),
        codCategoryProductionChain: data.codCategoryProductionChain ?? 1,
        numPrecedenciaTrazabilidad: data.numPrecedenciaTrazabilidad ?? 1,
        numPrecedenciaProductiva: data.numPrecedenciaProductiva ?? 1,
        nameProductionChain: data.nameProductionChain,
        desProductionChain: data.desProductionChain ?? "",
        stateProductionChain: data.stateProductionChain ?? 1,
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
      codProductionChain: string;
      codCategoryProductionChain: number;
      numPrecedenciaTrazabilidad: number;
      numPrecedenciaProductiva: number;
      nameProductionChain: string;
      desProductionChain: string;
      stateProductionChain: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codProductionChain",
      "codCategoryProductionChain",
      "numPrecedenciaTrazabilidad",
      "numPrecedenciaProductiva",
      "nameProductionChain",
      "desProductionChain",
      "stateProductionChain",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    return this.prisma.mdProductionChain.update({
      where: { idDlkProductionChain: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdProductionChain.update({
      where: { idDlkProductionChain: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
