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
import { TrazabilidadDppModal } from "./trazabilidad-dpp-modal";

type SubprocessDetail = {
  idDlkSubprocessRoute: number;
  codSubprocess: string;
  nameSubprocess: string;
  criticalitySubprocess: string | null;
  outsourcedSubprocess: number | null;
  estimatedTimeSubprocess: number | null;
  responsibleUnit: string | null;
  responsibleRole: string | null;
  idDlkFacility: number | null;
  inputTimeSubprocessRoute: string | null;
  outputTimeSubprocessRoute: string | null;
  processRoute: { codProcess: string; nameProcess: string } | null;
  inputs: {
    idDlkInputSubprocessRoute: number;
    codInputSubprocess: string;
    nameInputSubprocess: string;
    fileInputSubprocess: string | null;
  }[];
  procedures: {
    idDlkProcedureSubprocessRoute: number;
    codProcedureSubprocess: string;
    nameProcedureSubprocess: string;
    fileProcedureSubprocess: string | null;
  }[];
  outputs: {
    idDlkOutputSubprocessRoute: number;
    codOutputSubprocess: string;
    nameOutputSubprocess: string;
    fileOutputSubprocessRoute: string | null;
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

/** ISO → valor para <input type="datetime-local"> en hora local. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function localInputToIso(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderHeadId: number;
  componentId: number;
  subprocessRouteId: number;
  ordenProduccion: string;
  marca: string;
  pieza: string | null;
  onSuccess?: () => void;
};

export function TrazabilidadSubprocesoModal({
  open,
  onOpenChange,
  orderHeadId,
  componentId,
  subprocessRouteId,
  ordenProduccion,
  marca,
  pieza,
  onSuccess,
}: Props) {
  const [detail, setDetail] = useState<SubprocessDetail | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [io, setIo] = useState<IoKind | null>(null);
  const [dppOpen, setDppOpen] = useState(false);

  const [idDlkFacility, setIdDlkFacility] = useState<number | null>(null);
  const [outsourced, setOutsourced] = useState<number>(0);
  const [duracion, setDuracion] = useState<string>("");
  const [responsable, setResponsable] = useState<string>("");
  const [inicio, setInicio] = useState<string>("");
  const [fin, setFin] = useState<string>("");

  function hydrate(d: SubprocessDetail) {
    setIdDlkFacility(d.idDlkFacility ?? null);
    setOutsourced(d.outsourcedSubprocess ? 1 : 0);
    setDuracion(d.estimatedTimeSubprocess != null ? String(d.estimatedTimeSubprocess) : "");
    setResponsable(d.responsibleRole ?? "");
    setInicio(toLocalInput(d.inputTimeSubprocessRoute));
    setFin(toLocalInput(d.outputTimeSubprocessRoute));
  }

  const fetchDetail = () =>
    apiFetch(
      `/api/order-heads/${orderHeadId}/components/${componentId}/subprocess-routes/${subprocessRouteId}`
    )
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Error ${res.status}`);
        }
        return res.json() as Promise<SubprocessDetail>;
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
        setError(err instanceof Error ? err.message : "No se pudo cargar el subproceso");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderHeadId, componentId, subprocessRouteId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(
        `/api/order-heads/${orderHeadId}/components/${componentId}/subprocess-routes/${subprocessRouteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idDlkFacility,
            outsourcedSubprocess: outsourced,
            estimatedTimeSubprocess: duracion === "" ? 0 : Number(duracion),
            responsibleRole: responsable,
            inputTimeSubprocessRoute: localInputToIso(inicio),
            outputTimeSubprocessRoute: localInputToIso(fin),
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No se pudo guardar el subproceso");
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
  } > Trazabilidad, Crear (Sub Proceso)`;

  const ioRows: IoRow[] = !detail
    ? []
    : io === "input"
      ? detail.inputs.map((r) => ({
          rowId: r.idDlkInputSubprocessRoute,
          label: `${r.codInputSubprocess} - ${r.nameInputSubprocess}`,
          fileName: r.fileInputSubprocess,
        }))
      : io === "procedure"
        ? detail.procedures.map((r) => ({
            rowId: r.idDlkProcedureSubprocessRoute,
            label: `${r.codProcedureSubprocess} - ${r.nameProcedureSubprocess}`,
            fileName: r.fileProcedureSubprocess,
          }))
        : io === "output"
          ? detail.outputs.map((r) => ({
              rowId: r.idDlkOutputSubprocessRoute,
              label: `${r.codOutputSubprocess} - ${r.nameOutputSubprocess}`,
              fileName: r.fileOutputSubprocessRoute,
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
            <p className="py-4 text-sm text-muted-foreground">Cargando subproceso…</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3 pt-1 text-sm">
              <div className="grid grid-cols-[7rem,1fr] items-start gap-x-3 gap-y-1">
                <span className="text-right text-muted-foreground">Orden de Produccion:</span>
                <span className="font-medium">{ordenProduccion || "—"}</span>
                <span className="text-right text-muted-foreground">Marca:</span>
                <span className="font-medium">{marca || "—"}</span>
                <span className="text-right text-muted-foreground">Proceso:</span>
                <span className="font-medium">{detail.processRoute?.nameProcess ?? "—"}</span>
                <span className="text-right text-muted-foreground">Sub Proceso:</span>
                <span className="font-medium">{detail.nameSubprocess}</span>
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
                  {CRITICIDAD_LABEL[detail.criticalitySubprocess ?? ""] ??
                    detail.criticalitySubprocess ??
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
                <Input value={responsable} onChange={(e) => setResponsable(e.target.value)} />
              </div>

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
                <span className="text-right text-muted-foreground">DPP:</span>
                <button
                  type="button"
                  className="justify-self-start font-medium text-primary hover:underline"
                  onClick={() => setDppOpen(true)}
                >
                  ↗ Ver DPPs
                </button>

                <Label className="text-right">Inicio:</Label>
                <Input
                  type="datetime-local"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                />
                <Label className="text-right">Fin:</Label>
                <Input
                  type="datetime-local"
                  value={fin}
                  min={inicio || undefined}
                  onChange={(e) => setFin(e.target.value)}
                />
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
          fileEndpoint={`/api/order-heads/${orderHeadId}/components/${componentId}/subprocess-routes/${subprocessRouteId}/file`}
          procesoNombre={detail.nameSubprocess}
          ordenProduccion={ordenProduccion}
          marca={marca}
          rows={ioRows}
          onUpdated={fetchDetail}
        />
      )}

      {detail && (
        <TrazabilidadDppModal
          open={dppOpen}
          onOpenChange={setDppOpen}
          orderHeadId={orderHeadId}
          componentId={componentId}
          ctxCodProcess={detail.processRoute?.codProcess ?? null}
          ctxNameProcess={detail.processRoute?.nameProcess ?? null}
          ctxCodSubprocess={detail.codSubprocess}
          ctxNameSubprocess={detail.nameSubprocess}
          ctxInicio={detail.inputTimeSubprocessRoute}
          pieza={pieza}
          ordenProduccion={ordenProduccion}
          marca={marca}
        />
      )}
    </>
  );
}
