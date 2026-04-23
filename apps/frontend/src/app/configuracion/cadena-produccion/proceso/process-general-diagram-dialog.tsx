"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "./columns";
import { ProcessGeneralChainFlow } from "./process-general-chain-flow";

interface ProcessGeneralDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessGeneralDiagramDialog({
  open,
  onOpenChange,
}: ProcessGeneralDiagramDialogProps) {
  const [eslabones, setEslabones] = useState<Eslabon[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetch(apiUrl("/api/production-chains")).then((r) => r.json()),
      fetch(apiUrl("/api/processes")).then((r) => r.json()),
    ])
      .then(([chains, procs]) => {
        setEslabones(Array.isArray(chains) ? chains : []);
        setProcesses(Array.isArray(procs) ? procs : []);
      })
      .catch((err) => console.error("Error al cargar datos del diagrama:", err))
      .finally(() => setLoading(false));
  }, [open]);

  const sortedEslabones = useMemo(
    () =>
      [...eslabones].sort(
        (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
      ),
    [eslabones]
  );

  const processesByEslabon = useMemo(() => {
    const map = new Map<number, ProcessRow[]>();
    for (const p of processes) {
      const id = p.productionChain?.idDlkProductionChain;
      if (id == null) continue;
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(p);
    }
    map.forEach((list) =>
      list.sort((a, b) => a.ordenPrecedenciaProcess - b.ordenPrecedenciaProcess)
    );
    return map;
  }, [processes]);

  const flowKey = useMemo(
    () =>
      `${sortedEslabones.map((e) => e.idDlkProductionChain).join("-")}|${processes.length}`,
    [sortedEslabones, processes.length]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(1200px,calc(100vw-2rem))] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagrama general de la cadena de Producción</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Diagrama general
        </p>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">
            Cargando diagrama...
          </p>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            {sortedEslabones.length > 0 ? (
              <ProcessGeneralChainFlow
                key={flowKey}
                eslabones={eslabones}
                processesByEslabon={processesByEslabon}
              />
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No hay eslabones para mostrar en el diagrama.
              </p>
            )}

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
