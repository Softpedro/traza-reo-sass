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

type FormState = {
  idDlkSupplier: number;
  material: string;
  contentNameMaterial: string;
  contentValueMaterial: string;
  contentSourceMaterials: string;
  materialTradeMarks: string;
  recycled: number;
  percentageRecycledMaterials: string;
  recycledInputSource: string;
  renewableMaterial: number;
  percentageRenewableMaterial: string;
  renewableInputSource: string;
  typeDyes: string;
  dyeClass: string;
  classStandardDyes: string;
  finishes: string;
  patterns: string;
  recoveryMaterials: string;
  certification: string;
  stateMaterials: number;
};

const emptyForm: FormState = {
  idDlkSupplier: 0,
  material: "",
  contentNameMaterial: "",
  contentValueMaterial: "",
  contentSourceMaterials: "",
  materialTradeMarks: "",
  recycled: 0,
  percentageRecycledMaterials: "",
  recycledInputSource: "",
  renewableMaterial: 0,
  percentageRenewableMaterial: "",
  renewableInputSource: "",
  typeDyes: "",
  dyeClass: "",
  classStandardDyes: "",
  finishes: "",
  patterns: "",
  recoveryMaterials: "",
  certification: "",
  stateMaterials: 1,
};

function numToStr(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}

function strToStr(v: string | null | undefined): string {
  return v ?? "";
}

function rowToForm(m: Material): FormState {
  const active = (m.flgStatutActif ?? m.stateMaterials) === 1;
  return {
    idDlkSupplier: m.supplier?.idDlkSupplier ?? m.idDlkSupplier ?? 0,
    material: strToStr(m.material),
    contentNameMaterial: strToStr(m.contentNameMaterial),
    contentValueMaterial: numToStr(m.contentValueMaterial),
    contentSourceMaterials: strToStr(m.contentSourceMaterials),
    materialTradeMarks: strToStr(m.materialTradeMarks),
    recycled: m.recycled === 1 ? 1 : 0,
    percentageRecycledMaterials: numToStr(m.percentageRecycledMaterials),
    recycledInputSource: strToStr(m.recycledInputSource),
    renewableMaterial: m.renewableMaterial === 1 ? 1 : 0,
    percentageRenewableMaterial: numToStr(m.percentageRenewableMaterial),
    renewableInputSource: strToStr(m.renewableInputSource),
    typeDyes: strToStr(m.typeDyes),
    dyeClass: strToStr(m.dyeClass),
    classStandardDyes: strToStr(m.classStandardDyes),
    finishes: strToStr(m.finishes),
    patterns: strToStr(m.patterns),
    recoveryMaterials: strToStr(m.recoveryMaterials),
    certification: strToStr(m.certification),
    stateMaterials: active ? 1 : 0,
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

export function MaterialModal({ open, onOpenChange, mode, material, onSuccess }: MaterialModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
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
        mode === "edit"
          ? apiUrl(`/api/materials/${material!.idDlkMaterial}`)
          : apiUrl("/api/materials");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        idDlkSupplier: Number(form.idDlkSupplier),
        material: toPayloadText(form.material),
        contentNameMaterial: toPayloadText(form.contentNameMaterial),
        contentValueMaterial: toPayloadNum(form.contentValueMaterial),
        contentSourceMaterials: toPayloadText(form.contentSourceMaterials),
        materialTradeMarks: toPayloadText(form.materialTradeMarks),
        recycled: form.recycled,
        percentageRecycledMaterials: toPayloadNum(form.percentageRecycledMaterials),
        recycledInputSource: toPayloadText(form.recycledInputSource),
        renewableMaterial: form.renewableMaterial,
        percentageRenewableMaterial: toPayloadNum(form.percentageRenewableMaterial),
        renewableInputSource: toPayloadText(form.renewableInputSource),
        typeDyes: toPayloadText(form.typeDyes),
        dyeClass: toPayloadText(form.dyeClass),
        classStandardDyes: toPayloadText(form.classStandardDyes),
        finishes: toPayloadText(form.finishes),
        patterns: toPayloadText(form.patterns),
        recoveryMaterials: toPayloadText(form.recoveryMaterials),
        certification: toPayloadText(form.certification),
      };

      if (mode === "edit") {
        payload.stateMaterials = Number(form.stateMaterials);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                    : material?.supplier
                      ? `${material.supplier.codSupplier} — ${material.supplier.nameSupplier}`
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
            label="Material (composición)"
            value={form.material}
            onChange={(v) => set("material", v)}
            readOnly={readOnly}
            span={2}
            placeholder="p.ej. 100% Algodón orgánico"
          />
          <FieldText
            label="Marcas comerciales"
            value={form.materialTradeMarks}
            onChange={(v) => set("materialTradeMarks", v)}
            readOnly={readOnly}
            span={2}
          />

          <SectionTitle>Composición de fibra</SectionTitle>
          <FieldText
            label="Tipo de fibra"
            value={form.contentNameMaterial}
            onChange={(v) => set("contentNameMaterial", v)}
            readOnly={readOnly}
          />
          <FieldNum
            label="% de fibra"
            value={form.contentValueMaterial}
            onChange={(v) => set("contentValueMaterial", v)}
            readOnly={readOnly}
            min="0"
            max="100"
          />
          <FieldText
            label="Fuente de la fibra"
            value={form.contentSourceMaterials}
            onChange={(v) => set("contentSourceMaterials", v)}
            readOnly={readOnly}
            span={2}
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
          <FieldYesNo
            label="Renovable"
            value={form.renewableMaterial}
            onChange={(v) => set("renewableMaterial", v)}
            readOnly={readOnly}
          />
          <FieldNum
            label="% renovable"
            value={form.percentageRenewableMaterial}
            onChange={(v) => set("percentageRenewableMaterial", v)}
            readOnly={readOnly}
            min="0"
            max="100"
          />
          <FieldText
            label="Fuente del insumo renovable"
            value={form.renewableInputSource}
            onChange={(v) => set("renewableInputSource", v)}
            readOnly={readOnly}
            span={2}
          />

          <SectionTitle>Proceso y acabado</SectionTitle>
          <FieldText
            label="Tipo de tinta"
            value={form.typeDyes}
            onChange={(v) => set("typeDyes", v)}
            readOnly={readOnly}
          />
          <FieldText
            label="Clase de teñido"
            value={form.dyeClass}
            onChange={(v) => set("dyeClass", v)}
            readOnly={readOnly}
          />
          <FieldText
            label="Estándar de teñido"
            value={form.classStandardDyes}
            onChange={(v) => set("classStandardDyes", v)}
            readOnly={readOnly}
            span={2}
          />
          <FieldText
            label="Acabado"
            value={form.finishes}
            onChange={(v) => set("finishes", v)}
            readOnly={readOnly}
          />
          <FieldText
            label="Patrón"
            value={form.patterns}
            onChange={(v) => set("patterns", v)}
            readOnly={readOnly}
          />
          <FieldText
            label="Materiales recuperados"
            value={form.recoveryMaterials}
            onChange={(v) => set("recoveryMaterials", v)}
            readOnly={readOnly}
            span={2}
          />

          <SectionTitle>Certificación</SectionTitle>
          <FieldTextarea
            label="Certificaciones"
            value={form.certification}
            onChange={(v) => set("certification", v)}
            readOnly={readOnly}
          />

          {(mode === "edit" || mode === "view") && (
            <>
              <SectionTitle>Estado</SectionTitle>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Estado del registro</Label>
                {readOnly ? (
                  <span
                    className={`font-medium ${form.stateMaterials === 1 ? "text-green-600" : "text-red-600"}`}
                  >
                    {form.stateMaterials === 1 ? "Activo" : "Inactivo"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateMaterials)}
                    onValueChange={(v) => set("stateMaterials", Number(v))}
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
