"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@fullstack-reo/ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string | null;
  alt: string;
  caption?: string | null;
};

/** Modal para visualizar una imagen de estilo a tamaño completo. */
export function OrderDetailImageDialog({ open, onOpenChange, src, alt, caption }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-fit p-3 sm:p-4">
        <DialogHeader className="space-y-0.5 pr-10">
          <DialogTitle className="text-base leading-tight">{alt}</DialogTitle>
          {caption && (
            <DialogDescription className="text-xs">{caption}</DialogDescription>
          )}
        </DialogHeader>
        <div className="flex items-center justify-center overflow-auto rounded-md bg-muted/30">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- binario servido por API propia
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] max-w-full object-contain"
            />
          ) : (
            <p className="p-12 text-sm text-muted-foreground">Sin imagen</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
