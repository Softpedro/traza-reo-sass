-- La pantalla (MREO-22-D) pide el nombre de la práctica —"Upcycling (Scrunchie)"— como
-- un campo propio, y es también una columna de la tabla del listado. En el diseño
-- original no existía: DESCRIPTION, TOPIC y CONTENT ya tienen otro uso en esa misma
-- pantalla. Se agrega igual que RESTRICTED_SUBSTANCES en OD_RESTRICTED_SUBSTANCES.
-- Aditiva: una columna nullable. No toca datos existentes.
ALTER TABLE `OD_CIRCULAR_ECONOMY`
  ADD COLUMN `CIRCULAR_ECONOMY` VARCHAR(100) NULL AFTER `COD_CIRCULAR_ECONOMY`;
