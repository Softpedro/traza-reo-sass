"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type UserReo = {
  idDlkUserReo: number;
  codUserReo: string;
  codParentCompany?: string;
  documentType?: number;
  documentNumber?: string;
  nameUser: string;
  paternalLastNameUser: string;
  maternalLastNameUser: string;
  sexUser?: string;
  positionUser: number;
  emailUser: string;
  cellularUser?: string;
  userLogin?: string;
  /** Data URL desde API (foto binaria mapeada en backend). La contraseña no se expone en el API. */
  photograph?: string | null;
  rolUser: number;
  stateUser: number;
  parentCompany?: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

/** Valores almacenados en POSITION_USER (MD_USER_REO) */
export const POSITION_USER_LABELS: Record<number, string> = {
  1: "Gerente General",
  2: "Gerente Comercial",
  3: "Gerente Financiero",
};

/** Valores almacenados en ROL_USER */
export const ROL_USER_LABELS: Record<number, string> = {
  1: "Operador",
  2: "Administrador",
  3: "Auditor",
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
      cell: ({ row }) => {
        const pos = row.getValue("positionUser") as number;
        return POSITION_USER_LABELS[pos] ?? `Cargo ${pos}`;
      },
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
        return ROL_USER_LABELS[rol] ?? `Rol ${rol}`;
      },
    },
    {
      accessorKey: "stateUser",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateUser") as number;
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

