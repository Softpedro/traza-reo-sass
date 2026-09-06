-- Modelo: ficha de medidas (imagen con el cuadro de medidas del modelo).
--  - MEASUREMENTS_SHEET: MEDIUMBLOB, mismo tipo que TECHNICAL_SPECIFICATION_FILE.
--    Se sube ya comprimida desde el navegador, así que 16 MB sobran de largo.
-- Aditiva: una columna nullable. No toca datos existentes.
ALTER TABLE `MD_MODEL`
  ADD COLUMN `MEASUREMENTS_SHEET` MEDIUMBLOB NULL;
