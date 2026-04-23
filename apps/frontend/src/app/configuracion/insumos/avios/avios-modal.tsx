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

type FormState = {
  idDlkSupplier: number;
  typeAvio: string;
  nameAvio: string;
  materialAvio: string;
  contentValueMaterial: string;
  contentSourceMaterial: string;
  materialTradeMarks: string;
  color: string;
  weight: string;
  unitMeasurement: string;
  recycled: number;
  percentageRecycledMaterials: string;
  recycledInputSource: string;
  certificates: string;
  observation: string;
  stateAvios: number;
};

const emptyForm: FormState = {
  idDlkSupplier: 0,
  typeAvio: "",
  nameAvio: "",
  materialAvio: "",
  contentValueMaterial: "",
  contentSourceMaterial: "",
  materialTradeMarks: "",
  color: "",
  weight: "",
  unitMeasurement: "",
  recycled: 0,
  percentageRecycledMaterials: "",
  recycledInputSource: "",
  certificates: "",
  observation: "",
  stateAvios: 1,
};

function numToStr(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}

function strToStr(v: string | null | undefined): string {
  return v ?? "";
}

function rowToForm(a: Avios): FormState {
  const active = (a.flgStatutActif ?? a.stateAvios) === 1;
  return {
    idDlkSupplier: a.supplier?.idDlkSupplier ?? a.idDlkSupplier ?? 0,
    typeAvio: strToStr(a.typeAvio),
    nameAvio: strToStr(a.nameAvio),
    materialAvio: strToStr(a.materialAvio),
    contentValueMaterial: numToStr(a.contentValueMaterial),
    contentSourceMaterial: strToStr(a.contentSourceMaterial),
    materialTradeMarks: strToStr(a.materialTradeMarks),
    color: strToStr(a.color),
    weight: numToStr(a.weight),
    unitMeasurement: strToStr(a.unitMeasurement),
    recycled: a.recycled === 1 ? 1 : 0,
    percentageRecycledMaterials: numToStr(a.percentageRecycledMaterials),
    recycledInputSource: strToStr(a.recycledInputSource),
    certificates: strToStr(a.certificates),
    observation: strToStr(a.observation),
    stateAvios: active ? 1 : 0,
  };
}

function toPayloadNum(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function toPayloadText(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="col-span-full text-sm font-semibold text-primary border-b pb-1 mt-2">
      {children}
    </h4>
  );
}

function FieldText(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  span?: 1 | 2;
  placeholder?: string;
}) {
  const { label, value, onChange, readOnly, span = 1, placeholder } = props;
  return (
    <div className={`flex flex-col gap-1 ${span === 2 ? "md:col-span-2" : ""}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}

function FieldNum(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  step?: string;
  min?: string;
  max?: string;
}) {
  const { label, value, onChange, readOnly, step = "0.01", min, max } = props;
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}

function FieldYesNo(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  readOnly?: boolean;
}) {
  const { label, value, onChange, readOnly } = props;
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {readOnly ? (
        <Input readOnly value={value === 1 ? "Sí" : "No"} />
      ) : (
        <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">No</SelectItem>
            <SelectItem value="1">Sí</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function FieldTextarea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const { label, value, onChange, readOnly } = props;
  return (
    <div className="flex flex-col gap-1 md:col-span-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <textarea
        className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}

export function AviosModal({ open, onOpenChange, mode, avios, onSuccess }: AviosModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
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

    if (!avios?.idDlkAvio) return;

    setForm(rowToForm(avios));
    setDetailAvios(null);

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl(`/api/avios/${avios.idDlkAvio}`));
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

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.idDlkSupplier) {
      alert("Debes seleccionar el proveedor");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit" ? apiUrl(`/api/avios/${avios!.idDlkAvio}`) : apiUrl("/api/avios");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        idDlkSupplier: Number(form.idDlkSupplier),
        typeAvio: toPayloadText(form.typeAvio),
        nameAvio: toPayloadText(form.nameAvio),
        materialAvio: toPayloadText(form.materialAvio),
        contentValueMaterial: toPayloadNum(form.contentValueMaterial),
        contentSourceMaterial: toPayloadText(form.contentSourceMaterial),
        materialTradeMarks: toPayloadText(form.materialTradeMarks),
        color: toPayloadText(form.color),
        weight: toPayloadNum(form.weight),
        unitMeasurement: toPayloadText(form.unitMeasurement),
        recycled: form.recycled,
        percentageRecycledMaterials: toPayloadNum(form.percentageRecycledMaterials),
        recycledInputSource: toPayloadText(form.recycledInputSource),
        certificates: toPayloadText(form.certificates),
        observation: toPayloadText(form.observation),
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
        ? `Actualizar — ${detailAvios?.codAvio ?? avios?.codAvio ?? ""}`
        : `Detalle — ${avios?.codAvio ?? ""}`;

  const selectedProv = proveedores.find((p) => p.idDlkSupplier === form.idDlkSupplier);

  const codigoDisplay =
    mode === "create"
      ? "Se asignará al guardar"
      : (detailAvios?.codAvio ?? avios?.codAvio ?? "—");

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
          <SectionTitle>Básico</SectionTitle>

          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Código</Label>
            <Input readOnly value={codigoDisplay} />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Proveedor *</Label>
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
                onValueChange={(v) => set("idDlkSupplier", Number(v))}
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

          <FieldText
            label="Tipo"
            value={form.typeAvio}
            onChange={(v) => set("typeAvio", v)}
            readOnly={readOnly}
            placeholder="p.ej. cierre, botón, etiqueta"
          />
          <FieldText
            label="Nombre"
            value={form.nameAvio}
            onChange={(v) => set("nameAvio", v)}
            readOnly={readOnly}
          />
          <FieldText
            label="Color"
            value={form.color}
            onChange={(v) => set("color", v)}
            readOnly={readOnly}
          />
          <FieldText
            label="Marcas comerciales"
            value={form.materialTradeMarks}
            onChange={(v) => set("materialTradeMarks", v)}
            readOnly={readOnly}
          />
          <FieldTextarea
            label="Material"
            value={form.materialAvio}
            onChange={(v) => set("materialAvio", v)}
            readOnly={readOnly}
          />

          <SectionTitle>Medidas</SectionTitle>
          <FieldNum
            label="Peso"
            value={form.weight}
            onChange={(v) => set("weight", v)}
            readOnly={readOnly}
            step="0.001"
            min="0"
          />
          <FieldText
            label="Unidad"
            value={form.unitMeasurement}
            onChange={(v) => set("unitMeasurement", v)}
            readOnly={readOnly}
            placeholder="gr, kg, mt…"
          />

          <SectionTitle>Composición</SectionTitle>
          <FieldNum
            label="% contenido material"
            value={form.contentValueMaterial}
            onChange={(v) => set("contentValueMaterial", v)}
            readOnly={readOnly}
            min="0"
            max="100"
          />
          <FieldText
            label="Fuente del material"
            value={form.contentSourceMaterial}
            onChange={(v) => set("contentSourceMaterial", v)}
            readOnly={readOnly}
          />

          <SectionTitle>Sostenibilidad</SectionTitle>
          <FieldYesNo
            label="Reciclado"
            value={form.recycled}
            onChange={(v) => set("recycled", v)}
            readOnly={readOnly}
          />
          <FieldNum
            label="% reciclado"
            value={form.percentageRecycledMaterials}
            onChange={(v) => set("percentageRecycledMaterials", v)}
            readOnly={readOnly}
            min="0"
            max="100"
          />
          <FieldText
            label="Fuente del insumo reciclado"
            value={form.recycledInputSource}
            onChange={(v) => set("recycledInputSource", v)}
            readOnly={readOnly}
            span={2}
          />

          <SectionTitle>Certificados</SectionTitle>
          <FieldTextarea
            label="Certificados"
            value={form.certificates}
            onChange={(v) => set("certificates", v)}
            readOnly={readOnly}
          />

          <SectionTitle>Observación</SectionTitle>
          <FieldTextarea
            label="Observaciones"
            value={form.observation}
            onChange={(v) => set("observation", v)}
            readOnly={readOnly}
          />

          {(mode === "edit" || mode === "view") && (
            <>
              <SectionTitle>Estado</SectionTitle>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Estado del registro</Label>
                {readOnly ? (
                  <span
                    className={`font-medium ${form.stateAvios === 1 ? "text-green-600" : "text-red-600"}`}
                  >
                    {form.stateAvios === 1 ? "Activo" : "Inactivo"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateAvios)}
                    onValueChange={(v) => set("stateAvios", Number(v))}
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
            </>
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
