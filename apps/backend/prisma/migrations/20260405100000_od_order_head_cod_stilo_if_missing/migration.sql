-- OLK (20260403140000) eliminó COD_STILO; Prisma y el DDL de negocio lo requieren.
-- Idempotente: no falla si la columna ya existe (p. ej. tras 20260404120000).

SET @has_stilo := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'OD_ORDER_HEAD' AND COLUMN_NAME = 'COD_STILO'
);
SET @sql := IF(
  @has_stilo = 0,
  'ALTER TABLE OD_ORDER_HEAD ADD COLUMN COD_STILO VARCHAR(100) NULL',
  'SELECT ''skip_cod_stilo'' AS msg'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
