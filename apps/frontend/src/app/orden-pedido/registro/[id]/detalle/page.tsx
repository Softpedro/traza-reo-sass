import { Suspense } from "react";
import { OrderRegistroDetalleClient } from "./order-registro-detalle-client";

type PageProps = {
  params: { id: string };
};

export default function OrdenPedidoRegistroDetallePage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="space-y-2 p-4">
        <p className="text-sm text-destructive">Identificador de orden no válido.</p>
        <a href="/orden-pedido/registro" className="text-sm text-primary underline">
          Volver al registro
        </a>
      </div>
    );
  }
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Cargando…</p>}>
      <OrderRegistroDetalleClient headId={id} />
    </Suspense>
  );
}
