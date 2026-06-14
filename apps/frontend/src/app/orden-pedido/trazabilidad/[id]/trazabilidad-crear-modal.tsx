"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { TrazabilidadProcesoModal } from "./trazabilidad-proceso-modal";

type Activity = {
  idDlkActivities: number;
  codActivities: string;
  nameActivities: string;
  orderActivities: number | null;
};
type Subprocess = {
  idDlkSubprocess: number;
  codSubprocess: string;
  nameSubprocess: string;
  ordenPrecedenciaSubprocess: number | null;
  activities: Activity[];
};
type Process = {
  idDlkProcess: number;
  codProcess: string;
  nameProcess: string;
  ordenPrecedenciaProcess: number | null;
  subprocesses: Subprocess[];
};

type RouteSelection = {
  processCods: string[];
  subprocessCods: string[];
  activityCods: string[];
};

type ProcessRouteRow = {
  idDlkProcessRoute: number;
  codProcess: string;
  nameProcess: string;
  ordenPrecedenciaProcess: number | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderHeadId: number;
  /** Componentes (piezas) a los que aplica esta trazabilidad. */
  componentIds: number[];
  /** Título: "Orden de Produccion: OP-28-26-1, QAPARY (Chaqueta m/l) > Trazabilidad". */
  ordenProduccion: string;
  marca: string;
  pieza: string | null;
  onSuccess: () => void;
};

/** Checkbox de solo lectura: refleja la ruta y no se puede editar. */
function ReadonlyCheck({ checked }: { checked: boolean }) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 accent-primary cursor-default"
      checked={checked}
      readOnly
      onChange={() => {}}
      onClick={(e) => e.preventDefault()}
    />
  );
}

export function TrazabilidadCrearModal({
  open,
  onOpenChange,
  orderHeadId,
  componentIds,
  ordenProduccion,
  marca,
  pieza,
  onSuccess,
}: Props) {
  const componentId = componentIds[0];
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [checkP, setCheckP] = useState<Set<number>>(new Set());
  const [checkS, setCheckS] = useState<Set<number>>(new Set());
  const [checkA, setCheckA] = useState<Set<number>>(new Set());

  /** codProcess -> idDlkProcessRoute (proceso instanciado del componente). */
  const [procRouteByCod, setProcRouteByCod] = useState<Map<string, number>>(new Map());
  const [procesoSel, setProcesoSel] = useState<{ processRouteId: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCheckP(new Set());
    setCheckS(new Set());
    setCheckA(new Set());
    setProcRouteByCod(new Map());
    setLoading(true);

    const treeReq = apiFetch(
      `/api/order-heads/${orderHeadId}/route-master-tree`
    ).then(async (res) => {
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Error ${res.status}`);
      }
      return res.json() as Promise<{ processes: Process[] }>;
    });
    const selReq = componentId
      ? apiFetch(`/api/order-heads/${orderHeadId}/components/${componentId}/route-selection`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      : Promise.resolve(null);
    const prReq = componentId
      ? apiFetch(`/api/order-heads/${orderHeadId}/components/${componentId}/process-routes`)
          .then((res) => (res.ok ? res.json() : []))
          .catch(() => [])
      : Promise.resolve([]);

    Promise.all([treeReq, selReq, prReq])
      .then(
        ([treeData, sel, prRows]: [
          { processes: Process[] },
          RouteSelection | null,
          ProcessRouteRow[],
        ]) => {
          const procs = treeData.processes ?? [];
          setProcesses(procs);
          if (sel) precheck(procs, sel);
          const map = new Map<string, number>();
          (Array.isArray(prRows) ? prRows : []).forEach((r) =>
            map.set(r.codProcess, r.idDlkProcessRoute)
          );
          setProcRouteByCod(map);
        }
      )
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "No se pudo cargar la ruta");
      })
      .finally(() => setLoading(false));
  }, [open, orderHeadId, componentId]);

  function precheck(procs: Process[], sel: RouteSelection) {
    const pc = new Set(sel.processCods);
    const sc = new Set(sel.subprocessCods);
    const ac = new Set(sel.activityCods);
    const nextP = new Set<number>();
    const nextS = new Set<number>();
    const nextA = new Set<number>();
    for (const p of procs) {
      if (pc.has(p.codProcess)) nextP.add(p.idDlkProcess);
      for (const s of p.subprocesses) {
        if (sc.has(s.codSubprocess)) nextS.add(s.idDlkSubprocess);
        for (const a of s.activities) {
          if (ac.has(a.codActivities)) nextA.add(a.idDlkActivities);
        }
      }
    }
    setCheckP(nextP);
    setCheckS(nextS);
    setCheckA(nextA);
  }

  const titulo = `Orden de Produccion: ${ordenProduccion || `Orden ${orderHeadId}`}, ${marca}${
    pieza ? ` (${pieza})` : ""
  } > Trazabilidad`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">{titulo}</DialogTitle>
          </DialogHeader>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-4 text-sm text-muted-foreground">Cargando ruta…</p>
          ) : processes.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No hay procesos configurados para esta empresa.
            </p>
          ) : (
            <div className="space-y-1 py-2 text-sm">
              {processes.map((p, pi) => {
                // Solo se muestran los nodos con check activo (los que están en la ruta).
                if (!checkP.has(p.idDlkProcess)) return null;
                const processRouteId = procRouteByCod.get(p.codProcess);
                const clickable = processRouteId != null;
                return (
                  <div key={p.idDlkProcess}>
                    <div className="flex items-center gap-2">
                      <ReadonlyCheck checked={checkP.has(p.idDlkProcess)} />
                      <button
                        type="button"
                        disabled={!clickable}
                        onClick={() =>
                          processRouteId != null && setProcesoSel({ processRouteId })
                        }
                        className={`text-left font-medium ${
                          clickable
                            ? "text-primary hover:underline"
                            : "cursor-default text-muted-foreground"
                        }`}
                      >
                        {pi + 1}.- {p.codProcess}-{p.nameProcess}
                      </button>
                    </div>

                    {p.subprocesses.map((s, si) => {
                      if (!checkS.has(s.idDlkSubprocess)) return null;
                      return (
                        <div key={s.idDlkSubprocess} className="ml-6">
                          <div className="flex items-center gap-2">
                            <ReadonlyCheck checked={checkS.has(s.idDlkSubprocess)} />
                            <span className="font-medium text-primary">
                              {pi + 1}.{si + 1}.- {s.codSubprocess}-{s.nameSubprocess}
                            </span>
                          </div>

                          {s.activities.map((a, ai) => {
                            if (!checkA.has(a.idDlkActivities)) return null;
                            return (
                              <div
                                key={a.idDlkActivities}
                                className="ml-12 flex items-center gap-2"
                              >
                                <ReadonlyCheck checked={checkA.has(a.idDlkActivities)} />
                                <span className="text-primary">
                                  {pi + 1}.{si + 1}.{ai + 1}.- {a.codActivities}-
                                  {a.nameActivities}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {procesoSel && componentId != null && (
        <TrazabilidadProcesoModal
          open
          onOpenChange={(o) => !o && setProcesoSel(null)}
          orderHeadId={orderHeadId}
          componentId={componentId}
          processRouteId={procesoSel.processRouteId}
          ordenProduccion={ordenProduccion}
          marca={marca}
          pieza={pieza}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
