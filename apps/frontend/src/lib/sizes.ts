/**
 * Columnas de talla de OD_ORDER_DETAIL → etiqueta legible, en orden de presentación.
 * Es la misma lista (y el mismo orden) que SIZE_FIELDS del backend
 * (apps/backend/src/services/carbon-footprint.service.ts).
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
] as const satisfies readonly { field: string; label: string }[];

/** Nombre de columna de talla en OD_ORDER_DETAIL (ej. "sizeM"). */
export type SizeField = (typeof SIZE_FIELDS)[number]["field"];

/** Cantidades por talla de un colorway, tal como llegan del API. */
export type SizeQuantities = Partial<Record<SizeField, number | null>>;

/** Tallas con unidades pedidas (> 0) en ese colorway. */
export function activeSizes(detail: SizeQuantities | null | undefined) {
  if (!detail) return [];
  return SIZE_FIELDS.filter((s) => {
    const qty = detail[s.field];
    return qty != null && qty > 0;
  });
}
