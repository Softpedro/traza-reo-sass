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

function strOrEmpty(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

/** "On" → 1, "Off" → 0. Soporta también "1"/"0", "Sí/No". */
function parseStateOnOff(v: unknown, fallback = 1): number {
  if (v == null) return fallback;
  const s = String(v).trim().toUpperCase();
  if (s === "" ) return fallback;
  if (s === "ON" || s === "1" || s === "SI" || s === "SÍ" || s === "TRUE" || s === "ACTIVO") return 1;
  if (s === "OFF" || s === "0" || s === "NO" || s === "FALSE" || s === "INACTIVO") return 0;
  // Si no calza, mejor mantenerlo activo
  return fallback;
}

type SubprocessField =
  // Subprocess base
  | "codSubprocess"
  | "codProcess"
  | "nameProcess"
  | "ordenPrecedenciaProcess"
  | "ordenPrecedenciaSubprocess"
  | "nameSubprocess"
  | "descriptionSubprocess"
  | "objectiveSubprocess"
  | "criticalitySubprocess"
  | "outsourcedSubprocess"
  | "estimatedTimeSubprocess"
  | "responsibleUnit"
  | "responsibleRole"
  | "certificationSubprocess"
  | "stateSubprocess"
  // Procedure
  | "prcCod"
  | "prcName"
  | "prcDescription"
  | "prcResponsible"
  | "prcType"
  | "prcDuration"
  | "prcCriticality"
  | "prcValidation"
  | "prcPcc"
  | "prcState"
  // Input
  | "inpCod"
  | "inpName"
  | "inpDescription"
  | "inpType"
  | "inpOrigin"
  | "inpAmount"
  | "inpUnit"
  | "inpSupplier"
  | "inpCertification"
  | "inpObservation"
  | "inpState"
  // Output
  | "outCod"
  | "outName"
  | "outDescription"
  | "outType"
  | "outDestination"
  | "outAmount"
  | "outUnit"
  | "outStateSalida"
  | "outCertification"
  | "outObservation"
  | "outState";

type RowData = Partial<Record<SubprocessField, unknown>>;

const SUBPROCESS_TEMPLATE_HEADERS: { header: string; field: SubprocessField }[] = [
  { header: "SEQ", field: "ordenPrecedenciaProcess" },
  { header: "CÓD. PROCESO", field: "codProcess" },
  { header: "PROCESO", field: "nameProcess" },
  { header: "SEQ SUB", field: "ordenPrecedenciaSubprocess" },
  { header: "CÓD. SUBPROCESO", field: "codSubprocess" },
  { header: "NOMBRE SUBPROCESO", field: "nameSubprocess" },
  { header: "DESCRIPCIÓN", field: "descriptionSubprocess" },
  { header: "OBJETIVO", field: "objectiveSubprocess" },
  { header: "RESPONSABLE", field: "responsibleRole" },
  { header: "UNIDAD", field: "responsibleUnit" },
  { header: "DUR.(h)", field: "estimatedTimeSubprocess" },
  { header: "CRITICIDAD", field: "criticalitySubprocess" },
  { header: "TERCERIZADO", field: "outsourcedSubprocess" },
  { header: "NORMA ISO", field: "certificationSubprocess" },
  { header: "ESTADO", field: "stateSubprocess" },
  { header: "PRC · CÓDIGO", field: "prcCod" },
  { header: "PRC · PROCEDURE", field: "prcName" },
  { header: "PRC · DESCRIPCIÓN", field: "prcDescription" },
  { header: "PRC · RESPONSABLE", field: "prcResponsible" },
  { header: "PRC · DESTINO", field: "prcType" },
  { header: "PRC · DURACIÓN", field: "prcDuration" },
  { header: "PRC · CRITICIDAD", field: "prcCriticality" },
  { header: "PRC · VALIDACIÓN", field: "prcValidation" },
  { header: "PRC · PCC", field: "prcPcc" },
  { header: "PRC · ESTADO", field: "prcState" },
  { header: "INP · CÓDIGO", field: "inpCod" },
  { header: "INP · INPUT", field: "inpName" },
  { header: "INP · DESCRIPCIÓN", field: "inpDescription" },
  { header: "INP · TIPO", field: "inpType" },
  { header: "INP · ORIGEN", field: "inpOrigin" },
  { header: "INP · CANTIDAD", field: "inpAmount" },
  { header: "INP · UNIDAD", field: "inpUnit" },
  { header: "INP · PROVEEDOR", field: "inpSupplier" },
  { header: "INP · CERTIFICACIÓN", field: "inpCertification" },
  { header: "INP · OBSERVACIÓN", field: "inpObservation" },
  { header: "INP · ESTADO", field: "inpState" },
  { header: "OUT · CÓDIGO", field: "outCod" },
  { header: "OUT · OUTPUT", field: "outName" },
  { header: "OUT · DESCRIPCIÓN", field: "outDescription" },
  { header: "OUT · TIPO", field: "outType" },
  { header: "OUT · DESTINO", field: "outDestination" },
  { header: "OUT · CANTIDAD", field: "outAmount" },
  { header: "OUT · UNIDAD", field: "outUnit" },
  { header: "OUT · ESTADO SALIDA", field: "outStateSalida" },
  { header: "OUT · CERTIFICACIÓN", field: "outCertification" },
  { header: "OUT · OBSERVACIÓN", field: "outObservation" },
  { header: "OUT · ESTADO", field: "outState" },
];

const SUBPROCESS_HEADER_ALIASES: { header: string; field: SubprocessField }[] = [
  ...SUBPROCESS_TEMPLATE_HEADERS,
  // Aliases para formato simple original
  { header: "CODIGO", field: "codSubprocess" },
  { header: "CODIGO SUBPROCESO", field: "codSubprocess" },
  { header: "COD SUBPROCESO", field: "codSubprocess" },
  { header: "COD PROCESO", field: "codProcess" },
  { header: "CODIGO PROCESO", field: "codProcess" },
  { header: "NOMBRE PROCESO", field: "nameProcess" },
  { header: "ORDEN", field: "ordenPrecedenciaSubprocess" },
  { header: "ORDEN PRECEDENCIA", field: "ordenPrecedenciaSubprocess" },
  { header: "ORDEN_PRECEDENCIA_SUBPROCESS", field: "ordenPrecedenciaSubprocess" },
  { header: "NOMBRE", field: "nameSubprocess" },
  { header: "DESCRIPCION", field: "descriptionSubprocess" },
  { header: "DESCRIPCION SUBPROCESO", field: "descriptionSubprocess" },
  { header: "TIEMPO ESTIMADO", field: "estimatedTimeSubprocess" },
  { header: "DUR. (H)", field: "estimatedTimeSubprocess" },
  { header: "DUR.(H)", field: "estimatedTimeSubprocess" },
  { header: "DURACION", field: "estimatedTimeSubprocess" },
  { header: "UNIDAD RESPONSABLE", field: "responsibleUnit" },
  { header: "ROL RESPONSABLE", field: "responsibleRole" },
  { header: "CERTIFICACION", field: "certificationSubprocess" },
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
      "01", "PRO-COM", "Gestión comercial", "01",
      "SUB-PRO-COM-EST-MKT", "Investigación de Mercado",
      "Investigación B2C/B2B y análisis de tendencias.",
      "Contar con estudio de mercado del producto.",
      "Asistente Comercial", "GC - Gerencia Comercial", 24,
      "2 - Alta", "1 - No", "ISO 9001:2015 – 8.2.2", "On",
      "PRC-SUB-PRO-COM-EST-MKT", "Estudio de mercado",
      "Investigación B2C y análisis competencia.",
      "Asistente Comercial", "UDP", "24", "Alta", "Aprobado", "Interna", "On",
      "INP-SUB-PRO-COM-EST-MKT", "Estudio de Mercado",
      "Estudio de mercado B2C", "Informe", "Investigación interna",
      "1", "Estudio", "Interno", "N/A", "Análisis competencia", "On",
      "OUT-SUB-PRO-COM-EST-MKT", "Estudio de Mercado",
      "Estudio de mercado del producto.", "Documento", "UDP",
      "1", "Orden", "Aprobado", "Interna", "Ninguna", "On",
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "SUBPROCESOS");
    return XLSX.write(wb, { bookType: "xlsx", type: "buffer" }) as Buffer;
  }

  /**
   * Resuelve o auto-crea el proceso padre dado su código.
   * Si no existe, lo crea con la primera parent company y production chain activas.
   */
  private async resolveOrCreateProcess(
    codProcess: string,
    nameProcess: string,
    ordenPrecedencia: number,
    parentCompanyId: number,
    productionChainId: number
  ): Promise<number> {
    const existing = await this.prisma.mdProcess.findFirst({
      where: { flgStatutActif: 1, codProcess: codProcess.trim() },
      select: { idDlkProcess: true },
    });
    if (existing) return existing.idDlkProcess;

    const created = await this.prisma.mdProcess.create({
      data: {
        idDlkParentCompany: parentCompanyId,
        idDlkProductionChain: productionChainId,
        ordenPrecedenciaProcess: ordenPrecedencia,
        codProcess: codProcess.trim(),
        nameProcess: (nameProcess || codProcess).trim(),
        desProcess: "",
        objetiveProcess: "",
        criticalityProcess: "",
        outsourcedProcess: "",
        estimatedTimeProcess: 0,
        responsibleUnit: "",
        responsibleProcess: "",
        processCertification: null,
        stateProcess: 1,
        codUsuarioCargaDl: "SYSTEM",
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
      select: { idDlkProcess: true },
    });
    return created.idDlkProcess;
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

    // Defaults para auto-creación de procesos
    const defaultParent = await this.prisma.mdParentCompany.findFirst({
      where: { flgStatutActif: 1 },
      select: { idDlkParentCompany: true },
      orderBy: { idDlkParentCompany: "asc" },
    });
    const defaultChain = await this.prisma.mdProductionChain.findFirst({
      where: { flgStatutActif: 1 },
      select: { idDlkProductionChain: true },
      orderBy: { idDlkProductionChain: "asc" },
    });

    const errors: { row: number; error: string }[] = [];
    let inserted = 0;

    // Cache de procesos resueltos por codProcess
    const processCache = new Map<string, number>();
    let nextProcessOrder = 1;
    {
      // Inicializa contador con el máximo orden existente +1
      const maxRow = await this.prisma.mdProcess.findFirst({
        where: { flgStatutActif: 1 },
        select: { ordenPrecedenciaProcess: true },
        orderBy: { ordenPrecedenciaProcess: "desc" },
      });
      if (maxRow?.ordenPrecedenciaProcess != null) {
        nextProcessOrder = maxRow.ordenPrecedenciaProcess + 1;
      }
    }

    for (let i = 0; i < raw.length; i++) {
      const rowIdx = i + 2;
      const row = raw[i];

      const data: RowData = {};
      for (const [origHeader, value] of Object.entries(row)) {
        const key = headerToKey.get(normHeader(origHeader));
        if (key) data[key] = value;
      }

      // Skip filas totalmente vacías
      const codProcess = strOrEmpty(data.codProcess);
      const nameSubprocess = strOrEmpty(data.nameSubprocess);
      if (!codProcess && !nameSubprocess) continue;

      if (!codProcess) {
        errors.push({ row: rowIdx, error: "Código de proceso vacío" });
        continue;
      }
      if (!nameSubprocess) {
        errors.push({ row: rowIdx, error: "Nombre de subproceso vacío" });
        continue;
      }

      // Resolver / auto-crear proceso padre
      const procKey = codProcess.toUpperCase();
      let idDlkProcess = processCache.get(procKey);
      if (!idDlkProcess) {
        try {
          const existing = await this.prisma.mdProcess.findFirst({
            where: { flgStatutActif: 1, codProcess },
            select: { idDlkProcess: true },
          });
          if (existing) {
            idDlkProcess = existing.idDlkProcess;
          } else {
            if (!defaultParent || !defaultChain) {
              errors.push({
                row: rowIdx,
                error: `Proceso '${codProcess}' no existe y no hay parent company / production chain por defecto para crearlo`,
              });
              continue;
            }
            idDlkProcess = await this.resolveOrCreateProcess(
              codProcess,
              strOrEmpty(data.nameProcess),
              nextProcessOrder++,
              defaultParent.idDlkParentCompany,
              defaultChain.idDlkProductionChain
            );
          }
          processCache.set(procKey, idDlkProcess);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al resolver proceso";
          errors.push({ row: rowIdx, error: `Proceso '${codProcess}': ${msg}` });
          continue;
        }
      }

      // Crear subproceso
      let createdSubId: number;
      try {
        const created = await this.create({
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
          stateSubprocess: parseStateOnOff(data.stateSubprocess, 1),
        });
        createdSubId = created.idDlkSubprocess;
        inserted++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error al insertar subproceso";
        errors.push({ row: rowIdx, error: msg });
        continue;
      }

      // Crear procedure si tiene nombre
      const prcName = strOrEmpty(data.prcName);
      if (prcName) {
        try {
          await this.prisma.mdProcedureSubprocess.create({
            data: {
              idDlkSubprocess: createdSubId,
              codProcedureSubprocess: strOrEmpty(data.prcCod),
              nameProcedureSubprocess: prcName,
              descriptionProcedureSubprocess: strOrEmpty(data.prcDescription),
              typeProcedureSubprocess: strOrEmpty(data.prcType),
              responsibleProcedureSubprocess: strOrEmpty(data.prcResponsible),
              estimatedTimeSubprocess: strOrEmpty(data.prcDuration) || "0",
              criticalitySubprocess: strOrEmpty(data.prcCriticality),
              validationMethodSubprocess: strOrEmpty(data.prcValidation),
              pccSubprocess: strOrEmpty(data.prcPcc),
              stateProcedureSubprocess: parseStateOnOff(data.prcState, 1),
              codUsuarioCargaDl: "SYSTEM",
              desAccion: "INSERT",
              flgStatutActif: 1,
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al insertar procedure";
          errors.push({ row: rowIdx, error: `Procedure: ${msg}` });
        }
      }

      // Crear input si tiene nombre
      const inpName = strOrEmpty(data.inpName);
      if (inpName) {
        try {
          await this.prisma.mdInputSubprocess.create({
            data: {
              idDlkSubprocess: createdSubId,
              codInputSubprocess: strOrEmpty(data.inpCod),
              nameInputSubprocess: inpName,
              descriptionInputSubprocess: strOrEmpty(data.inpDescription),
              typeInputSubprocess: strOrEmpty(data.inpType),
              originInputSubprocess: strOrEmpty(data.inpOrigin),
              amountInputSubprocess: strOrEmpty(data.inpAmount),
              unitQuantity: strOrEmpty(data.inpUnit),
              supplierInputSubprocess: nullableText(data.inpSupplier),
              certificationInputSubprocess: nullableText(data.inpCertification),
              observationInputSubprocess: nullableText(data.inpObservation),
              stateInputSubprocess: parseStateOnOff(data.inpState, 1),
              codUsuarioCargaDl: "SYSTEM",
              desAccion: "INSERT",
              flgStatutActif: 1,
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al insertar input";
          errors.push({ row: rowIdx, error: `Input: ${msg}` });
        }
      }

      // Crear output si tiene nombre
      const outName = strOrEmpty(data.outName);
      if (outName) {
        try {
          await this.prisma.mdOutputSubprocess.create({
            data: {
              idDlkSubprocess: createdSubId,
              codOutputSubprocess: strOrEmpty(data.outCod),
              nameOutputSubprocess: outName,
              descriptionOutputSubprocess: strOrEmpty(data.outDescription),
              typeOutputSubprocess: strOrEmpty(data.outType),
              destinationOutputSubprocess: strOrEmpty(data.outDestination),
              amountOutputSubprocess: strOrEmpty(data.outAmount),
              unitQuantity: strOrEmpty(data.outUnit),
              stateOutputSubprocess: strOrEmpty(data.outStateSalida),
              certificationOutputSubprocess: nullableText(data.outCertification),
              observationOutputSubprocess: nullableText(data.outObservation),
              stateOutput: parseStateOnOff(data.outState, 1),
              codUsuarioCargaDl: "SYSTEM",
              desAccion: "INSERT",
              flgStatutActif: 1,
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al insertar output";
          errors.push({ row: rowIdx, error: `Output: ${msg}` });
        }
      }
    }

    return { inserted, errors };
  }
}
