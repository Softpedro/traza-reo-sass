"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { getTrazabilidadLabel, getEstadoLabel } from "../eslabon/obs";

export type SubprocessRow = {
  idDlkSubprocess: number;
  idDlkProcess: number;
  ordenPrecedenciaSubprocess: number | null;
  codSubprocess: string;
  nameSubprocess: string;
  descriptionSubprocess: string;
  stateSubprocess: number;
  objectiveSubprocess?: string | null;
  criticalitySubprocess?: string | null;
  outsourcedSubprocess?: string | null;
  estimatedTimeSubprocess?: number | null;
  responsibleUnit?: string | null;
  responsibleRole?: string | null;
  process: {
    idDlkProcess: number;
    codProcess: string;
    nameProcess: string;
    productionChain: {
      idDlkProductionChain: number;
      numPrecedenciaTrazabilidad: number;
      nameProductionChain: string;
    };
  };
};

function cadenaDisplay(pc: SubprocessRow["process"]["productionChain"]): string {
  const t = getTrazabilidadLabel(pc.numPrecedenciaTrazabilidad);
  const prefix = t.split(" ")[0];
  return `${prefix} - ${pc.nameProductionChain}`;
}

function processDisplay(p: SubprocessRow["process"]): string {
  return p.codProcess ? `${p.codProcess}- ${p.nameProcess}` : p.nameProcess;
}

function subprocessDisplay(row: SubprocessRow): string {
  const { codSubprocess, nameSubprocess } = row;
  return codSubprocess ? `${codSubprocess}- ${nameSubprocess}` : nameSubprocess;
}

export function getColumns(
  onEdit: (row: SubprocessRow) => void,
  onVerDiagrama?: (row: SubprocessRow) => void,
  onProcedureCreate?: (row: SubprocessRow) => void,
  onProcedureEdit?: (row: SubprocessRow) => void,
  onProcedureView?: (row: SubprocessRow) => void,
  onInputCreate?: (row: SubprocessRow) => void,
  onInputEdit?: (row: SubprocessRow) => void,
  onInputView?: (row: SubprocessRow) => void,
  onOutputCreate?: (row: SubprocessRow) => void,
  onOutputEdit?: (row: SubprocessRow) => void,
  onOutputView?: (row: SubprocessRow) => void
): ColumnDef<SubprocessRow>[] {
  return [
    {
      id: "secuencia",
      header: "Secuencia",
      cell: ({ row }) => {
        const n = row.original.ordenPrecedenciaSubprocess;
        return String(n ?? row.original.idDlkSubprocess).padStart(2, "0");
      },
    },
    {
      id: "cadena",
      header: "Cadena de Producción",
      cell: ({ row }) => cadenaDisplay(row.original.process.productionChain),
    },
    {
      id: "proceso",
      header: "Proceso",
      cell: ({ row }) => processDisplay(row.original.process),
    },
    {
      id: "subproceso",
      header: "Sub Proceso",
      cell: ({ row }) => (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 font-medium text-primary"
          onClick={() => onEdit(row.original)}
        >
          {subprocessDisplay(row.original)}
        </Button>
      ),
    },
    {
      accessorKey: "descriptionSubprocess",
      header: "Descripción",
      cell: ({ row }) => {
        const d = row.original.descriptionSubprocess;
        return d?.length > 80 ? `${d.slice(0, 80)}...` : d;
      },
    },
    {
      accessorKey: "stateSubprocess",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.stateSubprocess;
        const label = getEstadoLabel(state);
        return (
          <span className={state === 1 ? "text-green-600 font-medium" : "text-muted-foreground"}>
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
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => onEdit(row.original)}>
            Editar
          </Button>
          {onVerDiagrama && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => onVerDiagrama(row.original)}>
              Ver Diagrama
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
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onProcedureCreate(row.original)}>Crear</Button>
            )}
            {onProcedureEdit && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onProcedureEdit(row.original)}>Editar</Button>
            )}
            {onProcedureView && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onProcedureView(row.original)}>Ver</Button>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            (2) Input
            {onInputCreate && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onInputCreate(row.original)}>Crear</Button>
            )}
            {onInputEdit && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onInputEdit(row.original)}>Editar</Button>
            )}
            {onInputView && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onInputView(row.original)}>Ver</Button>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            (3) Output
            {onOutputCreate && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onOutputCreate(row.original)}>Crear</Button>
            )}
            {onOutputEdit && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onOutputEdit(row.original)}>Editar</Button>
            )}
            {onOutputView && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onOutputView(row.original)}>Ver</Button>
            )}
          </span>
        </div>
      ),
    },
  ];
}
