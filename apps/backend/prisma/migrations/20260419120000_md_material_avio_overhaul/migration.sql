-- Overhaul de tablas de insumos.
-- MD_MATERIALS → MD_MATERIAL (añade composicion, sostenibilidad, tintes, acabados, certificaciones).
-- MD_AVIOS     → MD_AVIO     (añade tipo, color, peso/unidad, sostenibilidad, certificados, observacion).
-- La data previa de ambas tablas se descarta (confirmado con el usuario).

DROP TABLE IF EXISTS MD_MATERIALS;
DROP TABLE IF EXISTS MD_AVIOS;

CREATE TABLE IF NOT EXISTS MD_MATERIAL (
  ID_DLK_MATERIAL INT NOT NULL AUTO_INCREMENT COMMENT 'Id Unico de Materiales',
  ID_DLK_SUPPLIER INT NOT NULL COMMENT 'Id Unico de Proveedor (FK)',
  COD_MATERIAL VARCHAR(100) NULL COMMENT 'Codigo de Materiales',
  MATERIAL VARCHAR(200) NULL COMMENT 'Tipo de material y descripción de composición',
  CONTENT_NAME_MATERIAL VARCHAR(200) NULL COMMENT 'Tipo de fibra (Textiles)',
  CONTENT_VALUE_MATERIAL DECIMAL(5,2) NULL COMMENT 'Porcentaje de fibra utilizada',
  CONTENT_SOURCE_MATERIALS VARCHAR(100) NULL COMMENT 'Fuente de la fibra',
  MATERIAL_TRADE_MARKS VARCHAR(100) NULL COMMENT 'Marcas comerciales utilizadas',
  RECYCLED TINYINT(1) NULL DEFAULT 0 COMMENT '1 si tiene insumos reciclados',
  PERCENTAGE_RECYCLED_MATERIALS DECIMAL(5,2) NULL COMMENT 'Porcentaje de materiales reciclados',
  RECYCLED_INPUT_SOURCE VARCHAR(500) NULL COMMENT 'Fuente del insumo reciclado',
  RENEWABLE_MATERIAL TINYINT(1) NULL DEFAULT 0 COMMENT '1 si tiene aporte renovable',
  PERCENTAGE_RENEWABLE_MATERIAL DECIMAL(5,2) NULL COMMENT 'Porcentaje de materiales renovables',
  RENEWABLE_INPUT_SOURCE VARCHAR(100) NULL COMMENT 'Fuente del insumo renovable',
  TYPE_DYES VARCHAR(100) NULL COMMENT 'Tipo de tinta utilizada',
  DYE_CLASS VARCHAR(100) NULL COMMENT 'Clase de proceso de teñido',
  CLASS_STANDARD_DYES VARCHAR(100) NULL COMMENT 'Estándar de selección de teñido',
  FINISHES VARCHAR(100) NULL COMMENT 'Acabado aplicado',
  PATTERNS VARCHAR(100) NULL COMMENT 'Tipos de patrón',
  RECOVERY_MATERIALS VARCHAR(100) NULL COMMENT 'Materiales de desecho recuperados',
  CERTIFICATION VARCHAR(1000) NULL COMMENT 'Certificaciones del material',
  STATE_MATERIALS TINYINT(1) NULL DEFAULT 1 COMMENT 'Estado del Registro (1: Activo)',
  COD_USUARIO_CARGA_DL VARCHAR(20) NULL COMMENT 'Usuario de carga',
  FEH_PROCESO_CARGA_DL DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  FEH_PROCESO_MODIF_DL DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última modificación',
  DES_ACCION VARCHAR(20) NULL COMMENT 'Acción: INSERT, UPDATE',
  FLG_STATUT_ACTIF TINYINT(1) NULL DEFAULT 1 COMMENT 'Flag del estado del origen',
  PRIMARY KEY (ID_DLK_MATERIAL),
  INDEX idx_fk_supplier (ID_DLK_SUPPLIER),
  CONSTRAINT fk_material_supplier
    FOREIGN KEY (ID_DLK_SUPPLIER)
    REFERENCES MD_SUPPLIER (ID_DLK_SUPPLIER)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS MD_AVIO (
  ID_DLK_AVIO INT NOT NULL AUTO_INCREMENT COMMENT 'Id Unico de Avios',
  ID_DLK_SUPPLIER INT NOT NULL COMMENT 'Id Unico de Proveedores (FK)',
  COD_AVIO VARCHAR(100) NULL COMMENT 'Codigo de Avios, ejemplo: AVI-1',
  TYPE_AVIO VARCHAR(100) NULL COMMENT 'Tipo de Avio (ejemplo: cierre, boton, etiqueta)',
  NAME_AVIO VARCHAR(200) NULL COMMENT 'Nombre del Avio',
  MATERIAL_AVIO VARCHAR(500) NULL COMMENT 'Descripcion del material del que esta hecho el avio',
  CONTENT_VALUE_MATERIAL DECIMAL(5,2) NULL COMMENT '% del contenido material del avio',
  CONTENT_SOURCE_MATERIAL VARCHAR(100) NULL COMMENT 'Fuente del material',
  MATERIAL_TRADE_MARKS VARCHAR(100) NULL COMMENT 'Nombre comercial del material',
  COLOR VARCHAR(200) NULL COMMENT 'Color del avio',
  WEIGHT DECIMAL(10,3) NULL COMMENT 'Peso del avio',
  UNIT_MEASUREMENT VARCHAR(20) NULL COMMENT 'Unidad de medida (gr, kg, mt, etc.)',
  RECYCLED TINYINT(1) NULL DEFAULT 0 COMMENT 'Booleano: 1=Reciclado, 0=No Reciclado',
  PERCENTAGE_RECYCLED_MATERIALS DECIMAL(5,2) NULL COMMENT '% de contenido reciclado',
  RECYCLED_INPUT_SOURCE VARCHAR(500) NULL COMMENT 'Fuente del material reciclado',
  CERTIFICATES VARCHAR(1000) NULL COMMENT 'Certificados que avalan el avio',
  OBSERVATION VARCHAR(500) NULL COMMENT 'Observaciones generales',
  STATE_AVIOS TINYINT(1) NULL DEFAULT 1 COMMENT 'Estado del Registro: 1=Activo, 0=Inactivo',
  COD_USUARIO_CARGA_DL VARCHAR(20) NULL COMMENT 'Usuario que realizo la carga',
  FEH_PROCESO_CARGA_DL DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha automatica de creacion',
  FEH_PROCESO_MODIF_DL DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha automatica de modificacion',
  DES_ACCION VARCHAR(20) NULL COMMENT 'Accion realizada: INSERT, UPDATE',
  FLG_STATUT_ACTIF TINYINT(1) DEFAULT 1 COMMENT 'Flag de estatus activo del origen',
  PRIMARY KEY (ID_DLK_AVIO),
  INDEX idx_avio_supplier (ID_DLK_SUPPLIER),
  CONSTRAINT FK_AVIO_SUPPLIER
    FOREIGN KEY (ID_DLK_SUPPLIER)
    REFERENCES MD_SUPPLIER (ID_DLK_SUPPLIER)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
