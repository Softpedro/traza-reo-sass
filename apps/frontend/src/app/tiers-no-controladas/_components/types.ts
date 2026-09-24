/** Orden de producción (OD_ORDER_DETAIL) + su orden de pedido, tal como los anida el API. */
export type LayerOrderDetail = {
  idDlkOrderDetail: number;
  codOrderDetail: string | null;
  nomEstilo: string | null;
  orderHead?: {
    idDlkOrderHead: number;
    codOrderHead: string | null;
    brand?: { idDlkBrand: number; codBrand: string; nameBrand: string } | null;
  } | null;
};

/** Fila de OD_UNCONTROLLED_LAYERS como la devuelve /api/uncontrolled-layers. */
export type UncontrolledLayer = {
  idDlkUncontrolledLayers: number;
  idDlkOrderDetail: number;
  codUncontrolledLayers: string;
  tier: number;
  /** Tela (Tier 2), Hilo (Tier 3) o Fibra (Tier 4). */
  product: string | null;
  /** Nombre del proveedor (MD_SUPPLIER.NAME_SUPPLIER). */
  supplier: string | null;
  /** Sólo Tier 2: 1 Tejido, 2 Teñido, 3 Estampado. */
  service: number | null;
  /** Sólo Tier 4: "DEPARTAMENTO / PAÍS" o "PAÍS". */
  origin: string | null;
  certificate: string | null;
  /** Emisor del certificado. */
  transmitter: string | null;
  certificateNumber: string | null;
  /** Las fechas llegan como ISO (DATE en la BD, sin hora). */
  dateOfIssue: string | null;
  expirationDate: string | null;
  startDate: string | null;
  endDate: string | null;
  /** Sólo en las respuestas de una fila (GET /:id, POST, PUT). */
  hasCertificateSheet?: boolean;
  stateUncontrolledLayers: number | null;
  orderDetail?: LayerOrderDetail | null;
};

/** Orden de producción ya elegida al abrir el modal (ej. "Crear" desde una celda de Tier 2). */
export type PresetOrder = {
  idDlkOrderDetail: number;
  marca: string;
  ordenPedido: string;
  ordenProduccion: string;
};
