import { Buffer } from "node:buffer";
import { Prisma, type PrismaClient } from "../../generated/prisma/client.js";

/**
 * Secciones del pasaporte que salen de los módulos de REO:
 *   - sustainability: los cinco indicadores de Sostenibilidad.
 *   - supplyChain: los Tiers no controladas (2, 3 y 4) con sus certificados.
 *
 * Sólo se publica lo que está activo (flag) y en On (estado): apagar una ficha en REO
 * la saca del pasaporte sin borrarla.
 *
 * Los PDFs no viajan dentro del JSON (pesan hasta 10 MB cada uno): se publica un
 * `fileUrl` hacia /api/dpp/passport/file, que los sirve pidiendo la misma URL del QR.
 * Así sólo baja un informe quien tiene una prenda real de esa orden, igual que con el
 * resto del pasaporte.
 */

/** Documentos descargables del pasaporte (valor del parámetro `doc`). */
export const DPP_DOCUMENTS = [
  "carbon-footprint",
  "water-footprint",
  "restricted-substances",
  "circular-economy",
  "social-impact",
  "tier-2-tejido",
  "tier-2-tenido",
  "tier-2-estampado",
  "tier-3",
  "tier-4",
] as const;
export type DppDocument = (typeof DPP_DOCUMENTS)[number];

export function isDppDocument(v: unknown): v is DppDocument {
  return (DPP_DOCUMENTS as readonly unknown[]).includes(v);
}

/** Arma la URL de descarga de un documento; la ruta la construye con el host público. */
export type DocumentUrlBuilder = (doc: DppDocument) => string;

/** Lo que identifica a la prenda para estas secciones. */
export type UnitContext = {
  idDlkOrderDetail: number;
  idDlkBrand: number | null;
  /** Talla de la unidad: elige la fila de huella de carbono / hídrica. */
  size: string | null;
};

/** SERVICE de Tier 2, en el orden en que se procesa la tela. */
const TIER2_SERVICES: Record<number, { name: string; doc: DppDocument }> = {
  1: { name: "Tejido de Tela", doc: "tier-2-tejido" },
  2: { name: "Teñido de Tela", doc: "tier-2-tenido" },
  3: { name: "Estampado de Tela", doc: "tier-2-estampado" },
};

const TIER_TITLES = {
  2: "Producción de Materiales (Tejido de Tela, teñido y estampado)",
  3: "Procesamiento de Materias Primas (Hilo)",
  4: "Origen de la Fibra (Algodón / Materia Prima)",
} as const;

const active = { flgStatutActif: 1 } as const;

const hasBytes = (b: Uint8Array | null | undefined) => b != null && b.byteLength > 0;

/** Decimal de Prisma → number (el pasaporte es JSON: no admite Decimal). */
const num = (v: { toString(): string } | null | undefined): number | null =>
  v == null ? null : Number(v.toString());

/** DATE de MySQL → "YYYY-MM-DD". Llega a medianoche UTC, así que no hay desfase que aplicar. */
const day = (d: Date | null | undefined): string | null => (d ? d.toISOString().slice(0, 10) : null);

const normSize = (s: string | null | undefined) => (s ?? "").trim().toUpperCase();

/** Convierte binario de imagen a data URL, como el resto de imágenes del pasaporte. */
function imageDataUrl(img: Uint8Array | null | undefined): string | null {
  if (!img || img.byteLength === 0) return null;
  const buf = Buffer.from(img);
  const mime =
    buf[0] === 0xff && buf[1] === 0xd8
      ? "image/jpeg"
      : buf.subarray(0, 4).toString("ascii") === "RIFF"
        ? "image/webp"
        : buf[0] === 0x47 && buf[1] === 0x49
          ? "image/gif"
          : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/**
 * Elige la fila de la talla de la unidad. Si la talla no está cargada no se publica
 * nada: mostrar la huella de otra talla sería un dato falso en el pasaporte.
 */
function pickBySize<T extends { size: string }>(rows: T[], size: string | null): T | null {
  const wanted = normSize(size);
  return wanted ? (rows.find((r) => normSize(r.size) === wanted) ?? null) : null;
}

/**
 * Qué fichas tienen archivo adjunto, sin traer los bytes: los PDFs pesan hasta 10 MB
 * y el pasaporte sólo necesita saber si publicar el enlace. Devuelve claves
 * "<tabla>:<id>".
 */
async function filesPresent(prisma: PrismaClient, ctx: UnitContext): Promise<Set<string>> {
  const d = ctx.idDlkOrderDetail;
  const b = ctx.idDlkBrand ?? 0;
  const rows = await prisma.$queryRaw<{ k: string; id: number | bigint }[]>(Prisma.sql`
    SELECT 'carbon' AS k, ID_DLK_CARBON_FOOTPRINT AS id FROM OD_CARBON_FOOTPRINT
      WHERE ID_DLK_ORDER_DETAIL = ${d} AND LENGTH(REPORT_FILE) > 0
    UNION ALL
    SELECT 'water', ID_DLK_WATER_FOOTPRINT FROM OD_WATER_FOOTPRINT
      WHERE ID_DLK_ORDER_DETAIL = ${d} AND LENGTH(REPORT_FILE) > 0
    UNION ALL
    SELECT 'restricted', ID_DLK_RESTRICTED_SUBSTANCES FROM OD_RESTRICTED_SUBSTANCES
      WHERE ID_DLK_ORDER_DETAIL = ${d} AND LENGTH(REPORT_FILE) > 0
    UNION ALL
    SELECT 'circular', ID_DLK_CIRCULAR_ECONOMY FROM OD_CIRCULAR_ECONOMY
      WHERE ID_DLK_ORDER_DETAIL = ${d} AND LENGTH(REPORT_FILE) > 0
    UNION ALL
    SELECT 'social', ID_DLK_SOCIAL_IMPACT FROM OD_SOCIAL_IMPACT
      WHERE ID_DLK_BRAND = ${b} AND LENGTH(REPORT_FILE) > 0
    UNION ALL
    SELECT 'layer', ID_DLK_UNCONTROLLED_LAYERS FROM OD_UNCONTROLLED_LAYERS
      WHERE ID_DLK_ORDER_DETAIL = ${d} AND LENGTH(CERTIFICATE_SHEET) > 0
  `);
  return new Set(rows.map((r) => `${r.k}:${Number(r.id)}`));
}

/* ----------------------------- sustainability ----------------------------- */

export async function buildSustainability(
  prisma: PrismaClient,
  ctx: UnitContext,
  fileUrl: DocumentUrlBuilder
) {
  const byDetail = { idDlkOrderDetail: ctx.idDlkOrderDetail, ...active };
  const footprintSelect = {
    size: true,
    weight: true,
    estimatedValue: true,
    unitDescription: true,
    scope: true,
    report: true,
  } as const;

  const [files, carbonRows, waterRows, restricted, circular, social] = await Promise.all([
    filesPresent(prisma, ctx),
    prisma.odCarbonFootprint.findMany({
      where: { ...byDetail, stateCarbonFootprint: 1 },
      select: { ...footprintSelect, idDlkCarbonFootprint: true, carbonFootprint: true },
      orderBy: { idDlkCarbonFootprint: "asc" },
    }),
    prisma.odWaterFootprint.findMany({
      where: { ...byDetail, stateWaterFootprint: 1 },
      select: { ...footprintSelect, idDlkWaterFootprint: true, waterFootprint: true },
      orderBy: { idDlkWaterFootprint: "asc" },
    }),
    prisma.odRestrictedSubstances.findFirst({
      where: { ...byDetail, stateRestrictedSubstances: 1 },
      orderBy: { idDlkRestrictedSubstances: "desc" },
      select: {
        idDlkRestrictedSubstances: true,
        restrictedSubstances: true,
        topic: true,
        content: true,
        chemicalScope: true,
        report: true,
      },
    }),
    prisma.odCircularEconomy.findFirst({
      where: { ...byDetail, stateCircularEconomy: 1 },
      orderBy: { idDlkCircularEconomy: "desc" },
      select: {
        idDlkCircularEconomy: true,
        circularEconomy: true,
        imageFile: true,
        description: true,
        topic: true,
        content: true,
        report: true,
      },
    }),
    // Impacto social es de la marca, no de la prenda.
    ctx.idDlkBrand != null
      ? prisma.odSocialImpact.findFirst({
          where: { idDlkBrand: ctx.idDlkBrand, stateSocialImpact: 1, ...active },
          orderBy: { idDlkSocialImpact: "desc" },
          select: {
            idDlkSocialImpact: true,
            socialImpact: true,
            femaleWorkforce: true,
            leadership: true,
            workingConditions: true,
            commitmentOit: true,
            scope: true,
            referenceStandard: true,
            report: true,
          },
        })
      : null,
  ]);

  /** Informe adjunto: nombre + URL de descarga, o null si la ficha no tiene PDF. */
  const report = (key: string, name: string | null, doc: DppDocument) =>
    files.has(key) ? { name, fileUrl: fileUrl(doc) } : null;

  const carbon = pickBySize(carbonRows, ctx.size);
  const water = pickBySize(waterRows, ctx.size);

  return {
    carbonFootprint: carbon && {
      value: num(carbon.carbonFootprint),
      unit: "kg CO2e",
      size: carbon.size,
      weightKg: num(carbon.weight),
      estimated: carbon.estimatedValue === 1,
      unitDescription: carbon.unitDescription,
      scope: carbon.scope,
      report: report(`carbon:${carbon.idDlkCarbonFootprint}`, carbon.report, "carbon-footprint"),
    },
    waterFootprint: water && {
      value: num(water.waterFootprint),
      unit: "L",
      size: water.size,
      weightKg: num(water.weight),
      estimated: water.estimatedValue === 1,
      unitDescription: water.unitDescription,
      scope: water.scope,
      report: report(`water:${water.idDlkWaterFootprint}`, water.report, "water-footprint"),
    },
    restrictedSubstances: restricted && {
      name: restricted.restrictedSubstances,
      topic: restricted.topic,
      content: restricted.content,
      chemicalScope: restricted.chemicalScope,
      report: report(
        `restricted:${restricted.idDlkRestrictedSubstances}`,
        restricted.report,
        "restricted-substances"
      ),
    },
    circularEconomy: circular && {
      name: circular.circularEconomy,
      imageUrl: imageDataUrl(circular.imageFile),
      description: circular.description,
      topic: circular.topic,
      content: circular.content,
      report: report(
        `circular:${circular.idDlkCircularEconomy}`,
        circular.report,
        "circular-economy"
      ),
    },
    socialImpact: social && {
      name: social.socialImpact,
      femaleWorkforce: social.femaleWorkforce,
      leadership: social.leadership,
      workingConditions: social.workingConditions,
      commitmentOit: social.commitmentOit,
      scope: social.scope,
      referenceStandard: social.referenceStandard,
      report: report(`social:${social.idDlkSocialImpact}`, social.report, "social-impact"),
    },
  };
}

/* ----------------------------- supplyChain (tiers) ----------------------------- */

const layerSelect = {
  idDlkUncontrolledLayers: true,
  tier: true,
  service: true,
  product: true,
  supplier: true,
  origin: true,
  certificate: true,
  transmitter: true,
  certificateNumber: true,
  dateOfIssue: true,
  expirationDate: true,
  startDate: true,
  endDate: true,
} as const;

export async function buildSupplyChain(
  prisma: PrismaClient,
  ctx: UnitContext,
  fileUrl: DocumentUrlBuilder
) {
  const [files, rows] = await Promise.all([
    filesPresent(prisma, ctx),
    prisma.odUncontrolledLayers.findMany({
      where: { idDlkOrderDetail: ctx.idDlkOrderDetail, stateUncontrolledLayers: 1, ...active },
      select: layerSelect,
      orderBy: [{ tier: "asc" }, { service: "asc" }],
    }),
  ]);

  const layer = (r: (typeof rows)[number], doc: DppDocument) => {
    const hasSheet = files.has(`layer:${r.idDlkUncontrolledLayers}`);
    return {
    product: r.product,
    supplier: r.supplier,
    certificate:
      r.certificate || r.transmitter || r.certificateNumber || hasSheet
        ? {
            name: r.certificate,
            issuer: r.transmitter,
            number: r.certificateNumber,
            issuedAt: day(r.dateOfIssue),
            expiresAt: day(r.expirationDate),
            fileUrl: hasSheet ? fileUrl(doc) : null,
          }
        : null,
    startDate: day(r.startDate),
    endDate: day(r.endDate),
    };
  };

  const tier3 = rows.find((r) => r.tier === 3);
  const tier4 = rows.find((r) => r.tier === 4);

  return {
    tier2: {
      title: TIER_TITLES[2],
      // Tejido → Teñido → Estampado, el orden en que se procesa la tela.
      services: rows
        .filter((r) => r.tier === 2 && r.service != null && TIER2_SERVICES[r.service])
        .map((r) => ({
          service: r.service,
          serviceName: TIER2_SERVICES[r.service!].name,
          ...layer(r, TIER2_SERVICES[r.service!].doc),
        })),
    },
    tier3: tier3 ? { title: TIER_TITLES[3], ...layer(tier3, "tier-3") } : null,
    tier4: tier4 ? { title: TIER_TITLES[4], origin: tier4.origin, ...layer(tier4, "tier-4") } : null,
  };
}

/* ----------------------------- documentos ----------------------------- */

/**
 * PDF de un documento del pasaporte para la unidad dada; null si no existe, está
 * apagado o no tiene archivo. Aplica los mismos filtros que las secciones, para que
 * no se pueda bajar un informe que el pasaporte no publica.
 */
export async function getDocumentFile(
  prisma: PrismaClient,
  ctx: UnitContext,
  doc: DppDocument
): Promise<{ bytes: Uint8Array; filename: string } | null> {
  const byDetail = { idDlkOrderDetail: ctx.idDlkOrderDetail, ...active };
  const pdf = (bytes: Uint8Array | null | undefined, name: string | null | undefined, fallback: string) =>
    hasBytes(bytes) ? { bytes: bytes!, filename: name?.trim() || `${fallback}.pdf` } : null;

  switch (doc) {
    case "carbon-footprint": {
      const rows = await prisma.odCarbonFootprint.findMany({
        where: { ...byDetail, stateCarbonFootprint: 1 },
        select: { size: true, report: true, reportFile: true },
        orderBy: { idDlkCarbonFootprint: "asc" },
      });
      const row = pickBySize(rows, ctx.size);
      return row && pdf(row.reportFile, row.report, "huella-carbono");
    }
    case "water-footprint": {
      const rows = await prisma.odWaterFootprint.findMany({
        where: { ...byDetail, stateWaterFootprint: 1 },
        select: { size: true, report: true, reportFile: true },
        orderBy: { idDlkWaterFootprint: "asc" },
      });
      const row = pickBySize(rows, ctx.size);
      return row && pdf(row.reportFile, row.report, "huella-hidrica");
    }
    case "restricted-substances": {
      const row = await prisma.odRestrictedSubstances.findFirst({
        where: { ...byDetail, stateRestrictedSubstances: 1 },
        orderBy: { idDlkRestrictedSubstances: "desc" },
        select: { report: true, reportFile: true },
      });
      return row && pdf(row.reportFile, row.report, "sustancias-restringidas");
    }
    case "circular-economy": {
      const row = await prisma.odCircularEconomy.findFirst({
        where: { ...byDetail, stateCircularEconomy: 1 },
        orderBy: { idDlkCircularEconomy: "desc" },
        select: { report: true, reportFile: true },
      });
      return row && pdf(row.reportFile, row.report, "economia-circular");
    }
    case "social-impact": {
      if (ctx.idDlkBrand == null) return null;
      const row = await prisma.odSocialImpact.findFirst({
        where: { idDlkBrand: ctx.idDlkBrand, stateSocialImpact: 1, ...active },
        orderBy: { idDlkSocialImpact: "desc" },
        select: { report: true, reportFile: true },
      });
      return row && pdf(row.reportFile, row.report, "impacto-social");
    }
    default: {
      // Certificados de tiers: "tier-2-<servicio>", "tier-3", "tier-4".
      const tier = Number(doc.split("-")[1]);
      const service =
        tier === 2
          ? Number(Object.entries(TIER2_SERVICES).find(([, s]) => s.doc === doc)?.[0])
          : undefined;
      const row = await prisma.odUncontrolledLayers.findFirst({
        where: {
          ...byDetail,
          tier,
          ...(service != null ? { service } : {}),
          stateUncontrolledLayers: 1,
        },
        orderBy: { idDlkUncontrolledLayers: "desc" },
        select: { certificateSheet: true, codUncontrolledLayers: true },
      });
      return row && pdf(row.certificateSheet, null, `certificado-${row.codUncontrolledLayers}`);
    }
  }
}
