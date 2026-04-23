"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import {
  getSuministroStepColumns,
  type SuministroDetailRow,
} from "./suministro-step-columns";
import { SUMINISTRO_STATUS_OPTIONS } from "../../../suministro/constants";

type Props = {
  headId: number;
  codOrderHead: string | null;
};

type ModalMode = "crear" | "editar" | "ver";

export function SuministroStepView({ headId, codOrderHead }: Props) {
  const [rows, setRows] = useState<SuministroDetailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dlgOpen, setDlgOpen] = useState(false);
  const [dlgMode, setDlgMode] = useState<ModalMode>("ver");
  const [dlgRow, setDlgRow] = useState<SuministroDetailRow | null>(null);
  const [dlgStatus, setDlgStatus] = useState<number>(1);
  const [dlgSaving, setDlgSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(apiUrl(`/api/order-heads/${headId}/details`))
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error || `Detalle ${res.status}`);
        }
        return (await res.json()) as SuministroDetailRow[];
      })
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "No se pudo cargar");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [headId]);

  useEffect(() => {
    load();
  }, [load]);

  function openDialog(mode: ModalMode, row: SuministroDetailRow) {
    setDlgMode(mode);
    setDlgRow(row);
    setDlgStatus(row.stateOrderDetail ?? 1);
    setDlgOpen(true);
  }

  const columns = useMemo(
    () =>
      getSuministroStepColumns({
        headId,
        codOrderHead,
        onCrear: (row) => openDialog("crear", row),
        onEditar: (row) => openDialog("editar", row),
        onVer: (row) => openDialog("ver", row),
      }),
    [headId, codOrderHead]
  );

  const visibleRows = useMemo(
    () =>
      rows.filter((d) => {
        const c = d.codEstilo?.trim() ?? "";
        const n = d.nomEstilo?.trim() ?? "";
        return Boolean(c && n);
      }),
    [rows]
  );

  async function onSaveStatus() {
    if (!dlgRow) return;
    setDlgSaving(true);
    try {
      const res = await fetch(
        apiUrl(`/api/order-heads/${headId}/details/${dlgRow.idDlkOrderDetail}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stateOrderDetail: dlgStatus }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al actualizar estado");
      }
      setDlgOpen(false);
      load();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setDlgSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando ítems de suministro…</p>
      ) : visibleRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay ítems en OD_ORDER_DETAIL para esta orden.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <div className="min-w-[900px] [&_thead_tr]:bg-orange-100 [&_thead_th]:whitespace-nowrap [&_thead_th]:px-2 [&_thead_th]:py-2 [&_thead_th]:text-xs [&_thead_th]:font-semibold [&_thead_th]:text-neutral-900 [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-sm">
            <DataTable columns={columns} data={visibleRows} />
          </div>
        </div>
      )}

      <Dialog open={dlgOpen} onOpenChange={setDlgOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dlgMode === "ver"
                ? "Ver suministro del ítem"
                : dlgMode === "crear"
                  ? "Crear suministro del ítem"
                  : "Editar suministro del ítem"}
            </DialogTitle>
          </DialogHeader>
          {dlgRow && (
            <div className="space-y-3 pt-2 text-sm">
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1">
                <span className="text-muted-foreground">Orden Producción:</span>
                <span className="font-medium">{dlgRow.codOrderDetail ?? "—"}</span>
                <span className="text-muted-foreground">Cod Estilo:</span>
                <span className="font-medium">{dlgRow.codEstilo ?? "—"}</span>
                <span className="text-muted-foreground">Estilo:</span>
                <span className="font-medium">{dlgRow.nomEstilo ?? "—"}</span>
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">
                  {dlgRow.totalEstilo != null
                    ? dlgRow.totalEstilo.toLocaleString("es-PE")
                    : "—"}
                </span>
              </div>

              {dlgMode === "ver" ? (
                <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="font-medium">
                    {SUMINISTRO_STATUS_OPTIONS.find(
                      (o) => o.value === (dlgRow.stateOrderDetail ?? 1)
                    )?.label ?? "1. Sin Iniciar"}
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label>Estado suministro</Label>
                  <Select
                    value={String(dlgStatus)}
                    onValueChange={(v) => setDlgStatus(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUMINISTRO_STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={String(o.value)}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">
                El detalle de materiales, avíos y empaque por ítem (consumos y mermas) se
                desprenderá del archivo final cargado en cabecera (
                <code>OD_ORDER_HEAD.FILE_SUPPLIES_FINAL</code>) o del archivo por ítem
                (<code>OD_ORDER_DETAIL.SUPPLY_FILE</code>) en una siguiente iteración.
              </p>

              {dlgMode !== "ver" && (
                <Button
                  type="button"
                  className="w-full bg-primary"
                  onClick={onSaveStatus}
                  disabled={dlgSaving}
                >
                  {dlgSaving ? "Guardando…" : dlgMode === "crear" ? "Crear" : "Actualizar"}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
