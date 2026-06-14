-- Trazabilidad (nivel Proceso): campo "Fábrica" del proceso de la ruta.
-- Se agrega ID_DLK_FACILITY (FK -> MD_FACILITY) a OD_PROCESS_ROUTE.
-- Nullable + ON DELETE SET NULL: no rompe rutas existentes ni exige fábrica.
-- (Los documentos de input/procedimiento/output se siguen guardando como nombre
--  en sus columnas FILE_* existentes; no se agregan columnas de blob.)

ALTER TABLE `OD_PROCESS_ROUTE`
  ADD COLUMN `ID_DLK_FACILITY` INT NULL AFTER `RESPONSIBLE_PROCESS`,
  ADD INDEX `idx_process_route_facility` (`ID_DLK_FACILITY`),
  ADD CONSTRAINT `fk_OD_PROCESS_ROUTE_MD_FACILITY1`
    FOREIGN KEY (`ID_DLK_FACILITY`) REFERENCES `MD_FACILITY` (`ID_DLK_FACILITY`)
    ON DELETE SET NULL ON UPDATE NO ACTION;
