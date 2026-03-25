/** TYPE_PARENT_COMPANY en MD_PARENT_COMPANY */
export const TIPO_REO_PARENT_COMPANY: Record<number, string> = {
  1: "Marca Propia",
  2: "Maquila",
  3: "Híbrido",
  4: "Comercializadora",
};

export function labelTipoReoParentCompany(type: number): string {
  return TIPO_REO_PARENT_COMPANY[type] ?? `Tipo ${type}`;
}
