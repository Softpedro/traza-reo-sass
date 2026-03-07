"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type FacilityMaquila = {
  idDlkFacilityMaquila: number;
  codFacilityMaquila: string;
  nameFacilityMaquila: string;
  codGlnFacilityMaquila: string | null;
  registryFacilityMaquila: string;
  identifierFacilityMaquila: string;
  stateFacilityMaquila: number;
  maquila?: {
    idDlkMaquila: number;
    codMaquila: string;
    nameMaquila: string;
  } | null;
};

export function getColumns(
  onEdit: (item: FacilityMaquila) => void,
  onView: (item: FacilityMaquila) => void
): ColumnDef<FacilityMaquila>[] {
  return [
    {
      accessorKey: "codFacilityMaquila",
      header: "Código",
    },
    {
      id: "maquila",
      header: "Maquila",
      cell: ({ row }) => {
        const m = row.original.maquila;
        return (
          <span className="text-primary font-medium">
            {m ? m.nameMaquila : "Sin maquila"}
          </span>
        );
      },
    },
    {
      accessorKey: "nameFacilityMaquila",
      header: "Fábrica",
    },
    {
      accessorKey: "codGlnFacilityMaquila",
      header: "GLN",
    },
    {
      accessorKey: "stateFacilityMaquila",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateFacilityMaquila") as number;
        return (
          <span className={state === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {state === 1 ? "On" : "Off"}
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
            Editar
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

