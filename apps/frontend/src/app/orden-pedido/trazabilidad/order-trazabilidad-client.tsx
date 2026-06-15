"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getTrazabilidadColumns, type TrazabilidadRow } from "./columns";
import { STAGE_TRAZABILIDAD } from "./constants";
import { TrazabilidadEstadoModal } from "./trazabilidad-estado-modal";

export type OrderTrazabilidadClientProps = {
  kicker?: string;
  title?: string;
};

export function OrderTrazabilidadClient({
  kicker = "Orden de Pedido",
  title = "Trazabilidad",
}: OrderTrazabilidadClientProps) {
  const router = useRouter();
  const [rows, setRows] = useState<TrazabilidadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [estadoOrder, setEstadoOrder] = useState<TrazabilidadRow | null>(null);
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
      .then((data: TrazabilidadRow[]) => {
        // Solo se muestran órdenes actualmente en Trazabilidad (stage===5).
        // Las concluidas pasan a Lista Negra y dejan de aparecer aquí.
        const visible = Array.isArray(data)
          ? data.filter((r) => (r.stageOrderHead ?? 1) === STAGE_TRAZABILIDAD)
          : [];
        setRows(visible);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las órdenes de trazabilidad"
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
      getTrazabilidadColumns({
        onOpen: (row) =>
          router.push(`/orden-pedido/trazabilidad/${row.idDlkOrderHead}`),
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
        <button
          type="button"
          className="self-start text-sm font-medium text-primary hover:underline sm:self-auto"
          onClick={() => router.push("/orden-pedido/trazabilidad/historial")}
        >
          Historial por SGTIN →
        </button>
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
          No hay órdenes en Trazabilidad. Una orden aparece aquí cuando se marca como
          Concluida en Ruta.
        </p>
      ) : (
        <div className="[&_thead_tr]:bg-orange-100 [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900">
          <DataTable columns={columns} data={rows} />
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium">OBS:</span> Etapa: 1=Registro, 2=Suministro,
        3=Etiqueta, 4=Ruta, 5=Trazabilidad, 6=Lista negra · Estado: 1=Sin Iniciar,
        2=Iniciado, 3=Concluido. Al actualizar se modifican los campos de Etapa y Estado en
        OD_ORDER_HEAD.
      </p>

      <TrazabilidadEstadoModal
        open={estadoOpen}
        onOpenChange={setEstadoOpen}
        order={estadoOrder}
        onSuccess={fetchRows}
      />
    </div>
  );
}
