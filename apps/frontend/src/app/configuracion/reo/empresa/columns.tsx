"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { labelEmpresaCategoria } from "./empresa-categories";
import { labelTipoReoParentCompany } from "./empresa-tipo-reo";

export type ParentCompany = {
  idDlkParentCompany: number;
  codParentCompany: string;
  /** Código REO SaaS */
  idDlkAdmReo?: string | null;
  /** 1–4: Marca Propia, Maquila, Híbrido, Comercializadora */
  typeParentCompany?: number;
  codGlnParentCompany: string;
  nameParentCompany: string;
  categoryParentCompany: number;
  numRucParentCompany: string;
  codUbigeoParentCompany: number;
  addressParentCompany: string;
  /** GPS / localización (columna GPS_LOCATION_PARENT_COMPANY en BD) */
  gpsLocationParentCompany: string | null;
  emailParentCompany: string;
  cellularParentCompany: string;
  webParentCompany: string;
  canisterDataParentCompany: string;
  canisterAssetsParentCompany: string;
  /** Data URL del logo (API serializa Bytes → `data:image/...;base64,...`) */
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
      id: "categoria",
      header: "Categoría",
      cell: ({ row }) => labelEmpresaCategoria(row.original.categoryParentCompany),
    },
    {
      id: "tipoReo",
      header: "Tipo REO",
      cell: ({ row }) =>
        labelTipoReoParentCompany(Number(row.original.typeParentCompany) || 1),
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
