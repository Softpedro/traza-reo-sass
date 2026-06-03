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
 * Sub-estado de la etapa (STATUS_STAGE_ORDER_HEAD), modelo de 3 estados:
 *  1 = Sin Iniciar, 2 = Iniciado, 3 = Concluido.
 */
export const ORDER_HEAD_STATUS: Record<number, string> = {
  1: "1. Sin Iniciar",
  2: "2. Iniciado",
  3: "3. Concluido",
};

/** Opciones del select de Ruta (estado) en el modal de Actualizar. */
export const RUTA_STATUS_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "1 - Sin Iniciar" },
  { value: 2, label: "2 - Iniciado" },
  { value: 3, label: "3 - Concluido" },
];

/** Estado activo (FLG_STATUT_ACTIF): On / Off. */
export const ACTIVO_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "On" },
  { value: 0, label: "Off" },
];

/** Etapa fija del módulo Ruta. */
export const STAGE_RUTA = 4;
