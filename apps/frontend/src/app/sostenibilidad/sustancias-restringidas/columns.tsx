"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

/** Colorway (OD_ORDER_DETAIL) + su orden de pedido, tal como los anida el API. */
export type RestrictedSubstancesOrderDetail = {
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
 * Fila de OD_RESTRICTED_SUBSTANCES como la devuelve /api/restricted-substances.
 * Va a nivel de orden de producción: acá no hay desglose por talla.
 */
export type RestrictedSubstances = {
  idDlkRestrictedSubstances: number;
  idDlkOrderDetail: number;
  codRestrictedSubstances: string;
  restrictedSubstances: string | null;
  topic: string | null;
  content: string | null;
  chemicalScope: string | null;
  /** Nombre del PDF adjunto. */
  report: string | null;
  /** Sólo en las respuestas de una fila (GET /:id, POST, PUT). */
  hasReportFile?: boolean;
  stateRestrictedSubstances: number | null;
  orderDetail?: RestrictedSubstancesOrderDetail | null;
};

export function getColumns(
  onEdit: (row: RestrictedSubstances) => void,
  onView: (row: RestrictedSubstances) => void
): ColumnDef<RestrictedSubstances>[] {
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
      id: "modelo",
      header: "Modelo / Estilo",
      cell: ({ row }) => (
        <span className="block max-w-[22rem]">{row.original.orderDetail?.nomEstilo ?? "—"}</span>
      ),
    },
    {
      id: "colorWay",
      header: "Color Way",
      cell: ({ row }) => row.original.orderDetail?.colorAway ?? "—",
    },
    {
      id: "fondoTela",
      header: "Fondo Tela",
      cell: ({ row }) => row.original.orderDetail?.fondoTela ?? "—",
    },
    {
      accessorKey: "stateRestrictedSubstances",
      header: "Estado",
      cell: ({ row }) => {
        const on = row.getValue("stateRestrictedSubstances") === 1;
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
