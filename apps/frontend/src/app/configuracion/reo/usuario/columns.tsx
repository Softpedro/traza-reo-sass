"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type UserReo = {
  idDlkUserReo: number;
  codUserReo: string;
  nameUser: string;
  paternalLastNameUser: string;
  maternalLastNameUser: string;
  positionUser: number;
  emailUser: string;
  rolUser: number;
  stateUser: number;
  parentCompany?: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

const ROL_LABELS: Record<number, string> = {
  1: "Rol 1",
  2: "Rol 2",
  3: "Rol 3",
};

export function getColumns(
  onEdit: (user: UserReo) => void,
  onView: (user: UserReo) => void
): ColumnDef<UserReo>[] {
  return [
    {
      accessorKey: "codUserReo",
      header: "Código",
    },
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row }) => {
        const pc = row.original.parentCompany;
        return pc ? pc.nameParentCompany : "Sin empresa";
      },
    },
    {
      id: "usuario",
      header: "Usuario",
      cell: ({ row }) => {
        const u = row.original;
        return `${u.nameUser} ${u.paternalLastNameUser} ${u.maternalLastNameUser}`.trim();
      },
    },
    {
      accessorKey: "positionUser",
      header: "Cargo",
    },
    {
      accessorKey: "emailUser",
      header: "Correo",
    },
    {
      accessorKey: "rolUser",
      header: "Rol",
      cell: ({ row }) => {
        const rol = row.getValue("rolUser") as number;
        return ROL_LABELS[rol] ?? `Rol ${rol}`;
      },
    },
    {
      accessorKey: "stateUser",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateUser") as number;
        return (
          <span className={state === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {state === 1 ? "Online" : "Offline"}
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

