"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ProcessRow } from "./columns";
import type { InputProcessRow } from "./input-process-modal";
import type { OutputProcessRow } from "./output-process-modal";
import type { ProcedureProcessRow } from "./procedure-process-modal";

const BOX_CLASS =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-4 min-w-[200px] max-w-[280px] shadow-md";
const PROCESS_BOX_CLASS =
  "rounded-lg border-[3px] border-black bg-white text-black p-4 min-w-[220px] max-w-[200px] shadow-md";

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

  const procedureItems = procedures.map((p, i) => (
    <div key={p.idDlkProcedureProcess} className="text-sm">
      {i + 1}. {p.codProcedureProcess} - {p.nameProcedureProcess}
    </div>
  ));
  const inputItems = inputs.map((inp, i) => (
    <div key={inp.idDlkInputProcess} className="text-sm">
      {i + 1}. {inp.codInputProcess} - {inp.nameInputProcess}
    </div>
  ));
  const outputItems = outputs.map((out, i) => (
    <div key={out.idDlkOutputProcess} className="text-sm">
      {i + 1}. {out.codOutputProcess} - {out.nameOutputProcess}
    </div>
  ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama - {processLabel || "Proceso"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Diagrama
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Procedure (arriba) */}
            <div className={`${BOX_CLASS} w-full max-w-md`}>
              <div className="font-semibold mb-2 border-b border-white/50 pb-1">PROCEDURE</div>
              <div className="flex flex-col gap-0.5">
                {procedureItems.length ? procedureItems : <span className="text-sm opacity-80">Sin procedures</span>}
              </div>
            </div>

            {/* Flecha abajo Procedure -> Proceso */}
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                <path d="M12 4v16M12 20l-4-4M12 20l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Fila: Input - Proceso - Output */}
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
              {/* INPUT */}
              <div className={`${BOX_CLASS}`}>
                <div className="font-semibold mb-2 border-b border-white/50 pb-1">INPUT</div>
                <div className="flex flex-col gap-0.5">
                  {inputItems.length ? inputItems : <span className="text-sm opacity-80">Sin inputs</span>}
                </div>
              </div>

              {/* Flecha Input -> Proceso */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="shrink-0 text-muted-foreground">
                <path d="M0 12h28M24 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* PROCESO (centro) */}
              <div className={PROCESS_BOX_CLASS}>
                <div className="text-xs text-muted-foreground underline mb-1">PROCESO</div>
                <div className="font-medium text-sm">{processLabel || "—"}</div>
              </div>

              {/* Flecha Proceso -> Output (apunta a la derecha hacia Output) */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="shrink-0 text-muted-foreground">
                <path d="M0 12h24M24 8L32 12L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* OUTPUT */}
              <div className={`${BOX_CLASS}`}>
                <div className="font-semibold mb-2 border-b border-white/50 pb-1">OUTPUT</div>
                <div className="flex flex-col gap-0.5">
                  {outputItems.length ? outputItems : <span className="text-sm opacity-80">Sin outputs</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
