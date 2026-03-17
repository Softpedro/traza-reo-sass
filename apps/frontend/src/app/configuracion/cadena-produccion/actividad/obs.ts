/** Tipo de actividad: 1=Manual, 2=Máquina, 3=Control */
export const OBS_TIPO_ACTIVIDAD: Record<string, string> = {
  "1": "Manual",
  "2": "Máquina",
  "3": "Control",
};

export const OBS_ESTADO: Record<number, string> = {
  0: "Off",
  1: "On",
};

export function getTipoActividadLabel(value: string): string {
  return OBS_TIPO_ACTIVIDAD[value] ?? value || "—";
}

export function getEstadoLabel(value: number): string {
  return OBS_ESTADO[value] ?? String(value);
}
