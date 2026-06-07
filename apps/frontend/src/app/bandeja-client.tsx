"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { DataTable, Input } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getBandejaColumns, type OrderHeadRow } from "./bandeja-columns";

/**
 * Tarjetas DPP. Placeholders: aún no hay endpoint de métricas en el backend
 * (no existe fuente para "Prendas con DPP" / "lecturas" / "transacciones").
 */
const DPP_STATS: { value: string; label: string }[] = [
  { value: "1'000,000", label: "Total de Prendas con DPP" },
  { value: "20'000,000", label: "Total de lecturas de DPP" },
  { value: "30'000,000", label: "Total de transacciones realizadas" },
];

export function BandejaClient() {
  const [rows, setRows] = useState<OrderHeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    apiFetch("/api/order-heads")
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
        setLoadError(
          err instanceof Error ? err.message : "No se pudieron cargar las órdenes"
        );
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo(() => getBandejaColumns(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.codOrderHead, r.brand?.nameBrand]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">BANDEJA</h1>

      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código o empresa…"
          className="h-11 rounded-full bg-muted pr-11"
        />
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Orden de Pedido</h2>

        {loadError && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {loadError}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando órdenes…</p>
        ) : (
          <div className="[&_thead_tr]:bg-orange-100 [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900">
            <DataTable columns={columns} data={filtered} />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-4">
          {DPP_STATS.map((stat) => (
            <div
              key={stat.label}
              className="relative rounded-md border-2 border-neutral-900 px-6 py-4 text-center"
            >
              <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-neutral-900" />
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
