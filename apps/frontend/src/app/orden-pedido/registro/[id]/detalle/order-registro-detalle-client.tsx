"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getOrderDetailColumns, type OrderDetailRow } from "./order-detail-columns";
import { OrderDetailEditModal } from "./order-detail-edit-modal";
import { OrderDetailVerModal } from "./order-detail-ver-modal";
import { SuministroStepView } from "./suministro-step-view";

/**
 * Pasos del wizard del detalle de orden. `fallbackHref` es donde se navega si el
 * step aún no está implementado in-page.
 */
const PASOS_ORDEN = [
  { step: 1, label: "Registro", fallbackHref: "/orden-pedido/registro", inline: true },
  { step: 2, label: "Suministro", fallbackHref: "/orden-pedido/suministro", inline: true },
  {
    step: 3,
    label: "Etiqueta",
    fallbackHref: "/orden-pedido/etiqueta",
    inline: false,
  },
  { step: 4, label: "Ruta", fallbackHref: "/orden-pedido/ruta", inline: false },
  {
    step: 5,
    label: "Trazabilidad",
    fallbackHref: "/orden-pedido/trazabilidad",
    inline: false,
  },
  {
    step: 6,
    label: "Lista negra",
    fallbackHref: "/orden-pedido/lista-negra",
    inline: false,
  },
] as const;

type HeadSummary = {
  idDlkOrderHead: number;
  codOrderHead: string | null;
};

type Props = {
  headId: number;
};

export function OrderRegistroDetalleClient({ headId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawStep = Number(searchParams.get("step") ?? "1");
  const step = Number.isFinite(rawStep) && rawStep >= 1 && rawStep <= 6 ? rawStep : 1;

  function goToStep(nextStep: number) {
    const qs = new URLSearchParams(searchParams.toString());
    if (nextStep === 1) qs.delete("step");
    else qs.set("step", String(nextStep));
    const query = qs.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }
  const [head, setHead] = useState<HeadSummary | null>(null);
  const [details, setDetails] = useState<OrderDetailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<OrderDetailRow | null>(null);
  const [verOpen, setVerOpen] = useState(false);
  const [viewingRow, setViewingRow] = useState<OrderDetailRow | null>(null);
  const [imageVersion, setImageVersion] = useState(0);

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

  const columns = useMemo(
    () =>
      getOrderDetailColumns(headId, {
        onEdit: (row) => {
          setEditingRow(row);
          setEditOpen(true);
        },
        onView: (row) => {
          setViewingRow(row);
          setVerOpen(true);
        },
        imageVersion,
      }),
    [headId, imageVersion]
  );

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
  const activeLabel =
    PASOS_ORDEN.find((p) => p.step === step)?.label ?? "Detalle";

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Orden de Pedido {cod}</span>
        <span className="mx-1.5">/</span>
        <Link href="/orden-pedido/registro" className="hover:text-foreground hover:underline">
          Registro
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{activeLabel}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {PASOS_ORDEN.map((p) => {
          const active = p.step === step;
          const baseCls =
            "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors";
          const cls = active
            ? `${baseCls} bg-primary text-primary-foreground`
            : `${baseCls} bg-muted/60 text-muted-foreground hover:bg-muted`;
          const numCls = active
            ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-xs text-primary-foreground"
            : "flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs";
          if (p.inline) {
            return (
              <button
                key={p.step}
                type="button"
                onClick={() => goToStep(p.step)}
                className={cls}
                aria-current={active ? "step" : undefined}
              >
                <span className={numCls}>{p.step}</span>
                {p.label}
              </button>
            );
          }
          return (
            <Link
              key={p.step}
              href={p.fallbackHref}
              className={cls}
              aria-current={active ? "step" : undefined}
            >
              <span className={numCls}>{p.step}</span>
              {p.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">
          {step === 2
            ? `Orden de Pedido: ${cod} > Suministro`
            : "Detalle de lineas (Excel a BD)"}
        </h1>
        <Link
          href={step === 2 ? "/orden-pedido/suministro" : "/orden-pedido/registro"}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          {step === 2 ? "Volver a Suministro" : "Volver al registro"}
        </Link>
      </div>

      {step === 1 && (
        <>
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

          <OrderDetailEditModal
            open={editOpen}
            onOpenChange={(o) => {
              setEditOpen(o);
              if (!o) setEditingRow(null);
            }}
            headId={headId}
            row={editingRow}
            onSuccess={(v) => {
              setImageVersion(v);
              load();
            }}
          />

          <OrderDetailVerModal
            open={verOpen}
            onOpenChange={(o) => {
              setVerOpen(o);
              if (!o) setViewingRow(null);
            }}
            headId={headId}
            row={viewingRow}
            imageVersion={imageVersion}
          />
        </>
      )}

      {step === 2 && (
        <SuministroStepView headId={headId} codOrderHead={head?.codOrderHead ?? null} />
      )}
    </div>
  );
}
