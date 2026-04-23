"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type Material = {
  idDlkMaterial: number;
  codMaterial: string;
  idDlkSupplier: number;
  codSupplier: string;
  material: string | null;
  contentNameMaterial: string | null;
  contentValueMaterial: number | null;
  contentSourceMaterials: string | null;
  materialTradeMarks: string | null;
  recycled: number | null;
  percentageRecycledMaterials: number | null;
  recycledInputSource: string | null;
  renewableMaterial: number | null;
  percentageRenewableMaterial: number | null;
  renewableInputSource: string | null;
  typeDyes: string | null;
  dyeClass: string | null;
  classStandardDyes: string | null;
  finishes: string | null;
  patterns: string | null;
  recoveryMaterials: string | null;
  certification: string | null;
  stateMaterials: number | null;
  flgStatutActif?: number | null;
  fehProcesoCargaDl?: string | null;
  supplier?: {
    idDlkSupplier: number;
    codSupplier: string;
    nameSupplier: string;
  } | null;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
      id: "nombreComercial",
      header: "Nombre Comercial",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {row.original.materialTradeMarks ?? row.original.material ?? "—"}
        </span>
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
      id: "fechaCarga",
      header: "Fecha de carga",
      cell: ({ row }) => <span>{formatDate(row.original.fehProcesoCargaDl)}</span>,
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const active = (row.original.flgStatutActif ?? row.original.stateMaterials) === 1;
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
