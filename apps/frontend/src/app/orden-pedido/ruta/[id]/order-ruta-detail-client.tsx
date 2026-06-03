"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { ORDER_HEAD_STATUS } from "../constants";
import { RutaTreeModal, type RutaModalMode } from "./crear-ruta-modal";

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

type GroupRow = {
  key: string;
  codEstilo: string | null;
  nomEstilo: string | null;
  esSet: boolean;
  ordinal: number | null;
  pieza: string | null;
  ordenesProduccion: string[];
  componentIds: number[];
};

type OrderInfo = {
  idDlkOrderHead: number;
  codOrderHead: string | null;
  statusStageOrderHead: number | null;
  stageOrderHead: number | null;
  brand: { idDlkBrand: number; nameBrand: string; codBrand: string } | null;
};

type Props = { orderHeadId: number };

export function OrderRutaDetailClient({ orderHeadId }: Props) {
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ group: GroupRow; mode: RutaModalMode } | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/api/order-heads/${orderHeadId}/components`)
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json();
      })
      .then((data: { order: OrderInfo; groups: GroupRow[] }) => {
        setOrder(data.order);
        setGroups(data.groups ?? []);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "No se pudieron cargar los componentes"
        );
      })
      .finally(() => setLoading(false));
  }, [orderHeadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function saveName(componentIds: number[], name: string) {
    try {
      const res = await apiFetch(`/api/order-heads/${orderHeadId}/components/name`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentIds, nameComponent: name }),
      });
      if (!res.ok) throw new Error("No se pudo guardar el nombre de la pieza");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error");
      fetchData();
    }
  }

  const rutaLabel =
    order?.statusStageOrderHead != null
      ? (ORDER_HEAD_STATUS[order.statusStageOrderHead] ?? String(order.statusStageOrderHead))
      : "—";

  return (
    <div className="space-y-5">
      <Stepper current={4} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Orden de Pedido · Ruta</p>
          <h1 className="text-xl font-semibold">
            {order?.codOrderHead ?? `Orden ${orderHeadId}`}
            {order?.brand?.nameBrand ? ` — ${order.brand.nameBrand}` : ""}
          </h1>
        </div>
        <Link href="/orden-pedido/ruta" className="text-sm text-primary hover:underline">
          ← Volver a Ruta
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando componentes…</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Esta orden no tiene colorways/detalles para generar componentes de ruta.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-orange-100 text-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Cod Estilo</th>
                <th className="px-3 py-2 text-left font-semibold">Orden Producción</th>
                <th className="px-3 py-2 text-left font-semibold">Estilo</th>
                <th className="px-3 py-2 text-center font-semibold">Set</th>
                <th className="px-3 py-2 text-left font-semibold">Pieza</th>
                <th className="px-3 py-2 text-center font-semibold">Ruta</th>
                <th className="px-3 py-2 text-center font-semibold">Detalle Ruta</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.key} className="border-t border-border">
                  <td className="px-3 py-2">{g.codEstilo ?? "—"}</td>
                  <td className="px-3 py-2">{g.ordenesProduccion.join(", ") || "—"}</td>
                  <td className="px-3 py-2">{g.nomEstilo ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{g.esSet ? "Sí" : "No"}</td>
                  <td className="px-3 py-2">
                    {g.esSet ? (
                      <input
                        type="text"
                        defaultValue={g.pieza ?? ""}
                        placeholder="Nombre de pieza"
                        className="w-40 rounded border border-input bg-background px-2 py-1 text-sm"
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v !== (g.pieza ?? "")) saveName(g.componentIds, v);
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-center font-medium">{rutaLabel}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setModal({ group: g, mode: "crear" })}
                        className="text-primary hover:underline"
                      >
                        Crear
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ group: g, mode: "editar" })}
                        className="text-primary hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ group: g, mode: "ver" })}
                        className="text-primary hover:underline"
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium">OBS:</span> Cada fila agrupa los componentes del mismo
        estilo (los Set se separan por pieza). La ruta se define una vez por grupo y al guardar
        se aplica de forma independiente a cada orden de producción ({"{"}QWE-1, QWE-2…{"}"}).
      </p>

      {modal && (
        <RutaTreeModal
          open
          onOpenChange={(o) => !o && setModal(null)}
          mode={modal.mode}
          orderHeadId={orderHeadId}
          componentIds={modal.group.componentIds}
          groupLabel={`${modal.group.codEstilo ?? ""}${modal.group.pieza ? ` · ${modal.group.pieza}` : ""}`}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
