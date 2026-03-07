import type { PrismaClient } from "../../generated/prisma/client.js";

export class FacilityMaquilaService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdFacilityMaquila.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkFacilityMaquila: "desc" },
      include: {
        maquila: {
          select: {
            idDlkMaquila: true,
            codMaquila: true,
            nameMaquila: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    return this.prisma.mdFacilityMaquila.findUnique({
      where: { idDlkFacilityMaquila: id },
      include: {
        maquila: {
          select: {
            idDlkMaquila: true,
            codMaquila: true,
            nameMaquila: true,
          },
        },
      },
    });
  }

  async create(data: {
    codFacilityMaquila?: string;
    idDlkMaquila: number;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
  }) {
    let codFacilityMaquila = data.codFacilityMaquila;
    if (!codFacilityMaquila) {
      const last = await this.prisma.mdFacilityMaquila.findFirst({
        orderBy: { idDlkFacilityMaquila: "desc" },
        select: { codFacilityMaquila: true },
      });
      const lastNum = last?.codFacilityMaquila
        ? parseInt(last.codFacilityMaquila.replace(/\D/g, ""), 10) || 0
        : 0;
      codFacilityMaquila = `FMAQ-${lastNum + 1}`;
    }

    return this.prisma.mdFacilityMaquila.create({
      data: {
        codFacilityMaquila,
        idDlkMaquila: data.idDlkMaquila,
        codMaquila: data.codMaquila,
        codUbigeo: data.codUbigeo,
        codGlnFacilityMaquila: data.codGlnFacilityMaquila ?? null,
        registryFacilityMaquila: data.registryFacilityMaquila,
        identifierFacilityMaquila: data.identifierFacilityMaquila,
        nameFacilityMaquila: data.nameFacilityMaquila,
        addressFacilityMaquila: data.addressFacilityMaquila,
        gpsLocationFacilityMaquila: data.gpsLocationFacilityMaquila ?? null,
        emailFacilityMaquila: data.emailFacilityMaquila,
        cellularFacilityMaquila: data.cellularFacilityMaquila,
        stateFacilityMaquila: data.stateFacilityMaquila ?? 1,
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
      codFacilityMaquila: string;
      idDlkMaquila: number;
      codMaquila: string;
      codUbigeo: number;
      codGlnFacilityMaquila: string | null;
      registryFacilityMaquila: string;
      identifierFacilityMaquila: string;
      nameFacilityMaquila: string;
      addressFacilityMaquila: string;
      gpsLocationFacilityMaquila: string | null;
      emailFacilityMaquila: string;
      cellularFacilityMaquila: string;
      stateFacilityMaquila: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codFacilityMaquila",
      "idDlkMaquila",
      "codMaquila",
      "codUbigeo",
      "codGlnFacilityMaquila",
      "registryFacilityMaquila",
      "identifierFacilityMaquila",
      "nameFacilityMaquila",
      "addressFacilityMaquila",
      "gpsLocationFacilityMaquila",
      "emailFacilityMaquila",
      "cellularFacilityMaquila",
      "stateFacilityMaquila",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    return this.prisma.mdFacilityMaquila.update({
      where: { idDlkFacilityMaquila: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdFacilityMaquila.update({
      where: { idDlkFacilityMaquila: id },
      data: { flgStatutActif: 0, stateFacilityMaquila: 0, desAccion: "DELETE" },
    });
  }
}

