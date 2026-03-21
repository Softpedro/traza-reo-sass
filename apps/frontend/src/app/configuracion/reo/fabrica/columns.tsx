"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type Facility = {
  idDlkFacility: number;
  codFacility: string;
  nameFacility: string;
  codGlnFacility: string;
  registryFacility: string;
  identifierFacility: string;
  codUbigeo: number;
  addressFacility: string;
  gpsLocationFacility: string | null;
  emailFacility: string;
  cellularFacility: string;
  stateFacility: number;
  parentCompany?: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

export function getColumns(
  onEdit: (facility: Facility) => void,
  onView: (facility: Facility) => void
): ColumnDef<Facility>[] {
  return [
    {
      accessorKey: "codFacility",
      header: "Código",
    },
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row }) => {
        const pc = row.original.parentCompany;
        return (
          <span className="text-primary font-medium">
            {pc ? `${pc.codParentCompany} - ${pc.nameParentCompany}` : "Sin empresa"}
          </span>
        );
      },
    },
    {
      accessorKey: "nameFacility",
      header: "Fábrica",
    },
    {
      accessorKey: "codGlnFacility",
      header: "GLN",
    },
    {
      accessorKey: "stateFacility",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateFacility") as number;
        return (
          <span className={state === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {state === 1 ? "Activa" : "Desactivada"}
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

