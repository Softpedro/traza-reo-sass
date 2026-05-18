import { Suspense } from "react";
import { OrderEtiquetaDetailClient } from "./order-etiqueta-detail-client";

type PageProps = {
  params: { id: string };
};

export default function OrdenPedidoEtiquetaDetallePage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="space-y-2 p-4">
        <p className="text-sm text-destructive">Identificador de orden no válido.</p>
        <a href="/orden-pedido/etiqueta" className="text-sm text-primary underline">
          Volver a Etiqueta
        </a>
      </div>
    );
  }
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Cargando…</p>}>
      <OrderEtiquetaDetailClient orderHeadId={id} />
    </Suspense>
  );
}
