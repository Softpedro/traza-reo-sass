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
import type { Avios } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface AviosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  avios?: Avios | null;
  onSuccess: () => void;
}

type SupplierOption = {
  idDlkSupplier: number;
  codSupplier: string;
  nameSupplier: string;
};

const emptyForm = {
  idDlkSupplier: 0,
  nameAvios: "",
  desAvios: "",
  obsAvios: "",
  stateAvios: 1,
};

export function AviosModal({ open, onOpenChange, mode, avios, onSuccess }: AviosModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [detailAvios, setDetailAvios] = useState<Avios | null>(null);
  const [proveedores, setProveedores] = useState<SupplierOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/suppliers"))
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          if (!res.ok) console.error("Error al cargar proveedores:", data);
          setProveedores([]);
          return;
        }
        setProveedores(
          (data as SupplierOption[]).map((s) => ({
            idDlkSupplier: s.idDlkSupplier,
            codSupplier: s.codSupplier,
            nameSupplier: s.nameSupplier,
          }))
        );
      })
      .catch((err) => {
        console.error("Error al cargar proveedores:", err);
        setProveedores([]);
      });
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDetailAvios(null);
      return;
    }

    if (mode === "create") {
      setForm(emptyForm);
      setDetailAvios(null);
      return;
    }

    if (!avios?.idDlkAvios) return;

    function rowToForm(a: Avios) {
      const active = (a.flgStatutActif ?? a.stateAvios) === 1;
      return {
        idDlkSupplier: a.supplier?.idDlkSupplier ?? a.idDlkSupplier ?? 0,
        nameAvios: a.nameAvios ?? "",
        desAvios: a.desAvios ?? "",
        obsAvios: a.obsAvios ?? "",
        stateAvios: active ? 1 : 0,
      };
    }

    setForm(rowToForm(avios));
    setDetailAvios(null);

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl(`/api/avios/${avios.idDlkAvios}`));
        if (!res.ok) return;
        const detail = (await res.json()) as Avios;
        if (cancelled) return;
        setForm(rowToForm(detail));
        setDetailAvios(detail);
      } catch {
        if (!cancelled) setDetailAvios(avios);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode, avios]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleProveedorChange(idStr: string) {
    const id = Number(idStr);
    setForm((prev) => ({
      ...prev,
      idDlkSupplier: id,
    }));
  }

  async function handleSubmit() {
    if (!form.idDlkSupplier) {
      alert("Debes seleccionar el proveedor");
      return;
    }
    if (!form.nameAvios.trim()) {
      alert("El nombre del avío es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit" ? apiUrl(`/api/avios/${avios!.idDlkAvios}`) : apiUrl("/api/avios");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        idDlkSupplier: Number(form.idDlkSupplier),
        nameAvios: form.nameAvios.trim(),
        desAvios: form.desAvios.trim() || null,
        obsAvios: form.obsAvios.trim() || null,
      };

      if (mode === "edit") {
        payload.stateAvios = Number(form.stateAvios);
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.type === "DB_CONNECTION") {
          throw new Error("Error de conexión a la base de datos.");
        }
        if (body?.type === "VALIDATION") {
          throw new Error(body.error);
        }
        if (body?.type === "MISSING_TABLE" && typeof body.error === "string") {
          throw new Error(body.error);
        }
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar el avío");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear avío"
      : mode === "edit"
        ? `Actualizar — ${detailAvios?.codAvios ?? avios?.codAvios ?? ""}`
        : `Detalle — ${avios?.codAvios ?? ""}`;

  const selectedProv = proveedores.find((p) => p.idDlkSupplier === form.idDlkSupplier);

  const codigoDisplay =
    mode === "create"
      ? "Se asignará al guardar"
      : (detailAvios?.codAvios ?? avios?.codAvios ?? "—");

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Registra un avío vinculado a un proveedor."
              : mode === "edit"
                ? "Modifica los datos del avío."
                : "Información del avío."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            {readOnly && avios ? (
              <span className="col-span-3">{avios.codAvios}</span>
            ) : (
              <Input className="col-span-3" readOnly value={codigoDisplay} />
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Proveedor:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    selectedProv
                      ? `${selectedProv.codSupplier} — ${selectedProv.nameSupplier}`
                      : avios?.supplier
                        ? `${avios.supplier.codSupplier} — ${avios.supplier.nameSupplier}`
                        : ""
                  }
                />
              ) : (
                <Select
                  value={form.idDlkSupplier ? String(form.idDlkSupplier) : ""}
                  onValueChange={handleProveedorChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((p) => (
                      <SelectItem key={p.idDlkSupplier} value={String(p.idDlkSupplier)}>
                        {p.codSupplier} — {p.nameSupplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Avío:</Label>
            <Input
              className="col-span-3"
              value={form.nameAvios}
              onChange={(e) => handleChange("nameAvios", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Descripción:</Label>
            <div className="col-span-3">
              <textarea
                className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                value={form.desAvios}
                onChange={(e) => handleChange("desAvios", e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Observación:</Label>
            <div className="col-span-3">
              <textarea
                className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                value={form.obsAvios}
                onChange={(e) => handleChange("obsAvios", e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                {readOnly ? (
                  <span
                    className={`font-medium ${form.stateAvios === 1 ? "text-green-600" : "text-red-600"}`}
                  >
                    {form.stateAvios === 1 ? "Activo" : "Inactivo"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateAvios)}
                    onValueChange={(v) => handleChange("stateAvios", Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="0">Inactivo</SelectItem>
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
