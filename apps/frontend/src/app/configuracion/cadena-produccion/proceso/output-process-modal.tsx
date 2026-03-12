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

// OBS Output: Tipo, Unidad, Estado de la Salida
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
  "5": "Orden",
};
const OBS_ESTADO_SALIDA: Record<string, string> = {
  A: "Aprobado",
  P: "Pendiente",
  R: "Reprogramado",
};

export type OutputProcessRow = {
  idDlkOutputProcess: number;
  idDlkProcess: number;
  codOutputProcess: string;
  nameOutputProcess: string;
  descriptionOutputProcess: string;
  typeOutputProcess: string;
  destinationOutputProcess: string;
  amountOutputProcess: string;
  unitQuantity: string;
  stateOutputProcess: string;
  certificationOutputProcess: string | null;
  observationOutputProcess: string | null;
  stateOutput: number;
  process?: { idDlkProcess: number; codProcess: string; nameProcess: string };
};

type ModalMode = "create" | "edit" | "view";

interface OutputProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  process: ProcessRow | null;
  output: OutputProcessRow | null;
  onSuccess: () => void;
}

const emptyForm = {
  codOutputProcess: "",
  nameOutputProcess: "",
  descriptionOutputProcess: "",
  typeOutputProcess: "2",
  destinationOutputProcess: "",
  amountOutputProcess: "",
  unitQuantity: "5",
  stateOutputProcess: "A",
  certificationOutputProcess: "",
  observationOutputProcess: "",
  stateOutput: 1,
};

export function OutputProcessModal({
  open,
  onOpenChange,
  mode,
  process,
  output,
  onSuccess,
}: OutputProcessModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  const processLabel = process
    ? `${process.codProcess} - ${process.nameProcess}`
    : output?.process
      ? `${output.process.codProcess} - ${output.process.nameProcess}`
      : "";

  useEffect(() => {
    if (output && (mode === "edit" || mode === "view")) {
      setForm({
        codOutputProcess: output.codOutputProcess ?? "",
        nameOutputProcess: output.nameOutputProcess ?? "",
        descriptionOutputProcess: output.descriptionOutputProcess ?? "",
        typeOutputProcess: output.typeOutputProcess || "2",
        destinationOutputProcess: output.destinationOutputProcess ?? "",
        amountOutputProcess: output.amountOutputProcess ?? "",
        unitQuantity: output.unitQuantity || "5",
        stateOutputProcess: output.stateOutputProcess || "A",
        certificationOutputProcess: output.certificationOutputProcess ?? "",
        observationOutputProcess: output.observationOutputProcess ?? "",
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
    const processId = process?.idDlkProcess ?? output?.idDlkProcess;
    if (!processId) {
      alert("No se ha seleccionado un proceso");
      return;
    }
    if (!form.nameOutputProcess.trim()) {
      alert("El nombre del output es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/output-processes/${output!.idDlkOutputProcess}`)
          : apiUrl("/api/output-processes");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload =
        mode === "edit"
          ? {
              codOutputProcess: form.codOutputProcess,
              nameOutputProcess: form.nameOutputProcess,
              descriptionOutputProcess: form.descriptionOutputProcess,
              typeOutputProcess: form.typeOutputProcess,
              destinationOutputProcess: form.destinationOutputProcess,
              amountOutputProcess: form.amountOutputProcess,
              unitQuantity: form.unitQuantity,
              stateOutputProcess: form.stateOutputProcess,
              certificationOutputProcess: form.certificationOutputProcess || null,
              observationOutputProcess: form.observationOutputProcess || null,
              stateOutput: Number(form.stateOutput),
            }
          : {
              idDlkProcess: processId,
              codOutputProcess: form.codOutputProcess,
              nameOutputProcess: form.nameOutputProcess,
              descriptionOutputProcess: form.descriptionOutputProcess,
              typeOutputProcess: form.typeOutputProcess,
              destinationOutputProcess: form.destinationOutputProcess,
              amountOutputProcess: form.amountOutputProcess,
              unitQuantity: form.unitQuantity,
              stateOutputProcess: form.stateOutputProcess,
              certificationOutputProcess: form.certificationOutputProcess || null,
              observationOutputProcess: form.observationOutputProcess || null,
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

  const title =
    mode === "create"
      ? "Crear Output"
      : mode === "edit"
        ? "Actualizar Output"
        : "Detalle de Output";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configuración &gt; Cadena de Producción &gt; Proceso &gt; Output
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
              value={form.codOutputProcess}
              onChange={(e) => handleChange("codOutputProcess", e.target.value)}
              placeholder="ej. OUT-PRO-OP"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Output:</Label>
            <Input
              className="col-span-3"
              value={form.nameOutputProcess}
              onChange={(e) => handleChange("nameOutputProcess", e.target.value)}
              placeholder="ej. Orden de pedido"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <Input
              className="col-span-3"
              value={form.descriptionOutputProcess}
              onChange={(e) => handleChange("descriptionOutputProcess", e.target.value)}
              placeholder="ej. Pasar la orden de Pedido del cliente al formato estandarizado."
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo:</Label>
            <div className="col-span-3">
              <Select
                value={form.typeOutputProcess}
                onValueChange={(v) => handleChange("typeOutputProcess", v)}
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
            <Label className="text-right text-primary font-semibold">Destino:</Label>
            <Input
              className="col-span-3"
              value={form.destinationOutputProcess}
              onChange={(e) => handleChange("destinationOutputProcess", e.target.value)}
              placeholder="ej. UDP"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Cantidad:</Label>
            <Input
              className="col-span-3"
              value={form.amountOutputProcess}
              onChange={(e) => handleChange("amountOutputProcess", e.target.value)}
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
            <Label className="text-right text-primary font-semibold">Estado de la Salida:</Label>
            <div className="col-span-3">
              <Select
                value={form.stateOutputProcess}
                onValueChange={(v) => handleChange("stateOutputProcess", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_ESTADO_SALIDA).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {k} - {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Certificación:</Label>
            <Input
              className="col-span-3"
              value={form.certificationOutputProcess}
              onChange={(e) => handleChange("certificationOutputProcess", e.target.value)}
              placeholder="ej. Interna"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Observación:</Label>
            <Input
              className="col-span-3"
              value={form.observationOutputProcess}
              onChange={(e) => handleChange("observationOutputProcess", e.target.value)}
              placeholder="ej. Ninguna"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Estado:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.stateOutput)}
                onValueChange={(v) => handleChange("stateOutput", Number(v))}
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
