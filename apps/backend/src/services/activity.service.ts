import { Buffer } from "node:buffer";
import * as XLSX from "xlsx";
import type { PrismaClient } from "../../generated/prisma/client.js";

function normHeader(v: unknown): string {
  return String(v ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function nullableText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function nullableInt(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

type ActivityField =
  | "codActivities"
  | "codSubprocess"
  | "orderActivities"
  | "nameActivities"
  | "descriptionActivities"
  | "typeActivities"
  | "estimatedTimeActivities"
  | "machineRequired"
  | "skillRequired"
  | "checklistActivities";

const ACTIVITY_TEMPLATE_HEADERS: { header: string; field: ActivityField }[] = [
  { header: "CODIGO", field: "codActivities" },
  { header: "SUBPROCESO", field: "codSubprocess" },
  { header: "ORDEN", field: "orderActivities" },
  { header: "NOMBRE", field: "nameActivities" },
  { header: "DESCRIPCION", field: "descriptionActivities" },
  { header: "TIPO", field: "typeActivities" },
  { header: "TIEMPO ESTIMADO", field: "estimatedTimeActivities" },
  { header: "MAQUINA", field: "machineRequired" },
  { header: "HABILIDAD", field: "skillRequired" },
  { header: "CHECKLIST", field: "checklistActivities" },
];

const ACTIVITY_HEADER_ALIASES: { header: string; field: ActivityField }[] = [
  ...ACTIVITY_TEMPLATE_HEADERS,
  { header: "CODIGO ACTIVIDAD", field: "codActivities" },
  { header: "COD SUBPROCESO", field: "codSubprocess" },
  { header: "CODIGO SUBPROCESO", field: "codSubprocess" },
  { header: "ORDER ACTIVITIES", field: "orderActivities" },
  { header: "ORDEN ACTIVIDAD", field: "orderActivities" },
  { header: "NOMBRE ACTIVIDAD", field: "nameActivities" },
  { header: "DESCRIPCION ACTIVIDAD", field: "descriptionActivities" },
  { header: "TIPO ACTIVIDAD", field: "typeActivities" },
  { header: "TIEMPO", field: "estimatedTimeActivities" },
  { header: "MAQUINA REQUERIDA", field: "machineRequired" },
  { header: "HABILIDAD REQUERIDA", field: "skillRequired" },
];

export class ActivityService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdActivities.findMany({
      where: { flgStatutActif: 1 },
      include: {
        subprocess: {
          include: {
            process: {
              include: {
                productionChain: true,
              },
            },
          },
        },
      },
      orderBy: { orderActivities: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdActivities.findUnique({
      where: { idDlkActivities: id },
      include: {
        subprocess: {
          include: {
            process: {
              include: {
                productionChain: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    idDlkSubprocess: number;
    codActivities?: string;
    nameActivities: string;
    descriptionActivities?: string;
    typeActivities?: string;
    orderActivities?: number | null;
    estimatedTimeActivities?: string | null;
    machineRequired?: string | null;
    skillRequired?: string | null;
    checklistActivities?: string | null;
    stateActivities?: number;
  }) {
    return this.prisma.mdActivities.create({
      data: {
        idDlkSubprocess: data.idDlkSubprocess,
        codActivities: data.codActivities?.trim() ?? "",
        nameActivities: data.nameActivities,
        descriptionActivities: data.descriptionActivities ?? "",
        typeActivities: data.typeActivities ?? "",
        orderActivities: data.orderActivities ?? null,
        estimatedTimeActivities: data.estimatedTimeActivities ?? null,
        machineRequired: data.machineRequired ?? null,
        skillRequired: data.skillRequired ?? null,
        checklistActivities: data.checklistActivities ?? null,
        stateActivities: data.stateActivities ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        fehProcesoCargaDl: new Date(),
        fehProcesoModifDl: null,
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      idDlkSubprocess: number;
      codActivities: string;
      nameActivities: string;
      descriptionActivities: string;
      typeActivities: string;
      orderActivities: number | null;
      estimatedTimeActivities: string | null;
      machineRequired: string | null;
      skillRequired: string | null;
      checklistActivities: string | null;
      stateActivities: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "idDlkSubprocess",
      "codActivities",
      "nameActivities",
      "descriptionActivities",
      "typeActivities",
      "orderActivities",
      "estimatedTimeActivities",
      "machineRequired",
      "skillRequired",
      "checklistActivities",
      "stateActivities",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdActivities.update({
      where: { idDlkActivities: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdActivities.update({
      where: { idDlkActivities: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }

  buildTemplate(): Buffer {
    const headers = ACTIVITY_TEMPLATE_HEADERS.map((h) => h.header);
    const example = [
      "",
      "SUB-1",
      1,
      "Cortado de tela",
      "Corte según patrón",
      "Operativa",
      "30 min",
      "Cortadora industrial",
      "Operario certificado",
      "Verificar bordes y medidas",
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "Actividades");
    return XLSX.write(wb, { bookType: "xlsx", type: "buffer" }) as Buffer;
  }

  async bulkCreate(
    fileBase64: string
  ): Promise<{ inserted: number; errors: { row: number; error: string }[] }> {
    if (!fileBase64 || typeof fileBase64 !== "string") {
      throw new Error("El archivo no llegó correctamente");
    }
    const cleaned = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buf = Buffer.from(cleaned, "base64");

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buf, { type: "buffer" });
    } catch {
      throw new Error("No se pudo leer el Excel. Verifica que sea un .xlsx válido.");
    }

    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) throw new Error("El Excel no tiene hojas");
    const sheet = workbook.Sheets[firstSheet];
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
      raw: false,
    });

    if (raw.length === 0) return { inserted: 0, errors: [] };

    const headerToKey = new Map<string, ActivityField>();
    for (const h of ACTIVITY_HEADER_ALIASES) {
      headerToKey.set(normHeader(h.header), h.field);
    }

    const subprocessCache = new Map<string, number>();
    const resolveSubprocess = async (code: string): Promise<number | null> => {
      const key = code.trim().toUpperCase();
      if (!key) return null;
      if (subprocessCache.has(key)) {
        const v = subprocessCache.get(key)!;
        return v === 0 ? null : v;
      }
      const found = await this.prisma.mdSubprocess.findFirst({
        where: {
          flgStatutActif: 1,
          codSubprocess: { equals: code.trim() },
        },
        select: { idDlkSubprocess: true },
      });
      const id = found?.idDlkSubprocess ?? 0;
      subprocessCache.set(key, id);
      return id === 0 ? null : id;
    };

    const errors: { row: number; error: string }[] = [];
    let inserted = 0;

    for (let i = 0; i < raw.length; i++) {
      const rowIdx = i + 2;
      const row = raw[i];

      const data: Partial<Record<ActivityField, unknown>> = {};
      for (const [origHeader, value] of Object.entries(row)) {
        const key = headerToKey.get(normHeader(origHeader));
        if (key) data[key] = value;
      }

      const codSub = data.codSubprocess == null ? "" : String(data.codSubprocess).trim();
      if (!codSub) {
        errors.push({ row: rowIdx, error: "Código de subproceso vacío" });
        continue;
      }
      const idDlkSubprocess = await resolveSubprocess(codSub);
      if (!idDlkSubprocess) {
        errors.push({ row: rowIdx, error: `Subproceso '${codSub}' no existe` });
        continue;
      }

      const nameActivities = data.nameActivities == null ? "" : String(data.nameActivities).trim();
      if (!nameActivities) {
        errors.push({ row: rowIdx, error: "Nombre de actividad vacío" });
        continue;
      }

      try {
        await this.create({
          idDlkSubprocess,
          codActivities: nullableText(data.codActivities) ?? undefined,
          nameActivities,
          descriptionActivities: nullableText(data.descriptionActivities) ?? "",
          typeActivities: nullableText(data.typeActivities) ?? "",
          orderActivities: nullableInt(data.orderActivities),
          estimatedTimeActivities: nullableText(data.estimatedTimeActivities),
          machineRequired: nullableText(data.machineRequired),
          skillRequired: nullableText(data.skillRequired),
          checklistActivities: nullableText(data.checklistActivities),
        });
        inserted++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error al insertar";
        errors.push({ row: rowIdx, error: msg });
      }
    }

    return { inserted, errors };
  }
}
