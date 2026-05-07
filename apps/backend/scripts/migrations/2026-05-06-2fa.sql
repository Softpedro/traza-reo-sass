-- 2FA: TOTP + backup codes.
-- Idempotente. Aplicar a local y prod.

-- Ampliar tamaño del secret encriptado (AES-256-GCM = IV+tag+ciphertext en base64 ≈ 100 chars).
ALTER TABLE MD_USER_REO
  MODIFY COLUMN TWO_FACTOR_SECRET VARCHAR(255) NULL DEFAULT NULL;

-- Flag separado del secret: distingue "secret guardado" de "2FA confirmado y activo".
-- Si la columna ya existe (re-ejecución), MariaDB lanza error; lo evitamos con un check.
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'MD_USER_REO'
    AND COLUMN_NAME = 'TWO_FACTOR_ENABLED'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE MD_USER_REO ADD COLUMN TWO_FACTOR_ENABLED INT NOT NULL DEFAULT 0 AFTER TWO_FACTOR_SECRET',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Tabla de backup codes (una fila por código). bcrypt hash, marcable como usado.
CREATE TABLE IF NOT EXISTS MD_USER_BACKUP_CODES (
  ID_BACKUP_CODE         BIGINT       NOT NULL AUTO_INCREMENT,
  ID_DLK_USER_REO        INT          NOT NULL,
  CODE_HASH              VARCHAR(60)  NOT NULL,
  USED_AT                DATETIME(3)  NULL DEFAULT NULL,
  FEH_PROCESO_CARGA_DL   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (ID_BACKUP_CODE),
  CONSTRAINT MD_USER_BACKUP_CODES_USER_fkey
    FOREIGN KEY (ID_DLK_USER_REO)
    REFERENCES MD_USER_REO (ID_DLK_USER_REO)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX IDX_BACKUP_CODES_USER (ID_DLK_USER_REO)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
