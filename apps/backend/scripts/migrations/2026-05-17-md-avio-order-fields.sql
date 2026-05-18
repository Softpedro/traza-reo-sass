-- MD_AVIO: campos de pedido (orden, medidas, factura).
-- Nota: el ALTER original referia MD_AVIO_EMPAQUE (inexistente); se aplica a MD_AVIO.
-- Idempotente. Aplicar a local y prod.
-- Cada columna se agrega solo si no existe (evita error al re-ejecutar).

-- ORDER_FORM
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'MD_AVIO'
    AND COLUMN_NAME = 'ORDER_FORM'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE MD_AVIO ADD COLUMN ORDER_FORM VARCHAR(20) NULL COMMENT ''Orden de Pedido para el cual se requiere el avio'' AFTER OBSERVATION',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- MEASURES_AVIO
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'MD_AVIO'
    AND COLUMN_NAME = 'MEASURES_AVIO'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE MD_AVIO ADD COLUMN MEASURES_AVIO VARCHAR(100) NULL COMMENT ''Medidas del Avio'' AFTER ORDER_FORM',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- INVOICE_AVIO
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'MD_AVIO'
    AND COLUMN_NAME = 'INVOICE_AVIO'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE MD_AVIO ADD COLUMN INVOICE_AVIO VARCHAR(45) NULL COMMENT ''Factura del Avio'' AFTER MEASURES_AVIO',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
