"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import type { SubprocessRow } from "./columns";
import { getTrazabilidadLabel } from "../eslabon/obs";

const OBS_CRITICIDAD: Record<string, string> = {
  "0": "Baja",
  "1": "Media",
  "2": "Alta",
};
const OBS_TERCERIZADO: Record<string, string> = {
  "0": "Muestra Interna",
  "1": "No",
  "2": "Si",
};

type ModalMode = "create" | "edit" | "view";

interface SubprocesoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  subprocess: SubprocessRow | null;
  onSuccess: () => void;
}

type ProcessOption = {
  idDlkProcess: number;
  codProcess: string;
  nameProcess: string;
  productionChain: {
    idDlkProductionChain: number;
    numPrecedenciaTrazabilidad: number;
    nameProductionChain: string;
  };
};

const emptyForm = {
  idDlkProcess: 0,
  ordenPrecedenciaSubprocess: 1,
  codSubprocess: "",
  nameSubprocess: "",
  descriptionSubprocess: "",
  objectiveSubprocess: "",
  criticalitySubprocess: "1",
  outsourcedSubprocess: "1",
  estimatedTimeSubprocess: 0,
  responsibleUnit: "",
  responsibleRole: "",
  stateSubprocess: 1,
};

export function SubprocesoModal({
  open,
  onOpenChange,
  mode,
  subprocess,
  onSuccess,
}: SubprocesoModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [processes, setProcesses] = useState<ProcessOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/processes"))
      .then((res) => res.json())
      .then((data: ProcessOption[]) => setProcesses(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar procesos:", err));
  }, [open]);

  useEffect(() => {
    if (subprocess && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkProcess: subprocess.process.idDlkProcess,
        ordenPrecedenciaSubprocess: subprocess.ordenPrecedenciaSubprocess ?? 1,
        codSubprocess: subprocess.codSubprocess ?? "",
        nameSubprocess: subprocess.nameSubprocess,
        descriptionSubprocess: subprocess.descriptionSubprocess ?? "",
        objectiveSubprocess: subprocess.objectiveSubprocess ?? "",
        criticalitySubprocess: subprocess.criticalitySubprocess ?? "1",
        outsourcedSubprocess: subprocess.outsourcedSubprocess ?? "1",
        estimatedTimeSubprocess: subprocess.estimatedTimeSubprocess ?? 0,
        responsibleUnit: subprocess.responsibleUnit ?? "",
        responsibleRole: subprocess.responsibleRole ?? "",
        stateSubprocess: subprocess.stateSubprocess,
      });
    } else if (mode === "create") {
      setForm(emptyForm);
    }
  }, [subprocess, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const selectedProcess = form.idDlkProcess
    ? processes.find((p) => p.idDlkProcess === form.idDlkProcess)
    : null;
  const eslabonLabel = selectedProcess
    ? getTrazabilidadLabel(selectedProcess.productionChain.numPrecedenciaTrazabilidad).split(" ")[0] +
      " - " +
      selectedProcess.productionChain.nameProductionChain
    : "";
  const processLabel = selectedProcess
    ? (selectedProcess.codProcess ? selectedProcess.codProcess + " - " : "") + selectedProcess.nameProcess
    : "";

  async function handleSubmit() {
    if (!form.nameSubprocess.trim()) {
      alert("El nombre del subproceso es obligatorio");
      return;
    }
    if (!form.idDlkProcess) {
      alert("Debes seleccionar un proceso");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/subprocesses/${subprocess!.idDlkSubprocess}`)
          : apiUrl("/api/subprocesses");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        idDlkProcess: Number(form.idDlkProcess),
        ordenPrecedenciaSubprocess: form.ordenPrecedenciaSubprocess || null,
        codSubprocess: form.codSubprocess.trim() || undefined,
        nameSubprocess: form.nameSubprocess,
        descriptionSubprocess: form.descriptionSubprocess,
        objectiveSubprocess: form.objectiveSubprocess || null,
        criticalitySubprocess: form.criticalitySubprocess,
        outsourcedSubprocess: form.outsourcedSubprocess,
        estimatedTimeSubprocess: form.estimatedTimeSubprocess || null,
        responsibleUnit: form.responsibleUnit || null,
        responsibleRole: form.responsibleRole || null,
        stateSubprocess: mode === "edit" ? Number(form.stateSubprocess) : undefined,
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
      alert(err instanceof Error ? err.message : "Error al guardar el subproceso");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Sub Proceso"
      : mode === "edit"
        ? "Actualizar Sub Proceso"
        : "Detalle de Sub Proceso";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar un nuevo subproceso."
              : mode === "edit"
                ? "Modifica los campos que necesites."
                : "Información del subproceso."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Eslabón:</Label>
            <div className="col-span-3">
              {mode === "create" ? (
                <span className="text-sm text-muted-foreground">
                  {form.idDlkProcess ? eslabonLabel : "Selecciona un proceso"}
                </span>
              ) : (
                <Input value={eslabonLabel} readOnly className="bg-muted" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proceso:</Label>
            <div className="col-span-3">
              {mode === "create" ? (
                <Select
                  value={form.idDlkProcess ? String(form.idDlkProcess) : ""}
                  onValueChange={(v) => handleChange("idDlkProcess", Number(v))}
                  disabled={readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proceso" />
                  </SelectTrigger>
                  <SelectContent>
                    {processes.map((p) => {
                      const label = (p.codProcess ? p.codProcess + " - " : "") + p.nameProcess;
                      return (
                        <SelectItem key={p.idDlkProcess} value={String(p.idDlkProcess)}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={processLabel} readOnly className="bg-muted" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codSubprocess}
              onChange={(e) => handleChange("codSubprocess", e.target.value)}
              placeholder="ej. SUB-PRO-COM-EST-MKT"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Sub Proceso:</Label>
            <Input
              className="col-span-3"
              value={form.nameSubprocess}
              onChange={(e) => handleChange("nameSubprocess", e.target.value)}
              placeholder="ej. Investigación de Mercado"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Secuencia:</Label>
            <Input
              type="number"
              min={1}
              className="col-span-3"
              value={form.ordenPrecedenciaSubprocess}
              onChange={(e) =>
                handleChange("ordenPrecedenciaSubprocess", parseInt(e.target.value, 10) || 1)
              }
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <textarea
              className="col-span-3 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.descriptionSubprocess}
              onChange={(e) => handleChange("descriptionSubprocess", e.target.value)}
              placeholder="Realiza la investigación de mercado B2C, análisis de competencia..."
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Objetivo:</Label>
            <textarea
              className="col-span-3 min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.objectiveSubprocess}
              onChange={(e) => handleChange("objectiveSubprocess", e.target.value)}
              placeholder="Contar con un estudio de mercado del producto..."
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Criticidad:</Label>
            <div className="col-span-3">
              <Select
                value={form.criticalitySubprocess}
                onValueChange={(v) => handleChange("criticalitySubprocess", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_CRITICIDAD).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {k} - {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tercerizado:</Label>
            <div className="col-span-3">
              <Select
                value={form.outsourcedSubprocess}
                onValueChange={(v) => handleChange("outsourcedSubprocess", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_TERCERIZADO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {k} - {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Duración (Horas):</Label>
            <Input
              type="number"
              min={0}
              className="col-span-3"
              value={form.estimatedTimeSubprocess || ""}
              onChange={(e) =>
                handleChange(
                  "estimatedTimeSubprocess",
                  e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0
                )
              }
              placeholder="28"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Unidad:</Label>
            <Input
              className="col-span-3"
              value={form.responsibleUnit}
              onChange={(e) => handleChange("responsibleUnit", e.target.value)}
              placeholder="ej. GC - Gerencia Comercial"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Responsable:</Label>
            <Input
              className="col-span-3"
              value={form.responsibleRole}
              onChange={(e) => handleChange("responsibleRole", e.target.value)}
              placeholder="ej. Jefe Comercial y analista"
              readOnly={readOnly}
            />
          </div>

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                <Select
                  value={String(form.stateSubprocess)}
                  onValueChange={(v) => handleChange("stateSubprocess", Number(v))}
                  disabled={readOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Off</SelectItem>
                    <SelectItem value="1">On</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {!readOnly && (
            <div className="flex justify-end pt-2">
              <Button onClick={handleSubmit} disabled={saving}>
                {mode === "create" ? "Crear" : "Actualizar"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
