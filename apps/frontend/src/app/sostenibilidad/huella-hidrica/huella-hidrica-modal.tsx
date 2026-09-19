"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { activeSizes, type SizeQuantities } from "@/lib/sizes";
import type { WaterFootprint } from "./columns";

type Mode = "create" | "edit" | "view";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  footprint: WaterFootprint | null;
  onSuccess: () => void;
};

type BrandOption = { idDlkBrand: number; codBrand: string; nameBrand: string };

type OrderHeadOption = {
  idDlkOrderHead: number;
  idDlkBrand: number | null;
  codOrderHead: string | null;
};

type OrderDetailOption = SizeQuantities & {
  idDlkOrderDetail: number;
  codOrderDetail: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  fondoTela: string | null;
};

type FileState = { base64: string; name: string; existing: boolean };

const emptyFile: FileState = { base64: "", name: "", existing: false };

/** Marca de borrado del adjunto, igual que en el modal de Suministro. */
const CLEAR = "__CLEAR__";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });
}

export function HuellaHidricaModal({ open, onOpenChange, mode, footprint, onSuccess }: Props) {
  const isCreate = mode === "create";
  const isView = mode === "view";
  const readOnly = isView;

  const [saving, setSaving] = useState(false);

  // Cascada: sólo se usa al crear; al actualizar la identidad ya está fijada.
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [orders, setOrders] = useState<OrderHeadOption[]>([]);
  const [details, setDetails] = useState<OrderDetailOption[]>([]);
  const [brandId, setBrandId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [detailId, setDetailId] = useState("");
  const [size, setSize] = useState("");

  const [weight, setWeight] = useState("");
  const [h2o, setH2o] = useState("");
  const [estimated, setEstimated] = useState(false);
  const [unitDescription, setUnitDescription] = useState("");
  const [scope, setScope] = useState("");
  const [state, setState] = useState(1);
  const [report, setReport] = useState<FileState>(emptyFile);

  const title = isCreate
    ? "Crear huella hídrica"
    : isView
      ? "Huella hídrica"
      : "Actualizar huella hídrica";

  // ── Carga inicial ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setSaving(false);
    setReport(emptyFile);

    if (isCreate) {
      setBrandId("");
      setOrderId("");
      setDetailId("");
      setSize("");
      setWeight("");
      setH2o("");
      setEstimated(false);
      setUnitDescription("");
      setScope("");
      setState(1);
      setDetails([]);

      Promise.all([
        apiFetch("/api/brands").then((r) => r.json()),
        apiFetch("/api/order-heads").then((r) => r.json()),
      ])
        .then(([brandRows, orderRows]: [BrandOption[], OrderHeadOption[]]) => {
          setBrands(brandRows);
          setOrders(orderRows);
        })
        .catch((err) => console.error("Error al cargar marcas/órdenes:", err));
      return;
    }

    if (!footprint) return;
    // Los campos largos y el adjunto no viajan en el listado: se leen de la fila completa.
    apiFetch(`/api/water-footprints/${footprint.idDlkWaterFootprint}`)
      .then((r) => r.json())
      .then((row: WaterFootprint) => {
        setWeight(row.weight == null ? "" : String(row.weight));
        setH2o(row.waterFootprint == null ? "" : String(row.waterFootprint));
        setEstimated(row.estimatedValue === 1);
        setUnitDescription(row.unitDescription ?? "");
        setScope(row.scope ?? "");
        setState(row.stateWaterFootprint ?? 1);
        if (row.hasReportFile) {
          setReport({ base64: "", name: row.report || "Informe adjunto", existing: true });
        }
      })
      .catch((err) => console.error("Error al cargar la huella:", err));
  }, [open, isCreate, footprint]);

  // Órdenes de producción de la orden de pedido elegida.
  useEffect(() => {
    if (!isCreate || !orderId) {
      setDetails([]);
      return;
    }
    apiFetch(`/api/order-heads/${orderId}/details`)
      .then((r) => r.json())
      .then((rows: OrderDetailOption[]) => setDetails(rows))
      .catch((err) => console.error("Error al cargar órdenes de producción:", err));
  }, [isCreate, orderId]);

  const ordersOfBrand = useMemo(
    () => (brandId ? orders.filter((o) => String(o.idDlkBrand) === brandId) : []),
    [orders, brandId]
  );

  const selectedDetail = useMemo(
    () => details.find((d) => String(d.idDlkOrderDetail) === detailId) ?? null,
    [details, detailId]
  );

  const sizeOptions = useMemo(() => activeSizes(selectedDetail), [selectedDetail]);

  // ── Identidad mostrada al actualizar/ver ─────────────────────────────
  const identity = useMemo(() => {
    if (isCreate) return null;
    const detail = footprint?.orderDetail;
    return {
      marca: detail?.orderHead?.brand?.nameBrand ?? "—",
      ordenPedido: detail?.orderHead?.codOrderHead ?? "—",
      ordenProduccion: detail?.codOrderDetail ?? "—",
      size: footprint?.size ?? "—",
    };
  }, [isCreate, footprint]);

  function onBrandChange(value: string) {
    setBrandId(value);
    setOrderId("");
    setDetailId("");
    setSize("");
  }

  function onOrderChange(value: string) {
    setOrderId(value);
    setDetailId("");
    setSize("");
  }

  function onDetailChange(value: string) {
    setDetailId(value);
    setSize("");
  }

  async function onPickReport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setReport({ base64: await readFileAsBase64(file), name: file.name, existing: false });
  }

  /** El endpoint del informe exige token, así que no sirve un window.open directo. */
  const downloadReport = useCallback(async () => {
    if (!footprint) return;
    try {
      const res = await apiFetch(`/api/water-footprints/${footprint.idDlkWaterFootprint}/report`);
      if (!res.ok) throw new Error("No se pudo descargar el informe");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // El navegador ya tiene el blob; liberar la URL enseguida cancelaría la pestaña.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al descargar el informe");
    }
  }, [footprint]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;

    if (isCreate && !detailId) {
      alert("Seleccioná la orden de producción");
      return;
    }
    if (isCreate && !size) {
      alert("Seleccioná la talla");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        weight,
        waterFootprint: h2o,
        estimatedValue: estimated ? 1 : 0,
        unitDescription,
        scope,
      };

      if (report.base64 === CLEAR) {
        body.clearReportFile = true;
      } else if (report.base64) {
        body.reportFileBase64 = report.base64;
        body.report = report.name;
      }

      const res = isCreate
        ? await apiFetch("/api/water-footprints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...body,
              idDlkOrderDetail: Number(detailId),
              size,
              stateWaterFootprint: 1,
            }),
          })
        : await apiFetch(`/api/water-footprints/${footprint?.idDlkWaterFootprint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, stateWaterFootprint: state }),
          });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al guardar la huella hídrica");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            La huella se carga por orden de producción y talla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          {isCreate ? (
            <>
              <div className="space-y-1.5">
                <Label>Marca</Label>
                <Select value={brandId} onValueChange={onBrandChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.idDlkBrand} value={String(b.idDlkBrand)}>
                        {b.nameBrand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Orden de Pedido</Label>
                <Select value={orderId} onValueChange={onOrderChange} disabled={!brandId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={brandId ? "Seleccionar orden" : "Elegí una marca primero"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {ordersOfBrand.length === 0 ? (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        La marca no tiene órdenes de pedido
                      </div>
                    ) : (
                      ordersOfBrand.map((o) => (
                        <SelectItem key={o.idDlkOrderHead} value={String(o.idDlkOrderHead)}>
                          {o.codOrderHead ?? `Orden ${o.idDlkOrderHead}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Orden de Producción</Label>
                <Select value={detailId} onValueChange={onDetailChange} disabled={!orderId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={orderId ? "Seleccionar orden de producción" : "Elegí una orden"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {details.length === 0 ? (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        La orden no tiene órdenes de producción
                      </div>
                    ) : (
                      details.map((d) => (
                        <SelectItem key={d.idDlkOrderDetail} value={String(d.idDlkOrderDetail)}>
                          {d.codOrderDetail ?? `Detalle ${d.idDlkOrderDetail}`}
                          {d.nomEstilo ? ` — ${d.nomEstilo}` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Talla</Label>
                <Select value={size} onValueChange={setSize} disabled={!detailId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={detailId ? "Seleccionar talla" : "Elegí una orden de producción"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.length === 0 ? (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        La orden de producción no tiene tallas con unidades
                      </div>
                    ) : (
                      sizeOptions.map((s) => (
                        <SelectItem key={s.field} value={s.label}>
                          {s.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 rounded-md bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Marca:</span>
              <span className="font-medium">{identity?.marca}</span>
              <span className="text-muted-foreground">Orden de Pedido:</span>
              <span className="font-medium">{identity?.ordenPedido}</span>
              <span className="text-muted-foreground">Orden de Producción:</span>
              <span className="font-medium">{identity?.ordenProduccion}</span>
              <span className="text-muted-foreground">Talla:</span>
              <span className="font-medium">{identity?.size}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Peso (Kg.)</Label>
              <Input
                type="number"
                step="0.0001"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={readOnly}
                placeholder="0.889"
              />
            </div>
            <div className="space-y-1.5">
              <Label>H2O (L)</Label>
              <Input
                type="number"
                step="0.0001"
                min="0"
                value={h2o}
                onChange={(e) => setH2o(e.target.value)}
                disabled={readOnly}
                placeholder="10724"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={estimated}
              onChange={(e) => setEstimated(e.target.checked)}
              disabled={readOnly}
              className="h-4 w-4 rounded border-input"
            />
            <span>Valor estimado (no medido)</span>
          </label>

          <div className="space-y-1.5">
            <Label>Unidad de Medición</Label>
            <textarea
              value={unitDescription}
              onChange={(e) => setUnitDescription(e.target.value)}
              disabled={readOnly}
              rows={2}
              maxLength={500}
              placeholder="Por set completo (Chaqueta m/l + Pantalón)"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Alcance</Label>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              disabled={readOnly}
              rows={3}
              maxLength={1000}
              placeholder={"Agrícola (~99%) | Tintorería (<1%) | Confección (<1%)"}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Informe (PDF)</Label>
            <div className="flex flex-wrap items-center gap-2">
              {!readOnly && (
                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={onPickReport}
                  className="cursor-pointer"
                />
              )}
              {report.name && report.base64 !== CLEAR && (
                <span className="text-xs text-muted-foreground">{report.name}</span>
              )}
              {report.existing && report.base64 !== CLEAR && !report.base64 && (
                <Button type="button" variant="outline" size="sm" onClick={downloadReport}>
                  Ver
                </Button>
              )}
              {!readOnly && report.name && report.base64 !== CLEAR && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReport({ base64: CLEAR, name: "", existing: false })}
                >
                  Quitar
                </Button>
              )}
              {readOnly && !report.existing && (
                <span className="text-xs text-muted-foreground">Sin informe adjunto</span>
              )}
            </div>
          </div>

          {!isCreate && (
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={String(state)}
                onValueChange={(v) => setState(Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">On</SelectItem>
                  <SelectItem value="0">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {readOnly ? (
            <Button type="button" className="w-full" variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          ) : (
            <Button type="submit" className="w-full bg-primary" disabled={saving}>
              {saving ? "Guardando…" : isCreate ? "Crear" : "Actualizar"}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
