import type { PrismaClient } from "../../generated/prisma/client.js";

/** Marca incluida en el listado de modelos (con su empresa). */
const brandSelect = {
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
} as const;

/** Submarca incluida en el listado de modelos. */
const subbrandSelect = {
  select: {
    idDlkSubbrand: true,
    codSubbrand: true,
    nameSubbrand: true,
  },
} as const;

export class ModelService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdModel.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkModel: "desc" },
      include: { brand: brandSelect, subbrand: subbrandSelect },
    });
  }

  async getById(id: number) {
    return this.prisma.mdModel.findUnique({
      where: { idDlkModel: id },
      include: { brand: brandSelect, subbrand: subbrandSelect },
    });
  }
}
