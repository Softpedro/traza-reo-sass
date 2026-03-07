"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ETAPAS, ESTADOS } from "@/lib/constants";

export type OrdenPedido = {
  idDlkOrdenPedido: number;
  codOrdenPedido: string;
  idDlkParentCompany: number;
  cantidad: number;
  fechaIngreso: string;
  probableDespacho: string;
  etapa: number;
  estado: number;
  parentCompany: { nameParentCompany: string };
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-PE");
}

export const columns: ColumnDef<OrdenPedido>[] = [
  {
    accessorKey: "codOrdenPedido",
    header: "Código",
  },
  {
    id: "empresa",
    header: "Empresa",
    cell: ({ row }) => row.original.parentCompany.nameParentCompany,
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => {
      const value = row.getValue("cantidad") as number;
      return value.toLocaleString("es-PE");
    },
  },
  {
    accessorKey: "fechaIngreso",
    header: "Fecha Ingreso",
    cell: ({ row }) => formatDate(row.getValue("fechaIngreso") as string),
  },
  {
    accessorKey: "probableDespacho",
    header: "Probable Despacho",
    cell: ({ row }) => formatDate(row.getValue("probableDespacho") as string),
  },
  {
    accessorKey: "etapa",
    header: "Etapa",
    cell: ({ row }) => {
      const etapa = row.getValue("etapa") as number;
      return ETAPAS[etapa] ?? etapa;
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estadoNum = row.getValue("estado") as number;
      const estado = ESTADOS[estadoNum] ?? String(estadoNum);
      const colorMap: Record<string, string> = {
        "En proceso": "text-amber-600",
        "Atendido": "text-green-600",
        "Pendiente": "text-blue-600",
      };
      return (
        <span className={`font-medium ${colorMap[estado] ?? ""}`}>
          {estado}
        </span>
      );
    },
  },
  {
    id: "accion",
    header: "Acción",
    cell: ({ row }) => (
      <Link
        href={`/ordenes/${row.original.idDlkOrdenPedido}`}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Ver detalle
      </Link>
    ),
  },
];
