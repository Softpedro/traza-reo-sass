"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  Button,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { CareRow } from "./care-columns";

type Mode = "create" | "edit" | "view";

interface CareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  /** Modelo dueño del cuidado (requerido al crear). */
  modelId: number | null;
  care: CareRow | null;
  onSuccess: () => void;
}

const emptyForm = { nombCare: "", carDescription: "", carSafety: "", stateCare: 1 };

export function CareModal({ open, onOpenChange, mode, modelId, care, onSuccess }: CareModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    setError(null);
    setImageBase64("");
    if (mode === "create" || !care) {
      setForm(emptyForm);
      setImagePreview(null);
    } else {
      setForm({
        nombCare: care.nombCare ?? "",
        carDescription: care.carDescription ?? "",
        carSafety: care.carSafety ?? "",
        stateCare: care.stateCare === 0 ? 0 : 1,
      });
      setImagePreview(care.carImage ?? null);
    }
  }, [open, mode, care]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result.split(",")[1] ?? "");
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (mode === "create" && (!modelId || modelId <= 0)) {
      setError("Selecciona un modelo primero.");
      return;
    }
    if (!form.nombCare.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!form.carDescription.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const isEdit = mode === "edit";
      const url = isEdit ? `/api/cares/${care!.idDlkCare}` : "/api/cares";
      const method = isEdit ? "PUT" : "POST";
      const payload: Record<string, unknown> = {
        nombCare: form.nombCare,
        carDescription: form.carDescription,
        carSafety: form.carSafety || null,
        stateCare: Number(form.stateCare),
      };
      if (!isEdit) payload.idDlkModel = modelId;
      if (imageBase64) payload.carImage = imageBase64;

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error ?? `Error ${res.status} al guardar`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el cuidado");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear cuidado"
      : mode === "edit"
        ? "Actualizar cuidado"
        : "Detalle del cuidado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Cuidado de la prenda del modelo seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Código</Label>
            <Input value={care?.codCare ?? "(automático)"} readOnly disabled />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="nombCare">Nombre</Label>
            <Input
              id="nombCare"
              value={form.nombCare}
              readOnly={readOnly}
              onChange={(e) => setForm((p) => ({ ...p, nombCare: e.target.value }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="carDescription">Párrafo</Label>
            <textarea
              id="carDescription"
              className="min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={form.carDescription}
              readOnly={readOnly}
              onChange={(e) => setForm((p) => ({ ...p, carDescription: e.target.value }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="carSafety">Seguridad</Label>
            <textarea
              id="carSafety"
              className="min-h-[70px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={form.carSafety}
              readOnly={readOnly}
              onChange={(e) => setForm((p) => ({ ...p, carSafety: e.target.value }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Imagen</Label>
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="cuidado" className="h-16 w-auto object-contain" />
            )}
            {!readOnly && <Input type="file" accept="image/*" onChange={handleFile} />}
          </div>

          {mode !== "create" && (
            <div className="grid gap-1.5">
              <Label htmlFor="stateCare">Estado</Label>
              <select
                id="stateCare"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={form.stateCare}
                disabled={readOnly}
                onChange={(e) => setForm((p) => ({ ...p, stateCare: Number(e.target.value) }))}
              >
                <option value={1}>On</option>
                <option value={0}>Off</option>
              </select>
            </div>
          )}

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        {!readOnly && (
          <div className="flex justify-center pt-2">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : mode === "create" ? "Crear" : "Actualizar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
