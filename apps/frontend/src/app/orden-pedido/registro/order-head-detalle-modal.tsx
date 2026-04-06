"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { OrderHeadRow } from "./columns";
import {
  ORDER_HEAD_STAGES,
  ORDER_HEAD_STATUS,
  ACTIVO_OPTIONS,
} from "./constants";

type Detail = OrderHeadRow & {
  hasArchivo?: boolean;
  flgStatutActif?: number | null;
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE");
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number | null;
  summary: OrderHeadRow | null;
};

export function OrderHeadDetalleModal({
  open,
  onOpenChange,
  orderId,
  summary,
}: Props) {
  const [row, setRow] = useState<Detail | null>(null);

  useEffect(() => {
    if (!open || !orderId) {
      setRow(null);
      return;
    }
    let cancelled = false;
    fetch(apiUrl(`/api/order-heads/${orderId}`))
      .then((res) => res.json())
      .then((data: Detail) => {
        if (!cancelled) setRow(data);
      })
      .catch(() => {
        if (!cancelled && summary) {
          setRow({ ...summary, hasArchivo: false } as Detail);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, orderId, summary]);

  const d = row ?? (summary as Detail | null);
  if (!d) return null;

  const stage =
    d.stageOrderHead != null ? ORDER_HEAD_STAGES[d.stageOrderHead] ?? d.stageOrderHead : "—";
  const status =
    d.statusStageOrderHead != null
      ? ORDER_HEAD_STATUS[d.statusStageOrderHead] ?? d.statusStageOrderHead
      : "—";
  const activo =
    d.flgStatutActif != null
      ? ACTIVO_OPTIONS.find((o) => o.value === d.flgStatutActif)?.label ?? String(d.flgStatutActif)
      : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle orden {d.codOrderHead ?? ""}</DialogTitle>
        </DialogHeader>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">ID orden</dt>
            <dd className="font-medium tabular-nums">{d.idDlkOrderHead}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Código</dt>
            <dd className="font-medium">{d.codOrderHead ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Marca</dt>
            <dd className="text-right font-medium">{d.brand?.nameBrand ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Cantidad</dt>
            <dd className="font-medium">
              {d.quantityOrderHead != null ? d.quantityOrderHead.toLocaleString("es-PE") : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Fecha ingreso</dt>
            <dd className="font-medium">{formatDate(d.fecEntry)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Probable despacho</dt>
            <dd className="font-medium">{formatDate(d.dateProbableDespatch)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Etapa</dt>
            <dd className="font-medium">{stage}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Estado avance</dt>
            <dd className="font-medium">{status}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Estado registro</dt>
            <dd className="font-medium">{activo}</dd>
          </div>
          <div className="flex flex-col gap-2 border-b py-2">
            <dt className="text-muted-foreground">Archivo</dt>
            <dd>
              {d.hasArchivo ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Archivo adjunto</span>
                  {orderId ? (
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={apiUrl(`/api/order-heads/${orderId}/file`)} download>
                        Descargar
                      </a>
                    </Button>
                  ) : null}
                </div>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
