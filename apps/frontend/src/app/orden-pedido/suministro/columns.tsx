"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ORDER_HEAD_STAGES, SUMINISTRO_STATUS } from "./constants";

export type SuministroRow = {
  idDlkOrderHead: number;
  idDlkBrand: number | null;
  codOrderHead: string | null;
  quantityOrderHead: number | null;
  fecEntry: string | null;
  dateProbableDespatch: string | null;
  stageOrderHead: number | null;
  statusStageOrderHead: number | null;
  fehFileSuppliesUdp: string | null;
  fehFileSuppliesProd: string | null;
  fehFileSuppliesFinal: string | null;
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
  onCrear: (row: SuministroRow) => void;
  onEditar: (row: SuministroRow) => void;
  onDetalle: (row: SuministroRow) => void;
};

export function getSuministroColumns({
  onCrear,
  onEditar,
  onDetalle,
}: ColProps): ColumnDef<SuministroRow>[] {
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
        return s != null ? (SUMINISTRO_STATUS[s] ?? String(s)) : "—";
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onCrear(row.original)}
          >
            Crear
          </button>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onEditar(row.original)}
          >
            Editar
          </button>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onDetalle(row.original)}
          >
            Ver Detalle
          </button>
        </div>
      ),
    },
  ];
}
