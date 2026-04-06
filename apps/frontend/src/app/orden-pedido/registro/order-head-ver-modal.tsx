"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@fullstack-reo/ui";
import type { OrderHeadRow } from "./columns";
import { ORDER_HEAD_STAGES, ORDER_HEAD_STATUS } from "./constants";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE");
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHeadRow | null;
};

/** Vista rápida solo con datos ya cargados en la tabla (sin llamada al API). */
export function OrderHeadVerModal({ open, onOpenChange, order }: Props) {
  if (!order) return null;

  const stage =
    order.stageOrderHead != null
      ? ORDER_HEAD_STAGES[order.stageOrderHead] ?? order.stageOrderHead
      : "—";
  const status =
    order.statusStageOrderHead != null
      ? ORDER_HEAD_STATUS[order.statusStageOrderHead] ?? order.statusStageOrderHead
      : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ver orden {order.codOrderHead ?? ""}</DialogTitle>
        </DialogHeader>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">ID orden</dt>
            <dd className="font-medium tabular-nums">{order.idDlkOrderHead}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Código</dt>
            <dd className="font-medium">{order.codOrderHead ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Marca</dt>
            <dd className="text-right font-medium">{order.brand?.nameBrand ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Cantidad</dt>
            <dd className="font-medium">
              {order.quantityOrderHead != null
                ? order.quantityOrderHead.toLocaleString("es-PE")
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Fecha ingreso</dt>
            <dd className="font-medium">{formatDate(order.fecEntry)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Probable despacho</dt>
            <dd className="font-medium">{formatDate(order.dateProbableDespatch)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Etapa</dt>
            <dd className="font-medium">{stage}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-1">
            <dt className="text-muted-foreground">Estado</dt>
            <dd className="font-medium">{status}</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
