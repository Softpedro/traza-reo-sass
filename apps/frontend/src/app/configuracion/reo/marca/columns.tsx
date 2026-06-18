"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

export type Brand = {
  idDlkBrand: number;
  codBrand: string;
  /** Denormalizado en MD_BRAND */
  codParentCompany?: string;
  nameBrand: string;
  desBrand?: string | null;
  codUbigeoBrand?: number;
  addressBrand?: string;
  locationBrand?: string | null;
  emailBrand: string;
  cellularBrand?: string;
  facebookBrand?: string | null;
  instagramBrand?: string | null;
  whatsappBrand?: string | null;
  ecommerceBrand?: string | null;
  /** Subdominio de la marca (multi-tenant) */
  subdomainBrand?: string | null;
  /** Data URL desde API (logo binario mapeado en backend) */
  logoBrand?: string | null;
  stateBrand: number;
  parentCompany?: {
    idDlkParentCompany: number;
    codParentCompany: string;
    nameParentCompany: string;
  } | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORAL · Ofuscación de marcas/empresas en el listado de Marca.
// Se enmascaran (********) las columnas "Marca" y "Empresa" de toda marca cuya
// empresa NO empiece con "REO-1". Es momentáneo (pedido de negocio para prod).
// Para REVERTIR: borrar este bloque, `isBrandMasked`, los usos en las celdas
// "Marca"/"Empresa" y restaurar el render original (ver docs/ofuscacion-marcas-temporal.md).
// ─────────────────────────────────────────────────────────────────────────────
const MASK = "********";

/** TEMPORAL: true si la empresa de la marca NO empieza con "REO-1" (debe ocultarse). */
function isBrandMasked(brand: Brand): boolean {
  const cod = brand.parentCompany?.codParentCompany ?? "";
  return !cod.startsWith("REO-1");
}

export function getColumns(
  onEdit: (brand: Brand) => void,
  onView: (brand: Brand) => void
): ColumnDef<Brand>[] {
  return [
    {
      accessorKey: "codBrand",
      header: "Código",
    },
    {
      accessorKey: "nameBrand",
      header: "Marca",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {/* TEMPORAL: ofuscación de marcas no-REO-1 (ver isBrandMasked) */}
          {isBrandMasked(row.original) ? MASK : row.getValue("nameBrand")}
        </span>
      ),
    },
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row }) => {
        // TEMPORAL: ofuscación de empresas no-REO-1 (ver isBrandMasked)
        if (isBrandMasked(row.original)) return MASK;
        const pc = row.original.parentCompany;
        return pc
          ? `${pc.codParentCompany ?? ""} - ${pc.nameParentCompany}`
          : "Sin empresa";
      },
    },
    {
      accessorKey: "stateBrand",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.getValue("stateBrand") as number;
        return (
          <span className={state === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {state === 1 ? "Activa" : "Desactivada"}
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
            Editar
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

