import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a TRAZA</h1>
      <p className="text-muted-foreground mb-6">
        Sistema de trazabilidad de órdenes de pedido
      </p>
      <Link
        href="/orden-pedido/registro"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        Ver Órdenes de Pedido
      </Link>
    </div>
  );
}
