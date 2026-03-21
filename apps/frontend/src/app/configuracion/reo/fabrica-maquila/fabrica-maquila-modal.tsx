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
import type { FacilityMaquila } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface FabricaMaquilaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  item?: FacilityMaquila | null;
  onSuccess: () => void;
}

type MaquilaOption = {
  idDlkMaquila: number;
  codMaquila: string;
  nameMaquila: string;
};

type UbigeoOption = {
  codUbigeo: number;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
};

const emptyForm = {
  idDlkMaquila: 0,
  codMaquila: "",
  nameFacilityMaquila: "",
  codGlnFacilityMaquila: "",
  registryFacilityMaquila: "",
  identifierFacilityMaquila: "",
  codUbigeo: 0,
  addressFacilityMaquila: "",
  gpsLocationFacilityMaquila: "",
  emailFacilityMaquila: "",
  cellularFacilityMaquila: "",
  /** 1 = activa, 0 = desactivada (sigue en listado; eliminar es baja lógica) */
  stateFacilityMaquila: 1,
};

export function FabricaMaquilaModal({
  open,
  onOpenChange,
  mode,
  item,
  onSuccess,
}: FabricaMaquilaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [maquilas, setMaquilas] = useState<MaquilaOption[]>([]);
  const [ubigeos, setUbigeos] = useState<UbigeoOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/maquilas"))
      .then((res) => res.json())
      .then((data: MaquilaOption[]) => setMaquilas(data))
      .catch((err) => console.error("Error al cargar maquilas:", err));

    fetch(apiUrl("/api/ubigeo"))
      .then((res) => res.json())
      .then((data: UbigeoOption[]) => setUbigeos(data))
      .catch((err) => console.error("Error al cargar ubigeo:", err));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setForm(emptyForm);
      return;
    }

    if (!item?.idDlkFacilityMaquila) return;

    function facilityRowToForm(d: FacilityMaquila) {
      const codUbigeo = Number(d.codUbigeo);
      return {
        idDlkMaquila: d.maquila?.idDlkMaquila ?? 0,
        codMaquila: d.codMaquila ?? d.maquila?.codMaquila ?? "",
        nameFacilityMaquila: d.nameFacilityMaquila ?? "",
        codGlnFacilityMaquila: d.codGlnFacilityMaquila ?? "",
        registryFacilityMaquila: d.registryFacilityMaquila ?? "",
        identifierFacilityMaquila: d.identifierFacilityMaquila ?? "",
        codUbigeo: Number.isFinite(codUbigeo) ? codUbigeo : 0,
        addressFacilityMaquila: d.addressFacilityMaquila ?? "",
        gpsLocationFacilityMaquila: d.gpsLocationFacilityMaquila ?? "",
        emailFacilityMaquila: d.emailFacilityMaquila ?? "",
        cellularFacilityMaquila: d.cellularFacilityMaquila ?? "",
        stateFacilityMaquila: d.stateFacilityMaquila === 1 ? 1 : 0,
      };
    }

    // Primero pintamos con la fila del listado (respuesta inmediata)
    setForm(facilityRowToForm(item));

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl(`/api/facilities-maquila/${item.idDlkFacilityMaquila}`));
        if (!res.ok) return;
        const detail = (await res.json()) as FacilityMaquila;
        if (cancelled) return;
        setForm(facilityRowToForm(detail));
      } catch {
        /* mantener datos del listado */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode, item]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleMaquilaChange(idStr: string) {
    const id = Number(idStr);
    const m = maquilas.find((mq) => mq.idDlkMaquila === id);
    setForm((prev) => ({
      ...prev,
      idDlkMaquila: id,
      codMaquila: m?.codMaquila ?? "",
    }));
  }

  async function handleSubmit() {
    if (!form.idDlkMaquila || !form.codMaquila) {
      alert("Debes seleccionar una maquila");
      return;
    }
    if (!form.nameFacilityMaquila.trim()) {
      alert("El nombre de la fábrica es obligatorio");
      return;
    }
    if (!form.codUbigeo) {
      alert("Debes seleccionar un ubigeo (departamento, provincia y distrito).");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/facilities-maquila/${item!.idDlkFacilityMaquila}`)
          : apiUrl("/api/facilities-maquila");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload = {
        ...form,
        codUbigeo: Number(form.codUbigeo),
        idDlkMaquila: Number(form.idDlkMaquila),
        stateFacilityMaquila: Number(form.stateFacilityMaquila),
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
      alert(err instanceof Error ? err.message : "Error al guardar la fábrica de maquila");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Fábrica de Maquila"
      : mode === "edit"
        ? "Editar Fábrica de Maquila"
        : "Detalle de Fábrica de Maquila";

  const selectedMaquila = maquilas.find((m) => m.idDlkMaquila === form.idDlkMaquila);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar una nueva Fábrica de Maquila."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información de la Fábrica de Maquila."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && item && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{item.codFacilityMaquila}</span>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Maquila:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    selectedMaquila
                      ? `${selectedMaquila.codMaquila} - ${selectedMaquila.nameMaquila}`
                      : item?.maquila
                        ? `${item.maquila.codMaquila} - ${item.maquila.nameMaquila}`
                        : ""
                  }
                />
              ) : (
                <Select
                  value={form.idDlkMaquila ? String(form.idDlkMaquila) : ""}
                  onValueChange={handleMaquilaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar maquila" />
                  </SelectTrigger>
                  <SelectContent>
                    {maquilas.map((m) => (
                      <SelectItem key={m.idDlkMaquila} value={String(m.idDlkMaquila)}>
                        {m.codMaquila} - {m.nameMaquila}
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
              value={form.nameFacilityMaquila}
              onChange={(e) => handleChange("nameFacilityMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">GLN Fábrica:</Label>
            <Input
              className="col-span-3"
              value={form.codGlnFacilityMaquila}
              onChange={(e) => handleChange("codGlnFacilityMaquila", e.target.value)}
              readOnly={readOnly}
              maxLength={13}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Registro:</Label>
            <Input
              className="col-span-3"
              value={form.registryFacilityMaquila}
              onChange={(e) => handleChange("registryFacilityMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Identificador:</Label>
            <Input
              className="col-span-3"
              value={form.identifierFacilityMaquila}
              onChange={(e) => handleChange("identifierFacilityMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <UbigeoSelector
                label="Ubigeo"
                value={form.codUbigeo}
                onChange={(cod) => handleChange("codUbigeo", cod)}
                ubigeos={ubigeos}
                readOnly={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Dirección:</Label>
            <Input
              className="col-span-3"
              value={form.addressFacilityMaquila}
              onChange={(e) => handleChange("addressFacilityMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Localización:</Label>
            <Input
              className="col-span-3"
              value={form.gpsLocationFacilityMaquila}
              onChange={(e) => handleChange("gpsLocationFacilityMaquila", e.target.value)}
              readOnly={readOnly}
              placeholder="Latitud, Longitud"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailFacilityMaquila}
              onChange={(e) => handleChange("emailFacilityMaquila", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Celular:</Label>
            <Input
              className="col-span-3"
              value={form.cellularFacilityMaquila}
              onChange={(e) => handleChange("cellularFacilityMaquila", e.target.value)}
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
                      form.stateFacilityMaquila === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {form.stateFacilityMaquila === 1 ? "Activa" : "Desactivada"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateFacilityMaquila)}
                    onValueChange={(v) => handleChange("stateFacilityMaquila", Number(v))}
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

