"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { SubprocessRow } from "./columns";
import type { ProcedureSubprocessRow } from "./procedure-subprocess-modal";
import type { InputSubprocessRow } from "./input-subprocess-modal";
import type { OutputSubprocessRow } from "./output-subprocess-modal";
import { SubprocessDiagramFlow } from "./subprocess-diagram-flow";

interface SubprocessDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subprocess: SubprocessRow | null;
}

export function SubprocessDiagramDialog({
  open,
  onOpenChange,
  subprocess,
}: SubprocessDiagramDialogProps) {
  const [procedures, setProcedures] = useState<ProcedureSubprocessRow[]>([]);
  const [inputs, setInputs] = useState<InputSubprocessRow[]>([]);
  const [outputs, setOutputs] = useState<OutputSubprocessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !subprocess) return;
    const id = subprocess.idDlkSubprocess;
    setLoading(true);
    Promise.all([
      fetch(apiUrl(`/api/procedure-subprocesses?subprocessId=${id}`)).then((r) => r.json()),
      fetch(apiUrl(`/api/input-subprocesses?subprocessId=${id}`)).then((r) => r.json()),
      fetch(apiUrl(`/api/output-subprocesses?subprocessId=${id}`)).then((r) => r.json()),
    ])
      .then(([procs, ins, outs]) => {
        setProcedures(Array.isArray(procs) ? procs : []);
        setInputs(Array.isArray(ins) ? ins : []);
        setOutputs(Array.isArray(outs) ? outs : []);
      })
      .catch((err) => console.error("Error al cargar datos del diagrama:", err))
      .finally(() => setLoading(false));
  }, [open, subprocess]);

  const subprocessLabel = subprocess
    ? `${subprocess.codSubprocess || ""} - ${subprocess.nameSubprocess}`.trim()
    : "";

  const flowKey = subprocess
    ? `${subprocess.idDlkSubprocess}-${procedures.length}-${inputs.length}-${outputs.length}`
    : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(1200px,calc(100vw-2rem))] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama - Sub Proceso</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub Proceso &gt; Diagrama
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : subprocess ? (
          <div className="py-4">
            <SubprocessDiagramFlow
              key={flowKey}
              procedures={procedures}
              inputs={inputs}
              outputs={outputs}
              subprocessLabel={subprocessLabel}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
