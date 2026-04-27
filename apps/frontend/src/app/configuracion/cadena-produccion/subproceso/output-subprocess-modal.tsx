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

export type OutputSubprocessRow = {
  idDlkOutputSubprocess: number;
  idDlkSubprocess: number;
  codOutputSubprocess: string;
  nameOutputSubprocess: string;
  descriptionOutputSubprocess: string;
  typeOutputSubprocess: string;
  destinationOutputSubprocess: string;
  amountOutputSubprocess: string;
  unitQuantity: string;
  stateOutputSubprocess: string;
  certificationOutputSubprocess: string | null;
  observationOutputSubprocess: string | null;
  stateOutput: number;
  subprocess?: { process?: { codProcess: string; nameProcess: string }; codSubprocess?: string; nameSubprocess?: string };
};

const OBS_TIPO: Record<string, string> = { "1": "Materiales", "2": "Documentos", "3": "Informes" };
const OBS_UNIDAD: Record<string, string> = { "1": "Documento", "2": "Informe", "3": "Orden", "4": "Estudio" };
const OBS_ESTADO_SALIDA: Record<string, string> = { "1": "Aprobado", "2": "Pendiente", "3": "Rechazado" };

type ModalMode = "create" | "edit" | "view";

interface OutputSubprocessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  subprocess: SubprocessRow | null;
  output: OutputSubprocessRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codOutputSubprocess: "",
  nameOutputSubprocess: "",
  descriptionOutputSubprocess: "",
  typeOutputSubprocess: "2",
  destinationOutputSubprocess: "",
  amountOutputSubprocess: "",
  unitQuantity: "3",
  stateOutputSubprocess: "1",
  certificationOutputSubprocess: "",
  observationOutputSubprocess: "",
  stateOutput: 1,
};

export function OutputSubprocessModal({
  open,
  onOpenChange,
  mode,
  subprocess,
  output,
  onSuccess,
}: OutputSubprocessModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel = subprocess
    ? `${subprocess.process.codProcess} - ${subprocess.process.nameProcess}`
    : output?.subprocess?.process
      ? `${output.subprocess.process.codProcess} - ${output.subprocess.process.nameProcess}`
      : "";
  const subprocessLabel = subprocess
    ? `${subprocess.codSubprocess} - ${subprocess.nameSubprocess}`
    : output?.subprocess
      ? `${output.subprocess.codSubprocess ?? ""} - ${output.subprocess.nameSubprocess ?? ""}`
      : "";

  useEffect(() => {
    if (output && (mode === "edit" || mode === "view")) {
      setForm({
        codOutputSubprocess: output.codOutputSubprocess ?? "",
        nameOutputSubprocess: output.nameOutputSubprocess ?? "",
        descriptionOutputSubprocess: output.descriptionOutputSubprocess ?? "",
        typeOutputSubprocess: output.typeOutputSubprocess || "2",
        destinationOutputSubprocess: output.destinationOutputSubprocess ?? "",
        amountOutputSubprocess: output.amountOutputSubprocess ?? "",
        unitQuantity: output.unitQuantity || "3",
        stateOutputSubprocess: output.stateOutputSubprocess || "1",
        certificationOutputSubprocess: output.certificationOutputSubprocess ?? "",
        observationOutputSubprocess: output.observationOutputSubprocess ?? "",
        stateOutput: output.stateOutput ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [output, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const subprocessId = subprocess?.idDlkSubprocess ?? output?.idDlkSubprocess;
    if (!subprocessId) {
      alert("No se ha seleccionado un subproceso");
      return;
    }
    if (!form.nameOutputSubprocess.trim()) {
      alert("El nombre del output es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/output-subprocesses/${output!.idDlkOutputSubprocess}`)
          : apiUrl("/api/output-subprocesses");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? { ...form, stateOutput: Number(form.stateOutput) }
          : {
              idDlkSubprocess: subprocessId,
              ...form,
              stateOutput: Number(form.stateOutput),
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

  const title = mode === "create" ? "Crear Output" : mode === "edit" ? "Actualizar Output" : "Detalle de Output";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configuración &gt; Cadena de Producción &gt; Sub Proceso &gt; Output</DialogDescription>
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
              value={form.codOutputSubprocess}
              onChange={(e) => handleChange("codOutputSubprocess", e.target.value)}
              placeholder="OUT-SUB-PRO-COM-EST-MKT"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Output:</Label>
            <Input
              className="col-span-3"
              value={form.nameOutputSubprocess}
              onChange={(e) => handleChange("nameOutputSubprocess", e.target.value)}
              placeholder="Estudio de Mercado"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <Input
              className="col-span-3"
              value={form.descriptionOutputSubprocess}
              onChange={(e) => handleChange("descriptionOutputSubprocess", e.target.value)}
              placeholder="Estudio de mercado del producto."
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo:</Label>
            <div className="col-span-3">
              <Select value={form.typeOutputSubprocess} onValueChange={(v) => handleChange("typeOutputSubprocess", v)} disabled={readOnly}>
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
            <Label className="text-right text-primary font-semibold">Destino:</Label>
            <Input
              className="col-span-3"
              value={form.destinationOutputSubprocess}
              onChange={(e) => handleChange("destinationOutputSubprocess", e.target.value)}
              placeholder="UDP"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Cantidad:</Label>
            <Input
              className="col-span-3"
              value={form.amountOutputSubprocess}
              onChange={(e) => handleChange("amountOutputSubprocess", e.target.value)}
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
            <Label className="text-right text-primary font-semibold">Estado de la Salida:</Label>
            <div className="col-span-3">
              <Select value={form.stateOutputSubprocess} onValueChange={(v) => handleChange("stateOutputSubprocess", v)} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_ESTADO_SALIDA).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Certificación:</Label>
            <Input
              className="col-span-3"
              value={form.certificationOutputSubprocess}
              onChange={(e) => handleChange("certificationOutputSubprocess", e.target.value)}
              placeholder="Interna"
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Observación:</Label>
            <Input
              className="col-span-3"
              value={form.observationOutputSubprocess}
              onChange={(e) => handleChange("observationOutputSubprocess", e.target.value)}
              placeholder="Ninguna"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                <Select
                  value={String(form.stateOutput)}
                  onValueChange={(v) => handleChange("stateOutput", Number(v))}
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
