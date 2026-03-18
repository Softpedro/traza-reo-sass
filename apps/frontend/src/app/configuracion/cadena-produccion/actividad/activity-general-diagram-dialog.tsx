"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getTrazabilidadLabel } from "../eslabon/obs";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "../proceso/columns";
import type { SubprocessRow } from "../subproceso/columns";
import type { ActivityRow } from "./columns";

const BOX_NO_REO =
  "rounded-none border-2 border-black bg-gray-600 text-white p-3 min-w-[140px] max-w-[220px] shadow-md text-center";
const BOX_REO =
  "rounded-none border-2 border-black bg-[#0f9bb6] text-white p-3 min-w-[140px] max-w-[240px] shadow-md text-center";

interface ActivityGeneralDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityGeneralDiagramDialog({
  open,
  onOpenChange,
}: ActivityGeneralDiagramDialogProps) {
  const [eslabones, setEslabones] = useState<Eslabon[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [subprocesses, setSubprocesses] = useState<SubprocessRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetch(apiUrl("/api/production-chains")).then((r) => r.json()),
      fetch(apiUrl("/api/processes")).then((r) => r.json()),
      fetch(apiUrl("/api/subprocesses")).then((r) => r.json()),
      fetch(apiUrl("/api/activities")).then((r) => r.json()),
    ])
      .then(([chains, procs, subs, acts]) => {
        setEslabones(Array.isArray(chains) ? chains : []);
        setProcesses(Array.isArray(procs) ? procs : []);
        setSubprocesses(Array.isArray(subs) ? subs : []);
        setActivities(Array.isArray(acts) ? acts : []);
      })
      .catch((err) =>
        console.error("Error al cargar datos del diagrama general de actividad:", err)
      )
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

  const activitiesBySubprocess = useMemo(() => {
    const map = new Map<number, ActivityRow[]>();
    for (const activity of activities) {
      const subprocessId = activity.subprocess?.idDlkSubprocess;
      if (subprocessId == null) continue;
      if (!map.has(subprocessId)) map.set(subprocessId, []);
      map.get(subprocessId)!.push(activity);
    }
    map.forEach((list) =>
      list.sort(
        (a, b) =>
          (a.orderActivities ?? Number.MAX_SAFE_INTEGER) -
            (b.orderActivities ?? Number.MAX_SAFE_INTEGER) ||
          a.idDlkActivities - b.idDlkActivities
      )
    );
    return map;
  }, [activities]);

  const ArrowRight = () => (
    <svg
      width="30"
      height="20"
      viewBox="0 0 30 20"
      fill="none"
      className="shrink-0 text-[#0f9bb6]"
    >
      <path
        d="M0 10h22M22 6L30 10L22 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowDown = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="shrink-0 text-[#0f9bb6]"
    >
      <path
        d="M11 3v16M11 19l-4-4M11 19l4-4"
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
      <DialogContent className="max-w-[96vw] max-h-[92vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama general de Actividades</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Actividad &gt; Diagrama general
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : (
          <div className="flex flex-col items-start gap-6 py-4">
            <div className="flex flex-nowrap items-start gap-0 overflow-x-auto w-full pb-2">
              {sortedEslabones.map((eslabon, eslabonIndex) => {
                const chainProcesses =
                  processesByEslabon.get(eslabon.idDlkProductionChain) ?? [];
                const hasActivities = chainProcesses.some((process) => {
                  const processSubs = subprocessesByProcess.get(process.idDlkProcess) ?? [];
                  return processSubs.some(
                    (sub) => (activitiesBySubprocess.get(sub.idDlkSubprocess)?.length ?? 0) > 0
                  );
                });
                const eslabonBoxClass = hasActivities ? BOX_REO : BOX_NO_REO;
                const eslabonNum = eslabon.numPrecedenciaProductiva;

                return (
                  <div
                    key={eslabon.idDlkProductionChain}
                    className="flex flex-col items-start shrink-0 w-[230px]"
                  >
                    <div className="flex items-center gap-0">
                      {eslabonIndex > 0 && <ArrowRight />}
                      <div className={eslabonBoxClass}>
                        <div className="text-4xl leading-none font-bold mb-1">{eslabonNum}</div>
                        <div className="text-base leading-tight">
                          {trazabilidadCode(eslabon.numPrecedenciaTrazabilidad)} -{" "}
                          {eslabon.nameProductionChain}
                        </div>
                      </div>
                    </div>

                    {chainProcesses.length > 0 && (
                      <div className="mt-1 flex flex-col items-start">
                        {chainProcesses.map((process, processIndex) => {
                          const processNum = `${eslabonNum}.${processIndex + 1}`;
                          const processSubs =
                            subprocessesByProcess.get(process.idDlkProcess) ?? [];
                          const processHasActivities = processSubs.some(
                            (sub) =>
                              (activitiesBySubprocess.get(sub.idDlkSubprocess)?.length ?? 0) > 0
                          );
                          const processBoxClass = processHasActivities ? BOX_REO : BOX_NO_REO;

                          return (
                            <div key={process.idDlkProcess} className="flex flex-col items-start">
                              <ArrowDown />
                              <div className="flex items-start gap-0">
                                <div className={processBoxClass}>
                                  <div className="text-4xl leading-none font-bold mb-1">
                                    {processNum}
                                  </div>
                                  <div className="text-base leading-tight">
                                    {process.codProcess} - {process.nameProcess}
                                  </div>
                                </div>

                                {processSubs.length > 0 && (
                                  <div className="flex items-start">
                                    {processSubs.map((sub, subIndex) => {
                                      const subNum = `${processNum}.${subIndex + 1}`;
                                      const subActivities =
                                        activitiesBySubprocess.get(sub.idDlkSubprocess) ?? [];
                                      const subHasActivities = subActivities.length > 0;
                                      const subBoxClass = subHasActivities
                                        ? BOX_REO
                                        : BOX_NO_REO;

                                      return (
                                        <div
                                          key={sub.idDlkSubprocess}
                                          className="flex items-start"
                                        >
                                          <ArrowRight />
                                          <div className="flex flex-col items-start">
                                            <div className={subBoxClass}>
                                              <div className="text-4xl leading-none font-bold mb-1">
                                                {subNum}
                                              </div>
                                              <div className="text-base leading-tight">
                                                {sub.codSubprocess} - {sub.nameSubprocess}
                                              </div>
                                            </div>

                                            {subActivities.length > 0 && (
                                              <div className="mt-1 flex flex-col items-start">
                                                {subActivities.map((act, actIndex) => {
                                                  const actNum = `${subNum}.${actIndex + 1}`;
                                                  return (
                                                    <div
                                                      key={act.idDlkActivities}
                                                      className="flex flex-col items-start"
                                                    >
                                                      <ArrowDown />
                                                      <div className={BOX_REO}>
                                                        <div className="text-4xl leading-none font-bold mb-1">
                                                          {actNum}
                                                        </div>
                                                        <div className="text-base leading-tight">
                                                          {act.codActivities} - {act.nameActivities}
                                                        </div>
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
                  <span className="inline-flex h-8 w-8 border-2 border-black bg-gray-600 shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón, Proceso, Sub Proceso o Actividad en que el REO no interviene.
                    </strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 border-2 border-black bg-[#0f9bb6] shrink-0" />
                  <span>
                    <strong className="text-foreground">
                      Eslabón, Proceso, Sub Proceso o Actividad en que el REO sí interviene.
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
