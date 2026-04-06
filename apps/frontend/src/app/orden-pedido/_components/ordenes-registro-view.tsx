"use client";

import { useEffect, useState } from "react";
import { DataTable, Card, CardContent } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { columns, type OrdenPedido } from "@/app/ordenes/columns";

type Props = {
  title?: string;
};

export function OrdenesRegistroView({ title = "Estado de Orden de Pedido" }: Props) {
  const [ordenes, setOrdenes] = useState<OrdenPedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/ordenes"))
      .then((res) => res.json())
      .then((data) => setOrdenes(data))
      .catch((err) => console.error("Error al cargar órdenes:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando órdenes...</p>
      ) : (
        <DataTable columns={columns} data={ordenes} />
      )}
    </div>
  );
}
