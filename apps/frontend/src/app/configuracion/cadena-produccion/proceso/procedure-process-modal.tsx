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
import type { ProcessRow } from "./columns";

// OBS Procedure: Criticidad y Validacion
const OBS_CRITICIDAD: Record<string, string> = {
  "0": "Baja",
  "1": "Media",
  "2": "Alta",
};
const OBS_VALIDACION: Record<string, string> = {
  "0": "No",
  "1": "Si",
};

export type ProcedureProcessRow = {
  idDlkProcedureProcess: number;
  idDlkProcess: number;
  codProcedureProcess: string;
  nameProcedureProcess: string;
  descriptionProcedureProcess: string;
  responsibleProcedureProcess: string;
  timeProcedureProcess: string;
  criticallyProcedureProcess: string;
  validationProcedureProcess: string;
  pccProcedureProcess: string;
  stateProcedureProcess: number;
  process?: { idDlkProcess: number; codProcess: string; nameProcess: string };
};

type ModalMode = "create" | "edit" | "view";

interface ProcedureProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  process: ProcessRow | null;
  procedure: ProcedureProcessRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codProcedureProcess: "",
  nameProcedureProcess: "",
  descriptionProcedureProcess: "",
  responsibleProcedureProcess: "",
  timeProcedureProcess: "",
  criticallyProcedureProcess: "2",
  validationProcedureProcess: "1",
  pccProcedureProcess: "",
  stateProcedureProcess: 1,
};

export function ProcedureProcessModal({
  open,
  onOpenChange,
  mode,
  process,
  procedure,
  onSuccess,
}: ProcedureProcessModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel = process
    ? `${process.codProcess} - ${process.nameProcess}`
    : procedure?.process
      ? `${procedure.process.codProcess} - ${procedure.process.nameProcess}`
      : "";

  useEffect(() => {
    if (procedure && (mode === "edit" || mode === "view")) {
      setForm({
        codProcedureProcess: procedure.codProcedureProcess ?? "",
        nameProcedureProcess: procedure.nameProcedureProcess ?? "",
        descriptionProcedureProcess: procedure.descriptionProcedureProcess ?? "",
        responsibleProcedureProcess: procedure.responsibleProcedureProcess ?? "",
        timeProcedureProcess: procedure.timeProcedureProcess ?? "",
        criticallyProcedureProcess: procedure.criticallyProcedureProcess ?? "2",
        validationProcedureProcess: procedure.validationProcedureProcess ?? "1",
        pccProcedureProcess: procedure.pccProcedureProcess ?? "",
        stateProcedureProcess: procedure.stateProcedureProcess ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [procedure, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const processId = process?.idDlkProcess ?? procedure?.idDlkProcess;
    if (!processId) {
      alert("No se ha seleccionado un proceso");
      return;
    }
    if (!form.nameProcedureProcess.trim()) {
      alert("El nombre del procedure es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/procedure-processes/${procedure!.idDlkProcedureProcess}`)
          : apiUrl("/api/procedure-processes");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload =
        mode === "edit"
          ? {
              codProcedureProcess: form.codProcedureProcess,
              nameProcedureProcess: form.nameProcedureProcess,
              descriptionProcedureProcess: form.descriptionProcedureProcess,
              responsibleProcedureProcess: form.responsibleProcedureProcess,
              timeProcedureProcess: form.timeProcedureProcess,
              criticallyProcedureProcess: form.criticallyProcedureProcess,
              validationProcedureProcess: form.validationProcedureProcess,
              pccProcedureProcess: form.pccProcedureProcess,
              stateProcedureProcess: Number(form.stateProcedureProcess),
            }
          : {
              idDlkProcess: processId,
              codProcedureProcess: form.codProcedureProcess,
              nameProcedureProcess: form.nameProcedureProcess,
              descriptionProcedureProcess: form.descriptionProcedureProcess,
              responsibleProcedureProcess: form.responsibleProcedureProcess,
              timeProcedureProcess: form.timeProcedureProcess,
              criticallyProcedureProcess: form.criticallyProcedureProcess,
              validationProcedureProcess: form.validationProcedureProcess,
              pccProcedureProcess: form.pccProcedureProcess,
              stateProcedureProcess: Number(form.stateProcedureProcess),
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configuración &gt; Cadena de Producción &gt; Proceso &gt; Procedure
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proceso:</Label>
            <Input className="col-span-3 bg-muted" value={processLabel} readOnly />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codProcedureProcess}
              onChange={(e) => handleChange("codProcedureProcess", e.target.value)}
              placeholder="ej. PRO-PRO-EM"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Procedure:</Label>
            <Input
              className="col-span-3"
              value={form.nameProcedureProcess}
              onChange={(e) => handleChange("nameProcedureProcess", e.target.value)}
              placeholder="ej. Estudio de mercado"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <Input
              className="col-span-3"
              value={form.descriptionProcedureProcess}
              onChange={(e) => handleChange("descriptionProcedureProcess", e.target.value)}
              placeholder="ej. Investigación B2C, análisis competencia y oportunidades"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Responsable:</Label>
            <Input
              className="col-span-3"
              value={form.responsibleProcedureProcess}
              onChange={(e) => handleChange("responsibleProcedureProcess", e.target.value)}
              placeholder="ej. Analista Comercial"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Duración:</Label>
            <Input
              className="col-span-3"
              value={form.timeProcedureProcess}
              onChange={(e) => handleChange("timeProcedureProcess", e.target.value)}
              placeholder="ej. 24"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Criticidad:</Label>
            <div className="col-span-3">
              <Select
                value={form.criticallyProcedureProcess}
                onValueChange={(v) => handleChange("criticallyProcedureProcess", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_CRITICIDAD).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Validación:</Label>
            <div className="col-span-3">
              <Select
                value={form.validationProcedureProcess}
                onValueChange={(v) => handleChange("validationProcedureProcess", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_VALIDACION).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">PCC:</Label>
            <Input
              className="col-span-3"
              value={form.pccProcedureProcess}
              onChange={(e) => handleChange("pccProcedureProcess", e.target.value)}
              placeholder="ej. Interna"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Estado:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.stateProcedureProcess)}
                onValueChange={(v) => handleChange("stateProcedureProcess", Number(v))}
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
