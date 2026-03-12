"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { getTrazabilidadLabel, getEstadoLabel } from "../eslabon/obs";

export type ProcessRow = {
  idDlkProcess: number;
  ordenPrecedenciaProcess: number;
  codProcess: string;
  nameProcess: string;
  desProcess: string;
  objetiveProcess?: string;
  criticalityProcess?: string;
  outsourcedProcess?: string;
  estimatedTimeProcess?: number;
  responsibleUnit?: string;
  responsibleProcess?: string;
  stateProcess: number;
  productionChain: {
    idDlkProductionChain: number;
    numPrecedenciaTrazabilidad: number;
    nameProductionChain: string;
  };
  parentCompany?: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

function cadenaDisplay(pc: ProcessRow["productionChain"]): string {
  const t = getTrazabilidadLabel(pc.numPrecedenciaTrazabilidad);
  const prefix = t.split(" ")[0];
  return `${prefix} - ${pc.nameProductionChain}`;
}

export function getColumns(
  onEdit: (row: ProcessRow) => void,
  onView?: (row: ProcessRow) => void,
  onDiagrama?: (row: ProcessRow) => void,
  onInputCreate?: (row: ProcessRow) => void,
  onInputEdit?: (row: ProcessRow) => void,
  onInputView?: (row: ProcessRow) => void,
  onOutputCreate?: (row: ProcessRow) => void,
  onOutputEdit?: (row: ProcessRow) => void,
  onOutputView?: (row: ProcessRow) => void,
  onProcedureCreate?: (row: ProcessRow) => void,
  onProcedureEdit?: (row: ProcessRow) => void,
  onProcedureView?: (row: ProcessRow) => void
): ColumnDef<ProcessRow>[] {
  return [
    {
      id: "secuencia",
      header: "Secuencia",
      cell: ({ row }) =>
        String(row.original.ordenPrecedenciaProcess).padStart(2, "0"),
    },
    {
      id: "cadena",
      header: "Cadena de Producción",
      cell: ({ row }) => cadenaDisplay(row.original.productionChain),
    },
    {
      id: "proceso",
      header: "Proceso",
      cell: ({ row }) => {
        const p = row.original;
        const label = p.codProcess ? `${p.codProcess}-${p.nameProcess}` : p.nameProcess;
        return (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 font-medium text-primary"
            onClick={() => onEdit(p)}
          >
            {label}
          </Button>
        );
      },
    },
    {
      accessorKey: "desProcess",
      header: "Descripción",
      cell: ({ row }) => {
        const d = row.original.desProcess;
        return d?.length > 100 ? `${d.slice(0, 100)}...` : d;
      },
    },
    {
      accessorKey: "stateProcess",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.stateProcess;
        const label = getEstadoLabel(state);
        return (
          <span
            className={
              state === 1
                ? "text-green-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {label}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => onEdit(row.original)}
          >
            Editar
          </Button>
          {onView && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => onView(row.original)}
            >
              Ver
            </Button>
          )}
          {onDiagrama && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => onDiagrama(row.original)}
            >
              Diagrama
            </Button>
          )}
        </div>
      ),
    },
    {
      id: "iso9001",
      header: "ISO 9001",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            (1) Procedure
            {onProcedureCreate && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onProcedureCreate(row.original)}>
                Crear
              </Button>
            )}
            {onProcedureEdit && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onProcedureEdit(row.original)}>
                Editar
              </Button>
            )}
            {onProcedureView && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onProcedureView(row.original)}>
                Ver
              </Button>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            (2) Input
            {onInputCreate && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onInputCreate(row.original)}>
                Crear
              </Button>
            )}
            {onInputEdit && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onInputEdit(row.original)}>
                Editar
              </Button>
            )}
            {onInputView && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onInputView(row.original)}>
                Ver
              </Button>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            (3) Output
            {onOutputCreate && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onOutputCreate(row.original)}>
                Crear
              </Button>
            )}
            {onOutputEdit && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onOutputEdit(row.original)}>
                Editar
              </Button>
            )}
            {onOutputView && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onOutputView(row.original)}>
                Ver
              </Button>
            )}
          </span>
        </div>
      ),
    },
  ];
}
