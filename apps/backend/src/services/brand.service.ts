import type { PrismaClient } from "../../generated/prisma/client.js";

export class BrandService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdBrand.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkBrand: "desc" },
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
    return this.prisma.mdBrand.findUnique({
      where: { idDlkBrand: id },
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
    codBrand?: string;
    idDlkParentCompany: number;
    codParentCompany: string;
    nameBrand: string;
    desBrand?: string | null;
    codUbigeoBrand: number;
    addressBrand: string;
    locationBrand?: string | null;
    emailBrand: string;
    cellularBrand: string;
    facebookBrand?: string | null;
    instagramBrand?: string | null;
    whatsappBrand?: string | null;
    ecommerceBrand?: string | null;
    logoBrand?: string;
    stateBrand?: number;
  }) {
    let codBrand = data.codBrand;
    if (!codBrand) {
      const last = await this.prisma.mdBrand.findFirst({
        orderBy: { idDlkBrand: "desc" },
        select: { codBrand: true },
      });
      const lastNum = last?.codBrand
        ? parseInt(last.codBrand.replace(/\D/g, ""), 10) || 0
        : 0;
      codBrand = `BRA-${lastNum + 1}`;
    }

    return this.prisma.mdBrand.create({
      data: {
        codBrand,
        idDlkParentCompany: data.idDlkParentCompany,
        codParentCompany: data.codParentCompany,
        nameBrand: data.nameBrand,
        desBrand: data.desBrand ?? null,
        codUbigeoBrand: data.codUbigeoBrand,
        addressBrand: data.addressBrand,
        locationBrand: data.locationBrand ?? null,
        emailBrand: data.emailBrand,
        cellularBrand: data.cellularBrand,
        facebookBrand: data.facebookBrand ?? null,
        instagramBrand: data.instagramBrand ?? null,
        whatsappBrand: data.whatsappBrand ?? null,
        ecommerceBrand: data.ecommerceBrand ?? null,
        ...(data.logoBrand
          ? { logoBrand: Buffer.from(data.logoBrand, "base64") }
          : {}),
        stateBrand: data.stateBrand ?? 1,
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
      codBrand: string;
      idDlkParentCompany: number;
      codParentCompany: string;
      nameBrand: string;
      desBrand: string | null;
      codUbigeoBrand: number;
      addressBrand: string;
      locationBrand: string | null;
      emailBrand: string;
      cellularBrand: string;
      facebookBrand: string | null;
      instagramBrand: string | null;
      whatsappBrand: string | null;
      ecommerceBrand: string | null;
      logoBrand: string;
      stateBrand: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codBrand",
      "idDlkParentCompany",
      "codParentCompany",
      "nameBrand",
      "desBrand",
      "codUbigeoBrand",
      "addressBrand",
      "locationBrand",
      "emailBrand",
      "cellularBrand",
      "facebookBrand",
      "instagramBrand",
      "whatsappBrand",
      "ecommerceBrand",
      "stateBrand",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.logoBrand) {
      updateData.logoBrand = Buffer.from(data.logoBrand, "base64");
    }

    return this.prisma.mdBrand.update({
      where: { idDlkBrand: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdBrand.update({
      where: { idDlkBrand: id },
      data: { flgStatutActif: 0, stateBrand: 0, desAccion: "DELETE" },
    });
  }
}

