"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { apiUrl } from "@/lib/api";
import { SUMINISTRO_STATUS } from "../../../suministro/constants";

export type SuministroDetailRow = {
  idDlkOrderDetail: number;
  idDlkOrderHead: number | null;
  codOrderDetail: string | null;
  codEstilo: string | null;
  nomEstilo: string | null;
  totalEstilo: number | null;
  /** Reutilizado como estado de suministro por ítem (1=Sin Iniciar, 2=Iniciado, 3=Concluido). */
  stateOrderDetail: number | null;
  flgStatutActif: number | null;
  hasImgEstilo: boolean;
};

function formatQty(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString("es-PE");
}

type ColumnOpts = {
  headId: number;
  codOrderHead: string | null;
  onCrear: (row: SuministroDetailRow) => void;
  onEditar: (row: SuministroDetailRow) => void;
  onVer: (row: SuministroDetailRow) => void;
  imageVersion?: number;
};

export function getSuministroStepColumns({
  headId,
  codOrderHead,
  onCrear,
  onEditar,
  onVer,
  imageVersion = 0,
}: ColumnOpts): ColumnDef<SuministroDetailRow>[] {
  return [
    {
      id: "ordenPedido",
      header: "Orden de Pedido",
      cell: () => (
        <span className="font-medium text-primary underline underline-offset-2">
          {codOrderHead ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "codOrderDetail",
      header: "Orden Producción",
      cell: ({ row }) => {
        const cod = row.original.codOrderDetail ?? "—";
        return (
          <button
            type="button"
            onClick={() => onVer(row.original)}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {cod}
          </button>
        );
      },
    },
    {
      accessorKey: "codEstilo",
      header: "Cod Estilo",
      cell: ({ row }) => row.original.codEstilo ?? "—",
    },
    {
      accessorKey: "nomEstilo",
      header: "Estilo",
      cell: ({ row }) => (
        <span className="max-w-[220px] line-clamp-2" title={row.original.nomEstilo ?? ""}>
          {row.original.nomEstilo ?? "—"}
        </span>
      ),
    },
    {
      id: "imagen",
      header: "Imagen",
      cell: ({ row }) => {
        const r = row.original;
        if (!r.hasImgEstilo) return "—";
        const base = apiUrl(`/api/order-heads/${headId}/details/${r.idDlkOrderDetail}/image`);
        const src = imageVersion > 0 ? `${base}?v=${imageVersion}` : base;
        return (
          // eslint-disable-next-line @next/next/no-img-element -- binario servido por API propia
          <img
            src={src}
            alt={r.nomEstilo?.trim() ? r.nomEstilo : "Estilo"}
            className="h-12 w-12 rounded border border-border object-cover bg-muted"
            loading="lazy"
          />
        );
      },
    },
    {
      accessorKey: "totalEstilo",
      header: "Total",
      cell: ({ row }) => formatQty(row.original.totalEstilo),
    },
    {
      accessorKey: "stateOrderDetail",
      header: "Estado",
      cell: ({ row }) => {
        const s = row.original.stateOrderDetail;
        return s != null ? (SUMINISTRO_STATUS[s] ?? String(s)) : SUMINISTRO_STATUS[1];
      },
    },
    {
      id: "detalleSuministro",
      header: "Detalle Suministro",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
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
            onClick={() => onVer(row.original)}
          >
            Ver
          </button>
        </div>
      ),
    },
  ];
}
