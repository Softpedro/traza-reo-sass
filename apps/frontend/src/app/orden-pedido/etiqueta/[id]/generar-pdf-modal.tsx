"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { LabelHead, OrderHeadInfo } from "./types";

/** Único tamaño soportado: 40 × 100 mm. */
const LABEL_SIZE = "40x100";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHeadInfo | null;
  /** Etiqueta puntual a generar; si es null, se generan TODAS las de la orden. */
  labelHead: LabelHead | null;
}

/**
 * Modal "Generar": elige el tamaño y descarga el PDF imprimible de etiquetas
 * (una página por unidad/DPP). Formato pensado para la impresora GODEX G500.
 */
export function GenerarPdfModal({ open, onOpenChange, order, labelHead }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAll = labelHead === null;

  async function handleGenerate() {
    if (!order) return;
    setGenerating(true);
    setError(null);
    try {
      const base = `/api/order-heads/${order.idDlkOrderHead}/labels`;
      const url = isAll
        ? `${base}/pdf?size=${LABEL_SIZE}`
        : `${base}/${labelHead!.idDlkOrderLabelHead}/pdf?size=${LABEL_SIZE}`;

      const res = await apiFetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Error ${res.status} al generar el PDF`);
      }

      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const filename = isAll
        ? `etiquetas-orden-${order.idDlkOrderHead}-${LABEL_SIZE}.pdf`
        : `etiqueta-${labelHead!.idDlkOrderLabelHead}-${LABEL_SIZE}.pdf`;
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al generar el PDF");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generar PDF de etiquetas</DialogTitle>
          <DialogDescription>
            {isAll
              ? "Genera un PDF con TODAS las etiquetas creadas de esta orden."
              : `Genera el PDF de la etiqueta ${labelHead?.codEstilo ?? ""} ${
                  labelHead?.nameEstilo ?? ""
                }`.trim()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-muted-foreground">Orden:</span>
            <span className="font-medium">{order?.codOrderHead ?? "—"}</span>
            {!isAll && (
              <>
                <span className="text-muted-foreground">Unidades / DPPs:</span>
                <span className="font-medium">{labelHead?.totalLabel ?? "—"}</span>
              </>
            )}
          </div>

          <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Formato: <strong>40 × 100 mm</strong>. Una página = una etiqueta (un DPP).
            Al imprimir en la GODEX G500, usa escala <strong>100%</strong> — no
            &quot;ajustar a página&quot; — para conservar las medidas en milímetros.
          </p>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-center pt-1">
          <Button onClick={handleGenerate} disabled={generating} className="bg-primary">
            {generating ? "Generando…" : "Generar y descargar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
