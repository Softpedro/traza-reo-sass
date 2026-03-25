"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { labelProveedorTipo } from "./proveedor-tipo";

export type Supplier = {
  idDlkSupplier: number;
  codSupplier: string;
  nameSupplier: string;
  /** Alias API de RUC_SUPPLIER */
  numRucSupplier: string;
  rucSupplier?: string;
  typeSupplier: number;
  codUbigeoSupplier?: number;
  addressSupplier?: string;
  gpsLocationSupplier?: string | null;
  emailSupplier: string;
  cellularSupplier?: string;
  webSupplier?: string | null;
  logoSupplier?: string | null;
  stateSupplier: number;
  flgStatutActif?: number;
};

export function getColumns(
  onEdit: (row: Supplier) => void,
  onView: (row: Supplier) => void
): ColumnDef<Supplier>[] {
  return [
    {
      accessorKey: "codSupplier",
      header: "Código",
    },
    {
      accessorKey: "nameSupplier",
      header: "Empresa",
      cell: ({ row }) => (
        <span className="text-primary font-medium">{row.getValue("nameSupplier")}</span>
      ),
    },
    {
      accessorKey: "numRucSupplier",
      header: "RUC",
    },
    {
      accessorKey: "typeSupplier",
      header: "Tipo",
      cell: ({ row }) => labelProveedorTipo(row.original.typeSupplier),
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const active = (row.original.flgStatutActif ?? row.original.stateSupplier) === 1;
        return (
          <span className={active ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {active ? "Activo" : "Inactivo"}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => onEdit(row.original)}>
            Editar
          </Button>
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => onView(row.original)}>
            Ver
          </Button>
        </div>
      ),
    },
  ];
}
