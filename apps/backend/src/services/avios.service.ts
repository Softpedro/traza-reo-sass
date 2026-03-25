import { Prisma, type PrismaClient } from "../../generated/prisma/client.js";

export function isMissingMdAviosTable(e: unknown): boolean {
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

function num(v: number | bigint): number {
  return typeof v === "bigint" ? Number(v) : v;
}

type AviosRow = {
  idDlkAvios: number;
  codAvios: string | null;
  idDlkSupplier: number;
  codSupplier: string;
  nameAvios: string;
  desAvios: string | null;
  obsAvios: string | null;
  stateAvios: number;
  codUsuarioCargaDl: string;
  fehProcesoCargaDl: Date;
  fehProcesoModifDl: Date;
  desAccion: string;
  flgStatutActif: number;
  supplier: {
    idDlkSupplier: number;
    codSupplier: string;
    nameSupplier: string;
  } | null;
};

type RawJoinRow = Record<string, unknown>;

function mapRawToAviosRow(r: RawJoinRow): AviosRow {
  const supId = r.supplier_idDlkSupplier;
  return {
    idDlkAvios: num(r.idDlkAvios as number | bigint),
    codAvios: r.codAvios == null || r.codAvios === "" ? null : String(r.codAvios),
    idDlkSupplier: num(r.idDlkSupplier as number | bigint),
    codSupplier: String(r.supplier_codSupplier ?? ""),
    nameAvios: String(r.nameAvios),
    desAvios: r.desAvios == null || r.desAvios === "" ? null : String(r.desAvios),
    obsAvios: r.obsAvios == null || r.obsAvios === "" ? null : String(r.obsAvios),
    stateAvios: num(r.stateAvios as number | bigint),
    codUsuarioCargaDl: String(r.codUsuarioCargaDl),
    fehProcesoCargaDl: r.fehProcesoCargaDl as Date,
    fehProcesoModifDl: r.fehProcesoModifDl as Date,
    desAccion: String(r.desAccion),
    flgStatutActif: num(r.flgStatutActif as number | bigint),
    supplier:
      supId != null
        ? {
            idDlkSupplier: num(supId as number | bigint),
            codSupplier: String(r.supplier_codSupplier ?? ""),
            nameSupplier: String(r.supplier_nameSupplier ?? ""),
          }
        : null,
  };
}

function mapAviosForApi(row: AviosRow) {
  return {
    ...row,
    codAvios: row.codAvios ?? "",
  };
}

const aviosSelectBase = Prisma.sql`
  SELECT
    a.ID_DLK_AVIOS AS idDlkAvios,
    a.COD_AVIOS AS codAvios,
    a.ID_DLK_SUPPLIER AS idDlkSupplier,
    a.NAME_AVIOS AS nameAvios,
    a.DES_AVIOS AS desAvios,
    a.OBS_AVIOS AS obsAvios,
    a.STATE_AVIOS AS stateAvios,
    a.COD_USUARIO_CARGA_DL AS codUsuarioCargaDl,
    a.FEH_PROCESO_CARGA_DL AS fehProcesoCargaDl,
    a.FEH_PROCESO_MODIF_DL AS fehProcesoModifDl,
    a.DES_ACCION AS desAccion,
    a.FLG_STATUT_ACTIF AS flgStatutActif,
    s.ID_DLK_SUPPLIER AS supplier_idDlkSupplier,
    s.COD_SUPPLIER AS supplier_codSupplier,
    s.NAME_SUPPLIER AS supplier_nameSupplier
  FROM MD_AVIOS a
  INNER JOIN MD_SUPPLIER s ON s.ID_DLK_SUPPLIER = a.ID_DLK_SUPPLIER
`;

export class AviosService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    try {
      const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
        ${aviosSelectBase}
        WHERE a.FLG_STATUT_ACTIF = 1
        ORDER BY a.ID_DLK_AVIOS DESC
      `);
      return rows.map((r) => mapAviosForApi(mapRawToAviosRow(r)));
    } catch (e) {
      if (isMissingMdAviosTable(e)) {
        console.warn("[avios:list] MD_AVIOS no existe. Propagar error para respuesta 503.");
        throw e;
      }
      throw e;
    }
  }

  async getById(id: number) {
    try {
      const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
        ${aviosSelectBase}
        WHERE a.ID_DLK_AVIOS = ${id}
        LIMIT 1
      `);
      const r = rows[0];
      return r ? mapAviosForApi(mapRawToAviosRow(r)) : null;
    } catch (e) {
      if (isMissingMdAviosTable(e)) {
        console.warn("[avios:getById] MD_AVIOS no disponible.");
        return null;
      }
      throw e;
    }
  }

  async create(data: {
    codAvios?: string;
    idDlkSupplier: number;
    nameAvios: string;
    desAvios?: string | null;
    obsAvios?: string | null;
    stateAvios?: number;
  }) {
    let codAviosVal = data.codAvios?.trim() || null;
    if (!codAviosVal) {
      const lastRows = await this.prisma.$queryRaw<{ cod: string | null }[]>(Prisma.sql`
        SELECT COD_AVIOS AS cod FROM MD_AVIOS
        ORDER BY ID_DLK_AVIOS DESC
        LIMIT 1
      `);
      const last = lastRows[0]?.cod;
      const lastNum = last ? parseInt(String(last).replace(/\D/g, ""), 10) || 0 : 0;
      codAviosVal = `AVI-${lastNum + 1}`;
    }

    const now = new Date();
    const stateAvios = data.stateAvios ?? 1;
    const des = data.desAvios?.trim() ? data.desAvios.trim() : null;
    const obs = data.obsAvios?.trim() ? data.obsAvios.trim() : null;

    const newId = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO MD_AVIOS (
          ID_DLK_SUPPLIER,
          COD_AVIOS,
          NAME_AVIOS,
          DES_AVIOS,
          OBS_AVIOS,
          STATE_AVIOS,
          COD_USUARIO_CARGA_DL,
          FEH_PROCESO_CARGA_DL,
          FEH_PROCESO_MODIF_DL,
          DES_ACCION,
          FLG_STATUT_ACTIF
        ) VALUES (
          ${data.idDlkSupplier},
          ${codAviosVal},
          ${data.nameAvios},
          ${des},
          ${obs},
          ${stateAvios},
          ${"SYSTEM"},
          ${now},
          ${now},
          ${"INSERT"},
          ${1}
        )
      `);
      const idRows = await tx.$queryRaw<{ id: number | bigint }[]>(Prisma.sql`
        SELECT LAST_INSERT_ID() AS id
      `);
      return num(idRows[0]?.id ?? 0);
    });

    const created = await this.getById(newId);
    if (!created) throw new Error("No se pudo leer el avío recién creado");
    return created;
  }

  async update(
    id: number,
    data: Partial<{
      codAvios: string;
      idDlkSupplier: number;
      nameAvios: string;
      desAvios: string | null;
      obsAvios: string | null;
      stateAvios: number;
    }>
  ) {
    const parts: Prisma.Sql[] = [Prisma.sql`DES_ACCION = ${"UPDATE"}`];

    if (data.codAvios !== undefined) {
      parts.push(Prisma.sql`COD_AVIOS = ${data.codAvios}`);
    }
    if (data.idDlkSupplier !== undefined) {
      parts.push(Prisma.sql`ID_DLK_SUPPLIER = ${data.idDlkSupplier}`);
    }
    if (data.nameAvios !== undefined) {
      parts.push(Prisma.sql`NAME_AVIOS = ${data.nameAvios}`);
    }
    if (data.desAvios !== undefined) {
      const d = data.desAvios?.trim() ? data.desAvios.trim() : null;
      parts.push(Prisma.sql`DES_AVIOS = ${d}`);
    }
    if (data.obsAvios !== undefined) {
      const o = data.obsAvios?.trim() ? data.obsAvios.trim() : null;
      parts.push(Prisma.sql`OBS_AVIOS = ${o}`);
    }
    if (data.stateAvios !== undefined) {
      const s = Number(data.stateAvios);
      parts.push(Prisma.sql`STATE_AVIOS = ${s}`);
      parts.push(Prisma.sql`FLG_STATUT_ACTIF = ${s === 1 ? 1 : 0}`);
    }

    parts.push(Prisma.sql`FEH_PROCESO_MODIF_DL = ${new Date()}`);

    if (parts.length <= 2) {
      const row = await this.getById(id);
      if (!row) throw new Error("Avío no encontrado");
      return row;
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_AVIOS SET ${Prisma.join(parts, ", ")}
      WHERE ID_DLK_AVIOS = ${id}
    `);

    const updated = await this.getById(id);
    if (!updated) throw new Error("Avío no encontrado");
    return updated;
  }

  async softDelete(id: number) {
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_AVIOS
      SET FLG_STATUT_ACTIF = 0, STATE_AVIOS = 0, DES_ACCION = ${"DELETE"}
      WHERE ID_DLK_AVIOS = ${id}
    `);
  }
}
