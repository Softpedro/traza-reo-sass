"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getSuministroColumns, type SuministroRow } from "./columns";
import { STAGE_SUMINISTRO } from "./constants";
import { SuministroModal } from "./suministro-modal";

export type OrderSuministroClientProps = {
  kicker?: string;
  title?: string;
};

export function OrderSuministroClient({
  kicker = "Orden de Pedido",
  title = "Suministro"}: OrderSuministroClientProps) {
  const router = useRouter();
  const [rows, setRows] = useState<SuministroRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<SuministroRow | null>(null);

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
      .then((data: SuministroRow[]) => {
        // Se muestran las órdenes en Suministro (stage===2, editables) y las que ya
        // pasaron por aquí (stage>2, en solo lectura). Se excluye Lista negra (stage 6).
        const visible = Array.isArray(data)
          ? data.filter((r) => {
              const s = r.stageOrderHead ?? 1;
              return s >= STAGE_SUMINISTRO && s < 6;
            })
          : [];
        setRows(visible);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las órdenes de suministro"
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
      getSuministroColumns({
        stage: STAGE_SUMINISTRO,
        onCrear: (row) => {
          setSelected(row);
          setCreateOpen(true);
        },
        onEditar: (row) => {
          setSelected(row);
          setEditOpen(true);
        },
        onDetalle: (row) => {
          router.push(`/orden-pedido/registro/${row.idDlkOrderHead}/detalle?step=2`);
        }}),
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
          No hay órdenes en Suministro. Una orden aparece aquí cuando se marca como
          Concluida en Registro.
        </p>
      ) : (
        <div className="[&_thead_tr]:bg-orange-100 [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900">
          <DataTable
            columns={columns}
            data={rows}
            rowClassName={(r) =>
              (r.stageOrderHead ?? 1) > STAGE_SUMINISTRO
                ? "bg-muted/40 text-muted-foreground"
                : undefined
            }
          />
        </div>
      )}

      <SuministroModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        order={selected}
        onSuccess={fetchRows}
      />
      <SuministroModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        order={selected}
        onSuccess={fetchRows}
      />
    </div>
  );
}
