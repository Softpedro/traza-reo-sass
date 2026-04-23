"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@fullstack-reo/ui";

export type Avios = {
  idDlkAvio: number;
  codAvio: string;
  idDlkSupplier: number;
  codSupplier: string;
  typeAvio: string | null;
  nameAvio: string | null;
  materialAvio: string | null;
  contentValueMaterial: number | null;
  contentSourceMaterial: string | null;
  materialTradeMarks: string | null;
  color: string | null;
  weight: number | null;
  unitMeasurement: string | null;
  recycled: number | null;
  percentageRecycledMaterials: number | null;
  recycledInputSource: string | null;
  certificates: string | null;
  observation: string | null;
  stateAvios: number | null;
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
  onEdit: (row: Avios) => void,
  onView: (row: Avios) => void
): ColumnDef<Avios>[] {
  return [
    { accessorKey: "codAvio", header: "Código" },
    {
      id: "nameAvio",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {row.original.nameAvio ?? row.original.materialTradeMarks ?? "—"}
        </span>
      ),
    },
    {
      id: "typeAvio",
      header: "Tipo",
      cell: ({ row }) => <span>{row.original.typeAvio ?? "—"}</span>,
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
      id: "fechaCarga",
      header: "Fecha de carga",
      cell: ({ row }) => <span>{formatDate(row.original.fehProcesoCargaDl)}</span>,
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
