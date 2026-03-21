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

function logoSrcFromApi(logo: string | null | undefined): string | null {
  if (logo == null || logo === "") return null;
  if (logo.startsWith("data:")) return logo;
  return `data:image/png;base64,${logo}`;
}

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
  /** 1 = activa, 0 = desactivada */
  stateBrand: 1,
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
  const [detailBrand, setDetailBrand] = useState<Brand | null>(null);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));

    fetch(apiUrl("/api/ubigeo"))
      .then((res) => res.json())
      .then((data: UbigeoOption[]) => setUbigeos(data))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDetailBrand(null);
      return;
    }

    if (mode === "create") {
      setForm(emptyForm);
      setDetailBrand(null);
      setLogoPreview(null);
      return;
    }

    if (!marca?.idDlkBrand) return;

    function brandRowToForm(b: Brand) {
      const u = Number(b.codUbigeoBrand);
      return {
        idDlkParentCompany: b.parentCompany?.idDlkParentCompany ?? 0,
        codParentCompany: b.codParentCompany ?? b.parentCompany?.codParentCompany ?? "",
        nameBrand: b.nameBrand ?? "",
        desBrand: b.desBrand ?? "",
        codUbigeoBrand: Number.isFinite(u) ? u : 0,
        addressBrand: b.addressBrand ?? "",
        locationBrand: b.locationBrand ?? "",
        emailBrand: b.emailBrand ?? "",
        cellularBrand: b.cellularBrand ?? "",
        facebookBrand: b.facebookBrand ?? "",
        instagramBrand: b.instagramBrand ?? "",
        whatsappBrand: b.whatsappBrand ?? "",
        ecommerceBrand: b.ecommerceBrand ?? "",
        logoBrand: "",
        stateBrand: b.stateBrand === 1 ? 1 : 0,
      };
    }

    setLogoPreview(null);
    setForm(brandRowToForm(marca));
    setDetailBrand(null);

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl(`/api/brands/${marca.idDlkBrand}`));
        if (!res.ok) return;
        const detail = (await res.json()) as Brand;
        if (cancelled) return;
        setForm(brandRowToForm(detail));
        setDetailBrand(detail);
      } catch {
        if (!cancelled) setDetailBrand(marca);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode, marca]);

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
    if (!form.codUbigeoBrand) {
      alert("Debes seleccionar un ubigeo (departamento, provincia y distrito).");
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
        codUbigeoBrand: Number(form.codUbigeoBrand),
        idDlkParentCompany: Number(form.idDlkParentCompany),
        stateBrand: Number(form.stateBrand),
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

  const storedLogoSrc =
    mode !== "create" && (detailBrand?.logoBrand ?? marca?.logoBrand)
      ? logoSrcFromApi(detailBrand?.logoBrand ?? marca?.logoBrand)
      : null;
  const logoDisplaySrc = logoPreview ?? storedLogoSrc;

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

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Logo:</Label>
            <div className="col-span-3 space-y-3">
              {logoDisplaySrc ? (
                <img
                  src={logoDisplaySrc}
                  alt="Logo de la marca"
                  className="max-h-40 max-w-full rounded-md border bg-muted/30 object-contain p-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground">Sin logo</p>
              )}
              {!readOnly && (
                <>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                  {(mode === "edit" || mode === "create") && storedLogoSrc && !logoPreview && (
                    <p className="text-xs text-muted-foreground">
                      El archivo actual se mantiene si no eliges otro.
                    </p>
                  )}
                  {(mode === "edit" || mode === "create") && logoPreview && (
                    <p className="text-xs text-muted-foreground">
                      Vista previa del archivo seleccionado. Guarda para aplicar el cambio.
                    </p>
                  )}
                </>
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

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                {readOnly ? (
                  <span
                    className={`font-medium ${
                      form.stateBrand === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {form.stateBrand === 1 ? "Activa" : "Desactivada"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateBrand)}
                    onValueChange={(v) => handleChange("stateBrand", Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activa</SelectItem>
                      <SelectItem value="0">Desactivada</SelectItem>
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

