"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ORDER_HEAD_STAGES, ORDER_HEAD_STATUS } from "./constants";

export type RutaRow = {
  idDlkOrderHead: number;
  idDlkBrand: number | null;
  codOrderHead: string | null;
  quantityOrderHead: number | null;
  fecEntry: string | null;
  dateProbableDespatch: string | null;
  stageOrderHead: number | null;
  statusStageOrderHead: number | null;
  flgStatutActif: number | null;
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
  /** Etapa dueña de esta vista; una fila con stage mayor ya pasó y va en solo lectura. */
  stage: number;
  onOpen: (row: RutaRow) => void;
  onUpdateEstado: (row: RutaRow) => void;
};

export function getRutaColumns({ stage, onOpen, onUpdateEstado }: ColProps): ColumnDef<RutaRow>[] {
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
        // Si la orden ya avanzó de etapa, en esta vista su estado es "Concluido".
        if ((row.original.stageOrderHead ?? 1) > stage) return "3. Concluido";
        const s = row.original.statusStageOrderHead;
        return s != null ? (ORDER_HEAD_STATUS[s] ?? String(s)) : "—";
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => {
        // Filas que ya pasaron por Ruta quedan en solo lectura.
        if ((row.original.stageOrderHead ?? 1) > stage) {
          return (
            <span className="text-sm font-medium text-muted-foreground">
              ✓ Completado · solo lectura
            </span>
          );
        }
        return (
          <div className="flex flex-col items-start gap-1">
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => onOpen(row.original)}
            >
              Abrir ruta
            </button>
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => onUpdateEstado(row.original)}
            >
              Actualizar
            </button>
          </div>
        );
      },
    },
  ];
}
