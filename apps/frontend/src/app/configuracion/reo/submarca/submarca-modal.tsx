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
import type { Subbrand } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface SubmarcaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  item?: Subbrand | null;
  onSuccess: () => void;
}

type ParentCompanyOption = {
  idDlkParentCompany: number;
  codParentCompany: string;
  nameParentCompany: string;
};

type BrandOption = {
  idDlkBrand: number;
  codBrand: string;
  nameBrand: string;
  parentCompany?: ParentCompanyOption | null;
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
  idDlkBrand: 0,
  codBrand: "",
  nameSubbrand: "",
  codUbigeoSubbrand: 0,
  addressSubbrand: "",
  locationSubbrand: "",
  emailSubbrand: "",
  cellularSubbrand: "",
  facebookSubbrand: "",
  instagramSubbrand: "",
  whatsappSubbrand: "",
  ecommerceSubbrand: "",
  logoSubbrand: "",
};

export function SubmarcaModal({
  open,
  onOpenChange,
  mode,
  item,
  onSuccess,
}: SubmarcaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));

    fetch(apiUrl("/api/brands"))
      .then((res) => res.json())
      .then((data: BrandOption[]) => setBrands(data))
      .catch((err) => console.error("Error al cargar marcas:", err));

    fetch(apiUrl("/api/ubigeo?limit=500"))
      .then((res) => res.json())
      .then((data: UbigeoOption[]) => setUbigeos(data))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (item && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkParentCompany: item.brand?.parentCompany?.idDlkParentCompany ?? 0,
        codParentCompany: item.brand?.parentCompany?.codParentCompany ?? "",
        idDlkBrand: item.brand?.idDlkBrand ?? 0,
        codBrand: item.brand?.codBrand ?? "",
        nameSubbrand: item.nameSubbrand,
        codUbigeoSubbrand: 0,
        addressSubbrand: "",
        locationSubbrand: "",
        emailSubbrand: "",
        cellularSubbrand: "",
        facebookSubbrand: "",
        instagramSubbrand: "",
        whatsappSubbrand: "",
        ecommerceSubbrand: "",
        logoSubbrand: "",
      });
      setLogoPreview(null);
    } else {
      setForm(emptyForm);
      setLogoPreview(null);
    }
  }, [item, mode, open]);

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
      // al cambiar empresa, reseteamos marca
      idDlkBrand: 0,
      codBrand: "",
    }));
  }

  function handleBrandChange(idStr: string) {
    const id = Number(idStr);
    const b = brands.find((br) => br.idDlkBrand === id);
    setForm((prev) => ({
      ...prev,
      idDlkBrand: id,
      codBrand: b?.codBrand ?? "",
      idDlkParentCompany: b?.parentCompany?.idDlkParentCompany ?? prev.idDlkParentCompany,
      codParentCompany: b?.parentCompany?.codParentCompany ?? prev.codParentCompany,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      setForm((prev) => ({ ...prev, logoSubbrand: base64 }));
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.idDlkParentCompany || !form.codParentCompany) {
      alert("Debes seleccionar la empresa");
      return;
    }
    if (!form.idDlkBrand || !form.codBrand) {
      alert("Debes seleccionar la marca");
      return;
    }
    if (!form.nameSubbrand.trim()) {
      alert("El nombre de la submarca es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/subbrands/${item!.idDlkSubbrand}`)
          : apiUrl("/api/subbrands");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        ...form,
        codUbigeoSubbrand: form.codUbigeoSubbrand || undefined,
      };
      if (!payload.logoSubbrand) {
        delete (payload as Record<string, unknown>).logoSubbrand;
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
      alert(err instanceof Error ? err.message : "Error al guardar la submarca");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Submarca"
      : mode === "edit"
        ? "Editar Submarca"
        : "Detalle de Submarca";

  const selectedEmpresa = empresas.find((e) => e.idDlkParentCompany === form.idDlkParentCompany);
  const selectedUbigeo = ubigeos.find((u) => u.codUbigeo === form.codUbigeoSubbrand);
  const filteredBrands =
    form.idDlkParentCompany
      ? brands.filter((b) => b.parentCompany?.idDlkParentCompany === form.idDlkParentCompany)
      : brands;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar una nueva submarca."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información de la submarca."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && item && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{item.codSubbrand}</span>
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
                      : item?.brand?.parentCompany
                        ? `${item.brand.parentCompany.codParentCompany} - ${item.brand.parentCompany.nameParentCompany}`
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
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    item?.brand
                      ? `${item.brand.codBrand} - ${item.brand.nameBrand}`
                      : ""
                  }
                />
              ) : (
                <Select
                  value={form.idDlkBrand ? String(form.idDlkBrand) : ""}
                  onValueChange={handleBrandChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBrands.map((b) => (
                      <SelectItem key={b.idDlkBrand} value={String(b.idDlkBrand)}>
                        {b.codBrand} - {b.nameBrand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Submarca:</Label>
            <Input
              className="col-span-3"
              value={form.nameSubbrand}
              onChange={(e) => handleChange("nameSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Logo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <span className="text-sm text-muted-foreground">
                  {item ? "Archivo cargado" : "Sin logo"}
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
            value={form.codUbigeoSubbrand}
            onChange={(cod) => handleChange("codUbigeoSubbrand", cod)}
            ubigeos={ubigeos}
            readOnly={readOnly}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Dirección:</Label>
            <Input
              className="col-span-3"
              value={form.addressSubbrand}
              onChange={(e) => handleChange("addressSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.locationSubbrand}
              onChange={(e) => handleChange("locationSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailSubbrand}
              onChange={(e) => handleChange("emailSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularSubbrand}
              onChange={(e) => handleChange("cellularSubbrand", e.target.value)}
              readOnly={readOnly}
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Facebook:</Label>
            <Input
              className="col-span-3"
              value={form.facebookSubbrand}
              onChange={(e) => handleChange("facebookSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Instagram:</Label>
            <Input
              className="col-span-3"
              value={form.instagramSubbrand}
              onChange={(e) => handleChange("instagramSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Whatsapp:</Label>
            <Input
              className="col-span-3"
              value={form.whatsappSubbrand}
              onChange={(e) => handleChange("whatsappSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Comercio Electrónico:</Label>
            <Input
              className="col-span-3"
              value={form.ecommerceSubbrand}
              onChange={(e) => handleChange("ecommerceSubbrand", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          {mode === "view" && item && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <span
                className={`col-span-3 font-medium ${
                  item.stateSubbrand === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.stateSubbrand === 1 ? "On" : "Off"}
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

