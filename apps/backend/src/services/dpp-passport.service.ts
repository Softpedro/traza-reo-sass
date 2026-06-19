import { Buffer } from "node:buffer";
import type { PrismaClient } from "../../generated/prisma/client.js";

/**
 * Servicio de lectura del "pasaporte digital" (DPP) de una prenda, para alimentar
 * la app pública (dpp.trazar.io). Recibe la URL del QR (GS1 Digital Link), resuelve
 * la prenda en REO y arma el JSON que consume la app, sección por sección.
 *
 * Resolución: se parsean los Application Identifiers de la ruta
 *   .../01/{GTIN}/10/{lote=codOrderDetail}/21/{serial}
 * y se busca la prenda por (GTIN + lote + serial). NO se compara la URL completa
 * porque el dominio base puede variar por marca (brandSubdomain) o por entorno.
 */

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
  return `data:image/png;base64,${b64}`;
}

/** Quita separadores no alfanuméricos (mismo criterio que buildDppUrl al armar el lote). */
function sanitizeLote(v: string | null | undefined): string {
  return (v ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/** GTIN normalizado a 14 dígitos (la AI 01 siempre va padded a 14). */
function normGtin(v: string | null | undefined): string {
  return (v ?? "").trim().replace(/\D/g, "").padStart(14, "0");
}

type ParsedDppUrl = { gtin: string; lote: string; serial: string };

/** Extrae GTIN / lote / serial de un GS1 Digital Link. null si no calza el patrón. */
export function parseDppUrl(url: string): ParsedDppUrl | null {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url; // permitir que llamen con solo la ruta
  }
  // .../01/<gtin>/10/<lote>/21/<serial>
  const m = path.match(/\/01\/([^/]+)\/10\/([^/]+)\/21\/([^/]+)/i);
  if (!m) return null;
  return { gtin: normGtin(m[1]), lote: sanitizeLote(m[2]), serial: m[3].trim() };
}

export type DppPassportResult = { notFound: true } | { passport: Record<string, unknown> };

export class DppPassportService {
  constructor(private prisma: PrismaClient) {}

  async getPassport(url: string): Promise<DppPassportResult> {
    const parsed = parseDppUrl(url);
    if (!parsed) return { notFound: true };

    // Candidatos por GTIN (normalizado y sin ceros a la izquierda) + serial.
    // Se afina luego en JS por lote (codOrderDetail saneado), porque en BD puede
    // venir con guiones ("OP-19-25") mientras que en la URL va saneado ("OP1925").
    const gtinCandidates = Array.from(
      new Set([parsed.gtin, parsed.gtin.replace(/^0+/, "")].filter(Boolean))
    );

    const candidates = await this.prisma.odOrderLabelDetail.findMany({
      where: {
        serialNumber: parsed.serial,
        labelHead: { is: { codGtin: { in: gtinCandidates } } },
      },
      select: {
        idDlkOrderLabelDetail: true,
        serialNumber: true,
        sgtinFull: true,
        urlDppFull: true,
        color: true,
        print: true,
        size: true,
        isBlacklisted: true,
        labelComponent: { select: { numPiece: true, nameComponent: true } },
        labelHead: {
          select: {
            codGtin: true,
            size: true,
            estampado: true,
            nameEstilo: true,
            descriptionEstilo: true,
            genderEstilo: true,
            seasonEstilo: true,
            orderDetail: {
              select: {
                idDlkOrderDetail: true,
                codOrderDetail: true,
                codEstilo: true,
                colorAway: true,
                fondoTela: true,
                esSet: true,
                numPiezas: true,
                imgEstilo: true,
              },
            },
            orderHead: {
              select: {
                codOrderHead: true,
                brand: {
                  select: {
                    nameBrand: true,
                    logoBrand: true,
                    facebookBrand: true,
                    instagramBrand: true,
                    whatsappBrand: true,
                    ecommerceBrand: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const unit =
      candidates.find(
        (c) => sanitizeLote(c.labelHead?.orderDetail?.codOrderDetail) === parsed.lote
      ) ?? candidates[0]; // si no hay lote en BD, cae al único candidato por GTIN+serial
    if (!unit) return { notFound: true };

    const head = unit.labelHead;
    const detail = head?.orderDetail;
    const brand = head?.orderHead?.brand;

    // ── Catálogo: modelo (MD_MODEL) ────────────────────────────────────
    // TODO(link-modelo): hoy se resuelve por código (codModel == codEstilo).
    // Cuando exista OD_ORDER_DETAIL.idDlkModel, cambiar por el join directo.
    const model = detail?.codEstilo
      ? await this.prisma.mdModel.findFirst({
          where: { codModel: detail.codEstilo, flgStatutActif: 1 },
          include: {
            cares: { where: { flgStatutActif: 1 }, orderBy: { idDlkCare: "asc" } },
            details: {
              where: { flgStatutActif: 1 },
              orderBy: { idDlkModelDetail: "asc" },
              include: { images: { where: { flgStatutActif: 1 } } },
            },
            images: { where: { flgStatutActif: 1 } },
            packaging: true,
          },
        })
      : null;

    // Nombre de la pieza (header + Información → Nombre): del catálogo (MD_MODEL_DETAIL).
    // Para sets se elige la pieza por su número; si no, la primera; con fallbacks.
    const pieceIdx = unit.labelComponent?.numPiece ?? 1;
    const pieceName =
      model?.details?.[pieceIdx - 1]?.namePiece ??
      model?.details?.[0]?.namePiece ??
      unit.labelComponent?.nameComponent ??
      head?.nameEstilo ??
      model?.nameModel ??
      null;

    // ── Insumos / proveedores (link por orderForm == codOrderHead) ─────
    const orderForm = head?.orderHead?.codOrderHead ?? null;
    const supplierSelect = {
      idDlkSupplier: true,
      nameSupplier: true,
      rucSupplier: true,
      addressSupplier: true,
      gpsSupplier: true,
    } as const;
    const materialRows = orderForm
      ? await this.prisma.mdMaterial.findMany({
          where: { orderForm, flgStatutActif: 1 },
          select: {
            recycled: true,
            percentageRecycledMaterials: true,
            recycledInputSource: true,
            supplier: { select: supplierSelect },
          },
        })
      : [];
    const avioRows = orderForm
      ? await this.prisma.mdAvio.findMany({
          where: { orderForm, flgStatutActif: 1 },
          select: { supplier: { select: supplierSelect } },
        })
      : [];

    // Proveedores únicos (materiales + avíos)
    const supplierMap = new Map<number, Record<string, unknown>>();
    for (const row of [...materialRows, ...avioRows]) {
      const s = row.supplier;
      if (s && !supplierMap.has(s.idDlkSupplier)) {
        supplierMap.set(s.idDlkSupplier, {
          name: s.nameSupplier,
          address: s.addressSupplier,
          ruc: s.rucSupplier,
          gps: s.gpsSupplier,
        });
      }
    }
    const suppliers = [...supplierMap.values()];

    // Reciclado: agregado de los materiales de la orden
    const recycledAny = materialRows.some((m) => m.recycled === 1);
    const recycledInput =
      materialRows.find((m) => m.recycledInputSource)?.recycledInputSource ?? null;
    const recycledPctRaw = materialRows.find(
      (m) => m.percentageRecycledMaterials != null && Number(m.percentageRecycledMaterials) > 0
    )?.percentageRecycledMaterials;
    const recycledPercentage = recycledPctRaw != null ? Number(recycledPctRaw) : null;

    // ── Imágenes ───────────────────────────────────────────────────────
    // Prioridad: fotos de la pieza (catálogo) → fotos del modelo → fallback
    // a la imagen del estilo (OD_ORDER_DETAIL.IMG_ESTILO) de la orden.
    let images: string[] = [];
    if (model) {
      const src =
        model.details[pieceIdx - 1]?.images?.length
          ? model.details[pieceIdx - 1].images
          : model.images;
      images = src
        .map((im) => imageBytesToDataUrl(im.imageData))
        .filter((x): x is string => x != null);
    }
    if (images.length === 0) {
      const fallback = imageBytesToDataUrl(detail?.imgEstilo);
      if (fallback) images = [fallback];
    }

    // ── Fabricación (timeline desde OD_PROCESS_ROUTE) ──────────────────
    // Lectura de la ruta de producción de los componentes de este colorway.
    // Dedupe por etapa (nameProcess) y orden por precedencia → un timeline único.
    let manufacturingLocation: string | null = null;
    const timeline: {
      stage: string;
      startAt: Date | null;
      endAt: Date | null;
      responsible: string | null;
    }[] = [];
    if (detail?.idDlkOrderDetail) {
      const components = await this.prisma.odOrderComponent.findMany({
        where: { idDlkOrderDetail: detail.idDlkOrderDetail, flgStatutActif: 1 },
        select: {
          processRoutes: {
            where: { flgStatutActif: 1 },
            select: {
              ordenPrecedenciaProcess: true,
              nameProcess: true,
              responsibleProcess: true,
              inputTimeProcessRoute: true,
              outputTimeProcessRoute: true,
              facility: { select: { nameFacility: true, addressFacility: true } },
            },
          },
        },
      });
      const flat = components
        .flatMap((c) => c.processRoutes)
        .sort((a, b) => a.ordenPrecedenciaProcess - b.ordenPrecedenciaProcess);
      const seen = new Set<string>();
      for (const pr of flat) {
        if (!manufacturingLocation && pr.facility) {
          manufacturingLocation =
            [pr.facility.nameFacility, pr.facility.addressFacility].filter(Boolean).join(", ") ||
            null;
        }
        if (seen.has(pr.nameProcess)) continue;
        seen.add(pr.nameProcess);
        timeline.push({
          stage: pr.nameProcess,
          startAt: pr.inputTimeProcessRoute,
          endAt: pr.outputTimeProcessRoute,
          responsible: pr.responsibleProcess || null,
        });
      }
    }

    const productCode = `${normGtin(head?.codGtin).replace(/^0+/, "")}/10/${parsed.lote}/21/${parsed.serial}`;

    const passport = {
      unit: {
        gtin: head?.codGtin ?? parsed.gtin,
        lote: parsed.lote,
        serial: parsed.serial,
        sgtin: unit.sgtinFull,
        productCode,
        blacklisted: unit.isBlacklisted === 1,
      },

      header: {
        title: pieceName, // nombre de la pieza
        traceable: true,
        brand: {
          name: brand?.nameBrand ?? null,
          logoUrl: imageBytesToDataUrl(brand?.logoBrand),
          social: {
            facebook: brand?.facebookBrand ?? null,
            instagram: brand?.instagramBrand ?? null,
            whatsapp: brand?.whatsappBrand ?? null,
            ecommerce: brand?.ecommerceBrand ?? null,
          },
        },
      },

      images,

      description: {
        title: model?.nameModel ?? null, // nombre del modelo
        collection: model?.nameCollection ?? null,
        body: model?.desModel ?? head?.descriptionEstilo ?? null,
      },

      information: {
        name: pieceName,
        brand: brand?.nameBrand ?? null,
        gtin: head?.codGtin ?? parsed.gtin,
        productCode,
        category: model?.categoryModel ?? null,
        // Color = fondo de tela + estampado (ej. "Fondo Natural / Estampado Rojo Atardecer")
        color: [detail?.fondoTela, head?.estampado ?? unit.print]
          .filter(Boolean)
          .join(" / ") || detail?.colorAway || null,
        year: model?.year ?? null,
        season: model?.season ?? head?.seasonEstilo ?? null,
        // talla: se reincorpora luego (head?.size)
      },

      materials: {
        composition: model?.compositionModel ?? model?.materialModel ?? null,
        // Reciclado / % / ingreso: agregado de MD_MATERIAL (orderForm == codOrderHead).
        recycled: recycledAny,
        recycledPercentage,
        recycledInput,
      },

      packaging: model?.packaging
        ? {
            type: model.packaging.type,
            weight: model.packaging.weight != null ? Number(model.packaging.weight) : null,
            volume: model.packaging.volume != null ? Number(model.packaging.volume) : null,
            recycling: model.packaging.recycling,
            percentageRecycled:
              model.packaging.percentageRecycled != null
                ? Number(model.packaging.percentageRecycled)
                : null,
            // "Reciclaje: Yes" se deriva de tener material/porcentaje de reciclaje.
            recycled:
              !!model.packaging.recycling ||
              (model.packaging.percentageRecycled != null &&
                Number(model.packaging.percentageRecycled) > 0),
          }
        : null,

      // Cuidado = un solo texto libre (intro + viñetas "*" + cierre). La app
      // parsea las líneas "*" como lista. Si hubiera varias filas, se unen por salto.
      care: {
        text:
          model?.cares
            ?.map((c) => c.carDescription)
            .filter(Boolean)
            .join("\n") || null,
      },

      suppliers,

      manufacturing: { location: manufacturingLocation, timeline },
    };

    return { passport };
  }
}
