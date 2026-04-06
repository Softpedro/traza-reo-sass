"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { apiUrl } from "@/lib/api";

export type OrderDetailRow = {
  idDlkOrderDetail: number;
  idDlkOrderHead: number | null;
  codOrderDetail: string | null;
  codEstilo: string | null;
  desTela: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  fondoTela: string | null;
  versionTela: string | null;
  size00: number | null;
  size2: number | null;
  size4: number | null;
  size6: number | null;
  size8: number | null;
  size10: number | null;
  size12: number | null;
  sizeS: number | null;
  sizeM: number | null;
  sizeL: number | null;
  hasSupplyFile: boolean;
};

function q(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString("es-PE");
}

export function getOrderDetailColumns(headId: number): ColumnDef<OrderDetailRow>[] {
  return [
    {
      accessorKey: "codOrderDetail",
      header: "Orden producción",
      cell: ({ row }) => row.original.codOrderDetail ?? "—",
    },
    {
      accessorKey: "desTela",
      header: "Tela",
      cell: ({ row }) => (
        <span className="max-w-[220px] line-clamp-2" title={row.original.desTela ?? ""}>
          {row.original.desTela ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "codEstilo",
      header: "Cod estilo",
      cell: ({ row }) => row.original.codEstilo ?? "—",
    },
    {
      accessorKey: "nomEstilo",
      header: "Estilo",
      cell: ({ row }) => (
        <span className="max-w-[160px] line-clamp-2" title={row.original.nomEstilo ?? ""}>
          {row.original.nomEstilo ?? "—"}
        </span>
      ),
    },
    {
      id: "imagen",
      header: "Imagen",
      cell: ({ row }) => {
        const r = row.original;
        if (!r.hasSupplyFile) return "—";
        const src = apiUrl(`/api/order-heads/${headId}/details/${r.idDlkOrderDetail}/image`);
        return (
          // eslint-disable-next-line @next/next/no-img-element -- binario servido por API propia
          <img
            src={src}
            alt={r.nomEstilo?.trim() ? r.nomEstilo : "Estilo"}
            className="h-11 w-11 rounded border border-border object-cover bg-muted"
            loading="lazy"
          />
        );
      },
    },
    {
      accessorKey: "colorAway",
      header: "Color way",
      cell: ({ row }) => row.original.colorAway ?? "—",
    },
    {
      accessorKey: "fondoTela",
      header: "Fondo de tela",
      cell: ({ row }) => row.original.fondoTela ?? "—",
    },
    {
      accessorKey: "versionTela",
      header: "Versión tela",
      cell: ({ row }) => row.original.versionTela ?? "—",
    },
    { accessorKey: "size00", header: "OS", cell: ({ row }) => q(row.original.size00) },
    { accessorKey: "size2", header: "2", cell: ({ row }) => q(row.original.size2) },
    { accessorKey: "size4", header: "4", cell: ({ row }) => q(row.original.size4) },
    { accessorKey: "size6", header: "6", cell: ({ row }) => q(row.original.size6) },
    { accessorKey: "size8", header: "8", cell: ({ row }) => q(row.original.size8) },
    { accessorKey: "size10", header: "10", cell: ({ row }) => q(row.original.size10) },
    { accessorKey: "size12", header: "12", cell: ({ row }) => q(row.original.size12) },
    { accessorKey: "sizeS", header: "S", cell: ({ row }) => q(row.original.sizeS) },
    { accessorKey: "sizeM", header: "M", cell: ({ row }) => q(row.original.sizeM) },
    { accessorKey: "sizeL", header: "L", cell: ({ row }) => q(row.original.sizeL) },
    {
      id: "acciones",
      header: "Acciones",
      cell: () => (
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
          <button type="button" className="font-medium text-primary hover:underline" disabled>
            Editar
          </button>
          <button type="button" className="font-medium text-primary hover:underline" disabled>
            Ver
          </button>
        </div>
      ),
    },
  ];
}
