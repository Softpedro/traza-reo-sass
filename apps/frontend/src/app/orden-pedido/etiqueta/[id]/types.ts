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
  fondoTela: string | null;
  totalEstilo: number | null;
  esSet: number | null;
  numPiezas: number | null;
  // Desglose por talla del pedido (cantidades originales).
  size0_3: number | null;
  size3_6: number | null;
  size0_6: number | null;
  size6_12: number | null;
  size12_18: number | null;
  size2: number | null;
  size3: number | null;
  size4: number | null;
  size5: number | null;
  size6: number | null;
  size7: number | null;
  size8: number | null;
  size9: number | null;
  size10: number | null;
  size11: number | null;
  size12: number | null;
  size14: number | null;
  size16: number | null;
  sizeXs: number | null;
  sizeS: number | null;
  sizeM: number | null;
  sizeL: number | null;
  sizeXl: number | null;
  sizeXxl: number | null;
};

/** Columnas de talla del colorway → etiqueta legible, en orden de presentación. */
export const SIZE_FIELDS: { field: keyof Colorway; label: string }[] = [
  { field: "size0_3", label: "0-3" },
  { field: "size3_6", label: "3-6" },
  { field: "size0_6", label: "0-6" },
  { field: "size6_12", label: "6-12" },
  { field: "size12_18", label: "12-18" },
  { field: "size2", label: "2" },
  { field: "size3", label: "3" },
  { field: "size4", label: "4" },
  { field: "size5", label: "5" },
  { field: "size6", label: "6" },
  { field: "size7", label: "7" },
  { field: "size8", label: "8" },
  { field: "size9", label: "9" },
  { field: "size10", label: "10" },
  { field: "size11", label: "11" },
  { field: "size12", label: "12" },
  { field: "size14", label: "14" },
  { field: "size16", label: "16" },
  { field: "sizeXs", label: "XS" },
  { field: "sizeS", label: "S" },
  { field: "sizeM", label: "M" },
  { field: "sizeL", label: "L" },
  { field: "sizeXl", label: "XL" },
  { field: "sizeXxl", label: "XXL" },
];

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
