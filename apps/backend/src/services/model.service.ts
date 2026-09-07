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

/**
 * Imagen de una pieza. Dos formas excluyentes:
 *  - `idDlkModelImages`: la imagen ya está guardada y se conserva tal cual (el cliente
 *    NO reenvía sus bytes).
 *  - `base64`: imagen nueva o reemplazo; se inserta y la anterior de esa perspectiva se borra.
 */
type PieceImageInput = {
  imageType: string;
  base64?: string | null;
  idDlkModelImages?: number | null;
};
/** `idDlkModelDetail` presente = pieza existente que se conserva; ausente = pieza nueva. */
type PieceInput = {
  namePiece: string;
  idDlkModelDetail?: number | null;
  images?: PieceImageInput[];
};

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
  /**
   * Código de estilo. Obligatorio: es la identidad del modelo y lo que enlaza el
   * catálogo con las órdenes (OD_ORDER_DETAIL.COD_ESTILO). Antes se autogeneraba como
   * MOD-N cuando no llegaba, y como el formulario nunca lo enviaba, el maestro quedaba
   * con códigos que ninguna orden usaba y el join no encontraba nada.
   */
  codModel: string;
  /** PDF de ficha técnica en base64 (sin prefijo data:). */
  fichaBase64?: string | null;
  /** Imagen de la ficha de medidas en base64 (sin prefijo data:). */
  measurementsSheetBase64?: string | null;
  pieces?: PieceInput[];
};

type UpdateModelInput = ModelScalars & {
  /** undefined = no tocar; string = reemplazar; null = borrar. */
  fichaBase64?: string | null;
  /** undefined = no tocar; string = reemplazar; null = borrar. */
  measurementsSheetBase64?: string | null;
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

/**
 * El default de Prisma para transacciones interactivas es 5s, y aquí dentro pueden ir
 * varios INSERT de MEDIUMBLOB (fotos de piezas) contra un MySQL remoto. Con 5s la
 * transacción se cerraba a mitad y salía un P2028 que el cliente veía como
 * "Ocurrió un error interno". `maxWait` va por encima del acquireTimeout del pool (8s)
 * para no competir con él por el mismo síntoma.
 */
const TX_OPTIONS = {
  timeout: Number(process.env.DB_TX_TIMEOUT_MS ?? 30000),
  maxWait: Number(process.env.DB_TX_MAX_WAIT_MS ?? 10000),
} as const;

export class ModelService {
  constructor(private prisma: PrismaClient) {}

  /** Listado liviano (sin piezas/imágenes/ficha). */
  async list() {
    return this.prisma.mdModel.findMany({
      where: { flgStatutActif: 1 },
      orderBy: { idDlkModel: "desc" },
      // `omit` los BLOB pesados (ficha técnica ~1.5 MB c/u y ficha de medidas): con
      // `include` y sin `select`, Prisma los traía de cada modelo → el listado tardaba
      // minutos.
      omit: { technicalSpecFile: true, measurementsSheet: true },
      include: { brand: brandSelect, subbrand: subbrandSelect },
    });
  }

  /** Detalle con marca, submarca, piezas e imágenes (data URL). Sin el BLOB de la ficha. */
  async getById(id: number) {
    const row = await this.prisma.mdModel.findUnique({
      where: { idDlkModel: id },
      // `omit` el BLOB de la ficha técnica (~1.5 MB): aquí solo se necesita saber si
      // existe (hasFicha), no su contenido. Traerlo hacía lento abrir el modelo.
      // La ficha de medidas sí viaja: es una imagen y el formulario la muestra.
      omit: { technicalSpecFile: true },
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
    // hasFicha sin transferir el blob: consulta solo el tamaño de la columna.
    const fichaLen = await this.prisma.$queryRaw<{ len: number | bigint | null }[]>`
      SELECT OCTET_LENGTH(TECHNICAL_SPECIFICATION_FILE) AS len FROM MD_MODEL WHERE ID_DLK_MODEL = ${id}`;
    const { details, measurementsSheet, ...rest } = row;
    return {
      ...rest,
      hasFicha: Number(fichaLen?.[0]?.len ?? 0) > 0,
      // Se saca del spread y se reemplaza por el data URL: los Bytes crudos de Prisma
      // serializarían como un objeto inútil para el cliente.
      measurementsSheet: imageBytesToDataUrl(measurementsSheet),
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
    const codModel = input.codModel?.trim();
    if (!codModel) throw new Error("El código de estilo es obligatorio");

    // El código es único en la base; un mensaje claro evita que salga el error crudo
    // del índice, que no dice cuál es el modelo que ya lo ocupa.
    const dup = await this.prisma.mdModel.findFirst({
      where: { codModel },
      select: { idDlkModel: true, nameModel: true },
    });
    if (dup) {
      throw new Error(
        `El código de estilo "${codModel}" ya lo usa el modelo "${dup.nameModel ?? dup.idDlkModel}"`
      );
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
    if (input.measurementsSheetBase64) {
      data.measurementsSheet = Buffer.from(input.measurementsSheetBase64, "base64");
    }

    const newId = await this.prisma.$transaction(async (tx) => {
      const model = await tx.mdModel.create({ data });
      await this.createPieces(tx, model.idDlkModel, input.pieces ?? []);
      return model.idDlkModel;
    }, TX_OPTIONS);
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
    if (input.measurementsSheetBase64 !== undefined) {
      data.measurementsSheet = input.measurementsSheetBase64
        ? Buffer.from(input.measurementsSheetBase64, "base64")
        : null;
    }

    await this.prisma.$transaction(
      async (tx) => {
        await tx.mdModel.update({ where: { idDlkModel: id }, data });
        if (input.pieces !== undefined) {
          await this.syncPieces(tx, id, input.pieces);
        }
      },
      TX_OPTIONS
    );
    return this.getById(id);
  }

  async softDelete(id: number) {
    return this.prisma.mdModel.update({
      where: { idDlkModel: id },
      data: { flgStatutActif: 0, stateModel: 0, desAccion: "DELETE" },
    });
  }

  /**
   * Reconcilia piezas e imágenes sin reescribir lo que no cambió.
   *
   * Antes esto era `deleteMany` de imágenes + `deleteMany` de piezas + recrear todo desde
   * base64. Como el modal reenviaba las fotos ya guardadas en cada guardado, editar un
   * campo de texto reinsertaba todos los BLOB: la transacción se pasaba de los 5s (500) y
   * el payload se pasaba del límite de body (413). Ahora el cliente manda
   * `idDlkModelImages` para lo que conserva y sólo bytes para lo nuevo.
   */
  private async syncPieces(tx: Prisma.TransactionClient, modelId: number, pieces: PieceInput[]) {
    const existing = await tx.mdModelDetail.findMany({
      where: { idDlkModel: modelId },
      select: {
        idDlkModelDetail: true,
        images: { select: { idDlkModelImages: true } },
      },
    });
    const existingById = new Map(existing.map((d) => [d.idDlkModelDetail, d]));

    const keptDetailIds = new Set<number>();
    for (const p of pieces) {
      if (typeof p.idDlkModelDetail === "number" && existingById.has(p.idDlkModelDetail)) {
        keptDetailIds.add(p.idDlkModelDetail);
      }
    }

    // Piezas que ya no vienen en el payload. Las imágenes se borran explícitamente: el
    // ON DELETE CASCADE está declarado en el schema, pero no dependemos de que el FK real
    // en la base lo tenga.
    const removedDetailIds = existing
      .map((d) => d.idDlkModelDetail)
      .filter((detailId) => !keptDetailIds.has(detailId));
    if (removedDetailIds.length) {
      await tx.mdModelImage.deleteMany({ where: { idDlkModelDetail: { in: removedDetailIds } } });
      await tx.mdModelDetail.deleteMany({ where: { idDlkModelDetail: { in: removedDetailIds } } });
    }

    for (const p of pieces) {
      const current =
        typeof p.idDlkModelDetail === "number" ? existingById.get(p.idDlkModelDetail) : undefined;

      let detailId: number;
      if (current) {
        await tx.mdModelDetail.update({
          where: { idDlkModelDetail: current.idDlkModelDetail },
          data: { namePiece: p.namePiece, desAccion: "UPDATE" },
        });
        detailId = current.idDlkModelDetail;
      } else {
        const created = await tx.mdModelDetail.create({
          data: {
            idDlkModel: modelId,
            namePiece: p.namePiece,
            stateModelDetail: 1,
            codUsuarioCargaDl: "SYSTEM",
            desAccion: "INSERT",
            flgStatutActif: 1,
          },
        });
        detailId = created.idDlkModelDetail;
      }

      const images = p.images ?? [];
      const keptImageIds = new Set(
        images
          .map((im) => im.idDlkModelImages)
          .filter((imageId): imageId is number => typeof imageId === "number")
      );
      // Todo lo que la pieza tenía y el cliente no conserva: reemplazado o eliminado.
      const staleImageIds = (current?.images ?? [])
        .map((im) => im.idDlkModelImages)
        .filter((imageId) => !keptImageIds.has(imageId));
      if (staleImageIds.length) {
        await tx.mdModelImage.deleteMany({ where: { idDlkModelImages: { in: staleImageIds } } });
      }

      for (const img of images) {
        if (!img.base64) continue; // conservada (llegó por id) o vacía
        await tx.mdModelImage.create({
          data: {
            idDlkModel: modelId,
            idDlkModelDetail: detailId,
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
