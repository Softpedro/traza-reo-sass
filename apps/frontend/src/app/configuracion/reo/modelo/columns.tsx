"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type ModelRow = {
  idDlkModel: number;
  codModel: string | null;
  nameModel: string | null;
  stateModel: number | null;
  idDlkBrand: number | null;
  idDlkSubbrand: number | null;
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
  subbrand?: {
    idDlkSubbrand: number;
    codSubbrand: string;
    nameSubbrand: string;
  } | null;
};

export function getModelColumns(): ColumnDef<ModelRow>[] {
  return [
    {
      accessorKey: "codModel",
      header: "Código",
      cell: ({ row }) => row.original.codModel ?? "—",
    },
    {
      accessorKey: "nameModel",
      header: "Modelo",
      cell: ({ row }) => (
        <span className="text-primary font-medium">{row.original.nameModel ?? "—"}</span>
      ),
    },
    {
      id: "marca",
      header: "Marca",
      cell: ({ row }) => row.original.brand?.nameBrand ?? "—",
    },
    {
      id: "submarca",
      header: "Submarca",
      cell: ({ row }) => row.original.subbrand?.nameSubbrand ?? "—",
    },
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row }) => {
        const pc = row.original.brand?.parentCompany;
        return pc ? `${pc.codParentCompany ?? ""} - ${pc.nameParentCompany}` : "—";
      },
    },
    {
      accessorKey: "stateModel",
      header: "Estado",
      cell: ({ row }) => {
        const s = row.original.stateModel;
        return (
          <span className={s === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {s === 1 ? "On" : "Off"}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      // Inertes por ahora: la edición del modelo se implementa en una fase posterior.
      cell: () => (
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span>Editar</span>
          <span>Ver</span>
        </div>
      ),
    },
  ];
}
