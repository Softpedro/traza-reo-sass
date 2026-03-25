import { Prisma, type PrismaClient } from "../../generated/prisma/client.js";

/** Exportado para que las rutas respondan 503 en lugar de 500 genérico. */
export function isMissingMdMaterialsTable(e: unknown): boolean {
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

type MaterialRow = {
  idDlkMaterial: number;
  codMaterial: string | null;
  idDlkSupplier: number;
  codSupplier: string;
  nameMaterial: string;
  desMaterial: string | null;
  obsMaterial: string | null;
  stateMaterial: number;
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

function mapRawToMaterialRow(r: RawJoinRow): MaterialRow {
  const supId = r.supplier_idDlkSupplier;
  return {
    idDlkMaterial: num(r.idDlkMaterial as number | bigint),
    codMaterial: r.codMaterial == null || r.codMaterial === "" ? null : String(r.codMaterial),
    idDlkSupplier: num(r.idDlkSupplier as number | bigint),
    codSupplier: String(r.supplier_codSupplier ?? ""),
    nameMaterial: String(r.nameMaterial),
    desMaterial: r.desMaterial == null || r.desMaterial === "" ? null : String(r.desMaterial),
    obsMaterial: r.obsMaterial == null || r.obsMaterial === "" ? null : String(r.obsMaterial),
    stateMaterial: num(r.stateMaterial as number | bigint),
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

function mapMaterialForApi(row: MaterialRow) {
  return {
    ...row,
    codMaterial: row.codMaterial ?? "",
  };
}

const materialSelectBase = Prisma.sql`
  SELECT
    m.ID_DLK_MATERIALS AS idDlkMaterial,
    m.COD_MATERIALS AS codMaterial,
    m.ID_DLK_SUPPLIER AS idDlkSupplier,
    m.NAME_MATERIALS AS nameMaterial,
    m.DES_MATERIALS AS desMaterial,
    m.OBS_MATERIALS AS obsMaterial,
    m.STATE_MATERIALS AS stateMaterial,
    m.COD_USUARIO_CARGA_DL AS codUsuarioCargaDl,
    m.FEH_PROCESO_CARGA_DL AS fehProcesoCargaDl,
    m.FEH_PROCESO_MODIF_DL AS fehProcesoModifDl,
    m.DES_ACCION AS desAccion,
    m.FLG_STATUT_ACTIF AS flgStatutActif,
    s.ID_DLK_SUPPLIER AS supplier_idDlkSupplier,
    s.COD_SUPPLIER AS supplier_codSupplier,
    s.NAME_SUPPLIER AS supplier_nameSupplier
  FROM MD_MATERIALS m
  INNER JOIN MD_SUPPLIER s ON s.ID_DLK_SUPPLIER = m.ID_DLK_SUPPLIER
`;

export class MaterialService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    try {
      const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
        ${materialSelectBase}
        WHERE m.FLG_STATUT_ACTIF = 1
        ORDER BY m.ID_DLK_MATERIALS DESC
      `);
      return rows.map((r) => mapMaterialForApi(mapRawToMaterialRow(r)));
    } catch (e) {
      if (isMissingMdMaterialsTable(e)) {
        console.warn("[materials:list] MD_MATERIALS no existe. Propagar error para respuesta 503.");
        throw e;
      }
      throw e;
    }
  }

  async getById(id: number) {
    try {
      const rows = await this.prisma.$queryRaw<RawJoinRow[]>(Prisma.sql`
        ${materialSelectBase}
        WHERE m.ID_DLK_MATERIALS = ${id}
        LIMIT 1
      `);
      const r = rows[0];
      return r ? mapMaterialForApi(mapRawToMaterialRow(r)) : null;
    } catch (e) {
      if (isMissingMdMaterialsTable(e)) {
        console.warn("[materials:getById] MD_MATERIALS no disponible.");
        return null;
      }
      throw e;
    }
  }

  async create(data: {
    codMaterial?: string;
    idDlkSupplier: number;
    nameMaterial: string;
    desMaterial?: string | null;
    obsMaterial?: string | null;
    stateMaterial?: number;
  }) {
    let codMaterials = data.codMaterial?.trim() || null;
    if (!codMaterials) {
      const lastRows = await this.prisma.$queryRaw<{ cod: string | null }[]>(Prisma.sql`
        SELECT COD_MATERIALS AS cod FROM MD_MATERIALS
        ORDER BY ID_DLK_MATERIALS DESC
        LIMIT 1
      `);
      const last = lastRows[0]?.cod;
      const lastNum = last ? parseInt(String(last).replace(/\D/g, ""), 10) || 0 : 0;
      codMaterials = `MAT-${lastNum + 1}`;
    }

    const now = new Date();
    const stateMaterial = data.stateMaterial ?? 1;
    const des = data.desMaterial?.trim() ? data.desMaterial.trim() : null;
    const obs = data.obsMaterial?.trim() ? data.obsMaterial.trim() : null;

    const newId = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO MD_MATERIALS (
          ID_DLK_SUPPLIER,
          COD_MATERIALS,
          NAME_MATERIALS,
          DES_MATERIALS,
          OBS_MATERIALS,
          STATE_MATERIALS,
          COD_USUARIO_CARGA_DL,
          FEH_PROCESO_CARGA_DL,
          FEH_PROCESO_MODIF_DL,
          DES_ACCION,
          FLG_STATUT_ACTIF
        ) VALUES (
          ${data.idDlkSupplier},
          ${codMaterials},
          ${data.nameMaterial},
          ${des},
          ${obs},
          ${stateMaterial},
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
    if (!created) throw new Error("No se pudo leer el material recién creado");
    return created;
  }

  async update(
    id: number,
    data: Partial<{
      codMaterial: string;
      idDlkSupplier: number;
      nameMaterial: string;
      desMaterial: string | null;
      obsMaterial: string | null;
      stateMaterial: number;
    }>
  ) {
    const parts: Prisma.Sql[] = [Prisma.sql`DES_ACCION = ${"UPDATE"}`];

    if (data.codMaterial !== undefined) {
      parts.push(Prisma.sql`COD_MATERIALS = ${data.codMaterial}`);
    }
    if (data.idDlkSupplier !== undefined) {
      parts.push(Prisma.sql`ID_DLK_SUPPLIER = ${data.idDlkSupplier}`);
    }
    if (data.nameMaterial !== undefined) {
      parts.push(Prisma.sql`NAME_MATERIALS = ${data.nameMaterial}`);
    }
    if (data.desMaterial !== undefined) {
      const d = data.desMaterial?.trim() ? data.desMaterial.trim() : null;
      parts.push(Prisma.sql`DES_MATERIALS = ${d}`);
    }
    if (data.obsMaterial !== undefined) {
      const o = data.obsMaterial?.trim() ? data.obsMaterial.trim() : null;
      parts.push(Prisma.sql`OBS_MATERIALS = ${o}`);
    }
    if (data.stateMaterial !== undefined) {
      const s = Number(data.stateMaterial);
      parts.push(Prisma.sql`STATE_MATERIALS = ${s}`);
      parts.push(Prisma.sql`FLG_STATUT_ACTIF = ${s === 1 ? 1 : 0}`);
    }

    parts.push(Prisma.sql`FEH_PROCESO_MODIF_DL = ${new Date()}`);

    if (parts.length <= 2) {
      const row = await this.getById(id);
      if (!row) throw new Error("Material no encontrado");
      return row;
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_MATERIALS SET ${Prisma.join(parts, ", ")}
      WHERE ID_DLK_MATERIALS = ${id}
    `);

    const updated = await this.getById(id);
    if (!updated) throw new Error("Material no encontrado");
    return updated;
  }

  async softDelete(id: number) {
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE MD_MATERIALS
      SET FLG_STATUT_ACTIF = 0, STATE_MATERIALS = 0, DES_ACCION = ${"DELETE"}
      WHERE ID_DLK_MATERIALS = ${id}
    `);
  }
}
