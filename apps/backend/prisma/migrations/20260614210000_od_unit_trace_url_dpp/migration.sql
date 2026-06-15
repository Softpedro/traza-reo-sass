-- Trazabilidad unitaria: guardar la URL DPP cruda (GS1 Digital Link) que envía la API externa.
-- La unidad se resuelve a ID_DLK_ORDER_LABEL_DETAIL (FK existente) al ingestar.
-- Aditivo + nullable: sin pérdida de datos ni downtime.

ALTER TABLE `OD_UNIT_TRACE`
  ADD COLUMN `URL_DPP_TRACE` VARCHAR(1000) NULL AFTER `OBSERVATION_UNIT_TRACE`;
