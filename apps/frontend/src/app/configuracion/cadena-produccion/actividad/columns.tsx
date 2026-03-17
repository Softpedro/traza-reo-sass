"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { getTrazabilidadLabel } from "../eslabon/obs";
import { getEstadoLabel } from "./obs";

export type ActivityRow = {
  idDlkActivities: number;
  idDlkSubprocess: number;
  codActivities: string;
  nameActivities: string;
  descriptionActivities: string;
  typeActivities: string;
  orderActivities: number | null;
  estimatedTimeActivities: string | null;
  machineRequired: string | null;
  skillRequired: string | null;
  checklistActivities: string | null;
  stateActivities: number;
  subprocess: {
    idDlkSubprocess: number;
    codSubprocess: string;
    nameSubprocess: string;
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
};

function eslabonDisplay(pc: ActivityRow["subprocess"]["process"]["productionChain"]): string {
  const t = getTrazabilidadLabel(pc.numPrecedenciaTrazabilidad);
  const prefix = t.split(" ")[0];
  return `${prefix} - ${pc.nameProductionChain}`;
}

function processDisplay(p: ActivityRow["subprocess"]["process"]): string {
  return p.codProcess ? `${p.codProcess} - ${p.nameProcess}` : p.nameProcess;
}

function subprocessDisplay(s: ActivityRow["subprocess"]): string {
  return s.codSubprocess ? `${s.codSubprocess} - ${s.nameSubprocess}` : s.nameSubprocess;
}

export function getColumns(
  onEdit: (row: ActivityRow) => void,
  onVerDiagrama?: (row: ActivityRow) => void,
  onProcedureCreate?: (row: ActivityRow) => void,
  onProcedureEdit?: (row: ActivityRow) => void,
  onProcedureView?: (row: ActivityRow) => void,
  onInputCreate?: (row: ActivityRow) => void,
  onInputEdit?: (row: ActivityRow) => void,
  onInputView?: (row: ActivityRow) => void,
  onOutputCreate?: (row: ActivityRow) => void,
  onOutputEdit?: (row: ActivityRow) => void,
  onOutputView?: (row: ActivityRow) => void
): ColumnDef<ActivityRow>[] {
  return [
    {
      id: "secuencia",
      header: "Secuencia",
      cell: ({ row }) => {
        const n = row.original.orderActivities ?? row.original.idDlkActivities;
        return String(n).padStart(2, "0");
      },
    },
    {
      id: "eslabon",
      header: "Eslabón",
      cell: ({ row }) => eslabonDisplay(row.original.subprocess.process.productionChain),
    },
    {
      id: "proceso",
      header: "Proceso",
      cell: ({ row }) => processDisplay(row.original.subprocess.process),
    },
    {
      id: "subproceso",
      header: "Subproceso",
      cell: ({ row }) => subprocessDisplay(row.original.subprocess),
    },
    {
      id: "actividad",
      header: "Actividad",
      cell: ({ row }) => (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 font-medium text-primary"
          onClick={() => onEdit(row.original)}
        >
          {row.original.codActivities ? `${row.original.codActivities} - ${row.original.nameActivities}` : row.original.nameActivities}
        </Button>
      ),
    },
    {
      accessorKey: "descriptionActivities",
      header: "Descripción",
      cell: ({ row }) => {
        const d = row.original.descriptionActivities;
        return d?.length > 60 ? `${d.slice(0, 60)}...` : d;
      },
    },
    {
      accessorKey: "stateActivities",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.stateActivities;
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
