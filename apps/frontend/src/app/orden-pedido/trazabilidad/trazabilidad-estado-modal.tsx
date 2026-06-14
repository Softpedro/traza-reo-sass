"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { TrazabilidadRow } from "./columns";
import { TRAZABILIDAD_STATUS_OPTIONS, ACTIVO_OPTIONS } from "./constants";

/** El modal solo necesita estos campos; lo usan tanto la lista como el detalle. */
export type TrazabilidadEstadoOrder = Pick<
  TrazabilidadRow,
  "idDlkOrderHead" | "codOrderHead" | "statusStageOrderHead" | "flgStatutActif" | "brand"
>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: TrazabilidadEstadoOrder | null;
  onSuccess: () => void;
};

export function TrazabilidadEstadoModal({ open, onOpenChange, order, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<number>(1);
  const [flgActivo, setFlgActivo] = useState<number>(1);

  const marca = order?.brand?.nameBrand ?? "—";
  const codOrden = order?.codOrderHead ?? "—";

  useEffect(() => {
    if (!open) return;
    setStatus(order?.statusStageOrderHead ?? 1);
    setFlgActivo(order?.flgStatutActif ?? 1);
  }, [open, order]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order?.idDlkOrderHead) return;
    setSaving(true);
    try {
      const res = await apiFetch(
        `/api/order-heads/${order.idDlkOrderHead}/trazabilidad-estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            statusStageOrderHead: status,
            flgStatutActif: flgActivo,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.error || "Error al actualizar el estado de la trazabilidad"
        );
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar trazabilidad</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-muted-foreground">Marca:</span>
            <span className="font-medium">{marca}</span>
            <span className="text-muted-foreground">Orden de Pedido:</span>
            <span className="font-medium">{codOrden}</span>
          </div>

          <div className="space-y-1.5">
            <Label>Trazabilidad</Label>
            <Select value={String(status)} onValueChange={(v) => setStatus(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRAZABILIDAD_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Al marcar <span className="font-medium">Concluido</span> la orden pasa a
              Lista Negra y deja de listarse aquí.
            </p>
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

          <Button type="submit" className="w-full bg-primary" disabled={saving}>
            {saving ? "Guardando…" : "Actualizar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
