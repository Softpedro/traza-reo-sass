-- OD_ORDER_LABEL_DETAIL.PIECE_TYPE es una copia denormalizada de
-- OD_ORDER_LABEL_COMPONENT.NAME_COMPONENT, escrita al crear la etiqueta.
--
-- update() renombraba el componente pero no propagaba el cambio al detalle, así que
-- las etiquetas creadas con los nombres por defecto ("CAMISA"/"PANTALON") y renombradas
-- después seguían mostrando el nombre viejo en el modal "Ver" y en el PDF exportado.
--
-- Es un campo descriptivo: no interviene en el serial, el sGTIN ni la URL del DPP, así
-- que se puede corregir en sitio sin regenerar nada.
UPDATE `OD_ORDER_LABEL_DETAIL` d
JOIN `OD_ORDER_LABEL_COMPONENT` c
  ON c.`ID_DLK_ORDER_LABEL_COMPONENT` = d.`ID_DLK_ORDER_LABEL_COMPONENT`
SET d.`PIECE_TYPE` = c.`NAME_COMPONENT`
WHERE NOT (d.`PIECE_TYPE` <=> c.`NAME_COMPONENT`);
