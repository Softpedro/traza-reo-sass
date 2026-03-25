import { Buffer } from "node:buffer";
import { Prisma, type PrismaClient } from "../../generated/prisma/client.js";

function isMissingMdSupplierTable(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  if (/1146|ER_NO_SUCH_TABLE|Base table or view not found|Table .* doesn't exist/i.test(msg)) {
    return true;
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2010") {
    const meta = e.meta as { message?: string } | undefined;
    const m = `${meta?.message ?? ""} ${msg}`;
    if (/1146|doesn't exist|no such table/i.test(m)) return true;
  }
  return false;
}

function isUnknownColumnError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /1054|Unknown column/i.test(msg);
}

function logoBytesToDataUrl(logo: Uint8Array | Buffer | null | undefined): string | null {
  if (logo == null || logo.byteLength === 0) return null;
  const buf = Buffer.isBuffer(logo) ? logo : Buffer.from(logo);
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

/** Ubigeo en BD nueva: VARCHAR(6). En legado: INT COD_UBIGEO_SUPPLIER */
function ubigeoToVarchar6(value: unknown): string {
  if (typeof value === "string") {
    const d = value.replace(/\D/g, "").slice(0, 6);
    return d.padStart(6, "0").slice(-6);
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value)).padStart(6, "0").slice(-6);
  }
  return "000000";
}

function ubigeoStringToIntCode(ubi: string): number {
  const n = parseInt(ubi.replace(/\D/g, "").padStart(6, "0").slice(-6), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseTypeSupplier(value: unknown): number {
  const n = Number(value);
  if (n >= 1 && n <= 6) return n;
  return 1;
}

function num(v: number | bigint): number {
  return typeof v === "bigint" ? Number(v) : v;
}

type SupplierDbLayout = "current" | "legacy";

type SupplierRow = {
  idDlkSupplier: number;
  codSupplier: string | null;
  nameSupplier: string;
  rucSupplier: string;
  typeSupplier: number;
  ubigeoSupplier: string;
  addressSupplier: string;
  gpsLocationSupplier: string | null;
  emailSupplier: string;
  cellularSupplier: string;
  webSupplier: string | null;
  logoSupplier: Buffer | Uint8Array | null;
  stateSupplier: number;
  codUsuarioCargaDl: string;
  fehProcesoCargaDl: Date;
  fehProcesoModifDl: Date;
  desAccion: string;
  flgStatutActif: number;
};

type RawRow = Record<string, unknown>;

function mapRawToSupplierRow(r: RawRow): SupplierRow {
  const ubiRaw = r.ubigeoSupplier;
  let ubigeoStr: string;
  if (typeof ubiRaw === "number" || typeof ubiRaw === "bigint") {
    ubigeoStr = String(num(ubiRaw as number | bigint)).padStart(6, "0").slice(-6);
  } else {
    ubigeoStr = String(ubiRaw ?? "").replace(/\D/g, "").padStart(6, "0").slice(-6);
  }
  return {
    idDlkSupplier: num(r.idDlkSupplier as number | bigint),
    codSupplier: r.codSupplier == null || r.codSupplier === "" ? null : String(r.codSupplier),
    nameSupplier: String(r.nameSupplier),
    rucSupplier: String(r.rucSupplier),
    typeSupplier: num(r.typeSupplier as number | bigint),
    ubigeoSupplier: ubigeoStr,
    addressSupplier: String(r.addressSupplier),
    gpsLocationSupplier: r.gpsLocationSupplier == null ? null : String(r.gpsLocationSupplier),
    emailSupplier: String(r.emailSupplier),
    cellularSupplier: String(r.cellularSupplier),
    webSupplier: r.webSupplier == null || r.webSupplier === "" ? null : String(r.webSupplier),
    logoSupplier: (r.logoSupplier as Buffer | null) ?? null,
    stateSupplier: num(r.stateSupplier as number | bigint),
    codUsuarioCargaDl: String(r.codUsuarioCargaDl ?? ""),
    fehProcesoCargaDl: r.fehProcesoCargaDl as Date,
    fehProcesoModifDl: r.fehProcesoModifDl as Date,
    desAccion: String(r.desAccion ?? ""),
    flgStatutActif: num(r.flgStatutActif as number | bigint),
  };
}

function mapSupplierForApi(row: SupplierRow) {
  const { logoSupplier, rucSupplier, codSupplier, ...rest } = row;
  const ubi = row.ubigeoSupplier;
  const codUbigeoNum = parseInt(ubi, 10);
  return {
    ...rest,
    codSupplier: codSupplier ?? "",
    rucSupplier,
    numRucSupplier: rucSupplier,
    codUbigeoSupplier: Number.isFinite(codUbigeoNum) ? codUbigeoNum : 0,
    logoSupplier: logoBytesToDataUrl(logoSupplier),
  };
}

const supplierSelectCurrent = Prisma.sql`
  SELECT
    s.ID_DLK_SUPPLIER AS idDlkSupplier,
    s.COD_SUPPLIER AS codSupplier,
    s.NAME_SUPPLIER AS nameSupplier,
    s.RUC_SUPPLIER AS rucSupplier,
    s.TYPE_SUPPLIER AS typeSupplier,
    s.UBIGEO_SUPPLIER AS ubigeoSupplier,
    s.ADDRESS_SUPPLIER AS addressSupplier,
    s.GPS_SUPPLIER AS gpsLocationSupplier,
    s.EMAIL_SUPPLIER AS emailSupplier,
    s.CELULAR_SUPPLIER AS cellularSupplier,
    s.WEB_SUPPLIER AS webSupplier,
    s.LOGO_SUPPLIER AS logoSupplier,
    s.STATE_SUPPLIER AS stateSupplier,
    s.COD_USUARIO_CARGA_DL AS codUsuarioCargaDl,
    s.FEH_PROCESO_CARGA_DL AS fehProcesoCargaDl,
    s.FEH_PROCESO_MODIF_DL AS fehProcesoModifDl,
    s.DES_ACCION AS desAccion,
    s.FLG_STATUT_ACTIF AS flgStatutActif
  FROM MD_SUPPLIER s
`;

/** Esquema anterior (MD_SUPPLIER con empresa matriz y NUM_RUC / COD_UBIGEO int) */
const supplierSelectLegacy = Prisma.sql`
  SELECT
    s.ID_DLK_SUPPLIER AS idDlkSupplier,
    s.COD_SUPPLIER AS codSupplier,
    s.NAME_SUPPLIER AS nameSupplier,
    s.NUM_RUC_SUPPLIER AS rucSupplier,
    s.TYPE_SUPPLIER AS typeSupplier,
    s.COD_UBIGEO_SUPPLIER AS ubigeoSupplier,
    s.ADDRESS_SUPPLIER AS addressSupplier,
    s.GPS_LOCATION_SUPPLIER AS gpsLocationSupplier,
    s.EMAIL_SUPPLIER AS emailSupplier,
    s.CELLULAR_SUPPLIER AS cellularSupplier,
    s.WEB_SUPPLIER AS webSupplier,
    s.LOGO_SUPPLIER AS logoSupplier,
    s.STATE_SUPPLIER AS stateSupplier,
    s.COD_USUARIO_CARGA_DL AS codUsuarioCargaDl,
    s.FEH_PROCESO_CARGA_DL AS fehProcesoCargaDl,
    s.FEH_PROCESO_MODIF_DL AS fehProcesoModifDl,
    s.DES_ACCION AS desAccion,
    s.FLG_STATUT_ACTIF AS flgStatutActif
  FROM MD_SUPPLIER s
`;

export class SupplierService {
  private layoutCache: SupplierDbLayout | null = null;

  constructor(private prisma: PrismaClient) {}

  private async detectLayout(): Promise<SupplierDbLayout> {
    if (this.layoutCache) return this.layoutCache;
    try {
      const rows = await this.prisma.$queryRaw<{ c: bigint }[]>`
        SELECT COUNT(*) AS c
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'MD_SUPPLIER'
          AND COLUMN_NAME = 'RUC_SUPPLIER'
      `;
      const hasNew = Number(rows[0]?.c ?? 0) > 0;
      this.layoutCache = hasNew ? "current" : "legacy";
    } catch {
      this.layoutCache = "legacy";
    }
    return this.layoutCache;
  }

  /** Por si migras la tabla en caliente */
  invalidateLayoutCache() {
    this.layoutCache = null;
  }

  private selectBase() {
    const layout = this.layoutCache ?? "current";
    return layout === "current" ? supplierSelectCurrent : supplierSelectLegacy;
  }

  async list() {
    await this.detectLayout();
    for (let retry = 0; retry < 2; retry++) {
      try {
        const rows = await this.prisma.$queryRaw<RawRow[]>(Prisma.sql`
          ${this.selectBase()}
          WHERE s.FLG_STATUT_ACTIF = 1
          ORDER BY s.ID_DLK_SUPPLIER DESC
        `);
        return rows.map((r) => mapSupplierForApi(mapRawToSupplierRow(r)));
      } catch (e) {
        if (isUnknownColumnError(e) && this.layoutCache === "current") {
          this.layoutCache = "legacy";
          continue;
        }
        if (isMissingMdSupplierTable(e)) {
          console.warn(
            "[suppliers:list] MD_SUPPLIER no disponible. Devolviendo []. Ver prisma/manual/20250326_md_supplier.sql"
          );
          return [];
        }
        throw e;
      }
    }
    return [];
  }

  async getById(id: number) {
    await this.detectLayout();
    for (let retry = 0; retry < 2; retry++) {
      try {
        const rows = await this.prisma.$queryRaw<RawRow[]>(Prisma.sql`
          ${this.selectBase()}
          WHERE s.ID_DLK_SUPPLIER = ${id}
          LIMIT 1
        `);
        const r = rows[0];
        return r ? mapSupplierForApi(mapRawToSupplierRow(r)) : null;
      } catch (e) {
        if (isUnknownColumnError(e) && this.layoutCache === "current") {
          this.layoutCache = "legacy";
          continue;
        }
        if (isMissingMdSupplierTable(e)) {
          console.warn("[suppliers:getById] MD_SUPPLIER no disponible.");
          return null;
        }
        throw e;
      }
    }
    return null;
  }

  async create(data: {
    codSupplier?: string | null;
    nameSupplier: string;
    rucSupplier?: string;
    numRucSupplier?: string;
    typeSupplier: number;
    ubigeoSupplier?: string;
    codUbigeoSupplier?: number;
    addressSupplier: string;
    gpsLocationSupplier?: string | null;
    gpsSupplier?: string | null;
    emailSupplier: string;
    cellularSupplier: string;
    webSupplier?: string | null;
    logoSupplier?: string;
    stateSupplier?: number;
  }) {
    const layout = await this.detectLayout();
    const ruc = (data.rucSupplier ?? data.numRucSupplier ?? "").trim();
    const ubi = ubigeoToVarchar6(data.ubigeoSupplier ?? data.codUbigeoSupplier ?? 0);
    if (ubi === "000000") {
      throw new Error("Ubigeo inválido");
    }

    let codSupplier = data.codSupplier?.trim() || null;
    if (!codSupplier) {
      const lastRows = await this.prisma.$queryRaw<{ codSupplier: string | null }[]>(Prisma.sql`
        SELECT COD_SUPPLIER AS codSupplier FROM MD_SUPPLIER
        ORDER BY ID_DLK_SUPPLIER DESC
        LIMIT 1
      `);
      const last = lastRows[0]?.codSupplier;
      const lastNum = last ? parseInt(String(last).replace(/\D/g, ""), 10) || 0 : 0;
      codSupplier = `PRV-${lastNum + 1}`;
    }

    const now = new Date();
    const logoBuf = data.logoSupplier ? Buffer.from(data.logoSupplier, "base64") : null;
    const webVal = data.webSupplier?.trim() ? data.webSupplier.trim() : null;
    const gpsVal = data.gpsLocationSupplier ?? data.gpsSupplier ?? null;
    const stateSupplier = data.stateSupplier ?? 1;

    const newId = await this.prisma.$transaction(async (tx) => {
      if (layout === "current") {
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO MD_SUPPLIER (
            COD_SUPPLIER,
            NAME_SUPPLIER,
            RUC_SUPPLIER,
            TYPE_SUPPLIER,
            UBIGEO_SUPPLIER,
            ADDRESS_SUPPLIER,
            GPS_SUPPLIER,
            EMAIL_SUPPLIER,
            CELULAR_SUPPLIER,
            WEB_SUPPLIER,
            LOGO_SUPPLIER,
            STATE_SUPPLIER,
            COD_USUARIO_CARGA_DL,
            FEH_PROCESO_CARGA_DL,
            FEH_PROCESO_MODIF_DL,
            DES_ACCION,
            FLG_STATUT_ACTIF
          ) VALUES (
            ${codSupplier},
            ${data.nameSupplier},
            ${ruc},
            ${parseTypeSupplier(data.typeSupplier)},
            ${ubi},
            ${data.addressSupplier},
            ${gpsVal},
            ${data.emailSupplier},
            ${data.cellularSupplier},
            ${webVal},
            ${logoBuf},
            ${stateSupplier},
            ${"SYSTEM"},
            ${now},
            ${now},
            ${"INSERT"},
            ${1}
          )
        `);
      } else {
        const pc = await tx.$queryRaw<{ id: number; cod: string }[]>(Prisma.sql`
          SELECT ID_DLK_PARENT_COMPANY AS id, COD_PARENT_COMPANY AS cod
          FROM MD_PARENT_COMPANY
          ORDER BY ID_DLK_PARENT_COMPANY ASC
          LIMIT 1
        `);
        const idPc = pc[0]?.id;
        const codPc = pc[0]?.cod;
        if (idPc == null || !codPc) {
          throw new Error(
            "La tabla MD_SUPPLIER (esquema anterior) requiere empresa matriz. Crea al menos una fila en MD_PARENT_COMPANY o migra el DDL nuevo (RUC_SUPPLIER / UBIGEO_SUPPLIER)."
          );
        }
        const codUbigeoInt = ubigeoStringToIntCode(ubi);
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO MD_SUPPLIER (
            COD_SUPPLIER,
            ID_DLK_PARENT_COMPANY,
            COD_PARENT_COMPANY,
            NAME_SUPPLIER,
            NUM_RUC_SUPPLIER,
            TYPE_SUPPLIER,
            COD_UBIGEO_SUPPLIER,
            ADDRESS_SUPPLIER,
            GPS_LOCATION_SUPPLIER,
            EMAIL_SUPPLIER,
            CELLULAR_SUPPLIER,
            WEB_SUPPLIER,
            LOGO_SUPPLIER,
            STATE_SUPPLIER,
            COD_USUARIO_CARGA_DL,
            FEH_PROCESO_CARGA_DL,
            FEH_PROCESO_MODIF_DL,
            DES_ACCION,
            FLG_STATUT_ACTIF
          ) VALUES (
            ${codSupplier},
            ${idPc},
            ${codPc},
            ${data.nameSupplier},
            ${ruc},
            ${parseTypeSupplier(data.typeSupplier)},
            ${codUbigeoInt},
            ${data.addressSupplier},
            ${gpsVal},
            ${data.emailSupplier},
            ${data.cellularSupplier},
            ${webVal},
            ${logoBuf},
            ${stateSupplier},
            ${"SYSTEM"},
            ${now},
            ${now},
            ${"INSERT"},
            ${1}
          )
        `);
      }
      const idRows = await tx.$queryRaw<{ id: number | bigint }[]>(Prisma.sql`
        SELECT LAST_INSERT_ID() AS id
      `);
      return num(idRows[0]?.id ?? 0);
    });

    const created = await this.getById(newId);
    if (!created) throw new Error("No se pudo leer el proveedor recién creado");
    return created;
  }

  async update(
    id: number,
    data: Partial<{
      codSupplier: string | null;
      nameSupplier: string;
      rucSupplier: string;
      numRucSupplier: string;
      typeSupplier: number;
      ubigeoSupplier: string;
      codUbigeoSupplier: number;
      addressSupplier: string;
      gpsLocationSupplier: string | null;
      gpsSupplier: string | null;
      emailSupplier: string;
      cellularSupplier: string;
      webSupplier: string | null;
      logoSupplier: string;
      stateSupplier: number;
    }>
  ) {
    const layout = await this.detectLayout();
    const parts: Prisma.Sql[] = [Prisma.sql`DES_ACCION = ${"UPDATE"}`];

    if (data.codSupplier !== undefined) parts.push(Prisma.sql`COD_SUPPLIER = ${data.codSupplier}`);
    if (data.nameSupplier !== undefined) parts.push(Prisma.sql`NAME_SUPPLIER = ${data.nameSupplier}`);

    if (data.rucSupplier !== undefined || data.numRucSupplier !== undefined) {
      const r = (data.rucSupplier ?? data.numRucSupplier ?? "").trim();
      parts.push(
        layout === "current"
          ? Prisma.sql`RUC_SUPPLIER = ${r}`
          : Prisma.sql`NUM_RUC_SUPPLIER = ${r}`
      );
    }
    if (data.typeSupplier !== undefined) {
      parts.push(Prisma.sql`TYPE_SUPPLIER = ${parseTypeSupplier(data.typeSupplier)}`);
    }
    if (data.ubigeoSupplier !== undefined || data.codUbigeoSupplier !== undefined) {
      const u = ubigeoToVarchar6(data.ubigeoSupplier ?? data.codUbigeoSupplier ?? 0);
      if (layout === "current") {
        parts.push(Prisma.sql`UBIGEO_SUPPLIER = ${u}`);
      } else {
        parts.push(Prisma.sql`COD_UBIGEO_SUPPLIER = ${ubigeoStringToIntCode(u)}`);
      }
    }
    if (data.addressSupplier !== undefined) {
      parts.push(Prisma.sql`ADDRESS_SUPPLIER = ${data.addressSupplier}`);
    }
    if (data.gpsLocationSupplier !== undefined || data.gpsSupplier !== undefined) {
      const g = data.gpsLocationSupplier ?? data.gpsSupplier ?? null;
      parts.push(
        layout === "current" ? Prisma.sql`GPS_SUPPLIER = ${g}` : Prisma.sql`GPS_LOCATION_SUPPLIER = ${g}`
      );
    }
    if (data.emailSupplier !== undefined) parts.push(Prisma.sql`EMAIL_SUPPLIER = ${data.emailSupplier}`);
    if (data.cellularSupplier !== undefined) {
      parts.push(Prisma.sql`CELULAR_SUPPLIER = ${data.cellularSupplier}`);
    }
    if (data.webSupplier !== undefined) {
      const w = data.webSupplier?.trim() ? data.webSupplier.trim() : null;
      parts.push(Prisma.sql`WEB_SUPPLIER = ${w}`);
    }
    if (data.logoSupplier) {
      parts.push(Prisma.sql`LOGO_SUPPLIER = ${Buffer.from(data.logoSupplier, "base64")}`);
    }
    if (data.stateSupplier !== undefined) {
      const s = Number(data.stateSupplier);
      parts.push(Prisma.sql`STATE_SUPPLIER = ${s}`);
      parts.push(Prisma.sql`FLG_STATUT_ACTIF = ${s === 1 ? 1 : 0}`);
    }

    parts.push(Prisma.sql`FEH_PROCESO_MODIF_DL = ${new Date()}`);

    if (parts.length <= 2) {
      const row = await this.getById(id);
      if (!row) throw new Error("Proveedor no encontrado");
      return row;
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_SUPPLIER SET ${Prisma.join(parts, ", ")}
      WHERE ID_DLK_SUPPLIER = ${id}
    `);

    const updated = await this.getById(id);
    if (!updated) throw new Error("Proveedor no encontrado");
    return updated;
  }

  async softDelete(id: number) {
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_SUPPLIER
      SET FLG_STATUT_ACTIF = 0, STATE_SUPPLIER = 0, DES_ACCION = ${"DELETE"}
      WHERE ID_DLK_SUPPLIER = ${id}
    `);
  }
}
