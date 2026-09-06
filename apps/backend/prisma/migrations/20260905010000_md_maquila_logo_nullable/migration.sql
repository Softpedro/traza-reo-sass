-- LOGO_MAQUILA era la única de las nueve columnas de imagen del esquema con NOT NULL.
-- Eso obligaba a representar "sin logo" con un blob vacío (Buffer.alloc(0)) en vez de
-- NULL, distinto del resto de logos y fotos. Se alinea con los demás.
ALTER TABLE `MD_MAQUILA`
  MODIFY COLUMN `LOGO_MAQUILA` LONGBLOB NULL;

-- Normaliza las filas que la versión anterior pudo dejar con blob de longitud cero.
-- Hoy no hay ninguna, pero el código desplegado sigue escribiéndolas hasta este deploy.
UPDATE `MD_MAQUILA`
  SET `LOGO_MAQUILA` = NULL
  WHERE OCTET_LENGTH(`LOGO_MAQUILA`) = 0;
