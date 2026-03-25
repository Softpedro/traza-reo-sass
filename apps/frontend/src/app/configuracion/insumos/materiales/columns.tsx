"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type Material = {
  idDlkMaterial: number;
  codMaterial: string;
  idDlkSupplier: number;
  codSupplier: string;
  nameMaterial: string;
  desMaterial?: string | null;
  obsMaterial?: string | null;
  stateMaterial: number;
  flgStatutActif?: number;
  supplier?: {
    idDlkSupplier: number;
    codSupplier: string;
    nameSupplier: string;
  } | null;
};

export function getColumns(
  onEdit: (row: Material) => void,
  onView: (row: Material) => void
): ColumnDef<Material>[] {
  return [
    {
      accessorKey: "codMaterial",
      header: "Código",
    },
    {
      accessorKey: "nameMaterial",
      header: "Material",
      cell: ({ row }) => (
        <span className="text-primary font-medium">{row.getValue("nameMaterial")}</span>
      ),
    },
    {
      id: "proveedor",
      header: "Proveedor",
      cell: ({ row }) => {
        const s = row.original.supplier;
        const label = s ? s.nameSupplier : "—";
        return <span className="text-primary font-medium">{label}</span>;
      },
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const active = (row.original.flgStatutActif ?? row.original.stateMaterial) === 1;
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
