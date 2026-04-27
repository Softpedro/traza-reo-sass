"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getEtiquetaColumns, type EtiquetaRow } from "./columns";
import { EtiquetaModal } from "./etiqueta-modal";
import { STAGE_ETIQUETA } from "./constants";

export type OrderEtiquetaClientProps = {
  kicker?: string;
  title?: string;
};

export function OrderEtiquetaClient({
  kicker = "Orden de Pedido",
  title = "Etiqueta",
}: OrderEtiquetaClientProps) {
  const router = useRouter();
  const [rows, setRows] = useState<EtiquetaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<EtiquetaRow | null>(null);

  const fetchRows = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetch(apiUrl(`/api/order-heads`))
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json();
      })
      .then((data: EtiquetaRow[]) => {
        // Solo se muestran órdenes actualmente en Etiqueta (stage===3).
        // Las concluidas pasan a Ruta y dejan de aparecer aquí.
        const visible = Array.isArray(data)
          ? data.filter((r) => (r.stageOrderHead ?? 1) === STAGE_ETIQUETA)
          : [];
        setRows(visible);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las órdenes de etiqueta"
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
      getEtiquetaColumns({
        onCrear: (row) => {
          setSelected(row);
          setCreateOpen(true);
        },
        onEditar: (row) => {
          setSelected(row);
          setEditOpen(true);
        },
        onDetalle: (row) => {
          router.push(`/orden-pedido/registro/${row.idDlkOrderHead}/detalle?step=3`);
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
          No hay órdenes en Etiqueta. Una orden aparece aquí cuando se marca como
          Concluida en Suministro.
        </p>
      ) : (
        <div className="[&_thead_tr]:bg-orange-100 [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900">
          <DataTable columns={columns} data={rows} />
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium">OBS:</span> Cada cabecera de etiqueta genera N unidades
        serializadas en <code>OD_ORDER_LABEL_DETAIL</code> con su sGTIN y URL DPP. Marcar la
        etapa como <em>Concluido</em> promueve la orden a <em>Ruta</em>.
      </p>

      <EtiquetaModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        order={selected}
        onSuccess={fetchRows}
      />
      <EtiquetaModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        order={selected}
        onSuccess={fetchRows}
      />
    </div>
  );
}
