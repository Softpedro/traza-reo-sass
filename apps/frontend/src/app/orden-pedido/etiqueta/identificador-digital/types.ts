/** Identificador digital — catálogo global (MD_DIGITAL_IDENTIFIER). */
export type DigitalIdentifier = {
  idDlkDigitalIdentifier: number;
  codDigitalIdentifier: string;
  typeDigitalIdentifier: string | null;
  materialDigitalIdentifier: string | null;
  locationDigitalIdentifier: string | null;
  standardIsoDigitalIdentifier: string | null;
  supplierDigitalIdentifier?: string | null;
  modelDigitalIdentifier?: string | null;
  observationDigitalIdentifier?: string | null;
  stateDigitalIdentifier: number | null;
  fecProcesoCargaDl?: string | null;
  fecProcesoModifDl?: string | null;
};

/** Tipos de soporte físico. OBS del mockup: 1=QR, 2=NFC, 3=RFID. */
export const TIPO_OPTIONS = ["QR", "NFC", "RFID"] as const;

/** Estado del registro (On/Off ↔ 1/0). */
export const ESTADO_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "On" },
  { value: 0, label: "Off" },
];
