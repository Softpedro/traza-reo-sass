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
  locationDigitalIdentifier: string | null;
};

/** Pieza en el formulario: nombre + identificador digital. `idComponent` solo en edición. */
type PieceForm = { idComponent?: number; name: string; idDigital: number };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  order: OrderHeadInfo | null;
  colorway: Colorway | null;
  labelHead: LabelHead | null;
  /** Talla específica que esta etiqueta cubre (cada cabecera vive por (colorway × talla)). */
  talla: string | null;
  /** Cabeceras ya existentes de la orden, para previsualizar el inicio automático. */
  labelHeads: LabelHead[];
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
  labelHeads,
  onSuccess,
}: Props) {
  const [identifiers, setIdentifiers] = useState<DigitalIdentifierOption[]>([]);
  const [idDigital, setIdDigital] = useState<number>(0);
  const [gtin, setGtin] = useState("");
  const [estampado, setEstampado] = useState("");
  const [estado, setEstado] = useState(1);
  const [esSet, setEsSet] = useState(false);
  const [numPiezas, setNumPiezas] = useState(2);
  const [pieces, setPieces] = useState<PieceForm[]>([]);
  const [cantidad, setCantidad] = useState("");
  const [saving, setSaving] = useState(false);

  /** Talla efectiva: la que llega por prop (create) o la guardada en labelHead (edit). */
  const tallaActual = talla ?? labelHead?.size ?? null;

  /** ¿Esta etiqueta es un set? En create lo decide el toggle; en edit, si tiene componentes. */
  const isSet = mode === "create" ? esSet : (labelHead?.components?.length ?? 0) > 0;

  /** Cantidad por defecto = lo que el pedido trae para esta talla. */
  const defaultQtyForTalla = useMemo(() => {
    if (!colorway || !tallaActual) return 0;
    const field = SIZE_FIELDS.find((s) => s.label === tallaActual)?.field;
    if (!field) return 0;
    return Number(colorway[field] ?? 0) || 0;
  }, [colorway, tallaActual]);

  const totalUnidades = Number(cantidad) || 0;
  const totalDetails = totalUnidades * (esSet ? numPiezas : 1);

  // Unidades / DPPs a mostrar (en edit se derivan del total guardado).
  const piezasCount = isSet ? Math.max(pieces.length, 1) : 1;
  const unidadesShown =
    mode === "create"
      ? totalUnidades
      : labelHead?.totalLabel != null
        ? Math.round(labelHead.totalLabel / piezasCount)
        : 0;
  const dppsShown = mode === "create" ? totalDetails : (labelHead?.totalLabel ?? 0);

  // Inicio SIEMPRE automático: secuencia continua a nivel de toda la orden (tras el último
  // rango de cualquier etiqueta, sin importar GTIN/talla). Misma regla que el backend, que
  // es la autoridad al guardar. El usuario solo lo visualiza.
  const inicioPreview = useMemo(() => {
    if (mode === "edit") return labelHead?.inicioSerializacion ?? null;
    const maxFin = labelHeads.reduce((m, l) => Math.max(m, l.finSerializacion ?? 0), 0);
    return maxFin + 1;
  }, [mode, labelHead, labelHeads]);

  const finaliza =
    mode === "edit"
      ? (labelHead?.finSerializacion ?? null)
      : inicioPreview != null && totalDetails > 0
        ? inicioPreview + totalDetails - 1
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
    if (mode === "edit" && labelHead) {
      setIdDigital(labelHead.idDlkDigitalIdentifier ?? 0);
      setGtin(labelHead.codGtin ?? "");
      setEstampado(labelHead.estampado ?? "");
      setEstado(labelHead.stateOrderLabelHead === 0 ? 0 : 1);
      setCantidad(labelHead.totalLabel != null ? String(labelHead.totalLabel) : "");
      const comps = (labelHead.components ?? [])
        .slice()
        .sort((a, b) => a.numPiece - b.numPiece);
      setPieces(
        comps.map((c) => ({
          idComponent: c.idDlkOrderLabelComponent,
          name: c.nameComponent ?? "",
          idDigital: c.idDlkDigitalIdentifier ?? 0,
        }))
      );
      setEsSet(comps.length > 0);
      setNumPiezas(comps.length > 0 ? comps.length : 2);
    } else {
      setIdDigital(0);
      setGtin("");
      setEstampado("");
      setEstado(1);
      setEsSet(false);
      setNumPiezas(2);
      setPieces([]);
      setCantidad(defaultQtyForTalla > 0 ? String(defaultQtyForTalla) : "");
    }
  }, [open, mode, labelHead, defaultQtyForTalla]);

  // Create: sincroniza la lista de piezas con el nº de piezas elegido.
  useEffect(() => {
    if (mode !== "create") return;
    if (!esSet) {
      setPieces([]);
      return;
    }
    setPieces((prev) => {
      const defaults = defaultPieceNames(numPiezas);
      return Array.from({ length: numPiezas }, (_, i) =>
        prev[i] ?? { name: defaults[i], idDigital: 0 }
      );
    });
  }, [mode, esSet, numPiezas]);

  function setPiece(i: number, patch: Partial<PieceForm>) {
    setPieces((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  /**
   * Asigna un identificador a la pieza i. Si otra pieza ya lo tenía, se INTERCAMBIAN
   * (esa pieza recibe el anterior de la pieza i). Así nunca hay duplicados y siempre se
   * puede corregir/revertir una selección, incluso con solo 2 identificadores.
   */
  function selectPieceIdentifier(i: number, newId: number) {
    setPieces((prev) => {
      const prevId = prev[i]?.idDigital ?? 0;
      if (prevId === newId) return prev;
      return prev.map((p, idx) => {
        if (idx === i) return { ...p, idDigital: newId };
        if (p.idDigital === newId) return { ...p, idDigital: prevId };
        return p;
      });
    });
  }

  /** Ubicación del identificador digital seleccionado (ayuda visual para el usuario). */
  function locationOf(id: number): string | null {
    return identifiers.find((it) => it.idDlkDigitalIdentifier === id)?.locationDigitalIdentifier ?? null;
  }

  async function handleSubmit() {
    if (!order || !colorway) return;

    if (mode === "create") {
      if (!tallaActual) {
        alert("Falta la talla — recargá la página");
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
    }

    // Validación de identificadores: set → por pieza; no-set → uno solo.
    if (isSet) {
      if (mode === "create" && numPiezas < 2) {
        alert("Un set debe tener al menos 2 piezas");
        return;
      }
      if (pieces.some((p) => !p.name.trim())) {
        alert("Asigna un nombre a cada pieza del set");
        return;
      }
      if (pieces.some((p) => !p.idDigital || p.idDigital <= 0)) {
        alert("Selecciona el identificador digital de cada pieza");
        return;
      }
      const chosen = pieces.map((p) => p.idDigital);
      if (new Set(chosen).size !== chosen.length) {
        alert("Cada pieza debe tener un identificador digital distinto");
        return;
      }
    } else if (!idDigital || idDigital <= 0) {
      alert("Debes seleccionar un identificador digital");
      return;
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
          // Identificador de cabecera (denormalizado): set → 1ª pieza; no-set → el único.
          idDlkDigitalIdentifier: esSet ? pieces[0]?.idDigital : idDigital,
          codGtin: gtin.trim() || null,
          size: tallaActual,
          totalLabel: totalUnidades,
          estampado: estampado.trim() || null,
          esSet: esSet ? 1 : 0,
          ...(esSet
            ? {
                numPiezas,
                pieces: pieces.map((p, i) => ({
                  numPiece: i + 1,
                  name: p.name.trim(),
                  idDlkDigitalIdentifier: p.idDigital,
                })),
              }
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
          ...(isSet
            ? {
                pieces: pieces.map((p) => ({
                  idDlkOrderLabelComponent: p.idComponent,
                  name: p.name.trim(),
                  idDlkDigitalIdentifier: p.idDigital,
                })),
              }
            : { idDlkDigitalIdentifier: idDigital }),
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

  const renderIdentifierItem = (it: DigitalIdentifierOption) => (
    <SelectItem key={it.idDlkDigitalIdentifier} value={String(it.idDlkDigitalIdentifier)}>
      <span className="block">
        {it.codDigitalIdentifier}
        {it.typeDigitalIdentifier ? ` — ${it.typeDigitalIdentifier}` : ""}
      </span>
      {it.locationDigitalIdentifier && (
        <span className="block text-xs text-muted-foreground">
          📍 {it.locationDigitalIdentifier}
        </span>
      )}
    </SelectItem>
  );
  const identifierItems = identifiers.map(renderIdentifierItem);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Identificador a nivel cabecera: SOLO para etiquetas no-set. En sets va por pieza. */}
          {!isSet && (
            <Row label="Identificador Digital">
              <Select
                value={idDigital ? String(idDigital) : ""}
                onValueChange={(v) => setIdDigital(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar identificador" />
                </SelectTrigger>
                <SelectContent>{identifierItems}</SelectContent>
              </Select>
              {idDigital > 0 && locationOf(idDigital) && (
                <p className="mt-1 text-xs text-muted-foreground">
                  📍 Ubicación: {locationOf(idDigital)}
                </p>
              )}
            </Row>
          )}

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

          {/* ¿Es set? / Cantidad de piezas — editable en create, solo lectura en edit. */}
          {mode === "create" ? (
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
          ) : (
            <>
              <Row label="¿Es set?">
                <Input readOnly value={isSet ? "Sí — un DPP por pieza" : "No"} />
              </Row>
              {isSet && (
                <Row label="Cantidad de piezas">
                  <Input readOnly value={String(pieces.length)} />
                </Row>
              )}
            </>
          )}

          {/* Cantidad de producción — editable en create, solo lectura en edit. */}
          <div className="flex flex-col gap-2 rounded-md border bg-muted/30 px-3 py-2">
            <Row label="Cantidad">
              {mode === "create" ? (
                <Input
                  type="number"
                  min="0"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder={`Unidades para talla ${tallaActual ?? ""}`}
                />
              ) : (
                <Input readOnly value={String(unidadesShown)} />
              )}
            </Row>
            <p className="text-xs text-muted-foreground">
              Producción: <strong>{unidadesShown}</strong>
              {isSet ? ` · ${dppsShown} DPPs` : ""}
              {defaultQtyForTalla > 0 ? ` · pedido: ${defaultQtyForTalla}` : ""}
            </p>
          </div>

          <Row label="Inicia">
            <Input readOnly value={inicioPreview != null ? String(inicioPreview) : "—"} />
          </Row>
          <Row label="Finaliza">
            <Input readOnly value={finaliza != null ? String(finaliza) : "—"} />
          </Row>
          <p className="text-center text-xs text-muted-foreground">
            El rango de serialización es automático y secuencial; no se puede editar.
          </p>

          {/* Piezas del set: nombre + identificador digital por pieza. */}
          {isSet && pieces.length > 0 && (
            <div className="flex flex-col gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-3">
              <p className="text-xs text-amber-800">
                Set de <strong>{pieces.length} piezas</strong>: se genera un DPP por pieza (
                <strong>{dppsShown}</strong> en total).
              </p>
              {pieces.map((p, i) => (
                <div key={p.idComponent ?? i} className="grid gap-2 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-amber-800">Pieza {i + 1}</Label>
                    <Input
                      value={p.name}
                      placeholder={`Pieza ${i + 1}`}
                      onChange={(e) => setPiece(i, { name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-amber-800">
                      Identificador Digital
                    </Label>
                    <Select
                      value={p.idDigital ? String(p.idDigital) : ""}
                      onValueChange={(v) => selectPieceIdentifier(i, Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      {/* Todas las opciones: si eliges una que otra pieza tiene, se intercambian. */}
                      <SelectContent>{identifiers.map(renderIdentifierItem)}</SelectContent>
                    </Select>
                    {p.idDigital > 0 && locationOf(p.idDigital) && (
                      <p className="text-xs text-amber-700">
                        📍 Ubicación: {locationOf(p.idDigital)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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
