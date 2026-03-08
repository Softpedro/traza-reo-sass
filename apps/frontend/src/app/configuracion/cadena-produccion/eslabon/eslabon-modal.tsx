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
import type { Eslabon } from "./columns";
import {
  OBS_CATEGORIA,
  OBS_SECUENCIA,
  OBS_TRAZABILIDAD,
  OBS_ESTADO,
} from "./obs";

type ModalMode = "create" | "edit" | "view";

interface EslabonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  eslabon: Eslabon | null;
  onSuccess: () => void;
}

const emptyForm = {
  codProductionChain: "",
  nameProductionChain: "",
  codCategoryProductionChain: 1,
  numPrecedenciaProductiva: 1,
  numPrecedenciaTrazabilidad: 1,
  desProductionChain: "",
  stateProductionChain: 1,
};

export function EslabonModal({
  open,
  onOpenChange,
  mode,
  eslabon,
  onSuccess,
}: EslabonModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (eslabon && (mode === "edit" || mode === "view")) {
      setForm({
        codProductionChain: eslabon.codProductionChain,
        nameProductionChain: eslabon.nameProductionChain,
        codCategoryProductionChain: eslabon.codCategoryProductionChain,
        numPrecedenciaProductiva: eslabon.numPrecedenciaProductiva,
        numPrecedenciaTrazabilidad: eslabon.numPrecedenciaTrazabilidad,
        desProductionChain: eslabon.desProductionChain ?? "",
        stateProductionChain: eslabon.stateProductionChain,
      });
    } else if (mode === "create") {
      setForm(emptyForm);
    }
  }, [eslabon, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.nameProductionChain.trim()) {
      alert("El nombre del eslabón es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/production-chains/${eslabon!.idDlkProductionChain}`)
          : apiUrl("/api/production-chains");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        codProductionChain: form.codProductionChain || undefined,
        nameProductionChain: form.nameProductionChain,
        codCategoryProductionChain: Number(form.codCategoryProductionChain),
        numPrecedenciaProductiva: Number(form.numPrecedenciaProductiva),
        numPrecedenciaTrazabilidad: Number(form.numPrecedenciaTrazabilidad),
        desProductionChain: form.desProductionChain,
        stateProductionChain: Number(form.stateProductionChain),
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
      alert(err instanceof Error ? err.message : "Error al guardar el eslabón");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Eslabón"
      : mode === "edit"
        ? "Actualizar Eslabón"
        : "Detalle de Eslabón";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar un nuevo eslabón."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información del eslabón."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            <Input
              className="col-span-3"
              value={form.codProductionChain}
              onChange={(e) => handleChange("codProductionChain", e.target.value)}
              placeholder="ej. CP-1"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Eslabón:</Label>
            <Input
              className="col-span-3"
              value={form.nameProductionChain}
              onChange={(e) => handleChange("nameProductionChain", e.target.value)}
              placeholder="ej. Cultivo del Algodón"
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Categoria:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.codCategoryProductionChain)}
                onValueChange={(v) => handleChange("codCategoryProductionChain", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_CATEGORIA).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Secuencia:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.numPrecedenciaProductiva)}
                onValueChange={(v) => handleChange("numPrecedenciaProductiva", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_SECUENCIA).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {k} - {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Trazabilidad:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.numPrecedenciaTrazabilidad)}
                onValueChange={(v) => handleChange("numPrecedenciaTrazabilidad", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_TRAZABILIDAD).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <textarea
              className="col-span-3 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.desProductionChain}
              onChange={(e) => handleChange("desProductionChain", e.target.value)}
              placeholder="Descripción del eslabón..."
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Estado:</Label>
            <div className="col-span-3">
              <Select
                value={String(form.stateProductionChain)}
                onValueChange={(v) => handleChange("stateProductionChain", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OBS_ESTADO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
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
