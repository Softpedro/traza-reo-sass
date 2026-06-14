import type { PrismaClient } from "../../generated/prisma/client.js";
import { Criticality } from "../../generated/prisma/enums.js";

/**
 * Copia los Inputs / Procedimientos / Outputs del MAESTRO hacia las tablas de la RUTA,
 * en los 3 niveles (proceso, subproceso, actividad), para una ruta ya instanciada.
 *
 * Idempotente: por cada fila de ruta, salta el nivel/tabla que ya tenga filas. Por eso sirve
 * tanto al crear la ruta (createRouteFromMaster) como de backfill para rutas existentes.
 *
 * El vínculo maestro↔ruta es por código (COD_*), que es único en el maestro
 * (codProcess/codSubprocess únicos; codActivities sin datos de I/O/P por ahora).
 */

// Acepta tanto el PrismaClient como el cliente de una transacción ($transaction).
type Db = Pick<
  PrismaClient,
  | "odProcessRoute"
  | "mdProcess"
  | "mdSubprocess"
  | "mdActivities"
  | "mdInputProcess"
  | "mdProcedureProcess"
  | "mdOutputProcess"
  | "mdInputSubprocess"
  | "mdProcedureSubprocess"
  | "mdOutputSubprocess"
  | "mdInputActivities"
  | "mdProcedureActivities"
  | "mdOutputActivities"
  | "odInputProcessRoute"
  | "odProcedureProcessRoute"
  | "odOutputProcessRoute"
  | "odInputSubprocessRoute"
  | "odProcedureSubprocessRoute"
  | "odOutputSubprocessRoute"
  | "odInputActivitiesRoute"
  | "odProcedureActivitiesRoute"
  | "odOutputActivitiesRoute"
>;

const clip = (s: string | null | undefined, n: number): string => (s ?? "").slice(0, n);
const clipN = (s: string | null | undefined, n: number): string | null =>
  s ? s.slice(0, n) : null;

function mapCrit(v?: string | null): Criticality {
  const u = (v ?? "").trim().toUpperCase();
  if (["1", "LOW", "BAJA", "BAJO"].includes(u)) return "LOW" as Criticality;
  if (["3", "HIGH", "ALTA", "ALTO"].includes(u)) return "HIGH" as Criticality;
  return "MEDIUM" as Criticality;
}
function toInt(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function toDec(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Siembra I/O/P del nivel PROCESO (idempotente por tabla). */
async function seedProcessIo(
  db: Db,
  processRouteId: number,
  masterProcessId: number,
  user: string
) {
  if ((await db.odInputProcessRoute.count({ where: { idDlkProcessRoute: processRouteId } })) === 0) {
    const src = await db.mdInputProcess.findMany({
      where: { idDlkProcess: masterProcessId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odInputProcessRoute.createMany({
        data: src.map((m) => ({
          idDlkProcessRoute: processRouteId,
          codInputProcess: clip(m.codInputProcess, 50),
          nameInputProcess: clip(m.nameInputProcess, 100),
          supplierInputProcess: clipN(m.supplierInputProcess, 120),
          observationInputProcess: clipN(m.observationInputProcess, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
  if (
    (await db.odProcedureProcessRoute.count({ where: { idDlkProcessRoute: processRouteId } })) === 0
  ) {
    const src = await db.mdProcedureProcess.findMany({
      where: { idDlkProcess: masterProcessId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odProcedureProcessRoute.createMany({
        data: src.map((m) => ({
          idDlkProcessRoute: processRouteId,
          codProcedureProcess: clip(m.codProcedureProcess, 50),
          nameProcedureProcess: clip(m.nameProcedureProcess, 150),
          criticalityProcedureProcess: mapCrit(m.criticallyProcedureProcess),
          timeProcedureProcessRoute: toInt(m.timeProcedureProcess),
          validationProcedureProcess: clip(m.validationProcedureProcess, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
  if ((await db.odOutputProcessRoute.count({ where: { idDlkProcessRoute: processRouteId } })) === 0) {
    const src = await db.mdOutputProcess.findMany({
      where: { idDlkProcess: masterProcessId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odOutputProcessRoute.createMany({
        data: src.map((m) => ({
          idDlkProcessRoute: processRouteId,
          codOutputProcess: clip(m.codOutputProcess, 50),
          nameOutputProcess: clip(m.nameOutputProcess, 150),
          typeOutputProcess: clip(m.typeOutputProcess, 50),
          destinationOutputProcess: clip(m.destinationOutputProcess, 100),
          unitQuantity: toDec(m.unitQuantity),
          observationOutputProcess: clipN(m.observationOutputProcess, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
}

/** Siembra I/O/P del nivel SUBPROCESO (idempotente por tabla). */
async function seedSubprocessIo(
  db: Db,
  subprocessRouteId: number,
  masterSubprocessId: number,
  user: string
) {
  if (
    (await db.odInputSubprocessRoute.count({
      where: { idDlkSubprocessRoute: subprocessRouteId },
    })) === 0
  ) {
    const src = await db.mdInputSubprocess.findMany({
      where: { idDlkSubprocess: masterSubprocessId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odInputSubprocessRoute.createMany({
        data: src.map((m) => ({
          idDlkSubprocessRoute: subprocessRouteId,
          codInputSubprocess: clip(m.codInputSubprocess, 50),
          nameInputSubprocess: clip(m.nameInputSubprocess, 150),
          typeInputSubprocess: clip(m.typeInputSubprocess, 50),
          supplierInputSubprocess: clipN(m.supplierInputSubprocess, 120),
          observationInputSubprocess: clipN(m.observationInputSubprocess, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
  if (
    (await db.odProcedureSubprocessRoute.count({
      where: { idDlkSubprocessRoute: subprocessRouteId },
    })) === 0
  ) {
    const src = await db.mdProcedureSubprocess.findMany({
      where: { idDlkSubprocess: masterSubprocessId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odProcedureSubprocessRoute.createMany({
        data: src.map((m) => ({
          idDlkSubprocessRoute: subprocessRouteId,
          codProcedureSubprocess: clip(m.codProcedureSubprocess, 50),
          nameProcedureSubprocess: clip(m.nameProcedureSubprocess, 150),
          responsibleProcedureSubprocess: clip(m.responsibleProcedureSubprocess, 100),
          estimatedTimeProcedureSubprocess: toInt(m.estimatedTimeSubprocess),
          criticalityProcedureSubprocess: mapCrit(m.criticalitySubprocess),
          validationMethodSubprocess: clip(m.validationMethodSubprocess, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
  if (
    (await db.odOutputSubprocessRoute.count({
      where: { idDlkSubprocessRoute: subprocessRouteId },
    })) === 0
  ) {
    const src = await db.mdOutputSubprocess.findMany({
      where: { idDlkSubprocess: masterSubprocessId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odOutputSubprocessRoute.createMany({
        data: src.map((m) => ({
          idDlkSubprocessRoute: subprocessRouteId,
          codOutputSubprocess: clip(m.codOutputSubprocess, 50),
          nameOutputSubprocess: clip(m.nameOutputSubprocess, 150),
          destinationOutputSubprocess: clip(m.destinationOutputSubprocess, 100),
          unitQuantity: toDec(m.unitQuantity),
          observationOutputSubprocess: clipN(m.observationOutputSubprocess, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
}

/** Siembra I/O/P del nivel ACTIVIDAD (idempotente por tabla). */
async function seedActivityIo(
  db: Db,
  activitiesRouteId: number,
  masterActivityId: number,
  user: string
) {
  if (
    (await db.odInputActivitiesRoute.count({
      where: { idDlkActivitiesRoute: activitiesRouteId },
    })) === 0
  ) {
    const src = await db.mdInputActivities.findMany({
      where: { idDlkActivities: masterActivityId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odInputActivitiesRoute.createMany({
        data: src.map((m) => ({
          idDlkActivitiesRoute: activitiesRouteId,
          codInputActivities: clip(m.codInputActivities, 50),
          nameInputActivities: clip(m.nameInputActivities, 150),
          typeInputActivities: clip(m.typeInputActivities, 50),
          criticalCheckActivities: clipN(m.criticalCheckActivities, 150),
          codUsuarioCargaDl: user,
        })),
      });
  }
  if (
    (await db.odProcedureActivitiesRoute.count({
      where: { idDlkActivitiesRoute: activitiesRouteId },
    })) === 0
  ) {
    const src = await db.mdProcedureActivities.findMany({
      where: { idDlkActivities: masterActivityId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odProcedureActivitiesRoute.createMany({
        data: src.map((m) => ({
          idDlkActivitiesRoute: activitiesRouteId,
          codProcedureActivities: clip(m.codProcedureActivities, 50),
          nameProcedureActivities: clip(m.nameProcedureActivities, 150),
          responsibleExecution: clip(m.responsibleExecution, 100),
          estimatedTimeProcedure: toInt(m.estimatedTimeProcedure),
          criticalPointActivities: clip(m.criticalPointActivities, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
  if (
    (await db.odOutputActivitiesRoute.count({
      where: { idDlkActivitiesRoute: activitiesRouteId },
    })) === 0
  ) {
    const src = await db.mdOutputActivities.findMany({
      where: { idDlkActivities: masterActivityId, flgStatutActif: 1 },
    });
    if (src.length)
      await db.odOutputActivitiesRoute.createMany({
        data: src.map((m) => ({
          idDlkActivitiesRoute: activitiesRouteId,
          codOutputActivities: clip(m.codOutputActivities, 50),
          nameOutputActivities: clip(m.nameOutputActivities, 150),
          typeOutputActivities: clip(m.typeOutputActivities, 50),
          nextDestinationActivities: clipN(m.nextDestinationActivities, 100),
          qualityStandardActivities: clipN(m.qualityStandardActivities, 255),
          codUsuarioCargaDl: user,
        })),
      });
  }
}

/**
 * Siembra I/O/P desde el maestro para TODA la ruta de un proceso instanciado
 * (proceso + sus subprocesos + sus actividades). Idempotente.
 */
export async function seedRouteIoFromMaster(
  db: Db,
  processRouteId: number,
  user: string
): Promise<void> {
  const pr = await db.odProcessRoute.findUnique({
    where: { idDlkProcessRoute: processRouteId },
    select: {
      idDlkProcessRoute: true,
      codProcess: true,
      subprocesses: {
        select: {
          idDlkSubprocessRoute: true,
          codSubprocess: true,
          activities: { select: { idDlkActivitiesRoute: true, codActivities: true } },
        },
      },
    },
  });
  if (!pr) return;

  const masterProc = await db.mdProcess.findFirst({
    where: { codProcess: pr.codProcess, flgStatutActif: 1 },
    select: { idDlkProcess: true },
  });
  if (masterProc) await seedProcessIo(db, pr.idDlkProcessRoute, masterProc.idDlkProcess, user);

  for (const sr of pr.subprocesses) {
    const masterSub = await db.mdSubprocess.findFirst({
      where: { codSubprocess: sr.codSubprocess, flgStatutActif: 1 },
      select: { idDlkSubprocess: true },
    });
    if (masterSub)
      await seedSubprocessIo(db, sr.idDlkSubprocessRoute, masterSub.idDlkSubprocess, user);

    for (const ar of sr.activities) {
      const masterAct = await db.mdActivities.findFirst({
        where: { codActivities: ar.codActivities, flgStatutActif: 1 },
        select: { idDlkActivities: true },
      });
      if (masterAct)
        await seedActivityIo(db, ar.idDlkActivitiesRoute, masterAct.idDlkActivities, user);
    }
  }
}
