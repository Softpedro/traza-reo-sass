"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getTrazabilidadLabel } from "../eslabon/obs";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "./columns";

const BOX_ESLABON_NO_REO =
  "rounded-lg border-2 border-gray-700 bg-gray-600 text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_ESLABON_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_PROCESO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-3 min-w-[180px] max-w-[320px] shadow-md text-sm text-center";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetch(apiUrl("/api/production-chains")).then((r) => r.json()),
      fetch(apiUrl("/api/processes")).then((r) => r.json()),
    ])
      .then(([chains, procs]) => {
        setEslabones(Array.isArray(chains) ? chains : []);
        setProcesses(Array.isArray(procs) ? procs : []);
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
              {sortedEslabones.map((e, index) => {
                const chainProcesses = processesByEslabon.get(e.idDlkProductionChain) ?? [];
                const reoInterviene = chainProcesses.length > 0;
                const boxClass = reoInterviene ? BOX_ESLABON_REO : BOX_ESLABON_NO_REO;
                const mostrarFlujoVertical = reoInterviene;

                return (
                  <div
                    key={e.idDlkProductionChain}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center gap-0">
                      {index > 0 && <ArrowRight />}
                      <div className="flex flex-col items-center">
                        <div className={boxClass}>
                          <span className="text-lg font-bold">
                            {String(e.numPrecedenciaProductiva).padStart(2, "0")}
                          </span>
                          <span className="text-center text-sm font-medium">
                            {trazabilidadCode(e.numPrecedenciaTrazabilidad)} - {e.nameProductionChain}
                          </span>
                        </div>
                        {/* Rama vertical de procesos bajo el eslabón que tiene procesos en Proceso */}
                        {mostrarFlujoVertical && (
                          <>
                            <ArrowDown />
                            <div className="flex flex-col gap-2 mt-1 ml-0">
                              {chainProcesses.map((proc, i) => (
                                <div key={proc.idDlkProcess} className={BOX_PROCESO}>
                                  {proc.codProcess && (
                                    <span className="font-semibold block">
                                      {proc.codProcess} -{" "}
                                    </span>
                                  )}
                                  {proc.nameProcess}
                                </div>
                              ))}
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
                      Eslabón de la Cadena de Producción, Proceso en que el REO no interviene.
                    </strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 rounded border-2 border-[#2a9d9d] bg-[#40B2B2] shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón de la Cadena de Producción, Proceso en que el REO sí interviene.
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
