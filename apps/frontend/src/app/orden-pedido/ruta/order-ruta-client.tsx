"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getRutaColumns, type RutaRow } from "./columns";
import { STAGE_RUTA } from "./constants";
import { RutaEstadoModal } from "./ruta-estado-modal";

export type OrderRutaClientProps = {
  kicker?: string;
  title?: string;
};

export function OrderRutaClient({
  kicker = "Orden de Pedido",
  title = "Ruta",
}: OrderRutaClientProps) {
  const router = useRouter();
  const [rows, setRows] = useState<RutaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [estadoOrder, setEstadoOrder] = useState<RutaRow | null>(null);
  const [estadoOpen, setEstadoOpen] = useState(false);

  const fetchRows = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    apiFetch(`/api/order-heads`)
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json();
      })
      .then((data: RutaRow[]) => {
        // Solo se muestran órdenes actualmente en Ruta (stage===4).
        // Las concluidas pasan a Trazabilidad y dejan de aparecer aquí.
        const visible = Array.isArray(data)
          ? data.filter((r) => (r.stageOrderHead ?? 1) === STAGE_RUTA)
          : [];
        setRows(visible);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las órdenes de ruta"
        );
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const columns = useMemo(
    () =>
      getRutaColumns({
        onOpen: (row) => router.push(`/orden-pedido/ruta/${row.idDlkOrderHead}`),
        onUpdateEstado: (row) => {
          setEstadoOrder(row);
          setEstadoOpen(true);
        },
      }),
    [router]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{kicker}</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>

      {loadError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando órdenes…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay órdenes en Ruta. Una orden aparece aquí cuando se marca como
          Concluida en Etiqueta.
        </p>
      ) : (
        <div className="[&_thead_tr]:bg-orange-100 [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900">
          <DataTable columns={columns} data={rows} />
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium">OBS:</span> Abre una orden para gestionar su ruta de
        producción (procesos, subprocesos y actividades por componente).
      </p>

      <RutaEstadoModal
        open={estadoOpen}
        onOpenChange={setEstadoOpen}
        order={estadoOrder}
        onSuccess={fetchRows}
      />
    </div>
  );
}
