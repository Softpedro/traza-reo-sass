"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { LabelDetail, LabelHead, OrderHeadInfo } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHeadInfo | null;
  labelHead: LabelHead | null;
}

/** Modal "Ver": el detalle 1 a 1 (unidades serializadas con su DPP). */
export function EtiquetaDetalleModal({ open, onOpenChange, order, labelHead }: Props) {
  const [items, setItems] = useState<LabelDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(() => {
    if (!order || !labelHead) return;
    setLoading(true);
    setError(null);
    apiFetch(
      `/api/order-heads/${order.idDlkOrderHead}/labels/${labelHead.idDlkOrderLabelHead}/details?take=2000`
    )
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok || typeof data !== "object" || data === null) {
          throw new Error("No se pudo cargar el detalle");
        }
        const d = data as { items?: LabelDetail[]; total?: number };
        setItems(Array.isArray(d.items) ? d.items : []);
        setTotal(d.total ?? 0);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error al cargar");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [order, labelHead]);

  useEffect(() => {
    if (open) fetchDetails();
  }, [open, fetchDetails]);

  /** Resumen + paridad por grupo de set para sombrear las piezas de cada set. */
  const { unidades, hasSets, groupParity } = useMemo(() => {
    const units = new Set<number>();
    const parity = new Map<string, number>();
    let g = 0;
    let sets = false;
    for (const it of items) {
      units.add(it.itemGlobal);
      if (it.pieceType) sets = true;
      if (it.setGroupId && !parity.has(it.setGroupId)) parity.set(it.setGroupId, g++);
    }
    return { unidades: units.size, hasSets: sets, groupParity: parity };
  }, [items]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalle de etiqueta — {labelHead?.codEstilo ?? ""} {labelHead?.nameEstilo ?? ""}
          </DialogTitle>
          <DialogDescription>
            Unidades serializadas con su código DPP.
            {total > 0 && (
              <>
                {" "}
                <strong>{unidades}</strong> {unidades === 1 ? "unidad" : "unidades"} ·{" "}
                <strong>{total}</strong> DPPs
                {hasSets && unidades > 0 ? ` (${total / unidades} piezas por unidad)` : ""}.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Sin unidades serializadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-orange-100 text-left text-neutral-900">
                  <th className="border px-2 py-1.5 font-semibold">Item</th>
                  <th className="border px-2 py-1.5 font-semibold">Ítem talla</th>
                  <th className="border px-2 py-1.5 font-semibold">Talla</th>
                  <th className="border px-2 py-1.5 font-semibold">Pieza</th>
                  <th className="border px-2 py-1.5 font-semibold">Serial</th>
                  <th className="border px-2 py-1.5 font-semibold">sGTIN</th>
                  <th className="border px-2 py-1.5 font-semibold">QR / DPP</th>
                  <th className="border px-2 py-1.5 font-semibold">Color</th>
                  <th className="border px-2 py-1.5 font-semibold">Estampado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => {
                  const setShade =
                    d.setGroupId && (groupParity.get(d.setGroupId) ?? 0) % 2 === 1
                      ? "bg-amber-50/70"
                      : "";
                  return (
                  <tr
                    key={d.idDlkOrderLabelDetail}
                    className={
                      d.isBlacklisted === 1
                        ? "bg-red-50"
                        : `${setShade} hover:bg-muted/40`
                    }
                  >
                    <td className="border px-2 py-1">{d.itemGlobal}</td>
                    <td className="border px-2 py-1">{d.itemBySize}</td>
                    <td className="border px-2 py-1">{d.size ?? "—"}</td>
                    <td className="border px-2 py-1">{d.pieceType ?? "—"}</td>
                    <td className="border px-2 py-1 font-mono">{d.serialNumber}</td>
                    <td className="border px-2 py-1 font-mono">{d.sgtinFull}</td>
                    <td className="border px-2 py-1">
                      <a
                        href={d.urlDppFull}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        {d.urlDppFull}
                      </a>
                    </td>
                    <td className="border px-2 py-1">{d.color ?? "—"}</td>
                    <td className="border px-2 py-1">{d.print ?? "—"}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
