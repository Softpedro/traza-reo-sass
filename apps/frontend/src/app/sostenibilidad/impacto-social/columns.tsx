"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fullstack-reo/ui";

/**
 * Fila de OD_SOCIAL_IMPACT como la devuelve /api/social-impacts. A diferencia del
 * resto del módulo, esta ficha cuelga de la MARCA: no hay orden ni talla.
 */
export type SocialImpact = {
  idDlkSocialImpact: number;
  idDlkBrand: number;
  codSocialImpact: string;
  /** Nombre de la ficha, p. ej. "Trabajo Digno y Equidad". */
  socialImpact: string | null;
  femaleWorkforce: string | null;
  leadership: string | null;
  workingConditions: string | null;
  commitmentOit: string | null;
  scope: string | null;
  referenceStandard: string | null;
  /** Nombre del PDF adjunto. */
  report: string | null;
  /** Sólo en las respuestas de una fila (GET /:id, POST, PUT). */
  hasReportFile?: boolean;
  stateSocialImpact: number | null;
  brand?: { idDlkBrand: number; codBrand: string; nameBrand: string } | null;
};

export function getColumns(
  onEdit: (row: SocialImpact) => void,
  onView: (row: SocialImpact) => void
): ColumnDef<SocialImpact>[] {
  return [
    {
      id: "marca",
      header: "Marca",
      cell: ({ row }) => row.original.brand?.nameBrand ?? "—",
    },
    {
      accessorKey: "socialImpact",
      header: "Impacto Social & Equidad",
      cell: ({ row }) => (
        <span className="block max-w-[14rem]">{row.original.socialImpact ?? "—"}</span>
      ),
    },
    {
      accessorKey: "femaleWorkforce",
      header: "Fuerza laboral femenina",
      cell: ({ row }) => (
        <span className="block max-w-[14rem]">{row.original.femaleWorkforce ?? "—"}</span>
      ),
    },
    {
      accessorKey: "leadership",
      header: "Liderazgo",
      cell: ({ row }) => (
        <span className="block max-w-[16rem]">{row.original.leadership ?? "—"}</span>
      ),
    },
    {
      accessorKey: "workingConditions",
      header: "Condiciones de trabajo",
      cell: ({ row }) => (
        <span className="block max-w-[16rem]">{row.original.workingConditions ?? "—"}</span>
      ),
    },
    {
      accessorKey: "commitmentOit",
      header: "Compromiso OIT",
      cell: ({ row }) => (
        <span className="block max-w-[16rem]">{row.original.commitmentOit ?? "—"}</span>
      ),
    },
    {
      accessorKey: "stateSocialImpact",
      header: "Estado",
      cell: ({ row }) => {
        const on = row.getValue("stateSocialImpact") === 1;
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
