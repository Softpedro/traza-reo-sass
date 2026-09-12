-- Marca: dos campos más de la app pública del DPP, al lado de LOGO_DPP.
--  - FAVICON_DPP: ícono de la pestaña del navegador. Mismo tipo de blob que
--    LOGO_DPP (LONGBLOB), porque entra por el mismo ImageUpload del formulario.
--  - TITULO_DPP: texto de la pestaña del navegador.
-- Aditiva: dos columnas nullable. No toca datos existentes.
ALTER TABLE `MD_BRAND`
  ADD COLUMN `FAVICON_DPP` LONGBLOB NULL,
  ADD COLUMN `TITULO_DPP` VARCHAR(150) NULL;
