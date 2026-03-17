"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ActivityRow } from "./columns";
import type { InputActivityRow } from "./input-activity-modal";

interface InputActivityListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityRow | null;
  mode: "edit" | "view";
  onCrear: () => void;
  onSelectInput: (input: InputActivityRow) => void;
}

export function InputActivityListDialog({
  open,
  onOpenChange,
  activity,
  mode,
  onCrear,
  onSelectInput,
}: InputActivityListDialogProps) {
  const [inputs, setInputs] = useState<InputActivityRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !activity) return;
    setLoading(true);
    fetch(apiUrl(`/api/input-activities?activityId=${activity.idDlkActivities}`))
      .then((res) => res.json())
      .then((data: InputActivityRow[]) => setInputs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar inputs de actividad:", err))
      .finally(() => setLoading(false));
  }, [open, activity]);

  const activityLabel = activity
    ? `${activity.codActivities} - ${activity.nameActivities}`
    : "";
  const modeLabel = mode === "edit" ? "Elija uno para editar" : "Elija uno para ver";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inputs de la actividad</DialogTitle>
          <p className="text-sm text-muted-foreground">{activityLabel}</p>
          <p className="text-xs text-muted-foreground">
            {modeLabel}. Use el botón de cada fila para abrir el modal.
          </p>
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
            <p className="text-sm text-muted-foreground">
              No hay inputs. Use &quot;Crear&quot; para agregar uno; luego podrá usar &quot;Editar&quot; o &quot;Ver&quot; desde la tabla para abrir esta lista y el modal.
            </p>
          ) : (
            <ul className="space-y-2">
              {inputs.map((inp) => (
                <li
                  key={inp.idDlkInputActivities}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="font-medium">
                    {inp.codInputActivities} - {inp.nameInputActivities}
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      onSelectInput(inp);
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

