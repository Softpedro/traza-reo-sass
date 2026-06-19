-- Seed de demo: MODELO "Pijama Eleganza Natural" enganchado a OP-28-26.
-- Link al pedido: MD_MODEL.COD_MODEL = OD_ORDER_DETAIL.COD_ESTILO ('P1EA1FW24NY000L').
-- Idempotente: borra primero el modelo demo y sus hijos por COD_MODEL.

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET @cod_estilo := 'P1EA1FW24NY000L';

-- Limpieza previa (hijos por FK, luego modelo)
DELETE c FROM MD_CARE c JOIN MD_MODEL m ON m.ID_DLK_MODEL = c.ID_DLK_MODEL WHERE m.COD_MODEL = @cod_estilo;
DELETE i FROM MD_MODEL_IMAGES i JOIN MD_MODEL m ON m.ID_DLK_MODEL = i.ID_DLK_MODEL WHERE m.COD_MODEL = @cod_estilo;
DELETE d FROM MD_MODEL_DETAIL d JOIN MD_MODEL m ON m.ID_DLK_MODEL = d.ID_DLK_MODEL WHERE m.COD_MODEL = @cod_estilo;
DELETE FROM MD_MODEL WHERE COD_MODEL = @cod_estilo;

-- Modelo (catálogo)
INSERT INTO MD_MODEL
  (ID_DLK_BRAND, COD_MODEL, NAME_MODEL, DES_MODEL, NAME_COLLECTION, CATEGORY_MODEL,
   COMPOSITION_MODEL, MATERIAL_MODEL, YEAR, SEASON, IS_SET, NRO_PIECES, COD_USUARIO_CARGA_DL)
VALUES
  (1, @cod_estilo,
   'Pijama Eleganza Natural',
   'Blusa de pijama manga larga, confeccionada en Interlock 50/1 Estampado (100% Pima Cotton). Detalles de bordado colibrí en bolsillo izquierdo, media luna estampada. Cierre frontal con botones 28L color madera y ojales de 7/8 pulgadas.',
   'Dream Garden',
   'Ropa de Dormir / Homewear Femenino (Sup.)',
   '100% Pima Cotton. Tela: Interlock 50/1 Estampado. Densidad 0.19 kg/m2.',
   'Interlock 50/1 Estampado',
   2025, 'Spring 25', 1, 2, 'SEED');

SET @mid := LAST_INSERT_ID();

-- Piezas (orden importa: pieza 1 primero = la que ve el serial 1 = Chaqueta/Blusa)
INSERT INTO MD_MODEL_DETAIL (ID_DLK_MODEL, NAME_PIECE, COD_USUARIO_CARGA_DL) VALUES
  (@mid, 'Blusa Pijama Eleganza Dream Garden', 'SEED'),
  (@mid, 'Pantalon Pijama Eleganza Dream Garden', 'SEED');

-- Cuidado de la prenda: UN solo texto libre (intro + viñetas "*" + cierre).
-- La app DPP parsea las líneas que empiezan con "*" como la lista de cuidados.
INSERT INTO MD_CARE (ID_DLK_MODEL, COD_CARE, NOMB_CARE, CAR_DESCRIPTION, COD_USUARIO_CARGA_DL) VALUES
  (@mid, 'C01', 'Cuidado de la prenda',
   'Para conservar la suavidad color y forma de tu pijama Eleganza:\n* Lavar a máquina en ciclo delicado.\n* Usar agua fría (máx. 30°C)\n* Lavar con colores similares\n* No usar blanqueador ni lejía\n* Secar a la sombra o en secadora a baja temperatura\n* Planchar a temperatura media por el reverso\n* No lavar en seco\nCuidado adecuado prolonga vida útil y mantiene confort premium. Se recomienda detergentes ecológicos.',
   'SEED');

SELECT @mid AS id_modelo_creado, (SELECT COUNT(*) FROM MD_MODEL_DETAIL WHERE ID_DLK_MODEL=@mid) AS piezas, (SELECT COUNT(*) FROM MD_CARE WHERE ID_DLK_MODEL=@mid) AS cuidados;
