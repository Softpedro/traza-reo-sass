"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ProcessRow } from "./columns";
import type { InputProcessRow } from "./input-process-modal";
import type { OutputProcessRow } from "./output-process-modal";
import type { ProcedureProcessRow } from "./procedure-process-modal";
import { ProcessDiagramFlow } from "./process-diagram-flow";

interface ProcessDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: ProcessRow | null;
}

export function ProcessDiagramDialog({
  open,
  onOpenChange,
  process,
}: ProcessDiagramDialogProps) {
  const [procedures, setProcedures] = useState<ProcedureProcessRow[]>([]);
  const [inputs, setInputs] = useState<InputProcessRow[]>([]);
  const [outputs, setOutputs] = useState<OutputProcessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !process) return;
    const id = process.idDlkProcess;
    setLoading(true);
    Promise.all([
      fetch(apiUrl(`/api/procedure-processes?processId=${id}`)).then((r) => r.json()),
      fetch(apiUrl(`/api/input-processes?processId=${id}`)).then((r) => r.json()),
      fetch(apiUrl(`/api/output-processes?processId=${id}`)).then((r) => r.json()),
    ])
      .then(([procs, ins, outs]) => {
        setProcedures(Array.isArray(procs) ? procs : []);
        setInputs(Array.isArray(ins) ? ins : []);
        setOutputs(Array.isArray(outs) ? outs : []);
      })
      .catch((err) => console.error("Error al cargar datos del diagrama:", err))
      .finally(() => setLoading(false));
  }, [open, process]);

  const processLabel = process
    ? `${process.codProcess || ""} - ${process.nameProcess}`.trim()
    : "";

  const flowKey = process
    ? `${process.idDlkProcess}-${procedures.length}-${inputs.length}-${outputs.length}`
    : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(1200px,calc(100vw-2rem))] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama - {processLabel || "Proceso"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Diagrama
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : process ? (
          <div className="py-4">
            <ProcessDiagramFlow
              key={flowKey}
              procedures={procedures}
              inputs={inputs}
              outputs={outputs}
              processLabel={processLabel}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
