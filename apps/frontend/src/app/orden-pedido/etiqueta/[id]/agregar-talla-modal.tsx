"use client";

import { useEffect, useMemo, useState } from "react";
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
import { apiFetch } from "@/lib/api-fetch";
import { SIZE_FIELDS, type Colorway, type OrderHeadInfo } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHeadInfo | null;
  colorway: Colorway | null;
  onSuccess: () => void;
}

/**
 * Modal para agregar manualmente una talla a un colorway. Actualiza
 * directamente OD_ORDER_DETAIL.size_X — la nueva talla aparecerá como una fila
 * más en la tabla al refetch.
 */
export function AgregarTallaModal({ open, onOpenChange, order, colorway, onSuccess }: Props) {
  const [field, setField] = useState<string>("");
  const [cantidad, setCantidad] = useState("");
  const [saving, setSaving] = useState(false);

  /** Tallas que aún no están activas (cantidad 0 o null) — candidatas para agregar. */
  const inactivas = useMemo(() => {
    if (!colorway) return [];
    return SIZE_FIELDS.filter((s) => {
      const q = colorway[s.field] as number | null;
      return q == null || q <= 0;
    });
  }, [colorway]);

  useEffect(() => {
    if (!open) return;
    setField("");
    setCantidad("");
  }, [open]);

  async function handleSubmit() {
    if (!order || !colorway) return;
    if (!field) {
      alert("Seleccioná una talla");
      return;
    }
    const qty = Number(cantidad);
    if (!Number.isFinite(qty) || qty <= 0) {
      alert("Ingresá una cantidad mayor a 0");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch(
        apiUrl(`/api/order-heads/${order.idDlkOrderHead}/details/${colorway.idDlkOrderDetail}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: qty }),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Error ${res.status} al agregar la talla`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al agregar la talla");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Agregar talla</DialogTitle>
          <DialogDescription>
            La talla se sumará al colorway {colorway?.codOrderDetail ?? ""} con la cantidad indicada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Talla</Label>
            <Select value={field} onValueChange={setField}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar talla" />
              </SelectTrigger>
              <SelectContent>
                {inactivas.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Todas las tallas ya están activas
                  </div>
                ) : (
                  inactivas.map((s) => (
                    <SelectItem key={String(s.field)} value={String(s.field)}>
                      {s.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Cantidad</Label>
            <Input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Unidades"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || inactivas.length === 0}>
            {saving ? "Guardando…" : "Agregar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
