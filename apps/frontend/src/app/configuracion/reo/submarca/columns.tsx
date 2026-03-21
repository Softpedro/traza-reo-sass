"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type Subbrand = {
  idDlkSubbrand: number;
  codSubbrand: string;
  codBrand?: string;
  nameSubbrand: string;
  codUbigeoSubbrand?: number;
  addressSubbrand?: string;
  locationSubbrand?: string | null;
  emailSubbrand?: string;
  cellularSubbrand?: string;
  facebookSubbrand?: string | null;
  instagramSubbrand?: string | null;
  whatsappSubbrand?: string | null;
  ecommerceSubbrand?: string | null;
  logoSubbrand?: string | null;
  stateSubbrand: number;
  brand?: {
    idDlkBrand: number;
    codBrand: string;
    nameBrand: string;
    parentCompany?: {
      idDlkParentCompany: number;
      codParentCompany: string;
      nameParentCompany: string;
    } | null;
  } | null;
};

export function getColumns(
  onEdit: (item: Subbrand) => void,
  onView: (item: Subbrand) => void
): ColumnDef<Subbrand>[] {
  return [
    {
      accessorKey: "codSubbrand",
      header: "Código",
    },
    {
      id: "marca",
      header: "Marca",
      cell: ({ row }) => {
        const b = row.original.brand;
        return b ? b.nameBrand : "Sin marca";
      },
    },
    {
      accessorKey: "nameSubbrand",
      header: "Submarca",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {row.getValue("nameSubbrand")}
        </span>
      ),
    },
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row }) => {
        const pc = row.original.brand?.parentCompany;
        return pc
          ? `${pc.codParentCompany ?? ""} - ${pc.nameParentCompany}`
          : "Sin empresa";
      },
    },
    {
      accessorKey: "stateSubbrand",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateSubbrand") as number;
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
            Ver detalle
          </Button>
        </div>
      ),
    },
  ];
}

