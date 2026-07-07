-- Marca: dos campos nuevos que se exponen en el servicio del DPP (app pública).
--  - LOGO_DPP: logo específico para el DPP, independiente de LOGO_BRAND
--    ("Logo Etiqueta"). Mismo tipo de blob que LOGO_BRAND (LONGBLOB).
--  - COLOR_FONDO_IMAGEN_DPP: color de fondo de la imagen en el DPP (hex, ej. "#0A0A0A").
-- Aditiva: dos columnas nullable. No toca datos existentes.
ALTER TABLE `MD_BRAND`
  ADD COLUMN `LOGO_DPP` LONGBLOB NULL,
  ADD COLUMN `COLOR_FONDO_IMAGEN_DPP` VARCHAR(20) NULL;
