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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { apiFetch } from "@/lib/api-fetch";
import { ESTADO_OPTIONS, TIPO_OPTIONS, type DigitalIdentifier } from "./types";

type ModalMode = "create" | "edit" | "view";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  identifier?: DigitalIdentifier | null;
  onSuccess: () => void;
}

type FormState = {
  typeDigitalIdentifier: string;
  materialDigitalIdentifier: string;
  locationDigitalIdentifier: string;
  standardIsoDigitalIdentifier: string;
  stateDigitalIdentifier: number;
};

const emptyForm: FormState = {
  typeDigitalIdentifier: "QR",
  materialDigitalIdentifier: "",
  locationDigitalIdentifier: "",
  standardIsoDigitalIdentifier: "",
  stateDigitalIdentifier: 1,
};

function rowToForm(d: DigitalIdentifier): FormState {
  return {
    typeDigitalIdentifier: d.typeDigitalIdentifier ?? "QR",
    materialDigitalIdentifier: d.materialDigitalIdentifier ?? "",
    locationDigitalIdentifier: d.locationDigitalIdentifier ?? "",
    standardIsoDigitalIdentifier: d.standardIsoDigitalIdentifier ?? "",
    stateDigitalIdentifier: d.stateDigitalIdentifier === 0 ? 0 : 1,
  };
}

function toText(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const { label, value, onChange, readOnly, placeholder } = props;
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <Label className="text-right text-xs font-semibold text-primary">{label}</Label>
      <Input
        className="col-span-2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}

export function IdentificadorDigitalFormModal({
  open,
  onOpenChange,
  mode,
  identifier,
  onSuccess,
}: FormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setForm(emptyForm);
      return;
    }
    if (identifier) setForm(rowToForm(identifier));
  }, [open, mode, identifier]);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/digital-identifiers/${identifier!.idDlkDigitalIdentifier}`)
          : apiUrl("/api/digital-identifiers");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        typeDigitalIdentifier: toText(form.typeDigitalIdentifier),
        materialDigitalIdentifier: toText(form.materialDigitalIdentifier),
        locationDigitalIdentifier: toText(form.locationDigitalIdentifier),
        standardIsoDigitalIdentifier: toText(form.standardIsoDigitalIdentifier),
      };
      if (mode === "edit") {
        payload.stateDigitalIdentifier = Number(form.stateDigitalIdentifier);
      }

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.type === "DB_CONNECTION") {
          throw new Error("Error de conexión a la base de datos.");
        }
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar el identificador digital");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear identificador digital"
      : mode === "edit"
        ? `Actualizar — ${identifier?.codDigitalIdentifier ?? ""}`
        : `Detalle — ${identifier?.codDigitalIdentifier ?? ""}`;

  const idDisplay =
    mode === "create"
      ? "Se asignará al guardar"
      : String(identifier?.idDlkDigitalIdentifier ?? "—");
  const codDisplay =
    mode === "create" ? "Se asignará al guardar" : (identifier?.codDigitalIdentifier ?? "—");

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Registra un identificador digital en el catálogo."
              : mode === "edit"
                ? "Modifica los datos del identificador digital."
                : "Información del identificador digital."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label className="text-right text-xs font-semibold text-primary">ID Identificador</Label>
            <Input className="col-span-2" readOnly value={idDisplay} />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label className="text-right text-xs font-semibold text-primary">Código</Label>
            <Input className="col-span-2" readOnly value={codDisplay} />
          </div>

          <div className="grid grid-cols-3 items-center gap-3">
            <Label className="text-right text-xs font-semibold text-primary">Tipo</Label>
            <div className="col-span-2">
              {readOnly ? (
                <Input readOnly value={form.typeDigitalIdentifier} />
              ) : (
                <Select
                  value={form.typeDigitalIdentifier}
                  onValueChange={(v) => set("typeDigitalIdentifier", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPO_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Field
            label="Material"
            value={form.materialDigitalIdentifier}
            onChange={(v) => set("materialDigitalIdentifier", v)}
            readOnly={readOnly}
            placeholder="p.ej. Polyester"
          />
          <Field
            label="Ubicación"
            value={form.locationDigitalIdentifier}
            onChange={(v) => set("locationDigitalIdentifier", v)}
            readOnly={readOnly}
            placeholder="p.ej. Cuello trasero"
          />
          <Field
            label="Estándar ISO"
            value={form.standardIsoDigitalIdentifier}
            onChange={(v) => set("standardIsoDigitalIdentifier", v)}
            readOnly={readOnly}
            placeholder="p.ej. ISO/IEC 15459-1:2014"
          />

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-3 items-center gap-3">
              <Label className="text-right text-xs font-semibold text-primary">Estado</Label>
              <div className="col-span-2">
                {readOnly ? (
                  <span
                    className={`font-medium ${
                      form.stateDigitalIdentifier === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {form.stateDigitalIdentifier === 1 ? "Activo" : "Inactivo"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateDigitalIdentifier)}
                    onValueChange={(v) => set("stateDigitalIdentifier", Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={String(o.value)}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
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
