/** Categorías de empresa (parent company) — debe coincidir con CATEGORY_PARENT_COMPANY en BD */
export const EMPRESA_CATEGORIAS: Record<number, string> = {
  1: "Textil",
  2: "Cuero",
  3: "Accesorios",
};

export function labelEmpresaCategoria(cod: number): string {
  return EMPRESA_CATEGORIAS[cod] ?? `Categoría ${cod}`;
}
