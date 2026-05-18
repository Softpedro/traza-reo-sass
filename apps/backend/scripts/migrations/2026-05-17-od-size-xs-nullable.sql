-- Corrige OD_ORDER_DETAIL.SIZE_XS: se creó como NOT NULL en 2026-05-06-od-size-xs.sql,
-- inconsistente con el resto de columnas SIZE_* (todas NULL-ables).
-- El import de OP (odOrderDetail.createMany) envía NULL en tallas sin valor:
-- funcionaba para todas las tallas menos XS, que rechazaba el NULL.
-- Aplicar a local y prod. No destructivo: solo relaja la restricción, no toca datos.
-- Idempotente: solo modifica si la columna sigue siendo NOT NULL.

SET @is_nullable := (
  SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'OD_ORDER_DETAIL'
    AND COLUMN_NAME = 'SIZE_XS'
);
SET @sql := IF(@is_nullable = 'NO',
  'ALTER TABLE OD_ORDER_DETAIL MODIFY COLUMN SIZE_XS INT NULL DEFAULT 0',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
