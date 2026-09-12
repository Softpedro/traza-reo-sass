import { Buffer } from "node:buffer";
import type { MdBrand, PrismaClient } from "../../generated/prisma/client.js";

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

type BrandWithCompany = MdBrand & {
  parentCompany?: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

function mapBrandForApi(row: BrandWithCompany) {
  // colorFondoImagenDpp y tituloDpp son strings planos → pasan por ...rest sin transformar.
  const { logoBrand, logoDpp, faviconDpp, ...rest } = row;
  return {
    ...rest,
    logoBrand: logoBytesToDataUrl(logoBrand),
    logoDpp: logoBytesToDataUrl(logoDpp),
    faviconDpp: logoBytesToDataUrl(faviconDpp),
  };
}

export class BrandService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.mdBrand.findMany({
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
    return rows.map(mapBrandForApi);
  }

  async getById(id: number) {
    const row = await this.prisma.mdBrand.findUnique({
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
    return row ? mapBrandForApi(row) : null;
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
    subdomainBrand?: string | null;
    /** undefined = no tocar; string = reemplazar; null = borrar. Antes era un chequeo de verdad, así que no había forma de quitar la imagen. */
    logoBrand?: string | null;
    /** undefined = no tocar; string = reemplazar; null = borrar. Antes era un chequeo de verdad, así que no había forma de quitar la imagen. */
    logoDpp?: string | null;
    /** undefined = no tocar; string = reemplazar; null = borrar. Antes era un chequeo de verdad, así que no había forma de quitar la imagen. */
    faviconDpp?: string | null;
    tituloDpp?: string | null;
    colorFondoImagenDpp?: string | null;
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

    type CreateData = Parameters<PrismaClient["mdBrand"]["create"]>[0]["data"];
    const createData: CreateData = {
      codBrand,
      idDlkParentCompany: data.idDlkParentCompany,
      codParentCompany: data.codParentCompany,
      nameBrand: data.nameBrand,
      codUbigeoBrand: data.codUbigeoBrand,
      addressBrand: data.addressBrand,
      locationBrand: data.locationBrand ?? null,
      emailBrand: data.emailBrand,
      cellularBrand: data.cellularBrand,
      facebookBrand: data.facebookBrand ?? null,
      instagramBrand: data.instagramBrand ?? null,
      whatsappBrand: data.whatsappBrand ?? null,
      ecommerceBrand: data.ecommerceBrand ?? null,
      subdomainBrand: data.subdomainBrand ?? null,
      tituloDpp: data.tituloDpp ?? null,
      colorFondoImagenDpp: data.colorFondoImagenDpp ?? null,
      ...(data.logoBrand
        ? { logoBrand: Buffer.from(data.logoBrand, "base64") }
        : {}),
      ...(data.logoDpp ? { logoDpp: Buffer.from(data.logoDpp, "base64") } : {}),
      ...(data.faviconDpp
        ? { faviconDpp: Buffer.from(data.faviconDpp, "base64") }
        : {}),
      stateBrand: data.stateBrand ?? 1,
      codUsuarioCargaDl: "SYSTEM",
      fehProcesoCargaDl: new Date(),
      fehProcesoModifDl: new Date(),
      desAccion: "INSERT",
      flgStatutActif: 1,
    };
    // desBrand exists in schema; add to payload for runtime (client types updated after prisma generate)
    const created = await this.prisma.mdBrand.create({
      data: { ...createData, desBrand: data.desBrand ?? null } as CreateData,
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
    return mapBrandForApi(created);
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
      subdomainBrand: string | null;
      logoBrand: string | null;
      logoDpp: string | null;
      faviconDpp: string | null;
      tituloDpp: string | null;
      colorFondoImagenDpp: string | null;
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
      "subdomainBrand",
      "tituloDpp",
      "colorFondoImagenDpp",
      "stateBrand",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.logoBrand !== undefined) {
      updateData.logoBrand = data.logoBrand ? Buffer.from(data.logoBrand, "base64") : null;
    }
    if (data.logoDpp !== undefined) {
      updateData.logoDpp = data.logoDpp ? Buffer.from(data.logoDpp, "base64") : null;
    }
    if (data.faviconDpp !== undefined) {
      updateData.faviconDpp = data.faviconDpp ? Buffer.from(data.faviconDpp, "base64") : null;
    }

    const updated = await this.prisma.mdBrand.update({
      where: { idDlkBrand: id },
      data: updateData,
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
    return mapBrandForApi(updated);
  }

  async softDelete(id: number) {
    return this.prisma.mdBrand.update({
      where: { idDlkBrand: id },
      data: { flgStatutActif: 0, stateBrand: 0, desAccion: "DELETE" },
    });
  }
}

