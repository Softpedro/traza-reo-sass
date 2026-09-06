-- Etiquetas: dos contadores con alcances distintos, ambos perpetuos entre órdenes.
--
--   GS1  -> por GTIN (modelo+color+talla). Es el serial que se imprime en el AI 21 del
--           Digital Link y en el sGTIN. Una OP futura del mismo GTIN continúa la serie.
--   DPP  -> por MODELO (COD_ESTILO). Sólo acumulador para los reportes ESPR
--           (modelo/lote/producto); NO viaja en ninguna URL.
--
-- Antes existía un único contador, con alcance ORDEN, que además alimentaba el AI 21.
-- Por eso la serie corría de largo entre modelos distintos de la misma orden
-- (DG-ELEGANZA arrancaba en 287 sólo porque DG-AMORE terminó en 286).

-- ── 1. Columnas nuevas ───────────────────────────────────────────────
ALTER TABLE `OD_ORDER_LABEL_HEAD`
  ADD COLUMN `TOTAL_PRENDAS`     INT NULL,
  ADD COLUMN `INICIO_SERIAL_GS1` INT NULL,
  ADD COLUMN `FIN_SERIAL_GS1`    INT NULL;

-- ── 2. Backfill del rango GS1: acumulado por GTIN, en orden de creación ──
UPDATE `OD_ORDER_LABEL_HEAD` h
JOIN (
  SELECT ID_DLK_ORDER_LABEL_HEAD,
         COALESCE(SUM(TOTAL_LABEL) OVER (PARTITION BY COD_GTIN ORDER BY ID_DLK_ORDER_LABEL_HEAD
                  ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0) + 1 AS ini,
         COALESCE(SUM(TOTAL_LABEL) OVER (PARTITION BY COD_GTIN ORDER BY ID_DLK_ORDER_LABEL_HEAD), 0) AS fin
  FROM `OD_ORDER_LABEL_HEAD`
) x ON x.ID_DLK_ORDER_LABEL_HEAD = h.ID_DLK_ORDER_LABEL_HEAD
SET h.INICIO_SERIAL_GS1 = x.ini,
    h.FIN_SERIAL_GS1    = x.fin;

-- ── 3. Recálculo del rango DPP: acumulado por MODELO, ya no por orden ──
UPDATE `OD_ORDER_LABEL_HEAD` h
JOIN (
  SELECT h2.ID_DLK_ORDER_LABEL_HEAD,
         COALESCE(SUM(h2.TOTAL_LABEL) OVER (PARTITION BY d.COD_ESTILO ORDER BY h2.ID_DLK_ORDER_LABEL_HEAD
                  ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0) + 1 AS ini,
         COALESCE(SUM(h2.TOTAL_LABEL) OVER (PARTITION BY d.COD_ESTILO ORDER BY h2.ID_DLK_ORDER_LABEL_HEAD), 0) AS fin
  FROM `OD_ORDER_LABEL_HEAD` h2
  JOIN `OD_ORDER_DETAIL` d ON d.ID_DLK_ORDER_DETAIL = h2.ID_DLK_ORDER_DETAIL
) x ON x.ID_DLK_ORDER_LABEL_HEAD = h.ID_DLK_ORDER_LABEL_HEAD
SET h.INICIO_SERIALIZACION = x.ini,
    h.FIN_SERIALIZACION    = x.fin;

-- ── 4. Total de prendas ──────────────────────────────────────────────
-- Los sets agrupan sus piezas con SET_GROUP_ID: una prenda = un grupo. Sin sets,
-- cada fila de detalle ya es una prenda.
UPDATE `OD_ORDER_LABEL_HEAD` h
JOIN (
  SELECT ID_DLK_ORDER_LABEL_HEAD,
         CASE WHEN COUNT(DISTINCT SET_GROUP_ID) > 0
              THEN COUNT(DISTINCT SET_GROUP_ID) ELSE COUNT(*) END AS prendas
  FROM `OD_ORDER_LABEL_DETAIL` GROUP BY ID_DLK_ORDER_LABEL_HEAD
) x ON x.ID_DLK_ORDER_LABEL_HEAD = h.ID_DLK_ORDER_LABEL_HEAD
SET h.TOTAL_PRENDAS = x.prendas;

-- ── 5. Detalle: reasignar ambos correlativos ─────────────────────────
-- ITEM_BY_SIZE pasa a ser el serial GS1 (antes reiniciaba en 1 en cada cabecera) e
-- ITEM_GLOBAL pasa a ser el correlativo DPP del modelo. La posición dentro de la
-- cabecera se conserva, así que el desplazamiento es el mismo para las dos series.
UPDATE `OD_ORDER_LABEL_DETAIL` d
JOIN `OD_ORDER_LABEL_HEAD` h ON h.ID_DLK_ORDER_LABEL_HEAD = d.ID_DLK_ORDER_LABEL_HEAD
JOIN (
  SELECT ID_DLK_ORDER_LABEL_DETAIL,
         ROW_NUMBER() OVER (PARTITION BY ID_DLK_ORDER_LABEL_HEAD
                            ORDER BY ITEM_GLOBAL, ID_DLK_ORDER_LABEL_DETAIL) AS pos
  FROM `OD_ORDER_LABEL_DETAIL`
) r ON r.ID_DLK_ORDER_LABEL_DETAIL = d.ID_DLK_ORDER_LABEL_DETAIL
SET d.ITEM_BY_SIZE = h.INICIO_SERIAL_GS1     + r.pos - 1,
    d.ITEM_GLOBAL  = h.INICIO_SERIALIZACION  + r.pos - 1;

-- ── 6. Serial impreso: pasa a ser el GS1 ─────────────────────────────
-- Antes el AI 21 llevaba el contador global. La URL se reescribe conservando base,
-- GTIN y lote: sólo cambia el segmento que va detrás de /21/.
UPDATE `OD_ORDER_LABEL_DETAIL` d
JOIN `OD_ORDER_LABEL_HEAD` h ON h.ID_DLK_ORDER_LABEL_HEAD = d.ID_DLK_ORDER_LABEL_HEAD
SET d.SERIAL_NUMBER = CAST(d.ITEM_BY_SIZE AS CHAR),
    d.SGTIN_FULL    = CONCAT(COALESCE(NULLIF(TRIM(h.COD_GTIN), ''),
                                      CONCAT('label-', h.ID_DLK_ORDER_LABEL_HEAD)),
                             '/', d.ITEM_BY_SIZE),
    d.URL_DPP_FULL  = CONCAT(SUBSTRING_INDEX(d.URL_DPP_FULL, '/21/', 1), '/21/', d.ITEM_BY_SIZE)
WHERE d.URL_DPP_FULL LIKE '%/21/%';

-- ── 7. Guardia contra rangos duplicados ──────────────────────────────
-- Va al final, cuando el backfill ya dejó los valores consistentes.
CREATE UNIQUE INDEX `uq_label_head_gtin_gs1_start`
  ON `OD_ORDER_LABEL_HEAD` (`COD_GTIN`, `INICIO_SERIAL_GS1`);
