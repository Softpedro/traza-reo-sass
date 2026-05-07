"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ActivityRow } from "./columns";
import type { ProcedureActivityRow } from "./procedure-activity-modal";
import type { InputActivityRow } from "./input-activity-modal";
import type { OutputActivityRow } from "./output-activity-modal";
import { ActivityDiagramFlow } from "./activity-diagram-flow";

interface ActivityDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityRow | null;
}

export function ActivityDiagramDialog({
  open,
  onOpenChange,
  activity,
}: ActivityDiagramDialogProps) {
  const [procedures, setProcedures] = useState<ProcedureActivityRow[]>([]);
  const [inputs, setInputs] = useState<InputActivityRow[]>([]);
  const [outputs, setOutputs] = useState<OutputActivityRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !activity) return;
    const id = activity.idDlkActivities;
    setLoading(true);
    Promise.all([
      fetch(apiUrl(`/api/procedure-activities?activityId=${id}`)).then((r) => r.json()),
      fetch(apiUrl(`/api/input-activities?activityId=${id}`)).then((r) => r.json()),
      fetch(apiUrl(`/api/output-activities?activityId=${id}`)).then((r) => r.json()),
    ])
      .then(([procs, ins, outs]) => {
        setProcedures(Array.isArray(procs) ? procs : []);
        setInputs(Array.isArray(ins) ? ins : []);
        setOutputs(Array.isArray(outs) ? outs : []);
      })
      .catch((err) => console.error("Error al cargar datos del diagrama de actividad:", err))
      .finally(() => setLoading(false));
  }, [open, activity]);

  const activityLabel = activity
    ? activity.codActivities
      ? `${activity.codActivities} - ${activity.nameActivities}`
      : activity.nameActivities
    : "";

  const flowKey = activity
    ? `${activity.idDlkActivities}-${procedures.length}-${inputs.length}-${outputs.length}`
    : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(1200px,calc(100vw-2rem))] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama - Actividad</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub Proceso &gt; Actividad
          &gt; Diagrama
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : activity ? (
          <div className="py-4">
            <ActivityDiagramFlow
              key={flowKey}
              procedures={procedures}
              inputs={inputs}
              outputs={outputs}
              activityLabel={activityLabel}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
