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
import { UbigeoSelector, type UbigeoOption } from "@/components/ubigeo-selector";
import type { ParentCompany } from "./columns";
import { EMPRESA_CATEGORIAS } from "./empresa-categories";
import { TIPO_REO_PARENT_COMPANY } from "./empresa-tipo-reo";

/** `src` para `<img>` desde lo que devuelve el API (data URL o base64 crudo legado). */
function logoSrcFromApi(logo: string | null | undefined): string | null {
  if (logo == null || logo === "") return null;
  if (logo.startsWith("data:")) return logo;
  return `data:image/png;base64,${logo}`;
}

type ModalMode = "create" | "edit" | "view";

interface EmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  empresa?: ParentCompany | null;
  onSuccess: () => void;
}

const emptyForm = {
  idDlkAdmReo: "",
  typeParentCompany: 1,
  nameParentCompany: "",
  categoryParentCompany: 0,
  numRucParentCompany: "",
  codGlnParentCompany: "",
  codUbigeoParentCompany: 0,
  addressParentCompany: "",
  gpsLocationParentCompany: "",
  emailParentCompany: "",
  cellularParentCompany: "",
  webParentCompany: "",
  logoParentCompany: "",
  /** 1 = activa (On), 0 = desactivada (Off) */
  stateParentCompany: 1,
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
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  const storedLogoSrc =
    mode !== "create" && empresa?.logoParentCompany
      ? logoSrcFromApi(empresa.logoParentCompany)
      : null;
  const logoDisplaySrc = logoPreview ?? storedLogoSrc;

  useEffect(() => {
    fetch(apiUrl("/api/ubigeo"))
      .then((r) => r.json())
      .then((data: UbigeoOption[]) => setUbigeos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (empresa && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkAdmReo: empresa.idDlkAdmReo ?? "",
        typeParentCompany:
          [1, 2, 3, 4].includes(Number(empresa.typeParentCompany))
            ? Number(empresa.typeParentCompany)
            : 1,
        nameParentCompany: empresa.nameParentCompany,
        categoryParentCompany: empresa.categoryParentCompany,
        numRucParentCompany: empresa.numRucParentCompany,
        codGlnParentCompany: empresa.codGlnParentCompany,
        codUbigeoParentCompany: Number(empresa.codUbigeoParentCompany) || 0,
        addressParentCompany: empresa.addressParentCompany,
        gpsLocationParentCompany: empresa.gpsLocationParentCompany ?? "",
        emailParentCompany: empresa.emailParentCompany,
        cellularParentCompany: empresa.cellularParentCompany,
        webParentCompany: empresa.webParentCompany,
        logoParentCompany: "",
        stateParentCompany: empresa.stateParentCompany === 1 ? 1 : 0,
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
    if (!form.codUbigeoParentCompany) {
      alert("Debes seleccionar un ubigeo (departamento, provincia y distrito).");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/parent-companies/${empresa!.idDlkParentCompany}`)
          : apiUrl("/api/parent-companies");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        ...form,
        codUbigeoParentCompany: Number(form.codUbigeoParentCompany),
      };
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
            <Label className="text-right text-primary font-semibold">Código REO SaaS:</Label>
            <Input
              className="col-span-3"
              value={form.idDlkAdmReo}
              onChange={(e) =>
                handleChange("idDlkAdmReo", e.target.value.slice(0, 10))
              }
              readOnly={readOnly}
              maxLength={10}
              placeholder="Opcional, máx. 10 caracteres"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo REO:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    TIPO_REO_PARENT_COMPANY[form.typeParentCompany] ??
                    String(form.typeParentCompany)
                  }
                />
              ) : (
                <Select
                  value={String(form.typeParentCompany)}
                  onValueChange={(v) => handleChange("typeParentCompany", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de empresa en REO" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIPO_REO_PARENT_COMPANY).map(([k, v]) => (
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
                  value={EMPRESA_CATEGORIAS[form.categoryParentCompany] ?? String(form.categoryParentCompany)}
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
                    {Object.entries(EMPRESA_CATEGORIAS).map(([k, v]) => (
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

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <UbigeoSelector
                label="Ubigeo"
                value={form.codUbigeoParentCompany}
                onChange={(cod) => handleChange("codUbigeoParentCompany", cod)}
                ubigeos={ubigeos}
                readOnly={readOnly}
              />
            </div>
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
              value={form.gpsLocationParentCompany}
              onChange={(e) => handleChange("gpsLocationParentCompany", e.target.value)}
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

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                {readOnly ? (
                  <span
                    className={`font-medium ${form.stateParentCompany === 1 ? "text-green-600" : "text-red-600"}`}
                  >
                    {form.stateParentCompany === 1 ? "Activa" : "Desactivada"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateParentCompany)}
                    onValueChange={(v) => handleChange("stateParentCompany", Number(v))}
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

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Logo:</Label>
            <div className="col-span-3 space-y-3">
              {logoDisplaySrc ? (
                <img
                  src={logoDisplaySrc}
                  alt="Logo de la empresa"
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
