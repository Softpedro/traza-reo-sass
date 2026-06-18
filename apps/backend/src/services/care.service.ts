import { Buffer } from "node:buffer";
import type { MdCare, PrismaClient } from "../../generated/prisma/client.js";

/** Convierte el binario de la imagen de cuidado a data URL para el frontend. */
function imageBytesToDataUrl(img: Uint8Array | Buffer | null | undefined): string | null {
  if (img == null || img.byteLength === 0) return null;
  const buf = Buffer.isBuffer(img) ? img : Buffer.from(img);
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

function mapCareForApi(row: MdCare) {
  const { carImage, ...rest } = row;
  return { ...rest, carImage: imageBytesToDataUrl(carImage) };
}

export class CareService {
  constructor(private prisma: PrismaClient) {}

  /** Cuidados activos de un modelo. */
  async listByModel(modelId: number) {
    const rows = await this.prisma.mdCare.findMany({
      where: { idDlkModel: modelId, flgStatutActif: 1 },
      orderBy: { idDlkCare: "desc" },
    });
    return rows.map(mapCareForApi);
  }

  async getById(id: number) {
    const row = await this.prisma.mdCare.findUnique({ where: { idDlkCare: id } });
    return row ? mapCareForApi(row) : null;
  }

  async create(data: {
    idDlkModel: number;
    codCare?: string;
    nombCare: string;
    carDescription: string;
    carSafety?: string | null;
    /** Imagen en base64 (sin prefijo data:). */
    carImage?: string;
    stateCare?: number;
  }) {
    let codCare = data.codCare;
    if (!codCare) {
      const last = await this.prisma.mdCare.findFirst({
        orderBy: { idDlkCare: "desc" },
        select: { codCare: true },
      });
      const lastNum = last?.codCare ? parseInt(last.codCare.replace(/\D/g, ""), 10) || 0 : 0;
      codCare = `CAR-${lastNum + 1}`;
    }

    const created = await this.prisma.mdCare.create({
      data: {
        idDlkModel: data.idDlkModel,
        codCare,
        nombCare: data.nombCare,
        carDescription: data.carDescription,
        carSafety: data.carSafety ?? null,
        ...(data.carImage ? { carImage: Buffer.from(data.carImage, "base64") } : {}),
        stateCare: data.stateCare ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
    return mapCareForApi(created);
  }

  async update(
    id: number,
    data: Partial<{
      nombCare: string;
      carDescription: string;
      carSafety: string | null;
      carImage: string;
      stateCare: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = ["nombCare", "carDescription", "carSafety", "stateCare"] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    if (data.carImage) {
      updateData.carImage = Buffer.from(data.carImage, "base64");
    }
    const updated = await this.prisma.mdCare.update({
      where: { idDlkCare: id },
      data: updateData,
    });
    return mapCareForApi(updated);
  }

  async softDelete(id: number) {
    return this.prisma.mdCare.update({
      where: { idDlkCare: id },
      data: { flgStatutActif: 0, stateCare: 0, desAccion: "DELETE" },
    });
  }
}
