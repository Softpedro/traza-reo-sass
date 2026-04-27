import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";

/** Tope defensivo para evitar generar millones de detalles por error de cálculo. */
const MAX_LABEL_RANGE = 100_000;

/** GTIN-14 base + 6 dígitos de serial = 20 → cabe en VARCHAR(20). */
const SERIAL_PAD = 6;

const LABEL_HEAD_FOR_LIST = {
  idDlkOrderLabelHead: true,
  idDlkOrderHead: true,
  idDlkDigitalIdentifier: true,
  codOrderLabel: true,
  codEstilo: true,
  nameEstilo: true,
  codGtin: true,
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
};

export type CreateLabelHeadInput = {
  idDlkOrderHead: number;
  idDlkDigitalIdentifier: number;
  codOrderLabel?: string | null;
  codEstilo?: string | null;
  nameEstilo?: string | null;
  descriptionEstilo?: string | null;
  genderEstilo?: string | null;
  seasonEstilo?: string | null;
  codGtin?: string | null;
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
  /** Plantilla de URL DPP. `{sgtin}` se reemplaza por el sGTIN serializado. */
  urlDppTemplate?: string | null;
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
  codUsuarioCargaDl?: string;
};

function buildSerialNumber(idx: number): string {
  return String(idx).padStart(SERIAL_PAD, "0");
}

/** sGTIN-96 estilo URN. Si no hay GTIN-14 base, fall back a un esquema simple por id. */
function buildSgtin(codGtin: string | null | undefined, serial: string, headId: number): string {
  const gtin = (codGtin ?? "").trim();
  if (gtin) {
    return `urn:epc:id:sgtin:${gtin}.${serial}`;
  }
  return `urn:reo:label:${headId}:${serial}`;
}

function buildDppUrl(template: string | null | undefined, sgtin: string): string {
  const tpl = (template ?? "").trim();
  if (!tpl) return `https://dpp.reo.local/${encodeURIComponent(sgtin)}`;
  if (tpl.includes("{sgtin}")) return tpl.replace("{sgtin}", encodeURIComponent(sgtin));
  return `${tpl.replace(/\/$/, "")}/${encodeURIComponent(sgtin)}`;
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
        orderBy: { itemGlobal: "asc" },
        skip,
        take,
      }),
      this.prisma.odOrderLabelDetail.count({ where: { idDlkOrderLabelHead: labelId } }),
    ]);
    return { items, total, skip, take };
  }

  /**
   * Crea la cabecera y genera todos los detalles serializados en una sola transacción.
   * Si `inicio` y `fin` están definidos, el rango es `[inicio..fin]`. Si solo viene `total`,
   * el rango es `[1..total]`. Falla si los detalles superan MAX_LABEL_RANGE.
   */
  async create(input: CreateLabelHeadInput): Promise<OrderLabelHeadListRow> {
    const head = await this.prisma.odOrderHead.findUnique({
      where: { idDlkOrderHead: input.idDlkOrderHead },
      select: { idDlkOrderHead: true },
    });
    if (!head) throw new Error("La orden de pedido (orderHead) no existe");

    const digital = await this.prisma.mdDigitalIdentifier.findUnique({
      where: { idDlkDigitalIdentifier: input.idDlkDigitalIdentifier },
      select: { idDlkDigitalIdentifier: true, typeDigitalIdentifier: true },
    });
    if (!digital) throw new Error("El identificador digital no existe");

    const inicio =
      input.inicioSerializacion != null && Number.isFinite(input.inicioSerializacion)
        ? Number(input.inicioSerializacion)
        : null;
    const fin =
      input.finSerializacion != null && Number.isFinite(input.finSerializacion)
        ? Number(input.finSerializacion)
        : null;

    let rangeStart = 1;
    let rangeEnd: number;
    if (inicio != null && fin != null) {
      if (fin < inicio) throw new Error("FIN_SERIALIZACION debe ser ≥ INICIO_SERIALIZACION");
      rangeStart = inicio;
      rangeEnd = fin;
    } else if (input.totalLabel != null && Number.isFinite(input.totalLabel)) {
      rangeEnd = Number(input.totalLabel);
    } else {
      throw new Error(
        "Debes enviar (inicio + fin) o un total para definir el rango de serialización"
      );
    }

    const totalUnits = rangeEnd - rangeStart + 1;
    if (totalUnits <= 0) throw new Error("El rango de serialización es inválido (total ≤ 0)");
    if (totalUnits > MAX_LABEL_RANGE) {
      throw new Error(
        `El rango supera el tope (${MAX_LABEL_RANGE.toLocaleString("es-PE")} unidades)`
      );
    }

    const codDl = input.codUsuarioCargaDl?.trim() || "SYSTEM";
    const now = new Date();

    const created = await this.prisma.$transaction(async (tx) => {
      const labelHead = await tx.odOrderLabelHead.create({
        data: {
          idDlkOrderHead: input.idDlkOrderHead,
          idDlkDigitalIdentifier: input.idDlkDigitalIdentifier,
          codOrderLabel: input.codOrderLabel ?? null,
          codEstilo: input.codEstilo ?? null,
          nameEstilo: input.nameEstilo ?? null,
          descriptionEstilo: input.descriptionEstilo ?? null,
          genderEstilo: input.genderEstilo ?? null,
          seasonEstilo: input.seasonEstilo ?? null,
          codGtin: input.codGtin ?? null,
          identifierType: input.identifierType ?? digital.typeDigitalIdentifier ?? null,
          identifierMaterial: input.identifierMaterial ?? null,
          identifierLocation: input.identifierLocation ?? null,
          inicioSerializacion: inicio ?? rangeStart,
          finSerializacion: fin ?? rangeEnd,
          totalLabel: totalUnits,
          stateOrderLabelHead: 1,
          codUsuarioCargaDl: codDl,
          fecProcesoCargaDl: now,
          fecProcesoModifDl: now,
          desAccion: "I",
          flgStatutActif: 1,
        },
        select: { idDlkOrderLabelHead: true },
      });

      const drafts: SerialDraft[] = [];
      for (let n = rangeStart, idx = 1; n <= rangeEnd; n++, idx++) {
        const serial = buildSerialNumber(n);
        const sgtin = buildSgtin(input.codGtin, serial, labelHead.idDlkOrderLabelHead);
        drafts.push({
          itemGlobal: idx,
          itemBySize: idx,
          serialNumber: serial,
          sgtinFull: sgtin,
          urlDppFull: buildDppUrl(input.urlDppTemplate, sgtin),
          color: input.color ?? null,
          print: input.print ?? null,
          size: input.size ?? null,
        });
      }

      // createMany para no enviar 100k INSERT individuales.
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

    await this.prisma.odOrderLabelHead.update({
      where: { idDlkOrderLabelHead: labelId },
      data,
    });

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
