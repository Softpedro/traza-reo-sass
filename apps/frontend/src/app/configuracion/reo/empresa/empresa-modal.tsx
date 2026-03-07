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
import type { ParentCompany } from "./columns";

const CATEGORIAS: Record<number, string> = {
  1: "Textil",
  2: "Alimentos",
  3: "Farmacéutico",
  4: "Tecnología",
};

type ModalMode = "create" | "edit" | "view";

interface EmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  empresa?: ParentCompany | null;
  onSuccess: () => void;
}

const emptyForm = {
  nameParentCompany: "",
  categoryParentCompany: 0,
  numRucParentCompany: "",
  codGlnParentCompany: "",
  codUbigeoParentCompany: "",
  addressParentCompany: "",
  locationParentCompany: "",
  emailParentCompany: "",
  cellularParentCompany: "",
  webParentCompany: "",
  logoParentCompany: "",
};

export function EmpresaModal({
  open,
  onOpenChange,
  mode,
  empresa,
  onSuccess,
}: EmpresaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const readOnly = mode === "view";

  useEffect(() => {
    if (empresa && (mode === "edit" || mode === "view")) {
      setForm({
        nameParentCompany: empresa.nameParentCompany,
        categoryParentCompany: empresa.categoryParentCompany,
        numRucParentCompany: empresa.numRucParentCompany,
        codGlnParentCompany: empresa.codGlnParentCompany,
        codUbigeoParentCompany: empresa.codUbigeoParentCompany,
        addressParentCompany: empresa.addressParentCompany,
        locationParentCompany: empresa.locationParentCompany,
        emailParentCompany: empresa.emailParentCompany,
        cellularParentCompany: empresa.cellularParentCompany,
        webParentCompany: empresa.webParentCompany,
        logoParentCompany: "",
      });
      setLogoPreview(null);
    } else {
      setForm(emptyForm);
      setLogoPreview(null);
    }
  }, [empresa, mode, open]);

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
      setForm((prev) => ({ ...prev, logoParentCompany: base64 }));
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.nameParentCompany.trim()) {
      alert("La razón social es obligatoria");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/parent-companies/${empresa!.idDlkParentCompany}`)
          : apiUrl("/api/parent-companies");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = { ...form };
      if (!payload.logoParentCompany) {
        delete (payload as Record<string, unknown>).logoParentCompany;
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
      alert(err instanceof Error ? err.message : "Error al guardar la empresa");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Empresa"
      : mode === "edit"
        ? "Editar Empresa"
        : "Detalle de Empresa";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar una nueva empresa."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información de la empresa."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && empresa && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{empresa.codParentCompany}</span>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Razón Social:</Label>
            <Input
              className="col-span-3"
              value={form.nameParentCompany}
              onChange={(e) => handleChange("nameParentCompany", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Categoría:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  value={CATEGORIAS[form.categoryParentCompany] ?? String(form.categoryParentCompany)}
                  readOnly
                />
              ) : (
                <Select
                  value={String(form.categoryParentCompany)}
                  onValueChange={(v) => handleChange("categoryParentCompany", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIAS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">RUC:</Label>
            <Input
              className="col-span-3"
              value={form.numRucParentCompany}
              onChange={(e) => handleChange("numRucParentCompany", e.target.value)}
              readOnly={readOnly}
              maxLength={11}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">GLN:</Label>
            <Input
              className="col-span-3"
              value={form.codGlnParentCompany}
              onChange={(e) => handleChange("codGlnParentCompany", e.target.value)}
              readOnly={readOnly}
              maxLength={13}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Ubigeo:</Label>
            <Input
              className="col-span-3"
              value={form.codUbigeoParentCompany}
              onChange={(e) => handleChange("codUbigeoParentCompany", e.target.value)}
              readOnly={readOnly}
              maxLength={6}
              placeholder="Código ubigeo"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Dirección:</Label>
            <Input
              className="col-span-3"
              value={form.addressParentCompany}
              onChange={(e) => handleChange("addressParentCompany", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.locationParentCompany}
              onChange={(e) => handleChange("locationParentCompany", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailParentCompany}
              onChange={(e) => handleChange("emailParentCompany", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularParentCompany}
              onChange={(e) => handleChange("cellularParentCompany", e.target.value)}
              readOnly={readOnly}
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Web:</Label>
            <Input
              className="col-span-3"
              value={form.webParentCompany}
              onChange={(e) => handleChange("webParentCompany", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Logo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <span className="text-sm text-muted-foreground">
                  {empresa?.logoParentCompany ? "Archivo cargado" : "Sin logo"}
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

          {mode === "view" && empresa && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <span className={`col-span-3 font-medium ${empresa.stateParentCompany === 1 ? "text-green-600" : "text-red-600"}`}>
                {empresa.stateParentCompany === 1 ? "On" : "Off"}
              </span>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex justify-center pt-2">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving
                ? "Guardando..."
                : mode === "create"
                  ? "Crear"
                  : "Actualizar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
