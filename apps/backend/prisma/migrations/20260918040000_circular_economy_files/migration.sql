-- Economía circular: la imagen de la práctica y el informe se suben como archivo y
-- se guardan en la BD, igual que los logos de MD_BRAND y los informes de las huellas.
--   IMAGE_FILE:  la imagen (MEDIUMBLOB). IMAGE pasa a guardar el nombre del archivo.
--   REPORT_FILE: el PDF del informe. REPORT guarda el nombre del archivo.
-- Ambas columnas ya eran VARCHAR(500) NULL, así que sólo se suman los dos blobs.
-- Aditiva: dos columnas nullable. No toca datos existentes.
ALTER TABLE `OD_CIRCULAR_ECONOMY`
  ADD COLUMN `IMAGE_FILE` MEDIUMBLOB NULL,
  ADD COLUMN `REPORT_FILE` MEDIUMBLOB NULL;
