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
import type { Supplier } from "./columns";
import { PROVEEDOR_TIPOS } from "./proveedor-tipo";

function logoSrcFromApi(logo: string | null | undefined): string | null {
  if (logo == null || logo === "") return null;
  if (logo.startsWith("data:")) return logo;
  return `data:image/png;base64,${logo}`;
}

type ModalMode = "create" | "edit" | "view";

interface ProveedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  proveedor?: Supplier | null;
  onSuccess: () => void;
}

type UbigeoOption = {
  codUbigeo: number;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
};

const emptyForm = {
  nameSupplier: "",
  numRucSupplier: "",
  typeSupplier: 1,
  codUbigeoSupplier: 0,
  addressSupplier: "",
  gpsLocationSupplier: "",
  emailSupplier: "",
  cellularSupplier: "",
  webSupplier: "",
  logoSupplier: "",
  stateSupplier: 1,
};

export function ProveedorModal({
  open,
  onOpenChange,
  mode,
  proveedor,
  onSuccess,
}: ProveedorModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;

    fetch(apiUrl("/api/ubigeo"))
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          if (!res.ok) console.error("Error al cargar ubigeo:", data);
          setUbigeos([]);
          return;
        }
        setUbigeos(data as UbigeoOption[]);
      })
      .catch((err) => {
        console.error("Error al cargar ubigeo:", err);
        setUbigeos([]);
      });
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDetailSupplier(null);
      return;
    }

    if (mode === "create") {
      setForm(emptyForm);
      setDetailSupplier(null);
      setLogoPreview(null);
      return;
    }

    if (!proveedor?.idDlkSupplier) return;

    function rowToForm(s: Supplier) {
      const u = Number(s.codUbigeoSupplier);
      const active = (s.flgStatutActif ?? s.stateSupplier) === 1;
      const ruc = s.numRucSupplier ?? s.rucSupplier ?? "";
      return {
        nameSupplier: s.nameSupplier ?? "",
        numRucSupplier: ruc,
        typeSupplier: s.typeSupplier >= 1 && s.typeSupplier <= 6 ? s.typeSupplier : 1,
        codUbigeoSupplier: Number.isFinite(u) ? u : 0,
        addressSupplier: s.addressSupplier ?? "",
        gpsLocationSupplier: s.gpsLocationSupplier ?? "",
        emailSupplier: s.emailSupplier ?? "",
        cellularSupplier: s.cellularSupplier ?? "",
        webSupplier: s.webSupplier ?? "",
        logoSupplier: "",
        stateSupplier: active ? 1 : 0,
      };
    }

    setLogoPreview(null);
    setForm(rowToForm(proveedor));
    setDetailSupplier(null);

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl(`/api/suppliers/${proveedor.idDlkSupplier}`));
        if (!res.ok) return;
        const detail = (await res.json()) as Supplier;
        if (cancelled) return;
        setForm(rowToForm(detail));
        setDetailSupplier(detail);
      } catch {
        if (!cancelled) setDetailSupplier(proveedor);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode, proveedor]);

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
      setForm((prev) => ({ ...prev, logoSupplier: base64 }));
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.nameSupplier.trim()) {
      alert("La razón social es obligatoria");
      return;
    }
    if (!form.numRucSupplier.trim()) {
      alert("El RUC es obligatorio");
      return;
    }
    if (!form.codUbigeoSupplier) {
      alert("Debes seleccionar un ubigeo (departamento, provincia y distrito).");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/suppliers/${proveedor!.idDlkSupplier}`)
          : apiUrl("/api/suppliers");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        nameSupplier: form.nameSupplier,
        numRucSupplier: form.numRucSupplier.trim(),
        codUbigeoSupplier: Number(form.codUbigeoSupplier),
        typeSupplier: Number(form.typeSupplier),
        addressSupplier: form.addressSupplier,
        gpsLocationSupplier: form.gpsLocationSupplier || null,
        emailSupplier: form.emailSupplier,
        cellularSupplier: form.cellularSupplier,
        webSupplier: form.webSupplier.trim() || null,
      };

      if (mode === "edit") {
        payload.stateSupplier = Number(form.stateSupplier);
      }

      if (form.logoSupplier) {
        payload.logoSupplier = form.logoSupplier;
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
      alert(err instanceof Error ? err.message : "Error al guardar el proveedor");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Proveedor"
      : mode === "edit"
        ? `Actualizar — ${detailSupplier?.codSupplier ?? proveedor?.codSupplier ?? ""}`
        : `Detalle — ${proveedor?.codSupplier ?? ""}`;

  const storedLogoSrc =
    mode !== "create" && (detailSupplier?.logoSupplier ?? proveedor?.logoSupplier)
      ? logoSrcFromApi(detailSupplier?.logoSupplier ?? proveedor?.logoSupplier)
      : null;
  const logoDisplaySrc = logoPreview ?? storedLogoSrc;

  const codigoDisplay =
    mode === "create"
      ? "Se asignará al guardar"
      : (detailSupplier?.codSupplier ?? proveedor?.codSupplier ?? "—");

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Registra un nuevo proveedor de insumos."
              : mode === "edit"
                ? "Modifica los datos del proveedor."
                : "Información del proveedor."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Código:</Label>
            {readOnly && proveedor ? (
              <span className="col-span-3">{proveedor.codSupplier || "—"}</span>
            ) : (
              <Input className="col-span-3" readOnly value={codigoDisplay} />
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Razón social:</Label>
            <Input
              className="col-span-3"
              value={form.nameSupplier}
              onChange={(e) => handleChange("nameSupplier", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">RUC:</Label>
            <Input
              className="col-span-3"
              value={form.numRucSupplier}
              onChange={(e) => handleChange("numRucSupplier", e.target.value)}
              readOnly={readOnly}
              maxLength={11}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input readOnly value={PROVEEDOR_TIPOS[form.typeSupplier] ?? String(form.typeSupplier)} />
              ) : (
                <Select
                  value={String(form.typeSupplier)}
                  onValueChange={(v) => handleChange("typeSupplier", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROVEEDOR_TIPOS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <UbigeoSelector
            label="Ubigeo"
            value={form.codUbigeoSupplier}
            onChange={(cod) => handleChange("codUbigeoSupplier", cod)}
            ubigeos={ubigeos}
            readOnly={readOnly}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Dirección:</Label>
            <Input
              className="col-span-3"
              value={form.addressSupplier}
              onChange={(e) => handleChange("addressSupplier", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.gpsLocationSupplier}
              onChange={(e) => handleChange("gpsLocationSupplier", e.target.value)}
              readOnly={readOnly}
              placeholder="Latitud, longitud o Plus Code"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailSupplier}
              onChange={(e) => handleChange("emailSupplier", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularSupplier}
              onChange={(e) => handleChange("cellularSupplier", e.target.value)}
              readOnly={readOnly}
              maxLength={25}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Web:</Label>
            <Input
              className="col-span-3"
              value={form.webSupplier}
              onChange={(e) => handleChange("webSupplier", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Logo:</Label>
            <div className="col-span-3 space-y-3">
              {logoDisplaySrc ? (
                <img
                  src={logoDisplaySrc}
                  alt="Logo del proveedor"
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

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                {readOnly ? (
                  <span
                    className={`font-medium ${form.stateSupplier === 1 ? "text-green-600" : "text-red-600"}`}
                  >
                    {form.stateSupplier === 1 ? "Activo" : "Inactivo"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateSupplier)}
                    onValueChange={(v) => handleChange("stateSupplier", Number(v))}
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
