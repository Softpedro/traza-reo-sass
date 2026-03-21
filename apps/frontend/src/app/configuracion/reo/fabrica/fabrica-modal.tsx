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
import type { Facility } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface FabricaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  facility?: Facility | null;
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
  nameFacility: "",
  codGlnFacility: "",
  registryFacility: "",
  identifierFacility: "",
  codUbigeo: 0,
  addressFacility: "",
  gpsLocationFacility: "",
  emailFacility: "",
  cellularFacility: "",
  /** 1 = activa, 0 = desactivada (sigue en listado; DELETE es baja lógica) */
  stateFacility: 1,
};

export function FabricaModal({
  open,
  onOpenChange,
  mode,
  facility,
  onSuccess,
}: FabricaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    // cargar empresas
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
    // maestro completo de ubigeo (API sin limit devuelve todas las filas)
    fetch(apiUrl("/api/ubigeo"))
      .then((res) => res.json())
      .then((data: UbigeoOption[]) => setUbigeos(data))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (facility && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkParentCompany: facility.parentCompany?.idDlkParentCompany ?? 0,
        nameFacility: facility.nameFacility,
        codGlnFacility: facility.codGlnFacility,
        registryFacility: facility.registryFacility,
        identifierFacility: facility.identifierFacility,
        codUbigeo: facility.codUbigeo,
        addressFacility: facility.addressFacility,
        gpsLocationFacility: facility.gpsLocationFacility ?? "",
        emailFacility: facility.emailFacility,
        cellularFacility: facility.cellularFacility,
        stateFacility: facility.stateFacility === 1 ? 1 : 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [facility, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.nameFacility.trim()) {
      alert("El nombre de la fábrica es obligatorio");
      return;
    }
    if (!form.idDlkParentCompany) {
      alert("Debes seleccionar una empresa");
      return;
    }
    if (!form.codUbigeo) {
      alert("Debes seleccionar un ubigeo");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/facilities/${facility!.idDlkFacility}`)
          : apiUrl("/api/facilities");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        ...form,
        codUbigeo: Number(form.codUbigeo),
        idDlkParentCompany: Number(form.idDlkParentCompany),
        stateFacility: Number(form.stateFacility),
      };

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
      alert(err instanceof Error ? err.message : "Error al guardar la fábrica");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Fábrica"
      : mode === "edit"
        ? "Editar Fábrica"
        : "Detalle de Fábrica";

  const selectedEmpresa = empresas.find((e) => e.idDlkParentCompany === form.idDlkParentCompany);
  const selectedUbigeo = ubigeos.find((u) => u.codUbigeo === form.codUbigeo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar una nueva fábrica."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información de la fábrica."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && facility && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{facility.codFacility}</span>
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
                      : facility?.parentCompany
                        ? `${facility.parentCompany.codParentCompany} - ${facility.parentCompany.nameParentCompany}`
                        : ""
                  }
                />
              ) : (
                <Select
                  value={form.idDlkParentCompany ? String(form.idDlkParentCompany) : ""}
                  onValueChange={(v) => handleChange("idDlkParentCompany", Number(v))}
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
            <Label className="text-right text-primary font-semibold">Fábrica:</Label>
            <Input
              className="col-span-3"
              value={form.nameFacility}
              onChange={(e) => handleChange("nameFacility", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">GLN Fábrica:</Label>
            <Input
              className="col-span-3"
              value={form.codGlnFacility}
              onChange={(e) => handleChange("codGlnFacility", e.target.value)}
              readOnly={readOnly}
              maxLength={13}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Registro:</Label>
            <Input
              className="col-span-3"
              value={form.registryFacility}
              onChange={(e) => handleChange("registryFacility", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Identificador:</Label>
            <Input
              className="col-span-3"
              value={form.identifierFacility}
              onChange={(e) => handleChange("identifierFacility", e.target.value)}
              readOnly={readOnly}
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
              value={form.addressFacility}
              onChange={(e) => handleChange("addressFacility", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.gpsLocationFacility}
              onChange={(e) => handleChange("gpsLocationFacility", e.target.value)}
              readOnly={readOnly}
              placeholder="Latitud, Longitud"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailFacility}
              onChange={(e) => handleChange("emailFacility", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularFacility}
              onChange={(e) => handleChange("cellularFacility", e.target.value)}
              readOnly={readOnly}
              maxLength={20}
            />
          </div>

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                {readOnly ? (
                  <span
                    className={`font-medium ${
                      form.stateFacility === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {form.stateFacility === 1 ? "Activa" : "Desactivada"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateFacility)}
                    onValueChange={(v) => handleChange("stateFacility", Number(v))}
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

