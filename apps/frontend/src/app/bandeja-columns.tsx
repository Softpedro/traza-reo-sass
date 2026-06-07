"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ORDER_HEAD_STAGES } from "./orden-pedido/registro/constants";
import type { OrderHeadRow } from "./orden-pedido/registro/columns";

export type { OrderHeadRow };

/** Ruta del listado de cada etapa del flujo Orden de pedido. */
const STAGE_HREF: Record<number, string> = {
  1: "/orden-pedido/registro",
  2: "/orden-pedido/suministro",
  3: "/orden-pedido/etiqueta",
  4: "/orden-pedido/ruta",
  5: "/orden-pedido/trazabilidad",
  6: "/orden-pedido/lista-negra",
};

/** Estado del avance en la bandeja: en curso vs. concluido. */
const BANDEJA_ESTADO: Record<number, string> = {
  1: "En proceso",
  2: "Atendido",
};

const LAST_STAGE = 6;

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

export function getBandejaColumns(): ColumnDef<OrderHeadRow>[] {
  return [
    {
      accessorKey: "codOrderHead",
      header: "Código",
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
      header: "Fecha Ingreso",
      cell: ({ row }) => formatDate(row.original.fecEntry),
    },
    {
      accessorKey: "dateProbableDespatch",
      header: "Probable Despacho",
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
        return s != null ? (BANDEJA_ESTADO[s] ?? String(s)) : "—";
      },
    },
    {
      id: "siguiente",
      header: "Siguiente",
      cell: ({ row }) => {
        const stage = row.original.stageOrderHead ?? 1;
        const next = stage + 1;
        if (stage >= LAST_STAGE || !STAGE_HREF[next]) return "—";
        return (
          <Link
            href={STAGE_HREF[next]}
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
          >
            {ORDER_HEAD_STAGES[next]}
          </Link>
        );
      },
    },
  ];
}
