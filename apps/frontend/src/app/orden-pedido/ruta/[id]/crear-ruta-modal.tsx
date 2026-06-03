"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";

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

export type RutaModalMode = "crear" | "editar" | "ver";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: RutaModalMode;
  orderHeadId: number;
  /** Componentes del grupo a los que se aplicará la ruta. */
  componentIds: number[];
  /** Texto descriptivo del grupo (Cod Estilo / Orden Producción). */
  groupLabel?: string;
  onSuccess: () => void;
};

const MODE_TITLE: Record<RutaModalMode, string> = {
  crear: "Crear",
  editar: "Editar",
  ver: "Ver",
};

export function RutaTreeModal({
  open,
  onOpenChange,
  mode,
  orderHeadId,
  componentIds,
  groupLabel,
  onSuccess,
}: Props) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedP, setExpandedP] = useState<Set<number>>(new Set());
  const [expandedS, setExpandedS] = useState<Set<number>>(new Set());
  const [checkP, setCheckP] = useState<Set<number>>(new Set());
  const [checkS, setCheckS] = useState<Set<number>>(new Set());
  const [checkA, setCheckA] = useState<Set<number>>(new Set());

  const readOnly = mode === "ver";

  useEffect(() => {
    if (!open) return;
    setError(null);
    setExpandedP(new Set());
    setExpandedS(new Set());
    setCheckP(new Set());
    setCheckS(new Set());
    setCheckA(new Set());
    setLoading(true);

    const treeReq = apiFetch(`/api/order-heads/${orderHeadId}/route-master-tree`).then(
      async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json() as Promise<{ processes: Process[] }>;
      }
    );
    const selReq =
      mode !== "crear" && componentIds[0]
        ? apiFetch(
            `/api/order-heads/${orderHeadId}/components/${componentIds[0]}/route-selection`
          )
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        : Promise.resolve(null);

    Promise.all([treeReq, selReq])
      .then(([treeData, sel]: [{ processes: Process[] }, RouteSelection | null]) => {
        const procs = treeData.processes ?? [];
        setProcesses(procs);
        if (sel) precheck(procs, sel);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "No se pudo cargar el árbol maestro");
      })
      .finally(() => setLoading(false));
  }, [open, orderHeadId, mode, componentIds]);

  function precheck(procs: Process[], sel: RouteSelection) {
    const pc = new Set(sel.processCods);
    const sc = new Set(sel.subprocessCods);
    const ac = new Set(sel.activityCods);
    const nextP = new Set<number>();
    const nextS = new Set<number>();
    const nextA = new Set<number>();
    const expP = new Set<number>();
    const expS = new Set<number>();
    for (const p of procs) {
      let pHasSel = false;
      if (pc.has(p.codProcess)) nextP.add(p.idDlkProcess);
      for (const s of p.subprocesses) {
        let sHasSel = false;
        if (sc.has(s.codSubprocess)) {
          nextS.add(s.idDlkSubprocess);
          sHasSel = true;
        }
        for (const a of s.activities) {
          if (ac.has(a.codActivities)) {
            nextA.add(a.idDlkActivities);
            sHasSel = true;
          }
        }
        if (sHasSel) {
          expS.add(s.idDlkSubprocess);
          pHasSel = true;
        }
      }
      if (pc.has(p.codProcess) || pHasSel) expP.add(p.idDlkProcess);
    }
    setCheckP(nextP);
    setCheckS(nextS);
    setCheckA(nextA);
    setExpandedP(expP);
    setExpandedS(expS);
  }

  const toggleSet = useCallback(
    (setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number, on?: boolean) => {
      setter((prev) => {
        const next = new Set(prev);
        const willHave = on ?? !next.has(id);
        if (willHave) next.add(id);
        else next.delete(id);
        return next;
      });
    },
    []
  );

  function toggleProcess(p: Process, on: boolean) {
    if (readOnly) return;
    toggleSet(setCheckP, p.idDlkProcess, on);
    setCheckS((prev) => {
      const next = new Set(prev);
      p.subprocesses.forEach((s) => (on ? next.add(s.idDlkSubprocess) : next.delete(s.idDlkSubprocess)));
      return next;
    });
    setCheckA((prev) => {
      const next = new Set(prev);
      p.subprocesses.forEach((s) =>
        s.activities.forEach((a) => (on ? next.add(a.idDlkActivities) : next.delete(a.idDlkActivities)))
      );
      return next;
    });
  }

  function toggleSubprocess(s: Subprocess, on: boolean) {
    if (readOnly) return;
    toggleSet(setCheckS, s.idDlkSubprocess, on);
    setCheckA((prev) => {
      const next = new Set(prev);
      s.activities.forEach((a) => (on ? next.add(a.idDlkActivities) : next.delete(a.idDlkActivities)));
      return next;
    });
  }

  const totalChecked = checkP.size + checkS.size + checkA.size;

  async function onSubmit() {
    if (readOnly) {
      onOpenChange(false);
      return;
    }
    if (!totalChecked) {
      setError("Selecciona al menos un proceso, subproceso o actividad.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/order-heads/${orderHeadId}/components/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentIds,
          processIds: Array.from(checkP),
          subprocessIds: Array.from(checkS),
          activityIds: Array.from(checkA),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No se pudo guardar la ruta");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const headerText = useMemo(
    () =>
      `Orden ${orderHeadId} · Ruta · ${MODE_TITLE[mode]}${groupLabel ? ` — ${groupLabel}` : ""} (${componentIds.length} componente${componentIds.length === 1 ? "" : "s"})`,
    [orderHeadId, mode, groupLabel, componentIds.length]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm">{headerText}</DialogTitle>
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
            No hay procesos maestros configurados para esta empresa.
          </p>
        ) : (
          <div className="space-y-1 py-2 text-sm">
            {processes.map((p, pi) => {
              const pOpen = expandedP.has(p.idDlkProcess);
              return (
                <div key={p.idDlkProcess}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={checkP.has(p.idDlkProcess)}
                      disabled={readOnly}
                      onChange={(e) => toggleProcess(p, e.target.checked)}
                    />
                    <span className="font-medium text-primary">
                      {pi + 1}.- {p.codProcess}-{p.nameProcess}
                    </span>
                    {p.subprocesses.length > 0 && (
                      <button
                        type="button"
                        className="ml-1 text-primary"
                        onClick={() => toggleSet(setExpandedP, p.idDlkProcess)}
                        aria-label={pOpen ? "Colapsar" : "Expandir"}
                      >
                        {pOpen ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {pOpen &&
                    p.subprocesses.map((s, si) => {
                      const sOpen = expandedS.has(s.idDlkSubprocess);
                      return (
                        <div key={s.idDlkSubprocess} className="ml-6">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-primary"
                              checked={checkS.has(s.idDlkSubprocess)}
                              disabled={readOnly}
                              onChange={(e) => toggleSubprocess(s, e.target.checked)}
                            />
                            <span className="font-medium text-primary">
                              {pi + 1}.{si + 1}.- {s.codSubprocess}-{s.nameSubprocess}
                            </span>
                            {s.activities.length > 0 && (
                              <button
                                type="button"
                                className="ml-1 text-primary"
                                onClick={() => toggleSet(setExpandedS, s.idDlkSubprocess)}
                                aria-label={sOpen ? "Colapsar" : "Expandir"}
                              >
                                {sOpen ? "−" : "+"}
                              </button>
                            )}
                          </div>

                          {sOpen &&
                            s.activities.map((a, ai) => (
                              <div key={a.idDlkActivities} className="ml-12 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-primary"
                                  checked={checkA.has(a.idDlkActivities)}
                                  disabled={readOnly}
                                  onChange={(e) =>
                                    toggleSet(setCheckA, a.idDlkActivities, e.target.checked)
                                  }
                                />
                                <span className="text-primary">
                                  {pi + 1}.{si + 1}.{ai + 1}.- {a.codActivities}-{a.nameActivities}
                                </span>
                              </div>
                            ))}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">{totalChecked} seleccionados</span>
          {readOnly ? (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-primary"
              disabled={saving || loading || totalChecked === 0}
              onClick={onSubmit}
            >
              {saving ? "Guardando…" : mode === "editar" ? "Actualizar" : "Crear"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
