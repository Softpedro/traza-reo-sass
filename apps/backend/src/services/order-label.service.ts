import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import {
  buildLabelsPdf,
  detectImageKind,
  type LabelLogo,
  type LabelSizeKey,
} from "./label-pdf.js";

/** Tope defensivo para evitar generar millones de detalles por error de cálculo. */
const MAX_LABEL_RANGE = 100_000;


const LABEL_HEAD_FOR_LIST = {
  idDlkOrderLabelHead: true,
  idDlkOrderHead: true,
  idDlkDigitalIdentifier: true,
  idDlkOrderDetail: true,
  codOrderLabel: true,
  codEstilo: true,
  nameEstilo: true,
  codGtin: true,
  size: true,
  estampado: true,
  identifierType: true,
  inicioSerializacion: true,
  finSerializacion: true,
  totalLabel: true,
  fehSignOpen: true,
  fehSignClose: true,
  stateOrderLabelHead: true,
  flgStatutActif: true,
  fecProcesoCargaDl: true,
  digitalIdentifier: {
    select: {
      idDlkDigitalIdentifier: true,
      codDigitalIdentifier: true,
      typeDigitalIdentifier: true,
    },
  },
  orderDetail: {
    select: {
      idDlkOrderDetail: true,
      codEstilo: true,
      nomEstilo: true,
      colorAway: true,
      fondoTela: true,
      esSet: true,
      numPiezas: true,
    },
  },
  components: {
    select: {
      idDlkOrderLabelComponent: true,
      idDlkOrderDetail: true,
      idDlkDigitalIdentifier: true,
      numPiece: true,
      nameComponent: true,
      codComponent: true,
      digitalIdentifier: {
        select: {
          idDlkDigitalIdentifier: true,
          codDigitalIdentifier: true,
          typeDigitalIdentifier: true,
        },
      },
    },
    orderBy: { numPiece: "asc" },
  },
} satisfies Prisma.OdOrderLabelHeadSelect;

export type OrderLabelHeadListRow = Prisma.OdOrderLabelHeadGetPayload<{
  select: typeof LABEL_HEAD_FOR_LIST;
}>;

type SerialDraft = {
  itemGlobal: number;
  itemBySize: number;
  serialNumber: string;
  sgtinFull: string;
  urlDppFull: string;
  size: string | null;
  color: string | null;
  print: string | null;
  pieceType: string | null;
  setGroupId: string | null;
  /** Set → componente (pieza) al que pertenece este DPP. No-set → null. */
  idDlkOrderLabelComponent: number | null;
  /** No-set → identificador del DPP. Set → null (se resuelve vía el componente). */
  idDlkDigitalIdentifier: number | null;
};

/** Pieza de un set al crear: nombre + identificador digital propio. */
export type LabelPieceInput = {
  numPiece?: number | null;
  name?: string | null;
  idDlkDigitalIdentifier: number;
};

/** Columnas de talla en OD_ORDER_DETAIL → etiqueta legible, en orden de presentación. */
const SIZE_COLUMNS: { field: string; label: string }[] = [
  { field: "size0_3", label: "0-3" },
  { field: "size3_6", label: "3-6" },
  { field: "size0_6", label: "0-6" },
  { field: "size6_12", label: "6-12" },
  { field: "size12_18", label: "12-18" },
  { field: "size2", label: "2" },
  { field: "size3", label: "3" },
  { field: "size4", label: "4" },
  { field: "size5", label: "5" },
  { field: "size6", label: "6" },
  { field: "size7", label: "7" },
  { field: "size8", label: "8" },
  { field: "size9", label: "9" },
  { field: "size10", label: "10" },
  { field: "size11", label: "11" },
  { field: "size12", label: "12" },
  { field: "size14", label: "14" },
  { field: "size16", label: "16" },
  { field: "sizeXs", label: "XS" },
  { field: "sizeS", label: "S" },
  { field: "sizeM", label: "M" },
  { field: "sizeL", label: "L" },
  { field: "sizeXl", label: "XL" },
  { field: "sizeXxl", label: "XXL" },
];

/** Nombres de pieza por defecto cuando el colorway es un set. */
function defaultPieceLabels(numPiezas: number): string[] {
  if (numPiezas === 2) return ["PANTALON", "CAMISA"];
  return Array.from({ length: numPiezas }, (_, i) => `PIEZA ${i + 1}`);
}

export type CreateLabelHeadInput = {
  idDlkOrderHead: number;
  idDlkDigitalIdentifier: number;
  /**
   * Colorway (OD_ORDER_DETAIL) del que se genera la etiqueta. Si llega, los detalles
   * se generan por talla a partir del desglose del colorway. Si no, se usa el rango plano.
   */
  idDlkOrderDetail?: number | null;
  codOrderLabel?: string | null;
  codEstilo?: string | null;
  nameEstilo?: string | null;
  descriptionEstilo?: string | null;
  genderEstilo?: string | null;
  seasonEstilo?: string | null;
  codGtin?: string | null;
  /** Estampado del modelo/colorway; se copia a cada detalle (PRINT). */
  estampado?: string | null;
  identifierType?: string | null;
  identifierMaterial?: string | null;
  identifierLocation?: string | null;
  inicioSerializacion?: number | null;
  finSerializacion?: number | null;
  /** Si llega, manda; si no, se calcula `fin - inicio + 1`. */
  totalLabel?: number | null;
  /** Talla por unidad cuando no hay un OD_ORDER_DETAIL del que tomarla (opcional). */
  size?: string | null;
  color?: string | null;
  print?: string | null;
  /** Nombres de pieza para sets; si no llega y el colorway es set, se usan los por defecto. */
  pieceTypes?: string[] | null;
  /**
   * Piezas del set con su identificador digital por pieza (chaqueta → QR 1, pantalón → QR 2).
   * Obligatorio cuando `esSet`. En no-set se ignora (se usa `idDlkDigitalIdentifier`).
   */
  pieces?: LabelPieceInput[] | null;
  /** Marca manual de set desde el formulario: si es true, cada unidad genera un DPP por pieza. */
  esSet?: boolean | number | null;
  /** Cantidad de piezas por unidad cuando `esSet`; mínimo 2, por defecto 2. */
  numPiezas?: number | null;
  /**
   * Desglose de producción por talla (cantidad real cortada). Si llega, manda sobre el
   * desglose del colorway — permite el +15% de merma o los saldos de tela.
   */
  sizeBreakdown?: { size: string; qty: number }[] | null;
  codUsuarioCargaDl?: string;
};

export type UpdateLabelHeadInput = {
  codOrderLabel?: string | null;
  codEstilo?: string | null;
  nameEstilo?: string | null;
  descriptionEstilo?: string | null;
  genderEstilo?: string | null;
  seasonEstilo?: string | null;
  codGtin?: string | null;
  estampado?: string | null;
  identifierType?: string | null;
  identifierMaterial?: string | null;
  identifierLocation?: string | null;
  signOpenResponsible?: string | null;
  signCloseResponsible?: string | null;
  digitalCertificateId?: string | null;
  stateOrderLabelHead?: number | null;
  flgStatutActif?: number | null;
  /** 1=Iniciado, 2=Concluido. status=2 promueve la orden a Ruta (stage=4). */
  statusStageOrderHead?: number | null;
  /** No-set: nuevo identificador digital → cabecera (denormalizado) + todos los DPP. */
  idDlkDigitalIdentifier?: number | null;
  /** Set: edición por pieza (nombre + identificador). Update en sitio, no se tocan los seriales. */
  pieces?: {
    idDlkOrderLabelComponent: number;
    name?: string | null;
    idDlkDigitalIdentifier?: number | null;
  }[] | null;
  codUsuarioCargaDl?: string;
};

/** Serial sin ceros a la izquierda: 1, 2, … 68. */
function buildSerialNumber(idx: number): string {
  return String(idx);
}

/** sGTIN = GTIN + serial: `{GTIN}/{serial}`. Sin GTIN, fall back por id de cabecera. */
function buildSgtin(codGtin: string | null | undefined, serial: string, headId: number): string {
  const gtin = (codGtin ?? "").trim();
  if (gtin) {
    return `${gtin}/${serial}`;
  }
  return `label-${headId}/${serial}`;
}

/** Dominio DPP por defecto si la marca no tiene subdominio configurado. */
const DPP_DEFAULT_BASE = "https://dpp.trazar.io";

/**
 * URL del DPP en formato GS1 Digital Link:
 *   {base}/01/{GTIN-14}/10/{ordenProduccion}/21/{serial}
 * AI 01 = GTIN, AI 10 = lote (orden de producción), AI 21 = serial.
 */
function buildDppUrl(
  brandSubdomain: string | null | undefined,
  codGtin: string | null | undefined,
  ordenProduccion: string | null | undefined,
  serial: string
): string {
  const base = (brandSubdomain ?? "").trim().replace(/\/+$/, "") || DPP_DEFAULT_BASE;
  // AI 01 exige GTIN de 14 dígitos: se rellena con ceros a la izquierda.
  const gtin = (codGtin ?? "").trim().padStart(14, "0");
  // El lote (orden de producción) va sin guiones ni separadores.
  const lote = (ordenProduccion ?? "").replace(/[^A-Za-z0-9]/g, "");
  return `${base}/01/${gtin}/10/${lote}/21/${serial}`;
}

export class OrderLabelService {
  constructor(private prisma: PrismaClient) {}

  /** Lista cabeceras de etiqueta de una orden (sin los detalles serializados). */
  async listByOrder(orderHeadId: number): Promise<OrderLabelHeadListRow[]> {
    return this.prisma.odOrderLabelHead.findMany({
      where: { idDlkOrderHead: orderHeadId },
      orderBy: { idDlkOrderLabelHead: "asc" },
      select: LABEL_HEAD_FOR_LIST,
    });
  }

  async getById(labelId: number): Promise<OrderLabelHeadListRow | null> {
    return this.prisma.odOrderLabelHead.findUnique({
      where: { idDlkOrderLabelHead: labelId },
      select: LABEL_HEAD_FOR_LIST,
    });
  }

  /** Detalles serializados de una cabecera (paginado básico para evitar payloads enormes). */
  async listDetails(labelId: number, opts?: { skip?: number; take?: number }) {
    const take = Math.min(Math.max(opts?.take ?? 500, 1), 5000);
    const skip = Math.max(opts?.skip ?? 0, 0);
    const [items, total] = await Promise.all([
      this.prisma.odOrderLabelDetail.findMany({
        where: { idDlkOrderLabelHead: labelId },
        // itemGlobal ya sigue el orden por talla; el id secundario mantiene
        // juntas las piezas de un mismo set.
        orderBy: [{ itemGlobal: "asc" }, { idDlkOrderLabelDetail: "asc" }],
        skip,
        take,
      }),
      this.prisma.odOrderLabelDetail.count({ where: { idDlkOrderLabelHead: labelId } }),
    ]);
    return { items, total, skip, take };
  }

  /**
   * Crea la cabecera y genera todos los detalles serializados en una sola transacción.
   *
   * - Si llega `idDlkOrderDetail`, los detalles se generan **por talla** a partir del
   *   desglose del colorway; si el colorway es un set, se generan `numPiezas` filas por
   *   unidad (una por pieza) con `setGroupId` común y sGTIN distinto por pieza.
   * - Si no llega, se usa el rango plano `[inicio..fin]` o `[1..total]` (modo legacy).
   *
   * El número correlativo dentro de la orden (`itemGlobal`) arranca en `inicioSerializacion`;
   * si no se envía, continúa después del último rango del mismo GTIN en la orden.
   */
  async create(input: CreateLabelHeadInput): Promise<OrderLabelHeadListRow> {
    const head = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: input.idDlkOrderHead },
      select: {
        idDlkOrderHead: true,
        brand: { select: { subdomainBrand: true } },
      },
    });
    if (!head) throw new Error("La orden de pedido (orderHead) no existe");
    const brandSubdomain = head.brand?.subdomainBrand ?? null;

    const digital = await this.prisma.mdDigitalIdentifier.findUnique({
      where: { idDlkDigitalIdentifier: input.idDlkDigitalIdentifier },
      select: { idDlkDigitalIdentifier: true, typeDigitalIdentifier: true },
    });
    if (!digital) throw new Error("El identificador digital no existe");

    // Colorway opcional: si llega, define el desglose por talla y el carácter de set.
    let detail: {
      idDlkOrderDetail: number;
      codOrderDetail: string | null;
      codEstilo: string | null;
      nomEstilo: string | null;
      colorAway: string | null;
      esSet: number;
      numPiezas: number;
      totalEstilo: number | null;
      sizes: { label: string; qty: number }[];
    } | null = null;

    // Talla obligatoria cuando se etiqueta un colorway: cada cabecera vive a nivel
    // de (colorway × talla). El GTIN se asigna por talla.
    const tallaInput = (input.size ?? "").trim() || null;
    if (input.idDlkOrderDetail != null) {
      if (!tallaInput) {
        throw new Error("Debes indicar la talla para generar la etiqueta");
      }
      const d = await this.prisma.odOrderDetail.findUnique({
        where: { idDlkOrderDetail: input.idDlkOrderDetail },
        omit: { imgEstilo: true, supplyFile: true },
      });
      if (!d) throw new Error("El colorway (OD_ORDER_DETAIL) no existe");
      if (d.idDlkOrderHead !== input.idDlkOrderHead) {
        throw new Error("El colorway no pertenece a esta orden de pedido");
      }
      // Una etiqueta por (colorway × talla).
      const dup = await this.prisma.odOrderLabelHead.findFirst({
        where: {
          idDlkOrderDetail: input.idDlkOrderDetail,
          size: tallaInput,
          flgStatutActif: 1,
        },
        select: { idDlkOrderLabelHead: true },
      });
      if (dup) {
        throw new Error(`La talla ${tallaInput} de este colorway ya tiene etiqueta generada`);
      }
      const rec = d as unknown as Record<string, number | null>;
      const sizes = SIZE_COLUMNS.map((s) => ({
        label: s.label,
        qty: Number(rec[s.field] ?? 0) || 0,
      })).filter((s) => s.qty > 0);
      detail = {
        idDlkOrderDetail: d.idDlkOrderDetail,
        codOrderDetail: d.codOrderDetail,
        codEstilo: d.codEstilo,
        nomEstilo: d.nomEstilo,
        colorAway: d.colorAway,
        esSet: d.esSet,
        numPiezas: d.numPiezas,
        totalEstilo: d.totalEstilo,
        sizes,
      };
    }

    const inicio =
      input.inicioSerializacion != null && Number.isFinite(input.inicioSerializacion)
        ? Number(input.inicioSerializacion)
        : null;
    const fin =
      input.finSerializacion != null && Number.isFinite(input.finSerializacion)
        ? Number(input.finSerializacion)
        : null;

    // Inicio de serialización SIEMPRE automático en el flujo normal: el cliente no
    // puede fijarlo. Solo la vía legacy de rango explícito (sin colorway, con inicio+fin)
    // conserva el inicio indicado, para no romper esa API.
    let legacyRangeStart: number | null = null;

    // Unidades a generar. Con colorway + talla, una sola entrada por la talla seleccionada.
    let sizeUnits: { label: string | null; qty: number }[];
    // Desglose de producción enviado desde el modal (corte real: +15% merma o saldos).
    const explicitSizes = (input.sizeBreakdown ?? [])
      .map((s) => ({
        label: (s.size ?? "").trim() || null,
        qty: Math.trunc(Number(s.qty) || 0),
      }))
      .filter((s) => s.qty > 0);
    if (detail && tallaInput) {
      // Cantidad: lo que mande el modal para esta talla (merma/saldos) o lo del colorway.
      const breakdownQty = explicitSizes.find((s) => s.label === tallaInput)?.qty;
      const detailQty = detail.sizes.find((s) => s.label === tallaInput)?.qty;
      const totalOverride =
        input.totalLabel != null && Number(input.totalLabel) > 0
          ? Math.trunc(Number(input.totalLabel))
          : null;
      const qty = breakdownQty ?? totalOverride ?? detailQty ?? 0;
      if (!qty || qty <= 0) {
        throw new Error(`La talla ${tallaInput} no tiene cantidad para generar etiquetas`);
      }
      sizeUnits = [{ label: tallaInput, qty }];
    } else if (explicitSizes.length > 0) {
      sizeUnits = explicitSizes;
    } else if (detail) {
      if (input.totalLabel != null && Number(input.totalLabel) > 0) {
        sizeUnits = [{ label: null, qty: Math.trunc(Number(input.totalLabel)) }];
      } else if (detail.sizes.length > 0) {
        sizeUnits = detail.sizes;
      } else if (detail.totalEstilo && detail.totalEstilo > 0) {
        sizeUnits = [{ label: null, qty: detail.totalEstilo }];
      } else {
        throw new Error(
          "El colorway no tiene cantidades (ni por talla ni total) para generar etiquetas"
        );
      }
    } else {
      let rangeEnd: number;
      let rangeStartLegacy = 1;
      if (inicio != null && fin != null) {
        if (fin < inicio) throw new Error("FIN_SERIALIZACION debe ser ≥ INICIO_SERIALIZACION");
        rangeStartLegacy = inicio;
        legacyRangeStart = inicio;
        rangeEnd = fin;
      } else if (input.totalLabel != null && Number.isFinite(input.totalLabel)) {
        rangeEnd = Number(input.totalLabel);
      } else {
        throw new Error(
          "Debes enviar un colorway (idDlkOrderDetail), (inicio + fin) o un total"
        );
      }
      sizeUnits = [{ label: input.size ?? null, qty: rangeEnd - rangeStartLegacy + 1 }];
    }

    const totalUnits = sizeUnits.reduce((a, s) => a + s.qty, 0);
    if (totalUnits <= 0) throw new Error("El rango de serialización es inválido (total ≤ 0)");

    // Sets: bandera manual del formulario, independiente del colorway.
    // Cada unidad de un set genera `numPiezas` DPPs (uno por pieza).
    const esSet = input.esSet === true || input.esSet === 1;
    const numPiezas = esSet ? Math.max(Math.trunc(Number(input.numPiezas) || 2), 2) : 1;

    // Piezas + identificador por pieza:
    //  - Set: cada pieza trae nombre e identificador propio (van a OD_ORDER_LABEL_COMPONENT).
    //  - No-set: una sola "pieza" (null) con el identificador de cabecera (va al detalle).
    let pieceLabels: (string | null)[];
    let pieceIdentifiers: number[];
    if (esSet) {
      if (!detail) {
        throw new Error("Los sets requieren una orden de producción (colorway) para las piezas");
      }
      const pieces = Array.isArray(input.pieces) ? input.pieces : [];
      if (pieces.length !== numPiezas) {
        throw new Error(`Debes enviar ${numPiezas} piezas, cada una con su identificador digital`);
      }
      const defaults = defaultPieceLabels(numPiezas);
      pieceLabels = pieces.map((p, i) => (p.name?.trim() ? p.name.trim() : defaults[i]));
      pieceIdentifiers = pieces.map((p) => {
        const id = Number(p.idDlkDigitalIdentifier);
        if (!Number.isFinite(id) || id <= 0) {
          throw new Error("Cada pieza del set debe tener un identificador digital");
        }
        return id;
      });
      // Cada pieza del set debe tener un identificador digital DISTINTO.
      const uniqueIds = [...new Set(pieceIdentifiers)];
      if (uniqueIds.length !== pieceIdentifiers.length) {
        throw new Error("Cada pieza del set debe tener un identificador digital distinto");
      }
      // Validar que todos los identificadores de pieza existan.
      const found = await this.prisma.mdDigitalIdentifier.count({
        where: { idDlkDigitalIdentifier: { in: uniqueIds } },
      });
      if (found !== uniqueIds.length) {
        throw new Error("Algún identificador digital de pieza no existe");
      }
    } else {
      pieceLabels = [null];
      pieceIdentifiers = [input.idDlkDigitalIdentifier];
    }

    // Identificador de cabecera (denormalizado): no-set = el único; set = el de la 1ª pieza.
    const headIdentifierId = esSet ? pieceIdentifiers[0] : input.idDlkDigitalIdentifier;

    const totalDetails = totalUnits * numPiezas;
    if (totalDetails > MAX_LABEL_RANGE) {
      throw new Error(
        `El total de DPPs (${totalDetails.toLocaleString("es-PE")}) supera el tope de ${MAX_LABEL_RANGE.toLocaleString("es-PE")}`
      );
    }

    const gtin = input.codGtin ?? null;

    // inicioSerializacion: siempre automático y secuencial a nivel de TODA la orden
    // (continúa tras el último rango de cualquier etiqueta de la orden, sin importar el
    // GTIN/talla). Solo la vía legacy de rango explícito usa el inicio indicado.
    let rangeStart: number;
    if (legacyRangeStart != null) {
      rangeStart = legacyRangeStart;
    } else {
      const prev = await this.prisma.odOrderLabelHead.aggregate({
        where: { idDlkOrderHead: input.idDlkOrderHead },
        _max: { finSerializacion: true },
      });
      rangeStart = (prev._max.finSerializacion ?? 0) + 1;
    }

    const codDl = input.codUsuarioCargaDl?.trim() || "SYSTEM";
    const now = new Date();
    const printValue = input.estampado ?? input.print ?? null;
    const colorValue = input.color ?? detail?.colorAway ?? null;

    const created = await this.prisma.$transaction(async (tx) => {
      const labelHead = await tx.odOrderLabelHead.create({
        data: {
          idDlkOrderHead: input.idDlkOrderHead,
          idDlkDigitalIdentifier: headIdentifierId,
          idDlkOrderDetail: detail?.idDlkOrderDetail ?? null,
          codOrderLabel: input.codOrderLabel ?? null,
          codEstilo: input.codEstilo ?? detail?.codEstilo ?? null,
          nameEstilo: input.nameEstilo ?? detail?.nomEstilo ?? null,
          descriptionEstilo: input.descriptionEstilo ?? null,
          genderEstilo: input.genderEstilo ?? null,
          seasonEstilo: input.seasonEstilo ?? null,
          codGtin: gtin,
          size: tallaInput ?? (sizeUnits.length === 1 ? sizeUnits[0].label : null),
          estampado: input.estampado ?? null,
          identifierType: input.identifierType ?? digital.typeDigitalIdentifier ?? null,
          identifierMaterial: input.identifierMaterial ?? null,
          identifierLocation: input.identifierLocation ?? null,
          inicioSerializacion: rangeStart,
          finSerializacion: rangeStart + totalDetails - 1,
          totalLabel: totalDetails,
          stateOrderLabelHead: 1,
          codUsuarioCargaDl: codDl,
          fecProcesoCargaDl: now,
          fecProcesoModifDl: now,
          desAccion: "I",
          flgStatutActif: 1,
        },
        select: { idDlkOrderLabelHead: true },
      });

      // Set: una fila por pieza en OD_ORDER_LABEL_COMPONENT (nombre + identificador).
      // `componentIdByPiece[i]` enlaza cada pieza con su DPP; null en no-set.
      const componentIdByPiece: (number | null)[] = pieceLabels.map(() => null);
      if (esSet && detail) {
        for (let i = 0; i < numPiezas; i++) {
          const comp = await tx.odOrderLabelComponent.create({
            data: {
              idDlkOrderLabelHead: labelHead.idDlkOrderLabelHead,
              idDlkOrderDetail: detail.idDlkOrderDetail,
              idDlkDigitalIdentifier: pieceIdentifiers[i],
              numPiece: i + 1,
              nameComponent: pieceLabels[i],
              codUsuarioCargaDl: codDl,
              fecProcesoCargaDl: now,
              fecProcesoModifDl: now,
              desAccion: "INSERT",
              flgStatutActif: 1,
            },
            select: { idDlkOrderLabelComponent: true },
          });
          componentIdByPiece[i] = comp.idDlkOrderLabelComponent;
        }
      }

      const drafts: SerialDraft[] = [];
      // Serial plano por prenda: cada pieza (incl. piezas de un set) consume su
      // propio número. `unitN` agrupa las piezas de un mismo set físico.
      let serialN = rangeStart;
      let unitN = 0;
      for (const sz of sizeUnits) {
        let bySize = 0;
        for (let u = 1; u <= sz.qty; u++) {
          unitN++;
          const setGroupId =
            numPiezas > 1 ? `${labelHead.idDlkOrderLabelHead}-${unitN}` : null;
          for (let pi = 0; pi < pieceLabels.length; pi++) {
            const piece = pieceLabels[pi];
            bySize++;
            const serial = buildSerialNumber(serialN);
            const sgtin = buildSgtin(gtin, serial, labelHead.idDlkOrderLabelHead);
            drafts.push({
              itemGlobal: serialN,
              itemBySize: bySize,
              serialNumber: serial,
              sgtinFull: sgtin,
              urlDppFull: buildDppUrl(brandSubdomain, gtin, detail?.codOrderDetail, serial),
              color: colorValue,
              print: printValue,
              size: sz.label,
              pieceType: piece,
              setGroupId,
              // Set → su componente; no-set → identificador directo en el DPP.
              idDlkOrderLabelComponent: esSet ? componentIdByPiece[pi] : null,
              idDlkDigitalIdentifier: esSet ? null : pieceIdentifiers[0],
            });
            serialN++;
          }
        }
      }

      // createMany para no enviar miles de INSERT individuales.
      await tx.odOrderLabelDetail.createMany({
        data: drafts.map((d) => ({
          idDlkOrderLabelHead: labelHead.idDlkOrderLabelHead,
          itemGlobal: d.itemGlobal,
          itemBySize: d.itemBySize,
          serialNumber: d.serialNumber,
          sgtinFull: d.sgtinFull,
          urlDppFull: d.urlDppFull,
          color: d.color,
          print: d.print,
          size: d.size,
          pieceType: d.pieceType,
          setGroupId: d.setGroupId,
          idDlkOrderLabelComponent: d.idDlkOrderLabelComponent,
          idDlkDigitalIdentifier: d.idDlkDigitalIdentifier,
          isBlacklisted: 0,
          stateOrderLabelDetail: 1,
          fecProcesoCargaDl: now,
          fecProcesoModifDl: now,
        })),
      });

      return tx.odOrderLabelHead.findUniqueOrThrow({
        where: { idDlkOrderLabelHead: labelHead.idDlkOrderLabelHead },
        select: LABEL_HEAD_FOR_LIST,
      });
    });

    return created;
  }

  /**
   * Actualiza la cabecera. Cuando `statusStageOrderHead === 2` (Concluido),
   * promueve la orden de pedido a la siguiente etapa (Ruta = stage 4, status 1).
   * El status se persiste en OD_ORDER_HEAD, no en la cabecera de etiqueta.
   */
  async update(labelId: number, input: UpdateLabelHeadInput): Promise<OrderLabelHeadListRow | null> {
    const existing = await this.prisma.odOrderLabelHead.findUnique({
      where: { idDlkOrderLabelHead: labelId },
      select: { idDlkOrderLabelHead: true, idDlkOrderHead: true },
    });
    if (!existing) return null;

    const now = new Date();
    const data: Prisma.OdOrderLabelHeadUncheckedUpdateInput = {
      fecProcesoModifDl: now,
      desAccion: "U",
    };

    const setStr = (key: keyof UpdateLabelHeadInput, target: keyof Prisma.OdOrderLabelHeadUncheckedUpdateInput) => {
      const v = input[key];
      if (v === undefined) return;
      (data as Record<string, unknown>)[target] = v == null || v === "" ? null : String(v);
    };
    const setNum = (key: keyof UpdateLabelHeadInput, target: keyof Prisma.OdOrderLabelHeadUncheckedUpdateInput) => {
      const v = input[key];
      if (v === undefined) return;
      (data as Record<string, unknown>)[target] = v == null || v === "" ? null : Number(v);
    };

    setStr("codOrderLabel", "codOrderLabel");
    setStr("codEstilo", "codEstilo");
    setStr("nameEstilo", "nameEstilo");
    setStr("descriptionEstilo", "descriptionEstilo");
    setStr("genderEstilo", "genderEstilo");
    setStr("seasonEstilo", "seasonEstilo");
    setStr("codGtin", "codGtin");
    setStr("estampado", "estampado");
    setStr("identifierType", "identifierType");
    setStr("identifierMaterial", "identifierMaterial");
    setStr("identifierLocation", "identifierLocation");
    setStr("digitalCertificateId", "digitalCertificateId");
    setNum("stateOrderLabelHead", "stateOrderLabelHead");
    setNum("flgStatutActif", "flgStatutActif");
    if (input.codUsuarioCargaDl !== undefined) data.codUsuarioCargaDl = input.codUsuarioCargaDl;

    if (input.signOpenResponsible !== undefined) {
      data.signOpenResponsible = input.signOpenResponsible || null;
      data.fehSignOpen = input.signOpenResponsible ? now : null;
    }
    if (input.signCloseResponsible !== undefined) {
      data.signCloseResponsible = input.signCloseResponsible || null;
      data.fehSignClose = input.signCloseResponsible ? now : null;
    }

    // Identificador de cabecera (denormalizado):
    //  - No-set: el nuevo identificador (también se propaga a los DPP, abajo).
    //  - Set: sigue al identificador de la 1ª pieza editada.
    let bulkDetailIdentifier: number | null = null;
    if (input.idDlkDigitalIdentifier != null) {
      const newId = Number(input.idDlkDigitalIdentifier);
      if (Number.isFinite(newId) && newId > 0) {
        data.idDlkDigitalIdentifier = newId;
        bulkDetailIdentifier = newId;
      }
    }
    const piecesEdit = Array.isArray(input.pieces) ? input.pieces : [];
    // Cada pieza del set debe tener un identificador DISTINTO (valida antes de escribir).
    const editIds = piecesEdit
      .map((p) => p.idDlkDigitalIdentifier)
      .filter((v): v is number => v != null && Number(v) > 0)
      .map(Number);
    if (new Set(editIds).size !== editIds.length) {
      throw new Error("Cada pieza del set debe tener un identificador digital distinto");
    }
    const firstPieceId = piecesEdit.find(
      (p) => p.idDlkDigitalIdentifier != null && Number(p.idDlkDigitalIdentifier) > 0
    )?.idDlkDigitalIdentifier;
    if (firstPieceId != null) {
      data.idDlkDigitalIdentifier = Number(firstPieceId);
    }

    await this.prisma.odOrderLabelHead.update({
      where: { idDlkOrderLabelHead: labelId },
      data,
    });

    // No-set: propagar el identificador a todas las unidades (UPDATE en sitio, sin tocar seriales).
    if (bulkDetailIdentifier != null) {
      await this.prisma.odOrderLabelDetail.updateMany({
        where: { idDlkOrderLabelHead: labelId },
        data: { idDlkDigitalIdentifier: bulkDetailIdentifier, fecProcesoModifDl: now },
      });
    }

    // Set: actualizar cada pieza (nombre + identificador) en sitio. Los DPP resuelven su
    // identificador vía el componente, así que no se reescriben seriales ni se borra nada.
    for (const p of piecesEdit) {
      if (!p.idDlkOrderLabelComponent) continue;
      const compData: Prisma.OdOrderLabelComponentUncheckedUpdateInput = { desAccion: "UPDATE" };
      if (p.name !== undefined) compData.nameComponent = p.name?.trim() || null;
      if (p.idDlkDigitalIdentifier != null && Number(p.idDlkDigitalIdentifier) > 0) {
        compData.idDlkDigitalIdentifier = Number(p.idDlkDigitalIdentifier);
      }
      await this.prisma.odOrderLabelComponent.update({
        where: { idDlkOrderLabelComponent: Number(p.idDlkOrderLabelComponent) },
        data: compData,
      });
    }

    // Transición Etiqueta → Ruta. Misma convención que registro/suministro:
    // status=2 (Concluido) avanza a la siguiente etapa con status=1 (Iniciado).
    if (input.statusStageOrderHead === 2) {
      await this.prisma.odOrderHead.update({
        where: { idDlkOrderHead: existing.idDlkOrderHead },
        data: {
          stageOrderHead: 4,
          statusStageOrderHead: 1,
          desAccion: "U",
        },
      });
    } else if (input.statusStageOrderHead === 1) {
      await this.prisma.odOrderHead.update({
        where: { idDlkOrderHead: existing.idDlkOrderHead },
        data: { statusStageOrderHead: 1, desAccion: "U" },
      });
    }

    return this.getById(labelId);
  }

  /** Marca + logo de la marca de una orden, para encabezar las etiquetas. */
  private async getBrandForOrder(
    orderHeadId: number
  ): Promise<{ name: string; logo: LabelLogo | null }> {
    const order = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: orderHeadId },
      select: { brand: { select: { nameBrand: true, logoBrand: true } } },
    });
    const name = order?.brand?.nameBrand ?? "TRAZA";
    let logo: LabelLogo | null = null;
    const blob = order?.brand?.logoBrand;
    if (blob && blob.length > 0) {
      const bytes = new Uint8Array(blob);
      const kind = detectImageKind(bytes);
      if (kind) logo = { bytes, kind };
    }
    return { name, logo };
  }

  /**
   * PDF imprimible de una etiqueta: una página por unidad serializada (DPP),
   * en el tamaño elegido. Pensado para la GODEX G500 (1 página = 1 etiqueta).
   */
  async buildLabelPdf(
    orderHeadId: number,
    labelId: number,
    size: LabelSizeKey
  ): Promise<{ pdf: Uint8Array; count: number }> {
    const head = await this.prisma.odOrderLabelHead.findUnique({
      where: { idDlkOrderLabelHead: labelId },
      select: { idDlkOrderLabelHead: true, idDlkOrderHead: true },
    });
    if (!head) throw new Error("Etiqueta no encontrada");
    if (head.idDlkOrderHead !== orderHeadId) {
      throw new Error("La etiqueta no pertenece a esta orden de pedido");
    }

    const details = await this.prisma.odOrderLabelDetail.findMany({
      where: { idDlkOrderLabelHead: labelId },
      orderBy: [{ itemGlobal: "asc" }, { idDlkOrderLabelDetail: "asc" }],
      select: { sgtinFull: true, urlDppFull: true },
    });
    if (details.length === 0) {
      throw new Error("La etiqueta no tiene unidades serializadas para imprimir");
    }

    const brand = await this.getBrandForOrder(orderHeadId);
    const pdf = await buildLabelsPdf(
      details.map((d) => ({ sgtinFull: d.sgtinFull ?? "", urlDppFull: d.urlDppFull ?? "" })),
      { size, brandName: brand.name, logo: brand.logo }
    );
    return { pdf, count: details.length };
  }

  /**
   * PDF imprimible con TODAS las etiquetas activas de una orden: concatena las
   * unidades de cada cabecera en un solo documento, en el tamaño elegido.
   */
  async buildAllLabelsPdf(
    orderHeadId: number,
    size: LabelSizeKey
  ): Promise<{ pdf: Uint8Array; count: number }> {
    const heads = await this.prisma.odOrderLabelHead.findMany({
      where: { idDlkOrderHead: orderHeadId, flgStatutActif: 1 },
      select: { idDlkOrderLabelHead: true },
      orderBy: { idDlkOrderLabelHead: "asc" },
    });
    if (heads.length === 0) throw new Error("Esta orden no tiene etiquetas creadas");

    const ids = heads.map((h) => h.idDlkOrderLabelHead);
    const details = await this.prisma.odOrderLabelDetail.findMany({
      where: { idDlkOrderLabelHead: { in: ids } },
      orderBy: [
        { idDlkOrderLabelHead: "asc" },
        { itemGlobal: "asc" },
        { idDlkOrderLabelDetail: "asc" },
      ],
      select: { sgtinFull: true, urlDppFull: true },
    });
    if (details.length === 0) {
      throw new Error("Las etiquetas de esta orden no tienen unidades para imprimir");
    }

    const brand = await this.getBrandForOrder(orderHeadId);
    const pdf = await buildLabelsPdf(
      details.map((d) => ({ sgtinFull: d.sgtinFull ?? "", urlDppFull: d.urlDppFull ?? "" })),
      { size, brandName: brand.name, logo: brand.logo }
    );
    return { pdf, count: details.length };
  }

  /** Marca / desmarca una unidad serializada como rechazada (lista negra). */
  async setBlacklist(
    labelDetailId: number,
    isBlacklisted: boolean,
    reason: string | null,
    auditor: string | null
  ) {
    return this.prisma.odOrderLabelDetail.update({
      where: { idDlkOrderLabelDetail: labelDetailId },
      data: {
        isBlacklisted: isBlacklisted ? 1 : 0,
        reasonBlacklist: isBlacklisted ? (reason ?? null) : null,
        codUsuarioAuditor: auditor ?? null,
      },
    });
  }
}
