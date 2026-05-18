"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { DigitalIdentifier } from "./types";

interface VerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Permite refrescar desde fuera (p.ej. tras crear/editar). */
  refreshKey?: number;
  onEdit: (row: DigitalIdentifier) => void;
  onView: (row: DigitalIdentifier) => void;
}

export function IdentificadorDigitalVerModal({
  open,
  onOpenChange,
  refreshKey = 0,
  onEdit,
  onView,
}: VerModalProps) {
  const [rows, setRows] = useState<DigitalIdentifier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch("/api/digital-identifiers")
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          throw new Error("No se pudieron cargar los identificadores digitales");
        }
        setRows(data as DigitalIdentifier[]);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error al cargar");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (open) fetchRows();
  }, [open, refreshKey, fetchRows]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Identificadores digitales</DialogTitle>
          <DialogDescription>Catálogo de identificadores digitales registrados.</DialogDescription>
        </DialogHeader>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No hay identificadores digitales registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-orange-100 text-left text-neutral-900">
                  <th className="border px-2 py-1.5 font-semibold">ID</th>
                  <th className="border px-2 py-1.5 font-semibold">Código</th>
                  <th className="border px-2 py-1.5 font-semibold">Tipo</th>
                  <th className="border px-2 py-1.5 font-semibold">Material</th>
                  <th className="border px-2 py-1.5 font-semibold">Ubicación</th>
                  <th className="border px-2 py-1.5 font-semibold">Estándar ISO</th>
                  <th className="border px-2 py-1.5 font-semibold">Estado</th>
                  <th className="border px-2 py-1.5 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.idDlkDigitalIdentifier} className="hover:bg-muted/40">
                    <td className="border px-2 py-1.5">
                      {String(r.idDlkDigitalIdentifier).padStart(3, "0")}
                    </td>
                    <td className="border px-2 py-1.5 font-medium text-primary">
                      {r.codDigitalIdentifier}
                    </td>
                    <td className="border px-2 py-1.5">{r.typeDigitalIdentifier ?? "—"}</td>
                    <td className="border px-2 py-1.5">{r.materialDigitalIdentifier ?? "—"}</td>
                    <td className="border px-2 py-1.5">{r.locationDigitalIdentifier ?? "—"}</td>
                    <td className="border px-2 py-1.5">
                      {r.standardIsoDigitalIdentifier ?? "—"}
                    </td>
                    <td className="border px-2 py-1.5">
                      <span
                        className={
                          r.stateDigitalIdentifier === 1
                            ? "font-medium text-green-600"
                            : "font-medium text-red-600"
                        }
                      >
                        {r.stateDigitalIdentifier === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="border px-2 py-1.5">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={() => onEdit(r)}
                        >
                          Actualizar
                        </button>
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={() => onView(r)}
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
      </DialogContent>
    </Dialog>
  );
}
