"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { TrazabilidadIoModal, type IoKind, type IoRow } from "./trazabilidad-io-modal";

type ProcessDetail = {
  idDlkProcessRoute: number;
  codProcess: string;
  nameProcess: string;
  criticalityProcess: string | null;
  outsourcedProcess: number | null;
  estimatedTimeProcess: number | null;
  responsibleUnit: string | null;
  responsibleProcess: string | null;
  idDlkFacility: number | null;
  inputTimeProcessRoute: string | null;
  outputTimeProcessRoute: string | null;
  inputs: {
    idDlkInputProcessRoute: number;
    codInputProcess: string;
    nameInputProcess: string;
    fileInputProcessRoute: string | null;
  }[];
  procedures: {
    idDlkProcedureProcess: number;
    codProcedureProcess: string;
    nameProcedureProcess: string;
    fileProcedureProcess: string | null;
  }[];
  outputs: {
    idDlkOutputProcess: number;
    codOutputProcess: string;
    nameOutputProcess: string;
    fileOutputProcessRoute: string | null;
  }[];
};

type Facility = { idDlkFacility: number; nameFacility: string; codFacility: string };

const CRITICIDAD_LABEL: Record<string, string> = {
  LOW: "1 - Baja",
  MEDIUM: "2 - Media",
  HIGH: "3 - Alta",
};

const TERCERIZADO_OPTIONS = [
  { value: 0, label: "1 - No" },
  { value: 1, label: "2 - Sí" },
];

function fmtDateTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-PE");
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderHeadId: number;
  componentId: number;
  processRouteId: number;
  ordenProduccion: string;
  marca: string;
  pieza: string | null;
  onSuccess?: () => void;
};

export function TrazabilidadProcesoModal({
  open,
  onOpenChange,
  orderHeadId,
  componentId,
  processRouteId,
  ordenProduccion,
  marca,
  pieza,
  onSuccess,
}: Props) {
  const [detail, setDetail] = useState<ProcessDetail | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [io, setIo] = useState<IoKind | null>(null);

  // Campos editables
  const [idDlkFacility, setIdDlkFacility] = useState<number | null>(null);
  const [outsourced, setOutsourced] = useState<number>(0);
  const [duracion, setDuracion] = useState<string>("");
  const [responsable, setResponsable] = useState<string>("");

  function hydrate(d: ProcessDetail) {
    setIdDlkFacility(d.idDlkFacility ?? null);
    setOutsourced(d.outsourcedProcess ? 1 : 0);
    setDuracion(d.estimatedTimeProcess != null ? String(d.estimatedTimeProcess) : "");
    setResponsable(d.responsibleProcess ?? "");
  }

  const fetchDetail = () =>
    apiFetch(
      `/api/order-heads/${orderHeadId}/components/${componentId}/process-routes/${processRouteId}`
    )
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json() as Promise<ProcessDetail>;
      })
      .then((d) => {
        setDetail(d);
        hydrate(d);
      });

  useEffect(() => {
    if (!open) return;
    setError(null);
    setDetail(null);
    setLoading(true);

    const facReq = apiFetch(`/api/facilities`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    Promise.all([fetchDetail(), facReq])
      .then(([, fac]) => {
        setFacilities(Array.isArray(fac) ? fac : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "No se pudo cargar el proceso");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderHeadId, componentId, processRouteId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(
        `/api/order-heads/${orderHeadId}/components/${componentId}/process-routes/${processRouteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idDlkFacility,
            outsourcedProcess: outsourced,
            estimatedTimeProcess: duracion === "" ? 0 : Number(duracion),
            responsibleProcess: responsable,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No se pudo guardar el proceso");
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const titulo = `Orden de Produccion: ${ordenProduccion || `Orden ${orderHeadId}`}, ${marca}${
    pieza ? ` (${pieza})` : ""
  } > Trazabilidad, Crear (Proceso)`;

  // Filas normalizadas para el modal lateral según el tipo abierto.
  const ioRows: IoRow[] = !detail
    ? []
    : io === "input"
      ? detail.inputs.map((r) => ({
          rowId: r.idDlkInputProcessRoute,
          label: `${r.codInputProcess} - ${r.nameInputProcess}`,
          fileName: r.fileInputProcessRoute,
        }))
      : io === "procedure"
        ? detail.procedures.map((r) => ({
            rowId: r.idDlkProcedureProcess,
            label: `${r.codProcedureProcess} - ${r.nameProcedureProcess}`,
            fileName: r.fileProcedureProcess,
          }))
        : io === "output"
          ? detail.outputs.map((r) => ({
              rowId: r.idDlkOutputProcess,
              label: `${r.codOutputProcess} - ${r.nameOutputProcess}`,
              fileName: r.fileOutputProcessRoute,
            }))
          : [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{titulo}</DialogTitle>
          </DialogHeader>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {loading || !detail ? (
            <p className="py-4 text-sm text-muted-foreground">Cargando proceso…</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3 pt-1 text-sm">
              <div className="grid grid-cols-[7rem,1fr] items-start gap-x-3 gap-y-1">
                <span className="text-right text-muted-foreground">Orden de Produccion:</span>
                <span className="font-medium">{ordenProduccion || "—"}</span>
                <span className="text-right text-muted-foreground">Marca:</span>
                <span className="font-medium">{marca || "—"}</span>
                <span className="text-right text-muted-foreground">Proceso:</span>
                <span className="font-medium">{detail.nameProcess}</span>
              </div>

              <div className="grid grid-cols-[7rem,1fr] items-center gap-x-3 gap-y-2">
                <Label className="text-right">Fábrica:</Label>
                <Select
                  value={idDlkFacility != null ? String(idDlkFacility) : ""}
                  onValueChange={(v) => setIdDlkFacility(v ? Number(v) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fábrica" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((f) => (
                      <SelectItem key={f.idDlkFacility} value={String(f.idDlkFacility)}>
                        {f.nameFacility}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-right text-muted-foreground">Criticidad:</span>
                <span className="font-medium">
                  {CRITICIDAD_LABEL[detail.criticalityProcess ?? ""] ??
                    detail.criticalityProcess ??
                    "—"}
                </span>

                <Label className="text-right">Tercerizado:</Label>
                <Select
                  value={String(outsourced)}
                  onValueChange={(v) => setOutsourced(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TERCERIZADO_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label className="text-right">Duración (Horas):</Label>
                <Input
                  type="number"
                  min={0}
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                />

                <span className="text-right text-muted-foreground">Unidad:</span>
                <span className="font-medium">{detail.responsibleUnit || "—"}</span>

                <Label className="text-right">Responsable:</Label>
                <Input
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                />
              </div>

              {/* Links a los modales laterales */}
              <div className="grid grid-cols-[7rem,1fr] items-center gap-x-3 gap-y-2">
                <span className="text-right text-muted-foreground">Input:</span>
                <button
                  type="button"
                  className="justify-self-start font-medium text-primary hover:underline"
                  onClick={() => setIo("input")}
                >
                  ↗ Ver inputs ({detail.inputs.length})
                </button>
                <span className="text-right text-muted-foreground">Procedimiento:</span>
                <button
                  type="button"
                  className="justify-self-start font-medium text-primary hover:underline"
                  onClick={() => setIo("procedure")}
                >
                  ↗ Ver procedimientos ({detail.procedures.length})
                </button>
                <span className="text-right text-muted-foreground">Output:</span>
                <button
                  type="button"
                  className="justify-self-start font-medium text-primary hover:underline"
                  onClick={() => setIo("output")}
                >
                  ↗ Ver outputs ({detail.outputs.length})
                </button>

                <span className="text-right text-muted-foreground">Inicio:</span>
                <Input value={fmtDateTime(detail.inputTimeProcessRoute)} disabled readOnly />
                <span className="text-right text-muted-foreground">Fin:</span>
                <Input value={fmtDateTime(detail.outputTimeProcessRoute)} disabled readOnly />
              </div>

              <div className="flex justify-center pt-1">
                <Button type="submit" className="bg-primary px-8" disabled={saving}>
                  {saving ? "Guardando…" : "Crear"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {detail && io && (
        <TrazabilidadIoModal
          open
          onOpenChange={(o) => !o && setIo(null)}
          kind={io}
          orderHeadId={orderHeadId}
          componentId={componentId}
          processRouteId={processRouteId}
          procesoNombre={detail.nameProcess}
          ordenProduccion={ordenProduccion}
          marca={marca}
          rows={ioRows}
          onUpdated={fetchDetail}
        />
      )}
    </>
  );
}
