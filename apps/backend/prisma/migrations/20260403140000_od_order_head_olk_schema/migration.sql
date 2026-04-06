-- Pivot OLK (ID_OLK_ORDER_HEAD) omitido: fallaba en varios hosts (p. ej. MySQL sin
-- `DROP FOREIGN KEY IF EXISTS`) y es redundante con 20260404120000 + migraciones siguientes.
-- El esquema final sigue siendo DLK (ID_DLK_ORDER_HEAD) como en schema.prisma.
SELECT 1 AS _migration_noop_ok;
