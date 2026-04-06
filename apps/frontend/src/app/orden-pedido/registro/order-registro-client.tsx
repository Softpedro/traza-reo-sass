"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getOrderHeadColumns, type OrderHeadRow } from "./columns";
import { OrderHeadModal } from "./order-head-modal";
import { OrderHeadVerModal } from "./order-head-ver-modal";

export type OrderRegistroClientProps = {
  /** Texto pequeño encima del título (ej. "Orden de Pedido"). */
  kicker?: string;
  /** Título principal de la página. */
  title?: string;
};

export function OrderRegistroClient({
  kicker = "Orden de Pedido",
  title = "Registro",
}: OrderRegistroClientProps) {
  const router = useRouter();
  const [rows, setRows] = useState<OrderHeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [verOpen, setVerOpen] = useState(false);
  const [selected, setSelected] = useState<OrderHeadRow | null>(null);

  const fetchRows = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetch(apiUrl("/api/order-heads"))
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json();
      })
      .then((data: OrderHeadRow[]) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setLoadError(err instanceof Error ? err.message : "No se pudieron cargar las órdenes");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const columns = useMemo(
    () =>
      getOrderHeadColumns({
        onEdit: (row) => {
          setSelected(row);
          setEditOpen(true);
        },
        onVer: (row) => {
          setSelected(row);
          setVerOpen(true);
        },
        onDetalle: (row) => {
          router.push(`/orden-pedido/registro/${row.idDlkOrderHead}/detalle`);
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
          onClick={() => setCreateOpen(true)}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loadError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando órdenes…</p>
      ) : (
        <div className="[&_thead_tr]:bg-orange-100 [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900">
          <DataTable columns={columns} data={rows} />
        </div>
      )}

      <OrderHeadModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        order={null}
        onSuccess={fetchRows}
      />
      <OrderHeadModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        order={selected}
        onSuccess={fetchRows}
      />
      <OrderHeadVerModal open={verOpen} onOpenChange={setVerOpen} order={selected} />
    </div>
  );
}
