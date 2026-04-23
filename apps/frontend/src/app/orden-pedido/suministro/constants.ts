/** Etapas del flujo Orden de pedido (STAGE_ORDER_HEAD). */
export const ORDER_HEAD_STAGES: Record<number, string> = {
  1: "1. Registro",
  2: "2. Suministro",
  3: "3. Etiqueta",
  4: "4. Ruta",
  5: "5. Trazabilidad",
  6: "6. Lista negra",
};

/**
 * Sub-estado de la etapa (STATUS_STAGE_ORDER_HEAD) según la migración:
 *  1 = Sin Iniciar, 2 = Iniciado, 3 = Concluido.
 */
export const SUMINISTRO_STATUS: Record<number, string> = {
  1: "1. Sin Iniciar",
  2: "2. Iniciado",
  3: "3. Concluido",
};

export const SUMINISTRO_STATUS_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "1. Sin Iniciar" },
  { value: 2, label: "2. Iniciado" },
  { value: 3, label: "3. Concluido" },
];

export const ACTIVO_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "Off" },
  { value: 1, label: "On" },
];

/** Etapa fija del módulo Suministro. */
export const STAGE_SUMINISTRO = 2;
