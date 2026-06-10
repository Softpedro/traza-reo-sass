-- Ensanchar columnas de las tablas de Ruta para que acepten los valores de los maestros MD_*.
-- Al copiar proceso/subproceso/actividad del maestro a OD_*_ROUTE, columnas más angostas que
-- el maestro provocaban "The provided value for the column is too long" (ej. RESPONSIBLE_PROCESS).
-- Cambio aditivo (ampliar VARCHAR): sin pérdida de datos ni downtime.

ALTER TABLE `OD_PROCESS_ROUTE`
  MODIFY `COD_PROCESS`         VARCHAR(100) NOT NULL,
  MODIFY `RESPONSIBLE_UNIT`    VARCHAR(100) NOT NULL,
  MODIFY `RESPONSIBLE_PROCESS` VARCHAR(100) NOT NULL;

ALTER TABLE `OD_SUBPROCESS_ROUTE`
  MODIFY `COD_SUBPROCESS`   VARCHAR(100) NOT NULL,
  MODIFY `RESPONSIBLE_UNIT` VARCHAR(100) NULL,
  MODIFY `RESPONSIBLE_ROLE` VARCHAR(100) NULL;

ALTER TABLE `OD_ACTIVITIES_ROUTE`
  MODIFY `COD_ACTIVITIES`  VARCHAR(100) NOT NULL,
  MODIFY `NAME_ACTIVITIES` VARCHAR(200) NOT NULL,
  MODIFY `TYPE_ACTIVITIES` VARCHAR(200) NOT NULL;
