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
} from "@fullstack-reo/ui";
import { UbigeoSelector } from "@/components/ubigeo-selector";
import { apiUrl } from "@/lib/api";
import type { Maquila } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface MaquilaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  maquila?: Maquila | null;
  onSuccess: () => void;
}

type UbigeoOption = {
  codUbigeo: number;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
};

const emptyForm = {
  nameMaquila: "",
  numRucMaquila: "",
  codGlnMaquila: "",
  codUbigeo: 0,
  addressMaquila: "",
  gpsLocationMaquila: "",
  emailMaquila: "",
  cellularMaquila: "",
  webMaquila: "",
  logoMaquila: "",
};

export function MaquilaModal({
  open,
  onOpenChange,
  mode,
  maquila,
  onSuccess,
}: MaquilaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/ubigeo?limit=500"))
      .then((res) => res.json())
      .then((data: UbigeoOption[]) => setUbigeos(data))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (maquila && (mode === "edit" || mode === "view")) {
      setForm({
        nameMaquila: maquila.nameMaquila,
        numRucMaquila: maquila.numRucMaquila,
        codGlnMaquila: maquila.codGlnMaquila ?? "",
        codUbigeo: 0, // se ajusta al cargar detalle completo si hace falta
        addressMaquila: "",
        gpsLocationMaquila: "",
        emailMaquila: "",
        cellularMaquila: "",
        webMaquila: "",
        logoMaquila: "",
      });
      setLogoPreview(null);
    } else {
      setForm(emptyForm);
      setLogoPreview(null);
    }
  }, [maquila, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      setForm((prev) => ({ ...prev, logoMaquila: base64 }));
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.nameMaquila.trim()) {
      alert("La razón social de la maquila es obligatoria");
      return;
    }
    if (!form.numRucMaquila.trim()) {
      alert("El RUC es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/maquilas/${maquila!.idDlkMaquila}`)
          : apiUrl("/api/maquilas");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        ...form,
        codUbigeo: form.codUbigeo || undefined,
      };
      if (!payload.logoMaquila) {
        delete (payload as Record<string, unknown>).logoMaquila;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.type === "DB_CONNECTION") {
          throw new Error("Error de conexión a la base de datos. Verifica que el servidor de BD esté activo.");
        }
        if (body?.type === "VALIDATION") {
          throw new Error(body.error);
        }
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar la maquila");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Maquila"
      : mode === "edit"
        ? "Editar Maquila"
        : "Detalle de Maquila";

  const selectedUbigeo = ubigeos.find((u) => u.codUbigeo === form.codUbigeo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar una nueva maquila."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información de la maquila."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && maquila && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{maquila.codMaquila}</span>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Maquila:</Label>
            <Input
              className="col-span-3"
              value={form.nameMaquila}
              onChange={(e) => handleChange("nameMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">RUC:</Label>
            <Input
              className="col-span-3"
              value={form.numRucMaquila}
              onChange={(e) => handleChange("numRucMaquila", e.target.value)}
              readOnly={readOnly}
              maxLength={11}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">GLN:</Label>
            <Input
              className="col-span-3"
              value={form.codGlnMaquila}
              onChange={(e) => handleChange("codGlnMaquila", e.target.value)}
              readOnly={readOnly}
              maxLength={13}
            />
          </div>

          <UbigeoSelector
            label="Ubigeo"
            value={form.codUbigeo}
            onChange={(cod) => handleChange("codUbigeo", cod)}
            ubigeos={ubigeos}
            readOnly={readOnly}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Dirección:</Label>
            <Input
              className="col-span-3"
              value={form.addressMaquila}
              onChange={(e) => handleChange("addressMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.gpsLocationMaquila}
              onChange={(e) => handleChange("gpsLocationMaquila", e.target.value)}
              readOnly={readOnly}
              placeholder="Latitud, Longitud"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailMaquila}
              onChange={(e) => handleChange("emailMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularMaquila}
              onChange={(e) => handleChange("cellularMaquila", e.target.value)}
              readOnly={readOnly}
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Web:</Label>
            <Input
              className="col-span-3"
              value={form.webMaquila}
              onChange={(e) => handleChange("webMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Logo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <span className="text-sm text-muted-foreground">
                  {maquila ? "Archivo cargado" : "Sin logo"}
                </span>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Vista previa"
                      className="h-16 w-16 rounded object-contain border"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {mode === "view" && maquila && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <span
                className={`col-span-3 font-medium ${
                  maquila.stateMaquila === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {maquila.stateMaquila === 1 ? "On" : "Off"}
              </span>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex justify-center pt-2">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

