-- Trazabilidad (nivel Subproceso): campo "Fábrica" del subproceso de la ruta.
-- Se agrega ID_DLK_FACILITY (FK -> MD_FACILITY) a OD_SUBPROCESS_ROUTE.
-- Nullable + ON DELETE SET NULL: aditivo, sin pérdida de datos ni downtime.

ALTER TABLE `OD_SUBPROCESS_ROUTE`
  ADD COLUMN `ID_DLK_FACILITY` INT NULL AFTER `RESPONSIBLE_ROLE`,
  ADD INDEX `idx_subprocess_route_facility` (`ID_DLK_FACILITY`),
  ADD CONSTRAINT `fk_OD_SUBPROCESS_ROUTE_MD_FACILITY1`
    FOREIGN KEY (`ID_DLK_FACILITY`) REFERENCES `MD_FACILITY` (`ID_DLK_FACILITY`)
    ON DELETE SET NULL ON UPDATE NO ACTION;
