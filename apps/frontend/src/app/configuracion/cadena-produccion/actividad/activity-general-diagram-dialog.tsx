"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "../proceso/columns";
import type { SubprocessRow } from "../subproceso/columns";
import type { ActivityRow } from "./columns";
import { ActivityGeneralChainFlow } from "./activity-general-chain-flow";

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

  const flowKey = useMemo(
    () =>
      `${sortedEslabones.map((e) => e.idDlkProductionChain).join("-")}|${processes.length}|${subprocesses.length}|${activities.length}`,
    [sortedEslabones, processes.length, subprocesses.length, activities.length]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(1200px,calc(100vw-2rem))] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama general de Actividades</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Actividad &gt; Diagrama general
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            {sortedEslabones.length > 0 ? (
              <ActivityGeneralChainFlow
                key={flowKey}
                eslabones={eslabones}
                processesByEslabon={processesByEslabon}
                subprocessesByProcess={subprocessesByProcess}
                activitiesBySubprocess={activitiesBySubprocess}
              />
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No hay información para mostrar en el diagrama.
              </p>
            )}

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
