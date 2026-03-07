"use client";

import { useEffect, useState } from "react";
import {
  DataTable,
  Card,
  CardContent,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { columns, type OrdenPedido } from "./columns";

const stats = [
  { label: "Total de Prendas con DPP", value: "1'000,000" },
  { label: "Total de lecturas de DPP", value: "20'000,000" },
  { label: "Total de transacciones realizadas", value: "30'000,000" },
];

export default function OrdenesPage() {
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
        <h1 className="text-xl font-semibold">Estado de Orden de Pedido</h1>
        <button className="text-sm font-medium text-primary hover:underline underline-offset-4">
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando órdenes...</p>
      ) : (
        <DataTable columns={columns} data={ordenes} />
      )}

      <div className="flex justify-end">
        <div className="space-y-3 w-full max-w-xs">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="py-3 px-4">
                <p className="text-xl font-bold text-right">{stat.value}</p>
                <p className="text-xs text-muted-foreground text-right">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
