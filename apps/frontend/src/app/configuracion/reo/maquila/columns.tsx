"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type Maquila = {
  idDlkMaquila: number;
  codMaquila: string;
  nameMaquila: string;
  numRucMaquila: string;
  codGlnMaquila: string | null;
  categoryMaquila?: number;
  codUbigeo: number;
  addressMaquila: string;
  gpsLocationMaquila: string | null;
  emailMaquila: string;
  cellularMaquila: string;
  webMaquila: string;
  /** Data URL del logo (API serializa Bytes → `data:image/...;base64,...`) */
  logoMaquila: string | null;
  stateMaquila: number;
};

export function getColumns(
  onEdit: (maquila: Maquila) => void,
  onView: (maquila: Maquila) => void
): ColumnDef<Maquila>[] {
  return [
    {
      accessorKey: "codMaquila",
      header: "Código",
    },
    {
      accessorKey: "nameMaquila",
      header: "Maquila",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {row.getValue("nameMaquila")}
        </span>
      ),
    },
    {
      accessorKey: "numRucMaquila",
      header: "RUC",
    },
    {
      accessorKey: "codGlnMaquila",
      header: "GLN",
    },
    {
      accessorKey: "stateMaquila",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateMaquila") as number;
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

