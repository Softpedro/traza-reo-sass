"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getOrderDetailColumns, type OrderDetailRow } from "./order-detail-columns";

const PASOS_ORDEN = [
  { step: 1, label: "Registro", href: "/orden-pedido/registro" },
  { step: 2, label: "Suministro", href: "/orden-pedido/suministro" },
  { step: 3, label: "Etiqueta", href: "/orden-pedido/etiqueta" },
  { step: 4, label: "Ruta", href: "/orden-pedido/ruta" },
  { step: 5, label: "Trazabilidad", href: "/orden-pedido/trazabilidad" },
  { step: 6, label: "Lista negra", href: "/orden-pedido/lista-negra" },
] as const;

type HeadSummary = {
  idDlkOrderHead: number;
  codOrderHead: string | null;
};

type Props = {
  headId: number;
};

export function OrderRegistroDetalleClient({ headId }: Props) {
  const [head, setHead] = useState<HeadSummary | null>(null);
  const [details, setDetails] = useState<OrderDetailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(apiUrl(`/api/order-heads/${headId}`)).then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error || `Cabecera ${res.status}`);
        }
        return (await res.json()) as HeadSummary;
      }),
      fetch(apiUrl(`/api/order-heads/${headId}/details`)).then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error || `Detalle ${res.status}`);
        }
        return (await res.json()) as OrderDetailRow[];
      }),
    ])
      .then(([h, d]) => {
        setHead(h);
        setDetails(Array.isArray(d) ? d : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "No se pudo cargar");
        setHead(null);
        setDetails([]);
      })
      .finally(() => setLoading(false));
  }, [headId]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(() => getOrderDetailColumns(headId), [headId]);

  const visibleDetails = useMemo(
    () =>
      details.filter((d) => {
        const c = d.codEstilo?.trim() ?? "";
        const n = d.nomEstilo?.trim() ?? "";
        return Boolean(c && n);
      }),
    [details]
  );

  const cod = head?.codOrderHead?.trim() || `ID ${headId}`;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Orden de Pedido {cod}</span>
        <span className="mx-1.5">/</span>
        <Link href="/orden-pedido/registro" className="hover:text-foreground hover:underline">
          Registro
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Detalle</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {PASOS_ORDEN.map((p) => {
          const active = p.step === 1;
          return (
            <Link
              key={p.step}
              href={p.href}
              className={
                active
                  ? "flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  : "flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              }
            >
              <span
                className={
                  active
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-xs text-primary-foreground"
                    : "flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs"
                }
              >
                {p.step}
              </span>
              {p.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Detalle de lineas (Excel a BD)</h1>
        <Link
          href="/orden-pedido/registro"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Volver al registro
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando lineas de la orden</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <div className="min-w-[1200px] [&_thead_tr]:bg-orange-100 [&_thead_th]:whitespace-nowrap [&_thead_th]:px-2 [&_thead_th]:py-2 [&_thead_th]:text-xs [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900 [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-sm">
            <DataTable columns={columns} data={visibleDetails} />
          </div>
        </div>
      )}

      {!loading && !error && details.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay filas en OD_ORDER_DETAIL para esta orden. Sube un Excel al crear la orden para
          importarlas.
        </p>
      )}

      {!loading && !error && details.length > 0 && visibleDetails.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Hay filas guardadas sin COD ESTILO y ESTILO; no se muestran en la tabla. Vuelve a importar el
          Excel con el formato actual.
        </p>
      )}
    </div>
  );
}
