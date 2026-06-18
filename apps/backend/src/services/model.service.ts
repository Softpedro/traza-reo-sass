import { Buffer } from "node:buffer";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";

/** Convierte binario de imagen a data URL para el frontend. */
function imageBytesToDataUrl(img: Uint8Array | Buffer | null | undefined): string | null {
  if (img == null || img.byteLength === 0) return null;
  const buf = Buffer.isBuffer(img) ? img : Buffer.from(img);
  const b64 = buf.toString("base64");
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) return `data:image/jpeg;base64,${b64}`;
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

const brandSelect = {
  select: {
    idDlkBrand: true,
    codBrand: true,
    nameBrand: true,
    parentCompany: {
      select: { idDlkParentCompany: true, codParentCompany: true, nameParentCompany: true },
    },
  },
} as const;

const subbrandSelect = {
  select: { idDlkSubbrand: true, codSubbrand: true, nameSubbrand: true },
} as const;

type PieceImageInput = { imageType: string; base64?: string | null };
type PieceInput = { namePiece: string; images?: PieceImageInput[] };

/** Campos escalares editables del modelo (todos opcionales para create/update). */
type ModelScalars = Partial<{
  idDlkBrand: number;
  idDlkSubbrand: number | null;
  nameModel: string | null;
  desModel: string | null;
  nameCollection: string | null;
  desCollection: string | null;
  categoryModel: string | null;
  materialModel: string | null;
  compositionModel: string | null;
  colorway: string | null;
  fondoTela: string | null;
  versionTela: number | null;
  year: number | null;
  season: string | null;
  sizeModel: string | null;
  isSet: number | null;
  nroPieces: number | null;
  careModel: string | null;
  technicalSpecification: string | null;
  stateModel: number;
}>;

type CreateModelInput = ModelScalars & {
  idDlkBrand: number;
  codModel?: string;
  /** PDF de ficha técnica en base64 (sin prefijo data:). */
  fichaBase64?: string | null;
  pieces?: PieceInput[];
};

type UpdateModelInput = ModelScalars & {
  /** undefined = no tocar; string = reemplazar; null = borrar. */
  fichaBase64?: string | null;
  /** undefined = no tocar piezas; array = reemplazar piezas+imágenes. */
  pieces?: PieceInput[];
};

const SCALAR_FIELDS = [
  "idDlkBrand",
  "idDlkSubbrand",
  "nameModel",
  "desModel",
  "nameCollection",
  "desCollection",
  "categoryModel",
  "materialModel",
  "compositionModel",
  "colorway",
  "fondoTela",
  "versionTela",
  "year",
  "season",
  "sizeModel",
  "isSet",
  "nroPieces",
  "careModel",
  "technicalSpecification",
  "stateModel",
] as const;

export class ModelService {
  constructor(private prisma: PrismaClient) {}

  /** Listado liviano (sin piezas/imágenes/ficha). */
  async list() {
    return this.prisma.mdModel.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkModel: "desc" },
      include: { brand: brandSelect, subbrand: subbrandSelect },
    });
  }

  /** Detalle con marca, submarca, piezas e imágenes (data URL). Sin el BLOB de la ficha. */
  async getById(id: number) {
    const row = await this.prisma.mdModel.findUnique({
      where: { idDlkModel: id },
      include: {
        brand: brandSelect,
        subbrand: subbrandSelect,
        details: {
          where: { flgStatutActif: 1 },
          orderBy: { idDlkModelDetail: "asc" },
          include: {
            images: {
              where: { flgStatutActif: 1 },
              orderBy: { idDlkModelImages: "asc" },
            },
          },
        },
      },
    });
    if (!row) return null;
    const { technicalSpecFile, details, ...rest } = row;
    return {
      ...rest,
      hasFicha: technicalSpecFile != null && technicalSpecFile.byteLength > 0,
      pieces: details.map((d) => ({
        idDlkModelDetail: d.idDlkModelDetail,
        namePiece: d.namePiece,
        images: d.images.map((im) => ({
          idDlkModelImages: im.idDlkModelImages,
          imageType: im.imageType,
          imageData: imageBytesToDataUrl(im.imageData),
        })),
      })),
    };
  }

  async getFicha(id: number) {
    const row = await this.prisma.mdModel.findUnique({
      where: { idDlkModel: id },
      select: { technicalSpecFile: true, technicalSpecification: true },
    });
    if (!row?.technicalSpecFile || row.technicalSpecFile.byteLength === 0) return null;
    return {
      buffer: Buffer.from(row.technicalSpecFile),
      filename: row.technicalSpecification?.trim() || `ficha-modelo-${id}.pdf`,
    };
  }

  async create(input: CreateModelInput) {
    let codModel = input.codModel;
    if (!codModel) {
      const last = await this.prisma.mdModel.findFirst({
        orderBy: { idDlkModel: "desc" },
        select: { codModel: true },
      });
      const lastNum = last?.codModel ? parseInt(last.codModel.replace(/\D/g, ""), 10) || 0 : 0;
      codModel = `MOD-${lastNum + 1}`;
    }

    const data: Prisma.MdModelUncheckedCreateInput = {
      idDlkBrand: input.idDlkBrand,
      codModel,
      stateModel: input.stateModel ?? 1,
      codUsuarioCargaDl: "SYSTEM",
      desAccion: "INSERT",
      flgStatutActif: 1,
    };
    for (const f of SCALAR_FIELDS) {
      if (f === "idDlkBrand") continue;
      if (input[f] !== undefined) (data as Record<string, unknown>)[f] = input[f];
    }
    if (input.fichaBase64) {
      data.technicalSpecFile = Buffer.from(input.fichaBase64, "base64");
    }

    const newId = await this.prisma.$transaction(async (tx) => {
      const model = await tx.mdModel.create({ data });
      await this.createPieces(tx, model.idDlkModel, input.pieces ?? []);
      return model.idDlkModel;
    });
    return this.getById(newId);
  }

  async update(id: number, input: UpdateModelInput) {
    const data: Record<string, unknown> = { desAccion: "UPDATE" };
    for (const f of SCALAR_FIELDS) {
      if (input[f] !== undefined) data[f] = input[f];
    }
    if (input.fichaBase64 !== undefined) {
      data.technicalSpecFile = input.fichaBase64 ? Buffer.from(input.fichaBase64, "base64") : null;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.mdModel.update({ where: { idDlkModel: id }, data });
      // Estrategia de reemplazo: si llegan piezas, se rehacen piezas + imágenes.
      if (input.pieces !== undefined) {
        await tx.mdModelImage.deleteMany({ where: { idDlkModel: id } });
        await tx.mdModelDetail.deleteMany({ where: { idDlkModel: id } });
        await this.createPieces(tx, id, input.pieces);
      }
    });
    return this.getById(id);
  }

  async softDelete(id: number) {
    return this.prisma.mdModel.update({
      where: { idDlkModel: id },
      data: { flgStatutActif: 0, stateModel: 0, desAccion: "DELETE" },
    });
  }

  /** Crea piezas (MD_MODEL_DETAIL) con sus imágenes (MD_MODEL_IMAGES) dentro de una transacción. */
  private async createPieces(
    tx: Prisma.TransactionClient,
    modelId: number,
    pieces: PieceInput[]
  ) {
    for (const p of pieces) {
      const detail = await tx.mdModelDetail.create({
        data: {
          idDlkModel: modelId,
          namePiece: p.namePiece,
          stateModelDetail: 1,
          codUsuarioCargaDl: "SYSTEM",
          desAccion: "INSERT",
          flgStatutActif: 1,
        },
      });
      for (const img of p.images ?? []) {
        if (!img.base64) continue;
        await tx.mdModelImage.create({
          data: {
            idDlkModel: modelId,
            idDlkModelDetail: detail.idDlkModelDetail,
            imageType: img.imageType,
            imageData: Buffer.from(img.base64, "base64"),
            stateImageModel: 1,
            codUsuarioCargaDl: "SYSTEM",
            desAccion: "INSERT",
            flgStatutActif: 1,
          },
        });
      }
    }
  }
}
