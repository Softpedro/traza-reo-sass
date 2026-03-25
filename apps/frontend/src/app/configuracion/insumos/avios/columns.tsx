"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@fullstack-reo/ui";

export type Avios = {
  idDlkAvios: number;
  codAvios: string;
  idDlkSupplier: number;
  codSupplier: string;
  nameAvios: string;
  desAvios?: string | null;
  obsAvios?: string | null;
  stateAvios: number;
  flgStatutActif?: number;
  supplier?: {
    idDlkSupplier: number;
    codSupplier: string;
    nameSupplier: string;
  } | null;
};

export function getColumns(
  onEdit: (row: Avios) => void,
  onView: (row: Avios) => void
): ColumnDef<Avios>[] {
  return [
    { accessorKey: "codAvios", header: "Código" },
    {
      accessorKey: "nameAvios",
      header: "Avío",
      cell: ({ row }) => (
        <span className="text-primary font-medium">{row.getValue("nameAvios")}</span>
      ),
    },
    {
      id: "proveedor",
      header: "Proveedor",
      cell: ({ row }) => {
        const s = row.original.supplier;
        if (!s?.nameSupplier) return <span>—</span>;
        return (
          <Link
            href="/configuracion/insumos/proveedores"
            className="text-primary font-medium underline underline-offset-2 hover:opacity-80"
          >
            {s.nameSupplier}
          </Link>
        );
      },
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const active = (row.original.flgStatutActif ?? row.original.stateAvios) === 1;
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
