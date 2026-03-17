"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getTrazabilidadLabel } from "../eslabon/obs";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "./columns";

/** Subproceso mínimo para el diagrama (viene de GET /api/subprocesses) */
type SubprocessDiagramRow = {
  idDlkSubprocess: number;
  idDlkProcess: number;
  ordenPrecedenciaSubprocess: number | null;
  codSubprocess: string;
  nameSubprocess: string;
  process: { idDlkProcess: number };
};

const BOX_ESLABON_NO_REO =
  "rounded-lg border-2 border-gray-700 bg-gray-600 text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_ESLABON_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_PROCESO_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-3 min-w-[180px] max-w-[280px] shadow-md text-sm text-center";
const BOX_PROCESO_NO_REO =
  "rounded-lg border-2 border-gray-700 bg-gray-600 text-white p-3 min-w-[180px] max-w-[280px] shadow-md text-sm text-center";
const BOX_SUBPROCESO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-2 min-w-[140px] max-w-[240px] shadow-md text-xs text-center";

interface ProcessGeneralDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessGeneralDiagramDialog({
  open,
  onOpenChange,
}: ProcessGeneralDiagramDialogProps) {
  const [eslabones, setEslabones] = useState<Eslabon[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [subprocesses, setSubprocesses] = useState<SubprocessDiagramRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetch(apiUrl("/api/production-chains")).then((r) => r.json()),
      fetch(apiUrl("/api/processes")).then((r) => r.json()),
      fetch(apiUrl("/api/subprocesses")).then((r) => r.json()),
    ])
      .then(([chains, procs, subs]) => {
        setEslabones(Array.isArray(chains) ? chains : []);
        setProcesses(Array.isArray(procs) ? procs : []);
        setSubprocesses(Array.isArray(subs) ? subs : []);
      })
      .catch((err) => console.error("Error al cargar datos del diagrama:", err))
      .finally(() => setLoading(false));
  }, [open]);

  const sortedEslabones = useMemo(
    () =>
      [...eslabones].sort(
        (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
      ),
    [eslabones]
  );

  const processesByEslabon = useMemo(() => {
    const map = new Map<number, ProcessRow[]>();
    for (const p of processes) {
      const id = p.productionChain?.idDlkProductionChain;
      if (id == null) continue;
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(p);
    }
    map.forEach((list) =>
      list.sort((a, b) => a.ordenPrecedenciaProcess - b.ordenPrecedenciaProcess)
    );
    return map;
  }, [processes]);

  const subprocessesByProcess = useMemo(() => {
    const map = new Map<number, SubprocessDiagramRow[]>();
    for (const s of subprocesses) {
      const id = s.process?.idDlkProcess ?? s.idDlkProcess;
      if (id == null) continue;
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(s);
    }
    map.forEach((list) =>
      list.sort(
        (a, b) =>
          (a.ordenPrecedenciaSubprocess ?? 999) - (b.ordenPrecedenciaSubprocess ?? 999)
      )
    );
    return map;
  }, [subprocesses]);

  const trazabilidadCode = (num: number) =>
    getTrazabilidadLabel(num).split(" ")[0] ?? "";

  const ArrowRight = () => (
    <svg
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      className="shrink-0 text-blue-600"
    >
      <path
        d="M0 12h24M24 8L32 12L24 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowDown = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-blue-600"
    >
      <path
        d="M12 4v16M12 20l-4-4M12 20l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama general de la cadena de Producción</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Diagrama general
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">
            Cargando diagrama...
          </p>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Fila horizontal de eslabones */}
            <div className="flex flex-nowrap items-start justify-center gap-0 overflow-x-auto">
              {sortedEslabones.map((e, eslabonIndex) => {
                const chainProcesses = processesByEslabon.get(e.idDlkProductionChain) ?? [];
                const reoInterviene = chainProcesses.length > 0;
                const boxClass = reoInterviene ? BOX_ESLABON_REO : BOX_ESLABON_NO_REO;
                const mostrarFlujoVertical = reoInterviene;
                const numEslabon = e.numPrecedenciaProductiva;

                return (
                  <div
                    key={e.idDlkProductionChain}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center gap-0">
                      {eslabonIndex > 0 && <ArrowRight />}
                      <div className="flex flex-col items-center">
                        <div className={boxClass}>
                          <span className="text-lg font-bold">
                            {String(numEslabon).padStart(2, "0")}
                          </span>
                          <span className="text-center text-sm font-medium">
                            {trazabilidadCode(e.numPrecedenciaTrazabilidad)} - {e.nameProductionChain}
                          </span>
                        </div>
                        {mostrarFlujoVertical && (
                          <>
                            <ArrowDown />
                            <div className="flex flex-col gap-3 mt-1">
                              {chainProcesses.map((proc, processIndex) => {
                                const processSubs = subprocessesByProcess.get(proc.idDlkProcess) ?? [];
                                const processReoInterviene = processSubs.length > 0;
                                const processBoxClass = processReoInterviene ? BOX_PROCESO_REO : BOX_PROCESO_NO_REO;
                                const numProc = `${numEslabon}.${processIndex + 1}`;
                                return (
                                  <div key={proc.idDlkProcess} className="flex flex-col items-center gap-1">
                                    <div className={processBoxClass}>
                                      <span className="font-semibold block text-xs opacity-90">{numProc}</span>
                                      {proc.codProcess && (
                                        <span className="font-semibold block">
                                          {proc.codProcess} -{" "}
                                        </span>
                                      )}
                                      <span className="text-sm">{proc.nameProcess}</span>
                                    </div>
                                    {processSubs.length > 0 && (
                                      <>
                                        <ArrowDown />
                                        <div className="flex flex-nowrap items-center gap-0">
                                          {processSubs.map((sub, subIndex) => (
                                            <div key={sub.idDlkSubprocess} className="flex items-center gap-0">
                                              {subIndex > 0 && <ArrowRight />}
                                              <div className={BOX_SUBPROCESO}>
                                                <span className="font-semibold block text-[10px] opacity-90">
                                                  {numProc}.{subIndex + 1}
                                                </span>
                                                <span className="block truncate" title={`${sub.codSubprocess} - ${sub.nameSubprocess}`}>
                                                  {sub.codSubprocess} - {sub.nameSubprocess}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedEslabones.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">
                No hay eslabones para mostrar en el diagrama.
              </p>
            )}

            {/* Leyenda */}
            <div className="w-full rounded-xl border-2 border-[#2a9d9d] bg-sky-50/80 p-4 text-sm">
              <div className="font-semibold text-foreground mb-2">Leyenda</div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 rounded border-2 border-gray-700 bg-gray-600 shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón de la Cadena de Producción, Proceso, Sub Proceso en que el REO no interviene.
                    </strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 rounded border-2 border-[#2a9d9d] bg-[#40B2B2] shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón de la Cadena de Producción, Proceso, Sub Proceso en que el REO sí interviene.
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
