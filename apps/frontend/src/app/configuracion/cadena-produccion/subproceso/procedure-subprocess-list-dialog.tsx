"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { SubprocessRow } from "./columns";
import type { ProcedureSubprocessRow } from "./procedure-subprocess-modal";

interface ProcedureSubprocessListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subprocess: SubprocessRow | null;
  mode: "edit" | "view";
  onCrear: () => void;
  onSelectProcedure: (procedure: ProcedureSubprocessRow) => void;
}

export function ProcedureSubprocessListDialog({
  open,
  onOpenChange,
  subprocess,
  mode,
  onCrear,
  onSelectProcedure,
}: ProcedureSubprocessListDialogProps) {
  const [procedures, setProcedures] = useState<ProcedureSubprocessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !subprocess) return;
    setLoading(true);
    fetch(apiUrl(`/api/procedure-subprocesses?subprocessId=${subprocess.idDlkSubprocess}`))
      .then((res) => res.json())
      .then((data: ProcedureSubprocessRow[]) => setProcedures(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar procedures:", err))
      .finally(() => setLoading(false));
  }, [open, subprocess]);

  const subprocessLabel = subprocess ? `${subprocess.codSubprocess} - ${subprocess.nameSubprocess}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Procedures del subproceso</DialogTitle>
          <p className="text-sm text-muted-foreground">{subprocessLabel}</p>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-end">
            <Button size="sm" onClick={onCrear}>Crear</Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : procedures.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay procedures. Haz clic en Crear para agregar uno.</p>
          ) : (
            <ul className="space-y-2">
              {procedures.map((proc) => (
                <li key={proc.idDlkProcedureSubprocess} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span className="font-medium">{proc.codProcedureSubprocess} - {proc.nameProcedureSubprocess}</span>
                  <Button variant="link" size="sm" className="h-auto p-0" onClick={() => { onOpenChange(false); onSelectProcedure(proc); }}>
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
