import { Buffer } from "node:buffer";
import type { MdSubbrand, PrismaClient } from "../../generated/prisma/client.js";

function logoBytesToDataUrl(logo: Uint8Array | Buffer | null | undefined): string | null {
  if (logo == null || logo.byteLength === 0) return null;
  const buf = Buffer.isBuffer(logo) ? logo : Buffer.from(logo);
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

const brandInclude = {
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

type SubbrandWithBrand = MdSubbrand & {
  brand: {
    idDlkBrand: number;
    codBrand: string;
    nameBrand: string;
    parentCompany: {
      idDlkParentCompany: number;
      codParentCompany: string;
      nameParentCompany: string;
    } | null;
  };
};

function mapSubbrandForApi(row: SubbrandWithBrand) {
  const { logoSubbrand, ...rest } = row;
  return {
    ...rest,
    logoSubbrand: logoBytesToDataUrl(logoSubbrand),
  };
}

export class SubbrandService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.mdSubbrand.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkSubbrand: "desc" },
      include: {
        brand: brandInclude,
      },
    });
    return rows.map((r) => mapSubbrandForApi(r as SubbrandWithBrand));
  }

  async getById(id: number) {
    const row = await this.prisma.mdSubbrand.findUnique({
      where: { idDlkSubbrand: id },
      include: {
        brand: brandInclude,
      },
    });
    return row ? mapSubbrandForApi(row as SubbrandWithBrand) : null;
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

    const created = await this.prisma.mdSubbrand.create({
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
      include: { brand: brandInclude },
    });
    return mapSubbrandForApi(created as SubbrandWithBrand);
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

    const updated = await this.prisma.mdSubbrand.update({
      where: { idDlkSubbrand: id },
      data: updateData,
      include: { brand: brandInclude },
    });
    return mapSubbrandForApi(updated as SubbrandWithBrand);
  }

  async softDelete(id: number) {
    return this.prisma.mdSubbrand.update({
      where: { idDlkSubbrand: id },
      data: { flgStatutActif: 0, stateSubbrand: 0, desAccion: "DELETE" },
    });
  }
}

