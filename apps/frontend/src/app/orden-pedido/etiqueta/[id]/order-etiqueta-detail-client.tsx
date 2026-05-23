"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { IdentificadorDigitalBar } from "../identificador-digital/identificador-digital-bar";
import { EtiquetaHeadModal } from "./etiqueta-head-modal";
import { EtiquetaDetalleModal } from "./etiqueta-detalle-modal";
import { GenerarPdfModal } from "./generar-pdf-modal";
import { AgregarTallaModal } from "./agregar-talla-modal";
import { SIZE_FIELDS, type Colorway, type LabelHead, type OrderHeadInfo } from "./types";

type TallaRow = {
  colorway: Colorway;
  label: LabelHead | null;
  talla: string;
  cantidad: number;
  isFirstOfColorway: boolean;
  colorwayRowSpan: number;
  /** Fila especial al final del colorway con el link "+ Agregar talla". */
  isAddRow?: boolean;
};

function buildTallaRows(colorways: Colorway[], labels: LabelHead[]): TallaRow[] {
  const out: TallaRow[] = [];
  for (const cw of colorways) {
    const labelsByDetail = labels.filter((l) => l.idDlkOrderDetail === cw.idDlkOrderDetail);
    const tallas = SIZE_FIELDS.map((s) => ({
      talla: s.label,
      cantidad: (cw[s.field] as number | null) ?? 0,
    })).filter((t) => t.cantidad > 0);

    // rowSpan = tallas activas + 1 (la fila de "+ Agregar talla" cierra el grupo).
    const rowSpan = Math.max(tallas.length, 1) + 1;

    if (tallas.length === 0) {
      out.push({
        colorway: cw,
        label: labelsByDetail[0] ?? null,
        talla: "—",
        cantidad: cw.totalEstilo ?? 0,
        isFirstOfColorway: true,
        colorwayRowSpan: rowSpan,
      });
    } else {
      tallas.forEach((t, idx) => {
        const labelOfTalla = labelsByDetail.find((l) => l.size === t.talla) ?? null;
        out.push({
          colorway: cw,
          label: labelOfTalla,
          talla: t.talla,
          cantidad: t.cantidad,
          isFirstOfColorway: idx === 0,
          colorwayRowSpan: rowSpan,
        });
      });
    }

    // Fila de cierre del colorway con el link.
    out.push({
      colorway: cw,
      label: null,
      talla: "",
      cantidad: 0,
      isFirstOfColorway: false,
      colorwayRowSpan: rowSpan,
      isAddRow: true,
    });
  }
  return out;
}

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
    talla: string | null;
  }>({ open: false, mode: "create", colorway: null, labelHead: null, talla: null });
  const [detalle, setDetalle] = useState<{ open: boolean; labelHead: LabelHead | null }>({
    open: false,
    labelHead: null,
  });
  const [pdfModal, setPdfModal] = useState<{ open: boolean; labelHead: LabelHead | null }>({
    open: false,
    labelHead: null,
  });
  const [agregarTalla, setAgregarTalla] = useState<{
    open: boolean;
    colorway: Colorway | null;
  }>({ open: false, colorway: null });

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

  /** Una fila por (colorway × talla activa). Las celdas que se comparten entre tallas del
   *  mismo colorway se renderizan solo en la primera fila con `rowSpan`. */
  const rows = useMemo(() => buildTallaRows(colorways, labels), [colorways, labels]);

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

      {labels.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            onClick={() => setPdfModal({ open: true, labelHead: null })}
          >
            Generar PDF de todas las etiquetas
          </button>
        </div>
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
                <th className="border px-2 py-1.5 font-semibold">Talla</th>
                <th className="border px-2 py-1.5 font-semibold">GTIN</th>
                <th className="border px-2 py-1.5 font-semibold">Tipo</th>
                <th className="border px-2 py-1.5 font-semibold">Total</th>
                <th className="border px-2 py-1.5 font-semibold">Inicia</th>
                <th className="border px-2 py-1.5 font-semibold">Termina</th>
                <th className="border px-2 py-1.5 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const { colorway: cw, label, talla, cantidad, isFirstOfColorway, colorwayRowSpan, isAddRow } = row;
                if (isAddRow) {
                  return (
                    <tr key={`${cw.idDlkOrderDetail}-add`} className="hover:bg-muted/40">
                      <td className="border px-2 py-1.5 text-center text-xs" colSpan={7}>
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={() => setAgregarTalla({ open: true, colorway: cw })}
                        >
                          + Agregar talla
                        </button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${cw.idDlkOrderDetail}-${talla}`} className="hover:bg-muted/40">
                    {isFirstOfColorway && (
                      <>
                        <td className="border px-2 py-1.5 align-top" rowSpan={colorwayRowSpan}>
                          {order?.codOrderHead ?? "—"}
                        </td>
                        <td
                          className="border px-2 py-1.5 align-top font-medium text-primary"
                          rowSpan={colorwayRowSpan}
                        >
                          {cw.codEstilo ?? "—"}
                        </td>
                        <td className="border px-2 py-1.5 align-top" rowSpan={colorwayRowSpan}>
                          {cw.codOrderDetail ?? "—"}
                        </td>
                        <td className="border px-2 py-1.5 align-top" rowSpan={colorwayRowSpan}>
                          {cw.nomEstilo ?? "—"}
                        </td>
                        <td className="border px-2 py-1.5 align-top" rowSpan={colorwayRowSpan}>
                          {cw.colorAway ?? "—"}
                          {cw.esSet === 1 && (
                            <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] font-semibold text-amber-800">
                              SET ×{cw.numPiezas ?? 2}
                            </span>
                          )}
                        </td>
                        <td className="border px-2 py-1.5 align-top" rowSpan={colorwayRowSpan}>
                          {cw.fondoTela ?? "—"}
                        </td>
                      </>
                    )}
                    <td className="border px-2 py-1.5">{talla}</td>
                    <td className="border px-2 py-1.5">{label?.codGtin ?? "—"}</td>
                    <td className="border px-2 py-1.5">{label?.identifierType ?? "—"}</td>
                    <td className="border px-2 py-1.5">{label?.totalLabel ?? cantidad ?? "—"}</td>
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
                                  talla,
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
                            <button
                              type="button"
                              className="font-medium text-primary hover:underline"
                              onClick={() => setPdfModal({ open: true, labelHead: label })}
                            >
                              Generar
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
                                talla,
                              })
                            }
                          >
                            Crear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        talla={headModal.talla}
        onSuccess={fetchAll}
      />
      <EtiquetaDetalleModal
        open={detalle.open}
        onOpenChange={(o) => setDetalle((s) => ({ ...s, open: o }))}
        order={order}
        labelHead={detalle.labelHead}
      />
      <GenerarPdfModal
        open={pdfModal.open}
        onOpenChange={(o) => setPdfModal((s) => ({ ...s, open: o }))}
        order={order}
        labelHead={pdfModal.labelHead}
      />
      <AgregarTallaModal
        open={agregarTalla.open}
        onOpenChange={(o) => setAgregarTalla((s) => ({ ...s, open: o }))}
        order={order}
        colorway={agregarTalla.colorway}
        onSuccess={fetchAll}
      />
    </div>
  );
}
