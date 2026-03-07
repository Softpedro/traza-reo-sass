import type { PrismaClient } from "../../generated/prisma/client.js";

export class MaquilaService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdMaquila.findMany({
      orderBy: { idDlkMaquila: "desc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdMaquila.findUnique({
      where: { idDlkMaquila: id },
    });
  }

  async create(data: {
    codMaquila?: string;
    codGlnMaquila?: string | null;
    nameMaquila: string;
    categoryMaquila?: number;
    numRucMaquila: string;
    codUbigeo: number;
    addressMaquila: string;
    gpsLocationMaquila?: string | null;
    emailMaquila: string;
    cellularMaquila: string;
    webMaquila?: string;
    canisterDataMaquila?: number;
    canisterAssetsMaquila?: string;
    logoMaquila?: string;
    stateMaquila?: number;
  }) {
    let codMaquila = data.codMaquila;
    if (!codMaquila) {
      const last = await this.prisma.mdMaquila.findFirst({
        orderBy: { idDlkMaquila: "desc" },
        select: { codMaquila: true },
      });
      const lastNum = last?.codMaquila
        ? parseInt(last.codMaquila.replace(/\D/g, ""), 10) || 0
        : 0;
      codMaquila = `MAQ-${lastNum + 1}`;
    }

    return this.prisma.mdMaquila.create({
      data: {
        codMaquila,
        codGlnMaquila: data.codGlnMaquila ?? null,
        nameMaquila: data.nameMaquila,
        categoryMaquila: data.categoryMaquila ?? 0,
        numRucMaquila: data.numRucMaquila,
        codUbigeo: data.codUbigeo,
        addressMaquila: data.addressMaquila,
        gpsLocationMaquila: data.gpsLocationMaquila ?? null,
        emailMaquila: data.emailMaquila,
        cellularMaquila: data.cellularMaquila,
        webMaquila: data.webMaquila ?? "",
        canisterDataMaquila: data.canisterDataMaquila ?? 0,
        canisterAssetsMaquila: data.canisterAssetsMaquila ?? "",
        logoMaquila: data.logoMaquila
          ? Buffer.from(data.logoMaquila, "base64")
          : Buffer.alloc(0),
        stateMaquila: data.stateMaquila ?? 1,
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
      codMaquila: string;
      codGlnMaquila: string | null;
      nameMaquila: string;
      categoryMaquila: number;
      numRucMaquila: string;
      codUbigeo: number;
      addressMaquila: string;
      gpsLocationMaquila: string | null;
      emailMaquila: string;
      cellularMaquila: string;
      webMaquila: string;
      canisterDataMaquila: number;
      canisterAssetsMaquila: string;
      logoMaquila: string;
      stateMaquila: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codMaquila",
      "codGlnMaquila",
      "nameMaquila",
      "categoryMaquila",
      "numRucMaquila",
      "codUbigeo",
      "addressMaquila",
      "gpsLocationMaquila",
      "emailMaquila",
      "cellularMaquila",
      "webMaquila",
      "canisterDataMaquila",
      "canisterAssetsMaquila",
      "stateMaquila",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.logoMaquila) {
      updateData.logoMaquila = Buffer.from(data.logoMaquila, "base64");
    }

    return this.prisma.mdMaquila.update({
      where: { idDlkMaquila: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdMaquila.update({
      where: { idDlkMaquila: id },
      data: { flgStatutActif: 0, stateMaquila: 0, desAccion: "DELETE" },
    });
  }
}

