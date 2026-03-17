"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { SubprocessRow } from "./columns";
import type { ProcedureSubprocessRow } from "./procedure-subprocess-modal";
import type { InputSubprocessRow } from "./input-subprocess-modal";
import type { OutputSubprocessRow } from "./output-subprocess-modal";

const BOX_CLASS =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-4 min-w-[200px] max-w-[280px] shadow-md";
const SUBPROCESS_BOX_CLASS =
  "rounded-lg border-2 border-[#2a9d9d] bg-white text-[#2a9d9d] p-4 min-w-[220px] max-w-[320px] shadow-md font-medium";

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

  const procedureItems = procedures.map((p, i) => (
    <div key={p.idDlkProcedureSubprocess} className="text-sm">
      {i + 1}. {p.codProcedureSubprocess} - {p.nameProcedureSubprocess}
    </div>
  ));
  const inputItems = inputs.map((inp, i) => (
    <div key={inp.idDlkInputSubprocess} className="text-sm">
      {i + 1}. {inp.codInputSubprocess} - {inp.nameInputSubprocess}
    </div>
  ));
  const outputItems = outputs.map((out, i) => (
    <div key={out.idDlkOutputSubprocess} className="text-sm">
      {i + 1}. {out.codOutputSubprocess} - {out.nameOutputSubprocess}
    </div>
  ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama - Sub Proceso</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub Proceso &gt; Diagrama (Modal)
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando diagrama...</p>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4">
            {/* PROCEDURE (arriba) */}
            <div className={`${BOX_CLASS} w-full max-w-md`}>
              <div className="font-semibold mb-2 border-b border-white/50 pb-1">PROCEDURE</div>
              <div className="flex flex-col gap-0.5">
                {procedureItems.length ? procedureItems : <span className="text-sm opacity-80">Sin procedures</span>}
              </div>
            </div>

            {/* Flecha abajo Procedure -> Sub Proceso */}
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                <path d="M12 4v16M12 20l-4-4M12 20l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Fila: INPUT - SUB PROCESO - OUTPUT */}
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
              {/* INPUT */}
              <div className={BOX_CLASS}>
                <div className="font-semibold mb-2 border-b border-white/50 pb-1">INPUT</div>
                <div className="flex flex-col gap-0.5">
                  {inputItems.length ? inputItems : <span className="text-sm opacity-80">Sin inputs</span>}
                </div>
              </div>

              {/* Flecha Input -> Sub Proceso */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="shrink-0 text-muted-foreground">
                <path d="M0 12h28M24 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* SUB PROCESO (centro) */}
              <div className={SUBPROCESS_BOX_CLASS}>
                <div className="text-xs text-[#2a9d9d] font-semibold mb-1">SUB PROCESO</div>
                <div className="text-sm">{subprocessLabel || "—"}</div>
              </div>

              {/* Flecha Sub Proceso -> Output */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="shrink-0 text-muted-foreground">
                <path d="M0 12h24M24 8L32 12L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* OUTPUT */}
              <div className={BOX_CLASS}>
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
