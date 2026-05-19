"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { LabelDetail, LabelHead, OrderHeadInfo } from "./types";

/** Escapa texto para insertarlo de forma segura en el HTML del PDF. */
function escapeHtml(value: unknown): string {
  return String(value ?? "—").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c
  );
}

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

  /** Abre el detalle en una ventana aparte en formato horizontal y lanza el diálogo de PDF. */
  const handleExportPdf = useCallback(() => {
    if (items.length === 0) return;
    const win = window.open("", "_blank");
    if (!win) {
      setError("El navegador bloqueó la ventana de exportación. Habilita las ventanas emergentes.");
      return;
    }

    const fondoTela = labelHead?.orderDetail?.fondoTela ?? "—";
    const titulo = `${labelHead?.codEstilo ?? ""} ${labelHead?.nameEstilo ?? ""}`.trim() || "Etiqueta";
    const ordenTxt = order?.codOrderHead ? `Orden ${order.codOrderHead}` : "";
    const resumen =
      total > 0
        ? `${unidades} ${unidades === 1 ? "unidad" : "unidades"} · ${total} DPPs` +
          (hasSets && unidades > 0 ? ` (${total / unidades} piezas por unidad)` : "")
        : "";

    const filas = items
      .map(
        (d) => `<tr${d.isBlacklisted === 1 ? ' class="bl"' : ""}>
          <td>${escapeHtml(d.itemGlobal)}</td>
          <td>${escapeHtml(d.itemBySize)}</td>
          <td>${escapeHtml(d.size ?? "—")}</td>
          <td>${escapeHtml(d.pieceType ?? "—")}</td>
          <td class="mono">${escapeHtml(d.serialNumber)}</td>
          <td class="mono">${escapeHtml(d.sgtinFull)}</td>
          <td class="mono url">${escapeHtml(d.urlDppFull)}</td>
          <td>${escapeHtml(d.color ?? "—")}</td>
          <td>${escapeHtml(fondoTela)}</td>
          <td>${escapeHtml(d.print ?? "—")}</td>
        </tr>`
      )
      .join("");

    win.document.write(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Detalle de etiqueta — ${escapeHtml(titulo)}</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; margin: 0; padding: 16px; }
  h1 { font-size: 15px; margin: 0 0 2px; }
  .meta { font-size: 11px; color: #555; margin: 0 0 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 9px; }
  th, td { border: 1px solid #999; padding: 3px 5px; text-align: left; }
  thead th { background: #ffedd5; color: #1a1a1a; font-weight: 700; }
  tbody tr:nth-child(even) { background: #f7f7f7; }
  tbody tr.bl { background: #fde2e1; }
  .mono { font-family: "Courier New", monospace; }
  .url { word-break: break-all; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
</style>
</head>
<body onload="window.focus();window.print();">
  <h1>Detalle de etiqueta — ${escapeHtml(titulo)}</h1>
  <p class="meta">${escapeHtml([ordenTxt, resumen].filter(Boolean).join(" · "))}</p>
  <table>
    <thead>
      <tr>
        <th>Item</th><th>Ítem talla</th><th>Talla</th><th>Pieza</th><th>Serial</th>
        <th>sGTIN</th><th>QR / DPP</th><th>Color</th><th>Fondo de tela</th><th>Estampado</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
</body>
</html>`);
    win.document.close();
  }, [items, labelHead, order, unidades, total, hasSets]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={items.length === 0}
          className="absolute right-12 top-4 inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <FileDown className="h-3.5 w-3.5" />
          Exportar PDF
        </button>

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
                  <th className="border px-2 py-1.5 font-semibold">Fondo de tela</th>
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
                    <td className="border px-2 py-1">{labelHead?.orderDetail?.fondoTela ?? "—"}</td>
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
