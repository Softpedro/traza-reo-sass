"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Button } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";

type TraceEvent = {
  idDlkUnitTrace: number;
  typeEvent: string;
  eventTime: string | null;
  urlDppTrace: string | null;
  idItemUnicoIot: string | null;
  observationUnitTrace: string | null;
  idDlkActivitiesRoute: number | null;
  codUsuarioCargaDl: string | null;
  fecProcesoCargaDl: string | null;
  activitiesRoute: { codActivities: string; nameActivities: string } | null;
};

type UnitData = {
  idDlkOrderLabelDetail: number;
  serialNumber: string | null;
  sgtinFull: string | null;
  urlDppFull: string | null;
  color: string | null;
  size: string | null;
  print: string | null;
  isBlacklisted: number | null;
  unitTraces: TraceEvent[];
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("es-PE");
}

export function HistorialClient() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UnitData | null>(null);
  const [searched, setSearched] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = q.trim();
    if (!val) return;
    setLoading(true);
    setError(null);
    setData(null);
    setSearched(true);
    try {
      // Acepta SGTIN o, por comodidad, la URL del DPP (la que da el QR).
      const param = val.includes("://")
        ? `url=${encodeURIComponent(val)}`
        : `sgtin=${encodeURIComponent(val)}`;
      const res = await apiFetch(`/api/unit-traces?${param}`);
      if (res.status === 404) {
        setData(null);
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Error ${res.status}`);
      }
      setData((await res.json()) as UnitData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo consultar el historial");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Orden de Pedido · Trazabilidad</p>
          <h1 className="text-xl font-semibold">Historial por SGTIN</h1>
        </div>
        <Link
          href="/orden-pedido/trazabilidad"
          className="text-sm text-primary hover:underline"
        >
          ← Volver a Trazabilidad
        </Link>
      </div>

      <form onSubmit={onSubmit} className="flex max-w-xl gap-2">
        <Input
          placeholder="SGTIN (ej. 07750549420014/1) o URL del DPP"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="submit" className="bg-primary" disabled={loading || !q.trim()}>
          {loading ? "Buscando…" : "Buscar"}
        </Button>
      </form>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {searched && !loading && !error && !data && (
        <p className="text-sm text-muted-foreground">
          No se encontró ninguna prenda con ese SGTIN / URL.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          {/* Resumen de la prenda */}
          <div className="rounded-md border border-border bg-card p-4 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
              <div>
                <span className="text-muted-foreground">SGTIN: </span>
                <span className="font-medium">{data.sgtinFull ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Serial: </span>
                <span className="font-medium">{data.serialNumber ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lista negra: </span>
                <span
                  className={`font-medium ${data.isBlacklisted ? "text-destructive" : ""}`}
                >
                  {data.isBlacklisted ? "Sí" : "No"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Color: </span>
                <span className="font-medium">{data.color ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Talla: </span>
                <span className="font-medium">{data.size ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estampado: </span>
                <span className="font-medium">{data.print ?? "—"}</span>
              </div>
            </div>
            {data.urlDppFull && (
              <a
                href={data.urlDppFull}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                {data.urlDppFull}
              </a>
            )}
          </div>

          {/* Eventos */}
          {data.unitTraces.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Esta prenda aún no tiene eventos de trazabilidad registrados.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-orange-100 text-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">#</th>
                    <th className="px-3 py-2 text-left font-semibold">Evento</th>
                    <th className="px-3 py-2 text-left font-semibold">Fecha del evento</th>
                    <th className="px-3 py-2 text-left font-semibold">Actividad</th>
                    <th className="px-3 py-2 text-left font-semibold">IoT</th>
                    <th className="px-3 py-2 text-left font-semibold">Observación</th>
                    <th className="px-3 py-2 text-left font-semibold">Usuario</th>
                    <th className="px-3 py-2 text-left font-semibold">Ingestado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.unitTraces.map((t, i) => (
                    <tr key={t.idDlkUnitTrace} className="border-t border-border">
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{t.typeEvent}</td>
                      <td className="px-3 py-2">{fmt(t.eventTime)}</td>
                      <td className="px-3 py-2">
                        {t.activitiesRoute
                          ? `${t.activitiesRoute.codActivities} - ${t.activitiesRoute.nameActivities}`
                          : "—"}
                      </td>
                      <td className="px-3 py-2">{t.idItemUnicoIot ?? "—"}</td>
                      <td className="px-3 py-2">{t.observationUnitTrace ?? "—"}</td>
                      <td className="px-3 py-2">{t.codUsuarioCargaDl ?? "—"}</td>
                      <td className="px-3 py-2">{fmt(t.fecProcesoCargaDl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
