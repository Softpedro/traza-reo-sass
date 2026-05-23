-- Per-talla LabelHead: agrega columna SIZE y UNIQUE(idDlkOrderDetail, size).
-- IMPORTANTE: borra LabelHead/LabelDetail existentes (autorizado por el usuario, dev/prod).

DELETE FROM `OD_ORDER_LABEL_DETAIL`;
DELETE FROM `OD_ORDER_LABEL_HEAD`;

ALTER TABLE `OD_ORDER_LABEL_HEAD`
  ADD COLUMN `SIZE` VARCHAR(50) NULL AFTER `COD_GTIN`;

CREATE UNIQUE INDEX `uq_label_head_detail_size`
  ON `OD_ORDER_LABEL_HEAD` (`ID_DLK_ORDER_DETAIL`, `SIZE`);
