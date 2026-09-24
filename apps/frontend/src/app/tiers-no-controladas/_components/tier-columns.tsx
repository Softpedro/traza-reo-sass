"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";
import { TIER2_SERVICES, tier2ServiceBlocker } from "./tier-config";
import type { PresetOrder, UncontrolledLayer } from "./types";

function StateBadge({ state }: { state: number | null }) {
  const on = state === 1;
  return (
    <span className={on ? "font-medium text-green-600" : "font-medium text-red-600"}>
      {on ? "On" : "Off"}
    </span>
  );
}

function RowActions({ onEdit, onView }: { onEdit: () => void; onView: () => void }) {
  return (
    <div className="flex gap-2">
      <Button variant="link" size="sm" className="h-auto p-0" onClick={onEdit}>
        Actualizar
      </Button>
      <Button variant="link" size="sm" className="h-auto p-0" onClick={onView}>
        Ver
      </Button>
    </div>
  );
}

function presetOf(row: UncontrolledLayer): PresetOrder {
  const d = row.orderDetail;
  return {
    idDlkOrderDetail: row.idDlkOrderDetail,
    marca: d?.orderHead?.brand?.nameBrand ?? "—",
    ordenPedido: d?.orderHead?.codOrderHead ?? "—",
    ordenProduccion: d?.codOrderDetail ?? "—",
  };
}

/** Columnas de identidad de la OP, iguales en los tres tiers. */
function orderColumns<T extends { orderDetail?: UncontrolledLayer["orderDetail"] }>(): ColumnDef<T>[] {
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
  ];
}

/** Tier 3 y 4: una fila por registro. */
export function getColumns(
  tier: number,
  onEdit: (row: UncontrolledLayer) => void,
  onView: (row: UncontrolledLayer) => void
): ColumnDef<UncontrolledLayer>[] {
  return [
    ...orderColumns<UncontrolledLayer>(),
    { id: "tier", header: "Tier", cell: () => `Tier ${tier}` },
    {
      accessorKey: "product",
      header: "Producto",
      cell: ({ row }) => (
        <span className="block max-w-[22rem]">{row.original.product ?? "—"}</span>
      ),
    },
    {
      accessorKey: "supplier",
      header: "Proveedor",
      cell: ({ row }) => row.original.supplier ?? "—",
    },
    {
      accessorKey: "stateUncontrolledLayers",
      header: "Estado",
      cell: ({ row }) => <StateBadge state={row.original.stateUncontrolledLayers} />,
    },
    {
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <RowActions onEdit={() => onEdit(row.original)} onView={() => onView(row.original)} />
      ),
    },
  ];
}

/** Tier 2: una fila por OP con sus hasta 3 servicios (Tejido → Teñido → Estampado). */
export type Tier2Row = {
  idDlkOrderDetail: number;
  orderDetail: UncontrolledLayer["orderDetail"];
  preset: PresetOrder;
  byService: Map<number, UncontrolledLayer>;
};

export function groupTier2(rows: UncontrolledLayer[]): Tier2Row[] {
  const groups = new Map<number, Tier2Row>();
  for (const r of rows) {
    let g = groups.get(r.idDlkOrderDetail);
    if (!g) {
      g = {
        idDlkOrderDetail: r.idDlkOrderDetail,
        orderDetail: r.orderDetail,
        preset: presetOf(r),
        byService: new Map(),
      };
      groups.set(r.idDlkOrderDetail, g);
    }
    if (r.service != null) g.byService.set(r.service, r);
  }
  // El listado llega del más reciente al más antiguo; se respeta ese orden entre OPs.
  return Array.from(groups.values());
}

export function getTier2Columns(
  onEdit: (row: UncontrolledLayer) => void,
  onView: (row: UncontrolledLayer) => void,
  onCreate: (preset: PresetOrder, service: number) => void
): ColumnDef<Tier2Row>[] {
  return [
    ...orderColumns<Tier2Row>(),
    {
      id: "producto",
      header: "Producto",
      // La tela nace en el Tejido; si todavía no está, cualquiera de los otros.
      cell: ({ row }) => {
        const first = TIER2_SERVICES.map((s) => row.original.byService.get(s.value)).find(
          (r) => r?.product
        );
        return <span className="block max-w-[22rem]">{first?.product ?? "—"}</span>;
      },
    },
    ...TIER2_SERVICES.map(
      (s): ColumnDef<Tier2Row> => ({
        id: `service-${s.value}`,
        header: s.short,
        cell: ({ row }) => {
          const record = row.original.byService.get(s.value);
          if (record) {
            return (
              <div className="space-y-0.5">
                <span className="block max-w-[12rem]">{record.supplier ?? "Sin proveedor"}</span>
                <StateBadge state={record.stateUncontrolledLayers} />
                <RowActions onEdit={() => onEdit(record)} onView={() => onView(record)} />
              </div>
            );
          }
          const loaded = new Set(row.original.byService.keys());
          const blocker = tier2ServiceBlocker(s.value, loaded);
          return blocker ? (
            <span className="text-xs text-muted-foreground">Requiere Tejido</span>
          ) : (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => onCreate(row.original.preset, s.value)}
            >
              Crear +
            </Button>
          );
        },
      })
    ),
  ];
}
