-- Sincroniza MD_PARENT_COMPANY con schema.prisma (columnas REO SaaS).
-- Idempotente: puedes ejecutarlo varias veces; solo añade lo que falte.
-- MariaDB / MySQL

SET @db := DATABASE();

-- ID_DLK_ADM_REO (nullable)
SET @sql := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'MD_PARENT_COMPANY' AND COLUMN_NAME = 'ID_DLK_ADM_REO'
    ),
    'SELECT ''ID_DLK_ADM_REO ya existe'' AS msg',
    'ALTER TABLE MD_PARENT_COMPANY ADD COLUMN ID_DLK_ADM_REO VARCHAR(10) NULL COMMENT ''Código REO SaaS'''
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- TYPE_PARENT_COMPANY (tinyint, default 1)
SET @sql := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'MD_PARENT_COMPANY' AND COLUMN_NAME = 'TYPE_PARENT_COMPANY'
    ),
    'SELECT ''TYPE_PARENT_COMPANY ya existe'' AS msg',
    'ALTER TABLE MD_PARENT_COMPANY ADD COLUMN TYPE_PARENT_COMPANY TINYINT(1) NOT NULL DEFAULT 1 COMMENT ''1=Marca Propia, 2=Maquila, 3=Híbrido, 4=Comercializadora'''
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
