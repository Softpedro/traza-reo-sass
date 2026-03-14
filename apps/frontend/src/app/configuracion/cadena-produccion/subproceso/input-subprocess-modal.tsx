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

export type InputSubprocessRow = {
  idDlkInputSubprocess: number;
  idDlkSubprocess: number;
  codInputSubprocess: string;
  nameInputSubprocess: string;
  descriptionInputSubprocess: string;
  typeInputSubprocess: string;
  originInputSubprocess: string;
  amountInputSubprocess: string;
  unitQuantity: string;
  supplierInputSubprocess: string | null;
  certificationInputSubprocess: string | null;
  observationInputSubprocess: string | null;
  stateInputSubprocess: number;
  subprocess?: { process?: { codProcess: string; nameProcess: string }; codSubprocess?: string; nameSubprocess?: string };
};

const OBS_TIPO: Record<string, string> = { "1": "Materiales", "2": "Documentos", "3": "Informes" };
const OBS_UNIDAD: Record<string, string> = { "1": "Documento", "2": "Informe", "3": "Kilogramos", "4": "Metros", "5": "Estudio" };

type ModalMode = "create" | "edit" | "view";

interface InputSubprocessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  subprocess: SubprocessRow | null;
  input: InputSubprocessRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codInputSubprocess: "",
  nameInputSubprocess: "",
  descriptionInputSubprocess: "",
  typeInputSubprocess: "3",
  originInputSubprocess: "",
  amountInputSubprocess: "",
  unitQuantity: "5",
  supplierInputSubprocess: "",
  certificationInputSubprocess: "",
  observationInputSubprocess: "",
  stateInputSubprocess: 1,
};

export function InputSubprocessModal({
  open,
  onOpenChange,
  mode,
  subprocess,
  input,
  onSuccess,
}: InputSubprocessModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel = subprocess
    ? `${subprocess.process.codProcess} - ${subprocess.process.nameProcess}`
    : input?.subprocess?.process
      ? `${input.subprocess.process.codProcess} - ${input.subprocess.process.nameProcess}`
      : "";
  const subprocessLabel = subprocess
    ? `${subprocess.codSubprocess} - ${subprocess.nameSubprocess}`
    : input?.subprocess
      ? `${input.subprocess.codSubprocess ?? ""} - ${input.subprocess.nameSubprocess ?? ""}`
      : "";

  useEffect(() => {
    if (input && (mode === "edit" || mode === "view")) {
      setForm({
        codInputSubprocess: input.codInputSubprocess ?? "",
        nameInputSubprocess: input.nameInputSubprocess ?? "",
        descriptionInputSubprocess: input.descriptionInputSubprocess ?? "",
        typeInputSubprocess: input.typeInputSubprocess || "3",
        originInputSubprocess: input.originInputSubprocess ?? "",
        amountInputSubprocess: input.amountInputSubprocess ?? "",
        unitQuantity: input.unitQuantity || "5",
        supplierInputSubprocess: input.supplierInputSubprocess ?? "",
        certificationInputSubprocess: input.certificationInputSubprocess ?? "",
        observationInputSubprocess: input.observationInputSubprocess ?? "",
        stateInputSubprocess: input.stateInputSubprocess ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [input, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const subprocessId = subprocess?.idDlkSubprocess ?? input?.idDlkSubprocess;
    if (!subprocessId) {
      alert("No se ha seleccionado un subproceso");
      return;
    }
    if (!form.nameInputSubprocess.trim()) {
      alert("El nombre del input es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/input-subprocesses/${input!.idDlkInputSubprocess}`)
          : apiUrl("/api/input-subprocesses");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? { ...form, stateInputSubprocess: Number(form.stateInputSubprocess) }
          : {
              idDlkSubprocess: subprocessId,
              ...form,
              stateInputSubprocess: Number(form.stateInputSubprocess),
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

  const title = mode === "create" ? "Crear Input" : mode === "edit" ? "Actualizar Input" : "Detalle de Input";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configuración &gt; Cadena de Producción &gt; Sub Proceso &gt; Input</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proceso:</Label>
            <Input className="col-span-3 bg-muted" value={processLabel} readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Sub Proceso:</Label>
            <Input className="col-span-3 bg-muted" value={subprocessLabel} readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codInputSubprocess}
              onChange={(e) => handleChange("codInputSubprocess", e.target.value)}
              placeholder="INP-SUB-PRO-COM-EST-MKT"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Input:</Label>
            <Input
              className="col-span-3"
              value={form.nameInputSubprocess}
              onChange={(e) => handleChange("nameInputSubprocess", e.target.value)}
              placeholder="Estudio de Mercado"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <Input
              className="col-span-3"
              value={form.descriptionInputSubprocess}
              onChange={(e) => handleChange("descriptionInputSubprocess", e.target.value)}
              placeholder="Estudio de mercado B2C"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo:</Label>
            <div className="col-span-3">
              <Select value={form.typeInputSubprocess} onValueChange={(v) => handleChange("typeInputSubprocess", v)} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_TIPO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Origen:</Label>
            <Input
              className="col-span-3"
              value={form.originInputSubprocess}
              onChange={(e) => handleChange("originInputSubprocess", e.target.value)}
              placeholder="Investigación interna"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Cantidad:</Label>
            <Input
              className="col-span-3"
              value={form.amountInputSubprocess}
              onChange={(e) => handleChange("amountInputSubprocess", e.target.value)}
              placeholder="1"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Unidad:</Label>
            <div className="col-span-3">
              <Select value={form.unitQuantity} onValueChange={(v) => handleChange("unitQuantity", v)} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_UNIDAD).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proveedor:</Label>
            <Input
              className="col-span-3"
              value={form.supplierInputSubprocess}
              onChange={(e) => handleChange("supplierInputSubprocess", e.target.value)}
              placeholder="Interno"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Certificacion:</Label>
            <Input
              className="col-span-3"
              value={form.certificationInputSubprocess}
              onChange={(e) => handleChange("certificationInputSubprocess", e.target.value)}
              placeholder="N/A"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Observacion:</Label>
            <Input
              className="col-span-3"
              value={form.observationInputSubprocess}
              onChange={(e) => handleChange("observationInputSubprocess", e.target.value)}
              placeholder="Análisis competencia"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                <Select
                  value={String(form.stateInputSubprocess)}
                  onValueChange={(v) => handleChange("stateInputSubprocess", Number(v))}
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
