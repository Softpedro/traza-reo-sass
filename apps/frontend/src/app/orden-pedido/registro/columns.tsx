"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ORDER_HEAD_STAGES,
  ORDER_HEAD_STATUS,
} from "./constants";

export type OrderHeadRow = {
  idDlkOrderHead: number;
  idDlkBrand: number | null;
  codOrderHead: string | null;
  quantityOrderHead: number | null;
  fecEntry: string | null;
  dateProbableDespatch: string | null;
  stageOrderHead: number | null;
  statusStageOrderHead: number | null;
  brand: { idDlkBrand: number; nameBrand: string; codBrand: string } | null;
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE");
}

function formatQty(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString("es-PE");
}

type ColProps = {
  onEdit: (row: OrderHeadRow) => void;
  onVer: (row: OrderHeadRow) => void;
  onDetalle: (row: OrderHeadRow) => void;
};

export function getOrderHeadColumns({
  onEdit,
  onVer,
  onDetalle,
}: ColProps): ColumnDef<OrderHeadRow>[] {
  return [
    {
      accessorKey: "codOrderHead",
      header: "Orden pedido",
      cell: ({ row }) => row.original.codOrderHead ?? "—",
    },
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row }) => row.original.brand?.nameBrand ?? "—",
    },
    {
      accessorKey: "quantityOrderHead",
      header: "Cantidad",
      cell: ({ row }) => formatQty(row.original.quantityOrderHead),
    },
    {
      accessorKey: "fecEntry",
      header: "Fecha ingreso",
      cell: ({ row }) => formatDate(row.original.fecEntry),
    },
    {
      accessorKey: "dateProbableDespatch",
      header: "Probable despacho",
      cell: ({ row }) => formatDate(row.original.dateProbableDespatch),
    },
    {
      accessorKey: "stageOrderHead",
      header: "Etapa",
      cell: ({ row }) => {
        const s = row.original.stageOrderHead;
        return s != null ? (ORDER_HEAD_STAGES[s] ?? String(s)) : "—";
      },
    },
    {
      accessorKey: "statusStageOrderHead",
      header: "Estado",
      cell: ({ row }) => {
        const s = row.original.statusStageOrderHead;
        return s != null ? (ORDER_HEAD_STATUS[s] ?? String(s)) : "—";
      },
    },
    {
      id: "accion",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onEdit(row.original)}
          >
            Editar
          </button>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onVer(row.original)}
          >
            Ver
          </button>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onDetalle(row.original)}
          >
            Detalle
          </button>
        </div>
      ),
    },
  ];
}
