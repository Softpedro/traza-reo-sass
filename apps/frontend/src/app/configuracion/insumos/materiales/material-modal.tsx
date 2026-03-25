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
import type { Material } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface MaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  material?: Material | null;
  onSuccess: () => void;
}

type SupplierOption = {
  idDlkSupplier: number;
  codSupplier: string;
  nameSupplier: string;
};

const emptyForm = {
  idDlkSupplier: 0,
  nameMaterial: "",
  desMaterial: "",
  obsMaterial: "",
  stateMaterial: 1,
};

export function MaterialModal({ open, onOpenChange, mode, material, onSuccess }: MaterialModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [detailMaterial, setDetailMaterial] = useState<Material | null>(null);
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
      setDetailMaterial(null);
      return;
    }

    if (mode === "create") {
      setForm(emptyForm);
      setDetailMaterial(null);
      return;
    }

    if (!material?.idDlkMaterial) return;

    function rowToForm(m: Material) {
      const active = (m.flgStatutActif ?? m.stateMaterial) === 1;
      return {
        idDlkSupplier: m.supplier?.idDlkSupplier ?? m.idDlkSupplier ?? 0,
        nameMaterial: m.nameMaterial ?? "",
        desMaterial: m.desMaterial ?? "",
        obsMaterial: m.obsMaterial ?? "",
        stateMaterial: active ? 1 : 0,
      };
    }

    setForm(rowToForm(material));
    setDetailMaterial(null);

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl(`/api/materials/${material.idDlkMaterial}`));
        if (!res.ok) return;
        const detail = (await res.json()) as Material;
        if (cancelled) return;
        setForm(rowToForm(detail));
        setDetailMaterial(detail);
      } catch {
        if (!cancelled) setDetailMaterial(material);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode, material]);

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
    if (!form.nameMaterial.trim()) {
      alert("El nombre del material es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/materials/${material!.idDlkMaterial}`)
          : apiUrl("/api/materials");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        idDlkSupplier: Number(form.idDlkSupplier),
        nameMaterial: form.nameMaterial.trim(),
        desMaterial: form.desMaterial.trim() || null,
        obsMaterial: form.obsMaterial.trim() || null,
      };

      if (mode === "edit") {
        payload.stateMaterial = Number(form.stateMaterial);
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
      alert(err instanceof Error ? err.message : "Error al guardar el material");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear material"
      : mode === "edit"
        ? `Actualizar — ${detailMaterial?.codMaterial ?? material?.codMaterial ?? ""}`
        : `Detalle — ${material?.codMaterial ?? ""}`;

  const selectedProv = proveedores.find((p) => p.idDlkSupplier === form.idDlkSupplier);

  const codigoDisplay =
    mode === "create"
      ? "Se asignará al guardar"
      : (detailMaterial?.codMaterial ?? material?.codMaterial ?? "—");

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Registra un material vinculado a un proveedor."
              : mode === "edit"
                ? "Modifica los datos del material."
                : "Información del material."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            {readOnly && material ? (
              <span className="col-span-3">{material.codMaterial}</span>
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
                      : material?.supplier
                        ? `${material.supplier.codSupplier} — ${material.supplier.nameSupplier}`
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
            <Label className="text-right text-primary font-semibold">Material:</Label>
            <Input
              className="col-span-3"
              value={form.nameMaterial}
              onChange={(e) => handleChange("nameMaterial", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Descripción:</Label>
            <div className="col-span-3">
              <textarea
                className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                value={form.desMaterial}
                onChange={(e) => handleChange("desMaterial", e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Observación:</Label>
            <div className="col-span-3">
              <textarea
                className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                value={form.obsMaterial}
                onChange={(e) => handleChange("obsMaterial", e.target.value)}
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
                    className={`font-medium ${form.stateMaterial === 1 ? "text-green-600" : "text-red-600"}`}
                  >
                    {form.stateMaterial === 1 ? "Activo" : "Inactivo"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateMaterial)}
                    onValueChange={(v) => handleChange("stateMaterial", Number(v))}
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
