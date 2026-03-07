import type { PrismaClient } from "../../generated/prisma/client.js";

export class SubbrandService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdSubbrand.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkSubbrand: "desc" },
      include: {
        brand: {
          select: {
            idDlkBrand: true,
            codBrand: true,
            nameBrand: true,
            parentCompany: {
              select: {
                idDlkParentCompany: true,
                codParentCompany: true,
                nameParentCompany: true,
              },
            },
          },
        },
      },
    });
  }

  async getById(id: number) {
    return this.prisma.mdSubbrand.findUnique({
      where: { idDlkSubbrand: id },
      include: {
        brand: {
          select: {
            idDlkBrand: true,
            codBrand: true,
            nameBrand: true,
            parentCompany: {
              select: {
                idDlkParentCompany: true,
                codParentCompany: true,
                nameParentCompany: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    codSubbrand?: string;
    idDlkBrand: number;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: string;
    stateSubbrand?: number;
  }) {
    let codSubbrand = data.codSubbrand;
    if (!codSubbrand) {
      const last = await this.prisma.mdSubbrand.findFirst({
        orderBy: { idDlkSubbrand: "desc" },
        select: { codSubbrand: true },
      });
      const lastNum = last?.codSubbrand
        ? parseInt(last.codSubbrand.replace(/\D/g, ""), 10) || 0
        : 0;
      codSubbrand = `SBRA-${lastNum + 1}`;
    }

    return this.prisma.mdSubbrand.create({
      data: {
        codSubbrand,
        idDlkBrand: data.idDlkBrand,
        codBrand: data.codBrand,
        nameSubbrand: data.nameSubbrand,
        codUbigeoSubbrand: data.codUbigeoSubbrand,
        addressSubbrand: data.addressSubbrand,
        locationSubbrand: data.locationSubbrand ?? null,
        emailSubbrand: data.emailSubbrand,
        cellularSubbrand: data.cellularSubbrand,
        facebookSubbrand: data.facebookSubbrand ?? null,
        instagramSubbrand: data.instagramSubbrand ?? null,
        whatsappSubbrand: data.whatsappSubbrand ?? null,
        ecommerceSubbrand: data.ecommerceSubbrand ?? null,
        ...(data.logoSubbrand
          ? { logoSubbrand: Buffer.from(data.logoSubbrand, "base64") }
          : {}),
        stateSubbrand: data.stateSubbrand ?? 1,
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
      codSubbrand: string;
      idDlkBrand: number;
      codBrand: string;
      nameSubbrand: string;
      codUbigeoSubbrand: number;
      addressSubbrand: string;
      locationSubbrand: string | null;
      emailSubbrand: string;
      cellularSubbrand: string;
      facebookSubbrand: string | null;
      instagramSubbrand: string | null;
      whatsappSubbrand: string | null;
      ecommerceSubbrand: string | null;
      logoSubbrand: string;
      stateSubbrand: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codSubbrand",
      "idDlkBrand",
      "codBrand",
      "nameSubbrand",
      "codUbigeoSubbrand",
      "addressSubbrand",
      "locationSubbrand",
      "emailSubbrand",
      "cellularSubbrand",
      "facebookSubbrand",
      "instagramSubbrand",
      "whatsappSubbrand",
      "ecommerceSubbrand",
      "stateSubbrand",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.logoSubbrand) {
      updateData.logoSubbrand = Buffer.from(data.logoSubbrand, "base64");
    }

    return this.prisma.mdSubbrand.update({
      where: { idDlkSubbrand: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdSubbrand.update({
      where: { idDlkSubbrand: id },
      data: { flgStatutActif: 0, stateSubbrand: 0, desAccion: "DELETE" },
    });
  }
}

