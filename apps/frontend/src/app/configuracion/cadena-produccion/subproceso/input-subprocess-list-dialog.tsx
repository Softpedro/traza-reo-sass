"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { SubprocessRow } from "./columns";
import type { InputSubprocessRow } from "./input-subprocess-modal";

interface InputSubprocessListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subprocess: SubprocessRow | null;
  mode: "edit" | "view";
  onCrear: () => void;
  onSelectInput: (input: InputSubprocessRow) => void;
}

export function InputSubprocessListDialog({
  open,
  onOpenChange,
  subprocess,
  mode,
  onCrear,
  onSelectInput,
}: InputSubprocessListDialogProps) {
  const [inputs, setInputs] = useState<InputSubprocessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !subprocess) return;
    setLoading(true);
    fetch(apiUrl(`/api/input-subprocesses?subprocessId=${subprocess.idDlkSubprocess}`))
      .then((res) => res.json())
      .then((data: InputSubprocessRow[]) => setInputs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar inputs:", err))
      .finally(() => setLoading(false));
  }, [open, subprocess]);

  const subprocessLabel = subprocess ? `${subprocess.codSubprocess} - ${subprocess.nameSubprocess}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inputs del subproceso</DialogTitle>
          <p className="text-sm text-muted-foreground">{subprocessLabel}</p>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-end">
            <Button size="sm" onClick={onCrear}>Crear</Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : inputs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay inputs. Haz clic en Crear para agregar uno.</p>
          ) : (
            <ul className="space-y-2">
              {inputs.map((inp) => (
                <li key={inp.idDlkInputSubprocess} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span className="font-medium">{inp.codInputSubprocess} - {inp.nameInputSubprocess}</span>
                  <Button variant="link" size="sm" className="h-auto p-0" onClick={() => { onOpenChange(false); onSelectInput(inp); }}>
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
