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
import { UbigeoSelector } from "@/components/ubigeo-selector";
import { apiUrl } from "@/lib/api";
import type { Brand } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface MarcaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  marca?: Brand | null;
  onSuccess: () => void;
}

type ParentCompanyOption = {
  idDlkParentCompany: number;
  codParentCompany: string;
  nameParentCompany: string;
};

type UbigeoOption = {
  codUbigeo: number;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
};

const emptyForm = {
  idDlkParentCompany: 0,
  codParentCompany: "",
  nameBrand: "",
  desBrand: "",
  codUbigeoBrand: 0,
  addressBrand: "",
  locationBrand: "",
  emailBrand: "",
  cellularBrand: "",
  facebookBrand: "",
  instagramBrand: "",
  whatsappBrand: "",
  ecommerceBrand: "",
  logoBrand: "",
};

export function MarcaModal({
  open,
  onOpenChange,
  mode,
  marca,
  onSuccess,
}: MarcaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));

    fetch(apiUrl("/api/ubigeo?limit=500"))
      .then((res) => res.json())
      .then((data: UbigeoOption[]) => setUbigeos(data))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (marca && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkParentCompany: marca.parentCompany?.idDlkParentCompany ?? 0,
        codParentCompany: marca.parentCompany?.codParentCompany ?? "",
        nameBrand: marca.nameBrand,
        desBrand: marca.desBrand ?? "",
        codUbigeoBrand: 0,
        addressBrand: "",
        locationBrand: "",
        emailBrand: marca.emailBrand,
        cellularBrand: "",
        facebookBrand: "",
        instagramBrand: "",
        whatsappBrand: "",
        ecommerceBrand: "",
        logoBrand: "",
      });
      setLogoPreview(null);
    } else {
      setForm(emptyForm);
      setLogoPreview(null);
    }
  }, [marca, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEmpresaChange(idStr: string) {
    const id = Number(idStr);
    const e = empresas.find((em) => em.idDlkParentCompany === id);
    setForm((prev) => ({
      ...prev,
      idDlkParentCompany: id,
      codParentCompany: e?.codParentCompany ?? "",
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      setForm((prev) => ({ ...prev, logoBrand: base64 }));
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.idDlkParentCompany || !form.codParentCompany) {
      alert("Debes seleccionar la empresa");
      return;
    }
    if (!form.nameBrand.trim()) {
      alert("El nombre de la marca es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/brands/${marca!.idDlkBrand}`)
          : apiUrl("/api/brands");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        ...form,
        codUbigeoBrand: form.codUbigeoBrand || undefined,
      };
      if (!payload.logoBrand) {
        delete (payload as Record<string, unknown>).logoBrand;
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
      alert(err instanceof Error ? err.message : "Error al guardar la marca");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Marca"
      : mode === "edit"
        ? "Editar Marca"
        : "Detalle de Marca";

  const selectedEmpresa = empresas.find((e) => e.idDlkParentCompany === form.idDlkParentCompany);
  const selectedUbigeo = ubigeos.find((u) => u.codUbigeo === form.codUbigeoBrand);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar una nueva marca."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información de la marca."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && marca && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{marca.codBrand}</span>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Empresa:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    selectedEmpresa
                      ? `${selectedEmpresa.codParentCompany} - ${selectedEmpresa.nameParentCompany}`
                      : marca?.parentCompany
                        ? `${marca.parentCompany.codParentCompany} - ${marca.parentCompany.nameParentCompany}`
                        : ""
                  }
                />
              ) : (
                <Select
                  value={form.idDlkParentCompany ? String(form.idDlkParentCompany) : ""}
                  onValueChange={handleEmpresaChange}
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
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Marca:</Label>
            <Input
              className="col-span-3"
              value={form.nameBrand}
              onChange={(e) => handleChange("nameBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Descripción:</Label>
            <div className="col-span-3">
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={form.desBrand}
                onChange={(e) => handleChange("desBrand", e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Logo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <span className="text-sm text-muted-foreground">
                  {marca ? "Archivo cargado" : "Sin logo"}
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

          <UbigeoSelector
            label="Ubigeo"
            value={form.codUbigeoBrand}
            onChange={(cod) => handleChange("codUbigeoBrand", cod)}
            ubigeos={ubigeos}
            readOnly={readOnly}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Dirección:</Label>
            <Input
              className="col-span-3"
              value={form.addressBrand}
              onChange={(e) => handleChange("addressBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.locationBrand}
              onChange={(e) => handleChange("locationBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailBrand}
              onChange={(e) => handleChange("emailBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularBrand}
              onChange={(e) => handleChange("cellularBrand", e.target.value)}
              readOnly={readOnly}
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Facebook:</Label>
            <Input
              className="col-span-3"
              value={form.facebookBrand}
              onChange={(e) => handleChange("facebookBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Instagram:</Label>
            <Input
              className="col-span-3"
              value={form.instagramBrand}
              onChange={(e) => handleChange("instagramBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Whatsapp:</Label>
            <Input
              className="col-span-3"
              value={form.whatsappBrand}
              onChange={(e) => handleChange("whatsappBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Comercio Electrónico:</Label>
            <Input
              className="col-span-3"
              value={form.ecommerceBrand}
              onChange={(e) => handleChange("ecommerceBrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          {mode === "view" && marca && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <span
                className={`col-span-3 font-medium ${
                  marca.stateBrand === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {marca.stateBrand === 1 ? "On" : "Off"}
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

