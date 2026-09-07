-- COD_MODEL es el código de estilo: en Perú "estilo" es como se llama al modelo, así que
-- este valor es el mismo que OD_ORDER_DETAIL.COD_ESTILO y es lo que enlaza el catálogo
-- con las órdenes (el join que usan dpp-passport.service y la etiqueta).
--
-- El formulario de Modelo nunca expuso este campo, así que el backend lo autogeneraba
-- como MOD-1, MOD-2… El maestro quedó con códigos que no existen en ninguna orden y el
-- join no encontraba nada: los modelos de OP-84-26 no resolvían su catálogo, ni siquiera
-- en el pasaporte DPP público.

-- ── 1. Códigos reales en los 3 modelos afectados ─────────────────────
-- Emparejados por nombre: "Dream Garden Amore Natural" es el estilo DG-AMORE, etc.
UPDATE `MD_MODEL` SET `COD_MODEL` = 'DG-AMORE'    WHERE `COD_MODEL` = 'MOD-2';
UPDATE `MD_MODEL` SET `COD_MODEL` = 'DG-ELEGANZA' WHERE `COD_MODEL` = 'MOD-3';
UPDATE `MD_MODEL` SET `COD_MODEL` = 'DG-GIUVENTU' WHERE `COD_MODEL` = 'MOD-4';

-- ── 2. Unicidad ──────────────────────────────────────────────────────
-- Sin esto, "enlazar por código" es una convención que la base no garantiza: dos
-- modelos con el mismo código harían ambiguo el join en las dos direcciones.
CREATE UNIQUE INDEX `uq_model_cod` ON `MD_MODEL` (`COD_MODEL`);
