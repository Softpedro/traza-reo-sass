/**
 * OBS: Leyenda para los campos de Eslabón (Cadena de Producción)
 */

export const OBS_CATEGORIA: Record<number, string> = {
  1: "Textil",
  2: "Cuero",
  3: "Accesorios",
};

export const OBS_SECUENCIA: Record<number, string> = {
  1: "Cultivo de Algodon",
  2: "Hilado",
  3: "Tela",
  4: "Confeccion",
  5: "Marca",
};

/** Trazabilidad: orden inverso (T0 = Marca, T4 = Cultivo) */
export const OBS_TRAZABILIDAD: Record<number, string> = {
  1: "T0 (Marca)",
  2: "T1 (Confeccion)",
  3: "T2 (Tela)",
  4: "T3 (Hilado)",
  5: "T4 (Cultivo del Algodon)",
};

export const OBS_ESTADO: Record<number, string> = {
  0: "Off",
  1: "On",
};

export function getCategoriaLabel(value: number): string {
  return OBS_CATEGORIA[value] ?? String(value);
}

export function getSecuenciaLabel(value: number): string {
  return OBS_SECUENCIA[value] ?? String(value);
}

export function getTrazabilidadLabel(value: number): string {
  return OBS_TRAZABILIDAD[value] ?? String(value);
}

export function getEstadoLabel(value: number): string {
  return OBS_ESTADO[value] ?? String(value);
}
