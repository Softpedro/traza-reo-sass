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
import type { OutputProcessRow } from "./output-process-modal";

interface OutputListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: ProcessRow | null;
  mode: "edit" | "view";
  onCrear: () => void;
  onSelectOutput: (output: OutputProcessRow) => void;
}

export function OutputListDialog({
  open,
  onOpenChange,
  process,
  mode,
  onCrear,
  onSelectOutput,
}: OutputListDialogProps) {
  const [outputs, setOutputs] = useState<OutputProcessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !process) return;
    setLoading(true);
    fetch(apiUrl(`/api/output-processes?processId=${process.idDlkProcess}`))
      .then((res) => res.json())
      .then((data: OutputProcessRow[]) => setOutputs(data))
      .catch((err) => console.error("Error al cargar outputs:", err))
      .finally(() => setLoading(false));
  }, [open, process]);

  const processLabel = process
    ? `${process.codProcess} - ${process.nameProcess}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Outputs del proceso</DialogTitle>
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
          ) : outputs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay outputs. Haz clic en Crear para agregar uno.</p>
          ) : (
            <ul className="space-y-2">
              {outputs.map((out) => (
                <li
                  key={out.idDlkOutputProcess}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="font-medium">
                    {out.codOutputProcess} - {out.nameOutputProcess}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => {
                      onOpenChange(false);
                      onSelectOutput(out);
                    }}
                  >
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
