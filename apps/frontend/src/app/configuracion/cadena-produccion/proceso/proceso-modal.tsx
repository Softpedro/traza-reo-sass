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
import { getTrazabilidadLabel } from "../eslabon/obs";

// OBS Proceso: Criticidad y Tercerizado
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

interface ProcesoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  process: ProcessRow | null;
  onSuccess: () => void;
}

type ParentCompanyOption = {
  idDlkParentCompany: number;
  codParentCompany: string;
  nameParentCompany: string;
};

type ProductionChainOption = {
  idDlkProductionChain: number;
  numPrecedenciaTrazabilidad: number;
  nameProductionChain: string;
};

const emptyForm = {
  idDlkParentCompany: 0,
  idDlkProductionChain: 0,
  ordenPrecedenciaProcess: 1,
  codProcess: "",
  nameProcess: "",
  desProcess: "",
  objetiveProcess: "",
  criticalityProcess: "1",
  outsourcedProcess: "1",
  estimatedTimeProcess: 0,
  responsibleUnit: "",
  responsibleProcess: "",
  stateProcess: 1,
};

export function ProcesoModal({
  open,
  onOpenChange,
  mode,
  process,
  onSuccess,
}: ProcesoModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const [cadenas, setCadenas] = useState<ProductionChainOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
    fetch(apiUrl("/api/production-chains"))
      .then((res) => res.json())
      .then((data: ProductionChainOption[]) => setCadenas(data))
      .catch((err) => console.error("Error al cargar cadenas:", err));
  }, [open]);

  useEffect(() => {
    if (process && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkParentCompany: process.parentCompany?.idDlkParentCompany ?? 0,
        idDlkProductionChain: process.productionChain.idDlkProductionChain,
        ordenPrecedenciaProcess: process.ordenPrecedenciaProcess,
        codProcess: process.codProcess ?? "",
        nameProcess: process.nameProcess,
        desProcess: process.desProcess ?? "",
        objetiveProcess: process.objetiveProcess ?? "",
        criticalityProcess: process.criticalityProcess ?? "1",
        outsourcedProcess: process.outsourcedProcess ?? "1",
        estimatedTimeProcess: process.estimatedTimeProcess ?? 0,
        responsibleUnit: process.responsibleUnit ?? "",
        responsibleProcess: process.responsibleProcess ?? "",
        stateProcess: process.stateProcess,
      });
    } else {
      setForm(emptyForm);
    }
  }, [process, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.nameProcess.trim()) {
      alert("El nombre del proceso es obligatorio");
      return;
    }
    if (!form.idDlkParentCompany || !form.idDlkProductionChain) {
      alert("Debes seleccionar Empresa y Cadena de Producción");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/processes/${process!.idDlkProcess}`)
          : apiUrl("/api/processes");
      const method = mode === "edit" ? "PUT" : "POST";

      const basePayload = {
        idDlkProductionChain: Number(form.idDlkProductionChain),
        ordenPrecedenciaProcess: Number(form.ordenPrecedenciaProcess),
        codProcess: form.codProcess || undefined,
        nameProcess: form.nameProcess,
        desProcess: form.desProcess,
        objetiveProcess: form.objetiveProcess,
        criticalityProcess: form.criticalityProcess,
        outsourcedProcess: form.outsourcedProcess,
        estimatedTimeProcess: Number(form.estimatedTimeProcess),
        responsibleUnit: form.responsibleUnit,
        responsibleProcess: form.responsibleProcess,
        stateProcess: Number(form.stateProcess),
      };
      const payload =
        mode === "edit"
          ? basePayload
          : {
              idDlkParentCompany: Number(form.idDlkParentCompany),
              ...basePayload,
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
      alert(err instanceof Error ? err.message : "Error al guardar el proceso");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Proceso"
      : mode === "edit"
        ? "Editar Proceso"
        : "Detalle de Proceso";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar un nuevo proceso."
              : mode === "edit"
                ? "Modifica los campos que necesites."
                : "Información del proceso."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Empresa:</Label>
            <div className="col-span-3">
              <Select
                value={form.idDlkParentCompany ? String(form.idDlkParentCompany) : ""}
                onValueChange={(v) => handleChange("idDlkParentCompany", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((e) => (
                    <SelectItem key={e.idDlkParentCompany} value={String(e.idDlkParentCompany)}>
                      {e.codParentCompany} - {e.nameParentCompany}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Eslabón:</Label>
            <div className="col-span-3">
              <Select
                value={form.idDlkProductionChain ? String(form.idDlkProductionChain) : ""}
                onValueChange={(v) => handleChange("idDlkProductionChain", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar eslabón" />
                </SelectTrigger>
                <SelectContent>
                  {cadenas.map((c) => {
                    const label = getTrazabilidadLabel(c.numPrecedenciaTrazabilidad).split(" ")[0] + " - " + c.nameProductionChain;
                    return (
                      <SelectItem key={c.idDlkProductionChain} value={String(c.idDlkProductionChain)}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codProcess}
              onChange={(e) => handleChange("codProcess", e.target.value)}
              placeholder="ej. COM, UDP"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proceso:</Label>
            <Input
              className="col-span-3"
              value={form.nameProcess}
              onChange={(e) => handleChange("nameProcess", e.target.value)}
              placeholder="ej. Gestión comercial y generación de órdenes de pedido"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Secuencia:</Label>
            <Input
              type="number"
              min={1}
              className="col-span-3"
              value={form.ordenPrecedenciaProcess}
              onChange={(e) => handleChange("ordenPrecedenciaProcess", parseInt(e.target.value, 10) || 1)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <textarea
              className="col-span-3 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.desProcess}
              onChange={(e) => handleChange("desProcess", e.target.value)}
              placeholder="Contacta con cliente, recibe la OP..."
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Objetivo:</Label>
            <textarea
              className="col-span-3 min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.objetiveProcess}
              onChange={(e) => handleChange("objetiveProcess", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Criticidad:</Label>
            <div className="col-span-3">
              <Select
                value={form.criticalityProcess}
                onValueChange={(v) => handleChange("criticalityProcess", v)}
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
                value={form.outsourcedProcess}
                onValueChange={(v) => handleChange("outsourcedProcess", v)}
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
              value={form.estimatedTimeProcess || ""}
              onChange={(e) => handleChange("estimatedTimeProcess", e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
              placeholder="45"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Unidad:</Label>
            <Input
              className="col-span-3"
              value={form.responsibleUnit}
              onChange={(e) => handleChange("responsibleUnit", e.target.value)}
              placeholder="ej. UDP - Unidad de Desarrollo de Producto"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Responsable:</Label>
            <Input
              className="col-span-3"
              value={form.responsibleProcess}
              onChange={(e) => handleChange("responsibleProcess", e.target.value)}
              placeholder="ej. Nancy Marzal (Coordinación) / Dana Zavalaga (Analista)"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Estado:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.stateProcess)}
                onValueChange={(v) => handleChange("stateProcess", Number(v))}
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
