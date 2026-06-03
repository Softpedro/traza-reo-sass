import { Suspense } from "react";
import { OrderRutaDetailClient } from "./order-ruta-detail-client";

type PageProps = {
  params: { id: string };
};

export default function OrdenPedidoRutaDetallePage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="space-y-2 p-4">
        <p className="text-sm text-destructive">Identificador de orden no válido.</p>
        <a href="/orden-pedido/ruta" className="text-sm text-primary underline">
          Volver a Ruta
        </a>
      </div>
    );
  }
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Cargando…</p>}>
      <OrderRutaDetailClient orderHeadId={id} />
    </Suspense>
  );
}
