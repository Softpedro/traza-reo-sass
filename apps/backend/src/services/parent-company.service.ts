import type { PrismaClient } from "../../generated/prisma/client.js";

export class ParentCompanyService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdParentCompany.findMany({
      orderBy: { idDlkParentCompany: "desc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdParentCompany.findUnique({
      where: { idDlkParentCompany: id },
    });
  }

  async create(data: {
    codParentCompany?: string;
    codGlnParentCompany?: string;
    nameParentCompany: string;
    categoryParentCompany?: number;
    numRucParentCompany?: string;
    codUbigeoParentCompany?: string;
    addressParentCompany?: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany?: string;
    cellularParentCompany?: string;
    webParentCompany?: string;
    canisterDataParentCompany?: string;
    canisterAssetsParentCompany?: string;
    logoParentCompany?: string;
    stateParentCompany?: number;
  }) {
    let codParentCompany = data.codParentCompany;
    if (!codParentCompany) {
      const last = await this.prisma.mdParentCompany.findFirst({
        orderBy: { idDlkParentCompany: "desc" },
        select: { codParentCompany: true },
      });
      const lastNum = last?.codParentCompany
        ? parseInt(last.codParentCompany.replace(/\D/g, ""), 10) || 0
        : 0;
      codParentCompany = `REO-${lastNum + 1}`;
    }

    return this.prisma.mdParentCompany.create({
      data: {
        codParentCompany,
        codGlnParentCompany: data.codGlnParentCompany ?? "",
        nameParentCompany: data.nameParentCompany,
        categoryParentCompany: data.categoryParentCompany ?? 0,
        numRucParentCompany: data.numRucParentCompany ?? "",
        codUbigeoParentCompany: parseInt(data.codUbigeoParentCompany ?? "0", 10),
        addressParentCompany: data.addressParentCompany ?? "",
        gpsLocationParentCompany: data.gpsLocationParentCompany ?? null,
        emailParentCompany: data.emailParentCompany ?? "",
        cellularParentCompany: data.cellularParentCompany ?? "",
        webParentCompany: data.webParentCompany ?? "",
        canisterDataParentCompany: data.canisterDataParentCompany ?? "",
        canisterAssetsParentCompany: data.canisterAssetsParentCompany ?? "",
        ...(data.logoParentCompany
          ? { logoParentCompany: Buffer.from(data.logoParentCompany, "base64") }
          : {}),
        stateParentCompany: data.stateParentCompany ?? 1,
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
      codParentCompany: string;
      codGlnParentCompany: string;
      nameParentCompany: string;
      categoryParentCompany: number;
      numRucParentCompany: string;
      codUbigeoParentCompany: string;
      addressParentCompany: string;
      locationParentCompany: string;
      emailParentCompany: string;
      cellularParentCompany: string;
      webParentCompany: string;
      canisterDataParentCompany: string;
      canisterAssetsParentCompany: string;
      logoParentCompany: string;
      stateParentCompany: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codParentCompany",
      "codGlnParentCompany",
      "nameParentCompany",
      "categoryParentCompany",
      "numRucParentCompany",
      "codUbigeoParentCompany",
      "addressParentCompany",
      "locationParentCompany",
      "emailParentCompany",
      "cellularParentCompany",
      "webParentCompany",
      "canisterDataParentCompany",
      "canisterAssetsParentCompany",
      "stateParentCompany",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.logoParentCompany) {
      updateData.logoParentCompany = Buffer.from(data.logoParentCompany, "base64");
    }

    return this.prisma.mdParentCompany.update({
      where: { idDlkParentCompany: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdParentCompany.update({
      where: { idDlkParentCompany: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
