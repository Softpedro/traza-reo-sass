"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { apiFetch } from "@/lib/api-fetch";
import { SIZE_FIELDS, type Colorway, type LabelHead, type OrderHeadInfo } from "./types";

type Mode = "create" | "edit";

type DigitalIdentifierOption = {
  idDlkDigitalIdentifier: number;
  codDigitalIdentifier: string;
  typeDigitalIdentifier: string | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  order: OrderHeadInfo | null;
  colorway: Colorway | null;
  labelHead: LabelHead | null;
  onSuccess: () => void;
}

/** Opciones de estampado. Se guardan tal cual en OD_ORDER_LABEL_HEAD.ESTAMPADO. */
const ESTAMPADO_OPTIONS = ["SIN ESTAMPADO", "CON ESTAMPADO"] as const;

/** Nombres de pieza por defecto para un colorway que es set. */
function defaultPieceNames(numPiezas: number): string[] {
  if (numPiezas === 2) return ["PANTALON", "CAMISA"];
  return Array.from({ length: numPiezas }, (_, i) => `PIEZA ${i + 1}`);
}

function Row(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <Label className="text-right text-xs font-semibold text-primary">{props.label}</Label>
      <div className="col-span-2">{props.children}</div>
    </div>
  );
}

type SizeQty = { field: string; label: string; qty: string };

export function EtiquetaHeadModal({
  open,
  onOpenChange,
  mode,
  order,
  colorway,
  labelHead,
  onSuccess,
}: Props) {
  const [identifiers, setIdentifiers] = useState<DigitalIdentifierOption[]>([]);
  const [idDigital, setIdDigital] = useState<number>(0);
  const [gtin, setGtin] = useState("");
  const [estampado, setEstampado] = useState("");
  const [inicio, setInicio] = useState("");
  const [estado, setEstado] = useState(1);
  const [pieceNames, setPieceNames] = useState<string[]>([]);
  const [sizeQtys, setSizeQtys] = useState<SizeQty[]>([]);
  const [totalQty, setTotalQty] = useState("");
  const [saving, setSaving] = useState(false);

  const esSet = colorway?.esSet === 1;
  const numPiezas = esSet ? Math.max(colorway?.numPiezas ?? 1, 1) : 1;

  /** Tallas que el colorway trae con cantidad > 0 (las tallas "activas" del estilo). */
  const colorwaySizeRows = useMemo(() => {
    if (!colorway) return [] as { field: string; label: string; qty: number }[];
    return SIZE_FIELDS.map((f) => ({
      field: f.field as string,
      label: f.label,
      qty: Number(colorway[f.field] ?? 0) || 0,
    })).filter((r) => r.qty > 0);
  }, [colorway]);

  /** Si hay tallas en la grilla se trabaja por talla; si no, Total plano. */
  const useGrid = sizeQtys.length > 0;

  /** Tallas aún no presentes en la grilla — disponibles para "Agregar talla". */
  const availableSizes = SIZE_FIELDS.filter(
    (f) => !sizeQtys.some((s) => s.field === String(f.field))
  );

  function addSize(field: string) {
    const f = SIZE_FIELDS.find((x) => String(x.field) === field);
    if (!f) return;
    const order = SIZE_FIELDS.map((x) => String(x.field));
    setSizeQtys((prev) =>
      [...prev, { field: String(f.field), label: f.label, qty: "" }].sort(
        (a, b) => order.indexOf(a.field) - order.indexOf(b.field)
      )
    );
  }

  function removeSize(field: string) {
    setSizeQtys((prev) => prev.filter((s) => s.field !== field));
  }

  useEffect(() => {
    if (!open) return;
    apiFetch("/api/digital-identifiers")
      .then(async (res) => {
        const data: unknown = await res.json();
        setIdentifiers(Array.isArray(data) ? (data as DigitalIdentifierOption[]) : []);
      })
      .catch(() => setIdentifiers([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && labelHead) {
      setIdDigital(labelHead.idDlkDigitalIdentifier);
      setGtin(labelHead.codGtin ?? "");
      setEstampado(labelHead.estampado ?? "");
      setInicio(labelHead.inicioSerializacion != null ? String(labelHead.inicioSerializacion) : "");
      setEstado(labelHead.stateOrderLabelHead === 0 ? 0 : 1);
    } else {
      setIdDigital(0);
      setGtin("");
      setEstampado("");
      setInicio("");
      setEstado(1);
      setPieceNames(esSet ? defaultPieceNames(numPiezas) : []);
      // Defaults de producción = cantidades del pedido (el usuario las ajusta).
      setSizeQtys(
        colorwaySizeRows.map((r) => ({ field: r.field, label: r.label, qty: String(r.qty) }))
      );
      setTotalQty(colorway?.totalEstilo ? String(colorway.totalEstilo) : "");
    }
  }, [open, mode, labelHead, esSet, numPiezas, colorwaySizeRows, colorway]);

  /** Total de unidades a producir (suma de la grilla, o el Total plano). */
  const total = useGrid
    ? sizeQtys.reduce((a, s) => a + (Number(s.qty) || 0), 0)
    : Number(totalQty) || 0;
  /** DPPs a generar = unidades × piezas por unidad. */
  const totalDetails = total * numPiezas;

  const inicioNum = inicio.trim() === "" ? null : Number(inicio);
  const finaliza =
    mode === "edit"
      ? (labelHead?.finSerializacion ?? null)
      : inicioNum != null && Number.isFinite(inicioNum) && totalDetails > 0
        ? inicioNum + totalDetails - 1
        : null;

  function setSizeQty(field: string, value: string) {
    setSizeQtys((prev) => prev.map((s) => (s.field === field ? { ...s, qty: value } : s)));
  }

  async function handleSubmit() {
    if (!order || !colorway) return;
    if (mode === "create") {
      if (!idDigital || idDigital <= 0) {
        alert("Debes seleccionar un identificador digital");
        return;
      }
      if (!gtin.trim()) {
        alert("El GTIN es obligatorio");
        return;
      }
      if (!total || total <= 0) {
        alert("Ingresa la cantidad de producción");
        return;
      }
      if (esSet && pieceNames.some((p) => !p.trim())) {
        alert("Asigna un nombre a cada pieza del set");
        return;
      }
    }
    setSaving(true);
    try {
      let url: string;
      let method: string;
      let payload: Record<string, unknown>;

      if (mode === "create") {
        url = apiUrl(`/api/order-heads/${order.idDlkOrderHead}/labels`);
        method = "POST";
        payload = {
          idDlkOrderDetail: colorway.idDlkOrderDetail,
          idDlkDigitalIdentifier: idDigital,
          codGtin: gtin.trim() || null,
          estampado: estampado.trim() || null,
          ...(inicioNum != null && Number.isFinite(inicioNum)
            ? { inicioSerializacion: inicioNum }
            : {}),
          ...(esSet ? { pieceTypes: pieceNames.map((p) => p.trim()) } : {}),
          ...(useGrid
            ? {
                sizeBreakdown: sizeQtys.map((s) => ({
                  size: s.label,
                  qty: Number(s.qty) || 0,
                })),
              }
            : { totalLabel: total }),
        };
      } else {
        url = apiUrl(
          `/api/order-heads/${order.idDlkOrderHead}/labels/${labelHead!.idDlkOrderLabelHead}`
        );
        method = "PUT";
        payload = {
          codGtin: gtin.trim() || null,
          estampado: estampado.trim() || null,
          stateOrderLabelHead: estado,
        };
      }

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar la etiqueta");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear etiqueta" : "Actualizar etiqueta"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Genera los DPPs de este colorway."
              : "Modifica los datos de la cabecera de etiqueta."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <Row label="Orden de pedido">
            <Input readOnly value={order?.codOrderHead ?? "—"} />
          </Row>
          <Row label="Código Estilo">
            <Input readOnly value={colorway?.codEstilo ?? "—"} />
          </Row>
          <Row label="Orden de Producción">
            <Input readOnly value={colorway?.codOrderDetail ?? "—"} />
          </Row>
          <Row label="Estilo">
            <Input readOnly value={colorway?.nomEstilo ?? "—"} />
          </Row>
          <Row label="Color way">
            <Input readOnly value={colorway?.colorAway ?? "—"} />
          </Row>
          <Row label="Fondo de tela">
            <Input readOnly value={colorway?.fondoTela ?? "—"} />
          </Row>
          <Row label="GTIN">
            <Input
              value={gtin}
              onChange={(e) => setGtin(e.target.value)}
              maxLength={14}
              placeholder="GTIN-14 del modelo"
            />
          </Row>
          <Row label="Identificador Digital">
            {mode === "edit" ? (
              <Input
                readOnly
                value={
                  labelHead?.digitalIdentifier?.codDigitalIdentifier ??
                  labelHead?.identifierType ??
                  "—"
                }
              />
            ) : (
              <Select
                value={idDigital ? String(idDigital) : ""}
                onValueChange={(v) => setIdDigital(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar identificador" />
                </SelectTrigger>
                <SelectContent>
                  {identifiers.map((it) => (
                    <SelectItem
                      key={it.idDlkDigitalIdentifier}
                      value={String(it.idDlkDigitalIdentifier)}
                    >
                      {it.codDigitalIdentifier}
                      {it.typeDigitalIdentifier ? ` — ${it.typeDigitalIdentifier}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Row>
          <Row label="Estampado">
            <Select value={estampado} onValueChange={setEstampado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {ESTAMPADO_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>

          {/* Cantidad de producción — editable solo al Crear. */}
          {mode === "edit" ? (
            <Row label="Total">
              <Input readOnly value={labelHead?.totalLabel != null ? String(labelHead.totalLabel) : "—"} />
            </Row>
          ) : useGrid ? (
            <div className="flex flex-col gap-2 rounded-md border bg-muted/30 px-3 py-2">
              <p className="text-xs font-semibold text-primary">
                Cantidad de producción por talla
              </p>
              <div className="grid grid-cols-4 gap-2">
                {sizeQtys.map((s) => (
                  <div key={s.field} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] text-muted-foreground">{s.label}</Label>
                      <button
                        type="button"
                        className="text-[10px] leading-none text-muted-foreground hover:text-destructive"
                        onClick={() => removeSize(s.field)}
                        title="Quitar talla"
                      >
                        ✕
                      </button>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      className="h-8"
                      value={s.qty}
                      onChange={(e) => setSizeQty(s.field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              {availableSizes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Agregar talla:</span>
                  <Select value="" onValueChange={addSize}>
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue placeholder="Talla" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map((f) => (
                        <SelectItem key={String(f.field)} value={String(f.field)}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Total producción: <strong>{total}</strong>
                {esSet ? ` · ${totalDetails} DPPs` : ""}
                {colorway?.totalEstilo != null ? ` · pedido: ${colorway.totalEstilo}` : ""}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-md border bg-muted/30 px-3 py-2">
              <Row label="Total">
                <Input
                  type="number"
                  min="0"
                  value={totalQty}
                  onChange={(e) => setTotalQty(e.target.value)}
                  placeholder="Cantidad de producción"
                />
              </Row>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  ¿Manejar por talla? Agregar talla:
                </span>
                <Select value="" onValueChange={addSize}>
                  <SelectTrigger className="h-8 w-28">
                    <SelectValue placeholder="Talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSizes.map((f) => (
                      <SelectItem key={String(f.field)} value={String(f.field)}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Row label="Inicia">
            <Input
              type="number"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              readOnly={mode === "edit"}
              placeholder={mode === "create" ? "Automático si se deja vacío" : ""}
            />
          </Row>
          <Row label="Finaliza">
            <Input readOnly value={finaliza != null ? String(finaliza) : "—"} />
          </Row>

          {mode === "edit" && (
            <Row label="Estado">
              <Select value={String(estado)} onValueChange={(v) => setEstado(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">On</SelectItem>
                  <SelectItem value="0">Off</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          )}

          {mode === "create" && esSet && (
            <div className="flex flex-col gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2">
              <p className="text-xs text-amber-800">
                Este colorway es un <strong>set de {numPiezas} piezas</strong>: se generarán{" "}
                <strong>{totalDetails > 0 ? totalDetails : numPiezas}</strong> DPPs (
                {numPiezas} por unidad), uno por pieza.
              </p>
              {pieceNames.map((name, i) => (
                <div key={i} className="grid grid-cols-3 items-center gap-3">
                  <Label className="text-right text-xs font-semibold text-amber-800">
                    Pieza {i + 1}
                  </Label>
                  <Input
                    className="col-span-2"
                    value={name}
                    onChange={(e) =>
                      setPieceNames((prev) =>
                        prev.map((p, idx) => (idx === i ? e.target.value : p))
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
