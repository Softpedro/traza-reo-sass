"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Label,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  templateUrl: string;
  templateFilename: string;
  uploadUrl: string;
  onSuccess: () => void;
}

type UploadResult = {
  inserted: number;
  errors: { row: number; error: string }[];
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("No se pudo leer el archivo"));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Error leyendo el archivo"));
    reader.readAsDataURL(file);
  });
}

export function BulkUploadModal({
  open,
  onOpenChange,
  title,
  description,
  templateUrl,
  templateFilename,
  uploadUrl,
  onSuccess,
}: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function reset() {
    setFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  async function handleDownloadTemplate() {
    try {
      const res = await fetch(apiUrl(templateUrl));
      if (!res.ok) throw new Error(`Error ${res.status} al descargar plantilla`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = templateFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo descargar la plantilla");
    }
  }

  async function handleUpload() {
    if (!file) {
      setError("Selecciona un archivo Excel.");
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const dataUrl = await fileToBase64(file);
      const res = await fetch(apiUrl(uploadUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: dataUrl }),
      });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : `Error ${res.status} al cargar`;
        throw new Error(msg);
      }
      const r = body as UploadResult;
      setResult(r);
      if (r.inserted > 0) onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el archivo");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between gap-4 rounded-md border p-3">
            <div className="text-sm">
              <p className="font-medium">Plantilla Excel</p>
              <p className="text-muted-foreground text-xs">
                Descarga la plantilla, completa las filas y vuelve a subirla.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              Descargar
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Archivo</Label>
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  setResult(null);
                  setError(null);
                }}
                className="text-sm flex-1"
              />
            </div>
            {file && (
              <p className="text-xs text-muted-foreground">
                Seleccionado: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {result && (
            <div className="rounded-md border p-3 space-y-2">
              <p className="text-sm">
                <span className="font-medium text-green-700">{result.inserted}</span> filas
                insertadas
                {result.errors.length > 0 && (
                  <>
                    ,{" "}
                    <span className="font-medium text-red-700">{result.errors.length}</span> con
                    errores
                  </>
                )}
                .
              </p>
              {result.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto text-xs">
                  <table className="w-full">
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="text-left font-medium">Fila</th>
                        <th className="text-left font-medium">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err) => (
                        <tr key={`${err.row}-${err.error}`} className="border-t">
                          <td className="pr-2 py-1">{err.row}</td>
                          <td className="py-1 text-destructive">{err.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleClose(false)} disabled={uploading}>
              {result ? "Cerrar" : "Cancelar"}
            </Button>
            {!result && (
              <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? "Cargando..." : "Cargar"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
