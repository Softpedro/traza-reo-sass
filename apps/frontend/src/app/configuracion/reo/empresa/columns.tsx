"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type ParentCompany = {
  idDlkParentCompany: number;
  codParentCompany: string;
  codGlnParentCompany: string;
  nameParentCompany: string;
  categoryParentCompany: number;
  numRucParentCompany: string;
  codUbigeoParentCompany: string;
  addressParentCompany: string;
  locationParentCompany: string;
  emailParentCompany: string;
  cellularParentCompany: string;
  webParentCompany: string;
  canisterDataParentCompany: string;
  canisterAssetsParentCompany: string;
  logoParentCompany: string | null;
  stateParentCompany: number;
};

export function getColumns(
  onEdit: (empresa: ParentCompany) => void,
  onView: (empresa: ParentCompany) => void
): ColumnDef<ParentCompany>[] {
  return [
    {
      accessorKey: "codParentCompany",
      header: "Código",
    },
    {
      accessorKey: "nameParentCompany",
      header: "Empresa",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {row.getValue("nameParentCompany")}
        </span>
      ),
    },
    {
      accessorKey: "numRucParentCompany",
      header: "RUC",
    },
    {
      accessorKey: "codGlnParentCompany",
      header: "GLN",
    },
    {
      accessorKey: "stateParentCompany",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateParentCompany") as number;
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
