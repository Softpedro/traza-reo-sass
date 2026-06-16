"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";

type Scan = {
  idDlkUnitTrace: number;
  sgtinFull: string | null;
  urlDppFull: string | null;
  urlDppTrace: string | null;
  color: string | null;
  size: string | null;
  print: string | null;
  typeEvent: string;
  eventTime: string | null;
  idItemUnicoIot: string | null;
  observationUnitTrace: string | null;
  codUsuarioCargaDl: string | null;
  fecProcesoCargaDl: string | null;
  codActivities: string | null;
  nameActivities: string | null;
  codSubprocess: string | null;
  nameSubprocess: string | null;
  codProcess: string | null;
  nameProcess: string | null;
};

type DppResponse = { pieza: string | null; totalUnits: number; scans: Scan[] };

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("es-PE");
}

function pair(cod: string | null, name: string | null) {
  if (!cod && !name) return "—";
  return [cod, name].filter(Boolean).join(" - ");
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderHeadId: number;
  componentId: number;
  /** Contexto del subproceso abierto (se usa cuando el escaneo no trae su propia ruta). */
  ctxCodProcess: string | null;
  ctxNameProcess: string | null;
  ctxCodSubprocess: string | null;
  ctxNameSubprocess: string | null;
  ctxInicio: string | null;
  pieza: string | null;
  ordenProduccion: string;
  marca: string;
};

export function TrazabilidadDppModal({
  open,
  onOpenChange,
  orderHeadId,
  componentId,
  ctxCodProcess,
  ctxNameProcess,
  ctxCodSubprocess,
  ctxNameSubprocess,
  ctxInicio,
  pieza,
  ordenProduccion,
  marca,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DppResponse | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setData(null);
    apiFetch(`/api/order-heads/${orderHeadId}/components/${componentId}/dpp-scans`)
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json() as Promise<DppResponse>;
      })
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "No se pudieron cargar los DPPs");
      })
      .finally(() => setLoading(false));
  }, [open, orderHeadId, componentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">DPPs escaneados</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-0.5 text-sm">
          <span className="text-muted-foreground">Orden de Produccion:</span>
          <span className="font-medium">{ordenProduccion || "—"}</span>
          <span className="text-muted-foreground">Marca:</span>
          <span className="font-medium">{marca || "—"}</span>
          {pieza && (
            <>
              <span className="text-muted-foreground">Pieza:</span>
              <span className="font-medium">{pieza}</span>
            </>
          )}
          <span className="text-muted-foreground">Subproceso:</span>
          <span className="font-medium">{pair(ctxCodSubprocess, ctxNameSubprocess)}</span>
          {data && (
            <>
              <span className="text-muted-foreground">Prendas / Escaneos:</span>
              <span className="font-medium">
                {data.totalUnits} prendas · {data.scans.length} escaneos
              </span>
            </>
          )}
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Cargando escaneos…</p>
        ) : data && data.scans.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Aún no hay escaneos DPP registrados para esta pieza.
          </p>
        ) : data ? (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-xs">
              <thead className="bg-orange-100 text-neutral-900">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold">Proceso</th>
                  <th className="px-2 py-2 text-left font-semibold">Subproceso</th>
                  <th className="px-2 py-2 text-left font-semibold">Actividad</th>
                  <th className="px-2 py-2 text-left font-semibold">Inicio</th>
                  <th className="px-2 py-2 text-left font-semibold">SGTIN</th>
                  <th className="px-2 py-2 text-left font-semibold">URL</th>
                  <th className="px-2 py-2 text-left font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.scans.map((s) => {
                  const url = s.urlDppTrace || s.urlDppFull;
                  return (
                    <tr key={s.idDlkUnitTrace} className="border-t border-border align-top">
                      <td className="px-2 py-2">
                        {pair(s.codProcess ?? ctxCodProcess, s.nameProcess ?? ctxNameProcess)}
                      </td>
                      <td className="px-2 py-2">
                        {pair(
                          s.codSubprocess ?? ctxCodSubprocess,
                          s.nameSubprocess ?? ctxNameSubprocess
                        )}
                      </td>
                      <td className="px-2 py-2">{pair(s.codActivities, s.nameActivities)}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{fmt(ctxInicio)}</td>
                      <td className="px-2 py-2 font-medium">{s.sgtinFull ?? "—"}</td>
                      <td className="px-2 py-2 max-w-[18rem]">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block truncate text-primary hover:underline"
                            title={url}
                          >
                            {url}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">{fmt(s.eventTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
