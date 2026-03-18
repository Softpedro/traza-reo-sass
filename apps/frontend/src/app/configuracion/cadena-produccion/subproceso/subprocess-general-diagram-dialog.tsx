"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getTrazabilidadLabel } from "../eslabon/obs";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "../proceso/columns";
import type { SubprocessRow } from "./columns";

const BOX_NO_REO =
  "rounded-lg border-2 border-gray-700 bg-gray-600 text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#0f9bb6] text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_PROCESS =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#0f9bb6] text-white p-3 min-w-[200px] max-w-[280px] shadow-md text-sm text-center";
const BOX_SUBPROCESS =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#0f9bb6] text-white p-3 min-w-[200px] max-w-[280px] shadow-md text-sm text-center";

interface SubprocessGeneralDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubprocessGeneralDiagramDialog({
  open,
  onOpenChange,
}: SubprocessGeneralDiagramDialogProps) {
  const [eslabones, setEslabones] = useState<Eslabon[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [subprocesses, setSubprocesses] = useState<SubprocessRow[]>([]);
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
      .catch((err) => console.error("Error al cargar datos del diagrama general de subproceso:", err))
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
    for (const process of processes) {
      const chainId = process.productionChain?.idDlkProductionChain;
      if (chainId == null) continue;
      if (!map.has(chainId)) map.set(chainId, []);
      map.get(chainId)!.push(process);
    }
    map.forEach((list) =>
      list.sort((a, b) => a.ordenPrecedenciaProcess - b.ordenPrecedenciaProcess)
    );
    return map;
  }, [processes]);

  const subprocessesByProcess = useMemo(() => {
    const map = new Map<number, SubprocessRow[]>();
    for (const sub of subprocesses) {
      const processId = sub.process?.idDlkProcess;
      if (processId == null) continue;
      if (!map.has(processId)) map.set(processId, []);
      map.get(processId)!.push(sub);
    }
    map.forEach((list) =>
      list.sort(
        (a, b) =>
          (a.ordenPrecedenciaSubprocess ?? Number.MAX_SAFE_INTEGER) -
            (b.ordenPrecedenciaSubprocess ?? Number.MAX_SAFE_INTEGER) ||
          a.idDlkSubprocess - b.idDlkSubprocess
      )
    );
    return map;
  }, [subprocesses]);

  const ArrowRight = () => (
    <svg
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      className="shrink-0 text-[#0f9bb6]"
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
      className="shrink-0 text-[#0f9bb6]"
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

  const trazabilidadCode = (num: number) =>
    getTrazabilidadLabel(num).split(" ")[0] ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama general de Subprocesos</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Subproceso &gt; Diagrama general
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">
            Cargando diagrama...
          </p>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Eslabones en horizontal */}
            <div className="flex flex-nowrap items-start justify-start gap-0 overflow-x-auto w-full pb-2">
              {sortedEslabones.map((eslabon, eslabonIndex) => {
                const chainProcesses = processesByEslabon.get(eslabon.idDlkProductionChain) ?? [];
                const hasSubprocessesInChain = chainProcesses.some(
                  (process) => (subprocessesByProcess.get(process.idDlkProcess)?.length ?? 0) > 0
                );
                const boxClass = hasSubprocessesInChain ? BOX_REO : BOX_NO_REO;
                const eslabonNum = eslabon.numPrecedenciaProductiva;

                return (
                  <div key={eslabon.idDlkProductionChain} className="flex flex-col items-start shrink-0 w-[224px]">
                    <div className="flex items-center gap-0">
                      {eslabonIndex > 0 && <ArrowRight />}
                      <div className={boxClass}>
                        <span className="text-4xl leading-none font-bold">
                          {String(eslabonNum)}
                        </span>
                        <span className="text-center text-sm font-medium leading-tight">
                          {trazabilidadCode(eslabon.numPrecedenciaTrazabilidad)} -{" "}
                          {eslabon.nameProductionChain}
                        </span>
                      </div>
                    </div>

                    {hasSubprocessesInChain && (
                      <div className="mt-1 flex flex-col items-start">
                        {chainProcesses.map((process, processIndex) => {
                          const processNum = `${eslabonNum}.${processIndex + 1}`;
                          const processSubs = subprocessesByProcess.get(process.idDlkProcess) ?? [];

                          return (
                            <div key={process.idDlkProcess} className="flex flex-col items-start">
                              <ArrowDown />
                              <div className="flex items-start gap-0">
                                <div className={BOX_PROCESS}>
                                  <span className="font-semibold block text-4xl leading-none mb-1">
                                    {processNum}
                                  </span>
                                  <span className="font-medium block text-base leading-tight">
                                    {process.codProcess} - {process.nameProcess}
                                  </span>
                                </div>

                                {processSubs.length > 0 && (
                                  <div className="flex items-center">
                                    {processSubs.map((sub, subIndex) => {
                                      const subNum = `${processNum}.${subIndex + 1}`;
                                      return (
                                        <div key={sub.idDlkSubprocess} className="flex items-center">
                                          <ArrowRight />
                                          <div className={BOX_SUBPROCESS}>
                                            <span className="font-semibold block text-4xl leading-none mb-1">
                                              {subNum}
                                            </span>
                                            <span className="font-medium block text-base leading-tight">
                                              {sub.codSubprocess} - {sub.nameSubprocess}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {sortedEslabones.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">
                No hay información para mostrar en el diagrama.
              </p>
            )}

            <div className="w-full rounded-xl border-2 border-[#0f9bb6] bg-sky-50/80 p-4 text-sm">
              <div className="font-semibold text-foreground mb-2">Leyenda</div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 rounded border-2 border-gray-700 bg-gray-600 shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón sin subprocesos donde interviene el REO.
                    </strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 rounded border-2 border-[#2a9d9d] bg-[#0f9bb6] shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón y Subproceso en el que el REO sí interviene.
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
