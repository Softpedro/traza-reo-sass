import { Buffer } from "node:buffer";
import type { MdMaquila, PrismaClient } from "../../generated/prisma/client.js";

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

export function mapMaquilaForApi(row: MdMaquila) {
  const { logoMaquila, ...rest } = row;
  return {
    ...rest,
    logoMaquila: logoBytesToDataUrl(logoMaquila),
  };
}

export class MaquilaService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.mdMaquila.findMany({
      orderBy: { idDlkMaquila: "desc" },
    });
    return rows.map(mapMaquilaForApi);
  }

  async getById(id: number) {
    const row = await this.prisma.mdMaquila.findUnique({
      where: { idDlkMaquila: id },
    });
    return row ? mapMaquilaForApi(row) : null;
  }

  async create(data: {
    codMaquila?: string;
    codGlnMaquila?: string | null;
    nameMaquila: string;
    categoryMaquila?: number;
    numRucMaquila: string;
    codUbigeo: number;
    addressMaquila: string;
    gpsLocationMaquila?: string | null;
    emailMaquila: string;
    cellularMaquila: string;
    webMaquila?: string;
    canisterDataMaquila?: number;
    canisterAssetsMaquila?: string;
    logoMaquila?: string;
    stateMaquila?: number;
  }) {
    let codMaquila = data.codMaquila;
    if (!codMaquila) {
      const last = await this.prisma.mdMaquila.findFirst({
        orderBy: { idDlkMaquila: "desc" },
        select: { codMaquila: true },
      });
      const lastNum = last?.codMaquila
        ? parseInt(last.codMaquila.replace(/\D/g, ""), 10) || 0
        : 0;
      codMaquila = `MAQ-${lastNum + 1}`;
    }

    const created = await this.prisma.mdMaquila.create({
      data: {
        codMaquila,
        codGlnMaquila: data.codGlnMaquila ?? null,
        nameMaquila: data.nameMaquila,
        categoryMaquila: data.categoryMaquila ?? 0,
        numRucMaquila: data.numRucMaquila,
        codUbigeo: data.codUbigeo,
        addressMaquila: data.addressMaquila,
        gpsLocationMaquila: data.gpsLocationMaquila ?? null,
        emailMaquila: data.emailMaquila,
        cellularMaquila: data.cellularMaquila,
        webMaquila: data.webMaquila ?? "",
        canisterDataMaquila: data.canisterDataMaquila ?? 0,
        canisterAssetsMaquila: data.canisterAssetsMaquila ?? "",
        logoMaquila: data.logoMaquila
          ? Buffer.from(data.logoMaquila, "base64")
          : Buffer.alloc(0),
        stateMaquila: data.stateMaquila ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        fehProcesoCargaDl: new Date(),
        fehProcesoModifDl: new Date(),
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
    return mapMaquilaForApi(created);
  }

  async update(
    id: number,
    data: Partial<{
      codMaquila: string;
      codGlnMaquila: string | null;
      nameMaquila: string;
      categoryMaquila: number;
      numRucMaquila: string;
      codUbigeo: number;
      addressMaquila: string;
      gpsLocationMaquila: string | null;
      emailMaquila: string;
      cellularMaquila: string;
      webMaquila: string;
      canisterDataMaquila: number;
      canisterAssetsMaquila: string;
      logoMaquila: string;
      stateMaquila: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "codMaquila",
      "codGlnMaquila",
      "nameMaquila",
      "categoryMaquila",
      "numRucMaquila",
      "codUbigeo",
      "addressMaquila",
      "gpsLocationMaquila",
      "emailMaquila",
      "cellularMaquila",
      "webMaquila",
      "canisterDataMaquila",
      "canisterAssetsMaquila",
      "stateMaquila",
    ] as const;

    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }

    if (data.logoMaquila) {
      updateData.logoMaquila = Buffer.from(data.logoMaquila, "base64");
    }

    const updated = await this.prisma.mdMaquila.update({
      where: { idDlkMaquila: id },
      data: updateData,
    });
    return mapMaquilaForApi(updated);
  }

  async softDelete(id: number) {
    return this.prisma.mdMaquila.update({
      where: { idDlkMaquila: id },
      data: { flgStatutActif: 0, stateMaquila: 0, desAccion: "DELETE" },
    });
  }
}

