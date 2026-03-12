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

// OBS Input: Tipo y Unidad
const OBS_TIPO: Record<string, string> = {
  "1": "Materiales",
  "2": "Documentos",
  "3": "Informes",
};
const OBS_UNIDAD: Record<string, string> = {
  "1": "Documento",
  "2": "Informe",
  "3": "Kilogramos",
  "4": "Metros",
};

export type InputProcessRow = {
  idDlkInputProcess: number;
  idDlkProcess: number;
  codInputProcess: string;
  nameInputProcess: string;
  descriptionInputProcess: string;
  typeInputProcess: string;
  originInputProcess: string;
  amountInputProcess: string;
  unitQuantity: string;
  supplierInputProcess: string | null;
  certificationInputProcess: string | null;
  observationInputProcess: string | null;
  stateInputProcess: number;
  process?: { idDlkProcess: number; codProcess: string; nameProcess: string };
};

type ModalMode = "create" | "edit" | "view";

interface InputProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  process: ProcessRow | null;
  input: InputProcessRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codInputProcess: "",
  nameInputProcess: "",
  descriptionInputProcess: "",
  typeInputProcess: "3",
  originInputProcess: "",
  amountInputProcess: "",
  unitQuantity: "2",
  supplierInputProcess: "",
  certificationInputProcess: "",
  observationInputProcess: "",
  stateInputProcess: 1,
};

export function InputProcessModal({
  open,
  onOpenChange,
  mode,
  process,
  input,
  onSuccess,
}: InputProcessModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel = process
    ? `${process.codProcess} - ${process.nameProcess}`
    : input?.process
      ? `${input.process.codProcess} - ${input.process.nameProcess}`
      : "";

  useEffect(() => {
    if (input && (mode === "edit" || mode === "view")) {
      setForm({
        codInputProcess: input.codInputProcess ?? "",
        nameInputProcess: input.nameInputProcess ?? "",
        descriptionInputProcess: input.descriptionInputProcess ?? "",
        typeInputProcess: input.typeInputProcess || "3",
        originInputProcess: input.originInputProcess ?? "",
        amountInputProcess: input.amountInputProcess ?? "",
        unitQuantity: input.unitQuantity || "2",
        supplierInputProcess: input.supplierInputProcess ?? "",
        certificationInputProcess: input.certificationInputProcess ?? "",
        observationInputProcess: input.observationInputProcess ?? "",
        stateInputProcess: input.stateInputProcess ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [input, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const processId = process?.idDlkProcess ?? input?.idDlkProcess;
    if (!processId) {
      alert("No se ha seleccionado un proceso");
      return;
    }
    if (!form.nameInputProcess.trim()) {
      alert("El nombre del input es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/input-processes/${input!.idDlkInputProcess}`)
          : apiUrl("/api/input-processes");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload =
        mode === "edit"
          ? {
              codInputProcess: form.codInputProcess,
              nameInputProcess: form.nameInputProcess,
              descriptionInputProcess: form.descriptionInputProcess,
              typeInputProcess: form.typeInputProcess,
              originInputProcess: form.originInputProcess,
              amountInputProcess: form.amountInputProcess,
              unitQuantity: form.unitQuantity,
              supplierInputProcess: form.supplierInputProcess || null,
              certificationInputProcess: form.certificationInputProcess || null,
              observationInputProcess: form.observationInputProcess || null,
              stateInputProcess: Number(form.stateInputProcess),
            }
          : {
              idDlkProcess: processId,
              codInputProcess: form.codInputProcess,
              nameInputProcess: form.nameInputProcess,
              descriptionInputProcess: form.descriptionInputProcess,
              typeInputProcess: form.typeInputProcess,
              originInputProcess: form.originInputProcess,
              amountInputProcess: form.amountInputProcess,
              unitQuantity: form.unitQuantity,
              supplierInputProcess: form.supplierInputProcess || null,
              certificationInputProcess: form.certificationInputProcess || null,
              observationInputProcess: form.observationInputProcess || null,
              stateInputProcess: Number(form.stateInputProcess),
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configuración &gt; Cadena de Producción &gt; Proceso &gt; Input
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proceso:</Label>
            <Input
              className="col-span-3 bg-muted"
              value={processLabel}
              readOnly
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codInputProcess}
              onChange={(e) => handleChange("codInputProcess", e.target.value)}
              placeholder="ej. INP-PRO-EST-MKT"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Input:</Label>
            <Input
              className="col-span-3"
              value={form.nameInputProcess}
              onChange={(e) => handleChange("nameInputProcess", e.target.value)}
              placeholder="ej. Estudio de Mercado"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <Input
              className="col-span-3"
              value={form.descriptionInputProcess}
              onChange={(e) => handleChange("descriptionInputProcess", e.target.value)}
              placeholder="ej. Estudio de mercado B2C"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo:</Label>
            <div className="col-span-3">
              <Select
                value={form.typeInputProcess}
                onValueChange={(v) => handleChange("typeInputProcess", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_TIPO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Origen:</Label>
            <Input
              className="col-span-3"
              value={form.originInputProcess}
              onChange={(e) => handleChange("originInputProcess", e.target.value)}
              placeholder="ej. Investigación interna"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Cantidad:</Label>
            <Input
              className="col-span-3"
              value={form.amountInputProcess}
              onChange={(e) => handleChange("amountInputProcess", e.target.value)}
              placeholder="ej. 1"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Unidad:</Label>
            <div className="col-span-3">
              <Select
                value={form.unitQuantity}
                onValueChange={(v) => handleChange("unitQuantity", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_UNIDAD).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proveedor:</Label>
            <Input
              className="col-span-3"
              value={form.supplierInputProcess}
              onChange={(e) => handleChange("supplierInputProcess", e.target.value)}
              placeholder="ej. Interno"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Certificación:</Label>
            <Input
              className="col-span-3"
              value={form.certificationInputProcess}
              onChange={(e) => handleChange("certificationInputProcess", e.target.value)}
              placeholder="ej. N/A"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Observación:</Label>
            <Input
              className="col-span-3"
              value={form.observationInputProcess}
              onChange={(e) => handleChange("observationInputProcess", e.target.value)}
              placeholder="ej. Análisis competencia"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Estado:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.stateInputProcess)}
                onValueChange={(v) => handleChange("stateInputProcess", Number(v))}
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
