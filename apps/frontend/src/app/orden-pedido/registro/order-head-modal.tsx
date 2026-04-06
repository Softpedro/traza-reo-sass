"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { OrderHeadRow } from "./columns";
import {
  ORDER_HEAD_STAGES,
  ACTIVO_OPTIONS,
  concluidoToStatus,
  statusToConcluido,
} from "./constants";

type BrandOption = { idDlkBrand: number; nameBrand: string; codBrand: string };

type ModalMode = "create" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  order: OrderHeadRow | null;
  onSuccess: () => void;
};

function toInputDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });
}

const emptyCreate = {
  codOrderHead: "",
  idDlkBrand: 0,
  quantityOrderHead: "" as string | number,
  fecEntry: "",
  dateProbableDespatch: "",
  stageOrderHead: 1,
  concluido: 0,
  flgStatutActif: 1,
  archivoBase64: "" as string,
  archivoNombre: "" as string,
};

export function OrderHeadModal({
  open,
  onOpenChange,
  mode,
  order,
  onSuccess,
}: Props) {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyCreate);
  const [fileLabel, setFileLabel] = useState("");

  const isEdit = mode === "edit";
  const fieldsLocked = isEdit;

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/brands"))
      .then((res) => res.json())
      .then((data: BrandOption[]) => setBrands(data))
      .catch((err) => console.error(err));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setForm(emptyCreate);
      setFileLabel("");
      return;
    }
    if (!order) return;
    setForm({
      codOrderHead: order.codOrderHead ?? "",
      idDlkBrand: order.idDlkBrand ?? 0,
      quantityOrderHead: order.quantityOrderHead ?? "",
      fecEntry: toInputDate(order.fecEntry),
      dateProbableDespatch: toInputDate(order.dateProbableDespatch),
      stageOrderHead: order.stageOrderHead ?? 1,
      concluido: statusToConcluido(order.statusStageOrderHead),
      flgStatutActif: 1,
      archivoBase64: "",
      archivoNombre: "",
    });
    setFileLabel("");
  }, [open, mode, order]);

  useEffect(() => {
    if (!open || mode !== "edit" || !order?.idDlkOrderHead) return;
    fetch(apiUrl(`/api/order-heads/${order.idDlkOrderHead}`))
      .then((res) => res.json())
      .then((row: { flgStatutActif?: number | null; hasArchivo?: boolean }) => {
        if (row.flgStatutActif != null) {
          setForm((f) => ({ ...f, flgStatutActif: row.flgStatutActif! }));
        }
        if (row.hasArchivo) setFileLabel("Archivo adjunto");
      })
      .catch(() => {});
  }, [open, mode, order?.idDlkOrderHead]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.codOrderHead.trim() && !isEdit) {
      alert("El código es obligatorio");
      return;
    }
    if (!form.idDlkBrand && !isEdit) {
      alert("Selecciona una marca");
      return;
    }
    setSaving(true);
    try {
      const statusStageOrderHead = concluidoToStatus(Number(form.concluido));
      const qty =
        form.quantityOrderHead === "" || form.quantityOrderHead === null
          ? null
          : Number(form.quantityOrderHead);

      if (mode === "create") {
        const res = await fetch(apiUrl("/api/order-heads"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codOrderHead: form.codOrderHead.trim(),
            idDlkBrand: form.idDlkBrand,
            quantityOrderHead: qty,
            fecEntry: form.fecEntry || null,
            dateProbableDespatch: form.dateProbableDespatch || null,
            stageOrderHead: form.stageOrderHead,
            statusStageOrderHead,
            archivoBase64: form.archivoBase64 || null,
            archivoNombre: form.archivoNombre.trim() || null,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al crear");
        }
        const created = await res.json().catch(() => ({}));
        const n = typeof created.importedDetailCount === "number" ? created.importedDetailCount : 0;
        if (n > 0) {
          alert(`Orden creada. Se importaron ${n} filas de detalle desde el Excel en OD_ORDER_DETAIL.`);
        }
      } else if (order) {
        const putBody: Record<string, unknown> = {
          codOrderHead: form.codOrderHead.trim(),
          idDlkBrand: form.idDlkBrand,
          quantityOrderHead: qty,
          fecEntry: form.fecEntry || null,
          dateProbableDespatch: form.dateProbableDespatch || null,
          stageOrderHead: form.stageOrderHead,
          statusStageOrderHead,
          flgStatutActif: form.flgStatutActif,
        };
        if (form.archivoBase64 === "__CLEAR__") {
          putBody.clearArchivo = true;
        } else if (form.archivoBase64) {
          putBody.archivoBase64 = form.archivoBase64;
        }
        const res = await fetch(apiUrl(`/api/order-heads/${order.idDlkOrderHead}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(putBody),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al actualizar");
        }
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileLabel(file.name);
    const b64 = await readFileAsBase64(file);
    setForm((f) => ({ ...f, archivoBase64: b64, archivoNombre: file.name }));
  }

  function clearFile() {
    setFileLabel("");
    setForm((f) => ({
      ...f,
      archivoBase64: isEdit ? "__CLEAR__" : "",
      archivoNombre: "",
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear orden" : "Actualizar orden"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label>Código</Label>
            <Input
              value={form.codOrderHead}
              onChange={(e) => setForm((f) => ({ ...f, codOrderHead: e.target.value }))}
              disabled={fieldsLocked}
              required={!isEdit}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Marca</Label>
            <Select
              value={form.idDlkBrand ? String(form.idDlkBrand) : ""}
              onValueChange={(v) => setForm((f) => ({ ...f, idDlkBrand: Number(v) }))}
              disabled={fieldsLocked}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.idDlkBrand} value={String(b.idDlkBrand)}>
                    {b.nameBrand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Cantidad</Label>
            <Input
              type="number"
              min={0}
              value={form.quantityOrderHead}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  quantityOrderHead: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
              disabled={fieldsLocked}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha ingreso</Label>
            <Input
              type="date"
              value={form.fecEntry}
              onChange={(e) => setForm((f) => ({ ...f, fecEntry: e.target.value }))}
              disabled={fieldsLocked}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha probable despacho</Label>
            <Input
              type="date"
              value={form.dateProbableDespatch}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateProbableDespatch: e.target.value }))
              }
              disabled={fieldsLocked}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Archivo</Label>
            <p className="text-xs text-muted-foreground">
              Excel (.xlsx / .xls) de OP: se importan todas las columnas reconocidas (tela, estilo,
              colorway, tallas, total, imagen embebida). Solo se guardan filas que tengan{" "}
              <span className="font-medium">COD ESTILO</span> y <span className="font-medium">ESTILO</span>{" "}
              en la misma fila (filas vacías en esas columnas no se importan; la tela puede repetirse por
              combinadas).
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={onFileChange}
                className="cursor-pointer"
              />
              {fileLabel && (
                <span className="text-xs text-muted-foreground">{fileLabel}</span>
              )}
              {fileLabel && (
                <Button type="button" variant="outline" size="sm" onClick={clearFile}>
                  Quitar
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Etapa</Label>
            <Select
              value={String(form.stageOrderHead)}
              onValueChange={(v) => setForm((f) => ({ ...f, stageOrderHead: Number(v) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORDER_HEAD_STAGES).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Concluido</Label>
            <Select
              value={String(form.concluido)}
              onValueChange={(v) => setForm((f) => ({ ...f, concluido: Number(v) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No</SelectItem>
                <SelectItem value="1">Sí</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isEdit && (
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={String(form.flgStatutActif)}
                onValueChange={(v) => setForm((f) => ({ ...f, flgStatutActif: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full bg-primary" disabled={saving}>
            {saving ? "Guardando…" : mode === "create" ? "Crear" : "Actualizar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
