import type { PrismaClient } from "../../generated/prisma/client.js";

export class UserReoService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdUserReo.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkUserReo: "desc" },
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
    return this.prisma.mdUserReo.findUnique({
      where: { idDlkUserReo: id },
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
    codUserReo?: string;
    idDlkParentCompany: number;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: string;
  }) {
    let codUserReo = data.codUserReo;
    if (!codUserReo) {
      const last = await this.prisma.mdUserReo.findFirst({
        orderBy: { idDlkUserReo: "desc" },
        select: { codUserReo: true },
      });
      const lastNum = last?.codUserReo
        ? parseInt(last.codUserReo.replace(/\D/g, ""), 10) || 0
        : 0;
      codUserReo = `US-${lastNum + 1}`;
    }

    return this.prisma.mdUserReo.create({
      data: {
        codUserReo,
        idDlkParentCompany: data.idDlkParentCompany,
        codParentCompany: data.codParentCompany,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        nameUser: data.nameUser,
        paternalLastNameUser: data.paternalLastNameUser,
        maternalLastNameUser: data.maternalLastNameUser,
        sexUser: data.sexUser,
        positionUser: data.positionUser,
        rolUser: data.rolUser,
        emailUser: data.emailUser,
        cellularUser: data.cellularUser,
        userLogin: data.userLogin,
        // TODO: aplicar hash de contraseña en producción
        password: data.password,
        ...(data.photograph
          ? { photograph: Buffer.from(data.photograph, "base64") }
          : {}),
        failedAttempts: 0,
        isLocked: 0,
        stateUser: 1,
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
      idDlkParentCompany: number;
      codParentCompany: string;
      documentType: number;
      documentNumber: string;
      nameUser: string;
      paternalLastNameUser: string;
      maternalLastNameUser: string;
      sexUser: string;
      positionUser: number;
      rolUser: number;
      emailUser: string;
      cellularUser: string;
      userLogin: string;
      password: string;
      photograph: string;
      isLocked: number;
      stateUser: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "idDlkParentCompany",
      "codParentCompany",
      "documentType",
      "documentNumber",
      "nameUser",
      "paternalLastNameUser",
      "maternalLastNameUser",
      "sexUser",
      "positionUser",
      "rolUser",
      "emailUser",
      "cellularUser",
      "userLogin",
      "isLocked",
      "stateUser",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.password) {
      updateData.password = data.password;
    }

    if (data.photograph) {
      updateData.photograph = Buffer.from(data.photograph, "base64");
    }

    return this.prisma.mdUserReo.update({
      where: { idDlkUserReo: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdUserReo.update({
      where: { idDlkUserReo: id },
      data: { flgStatutActif: 0, stateUser: 0, desAccion: "DELETE" },
    });
  }
}

