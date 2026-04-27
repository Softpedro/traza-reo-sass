"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { EtiquetaRow } from "./columns";
import {
  ACTIVO_OPTIONS,
  concluidoToStatus,
  statusToConcluido,
} from "./constants";

type ModalMode = "create" | "edit";

type DigitalIdentifier = {
  idDlkDigitalIdentifier: number;
  codDigitalIdentifier: string;
  typeDigitalIdentifier: string | null;
};

type LabelHead = {
  idDlkOrderLabelHead: number;
  idDlkOrderHead: number;
  idDlkDigitalIdentifier: number;
  codOrderLabel: string | null;
  codEstilo: string | null;
  nameEstilo: string | null;
  codGtin: string | null;
  identifierType: string | null;
  inicioSerializacion: number | null;
  finSerializacion: number | null;
  totalLabel: number | null;
  flgStatutActif: number | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  order: EtiquetaRow | null;
  onSuccess: () => void;
};

const emptyForm = {
  idDlkDigitalIdentifier: 0,
  codOrderLabel: "",
  codEstilo: "",
  nameEstilo: "",
  codGtin: "",
  inicioSerializacion: "" as string | number,
  finSerializacion: "" as string | number,
  totalLabel: "" as string | number,
  size: "",
  color: "",
  print: "",
  urlDppTemplate: "",
};

export function EtiquetaModal({ open, onOpenChange, mode, order, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [identifiers, setIdentifiers] = useState<DigitalIdentifier[]>([]);
  const [labelHead, setLabelHead] = useState<LabelHead | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [concluido, setConcluido] = useState(0);
  const [flgActivo, setFlgActivo] = useState(1);

  const isEdit = mode === "edit";
  const title = isEdit ? "Actualizar etiqueta" : "Crear etiqueta";

  const marca = useMemo(() => order?.brand?.nameBrand ?? "—", [order]);
  const codOrden = useMemo(() => order?.codOrderHead ?? "—", [order]);

  // Carga catálogo de identificadores digitales al abrir.
  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/digital-identifiers"))
      .then((res) => res.json())
      .then((data: DigitalIdentifier[]) => setIdentifiers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, [open]);

  // Si entramos en modo edit, intentamos cargar la primera cabecera de etiqueta de la orden.
  useEffect(() => {
    if (!open || !order?.idDlkOrderHead) return;
    setLabelHead(null);
    setForm(emptyForm);
    setConcluido(statusToConcluido(order.statusStageOrderHead));
    if (mode !== "edit") return;
    fetch(apiUrl(`/api/order-heads/${order.idDlkOrderHead}/labels`))
      .then((res) => res.json())
      .then((rows: LabelHead[]) => {
        const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        if (!first) return;
        setLabelHead(first);
        setForm({
          idDlkDigitalIdentifier: first.idDlkDigitalIdentifier ?? 0,
          codOrderLabel: first.codOrderLabel ?? "",
          codEstilo: first.codEstilo ?? "",
          nameEstilo: first.nameEstilo ?? "",
          codGtin: first.codGtin ?? "",
          inicioSerializacion: first.inicioSerializacion ?? "",
          finSerializacion: first.finSerializacion ?? "",
          totalLabel: first.totalLabel ?? "",
          size: "",
          color: "",
          print: "",
          urlDppTemplate: "",
        });
        setFlgActivo(first.flgStatutActif ?? 1);
      })
      .catch((err) => console.error(err));
  }, [open, mode, order]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order?.idDlkOrderHead) return;
    setSaving(true);
    try {
      if (mode === "create") {
        if (!form.idDlkDigitalIdentifier) {
          alert("Selecciona un identificador digital");
          return;
        }
        const inicio = form.inicioSerializacion === "" ? null : Number(form.inicioSerializacion);
        const fin = form.finSerializacion === "" ? null : Number(form.finSerializacion);
        const total = form.totalLabel === "" ? null : Number(form.totalLabel);
        if (inicio == null && fin == null && (total == null || total <= 0)) {
          alert("Define un rango (inicio + fin) o un total > 0");
          return;
        }
        const res = await fetch(
          apiUrl(`/api/order-heads/${order.idDlkOrderHead}/labels`),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idDlkDigitalIdentifier: form.idDlkDigitalIdentifier,
              codOrderLabel: form.codOrderLabel.trim() || null,
              codEstilo: form.codEstilo.trim() || null,
              nameEstilo: form.nameEstilo.trim() || null,
              codGtin: form.codGtin.trim() || null,
              inicioSerializacion: inicio,
              finSerializacion: fin,
              totalLabel: total,
              size: form.size.trim() || null,
              color: form.color.trim() || null,
              print: form.print.trim() || null,
              urlDppTemplate: form.urlDppTemplate.trim() || null,
            }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al crear etiqueta");
        }
        const created = await res.json().catch(() => null);
        const n = created && typeof created.totalLabel === "number" ? created.totalLabel : 0;
        if (n > 0) alert(`Etiqueta creada. Se generaron ${n.toLocaleString("es-PE")} unidades serializadas.`);
      } else {
        if (!labelHead) {
          alert("Esta orden todavía no tiene etiqueta. Crea una primero.");
          return;
        }
        const statusStageOrderHead = concluidoToStatus(concluido);
        const res = await fetch(
          apiUrl(
            `/api/order-heads/${order.idDlkOrderHead}/labels/${labelHead.idDlkOrderLabelHead}`
          ),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              codOrderLabel: form.codOrderLabel.trim() || null,
              codEstilo: form.codEstilo.trim() || null,
              nameEstilo: form.nameEstilo.trim() || null,
              codGtin: form.codGtin.trim() || null,
              statusStageOrderHead,
              flgStatutActif: flgActivo,
            }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al actualizar etiqueta");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-muted-foreground">Marca:</span>
            <span className="font-medium">{marca}</span>
            <span className="text-muted-foreground">Orden de Producción:</span>
            <span className="font-medium">{codOrden}</span>
          </div>

          <div className="space-y-1.5">
            <Label>Identificador digital</Label>
            <Select
              value={form.idDlkDigitalIdentifier ? String(form.idDlkDigitalIdentifier) : ""}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, idDlkDigitalIdentifier: Number(v) }))
              }
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar identificador" />
              </SelectTrigger>
              <SelectContent>
                {identifiers.map((d) => (
                  <SelectItem
                    key={d.idDlkDigitalIdentifier}
                    value={String(d.idDlkDigitalIdentifier)}
                  >
                    {d.codDigitalIdentifier}
                    {d.typeDigitalIdentifier ? ` — ${d.typeDigitalIdentifier}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {identifiers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No hay identificadores activos. Carga al menos uno en{" "}
                <code>MD_DIGITAL_IDENTIFIER</code>.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Código de etiqueta</Label>
            <Input
              value={form.codOrderLabel}
              onChange={(e) => setForm((f) => ({ ...f, codOrderLabel: e.target.value }))}
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Cód. estilo</Label>
              <Input
                value={form.codEstilo}
                onChange={(e) => setForm((f) => ({ ...f, codEstilo: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nombre estilo</Label>
              <Input
                value={form.nameEstilo}
                onChange={(e) => setForm((f) => ({ ...f, nameEstilo: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>GTIN-14</Label>
            <Input
              value={form.codGtin}
              maxLength={14}
              placeholder="Opcional — se usa como base para los sGTIN"
              onChange={(e) => setForm((f) => ({ ...f, codGtin: e.target.value }))}
            />
          </div>

          {!isEdit && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Inicio</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.inicioSerializacion}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        inicioSerializacion:
                          e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Fin</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.finSerializacion}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        finSerializacion:
                          e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Total</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.totalLabel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        totalLabel: e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Define <em>inicio</em> + <em>fin</em>, o solo <em>total</em> (rango 1..total).
                Tope: 100,000 unidades por cabecera.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Talla</Label>
                  <Input
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Color</Label>
                  <Input
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Print</Label>
                  <Input
                    value={form.print}
                    onChange={(e) => setForm((f) => ({ ...f, print: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>URL DPP (plantilla)</Label>
                <Input
                  value={form.urlDppTemplate}
                  placeholder="https://dpp.empresa.com/{sgtin}"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, urlDppTemplate: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          {isEdit && (
            <>
              <div className="space-y-1.5">
                <Label>Concluido</Label>
                <Select
                  value={String(concluido)}
                  onValueChange={(v) => setConcluido(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Sí (promueve a Ruta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select
                  value={String(flgActivo)}
                  onValueChange={(v) => setFlgActivo(Number(v))}
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
            </>
          )}

          <Button type="submit" className="w-full bg-primary" disabled={saving}>
            {saving ? "Guardando…" : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
