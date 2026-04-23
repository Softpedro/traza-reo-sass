"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import type { Eslabon } from "./columns";
import { EslabonChainFlow } from "./eslabon-chain-flow";

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

  const flowKey = useMemo(
    () => sorted.map((e) => e.idDlkProductionChain).join("-"),
    [sorted]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama de la cadena de Producci?n</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuraci?n &gt; Cadena de Producci?n &gt; Eslab?n &gt; Diagrama general
        </p>

        <div className="flex flex-col gap-6 py-4">
          {sorted.length > 0 ? (
            <EslabonChainFlow key={flowKey} eslabones={eslabones} />
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              No hay eslabones para mostrar en el diagrama.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
