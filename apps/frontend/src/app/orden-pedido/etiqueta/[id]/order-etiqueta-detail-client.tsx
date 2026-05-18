"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { IdentificadorDigitalBar } from "../identificador-digital/identificador-digital-bar";
import { EtiquetaHeadModal } from "./etiqueta-head-modal";
import { EtiquetaDetalleModal } from "./etiqueta-detalle-modal";
import type { Colorway, LabelHead, OrderHeadInfo } from "./types";

const PASOS = [
  { step: 1, label: "Registro" },
  { step: 2, label: "Suministro" },
  { step: 3, label: "Etiqueta" },
  { step: 4, label: "Ruta" },
  { step: 5, label: "Trazabilidad" },
  { step: 6, label: "Lista negra" },
] as const;

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PASOS.map((p) => {
        const done = p.step < current;
        const active = p.step === current;
        return (
          <div key={p.step} className="flex items-center gap-1.5">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-primary/30 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {p.step}
            </span>
            <span
              className={`text-xs ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}
            >
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type Props = { orderHeadId: number };

export function OrderEtiquetaDetailClient({ orderHeadId }: Props) {
  const [order, setOrder] = useState<OrderHeadInfo | null>(null);
  const [colorways, setColorways] = useState<Colorway[]>([]);
  const [labels, setLabels] = useState<LabelHead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [headModal, setHeadModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    colorway: Colorway | null;
    labelHead: LabelHead | null;
  }>({ open: false, mode: "create", colorway: null, labelHead: null });
  const [detalle, setDetalle] = useState<{ open: boolean; labelHead: LabelHead | null }>({
    open: false,
    labelHead: null,
  });

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch(`/api/order-heads/${orderHeadId}`).then((r) => (r.ok ? r.json() : null)),
      apiFetch(`/api/order-heads/${orderHeadId}/details`).then((r) => (r.ok ? r.json() : [])),
      apiFetch(`/api/order-heads/${orderHeadId}/labels`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([o, d, l]) => {
        setOrder(o as OrderHeadInfo | null);
        setColorways(Array.isArray(d) ? (d as Colorway[]) : []);
        setLabels(Array.isArray(l) ? (l as LabelHead[]) : []);
        if (!o) setError("No se encontró la orden de pedido.");
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los datos de la orden.");
      })
      .finally(() => setLoading(false));
  }, [orderHeadId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /** Cada colorway con su cabecera de etiqueta (si ya fue creada). */
  const rows = useMemo(
    () =>
      colorways.map((cw) => ({
        colorway: cw,
        label: labels.find((l) => l.idDlkOrderDetail === cw.idDlkOrderDetail) ?? null,
      })),
    [colorways, labels]
  );

  if (loading) {
    return <p className="p-4 text-sm text-muted-foreground">Cargando…</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">Orden de Pedido</p>
        <h1 className="text-xl font-semibold">
          {order?.codOrderHead ?? `Orden ${orderHeadId}`}
          {order?.brand?.nameBrand ? `, ${order.brand.nameBrand}` : ""}{" "}
          <span className="text-muted-foreground">› Etiqueta</span>
        </h1>
      </div>

      <Stepper current={3} />

      <div className="rounded-md border bg-muted/30 px-3 py-2">
        <IdentificadorDigitalBar />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Esta orden no tiene colorways (órdenes de producción) registrados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-100 text-left text-neutral-900">
                <th className="border px-2 py-1.5 font-semibold">Orden Pedido</th>
                <th className="border px-2 py-1.5 font-semibold">Código Estilo</th>
                <th className="border px-2 py-1.5 font-semibold">Orden Producción</th>
                <th className="border px-2 py-1.5 font-semibold">Estilo</th>
                <th className="border px-2 py-1.5 font-semibold">Color Way</th>
                <th className="border px-2 py-1.5 font-semibold">Fondo de Tela</th>
                <th className="border px-2 py-1.5 font-semibold">GTIN</th>
                <th className="border px-2 py-1.5 font-semibold">Tipo</th>
                <th className="border px-2 py-1.5 font-semibold">Total</th>
                <th className="border px-2 py-1.5 font-semibold">Inicia</th>
                <th className="border px-2 py-1.5 font-semibold">Termina</th>
                <th className="border px-2 py-1.5 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ colorway: cw, label }) => (
                <tr key={cw.idDlkOrderDetail} className="hover:bg-muted/40">
                  <td className="border px-2 py-1.5">{order?.codOrderHead ?? "—"}</td>
                  <td className="border px-2 py-1.5 font-medium text-primary">
                    {cw.codEstilo ?? "—"}
                  </td>
                  <td className="border px-2 py-1.5">{cw.codOrderDetail ?? "—"}</td>
                  <td className="border px-2 py-1.5">{cw.nomEstilo ?? "—"}</td>
                  <td className="border px-2 py-1.5">
                    {cw.colorAway ?? "—"}
                    {cw.esSet === 1 && (
                      <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] font-semibold text-amber-800">
                        SET ×{cw.numPiezas ?? 2}
                      </span>
                    )}
                  </td>
                  <td className="border px-2 py-1.5">{cw.fondoTela ?? "—"}</td>
                  <td className="border px-2 py-1.5">{label?.codGtin ?? "—"}</td>
                  <td className="border px-2 py-1.5">{label?.identifierType ?? "—"}</td>
                  <td className="border px-2 py-1.5">
                    {label?.totalLabel ?? cw.totalEstilo ?? "—"}
                  </td>
                  <td className="border px-2 py-1.5">{label?.inicioSerializacion ?? "—"}</td>
                  <td className="border px-2 py-1.5">{label?.finSerializacion ?? "—"}</td>
                  <td className="border px-2 py-1.5">
                    <div className="flex gap-3">
                      {label ? (
                        <>
                          <button
                            type="button"
                            className="font-medium text-primary hover:underline"
                            onClick={() =>
                              setHeadModal({
                                open: true,
                                mode: "edit",
                                colorway: cw,
                                labelHead: label,
                              })
                            }
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="font-medium text-primary hover:underline"
                            onClick={() => setDetalle({ open: true, labelHead: label })}
                          >
                            Ver
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={() =>
                            setHeadModal({
                              open: true,
                              mode: "create",
                              colorway: cw,
                              labelHead: null,
                            })
                          }
                        >
                          Crear
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between text-xs">
        <Link href="/orden-pedido/etiqueta" className="text-primary underline">
          ← Volver a Etiqueta
        </Link>
        <span className="text-muted-foreground">
          La columna Color Way diferencia órdenes de producción que comparten modelo y GTIN.
        </span>
      </div>

      <EtiquetaHeadModal
        open={headModal.open}
        onOpenChange={(o) => setHeadModal((s) => ({ ...s, open: o }))}
        mode={headModal.mode}
        order={order}
        colorway={headModal.colorway}
        labelHead={headModal.labelHead}
        onSuccess={fetchAll}
      />
      <EtiquetaDetalleModal
        open={detalle.open}
        onOpenChange={(o) => setDetalle((s) => ({ ...s, open: o }))}
        order={order}
        labelHead={detalle.labelHead}
      />
    </div>
  );
}
