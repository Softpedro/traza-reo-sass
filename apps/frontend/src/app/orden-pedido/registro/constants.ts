/** Etapas del flujo Orden de pedido (STAGE_ORDER_HEAD). */
export const ORDER_HEAD_STAGES: Record<number, string> = {
  1: "1. Registro",
  2: "2. Suministro",
  3: "3. Etiqueta",
  4: "4. Ruta",
  5: "5. Trazabilidad",
  6: "6. Lista negra",
};

/** Estado de avance (STATUS_STAGE_ORDER_HEAD): Iniciado / Concluido. */
export const ORDER_HEAD_STATUS: Record<number, string> = {
  1: "Iniciado",
  2: "Concluido",
};

export const SI_NO: { value: number; label: string }[] = [
  { value: 0, label: "No" },
  { value: 1, label: "Sí" },
];

/** Concluido en formulario: No → Iniciado (1), Sí → Concluido (2). */
export function concluidoToStatus(concluido: number): number {
  return concluido === 1 ? 2 : 1;
}

export function statusToConcluido(status: number | null | undefined): number {
  if (status === 2) return 1;
  return 0;
}

export const ACTIVO_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "Off" },
  { value: 1, label: "On" },
];
