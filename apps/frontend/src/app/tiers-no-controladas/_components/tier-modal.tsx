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
import { TIER2_SERVICES, tier2ServiceBlocker, type TierConfig } from "./tier-config";
import type { PresetOrder, UncontrolledLayer } from "./types";
import { OriginField, PERU, formatOrigin, parseOrigin } from "./origin-field";

export type TierModalMode = "create" | "edit" | "view";

type Props = {
  config: TierConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: TierModalMode;
  /** Registro a actualizar/ver. */
  record: UncontrolledLayer | null;
  /** Al crear: OP ya elegida (y servicio, en Tier 2) desde la tabla. */
  preset?: { order: PresetOrder; service?: number } | null;
  /** Registros del tier ya cargados, para no ofrecer lo que el backend rechazaría. */
  existing: UncontrolledLayer[];
  onSuccess: () => void;
};

type BrandOption = { idDlkBrand: number; codBrand: string; nameBrand: string };

type OrderHeadOption = {
  idDlkOrderHead: number;
  idDlkBrand: number | null;
  codOrderHead: string | null;
};

type OrderDetailOption = {
  idDlkOrderDetail: number;
  codOrderDetail: string | null;
  nomEstilo: string | null;
};

type SupplierOption = { idDlkSupplier: number; nameSupplier: string; stateSupplier: number };

type FileState = { base64: string; name: string; existing: boolean };

const emptyFile: FileState = { base64: "", name: "", existing: false };

/** Marca de borrado del adjunto, igual que en el modal de Suministro. */
const CLEAR = "__CLEAR__";

/** Mismo estilo que el Input del paquete de UI, que no exporta textarea. */
const textareaClass =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });
}

/** ISO del API → `YYYY-MM-DD` del input date. La BD guarda DATE, así que la hora es 00:00Z. */
function toDateInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export function TierModal({
  config,
  open,
  onOpenChange,
  mode,
  record,
  preset,
  existing,
  onSuccess,
}: Props) {
  const { tier, productLabel, productPlaceholder, extraField } = config;
  const isCreate = mode === "create";
  const readOnly = mode === "view";

  const [saving, setSaving] = useState(false);

  // Cascada: sólo se usa al crear sin OP preelegida.
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [orders, setOrders] = useState<OrderHeadOption[]>([]);
  const [details, setDetails] = useState<OrderDetailOption[]>([]);
  const [brandId, setBrandId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [detailId, setDetailId] = useState("");

  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);

  const [product, setProduct] = useState("");
  const [service, setService] = useState("");
  const [origin, setOrigin] = useState({ region: "", country: "" });
  const [supplier, setSupplier] = useState("");
  const [transmitter, setTransmitter] = useState("");
  const [certificate, setCertificate] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [state, setState] = useState(1);
  const [sheet, setSheet] = useState<FileState>(emptyFile);

  const pickOrder = isCreate && !preset;
  const title = `${isCreate ? "Crear " : readOnly ? "" : "Actualizar "}Tier ${tier}`;

  // ── Carga inicial ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setSaving(false);
    setSheet(emptyFile);

    apiFetch("/api/suppliers")
      .then((r) => r.json())
      .then((rows: SupplierOption[]) => setSuppliers(Array.isArray(rows) ? rows : []))
      .catch((err) => console.error("Error al cargar proveedores:", err));

    if (isCreate) {
      setBrandId("");
      setOrderId("");
      setDetailId(preset ? String(preset.order.idDlkOrderDetail) : "");
      setDetails([]);
      setProduct("");
      setService(preset?.service ? String(preset.service) : "");
      setOrigin({ region: "", country: tier === 4 ? PERU : "" });
      setSupplier("");
      setTransmitter("");
      setCertificate("");
      setCertificateNumber("");
      setDateOfIssue("");
      setExpirationDate("");
      setStartDate("");
      setEndDate("");
      setState(1);

      if (!preset) {
        Promise.all([
          apiFetch("/api/brands").then((r) => r.json()),
          apiFetch("/api/order-heads").then((r) => r.json()),
        ])
          .then(([brandRows, orderRows]: [BrandOption[], OrderHeadOption[]]) => {
            setBrands(brandRows);
            setOrders(orderRows);
          })
          .catch((err) => console.error("Error al cargar marcas/órdenes:", err));
      }
      return;
    }

    if (!record) return;
    // El adjunto no viaja en el listado: se lee de la fila completa.
    apiFetch(`/api/uncontrolled-layers/${record.idDlkUncontrolledLayers}`)
      .then((r) => r.json())
      .then((row: UncontrolledLayer) => {
        setProduct(row.product ?? "");
        setService(row.service != null ? String(row.service) : "");
        setOrigin(parseOrigin(row.origin));
        setSupplier(row.supplier ?? "");
        setTransmitter(row.transmitter ?? "");
        setCertificate(row.certificate ?? "");
        setCertificateNumber(row.certificateNumber ?? "");
        setDateOfIssue(toDateInput(row.dateOfIssue));
        setExpirationDate(toDateInput(row.expirationDate));
        setStartDate(toDateInput(row.startDate));
        setEndDate(toDateInput(row.endDate));
        setState(row.stateUncontrolledLayers ?? 1);
        if (row.hasCertificateSheet) {
          setSheet({ base64: "", name: "Certificado adjunto", existing: true });
        }
      })
      .catch((err) => console.error(`Error al cargar Tier ${tier}:`, err));
  }, [open, isCreate, record, preset, tier]);

  // Órdenes de producción de la orden de pedido elegida.
  useEffect(() => {
    if (!pickOrder || !orderId) {
      setDetails([]);
      return;
    }
    apiFetch(`/api/order-heads/${orderId}/details`)
      .then((r) => r.json())
      .then((rows: OrderDetailOption[]) => setDetails(rows))
      .catch((err) => console.error("Error al cargar órdenes de producción:", err));
  }, [pickOrder, orderId]);

  const ordersOfBrand = useMemo(
    () => (brandId ? orders.filter((o) => String(o.idDlkBrand) === brandId) : []),
    [orders, brandId]
  );

  /** Servicios de Tier 2 ya cargados por OP. En Tier 3/4 sólo importa si la OP tiene alguno. */
  const loadedByDetail = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (const r of existing) {
      const set = map.get(r.idDlkOrderDetail) ?? new Set<number>();
      if (r.service != null) set.add(r.service);
      map.set(r.idDlkOrderDetail, set);
    }
    return map;
  }, [existing]);

  const loadedServices = loadedByDetail.get(Number(detailId)) ?? new Set<number>();

  /** Por qué una OP no admite otro registro de este tier, o `null` si lo admite. */
  function detailBlocker(idDlkOrderDetail: number): string | null {
    const loaded = loadedByDetail.get(idDlkOrderDetail);
    if (!loaded) return null;
    if (tier !== 2) return "ya cargada";
    return TIER2_SERVICES.every((s) => tier2ServiceBlocker(s.value, loaded)) ? "completa" : null;
  }

  /**
   * Proveedores activos. Se guarda el nombre, así que si el registro trae uno que ya no
   * está en la lista (dado de baja o renombrado) se agrega para no perderlo al editar.
   */
  const supplierNames = useMemo(() => {
    const names = suppliers.filter((s) => s.stateSupplier === 1).map((s) => s.nameSupplier);
    if (supplier && !names.includes(supplier)) names.unshift(supplier);
    return names;
  }, [suppliers, supplier]);

  // ── Identidad mostrada cuando la OP ya está fijada ───────────────────
  const identity = useMemo(() => {
    if (preset) return preset.order;
    if (isCreate) return null;
    const detail = record?.orderDetail;
    return {
      marca: detail?.orderHead?.brand?.nameBrand ?? "—",
      ordenPedido: detail?.orderHead?.codOrderHead ?? "—",
      ordenProduccion: detail?.codOrderDetail ?? "—",
    };
  }, [preset, isCreate, record]);

  function onBrandChange(value: string) {
    setBrandId(value);
    setOrderId("");
    setDetailId("");
    setService("");
  }

  function onOrderChange(value: string) {
    setOrderId(value);
    setDetailId("");
    setService("");
  }

  function onDetailChange(value: string) {
    setDetailId(value);
    setService("");
  }

  async function onPickSheet(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSheet({ base64: await readFileAsBase64(file), name: file.name, existing: false });
  }

  /** El endpoint del certificado exige token, así que no sirve un window.open directo. */
  const downloadSheet = useCallback(async () => {
    if (!record) return;
    try {
      const res = await apiFetch(
        `/api/uncontrolled-layers/${record.idDlkUncontrolledLayers}/certificate`
      );
      if (!res.ok) throw new Error("No se pudo descargar el certificado");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // El navegador ya tiene el blob; liberar la URL enseguida cancelaría la pestaña.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al descargar el certificado");
    }
  }, [record]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;

    if (isCreate && !detailId) {
      alert("Seleccioná la orden de producción");
      return;
    }
    if (isCreate && extraField === "service" && !service) {
      alert("Seleccioná el servicio");
      return;
    }
    if (extraField === "origin" && origin.country === PERU && !origin.region) {
      alert("Seleccioná el departamento de origen");
      return;
    }
    if (dateOfIssue && expirationDate && expirationDate < dateOfIssue) {
      alert("La fecha de caducidad no puede ser anterior a la de expedición");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      alert("La fecha de término no puede ser anterior a la de inicio");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        product,
        supplier,
        transmitter,
        certificate,
        certificateNumber,
        dateOfIssue,
        expirationDate,
        startDate,
        endDate,
      };
      if (extraField === "origin") body.origin = formatOrigin(origin.region, origin.country);

      if (sheet.base64 === CLEAR) {
        body.clearCertificateSheet = true;
      } else if (sheet.base64) {
        body.certificateSheetBase64 = sheet.base64;
      }

      const res = isCreate
        ? await apiFetch("/api/uncontrolled-layers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...body,
              tier,
              idDlkOrderDetail: Number(detailId),
              ...(extraField === "service" ? { service: Number(service) } : {}),
              stateUncontrolledLayers: 1,
            }),
          })
        : await apiFetch(`/api/uncontrolled-layers/${record?.idDlkUncontrolledLayers}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, stateUncontrolledLayers: state }),
          });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error al guardar Tier ${tier}`);
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

  // El servicio sólo se elige al crear sin preselección; después identifica el registro.
  const serviceLocked = readOnly || !isCreate || !!preset?.service;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{config.title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          {pickOrder ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Tier:</span>
                <span className="font-semibold">Tier {tier}</span>
              </div>

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
                      details.map((d) => {
                        const blocker = detailBlocker(d.idDlkOrderDetail);
                        return (
                          <SelectItem
                            key={d.idDlkOrderDetail}
                            value={String(d.idDlkOrderDetail)}
                            disabled={!!blocker}
                          >
                            {d.codOrderDetail ?? `Detalle ${d.idDlkOrderDetail}`}
                            {d.nomEstilo ? ` — ${d.nomEstilo}` : ""}
                            {blocker ? ` (${blocker})` : ""}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 rounded-md bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Tier:</span>
              <span className="font-medium">Tier {tier}</span>
              <span className="text-muted-foreground">Marca:</span>
              <span className="font-medium">{identity?.marca}</span>
              <span className="text-muted-foreground">Orden de Pedido:</span>
              <span className="font-medium">{identity?.ordenPedido}</span>
              <span className="text-muted-foreground">Orden de Producción:</span>
              <span className="font-medium">{identity?.ordenProduccion}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{productLabel}</Label>
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              disabled={readOnly}
              rows={2}
              maxLength={200}
              placeholder={productPlaceholder}
              className={textareaClass}
            />
          </div>

          {extraField === "service" && (
            <div className="space-y-1.5">
              <Label>Servicio</Label>
              <Select value={service} onValueChange={setService} disabled={serviceLocked}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={detailId ? "Seleccionar servicio" : "Elegí la orden de producción"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {TIER2_SERVICES.map((s) => {
                    // Al editar se muestra el propio servicio; al crear, sólo los permitidos.
                    const blocker = serviceLocked ? null : tier2ServiceBlocker(s.value, loadedServices);
                    return (
                      <SelectItem key={s.value} value={String(s.value)} disabled={!!blocker}>
                        {s.label}
                        {blocker ? ` (${blocker})` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {extraField === "origin" && (
            <OriginField
              region={origin.region}
              country={origin.country}
              onChange={setOrigin}
              disabled={readOnly}
            />
          )}

          <div className="space-y-1.5">
            <Label>Proveedor</Label>
            <Select value={supplier} onValueChange={setSupplier} disabled={readOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {supplierNames.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    No hay proveedores registrados
                  </div>
                ) : (
                  supplierNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Emisor</Label>
            <Input
              value={transmitter}
              onChange={(e) => setTransmitter(e.target.value)}
              disabled={readOnly}
              maxLength={100}
              placeholder="Control Union"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Certificado</Label>
            <Input
              value={certificate}
              onChange={(e) => setCertificate(e.target.value)}
              disabled={readOnly}
              maxLength={100}
              placeholder="Global Organic Textile Standard (GOTS)"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Nro. Certificado</Label>
            <Input
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              disabled={readOnly}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fecha Expedición</Label>
              <Input
                type="date"
                value={dateOfIssue}
                onChange={(e) => setDateOfIssue(e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fecha Caducidad</Label>
              <Input
                type="date"
                value={expirationDate}
                min={dateOfIssue || undefined}
                onChange={(e) => setExpirationDate(e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Certificado (PDF)</Label>
            <div className="flex flex-wrap items-center gap-2">
              {!readOnly && (
                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={onPickSheet}
                  className="cursor-pointer"
                />
              )}
              {sheet.name && sheet.base64 !== CLEAR && (
                <span className="text-xs text-muted-foreground">{sheet.name}</span>
              )}
              {sheet.existing && sheet.base64 !== CLEAR && !sheet.base64 && (
                <Button type="button" variant="outline" size="sm" onClick={downloadSheet}>
                  Ver
                </Button>
              )}
              {!readOnly && sheet.name && sheet.base64 !== CLEAR && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSheet({ base64: CLEAR, name: "", existing: false })}
                >
                  Quitar
                </Button>
              )}
              {readOnly && !sheet.existing && (
                <span className="text-xs text-muted-foreground">Sin certificado adjunto</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fecha Término</Label>
              <Input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={readOnly}
              />
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
            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
