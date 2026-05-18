-- MD_BRAND: subdominio por marca (multi-tenant).
-- Idempotente. Aplicar a local y prod.

-- Si la columna ya existe (re-ejecucion), MariaDB lanza error; lo evitamos con un check.
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'MD_BRAND'
    AND COLUMN_NAME = 'SUBDOMAIN_BRAND'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE MD_BRAND ADD COLUMN SUBDOMAIN_BRAND VARCHAR(100) NULL AFTER LOGO_BRAND',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
