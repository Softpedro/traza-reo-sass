"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ProcessRow } from "./columns";
import type { InputProcessRow } from "./input-process-modal";

interface InputListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: ProcessRow | null;
  mode: "edit" | "view";
  onCrear: () => void;
  onSelectInput: (input: InputProcessRow) => void;
}

export function InputListDialog({
  open,
  onOpenChange,
  process,
  mode,
  onCrear,
  onSelectInput,
}: InputListDialogProps) {
  const [inputs, setInputs] = useState<InputProcessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !process) return;
    setLoading(true);
    fetch(apiUrl(`/api/input-processes?processId=${process.idDlkProcess}`))
      .then((res) => res.json())
      .then((data: InputProcessRow[]) => setInputs(data))
      .catch((err) => console.error("Error al cargar inputs:", err))
      .finally(() => setLoading(false));
  }, [open, process]);

  const processLabel = process
    ? `${process.codProcess} - ${process.nameProcess}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inputs del proceso</DialogTitle>
          <p className="text-sm text-muted-foreground">{processLabel}</p>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-end">
            <Button size="sm" onClick={onCrear}>
              Crear
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : inputs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay inputs. Haz clic en Crear para agregar uno.</p>
          ) : (
            <ul className="space-y-2">
              {inputs.map((inv) => (
                <li
                  key={inv.idDlkInputProcess}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="font-medium">
                    {inv.codInputProcess} - {inv.nameInputProcess}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => {
                        onOpenChange(false);
                        onSelectInput(inv);
                      }}
                    >
                      {mode === "edit" ? "Editar" : "Ver"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
