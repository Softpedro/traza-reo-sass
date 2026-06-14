"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";

export type IoKind = "input" | "procedure" | "output";

export type IoRow = {
  rowId: number;
  label: string;
  fileName: string | null;
};

const KIND_TITLE: Record<IoKind, string> = {
  input: "Inputs del Proceso",
  procedure: "Procedimientos del Proceso",
  output: "Outputs del Proceso",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: IoKind;
  orderHeadId: number;
  componentId: number;
  processRouteId: number;
  procesoNombre: string;
  ordenProduccion: string;
  marca: string;
  rows: IoRow[];
  /** Notifica al padre que cambió algún nombre de archivo (para refrescar). */
  onUpdated?: () => void;
};

export function TrazabilidadIoModal({
  open,
  onOpenChange,
  kind,
  orderHeadId,
  componentId,
  processRouteId,
  procesoNombre,
  ordenProduccion,
  marca,
  rows,
  onUpdated,
}: Props) {
  const [localRows, setLocalRows] = useState<IoRow[]>(rows);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    if (open) {
      setLocalRows(rows);
      setError(null);
    }
  }, [open, rows]);

  async function onPickFile(rowId: number, file: File | null) {
    if (!file) return;
    setSavingId(rowId);
    setError(null);
    try {
      const res = await apiFetch(
        `/api/order-heads/${orderHeadId}/components/${componentId}/process-routes/${processRouteId}/file`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, rowId, fileName: file.name }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No se pudo guardar el archivo");
      }
      setLocalRows((prev) =>
        prev.map((r) => (r.rowId === rowId ? { ...r, fileName: file.name } : r))
      );
      onUpdated?.();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">{KIND_TITLE[kind]}</DialogTitle>
        </DialogHeader>

        <p className="-mt-1 text-xs text-muted-foreground">{procesoNombre}</p>

        <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-0.5 pt-1 text-sm">
          <span className="text-muted-foreground">Orden de Produccion:</span>
          <span className="font-medium">{ordenProduccion || "—"}</span>
          <span className="text-muted-foreground">Marca:</span>
          <span className="font-medium">{marca || "—"}</span>
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-2 pt-2">
          {localRows.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">
              No hay elementos para este proceso.
            </p>
          ) : (
            localRows.map((r) => (
              <div
                key={r.rowId}
                className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">{r.label}</p>
                  {r.fileName && (
                    <p className="truncate text-xs text-muted-foreground">
                      📎 {r.fileName}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => {
                      fileInputs.current[r.rowId] = el;
                    }}
                    onChange={(e) => onPickFile(r.rowId, e.target.files?.[0] ?? null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={savingId === r.rowId}
                    onClick={() => fileInputs.current[r.rowId]?.click()}
                  >
                    {savingId === r.rowId ? "Subiendo…" : "Upload"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
