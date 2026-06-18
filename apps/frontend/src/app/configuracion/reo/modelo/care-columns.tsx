"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type CareRow = {
  idDlkCare: number;
  idDlkModel: number;
  codCare: string;
  nombCare: string;
  carDescription: string;
  carSafety: string | null;
  /** Data URL (la API convierte el binario). */
  carImage: string | null;
  stateCare: number | null;
};

type CareColProps = {
  onEdit: (care: CareRow) => void;
  onView: (care: CareRow) => void;
};

export function getCareColumns({ onEdit, onView }: CareColProps): ColumnDef<CareRow>[] {
  return [
    { accessorKey: "codCare", header: "Código" },
    {
      accessorKey: "nombCare",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.original.nombCare}</span>,
    },
    {
      accessorKey: "carDescription",
      header: "Párrafo",
      cell: ({ row }) => (
        <span className="block max-w-md whitespace-pre-line">{row.original.carDescription}</span>
      ),
    },
    {
      id: "imagen",
      header: "Imagen",
      cell: ({ row }) =>
        row.original.carImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.original.carImage} alt="cuidado" className="h-10 w-auto object-contain" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "stateCare",
      header: "Estado",
      cell: ({ row }) => {
        const s = row.original.stateCare;
        return (
          <span className={s === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {s === 1 ? "Activo" : "Inactivo"}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex gap-3 text-sm">
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            Actualizar
          </button>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
          >
            Ver
          </button>
        </div>
      ),
    },
  ];
}
