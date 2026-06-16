-- Trazabilidad unitaria: guardar la fase del escaneo DPP reportada por el socio ("inicio" | "fin").
-- Obligatoria en el contrato del API; en BD se deja NULLABLE para no romper filas previas.
-- Aditivo + nullable: sin pérdida de datos ni downtime.

ALTER TABLE `OD_UNIT_TRACE`
  ADD COLUMN `SCAN_PHASE` VARCHAR(10) NULL AFTER `URL_DPP_TRACE`;
