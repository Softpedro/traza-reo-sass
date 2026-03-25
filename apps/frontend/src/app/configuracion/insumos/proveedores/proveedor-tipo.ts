/** Alineado con TYPE_SUPPLIER en backend (1–6). */
export const PROVEEDOR_TIPOS: Record<number, string> = {
  1: "Fibra",
  2: "Hilado",
  3: "Tela",
  4: "Químico",
  5: "Servicios",
  6: "Otro",
};

export function labelProveedorTipo(typeSupplier: number): string {
  return PROVEEDOR_TIPOS[typeSupplier] ?? String(typeSupplier);
}
