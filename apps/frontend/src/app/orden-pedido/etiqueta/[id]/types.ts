/** Tipos compartidos de la pantalla por-orden de Etiqueta. */

export type OrderHeadInfo = {
  idDlkOrderHead: number;
  codOrderHead: string | null;
  stageOrderHead: number | null;
  statusStageOrderHead: number | null;
  brand?: { idDlkBrand: number; nameBrand: string; codBrand: string } | null;
};

/** Colorway = una orden de producción (OD_ORDER_DETAIL). */
export type Colorway = {
  idDlkOrderDetail: number;
  idDlkOrderHead: number;
  codOrderDetail: string | null;
  codEstilo: string | null;
  nomEstilo: string | null;
  colorAway: string | null;
  totalEstilo: number | null;
  esSet: number | null;
  numPiezas: number | null;
};

/** Cabecera de etiqueta (OD_ORDER_LABEL_HEAD) de un colorway. */
export type LabelHead = {
  idDlkOrderLabelHead: number;
  idDlkOrderHead: number;
  idDlkOrderDetail: number | null;
  idDlkDigitalIdentifier: number;
  codEstilo: string | null;
  nameEstilo: string | null;
  codGtin: string | null;
  estampado: string | null;
  identifierType: string | null;
  inicioSerializacion: number | null;
  finSerializacion: number | null;
  totalLabel: number | null;
  stateOrderLabelHead: number | null;
  digitalIdentifier?: {
    idDlkDigitalIdentifier: number;
    codDigitalIdentifier: string;
    typeDigitalIdentifier: string | null;
  } | null;
};

/** Unidad serializada (OD_ORDER_LABEL_DETAIL) — el detalle 1 a 1. */
export type LabelDetail = {
  idDlkOrderLabelDetail: number;
  itemGlobal: number;
  itemBySize: number;
  serialNumber: string;
  sgtinFull: string;
  urlDppFull: string;
  color: string | null;
  print: string | null;
  size: string | null;
  pieceType: string | null;
  setGroupId: string | null;
  isBlacklisted: number | null;
};
