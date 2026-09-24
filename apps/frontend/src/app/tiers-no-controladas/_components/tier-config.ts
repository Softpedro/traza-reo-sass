/** Tiers no controladas: todas viven en OD_UNCONTROLLED_LAYERS y comparten formulario. */
export type TierNumber = 2 | 3 | 4;

export type TierConfig = {
  tier: TierNumber;
  /** Subtítulo de la página (después de "Tiers no controladas > Tier N - "). */
  title: string;
  /** Etiqueta de PRODUCT en el formulario (Tela, Hilo, Fibra). */
  productLabel: string;
  productPlaceholder: string;
  /** Campo propio del tier: Servicio (Tier 2) u Origen (Tier 4). */
  extraField: "service" | "origin" | null;
};

export const TIER_CONFIG: Record<TierNumber, TierConfig> = {
  2: {
    tier: 2,
    title: "Producción de Materiales (Tejido de Tela, teñido y estampado)",
    productLabel: "Tela",
    productPlaceholder: "Algodón Orgánico Pima / French Terry Pima Sólido 40/1+40/1+20/1",
    extraField: "service",
  },
  3: {
    tier: 3,
    title: "Procesamiento de Materias Primas (Hilo)",
    productLabel: "Hilo",
    productPlaceholder: "Hilado Orgánico Ne 40/1 Pima/Ipa Pein. Bonet.Z.Paraf. Crudo",
    extraField: null,
  },
  4: {
    tier: 4,
    title: "Origen de la Fibra (Algodón / Materia Prima)",
    productLabel: "Fibra",
    productPlaceholder: "Algodón Orgánico Pima",
    extraField: "origin",
  },
};

/** SERVICE de Tier 2, en el orden en que se procesa la tela. */
export const SERVICE_TEJIDO = 1;

export const TIER2_SERVICES = [
  { value: 1, label: "Tejido de Tela", short: "Tejido" },
  { value: 2, label: "Teñido de Tela", short: "Teñido" },
  { value: 3, label: "Estampado de Tela", short: "Estampado" },
] as const;

/**
 * Por qué no se puede crear un servicio de Tier 2 en una OP que ya tiene `loaded`, o
 * `null` si se puede. Misma regla que el backend: uno por servicio, y Teñido/Estampado
 * exigen el Tejido previo.
 */
export function tier2ServiceBlocker(service: number, loaded: Set<number>): string | null {
  if (loaded.has(service)) return "ya cargado";
  if (service !== SERVICE_TEJIDO && !loaded.has(SERVICE_TEJIDO)) return "requiere Tejido";
  return null;
}
