"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

/** Colorway (OD_ORDER_DETAIL) + su orden de pedido, tal como los anida el API. */
export type WaterFootprintOrderDetail = {
  idDlkOrderDetail: number;
  codOrderDetail: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  fondoTela: string | null;
  orderHead?: {
    idDlkOrderHead: number;
    codOrderHead: string | null;
    brand?: { idDlkBrand: number; codBrand: string; nameBrand: string } | null;
  } | null;
};

/** Fila de OD_WATER_FOOTPRINT como la devuelve /api/water-footprints. */
export type WaterFootprint = {
  idDlkWaterFootprint: number;
  idDlkOrderDetail: number;
  codWaterFootprint: string;
  size: string;
  weight: number | null;
  waterFootprint: number | null;
  /** 1 = el valor es una estimación, no una medición. */
  estimatedValue: number;
  unitDescription: string;
  scope: string;
  /** Nombre del PDF adjunto. */
  report: string | null;
  /** Sólo en las respuestas de una fila (GET /:id, POST, PUT). */
  hasReportFile?: boolean;
  stateWaterFootprint: number;
  orderDetail?: WaterFootprintOrderDetail | null;
};

/** 10724 → "10 724 L", con el separador de miles de es-PE. */
function formatDecimal(value: number | null, unit: string): string {
  if (value == null) return "—";
  return `${value.toLocaleString("es-PE", { maximumFractionDigits: 4 })} ${unit}`;
}

export function getColumns(
  onEdit: (row: WaterFootprint) => void,
  onView: (row: WaterFootprint) => void
): ColumnDef<WaterFootprint>[] {
  return [
    {
      id: "ordenPedido",
      header: "Orden Pedido",
      cell: ({ row }) => row.original.orderDetail?.orderHead?.codOrderHead ?? "—",
    },
    {
      id: "ordenProduccion",
      header: "Orden Producción",
      cell: ({ row }) => row.original.orderDetail?.codOrderDetail ?? "—",
    },
    {
      id: "modelo",
      header: "Modelo / Estilo",
      cell: ({ row }) => (
        <span className="block max-w-[22rem]">{row.original.orderDetail?.nomEstilo ?? "—"}</span>
      ),
    },
    {
      id: "colorWay",
      header: "Color Way",
      cell: ({ row }) => row.original.orderDetail?.colorAway ?? "—",
    },
    {
      id: "fondoTela",
      header: "Fondo Tela",
      cell: ({ row }) => row.original.orderDetail?.fondoTela ?? "—",
    },
    {
      accessorKey: "size",
      header: "Talla",
    },
    {
      id: "weight",
      header: "Peso",
      cell: ({ row }) => formatDecimal(row.original.weight, "kg"),
    },
    {
      id: "waterFootprint",
      header: "H2O",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDecimal(row.original.waterFootprint, "L")}
          {row.original.estimatedValue === 1 && (
            <span className="ml-1 text-xs text-muted-foreground">(est.)</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "stateWaterFootprint",
      header: "Estado",
      cell: ({ row }) => {
        const on = row.getValue("stateWaterFootprint") === 1;
        return (
          <span className={on ? "font-medium text-green-600" : "font-medium text-red-600"}>
            {on ? "On" : "Off"}
          </span>
        );
      },
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => onEdit(row.original)}
          >
            Actualizar
          </Button>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => onView(row.original)}
          >
            Ver
          </Button>
        </div>
      ),
    },
  ];
}
