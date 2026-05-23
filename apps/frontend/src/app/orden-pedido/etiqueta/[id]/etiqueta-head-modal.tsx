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
  /** Talla específica que esta etiqueta cubre (cada cabecera vive por (colorway × talla)). */
  talla: string | null;
  onSuccess: () => void;
}

const ESTAMPADO_OPTIONS = ["SIN ESTAMPADO", "CON ESTAMPADO"] as const;

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

export function EtiquetaHeadModal({
  open,
  onOpenChange,
  mode,
  order,
  colorway,
  labelHead,
  talla,
  onSuccess,
}: Props) {
  const [identifiers, setIdentifiers] = useState<DigitalIdentifierOption[]>([]);
  const [idDigital, setIdDigital] = useState<number>(0);
  const [gtin, setGtin] = useState("");
  const [estampado, setEstampado] = useState("");
  const [inicio, setInicio] = useState("");
  const [estado, setEstado] = useState(1);
  const [esSet, setEsSet] = useState(false);
  const [numPiezas, setNumPiezas] = useState(2);
  const [pieceNames, setPieceNames] = useState<string[]>([]);
  const [cantidad, setCantidad] = useState("");
  const [saving, setSaving] = useState(false);

  /** Talla efectiva: la que llega por prop (create) o la guardada en labelHead (edit). */
  const tallaActual = talla ?? labelHead?.size ?? null;

  /** Cantidad por defecto = lo que el pedido trae para esta talla. */
  const defaultQtyForTalla = useMemo(() => {
    if (!colorway || !tallaActual) return 0;
    const field = SIZE_FIELDS.find((s) => s.label === tallaActual)?.field;
    if (!field) return 0;
    return Number(colorway[field] ?? 0) || 0;
  }, [colorway, tallaActual]);

  const totalUnidades = Number(cantidad) || 0;
  const totalDetails = totalUnidades * (esSet ? numPiezas : 1);

  const inicioNum = inicio.trim() === "" ? null : Number(inicio);
  const finaliza =
    mode === "edit"
      ? (labelHead?.finSerializacion ?? null)
      : inicioNum != null && Number.isFinite(inicioNum) && totalDetails > 0
        ? inicioNum + totalDetails - 1
        : null;

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
    setEsSet(false);
    setNumPiezas(2);
    if (mode === "edit" && labelHead) {
      setIdDigital(labelHead.idDlkDigitalIdentifier);
      setGtin(labelHead.codGtin ?? "");
      setEstampado(labelHead.estampado ?? "");
      setInicio(labelHead.inicioSerializacion != null ? String(labelHead.inicioSerializacion) : "");
      setEstado(labelHead.stateOrderLabelHead === 0 ? 0 : 1);
      setCantidad(labelHead.totalLabel != null ? String(labelHead.totalLabel) : "");
    } else {
      setIdDigital(0);
      setGtin("");
      setEstampado("");
      setInicio("");
      setEstado(1);
      setCantidad(defaultQtyForTalla > 0 ? String(defaultQtyForTalla) : "");
    }
  }, [open, mode, labelHead, defaultQtyForTalla]);

  useEffect(() => {
    if (!esSet) {
      setPieceNames([]);
      return;
    }
    setPieceNames((prev) => defaultPieceNames(numPiezas).map((def, i) => prev[i] ?? def));
  }, [esSet, numPiezas]);

  async function handleSubmit() {
    if (!order || !colorway) return;
    if (mode === "create") {
      if (!tallaActual) {
        alert("Falta la talla — recargá la página");
        return;
      }
      if (!idDigital || idDigital <= 0) {
        alert("Debes seleccionar un identificador digital");
        return;
      }
      if (!gtin.trim()) {
        alert("El GTIN es obligatorio");
        return;
      }
      if (totalUnidades <= 0) {
        alert("Ingresa la cantidad de producción para esta talla");
        return;
      }
      if (esSet && numPiezas < 2) {
        alert("Un set debe tener al menos 2 piezas");
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
          size: tallaActual,
          totalLabel: totalUnidades,
          estampado: estampado.trim() || null,
          ...(inicioNum != null && Number.isFinite(inicioNum)
            ? { inicioSerializacion: inicioNum }
            : {}),
          esSet: esSet ? 1 : 0,
          ...(esSet
            ? { numPiezas, pieceTypes: pieceNames.map((p) => p.trim()) }
            : {}),
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
            {tallaActual ? ` — Talla ${tallaActual}` : ""}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Cada talla genera su propia cabecera y GTIN."
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
          <Row label="Talla">
            <Input readOnly value={tallaActual ?? "—"} />
          </Row>
          <Row label="GTIN">
            <Input
              value={gtin}
              onChange={(e) => setGtin(e.target.value)}
              maxLength={14}
              placeholder="GTIN-14 de esta talla"
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

          {mode === "create" && (
            <>
              <Row label="¿Es set?">
                <Select value={esSet ? "1" : "0"} onValueChange={(v) => setEsSet(v === "1")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Sí — un DPP por pieza</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              {esSet && (
                <Row label="Cantidad de piezas">
                  <Input
                    type="number"
                    min="2"
                    value={numPiezas}
                    onChange={(e) =>
                      setNumPiezas(Math.max(2, Math.trunc(Number(e.target.value) || 2)))
                    }
                  />
                </Row>
              )}
            </>
          )}

          {mode === "edit" ? (
            <Row label="Total">
              <Input readOnly value={labelHead?.totalLabel != null ? String(labelHead.totalLabel) : "—"} />
            </Row>
          ) : (
            <div className="flex flex-col gap-2 rounded-md border bg-muted/30 px-3 py-2">
              <Row label="Cantidad">
                <Input
                  type="number"
                  min="0"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder={`Unidades para talla ${tallaActual ?? ""}`}
                />
              </Row>
              <p className="text-xs text-muted-foreground">
                Producción: <strong>{totalUnidades}</strong>
                {esSet ? ` · ${totalDetails} DPPs` : ""}
                {defaultQtyForTalla > 0 ? ` · pedido: ${defaultQtyForTalla}` : ""}
              </p>
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
                Etiqueta marcada como <strong>set de {numPiezas} piezas</strong>: se generarán{" "}
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
