import { Buffer } from "node:buffer";
import type { MdUserReo, PrismaClient } from "../../generated/prisma/client.js";

function photoBytesToDataUrl(photo: Uint8Array | Buffer | null | undefined): string | null {
  if (photo == null || photo.byteLength === 0) return null;
  const buf = Buffer.isBuffer(photo) ? photo : Buffer.from(photo);
  const b64 = buf.toString("base64");
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    return `data:image/jpeg;base64,${b64}`;
  }
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return `data:image/png;base64,${b64}`;
  }
  if (buf.length >= 3 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return `data:image/gif;base64,${b64}`;
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return `data:image/webp;base64,${b64}`;
  }
  return `data:image/png;base64,${b64}`;
}

const parentCompanyInclude = {
  select: {
    idDlkParentCompany: true,
    codParentCompany: true,
    nameParentCompany: true,
  },
} as const;

type UserWithCompany = MdUserReo & {
  parentCompany: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

/** Respuesta API: sin contraseña; foto como data URL */
function mapUserForApi(row: UserWithCompany) {
  const { password, photograph, ...rest } = row;
  return {
    ...rest,
    photograph: photoBytesToDataUrl(photograph),
  };
}

export class UserReoService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.mdUserReo.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkUserReo: "desc" },
      include: {
        parentCompany: parentCompanyInclude,
      },
    });
    return rows.map((r) => mapUserForApi(r as UserWithCompany));
  }

  async getById(id: number) {
    const row = await this.prisma.mdUserReo.findUnique({
      where: { idDlkUserReo: id },
      include: {
        parentCompany: parentCompanyInclude,
      },
    });
    return row ? mapUserForApi(row as UserWithCompany) : null;
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

    const created = await this.prisma.mdUserReo.create({
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
      include: { parentCompany: parentCompanyInclude },
    });
    return mapUserForApi(created as UserWithCompany);
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

    const updated = await this.prisma.mdUserReo.update({
      where: { idDlkUserReo: id },
      data: updateData,
      include: { parentCompany: parentCompanyInclude },
    });
    return mapUserForApi(updated as UserWithCompany);
  }

  async softDelete(id: number) {
    return this.prisma.mdUserReo.update({
      where: { idDlkUserReo: id },
      data: { flgStatutActif: 0, stateUser: 0, desAccion: "DELETE" },
    });
  }
}

