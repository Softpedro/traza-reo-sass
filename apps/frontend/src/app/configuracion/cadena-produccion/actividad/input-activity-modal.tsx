"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { ActivityRow } from "./columns";

export type InputActivityRow = {
  idDlkInputActivities: number;
  idDlkActivities: number;
  codInputActivities: string;
  nameInputActivities: string;
  descriptionInputActivities: string;
  typeInputActivities: string;
  amountRequiredActivities: string;
  unitMeasureActivities: string;
  sourceInputActivities: string | null;
  technicalSpecActivities: string | null;
  criticalCheckActivities: string | null;
  stateInputActivities: number;
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

const OBS_TIPO: Record<string, string> = { "1": "Materiales", "2": "Documentos", "3": "Informes" };
const OBS_UNIDAD: Record<string, string> = { "1": "Documento", "2": "Informe", "3": "Kilogramos", "4": "Metros" };

type ModalMode = "create" | "edit" | "view";

interface InputActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  activity: ActivityRow | null;
  input: InputActivityRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codInputActivities: "",
  nameInputActivities: "",
  descriptionInputActivities: "",
  typeInputActivities: "3",
  amountRequiredActivities: "",
  unitMeasureActivities: "1",
  sourceInputActivities: "",
  technicalSpecActivities: "",
  criticalCheckActivities: "",
  stateInputActivities: 1,
};

export function InputActivityModal({
  open,
  onOpenChange,
  mode,
  activity,
  input,
  onSuccess,
}: InputActivityModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const proceso = activity?.subprocess.process ?? input?.activities?.subprocess?.process;
  const subproceso = activity?.subprocess ?? input?.activities?.subprocess;
  const actividad = activity ?? input?.activities;

  const processText = proceso ? `${proceso.codProcess} - ${proceso.nameProcess}` : "";
  const subprocessText = subproceso ? `${subproceso.codSubprocess} - ${subproceso.nameSubprocess}` : "";
  const activityText = actividad ? `${actividad.codActivities} - ${actividad.nameActivities}` : "";

  useEffect(() => {
    if (input && (mode === "edit" || mode === "view")) {
      setForm({
        codInputActivities: input.codInputActivities ?? "",
        nameInputActivities: input.nameInputActivities ?? "",
        descriptionInputActivities: input.descriptionInputActivities ?? "",
        typeInputActivities: input.typeInputActivities || "3",
        amountRequiredActivities: input.amountRequiredActivities ?? "",
        unitMeasureActivities: input.unitMeasureActivities || "1",
        sourceInputActivities: input.sourceInputActivities ?? "",
        technicalSpecActivities: input.technicalSpecActivities ?? "",
        criticalCheckActivities: input.criticalCheckActivities ?? "",
        stateInputActivities: input.stateInputActivities ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [input, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const activityId = activity?.idDlkActivities ?? input?.idDlkActivities;
    if (!activityId) {
      alert("No se ha seleccionado una actividad");
      return;
    }
    if (!form.nameInputActivities.trim()) {
      alert("El nombre del input es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/input-activities/${input!.idDlkInputActivities}`)
          : apiUrl("/api/input-activities");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? {
              ...form,
              stateInputActivities: Number(form.stateInputActivities),
            }
          : {
              idDlkActivities: activityId,
              ...form,
              stateInputActivities: Number(form.stateInputActivities),
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
      alert(err instanceof Error ? err.message : "Error al guardar el input");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Input"
      : mode === "edit"
        ? "Actualizar Input"
        : "Detalle de Input";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub proceso &gt; Actividad &gt; Input
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
              value={form.codInputActivities}
              onChange={(e) => handleChange("codInputActivities", e.target.value)}
              placeholder="INP-ACT-SUB-..."
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Input</Label>
            <Input
              value={form.nameInputActivities}
              onChange={(e) => handleChange("nameInputActivities", e.target.value)}
              placeholder="Nombre del input"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <Input
              value={form.descriptionInputActivities}
              onChange={(e) => handleChange("descriptionInputActivities", e.target.value)}
              placeholder="Descripción"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select
              value={form.typeInputActivities}
              onValueChange={(v) => handleChange("typeInputActivities", v)}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                {Object.entries(OBS_TIPO).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Origen</Label>
            <Input
              value={form.sourceInputActivities}
              onChange={(e) => handleChange("sourceInputActivities", e.target.value)}
              placeholder="Origen"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Cantidad</Label>
            <Input
              value={form.amountRequiredActivities}
              onChange={(e) => handleChange("amountRequiredActivities", e.target.value)}
              placeholder="Cantidad"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Unidad</Label>
            <Select
              value={form.unitMeasureActivities}
              onValueChange={(v) => handleChange("unitMeasureActivities", v)}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Unidad" /></SelectTrigger>
              <SelectContent>
                {Object.entries(OBS_UNIDAD).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Proveedor</Label>
            <Input
              value={form.technicalSpecActivities}
              onChange={(e) => handleChange("technicalSpecActivities", e.target.value)}
              placeholder="Proveedor"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Certificación</Label>
            <Input
              value={form.sourceInputActivities}
              onChange={(e) => handleChange("sourceInputActivities", e.target.value)}
              placeholder="Certificación"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Observación</Label>
            <Input
              value={form.criticalCheckActivities}
              onChange={(e) => handleChange("criticalCheckActivities", e.target.value)}
              placeholder="Observación"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div>
              <Label>Estado</Label>
              <Input
                value={String(form.stateInputActivities)}
                onChange={(e) => handleChange("stateInputActivities", Number(e.target.value || "1"))}
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

