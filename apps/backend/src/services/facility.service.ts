import type { PrismaClient } from "../../generated/prisma/client.js";

export class FacilityService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdFacility.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkFacility: "desc" },
      include: {
        parentCompany: {
          select: {
            idDlkParentCompany: true,
            codParentCompany: true,
            nameParentCompany: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    return this.prisma.mdFacility.findUnique({
      where: { idDlkFacility: id },
      include: {
        parentCompany: {
          select: {
            idDlkParentCompany: true,
            codParentCompany: true,
            nameParentCompany: true,
          },
        },
      },
    });
  }

  async create(data: {
    codFacility?: string;
    idDlkParentCompany: number;
    codUbigeo: number;
    codGlnFacility: string;
    registryFacility: string;
    identifierFacility: string;
    nameFacility: string;
    addressFacility: string;
    gpsLocationFacility?: string;
    emailFacility: string;
    cellularFacility: string;
    stateFacility?: number;
  }) {
    let codFacility = data.codFacility;
    if (!codFacility) {
      const last = await this.prisma.mdFacility.findFirst({
        orderBy: { idDlkFacility: "desc" },
        select: { codFacility: true },
      });
      const lastNum = last?.codFacility
        ? parseInt(last.codFacility.replace(/\D/g, ""), 10) || 0
        : 0;
      codFacility = `FAB-${lastNum + 1}`;
    }

    return this.prisma.mdFacility.create({
      data: {
        codFacility,
        idDlkParentCompany: data.idDlkParentCompany,
        codUbigeo: data.codUbigeo,
        codGlnFacility: data.codGlnFacility,
        registryFacility: data.registryFacility,
        identifierFacility: data.identifierFacility,
        nameFacility: data.nameFacility,
        addressFacility: data.addressFacility,
        gpsLocationFacility: data.gpsLocationFacility ?? null,
        emailFacility: data.emailFacility,
        cellularFacility: data.cellularFacility,
        stateFacility: data.stateFacility ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      codFacility: string;
      idDlkParentCompany: number;
      codUbigeo: number;
      codGlnFacility: string;
      registryFacility: string;
      identifierFacility: string;
      nameFacility: string;
      addressFacility: string;
      gpsLocationFacility: string | null;
      emailFacility: string;
      cellularFacility: string;
      stateFacility: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codFacility",
      "idDlkParentCompany",
      "codUbigeo",
      "codGlnFacility",
      "registryFacility",
      "identifierFacility",
      "nameFacility",
      "addressFacility",
      "gpsLocationFacility",
      "emailFacility",
      "cellularFacility",
      "stateFacility",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    return this.prisma.mdFacility.update({
      where: { idDlkFacility: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdFacility.update({
      where: { idDlkFacility: id },
      data: { flgStatutActif: 0, stateFacility: 0, desAccion: "DELETE" },
    });
  }
}

