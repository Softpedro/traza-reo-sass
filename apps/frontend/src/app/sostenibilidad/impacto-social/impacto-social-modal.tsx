"use client";

import { useCallback, useEffect, useState } from "react";
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
import type { SocialImpact } from "./columns";

type Mode = "create" | "edit" | "view";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  impact: SocialImpact | null;
  onSuccess: () => void;
};

type BrandOption = { idDlkBrand: number; codBrand: string; nameBrand: string };

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

export function ImpactoSocialModal({ open, onOpenChange, mode, impact, onSuccess }: Props) {
  const isCreate = mode === "create";
  const isView = mode === "view";
  const readOnly = isView;

  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [brandId, setBrandId] = useState("");

  const [name, setName] = useState("");
  const [femaleWorkforce, setFemaleWorkforce] = useState("");
  const [leadership, setLeadership] = useState("");
  const [workingConditions, setWorkingConditions] = useState("");
  const [commitmentOit, setCommitmentOit] = useState("");
  const [scope, setScope] = useState("");
  const [referenceStandard, setReferenceStandard] = useState("");
  const [state, setState] = useState(1);
  const [report, setReport] = useState<FileState>(emptyFile);

  const title = isCreate
    ? "Crear impacto social"
    : isView
      ? "Impacto social"
      : "Actualizar impacto social";

  // ── Carga inicial ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setSaving(false);
    setReport(emptyFile);

    if (isCreate) {
      setBrandId("");
      setName("");
      setFemaleWorkforce("");
      setLeadership("");
      setWorkingConditions("");
      setCommitmentOit("");
      setScope("");
      setReferenceStandard("");
      setState(1);

      apiFetch("/api/brands")
        .then((r) => r.json())
        .then((rows: BrandOption[]) => setBrands(rows))
        .catch((err) => console.error("Error al cargar marcas:", err));
      return;
    }

    if (!impact) return;
    // Los campos largos y el informe no viajan completos en el listado.
    apiFetch(`/api/social-impacts/${impact.idDlkSocialImpact}`)
      .then((r) => r.json())
      .then((row: SocialImpact) => {
        setName(row.socialImpact ?? "");
        setFemaleWorkforce(row.femaleWorkforce ?? "");
        setLeadership(row.leadership ?? "");
        setWorkingConditions(row.workingConditions ?? "");
        setCommitmentOit(row.commitmentOit ?? "");
        setScope(row.scope ?? "");
        setReferenceStandard(row.referenceStandard ?? "");
        setState(row.stateSocialImpact ?? 1);
        if (row.hasReportFile) {
          setReport({ base64: "", name: row.report || "Informe adjunto", existing: true });
        }
      })
      .catch((err) => console.error("Error al cargar el impacto social:", err));
  }, [open, isCreate, impact]);

  async function onPickReport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setReport({ base64: await readFileAsBase64(file), name: file.name, existing: false });
  }

  /** El endpoint del informe exige token, así que no sirve un window.open directo. */
  const downloadReport = useCallback(async () => {
    if (!impact) return;
    try {
      const res = await apiFetch(`/api/social-impacts/${impact.idDlkSocialImpact}/report`);
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
  }, [impact]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;

    if (isCreate && !brandId) {
      alert("Seleccioná la marca");
      return;
    }
    if (!name.trim()) {
      alert("Completá el impacto social");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        socialImpact: name,
        femaleWorkforce,
        leadership,
        workingConditions,
        commitmentOit,
        scope,
        referenceStandard,
      };

      if (report.base64 === CLEAR) {
        body.clearReportFile = true;
      } else if (report.base64) {
        body.reportFileBase64 = report.base64;
        body.report = report.name;
      }

      const res = isCreate
        ? await apiFetch("/api/social-impacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...body,
              idDlkBrand: Number(brandId),
              stateSocialImpact: 1,
            }),
          })
        : await apiFetch(`/api/social-impacts/${impact?.idDlkSocialImpact}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, stateSocialImpact: state }),
          });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al guardar el impacto social");
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
            Una ficha por marca: son datos de la empresa, no de una orden.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          {isCreate ? (
            <div className="space-y-1.5">
              <Label>Marca</Label>
              <Select value={brandId} onValueChange={setBrandId}>
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
          ) : (
            <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 rounded-md bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Marca:</span>
              <span className="font-medium">{impact?.brand?.nameBrand ?? "—"}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Impacto Social</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={readOnly}
              maxLength={100}
              placeholder="Trabajo Digno y Equidad"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Fuerza laboral femenina</Label>
            <Input
              value={femaleWorkforce}
              onChange={(e) => setFemaleWorkforce(e.target.value)}
              disabled={readOnly}
              maxLength={100}
              placeholder="78% en taller de confección"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Liderazgo</Label>
            <Input
              value={leadership}
              onChange={(e) => setLeadership(e.target.value)}
              disabled={readOnly}
              maxLength={200}
              placeholder="50% de mandos medios liderados por mujeres"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Condiciones de Trabajo</Label>
            <Input
              value={workingConditions}
              onChange={(e) => setWorkingConditions(e.target.value)}
              disabled={readOnly}
              maxLength={100}
              placeholder="100% empleo formal con salario digno"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Compromiso OIT</Label>
            <Input
              value={commitmentOit}
              onChange={(e) => setCommitmentOit(e.target.value)}
              disabled={readOnly}
              maxLength={100}
              placeholder="Cero tolerancia a trabajo forzoso e infantil"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Alcance</Label>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              disabled={readOnly}
              rows={2}
              maxLength={500}
              placeholder="Taller de confección y acabados (Tier 1)"
              className={textareaClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Norma de referencia</Label>
            <textarea
              value={referenceStandard}
              onChange={(e) => setReferenceStandard(e.target.value)}
              disabled={readOnly}
              rows={2}
              maxLength={1000}
              placeholder="Convenios OIT / Código de Conducta Ética"
              className={textareaClass}
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
