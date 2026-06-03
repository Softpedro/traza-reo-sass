import Link from "next/link";
import { OrdenPedidoRutaFlow } from "../../../orden-pedido-ruta-flow";

type PageProps = {
  params: { id: string; componentId: string };
  searchParams: { mode?: string; ids?: string };
};

const MODE_LABEL: Record<string, string> = {
  crear: "Crear ruta",
  editar: "Editar ruta",
  ver: "Ver ruta",
};

export default function OrdenPedidoRutaComponentePage({ params, searchParams }: PageProps) {
  const orderId = Number(params.id);
  const componentId = Number(params.componentId);
  const mode = searchParams?.mode ?? "ver";
  const ids = (searchParams?.ids ?? String(componentId))
    .split(",")
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Orden de Pedido · Ruta · Componente #{componentId}
          </p>
          <h1 className="text-xl font-semibold">{MODE_LABEL[mode] ?? "Ruta"}</h1>
          <p className="text-sm text-muted-foreground">
            Editor de la ruta de producción del componente (procesos · subprocesos ·
            actividades). En construcción — por ahora muestra el diagrama de trazado.
          </p>
          <p className="text-xs text-muted-foreground">
            Esta ruta se aplicará a {ids.length} componente{ids.length === 1 ? "" : "s"}: [
            {ids.join(", ")}]
          </p>
        </div>
        <Link
          href={`/orden-pedido/ruta/${orderId}`}
          className="text-sm text-primary hover:underline"
        >
          ← Volver a componentes
        </Link>
      </div>
      <OrdenPedidoRutaFlow />
    </div>
  );
}
