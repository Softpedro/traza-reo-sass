-- Impacto social pasa a colgar de la MARCA, no de la orden de producción: fuerza
-- laboral femenina, liderazgo, condiciones de trabajo y compromiso OIT son datos de
-- la empresa, no de una prenda (pantalla MREO-22-E, que sólo pide Marca).
--   - Se reemplaza ID_DLK_ORDER_DETAIL por ID_DLK_BRAND (FK a MD_BRAND).
--   - SOCIAL_IMPACT: nombre de la ficha ("Trabajo Digno y Equidad"). No existía;
--     es el equivalente a RESTRICTED_SUBSTANCES / CIRCULAR_ECONOMY en sus tablas.
--   - REPORT_FILE: el PDF del informe; REPORT guarda el nombre del archivo.
-- Se puede soltar la columna vieja porque la tabla es nueva y está vacía: se creó en
-- 20260918000000 y nunca llegó a producción.
ALTER TABLE `OD_SOCIAL_IMPACT`
  DROP FOREIGN KEY `fk_social_impact_order_detail`;

ALTER TABLE `OD_SOCIAL_IMPACT`
  DROP INDEX `idx_social_impact_order_detail`,
  DROP COLUMN `ID_DLK_ORDER_DETAIL`,
  ADD COLUMN `ID_DLK_BRAND` INT NOT NULL AFTER `ID_DLK_SOCIAL_IMPACT`,
  ADD COLUMN `SOCIAL_IMPACT` VARCHAR(100) NULL AFTER `COD_SOCIAL_IMPACT`,
  ADD COLUMN `REPORT_FILE` MEDIUMBLOB NULL,
  ADD INDEX `idx_social_impact_brand` (`ID_DLK_BRAND`);

ALTER TABLE `OD_SOCIAL_IMPACT`
  ADD CONSTRAINT `fk_social_impact_brand`
    FOREIGN KEY (`ID_DLK_BRAND`) REFERENCES `MD_BRAND` (`ID_DLK_BRAND`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
