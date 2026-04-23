"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { SuministroRow } from "./columns";
import {
  ACTIVO_OPTIONS,
  SUMINISTRO_STATUS_OPTIONS,
} from "./constants";

type ModalMode = "create" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  order: SuministroRow | null;
  onSuccess: () => void;
};

type FileKind = "udp" | "prod" | "final";

type SuministroDetail = {
  codOrderHead: string | null;
  brand: { nameBrand: string } | null;
  statusStageOrderHead: number | null;
  flgStatutActif: number | null;
  fehFileSuppliesUdp: string | null;
  fehFileSuppliesProd: string | null;
  fehFileSuppliesFinal: string | null;
  hasFileSuppliesUdp: boolean;
  hasFileSuppliesProd: boolean;
  hasFileSuppliesFinal: boolean;
};

function toInputDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });
}

type FileState = { base64: string; name: string; existing: boolean };

const emptyFile: FileState = { base64: "", name: "", existing: false };

export function SuministroModal({ open, onOpenChange, mode, order, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<SuministroDetail | null>(null);
  const [udp, setUdp] = useState<FileState>(emptyFile);
  const [prod, setProd] = useState<FileState>(emptyFile);
  const [final, setFinal] = useState<FileState>(emptyFile);
  const [udpDate, setUdpDate] = useState("");
  const [prodDate, setProdDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [status, setStatus] = useState<number>(2);
  const [flgActivo, setFlgActivo] = useState<number>(1);

  const isEdit = mode === "edit";
  const title = isEdit ? "Actualizar suministro" : "Crear suministro";

  const marca = useMemo(
    () => detail?.brand?.nameBrand ?? order?.brand?.nameBrand ?? "—",
    [detail, order]
  );
  const codOrden = useMemo(
    () => detail?.codOrderHead ?? order?.codOrderHead ?? "—",
    [detail, order]
  );

  useEffect(() => {
    if (!open || !order?.idDlkOrderHead) return;
    setDetail(null);
    setUdp(emptyFile);
    setProd(emptyFile);
    setFinal(emptyFile);
    fetch(apiUrl(`/api/order-heads/${order.idDlkOrderHead}`))
      .then((res) => res.json())
      .then((row: SuministroDetail) => {
        setDetail(row);
        setUdpDate(toInputDate(row.fehFileSuppliesUdp));
        setProdDate(toInputDate(row.fehFileSuppliesProd));
        setFinalDate(toInputDate(row.fehFileSuppliesFinal));
        setStatus(row.statusStageOrderHead ?? (isEdit ? 2 : 2));
        setFlgActivo(row.flgStatutActif ?? 1);
        if (row.hasFileSuppliesUdp) setUdp({ base64: "", name: "Archivo UDP adjunto", existing: true });
        if (row.hasFileSuppliesProd) setProd({ base64: "", name: "Archivo PROD adjunto", existing: true });
        if (row.hasFileSuppliesFinal) setFinal({ base64: "", name: "Archivo FINAL adjunto", existing: true });
      })
      .catch((err) => console.error(err));
  }, [open, order?.idDlkOrderHead, isEdit]);

  async function onFileChange(
    kind: FileKind,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await readFileAsBase64(file);
    const next: FileState = { base64: b64, name: file.name, existing: false };
    if (kind === "udp") setUdp(next);
    else if (kind === "prod") setProd(next);
    else setFinal(next);
  }

  function clearFile(kind: FileKind) {
    const next: FileState = { base64: "__CLEAR__", name: "", existing: false };
    if (kind === "udp") setUdp(next);
    else if (kind === "prod") setProd(next);
    else setFinal(next);
  }

  function downloadFile(kind: FileKind) {
    if (!order?.idDlkOrderHead) return;
    const url = apiUrl(`/api/order-heads/${order.idDlkOrderHead}/suministro/file/${kind}`);
    window.open(url, "_blank");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order?.idDlkOrderHead) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        statusStageOrderHead: status,
      };
      if (isEdit) body.flgStatutActif = flgActivo;

      const applyKind = (
        kind: FileKind,
        state: FileState,
        dateStr: string,
        keyBase64: string,
        keyDate: string,
        keyClear: string
      ) => {
        if (state.base64 === "__CLEAR__") {
          body[keyClear] = true;
          return;
        }
        if (state.base64) {
          body[keyBase64] = state.base64;
        }
        if (dateStr) body[keyDate] = dateStr;
      };

      applyKind("udp", udp, udpDate, "fileUdpBase64", "fileUdpDate", "clearFileUdp");
      applyKind("prod", prod, prodDate, "fileProdBase64", "fileProdDate", "clearFileProd");
      applyKind("final", final, finalDate, "fileFinalBase64", "fileFinalDate", "clearFileFinal");

      const res = await fetch(
        apiUrl(`/api/order-heads/${order.idDlkOrderHead}/suministro`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al guardar suministro");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-muted-foreground">Marca:</span>
            <span className="font-medium">{marca}</span>
            <span className="text-muted-foreground">Orden de Producción:</span>
            <span className="font-medium">{codOrden}</span>
          </div>

          <FileRow
            label="Archivo UDP"
            state={udp}
            onPick={(e) => onFileChange("udp", e)}
            onClear={() => clearFile("udp")}
            onDownload={() => downloadFile("udp")}
          />
          <div className="space-y-1.5">
            <Label>Fecha UDP</Label>
            <Input
              type="date"
              value={udpDate}
              onChange={(e) => setUdpDate(e.target.value)}
            />
          </div>

          <FileRow
            label="Archivo PROD total"
            state={prod}
            onPick={(e) => onFileChange("prod", e)}
            onClear={() => clearFile("prod")}
            onDownload={() => downloadFile("prod")}
          />
          <div className="space-y-1.5">
            <Label>Fecha PROD</Label>
            <Input
              type="date"
              value={prodDate}
              onChange={(e) => setProdDate(e.target.value)}
            />
          </div>

          <FileRow
            label="Archivo Final"
            state={final}
            onPick={(e) => onFileChange("final", e)}
            onClear={() => clearFile("final")}
            onDownload={() => downloadFile("final")}
          />
          <div className="space-y-1.5">
            <Label>Fecha Final</Label>
            <Input
              type="date"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Suministro</Label>
            <Select
              value={String(status)}
              onValueChange={(v) => setStatus(Number(v))}
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

          {isEdit && (
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={String(flgActivo)}
                onValueChange={(v) => setFlgActivo(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary" disabled={saving}>
            {saving ? "Guardando…" : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FileRowProps = {
  label: string;
  state: FileState;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onDownload: () => void;
};

function FileRow({ label, state, onPick, onClear, onDownload }: FileRowProps) {
  const showName = state.name && state.base64 !== "__CLEAR__";
  const canDownload = state.existing && state.base64 !== "__CLEAR__" && !state.base64;
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={onPick}
          className="cursor-pointer"
        />
        {showName && (
          <span className="text-xs text-muted-foreground">{state.name}</span>
        )}
        {canDownload && (
          <Button type="button" variant="outline" size="sm" onClick={onDownload}>
            Descargar
          </Button>
        )}
        {showName && (
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            Quitar
          </Button>
        )}
      </div>
    </div>
  );
}
