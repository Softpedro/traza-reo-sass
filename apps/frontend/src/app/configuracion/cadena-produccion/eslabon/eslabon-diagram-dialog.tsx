"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { getTrazabilidadLabel } from "./obs";
import type { Eslabon } from "./columns";

const BOX_CLASS =
  "rounded-lg border-2 border-black bg-white text-black p-4 min-w-[150px] max-w-[240px] shadow-md flex flex-col items-center justify-center gap-1";

interface EslabonDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eslabones: Eslabon[];
}

export function EslabonDiagramDialog({
  open,
  onOpenChange,
  eslabones,
}: EslabonDiagramDialogProps) {
  const sorted = useMemo(() => {
    return [...eslabones].sort(
      (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
    );
  }, [eslabones]);

  const trazabilidadCode = (e: Eslabon) =>
    getTrazabilidadLabel(e.numPrecedenciaTrazabilidad).split(" ")[0] ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama de la cadena de Producción</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Eslabón &gt; Diagrama general
        </p>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Flujo horizontal: cajas unidas por flechas */}
          <div className="flex flex-wrap items-center justify-center gap-0">
            {sorted.map((e, index) => (
              <div key={e.idDlkProductionChain} className="flex items-center gap-0">
                {index > 0 && (
                  <svg
                    width="32"
                    height="24"
                    viewBox="0 0 32 24"
                    fill="none"
                    className="shrink-0 text-blue-600"
                  >
                    <path
                      d="M0 12h24M24 8L32 12L24 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className={BOX_CLASS}>
                  <span className="text-lg font-bold">
                    {e.numPrecedenciaProductiva}
                  </span>
                  <span className="text-center text-sm font-medium">
                    {trazabilidadCode(e)} - {e.nameProductionChain}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              No hay eslabones para mostrar en el diagrama.
            </p>
          )}

          {/* Leyenda */}
          <div className="w-full rounded-xl border border-sky-200 bg-sky-50/80 p-4 text-sm">
            <div className="font-semibold text-foreground mb-2">Leyenda</div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded border-2 border-black bg-white text-xs font-bold">
                  1
                </span>
                <span>
                  <strong className="text-foreground">Eslabón de la Cadena de Producción:</strong>{" "}
                  Representado por el recuadro con borde.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded border-2 border-black bg-white text-xs font-bold">
                  1
                </span>
                <span>
                  <strong className="text-foreground">Numeral de Secuencia de Cadena de Producción:</strong>{" "}
                  Número en la parte superior del eslabón.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-auto text-center w-32 items-center justify-center rounded border-2 border-black bg-white text-xs">
                  T4 - Cultivo de Algodón
                </span>
                <span>
                  <strong className="text-foreground">Numeral de Trazabilidad y Nombre de la Cadena de Producción:</strong>{" "}
                  Código de trazabilidad y nombre en la parte inferior del eslabón.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
