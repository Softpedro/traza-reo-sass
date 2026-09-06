import * as React from "react";
import { ImagePlus, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  compressDocument,
  compressLogo,
  compressPhoto,
  type CompressedImage,
} from "@/lib/image-compress";

/**
 * Una imagen del formulario. Las tres formas posibles son excluyentes y determinan
 * el estado visual del slot:
 *  - sin `preview`            -> vacío
 *  - `id` sin `base64`        -> guardada en el servidor, sin cambios
 *  - `base64`                 -> elegida ahora, pendiente de guardar
 *
 * `id` es lo que el backend usa para conservar la imagen sin recibir sus bytes.
 */
export type ImageUploadValue = {
  id?: number;
  base64?: string;
  preview?: string | null;
  bytes?: number;
};

export interface ImageUploadProps {
  /** Encabezado del slot, p. ej. la perspectiva ("Frontal"). */
  label?: string;
  value?: ImageUploadValue | null;
  /** `null` = el usuario quitó la imagen. */
  onChange: (value: ImageUploadValue | null) => void;
  /**
   * Perfil aplicado antes de emitir el valor. Comprimir es el default a propósito:
   * estas imágenes viajan en base64 dentro del JSON del formulario.
   */
  compression?: "photo" | "logo" | "document" | "none";
  disabled?: boolean;
  /** Se llama con un mensaje ya redactado cuando el archivo no se puede procesar. */
  onError?: (message: string) => void;
  className?: string;
}

/** Bytes aproximados de un data URL, para poder etiquetar una imagen ya guardada. */
function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(",");
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, (b64.length * 3) / 4 - padding);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readFile(file: File): Promise<CompressedImage> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
  const i = dataUrl.indexOf(",");
  const base64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  return { dataUrl, base64, bytes: dataUrlBytes(dataUrl) };
}

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ label, value, onChange, compression = "photo", disabled, onError, className }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = React.useState(false);
    const [busy, setBusy] = React.useState(false);

    const preview = value?.preview ?? null;
    // Recién elegida y todavía sin guardar. El usuario necesita verlo: el guardado del
    // modal es explícito y hasta entonces el cambio sólo vive en memoria.
    const isDirty = Boolean(value?.base64);
    const bytes = value?.bytes ?? (preview ? dataUrlBytes(preview) : 0);

    async function accept(file: File | null | undefined) {
      if (!file || disabled) return;
      if (!file.type.startsWith("image/")) {
        onError?.(`"${file.name}" no es una imagen.`);
        return;
      }
      setBusy(true);
      try {
        const result =
          compression === "photo"
            ? await compressPhoto(file)
            : compression === "logo"
              ? await compressLogo(file)
              : compression === "document"
                ? await compressDocument(file)
                : await readFile(file);
        // Sin `id`: es una imagen nueva, el backend reemplaza la anterior de este slot.
        onChange({ base64: result.base64, preview: result.dataUrl, bytes: result.bytes });
      } catch {
        onError?.(`No se pudo procesar la imagen "${file.name}".`);
      } finally {
        setBusy(false);
      }
    }

    function openPicker() {
      if (!disabled && !busy) inputRef.current?.click();
    }

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            {isDirty && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Sin guardar
              </span>
            )}
          </div>
        )}

        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={preview ? `Reemplazar imagen ${label ?? ""}` : `Subir imagen ${label ?? ""}`}
          aria-disabled={disabled}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            if (disabled) return;
            e.preventDefault();
            setDragging(false);
            void accept(e.dataTransfer.files?.[0]);
          }}
          // Pegar sirve para capturas de pantalla, que es como llega media foto de referencia.
          onPaste={(e) => {
            const file = Array.from(e.clipboardData?.items ?? [])
              .find((it) => it.kind === "file")
              ?.getAsFile();
            if (file) void accept(file);
          }}
          className={cn(
            "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border bg-muted/30 transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            preview ? "border-border" : "border-dashed",
            dragging && "border-primary bg-primary/5",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-primary/60"
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={label ?? "Imagen"} className="h-full w-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-1 px-2 text-center text-muted-foreground">
              <ImagePlus className="h-5 w-5" aria-hidden />
              <span className="text-xs leading-tight">
                {disabled ? "Sin imagen" : "Arrastra una imagen o haz clic"}
              </span>
            </div>
          )}

          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs text-muted-foreground">
              Procesando…
            </div>
          )}
        </div>

        <div className="flex min-h-[1.5rem] items-center justify-between gap-2 text-xs">
          <span className="truncate text-muted-foreground">
            {preview ? formatBytes(bytes) : "Sin imagen"}
          </span>
          {!disabled && preview && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                <RefreshCw className="h-3 w-3" aria-hidden />
                Reemplazar
              </button>
              <button
                type="button"
                aria-label={`Quitar imagen ${label ?? ""}`}
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 font-medium text-destructive hover:underline"
              >
                <X className="h-3 w-3" aria-hidden />
                Quitar
              </button>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            void accept(e.target.files?.[0]);
            // Permite volver a elegir el mismo archivo después de quitarlo.
            e.target.value = "";
          }}
        />
      </div>
    );
  }
);
ImageUpload.displayName = "ImageUpload";

export { ImageUpload };
