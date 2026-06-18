"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  Button,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";

type Mode = "create" | "edit" | "view";

const PERSPECTIVES = [
  { key: "FRONTAL", label: "Frontal" },
  { key: "LATERAL_DERECHO", label: "Lateral Derecho" },
  { key: "ESPALDA", label: "Espalda" },
  { key: "LATERAL_IZQUIERDO", label: "Lateral Izquierdo" },
] as const;

type PieceImage = { base64?: string; preview?: string | null };
type PieceState = { namePiece: string; images: Record<string, PieceImage> };

type BrandOption = {
  idDlkBrand: number;
  codBrand: string;
  nameBrand: string;
  parentCompany?: { idDlkParentCompany: number; codParentCompany: string; nameParentCompany: string } | null;
};
type SubbrandOption = { idDlkSubbrand: number; codSubbrand: string; nameSubbrand: string; idDlkBrand?: number };
type ParentCompanyOption = { idDlkParentCompany: number; codParentCompany: string; nameParentCompany: string };

interface ModelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  modelId: number | null;
  onSuccess: () => void;
}

const emptyForm = {
  nameModel: "",
  idDlkParentCompany: 0,
  idDlkBrand: 0,
  idDlkSubbrand: 0,
  desModel: "",
  nameCollection: "",
  desCollection: "",
  categoryModel: "",
  materialModel: "",
  compositionModel: "",
  colorway: "",
  fondoTela: "",
  versionTela: 0,
  year: "",
  season: "",
  sizeModel: "",
  isSet: 0,
  nroPieces: 1,
  careModel: "",
};

function dataUrlToBase64(dataUrl: string | null | undefined): string | undefined {
  if (!dataUrl) return undefined;
  const i = dataUrl.indexOf(",");
  return i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
}

export function ModelModal({ open, onOpenChange, mode, modelId, onSuccess }: ModelModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [pieces, setPieces] = useState<PieceState[]>([{ namePiece: "Prenda", images: {} }]);
  const [fichaBase64, setFichaBase64] = useState<string>("");
  const [fichaName, setFichaName] = useState<string>("");
  const [hasFicha, setHasFicha] = useState(false);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [subbrands, setSubbrands] = useState<SubbrandOption[]>([]);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const [piecePanel, setPiecePanel] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readOnly = mode === "view";

  // Opciones de selects
  useEffect(() => {
    if (!open) return;
    apiFetch("/api/brands").then((r) => r.json()).then((d) => setBrands(Array.isArray(d) ? d : [])).catch(() => {});
    apiFetch("/api/subbrands").then((r) => r.json()).then((d) => setSubbrands(Array.isArray(d) ? d : [])).catch(() => {});
    apiFetch("/api/parent-companies").then((r) => r.json()).then((d) => setEmpresas(Array.isArray(d) ? d : [])).catch(() => {});
  }, [open]);

  // Carga / reset al abrir
  useEffect(() => {
    if (!open) return;
    setError(null);
    setFichaBase64("");
    setFichaName("");
    setPiecePanel(null);
    if (mode === "create" || !modelId) {
      setForm(emptyForm);
      setPieces([{ namePiece: "Prenda", images: {} }]);
      setHasFicha(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await apiFetch(`/api/models/${modelId}`);
        if (!res.ok) return;
        const m = await res.json();
        if (cancelled) return;
        setForm({
          nameModel: m.nameModel ?? "",
          idDlkParentCompany: m.brand?.parentCompany?.idDlkParentCompany ?? 0,
          idDlkBrand: m.idDlkBrand ?? 0,
          idDlkSubbrand: m.idDlkSubbrand ?? 0,
          desModel: m.desModel ?? "",
          nameCollection: m.nameCollection ?? "",
          desCollection: m.desCollection ?? "",
          categoryModel: m.categoryModel ?? "",
          materialModel: m.materialModel ?? "",
          compositionModel: m.compositionModel ?? "",
          colorway: m.colorway ?? "",
          fondoTela: m.fondoTela ?? "",
          versionTela: m.versionTela === 1 ? 1 : 0,
          year: m.year != null ? String(m.year) : "",
          season: m.season ?? "",
          sizeModel: m.sizeModel ?? "",
          isSet: m.isSet === 1 ? 1 : 0,
          nroPieces: m.nroPieces ?? (Array.isArray(m.pieces) ? m.pieces.length : 1) ?? 1,
          careModel: m.careModel ?? "",
        });
        setHasFicha(Boolean(m.hasFicha));
        const loaded: PieceState[] = Array.isArray(m.pieces) && m.pieces.length
          ? m.pieces.map((p: { namePiece: string; images: { imageType: string; imageData: string | null }[] }) => {
              const images: Record<string, PieceImage> = {};
              for (const im of p.images ?? []) {
                images[im.imageType] = { preview: im.imageData };
              }
              return { namePiece: p.namePiece ?? "", images };
            })
          : [{ namePiece: "Prenda", images: {} }];
        setPieces(loaded);
      } catch {
        /* noop */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, mode, modelId]);

  // Sincroniza la cantidad de piezas con Set/Piezas
  function syncPieces(isSet: number, nro: number) {
    const count = isSet === 1 ? Math.max(1, Math.min(10, nro || 1)) : 1;
    setPieces((prev) => {
      const next = [...prev];
      if (count > next.length) {
        for (let i = next.length; i < count; i++) {
          next.push({ namePiece: isSet === 1 ? `Pieza ${i + 1}` : "Prenda", images: {} });
        }
      } else if (count < next.length) {
        next.length = count;
      }
      return next;
    });
  }

  function set<K extends keyof typeof emptyForm>(field: K, value: (typeof emptyForm)[K]) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handlePieceImage(pieceIdx: number, perspective: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPieces((prev) => {
        const next = [...prev];
        next[pieceIdx] = {
          ...next[pieceIdx],
          images: {
            ...next[pieceIdx].images,
            [perspective]: { base64: result.split(",")[1] ?? "", preview: result },
          },
        };
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  function handleFicha(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFichaBase64(result.split(",")[1] ?? "");
      setFichaName(file.name);
    };
    reader.readAsDataURL(file);
  }

  const filteredBrands = form.idDlkParentCompany
    ? brands.filter((b) => b.parentCompany?.idDlkParentCompany === form.idDlkParentCompany)
    : brands;
  const filteredSubbrands = form.idDlkBrand
    ? subbrands.filter((s) => s.idDlkBrand === form.idDlkBrand)
    : subbrands;

  async function handleSubmit() {
    if (!form.idDlkBrand) {
      setError("Debes seleccionar la marca.");
      return;
    }
    if (!form.nameModel.trim()) {
      setError("El nombre del modelo es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const piecesPayload = pieces.map((p) => ({
        namePiece: p.namePiece,
        images: PERSPECTIVES.map((persp) => {
          const img = p.images[persp.key];
          const base64 = img?.base64 ?? dataUrlToBase64(img?.preview);
          return base64 ? { imageType: persp.key, base64 } : null;
        }).filter(Boolean),
      }));

      const payload: Record<string, unknown> = {
        idDlkBrand: form.idDlkBrand,
        idDlkSubbrand: form.idDlkSubbrand || null,
        nameModel: form.nameModel,
        desModel: form.desModel || null,
        nameCollection: form.nameCollection || null,
        desCollection: form.desCollection || null,
        categoryModel: form.categoryModel || null,
        materialModel: form.materialModel || null,
        compositionModel: form.compositionModel || null,
        colorway: form.colorway || null,
        fondoTela: form.fondoTela || null,
        versionTela: Number(form.versionTela),
        year: form.year ? Number(form.year) : null,
        season: form.season || null,
        sizeModel: form.sizeModel || null,
        isSet: Number(form.isSet),
        nroPieces: form.isSet === 1 ? Number(form.nroPieces) : pieces.length,
        careModel: form.careModel || null,
        pieces: piecesPayload,
      };
      if (fichaBase64) {
        payload.fichaBase64 = fichaBase64;
        payload.technicalSpecification = fichaName;
      }

      const isEdit = mode === "edit";
      const url = isEdit ? `/api/models/${modelId}` : "/api/models";
      const res = await apiFetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error ?? `Error ${res.status} al guardar`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el modelo");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create" ? "Crear modelo" : mode === "edit" ? "Editar modelo" : "Detalle del modelo";
  const inputCls =
    "h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configuración &gt; REO &gt; Modelo</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2 sm:grid-cols-2">
          <Field label="Modelo" full>
            <Input value={form.nameModel} readOnly={readOnly} onChange={(e) => set("nameModel", e.target.value)} />
          </Field>

          <Field label="Empresa">
            <select
              className={inputCls}
              value={form.idDlkParentCompany}
              disabled={readOnly}
              onChange={(e) => setForm((p) => ({ ...p, idDlkParentCompany: Number(e.target.value), idDlkBrand: 0, idDlkSubbrand: 0 }))}
            >
              <option value={0}>—</option>
              {empresas.map((c) => (
                <option key={c.idDlkParentCompany} value={c.idDlkParentCompany}>
                  {c.codParentCompany} - {c.nameParentCompany}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Marca">
            <select
              className={inputCls}
              value={form.idDlkBrand}
              disabled={readOnly}
              onChange={(e) => setForm((p) => ({ ...p, idDlkBrand: Number(e.target.value), idDlkSubbrand: 0 }))}
            >
              <option value={0}>—</option>
              {filteredBrands.map((b) => (
                <option key={b.idDlkBrand} value={b.idDlkBrand}>
                  {b.nameBrand}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Submarca">
            <select
              className={inputCls}
              value={form.idDlkSubbrand}
              disabled={readOnly}
              onChange={(e) => set("idDlkSubbrand", Number(e.target.value))}
            >
              <option value={0}>—</option>
              {filteredSubbrands.map((s) => (
                <option key={s.idDlkSubbrand} value={s.idDlkSubbrand}>
                  {s.nameSubbrand}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Descripción Modelo" full>
            <Input value={form.desModel} readOnly={readOnly} onChange={(e) => set("desModel", e.target.value)} />
          </Field>
          <Field label="Colección">
            <Input value={form.nameCollection} readOnly={readOnly} onChange={(e) => set("nameCollection", e.target.value)} />
          </Field>
          <Field label="Descripción Colección">
            <Input value={form.desCollection} readOnly={readOnly} onChange={(e) => set("desCollection", e.target.value)} />
          </Field>
          <Field label="Categoría">
            <Input value={form.categoryModel} readOnly={readOnly} onChange={(e) => set("categoryModel", e.target.value)} />
          </Field>
          <Field label="Material">
            <Input value={form.materialModel} readOnly={readOnly} onChange={(e) => set("materialModel", e.target.value)} />
          </Field>
          <Field label="Composición">
            <Input value={form.compositionModel} readOnly={readOnly} onChange={(e) => set("compositionModel", e.target.value)} />
          </Field>
          <Field label="Coloreado">
            <Input value={form.colorway} readOnly={readOnly} onChange={(e) => set("colorway", e.target.value)} />
          </Field>
          <Field label="Fondo de tela">
            <Input value={form.fondoTela} readOnly={readOnly} onChange={(e) => set("fondoTela", e.target.value)} />
          </Field>
          <Field label="Estampado">
            <select className={inputCls} value={form.versionTela} disabled={readOnly} onChange={(e) => set("versionTela", Number(e.target.value))}>
              <option value={0}>Sin estampar</option>
              <option value={1}>Estampado</option>
            </select>
          </Field>
          <Field label="Año">
            <Input type="number" value={form.year} readOnly={readOnly} onChange={(e) => set("year", e.target.value)} />
          </Field>
          <Field label="Estación">
            <Input value={form.season} readOnly={readOnly} onChange={(e) => set("season", e.target.value)} />
          </Field>
          <Field label="Tallas">
            <Input value={form.sizeModel} readOnly={readOnly} onChange={(e) => set("sizeModel", e.target.value)} />
          </Field>
          <Field label="Set">
            <select
              className={inputCls}
              value={form.isSet}
              disabled={readOnly}
              onChange={(e) => {
                const v = Number(e.target.value);
                set("isSet", v);
                syncPieces(v, form.nroPieces);
              }}
            >
              <option value={0}>No</option>
              <option value={1}>Sí</option>
            </select>
          </Field>
          {form.isSet === 1 && (
            <Field label="Piezas">
              <Input
                type="number"
                min={1}
                max={10}
                value={form.nroPieces}
                readOnly={readOnly}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  set("nroPieces", n);
                  syncPieces(1, n);
                }}
              />
            </Field>
          )}
          <Field label="Cuidado">
            <Input value={form.careModel} readOnly={readOnly} onChange={(e) => set("careModel", e.target.value)} />
          </Field>
        </div>

        {/* Piezas + imágenes */}
        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
          <p className="text-sm font-medium">Piezas e imágenes</p>
          {pieces.map((piece, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-16 text-xs text-muted-foreground">Pieza {idx + 1}:</span>
              <Input
                className="flex-1"
                value={piece.namePiece}
                readOnly={readOnly}
                onChange={(e) =>
                  setPieces((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], namePiece: e.target.value };
                    return next;
                  })
                }
              />
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => setPiecePanel(idx)}
              >
                Imágenes ↗
              </button>
            </div>
          ))}
        </div>

        {/* Ficha técnica */}
        <div className="grid gap-1.5 pt-2">
          <Label>Ficha Técnica {hasFicha && <span className="text-xs text-muted-foreground">(ya cargada)</span>}</Label>
          {!readOnly && <Input type="file" accept="application/pdf" onChange={handleFicha} />}
          {fichaName && <span className="text-xs text-muted-foreground">{fichaName}</span>}
          {mode !== "create" && hasFicha && (
            <a
              href={`/api/models/${modelId}/ficha`}
              className="text-sm font-medium text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Descargar ficha actual
            </a>
          )}
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!readOnly && (
          <div className="flex justify-center pt-2">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : mode === "create" ? "Crear" : "Actualizar"}
            </Button>
          </div>
        )}

        {/* Panel de imágenes por pieza */}
        <Dialog open={piecePanel !== null} onOpenChange={(o) => !o && setPiecePanel(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {piecePanel !== null ? `Pieza ${piecePanel + 1}: ${pieces[piecePanel]?.namePiece ?? ""}` : "Imágenes"}
              </DialogTitle>
              <DialogDescription>Imágenes por perspectiva.</DialogDescription>
            </DialogHeader>
            {piecePanel !== null && (
              <div className="grid gap-3 py-2">
                {PERSPECTIVES.map((persp) => {
                  const img = pieces[piecePanel]?.images[persp.key];
                  return (
                    <div key={persp.key} className="grid gap-1.5">
                      <Label>{persp.label}</Label>
                      {img?.preview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.preview} alt={persp.label} className="h-16 w-auto object-contain" />
                      )}
                      {!readOnly && (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePieceImage(piecePanel, persp.key, e)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-end pt-1">
              <Button variant="outline" onClick={() => setPiecePanel(null)}>
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`grid gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
