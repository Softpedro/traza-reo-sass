"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import type { OrderDetailRow } from "./order-detail-columns";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headId: number;
  row: OrderDetailRow | null;
  /** Se llama tras guardar con éxito. El número es el versión de imagen para cache-bust. */
  onSuccess: (imageVersion: number) => void;
};

const BABY_SIZES = [
  { key: "size0_3", label: "0-3m" },
  { key: "size3_6", label: "3-6m" },
  { key: "size0_6", label: "0-6m" },
  { key: "size6_12", label: "6-12m" },
  { key: "size12_18", label: "12-18m" },
] as const;

const NUMERIC_SIZES = [
  { key: "size2", label: "2" },
  { key: "size3", label: "3" },
  { key: "size4", label: "4" },
  { key: "size5", label: "5" },
  { key: "size6", label: "6" },
  { key: "size7", label: "7" },
  { key: "size8", label: "8" },
  { key: "size9", label: "9" },
  { key: "size10", label: "10" },
  { key: "size11", label: "11" },
  { key: "size12", label: "12" },
  { key: "size14", label: "14" },
  { key: "size16", label: "16" },
] as const;

const LETTER_SIZES = [
  { key: "sizeS", label: "S" },
  { key: "sizeM", label: "M" },
  { key: "sizeL", label: "L" },
  { key: "sizeXl", label: "XL" },
  { key: "sizeXxl", label: "XXL" },
] as const;

type BabyKey = (typeof BABY_SIZES)[number]["key"];
type NumericKey = (typeof NUMERIC_SIZES)[number]["key"];
type LetterKey = (typeof LETTER_SIZES)[number]["key"];

type FormState = {
  desTela: string;
  nomEstilo: string;
  colorAway: string;
  fondoTela: string;
  versionTela: string;
  orderSample: string;
  totalEstilo: string;
  flgStatutActif: number;
} & Record<BabyKey, string> &
  Record<NumericKey, string> &
  Record<LetterKey, string>;

function numToStr(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}

function strToStr(v: string | null | undefined): string {
  return v ?? "";
}

function rowToForm(r: OrderDetailRow): FormState {
  const baby = BABY_SIZES.reduce(
    (acc, { key }) => {
      acc[key] = numToStr(r[key]);
      return acc;
    },
    {} as Record<BabyKey, string>
  );
  const numeric = NUMERIC_SIZES.reduce(
    (acc, { key }) => {
      acc[key] = numToStr(r[key]);
      return acc;
    },
    {} as Record<NumericKey, string>
  );
  const letters = LETTER_SIZES.reduce(
    (acc, { key }) => {
      acc[key] = numToStr(r[key]);
      return acc;
    },
    {} as Record<LetterKey, string>
  );
  return {
    desTela: strToStr(r.desTela),
    nomEstilo: strToStr(r.nomEstilo),
    colorAway: strToStr(r.colorAway),
    fondoTela: strToStr(r.fondoTela),
    versionTela: strToStr(r.versionTela),
    orderSample: numToStr(r.orderSample),
    totalEstilo: numToStr(r.totalEstilo),
    flgStatutActif: r.flgStatutActif == null ? 1 : r.flgStatutActif === 1 ? 1 : 0,
    ...baby,
    ...numeric,
    ...letters,
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(r.error ?? new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="col-span-full text-sm font-semibold text-primary border-b pb-1 mt-2">
      {children}
    </h4>
  );
}

export function OrderDetailEditModal({ open, onOpenChange, headId, row, onSuccess }: Props) {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [clearImage, setClearImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !row) return;
    setForm(rowToForm(row));
    setNewImageFile(null);
    setClearImage(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, row]);

  const currentImageUrl = useMemo(() => {
    if (!row || !row.hasImgEstilo || clearImage) return null;
    return apiUrl(`/api/order-heads/${headId}/details/${row.idDlkOrderDetail}/image`);
  }, [row, headId, clearImage]);

  const newImagePreview = useMemo(() => {
    if (!newImageFile) return null;
    return URL.createObjectURL(newImageFile);
  }, [newImageFile]);

  useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit() {
    if (!form || !row) return;
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        desTela: toPayloadText(form.desTela),
        nomEstilo: toPayloadText(form.nomEstilo),
        colorAway: toPayloadText(form.colorAway),
        fondoTela: toPayloadText(form.fondoTela),
        versionTela: toPayloadText(form.versionTela),
        orderSample: toPayloadNum(form.orderSample),
        totalEstilo: toPayloadNum(form.totalEstilo),
        flgStatutActif: form.flgStatutActif,
      };
      for (const { key } of BABY_SIZES) {
        payload[key] = toPayloadNum(form[key]);
      }
      for (const { key } of NUMERIC_SIZES) {
        payload[key] = toPayloadNum(form[key]);
      }
      for (const { key } of LETTER_SIZES) {
        payload[key] = toPayloadNum(form[key]);
      }
      if (newImageFile) {
        payload.imgEstiloBase64 = await fileToBase64(newImageFile);
      } else if (clearImage && row.hasImgEstilo) {
        payload.clearImgEstilo = true;
      }

      const res = await fetch(
        apiUrl(`/api/order-heads/${headId}/details/${row.idDlkOrderDetail}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : `Error ${res.status} al guardar`;
        throw new Error(msg);
      }
      onSuccess(Date.now());
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (!open || !row || !form) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => (saving ? undefined : onOpenChange(o))}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar línea de orden</DialogTitle>
          <DialogDescription>
            Modifica los datos de esta línea. Orden producción y Cod estilo no son editables.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
          <SectionTitle>Lectura</SectionTitle>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Orden producción</Label>
            <Input readOnly value={row.codOrderDetail ?? "—"} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Cod estilo</Label>
            <Input readOnly value={row.codEstilo ?? "—"} />
          </div>

          <SectionTitle>Datos básicos</SectionTitle>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Estilo</Label>
            <Input value={form.nomEstilo} onChange={(e) => set("nomEstilo", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Tela</Label>
            <Input value={form.desTela} onChange={(e) => set("desTela", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Color way</Label>
            <Input value={form.colorAway} onChange={(e) => set("colorAway", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Fondo de tela</Label>
            <Input value={form.fondoTela} onChange={(e) => set("fondoTela", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Versión tela</Label>
            <Input value={form.versionTela} onChange={(e) => set("versionTela", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Orden muestra</Label>
            <Input
              type="number"
              step="1"
              value={form.orderSample}
              onChange={(e) => set("orderSample", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Total estilo</Label>
            <Input
              type="number"
              step="1"
              value={form.totalEstilo}
              onChange={(e) => set("totalEstilo", e.target.value)}
            />
          </div>

          <SectionTitle>Imagen</SectionTitle>
          <div className="md:col-span-2 flex items-start gap-4">
            <div className="flex-shrink-0">
              {newImagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={newImagePreview}
                  alt="Nueva imagen"
                  className="h-24 w-24 rounded border border-border object-cover bg-muted"
                />
              ) : currentImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentImageUrl}
                  alt={row.nomEstilo ?? "Estilo"}
                  className="h-24 w-24 rounded border border-border object-cover bg-muted"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded border border-dashed text-xs text-muted-foreground">
                  sin imagen
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Reemplazar imagen</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setNewImageFile(f);
                    if (f) setClearImage(false);
                  }}
                  className="block text-sm mt-1"
                />
              </div>
              {row.hasImgEstilo && !newImageFile && (
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={clearImage}
                    onChange={(e) => setClearImage(e.target.checked)}
                  />
                  Quitar imagen actual
                </label>
              )}
            </div>
          </div>

          <SectionTitle>Tallas bebé (meses)</SectionTitle>
          <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BABY_SIZES.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  type="number"
                  step="1"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <SectionTitle>Tallas numéricas</SectionTitle>
          <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {NUMERIC_SIZES.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  type="number"
                  step="1"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <SectionTitle>Tallas letra</SectionTitle>
          <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {LETTER_SIZES.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  type="number"
                  step="1"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <SectionTitle>Estado</SectionTitle>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Estado del registro</Label>
            <Select
              value={String(form.flgStatutActif)}
              onValueChange={(v) => set("flgStatutActif", Number(v) as 0 | 1)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="0">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
