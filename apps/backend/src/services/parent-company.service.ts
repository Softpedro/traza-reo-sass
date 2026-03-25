import { Buffer } from "node:buffer";
import type { MdParentCompany, PrismaClient } from "../../generated/prisma/client.js";

/** Logo en BD (Bytes) → data URL para `<img src>` en el front. */
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

/** Respuesta JSON: logo como data URL (no Buffer) para previsualización en UI. */
export function mapParentCompanyForApi(row: MdParentCompany) {
  const { logoParentCompany, ...rest } = row;
  return {
    ...rest,
    logoParentCompany: logoBytesToDataUrl(logoParentCompany),
  };
}

/** Convierte ubigeo del body (string vacío, número, string) a entero válido para Prisma (nunca NaN). */
export function parseUbigeoParentCompanyInput(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const t = value.trim();
    if (t === "") return 0;
    const n = parseInt(t, 10);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

/** Código REO SaaS (VARCHAR 10); vacío → null */
export function normalizeIdDlkAdmReo(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim().slice(0, 10);
  return s === "" ? null : s;
}

/** 1=Marca Propia, 2=Maquila, 3=Híbrido, 4=Comercializadora */
export function parseTypeParentCompany(value: unknown): number {
  const n = Number(value);
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  return 1;
}

export class ParentCompanyService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const rows = await this.prisma.mdParentCompany.findMany({
      orderBy: { idDlkParentCompany: "desc" },
    });
    return rows.map(mapParentCompanyForApi);
  }

  async getById(id: number) {
    const row = await this.prisma.mdParentCompany.findUnique({
      where: { idDlkParentCompany: id },
    });
    return row ? mapParentCompanyForApi(row) : null;
  }

  async create(data: {
    codParentCompany?: string;
    codGlnParentCompany?: string;
    nameParentCompany: string;
    categoryParentCompany?: number;
    numRucParentCompany?: string;
    codUbigeoParentCompany?: string | number;
    addressParentCompany?: string;
    gpsLocationParentCompany?: string | null;
    /** Alias legado del front (misma columna que gpsLocationParentCompany) */
    locationParentCompany?: string | null;
    emailParentCompany?: string;
    cellularParentCompany?: string;
    webParentCompany?: string;
    canisterDataParentCompany?: string;
    canisterAssetsParentCompany?: string;
    logoParentCompany?: string;
    stateParentCompany?: number;
    idDlkAdmReo?: string | null;
    typeParentCompany?: number;
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

    const codUbigeoParentCompany = parseUbigeoParentCompanyInput(
      data.codUbigeoParentCompany
    );

    const created = await this.prisma.mdParentCompany.create({
      data: {
        codParentCompany,
        idDlkAdmReo: normalizeIdDlkAdmReo(data.idDlkAdmReo),
        typeParentCompany: parseTypeParentCompany(data.typeParentCompany),
        codGlnParentCompany: data.codGlnParentCompany ?? "",
        nameParentCompany: data.nameParentCompany,
        categoryParentCompany: data.categoryParentCompany ?? 0,
        numRucParentCompany: data.numRucParentCompany ?? "",
        codUbigeoParentCompany,
        addressParentCompany: data.addressParentCompany ?? "",
        gpsLocationParentCompany:
          data.gpsLocationParentCompany ??
          data.locationParentCompany ??
          null,
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
      } as never,
    });
    return mapParentCompanyForApi(created);
  }

  async update(
    id: number,
    data: Partial<{
      codParentCompany: string;
      codGlnParentCompany: string;
      nameParentCompany: string;
      categoryParentCompany: number;
      numRucParentCompany: string;
      codUbigeoParentCompany: string | number;
      addressParentCompany: string;
      gpsLocationParentCompany: string | null;
      locationParentCompany: string;
      emailParentCompany: string;
      cellularParentCompany: string;
      webParentCompany: string;
      canisterDataParentCompany: string;
      canisterAssetsParentCompany: string;
      logoParentCompany: string;
      stateParentCompany: number;
      idDlkAdmReo: string | null;
      typeParentCompany: number;
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
      "gpsLocationParentCompany",
      "locationParentCompany",
      "emailParentCompany",
      "cellularParentCompany",
      "webParentCompany",
      "canisterDataParentCompany",
      "canisterAssetsParentCompany",
      "stateParentCompany",
    ] as const;

    for (const f of fields) {
      if (data[f] === undefined) continue;
      if (f === "codUbigeoParentCompany") {
        updateData.codUbigeoParentCompany = parseUbigeoParentCompanyInput(
          data.codUbigeoParentCompany
        );
        continue;
      }
      if (f === "locationParentCompany") {
        updateData.gpsLocationParentCompany = data.locationParentCompany;
        continue;
      }
      if (f === "gpsLocationParentCompany") {
        updateData.gpsLocationParentCompany = data.gpsLocationParentCompany;
        continue;
      }
      updateData[f] = data[f];
    }

    if (data.logoParentCompany) {
      updateData.logoParentCompany = Buffer.from(data.logoParentCompany, "base64");
    }

    if (data.idDlkAdmReo !== undefined) {
      updateData.idDlkAdmReo = normalizeIdDlkAdmReo(data.idDlkAdmReo);
    }
    if (data.typeParentCompany !== undefined) {
      updateData.typeParentCompany = parseTypeParentCompany(data.typeParentCompany);
    }

    // Mantener alineado con el patrón de baja lógica del resto de maestros
    if (data.stateParentCompany !== undefined) {
      const s = Number(data.stateParentCompany);
      updateData.flgStatutActif = s === 1 ? 1 : 0;
    }

    const updated = await this.prisma.mdParentCompany.update({
      where: { idDlkParentCompany: id },
      data: updateData as never,
    });
    return mapParentCompanyForApi(updated);
  }

  async softDelete(id: number) {
    return this.prisma.mdParentCompany.update({
      where: { idDlkParentCompany: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
