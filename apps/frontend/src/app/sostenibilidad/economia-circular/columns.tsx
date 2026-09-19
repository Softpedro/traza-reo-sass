"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

/** Colorway (OD_ORDER_DETAIL) + su orden de pedido, tal como los anida el API. */
export type CircularEconomyOrderDetail = {
  idDlkOrderDetail: number;
  codOrderDetail: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  fondoTela: string | null;
  orderHead?: {
    idDlkOrderHead: number;
    codOrderHead: string | null;
    brand?: { idDlkBrand: number; codBrand: string; nameBrand: string } | null;
  } | null;
};

/**
 * Fila de OD_CIRCULAR_ECONOMY como la devuelve /api/circular-economies.
 * Va a nivel de orden de producción: acá no hay desglose por talla.
 */
export type CircularEconomy = {
  idDlkCircularEconomy: number;
  idDlkOrderDetail: number;
  codCircularEconomy: string;
  /** Nombre de la práctica, p. ej. "Upcycling (Scrunchie)". */
  circularEconomy: string | null;
  /** Nombre del archivo de imagen. */
  image: string | null;
  /** La imagen lista para mostrar; el backend la arma desde el blob. */
  imageDataUrl: string | null;
  description: string | null;
  topic: string | null;
  content: string | null;
  /** Nombre del PDF adjunto. */
  report: string | null;
  /** Sólo en las respuestas de una fila (GET /:id, POST, PUT). */
  hasReportFile?: boolean;
  stateCircularEconomy: number | null;
  orderDetail?: CircularEconomyOrderDetail | null;
};

export function getColumns(
  onEdit: (row: CircularEconomy) => void,
  onView: (row: CircularEconomy) => void
): ColumnDef<CircularEconomy>[] {
  return [
    {
      id: "ordenPedido",
      header: "Orden Pedido",
      cell: ({ row }) => row.original.orderDetail?.orderHead?.codOrderHead ?? "—",
    },
    {
      id: "ordenProduccion",
      header: "Orden Producción",
      cell: ({ row }) => row.original.orderDetail?.codOrderDetail ?? "—",
    },
    {
      accessorKey: "circularEconomy",
      header: "Economía Circular",
      cell: ({ row }) => row.original.circularEconomy ?? "—",
    },
    {
      id: "imagen",
      header: "Imagen",
      cell: ({ row }) => {
        const src = row.original.imageDataUrl;
        if (!src) return <span className="text-muted-foreground">—</span>;
        return (
          // eslint-disable-next-line @next/next/no-img-element -- data URL dinámico, no apto para next/image
          <img
            src={src}
            alt={row.original.circularEconomy ?? "Economía circular"}
            className="h-14 w-14 rounded object-contain"
          />
        );
      },
    },
    {
      id: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <span className="block max-w-[24rem]">{row.original.description ?? "—"}</span>
      ),
    },
    {
      accessorKey: "stateCircularEconomy",
      header: "Estado",
      cell: ({ row }) => {
        const on = row.getValue("stateCircularEconomy") === 1;
        return (
          <span className={on ? "font-medium text-green-600" : "font-medium text-red-600"}>
            {on ? "On" : "Off"}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => onEdit(row.original)}
          >
            Actualizar
          </Button>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => onView(row.original)}
          >
            Ver
          </Button>
        </div>
      ),
    },
  ];
}
