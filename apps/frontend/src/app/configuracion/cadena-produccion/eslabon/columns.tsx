"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { getSecuenciaLabel, getTrazabilidadLabel, getEstadoLabel } from "./obs";

export type Eslabon = {
  idDlkProductionChain: number;
  codProductionChain: string;
  codCategoryProductionChain: number;
  numPrecedenciaTrazabilidad: number;
  numPrecedenciaProductiva: number;
  nameProductionChain: string;
  desProductionChain: string;
  stateProductionChain: number;
};

export function getColumns(onEdit: (row: Eslabon) => void): ColumnDef<Eslabon>[] {
  return [
    {
      id: "secuencia",
      header: "Secuencia",
      cell: ({ row }) => {
        const n = row.original.numPrecedenciaProductiva;
        return String(n).padStart(2, "0");
      },
    },
    {
      id: "eslabon",
      header: "Eslabón",
      cell: ({ row }) => {
        const t = getTrazabilidadLabel(row.original.numPrecedenciaTrazabilidad);
        const name = row.original.nameProductionChain;
        return `${t.split(" ")[0]} - ${name}`;
      },
    },
    {
      accessorKey: "desProductionChain",
      header: "Descripción",
      cell: ({ row }) => {
        const d = row.original.desProductionChain;
        return d?.length > 80 ? `${d.slice(0, 80)}...` : d;
      },
    },
    {
      accessorKey: "stateProductionChain",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.stateProductionChain;
        const label = getEstadoLabel(state);
        return (
          <span className={state === 1 ? "text-green-600 font-medium" : "text-muted-foreground"}>
            {label}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          onClick={() => onEdit(row.original)}
        >
          Editar
        </Button>
      ),
    },
  ];
}
