"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { SubprocessRow } from "./columns";
import type { OutputSubprocessRow } from "./output-subprocess-modal";

interface OutputSubprocessListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subprocess: SubprocessRow | null;
  mode: "edit" | "view";
  onCrear: () => void;
  onSelectOutput: (output: OutputSubprocessRow) => void;
}

export function OutputSubprocessListDialog({
  open,
  onOpenChange,
  subprocess,
  mode,
  onCrear,
  onSelectOutput,
}: OutputSubprocessListDialogProps) {
  const [outputs, setOutputs] = useState<OutputSubprocessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !subprocess) return;
    setLoading(true);
    fetch(apiUrl(`/api/output-subprocesses?subprocessId=${subprocess.idDlkSubprocess}`))
      .then((res) => res.json())
      .then((data: OutputSubprocessRow[]) => setOutputs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar outputs:", err))
      .finally(() => setLoading(false));
  }, [open, subprocess]);

  const subprocessLabel = subprocess ? `${subprocess.codSubprocess} - ${subprocess.nameSubprocess}` : "";
  const modeLabel = mode === "edit" ? "Elija uno para editar" : "Elija uno para ver";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Outputs del subproceso</DialogTitle>
          <p className="text-sm text-muted-foreground">{subprocessLabel}</p>
          <p className="text-xs text-muted-foreground">{modeLabel}. Use el botón de cada fila para abrir el modal.</p>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-end">
            <Button size="sm" onClick={onCrear}>Crear</Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : outputs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay outputs. Use &quot;Crear&quot; para agregar uno; luego podrá usar &quot;Editar&quot; o &quot;Ver&quot; desde la tabla para abrir esta lista y el modal.
            </p>
          ) : (
            <ul className="space-y-2">
              {outputs.map((out) => (
                <li key={out.idDlkOutputSubprocess} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span className="font-medium">{out.codOutputSubprocess} - {out.nameOutputSubprocess}</span>
                  <Button variant="default" size="sm" onClick={() => { onOpenChange(false); onSelectOutput(out); }}>
                    {mode === "edit" ? "Editar" : "Ver"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
