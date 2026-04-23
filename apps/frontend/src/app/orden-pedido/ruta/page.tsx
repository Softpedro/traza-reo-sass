import { OrdenPedidoRutaFlow } from "./orden-pedido-ruta-flow";

export default function OrdenPedidoRutaPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Ruta</h1>
        <p className="text-sm text-muted-foreground">
          Diagrama de ruta / trazado (React Flow). Arrastra nodos, conecta handles y usa zoom desde los controles.
        </p>
      </div>
      <OrdenPedidoRutaFlow />
    </div>
  );
}
