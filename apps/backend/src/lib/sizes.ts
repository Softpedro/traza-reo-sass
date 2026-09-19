/**
 * Columnas de talla de OD_ORDER_DETAIL → etiqueta guardada en las tablas hijas
 * (SIZE). Es la misma lista, y el mismo orden, que apps/frontend/src/lib/sizes.ts.
 */
export const SIZE_FIELDS = [
  { field: "size0_3", label: "0-3" },
  { field: "size3_6", label: "3-6" },
  { field: "size0_6", label: "0-6" },
  { field: "size6_12", label: "6-12" },
  { field: "size12_18", label: "12-18" },
  { field: "size2", label: "2" },
  { field: "size3", label: "3" },
  { field: "size4", label: "4" },
  { field: "size5", label: "5" },
  { field: "size6", label: "6" },
  { field: "size7", label: "7" },
  { field: "size8", label: "8" },
  { field: "size9", label: "9" },
  { field: "size10", label: "10" },
  { field: "size11", label: "11" },
  { field: "size12", label: "12" },
  { field: "size14", label: "14" },
  { field: "size16", label: "16" },
  { field: "sizeXs", label: "XS" },
  { field: "sizeS", label: "S" },
  { field: "sizeM", label: "M" },
  { field: "sizeL", label: "L" },
  { field: "sizeXl", label: "XL" },
  { field: "sizeXxl", label: "XXL" },
] as const;

export type SizeField = (typeof SIZE_FIELDS)[number]["field"];

/** Select de sólo las columnas de talla (evita traer los blobs del detalle). */
export const SIZE_SELECT = Object.fromEntries(
  SIZE_FIELDS.map((s) => [s.field, true])
) as Record<SizeField, true>;

/** Etiqueta normalizada de la talla, o `null` si no es una talla conocida. */
export function sizeLabel(size: string): string | null {
  return SIZE_FIELDS.find((s) => s.label === size.trim())?.label ?? null;
}

/** Unidades pedidas de esa talla en el colorway; `null` si la talla no existe. */
export function sizeQuantity(
  detail: Partial<Record<SizeField, number | null>>,
  size: string
): number | null {
  const match = SIZE_FIELDS.find((s) => s.label === size.trim());
  if (!match) return null;
  return detail[match.field] ?? 0;
}
