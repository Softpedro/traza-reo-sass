"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ActivityRow } from "./columns";

export type ProcedureActivityRow = {
  idDlkProcedureActivities: number;
  idDlkActivities: number;
  codProcedureActivities: string;
  nameProcedureActivities: string;
  descriptionProcedureActivities: string;
  typeProcedureActivities: string;
  responsibleExecution: string;
  estimatedTimeProcedure: string;
  criticalPointActivities: string;
  safetyRequirement: string;
  validationMethod: string;
  stateProcedureActivities: number;
  activities?: {
    codActivities: string;
    nameActivities: string;
    subprocess?: {
      codSubprocess: string;
      nameSubprocess: string;
      process?: { codProcess: string; nameProcess: string };
    };
  };
};

type ModalMode = "create" | "edit" | "view";

interface ProcedureActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  activity: ActivityRow | null;
  procedure: ProcedureActivityRow | null;
  onSuccess: () => void;
}

const OBS_CRITICIDAD: Record<string, string> = { "0": "Baja", "1": "Media", "2": "Alta" };
const OBS_VALIDACION: Record<string, string> = { "0": "No", "1": "Si" };

const emptyForm: {
  codProcedureActivities: string;
  nameProcedureActivities: string;
  descriptionProcedureActivities: string;
  typeProcedureActivities: string;
  responsibleExecution: string;
  estimatedTimeProcedure: string;
  criticalPointActivities: string;
  safetyRequirement: string;
  validationMethod: string;
  stateProcedureActivities: number;
} = {
  codProcedureActivities: "",
  nameProcedureActivities: "",
  descriptionProcedureActivities: "",
  typeProcedureActivities: "",
  responsibleExecution: "",
  estimatedTimeProcedure: "",
  criticalPointActivities: "",
  safetyRequirement: "",
  validationMethod: "",
  stateProcedureActivities: 1,
};

export function ProcedureActivityModal({
  open,
  onOpenChange,
  mode,
  activity,
  procedure,
  onSuccess,
}: ProcedureActivityModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel =
    activity?.subprocess.process ??
    procedure?.activities?.subprocess?.process;
  const subprocessLabel =
    activity?.subprocess ??
    procedure?.activities?.subprocess;
  const actividadLabel = activity ?? procedure?.activities;

  const processText = processLabel
    ? `${processLabel.codProcess} - ${processLabel.nameProcess}`
    : "";
  const subprocessText = subprocessLabel
    ? `${subprocessLabel.codSubprocess} - ${subprocessLabel.nameSubprocess}`
    : "";
  const activityText = actividadLabel
    ? `${actividadLabel.codActivities} - ${actividadLabel.nameActivities}`
    : "";

  useEffect(() => {
    if (procedure && (mode === "edit" || mode === "view")) {
      setForm({
        codProcedureActivities: procedure.codProcedureActivities ?? "",
        nameProcedureActivities: procedure.nameProcedureActivities ?? "",
        descriptionProcedureActivities: procedure.descriptionProcedureActivities ?? "",
        typeProcedureActivities: procedure.typeProcedureActivities ?? "",
        responsibleExecution: procedure.responsibleExecution ?? "",
        estimatedTimeProcedure: procedure.estimatedTimeProcedure ?? "",
        criticalPointActivities: procedure.criticalPointActivities ?? "",
        safetyRequirement: procedure.safetyRequirement ?? "",
        validationMethod: procedure.validationMethod ?? "",
        stateProcedureActivities: procedure.stateProcedureActivities ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [procedure, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const activityId = activity?.idDlkActivities ?? procedure?.idDlkActivities;
    if (!activityId) {
      alert("No se ha seleccionado una actividad");
      return;
    }
    if (!form.nameProcedureActivities.trim()) {
      alert("El nombre del procedure es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/procedure-activities/${procedure!.idDlkProcedureActivities}`)
          : apiUrl("/api/procedure-activities");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? {
              ...form,
              stateProcedureActivities: Number(form.stateProcedureActivities),
            }
          : {
              idDlkActivities: activityId,
              ...form,
              stateProcedureActivities: Number(form.stateProcedureActivities),
            };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.type === "VALIDATION") throw new Error(body.error);
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar el procedure");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Procedure"
      : mode === "edit"
        ? "Actualizar Procedure"
        : "Detalle de Procedure";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub Proceso &gt; Actividad &gt; Procedure
        </p>

        <div className="grid gap-4 py-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Proceso</Label>
            <Input className="bg-muted" value={processText} readOnly />
          </div>
          <div className="sm:col-span-2">
            <Label>Sub Proceso</Label>
            <Input className="bg-muted" value={subprocessText} readOnly />
          </div>
          <div className="sm:col-span-2">
            <Label>Actividad</Label>
            <Input className="bg-muted" value={activityText} readOnly />
          </div>
          <div>
            <Label>Código</Label>
            <Input
              value={form.codProcedureActivities}
              onChange={(e) => handleChange("codProcedureActivities", e.target.value)}
              placeholder="PRO-ACT-SUB-..."
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Procedure</Label>
            <Input
              value={form.nameProcedureActivities}
              onChange={(e) => handleChange("nameProcedureActivities", e.target.value)}
              placeholder="Nombre del procedure"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <Input
              value={form.descriptionProcedureActivities}
              onChange={(e) => handleChange("descriptionProcedureActivities", e.target.value)}
              placeholder="Descripción"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Input
              value={form.typeProcedureActivities}
              onChange={(e) => handleChange("typeProcedureActivities", e.target.value)}
              placeholder="Tipo"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Responsable</Label>
            <Input
              value={form.responsibleExecution}
              onChange={(e) => handleChange("responsibleExecution", e.target.value)}
              placeholder="Responsable de ejecución"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Destino</Label>
            <Input
              value={form.criticalPointActivities}
              onChange={(e) => handleChange("criticalPointActivities", e.target.value)}
              placeholder="Destino / punto crítico"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Duración</Label>
            <Input
              value={form.estimatedTimeProcedure}
              onChange={(e) => handleChange("estimatedTimeProcedure", e.target.value)}
              placeholder="Horas"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Criticidad</Label>
            <Select
              value={form.safetyRequirement || "2"}
              onValueChange={(v) => handleChange("safetyRequirement", v)}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Criticidad" /></SelectTrigger>
              <SelectContent>
                {Object.entries(OBS_CRITICIDAD).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Validación</Label>
            <Select
              value={form.validationMethod || "1"}
              onValueChange={(v) => handleChange("validationMethod", v)}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Validación" /></SelectTrigger>
              <SelectContent>
                {Object.entries(OBS_VALIDACION).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>PCC</Label>
            <Input
              value={form.safetyRequirement}
              onChange={(e) => handleChange("safetyRequirement", e.target.value)}
              placeholder="PCC"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div>
              <Label>Estado</Label>
              <Input
                value={String(form.stateProcedureActivities)}
                onChange={(e) => handleChange("stateProcedureActivities", Number(e.target.value || "1"))}
                readOnly={readOnly}
              />
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando..." : mode === "edit" ? "Actualizar" : "Crear"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

