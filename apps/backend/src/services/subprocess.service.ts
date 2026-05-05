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

type SubprocessField =
  | "codSubprocess"
  | "codProcess"
  | "ordenPrecedenciaSubprocess"
  | "nameSubprocess"
  | "descriptionSubprocess"
  | "objectiveSubprocess"
  | "criticalitySubprocess"
  | "outsourcedSubprocess"
  | "estimatedTimeSubprocess"
  | "responsibleUnit"
  | "responsibleRole"
  | "certificationSubprocess";

const SUBPROCESS_TEMPLATE_HEADERS: { header: string; field: SubprocessField }[] = [
  { header: "CODIGO", field: "codSubprocess" },
  { header: "PROCESO", field: "codProcess" },
  { header: "ORDEN", field: "ordenPrecedenciaSubprocess" },
  { header: "NOMBRE", field: "nameSubprocess" },
  { header: "DESCRIPCION", field: "descriptionSubprocess" },
  { header: "OBJETIVO", field: "objectiveSubprocess" },
  { header: "CRITICIDAD", field: "criticalitySubprocess" },
  { header: "TERCERIZADO", field: "outsourcedSubprocess" },
  { header: "TIEMPO ESTIMADO", field: "estimatedTimeSubprocess" },
  { header: "UNIDAD RESPONSABLE", field: "responsibleUnit" },
  { header: "ROL RESPONSABLE", field: "responsibleRole" },
  { header: "CERTIFICACION", field: "certificationSubprocess" },
];

const SUBPROCESS_HEADER_ALIASES: { header: string; field: SubprocessField }[] = [
  ...SUBPROCESS_TEMPLATE_HEADERS,
  { header: "CODIGO SUBPROCESO", field: "codSubprocess" },
  { header: "COD PROCESO", field: "codProcess" },
  { header: "CODIGO PROCESO", field: "codProcess" },
  { header: "ORDEN PRECEDENCIA", field: "ordenPrecedenciaSubprocess" },
  { header: "ORDEN_PRECEDENCIA_SUBPROCESS", field: "ordenPrecedenciaSubprocess" },
  { header: "NOMBRE SUBPROCESO", field: "nameSubprocess" },
  { header: "DESCRIPCION SUBPROCESO", field: "descriptionSubprocess" },
];

export class SubprocessService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdSubprocess.findMany({
      where: { flgStatutActif: 1 },
      include: {
        process: {
          include: {
            productionChain: true,
          },
        },
      },
      orderBy: { ordenPrecedenciaSubprocess: "asc" },
    });
  }

  async getById(id: number) {
    return this.prisma.mdSubprocess.findUnique({
      where: { idDlkSubprocess: id },
      include: {
        process: {
          include: {
            productionChain: true,
          },
        },
      },
    });
  }

  async create(data: {
    idDlkProcess: number;
    ordenPrecedenciaSubprocess?: number | null;
    codSubprocess?: string;
    nameSubprocess: string;
    descriptionSubprocess?: string;
    objectiveSubprocess?: string | null;
    criticalitySubprocess?: string | null;
    outsourcedSubprocess?: string | null;
    estimatedTimeSubprocess?: number | null;
    responsibleUnit?: string | null;
    responsibleRole?: string | null;
    certificationSubprocess?: string | null;
    stateSubprocess?: number;
  }) {
    return this.prisma.mdSubprocess.create({
      data: {
        idDlkProcess: data.idDlkProcess,
        ordenPrecedenciaSubprocess: data.ordenPrecedenciaSubprocess ?? null,
        codSubprocess: data.codSubprocess?.trim() ?? "",
        nameSubprocess: data.nameSubprocess,
        descriptionSubprocess: data.descriptionSubprocess ?? "",
        objectiveSubprocess: data.objectiveSubprocess ?? null,
        criticalitySubprocess: data.criticalitySubprocess ?? null,
        outsourcedSubprocess: data.outsourcedSubprocess ?? null,
        estimatedTimeSubprocess: data.estimatedTimeSubprocess ?? null,
        responsibleUnit: data.responsibleUnit ?? null,
        responsibleRole: data.responsibleRole ?? null,
        certificationSubprocess: data.certificationSubprocess ?? null,
        stateSubprocess: data.stateSubprocess ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        fehProcesoCargaDl: new Date(),
        fehProcesoModifDl: new Date(),
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      idDlkProcess: number;
      ordenPrecedenciaSubprocess: number | null;
      codSubprocess: string;
      nameSubprocess: string;
      descriptionSubprocess: string;
      objectiveSubprocess: string | null;
      criticalitySubprocess: string | null;
      outsourcedSubprocess: string | null;
      estimatedTimeSubprocess: number | null;
      responsibleUnit: string | null;
      responsibleRole: string | null;
      certificationSubprocess: string | null;
      stateSubprocess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "idDlkProcess",
      "ordenPrecedenciaSubprocess",
      "codSubprocess",
      "nameSubprocess",
      "descriptionSubprocess",
      "objectiveSubprocess",
      "criticalitySubprocess",
      "outsourcedSubprocess",
      "estimatedTimeSubprocess",
      "responsibleUnit",
      "responsibleRole",
      "certificationSubprocess",
      "stateSubprocess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdSubprocess.update({
      where: { idDlkSubprocess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdSubprocess.update({
      where: { idDlkSubprocess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }

  buildTemplate(): Buffer {
    const headers = SUBPROCESS_TEMPLATE_HEADERS.map((h) => h.header);
    const example = [
      "",
      "PROC-1",
      1,
      "Tejido plano",
      "Subproceso de tejido plano de algodón",
      "Producir tela de calidad",
      "Alta",
      "No",
      120,
      "Producción",
      "Jefe de tejeduría",
      "GOTS",
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "Subprocesos");
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

    const headerToKey = new Map<string, SubprocessField>();
    for (const h of SUBPROCESS_HEADER_ALIASES) {
      headerToKey.set(normHeader(h.header), h.field);
    }

    const processCache = new Map<string, number>();
    const resolveProcess = async (code: string): Promise<number | null> => {
      const key = code.trim().toUpperCase();
      if (!key) return null;
      if (processCache.has(key)) {
        const v = processCache.get(key)!;
        return v === 0 ? null : v;
      }
      const found = await this.prisma.mdProcess.findFirst({
        where: {
          flgStatutActif: 1,
          codProcess: { equals: code.trim() },
        },
        select: { idDlkProcess: true },
      });
      const id = found?.idDlkProcess ?? 0;
      processCache.set(key, id);
      return id === 0 ? null : id;
    };

    const errors: { row: number; error: string }[] = [];
    let inserted = 0;

    for (let i = 0; i < raw.length; i++) {
      const rowIdx = i + 2;
      const row = raw[i];

      const data: Partial<Record<SubprocessField, unknown>> = {};
      for (const [origHeader, value] of Object.entries(row)) {
        const key = headerToKey.get(normHeader(origHeader));
        if (key) data[key] = value;
      }

      const codProcess = data.codProcess == null ? "" : String(data.codProcess).trim();
      if (!codProcess) {
        errors.push({ row: rowIdx, error: "Código de proceso vacío" });
        continue;
      }
      const idDlkProcess = await resolveProcess(codProcess);
      if (!idDlkProcess) {
        errors.push({ row: rowIdx, error: `Proceso '${codProcess}' no existe` });
        continue;
      }

      const nameSubprocess = data.nameSubprocess == null ? "" : String(data.nameSubprocess).trim();
      if (!nameSubprocess) {
        errors.push({ row: rowIdx, error: "Nombre de subproceso vacío" });
        continue;
      }

      try {
        await this.create({
          idDlkProcess,
          codSubprocess: nullableText(data.codSubprocess) ?? undefined,
          nameSubprocess,
          descriptionSubprocess: nullableText(data.descriptionSubprocess) ?? "",
          objectiveSubprocess: nullableText(data.objectiveSubprocess),
          criticalitySubprocess: nullableText(data.criticalitySubprocess),
          outsourcedSubprocess: nullableText(data.outsourcedSubprocess),
          estimatedTimeSubprocess: nullableInt(data.estimatedTimeSubprocess),
          responsibleUnit: nullableText(data.responsibleUnit),
          responsibleRole: nullableText(data.responsibleRole),
          certificationSubprocess: nullableText(data.certificationSubprocess),
          ordenPrecedenciaSubprocess: nullableInt(data.ordenPrecedenciaSubprocess),
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
