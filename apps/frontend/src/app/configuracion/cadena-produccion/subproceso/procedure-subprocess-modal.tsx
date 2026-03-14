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

export type ProcedureSubprocessRow = {
  idDlkProcedureSubprocess: number;
  idDlkSubprocess: number;
  codProcedureSubprocess: string;
  nameProcedureSubprocess: string;
  descriptionProcedureSubprocess: string;
  typeProcedureSubprocess: string;
  responsibleProcedureSubprocess: string;
  estimatedTimeSubprocess: string;
  criticalitySubprocess: string;
  validationMethodSubprocess: string;
  pccSubprocess: string;
  stateProcedureSubprocess: number;
  subprocess?: { process?: { codProcess: string; nameProcess: string } };
};

const OBS_CRITICIDAD: Record<string, string> = { "0": "Baja", "1": "Media", "2": "Alta" };

type ModalMode = "create" | "edit" | "view";

interface ProcedureSubprocessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  subprocess: SubprocessRow | null;
  procedure: ProcedureSubprocessRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codProcedureSubprocess: "",
  nameProcedureSubprocess: "",
  descriptionProcedureSubprocess: "",
  typeProcedureSubprocess: "",
  responsibleProcedureSubprocess: "",
  estimatedTimeSubprocess: "",
  criticalitySubprocess: "2",
  validationMethodSubprocess: "",
  pccSubprocess: "",
  stateProcedureSubprocess: 1,
};

export function ProcedureSubprocessModal({
  open,
  onOpenChange,
  mode,
  subprocess,
  procedure,
  onSuccess,
}: ProcedureSubprocessModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel = subprocess
    ? `${subprocess.process.codProcess} - ${subprocess.process.nameProcess}`
    : procedure?.subprocess?.process
      ? `${procedure.subprocess.process.codProcess} - ${procedure.subprocess.process.nameProcess}`
      : "";
  const subprocessLabel = subprocess
    ? `${subprocess.codSubprocess} - ${subprocess.nameSubprocess}`
    : "";

  useEffect(() => {
    if (procedure && (mode === "edit" || mode === "view")) {
      setForm({
        codProcedureSubprocess: procedure.codProcedureSubprocess ?? "",
        nameProcedureSubprocess: procedure.nameProcedureSubprocess ?? "",
        descriptionProcedureSubprocess: procedure.descriptionProcedureSubprocess ?? "",
        typeProcedureSubprocess: procedure.typeProcedureSubprocess ?? "",
        responsibleProcedureSubprocess: procedure.responsibleProcedureSubprocess ?? "",
        estimatedTimeSubprocess: procedure.estimatedTimeSubprocess ?? "",
        criticalitySubprocess: procedure.criticalitySubprocess ?? "2",
        validationMethodSubprocess: procedure.validationMethodSubprocess ?? "",
        pccSubprocess: procedure.pccSubprocess ?? "",
        stateProcedureSubprocess: procedure.stateProcedureSubprocess ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [procedure, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const subprocessId = subprocess?.idDlkSubprocess ?? procedure?.idDlkSubprocess;
    if (!subprocessId) {
      alert("No se ha seleccionado un subproceso");
      return;
    }
    if (!form.nameProcedureSubprocess.trim()) {
      alert("El nombre del procedure es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/procedure-subprocesses/${procedure!.idDlkProcedureSubprocess}`)
          : apiUrl("/api/procedure-subprocesses");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? { ...form, stateProcedureSubprocess: Number(form.stateProcedureSubprocess) }
          : { idDlkSubprocess: subprocessId, ...form, stateProcedureSubprocess: Number(form.stateProcedureSubprocess) };

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

  const title = mode === "create" ? "Crear Procedure" : mode === "edit" ? "Actualizar Procedure" : "Detalle de Procedure";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configuración &gt; Cadena de Producción &gt; Sub Proceso &gt; Procedure</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proceso:</Label>
            <Input className="col-span-3 bg-muted" value={processLabel} readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Sub proceso:</Label>
            <Input className="col-span-3 bg-muted" value={subprocessLabel} readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codProcedureSubprocess}
              onChange={(e) => handleChange("codProcedureSubprocess", e.target.value)}
              placeholder="PRO-SUB-PRO-COM-EST-MKT"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Procedure:</Label>
            <Input
              className="col-span-3"
              value={form.nameProcedureSubprocess}
              onChange={(e) => handleChange("nameProcedureSubprocess", e.target.value)}
              placeholder="Estudio de mercado"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <textarea
              className="col-span-3 min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.descriptionProcedureSubprocess}
              onChange={(e) => handleChange("descriptionProcedureSubprocess", e.target.value)}
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Responsable:</Label>
            <Input
              className="col-span-3"
              value={form.responsibleProcedureSubprocess}
              onChange={(e) => handleChange("responsibleProcedureSubprocess", e.target.value)}
              placeholder="Analista Comercial"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Destino:</Label>
            <Input
              className="col-span-3"
              value={form.typeProcedureSubprocess}
              onChange={(e) => handleChange("typeProcedureSubprocess", e.target.value)}
              placeholder="UDP"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Duracion:</Label>
            <Input
              className="col-span-3"
              value={form.estimatedTimeSubprocess}
              onChange={(e) => handleChange("estimatedTimeSubprocess", e.target.value)}
              placeholder="24"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Criticidad:</Label>
            <div className="col-span-3">
              <Select value={form.criticalitySubprocess} onValueChange={(v) => handleChange("criticalitySubprocess", v)} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_CRITICIDAD).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{k} - {v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Validacion:</Label>
            <Input
              className="col-span-3"
              value={form.validationMethodSubprocess}
              onChange={(e) => handleChange("validationMethodSubprocess", e.target.value)}
              placeholder="Aprobado"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">PCC:</Label>
            <Input
              className="col-span-3"
              value={form.pccSubprocess}
              onChange={(e) => handleChange("pccSubprocess", e.target.value)}
              placeholder="Interna"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                <Select
                  value={String(form.stateProcedureSubprocess)}
                  onValueChange={(v) => handleChange("stateProcedureSubprocess", Number(v))}
                  disabled={readOnly}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
