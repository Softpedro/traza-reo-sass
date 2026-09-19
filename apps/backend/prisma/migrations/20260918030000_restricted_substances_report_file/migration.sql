-- El informe de sustancias restringidas se sube como PDF y se guarda en la BD,
-- igual que en OD_CARBON_FOOTPRINT y OD_WATER_FOOTPRINT:
--   REPORT_FILE: el PDF (MEDIUMBLOB, hasta 16 MB).
--   REPORT: pasa a guardar el nombre del archivo subido (ya era VARCHAR(500) NULL).
-- Aditiva: una columna nullable. No toca datos existentes.
ALTER TABLE `OD_RESTRICTED_SUBSTANCES`
  ADD COLUMN `REPORT_FILE` MEDIUMBLOB NULL;
