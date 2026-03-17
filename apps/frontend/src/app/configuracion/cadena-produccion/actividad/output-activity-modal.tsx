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

export type OutputActivityRow = {
  idDlkOutputActivities: number;
  idDlkActivities: number;
  codOutputActivities: string;
  nameOutputActivities: string;
  descriptionOutputActivities: string;
  typeOutputActivities: string;
  amountExpectedActivities: string;
  unitMeasureOutput: string;
  nextDestinationActivities: string | null;
  qualityStandardActivities: string | null;
  stateOutputActivities: number;
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
const OBS_ESTADO_SALIDA: Record<string, string> = { A: "Aprobado", P: "Pendiente", R: "Reprogramado" };

type ModalMode = "create" | "edit" | "view";

interface OutputActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  activity: ActivityRow | null;
  output: OutputActivityRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codOutputActivities: "",
  nameOutputActivities: "",
  descriptionOutputActivities: "",
  typeOutputActivities: "2",
  nextDestinationActivities: "",
  amountExpectedActivities: "",
  unitMeasureOutput: "1",
  stateOutputActivities: 1,
  qualityStandardActivities: "",
  observation: "",
};

export function OutputActivityModal({
  open,
  onOpenChange,
  mode,
  activity,
  output,
  onSuccess,
}: OutputActivityModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const proceso = activity?.subprocess.process ?? output?.activities?.subprocess?.process;
  const subproceso = activity?.subprocess ?? output?.activities?.subprocess;
  const actividad = activity ?? output?.activities;

  const processText = proceso ? `${proceso.codProcess} - ${proceso.nameProcess}` : "";
  const subprocessText = subproceso ? `${subproceso.codSubprocess} - ${subproceso.nameSubprocess}` : "";
  const activityText = actividad ? `${actividad.codActivities} - ${actividad.nameActivities}` : "";

  useEffect(() => {
    if (output && (mode === "edit" || mode === "view")) {
      setForm({
        codOutputActivities: output.codOutputActivities ?? "",
        nameOutputActivities: output.nameOutputActivities ?? "",
        descriptionOutputActivities: output.descriptionOutputActivities ?? "",
        typeOutputActivities: output.typeOutputActivities || "2",
        nextDestinationActivities: output.nextDestinationActivities ?? "",
        amountExpectedActivities: output.amountExpectedActivities ?? "",
        unitMeasureOutput: output.unitMeasureOutput || "1",
        stateOutputActivities: output.stateOutputActivities ?? 1,
        qualityStandardActivities: output.qualityStandardActivities ?? "",
        observation: output.qualityStandardActivities ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [output, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const activityId = activity?.idDlkActivities ?? output?.idDlkActivities;
    if (!activityId) {
      alert("No se ha seleccionado una actividad");
      return;
    }
    if (!form.nameOutputActivities.trim()) {
      alert("El nombre del output es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/output-activities/${output!.idDlkOutputActivities}`)
          : apiUrl("/api/output-activities");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? {
              ...form,
              stateOutputActivities: Number(form.stateOutputActivities),
            }
          : {
              idDlkActivities: activityId,
              ...form,
              stateOutputActivities: Number(form.stateOutputActivities),
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
      alert(err instanceof Error ? err.message : "Error al guardar el output");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Output"
      : mode === "edit"
        ? "Actualizar Output"
        : "Detalle de Output";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub Proceso &gt; Actividad &gt; Output (Modal)
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
              value={form.codOutputActivities}
              onChange={(e) => handleChange("codOutputActivities", e.target.value)}
              placeholder="OUT-ACT-SUB-..."
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Output</Label>
            <Input
              value={form.nameOutputActivities}
              onChange={(e) => handleChange("nameOutputActivities", e.target.value)}
              placeholder="Nombre del output"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <Input
              value={form.descriptionOutputActivities}
              onChange={(e) => handleChange("descriptionOutputActivities", e.target.value)}
              placeholder="Descripción"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select
              value={form.typeOutputActivities}
              onValueChange={(v) => handleChange("typeOutputActivities", v)}
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
            <Label>Destino</Label>
            <Input
              value={form.nextDestinationActivities}
              onChange={(e) => handleChange("nextDestinationActivities", e.target.value)}
              placeholder="Destino"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Cantidad</Label>
            <Input
              value={form.amountExpectedActivities}
              onChange={(e) => handleChange("amountExpectedActivities", e.target.value)}
              placeholder="Cantidad"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Unidad</Label>
            <Select
              value={form.unitMeasureOutput}
              onValueChange={(v) => handleChange("unitMeasureOutput", v)}
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
            <Label>Estado de la salida</Label>
            <Select
              value={form.stateOutputActivities ? (form.stateOutputActivities === 1 ? "A" : form.stateOutputActivities === 2 ? "P" : "R") : "A"}
              onValueChange={(v) =>
                handleChange(
                  "stateOutputActivities",
                  v === "A" ? 1 : v === "P" ? 2 : 3
                )
              }
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                {Object.entries(OBS_ESTADO_SALIDA).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Certificación</Label>
            <Input
              value={form.qualityStandardActivities}
              onChange={(e) => handleChange("qualityStandardActivities", e.target.value)}
              placeholder="Certificación"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Observación</Label>
            <Input
              value={form.observation}
              onChange={(e) => handleChange("observation", e.target.value)}
              placeholder="Observación"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div>
              <Label>Estado</Label>
              <Input
                value={String(form.stateOutputActivities)}
                onChange={(e) => handleChange("stateOutputActivities", Number(e.target.value || "1"))}
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

