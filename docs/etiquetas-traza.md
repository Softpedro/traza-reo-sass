# Etiqueta / Traza (DPP) — Documentación del módulo

**Última actualización:** 2026-05-24
**Stack relevante:** `apps/backend` (Express + Prisma + MariaDB/MySQL) · `apps/frontend` (Next.js App Router) · `pdf-lib` + `qrcode` + `sharp`

Esta doc cubre el módulo de **Etiqueta** (etapa 3 del flujo de orden de pedido): cómo se modelan las cabeceras y detalles, qué endpoints/componentes intervienen, cómo se genera el PDF físico (40 × 100 mm) y los scripts de soporte.

---

## Índice

1. [Visión general](#1-visión-general)
2. [Modelo de datos](#2-modelo-de-datos)
3. [Endpoints backend](#3-endpoints-backend)
4. [Servicios backend](#4-servicios-backend)
5. [Frontend — pantalla por orden](#5-frontend--pantalla-por-orden)
6. [Modales](#6-modales)
7. [Generación de PDF](#7-generación-de-pdf)
8. [Iconos de sostenibilidad](#8-iconos-de-sostenibilidad)
9. [Scripts de build y soporte](#9-scripts-de-build-y-soporte)
10. [Migraciones](#10-migraciones)
11. [Deploy](#11-deploy)
12. [Pendientes / próximos pasos](#12-pendientes--próximos-pasos)
13. [Decisiones de diseño](#13-decisiones-de-diseño)

---

## 1. Visión general

La etapa **Etiqueta** transforma cada combinación **(colorway × talla)** de una Orden de Pedido en:

- Una **cabecera de etiqueta** (`OD_ORDER_LABEL_HEAD`) con su GTIN y rango de serialización.
- N **detalles serializados** (`OD_ORDER_LABEL_DETAIL`) — uno por unidad física (o N por unidad si es set).
- Un **PDF imprimible** de 40 × 100 mm — una página = una etiqueta, con QR del DPP, sGTIN, marca, íconos de sostenibilidad y pie de proveedor.

Cada unidad serializada lleva un QR que apunta al **GS1 Digital Link**:
```
{base}/01/{GTIN-14}/10/{ordenProduccion}/21/{serial}
```
(AI 01 = GTIN-14, AI 10 = lote/orden de producción, AI 21 = serial.)

---

## 2. Modelo de datos

### 2.1 `OD_ORDER_LABEL_HEAD` — cabecera

Una cabecera **por cada (colorway × talla)**. Antes del refactor de 2026-05-22 era una sola por colorway; ahora cada talla tiene la suya con su propio GTIN.

Columnas clave (schema en `apps/backend/prisma/schema.prisma:919-958`):

| Columna | Tipo | Notas |
|---|---|---|
| `ID_DLK_ORDER_LABEL_HEAD` | PK auto | |
| `ID_DLK_ORDER_HEAD` | FK | Orden de pedido padre |
| `ID_DLK_ORDER_DETAIL` | FK nullable | Colorway de origen |
| `ID_DLK_DIGITAL_IDENTIFIER` | FK | Tipo de identificador (RFID, NFC, etc.) |
| `COD_GTIN` | VARCHAR(14) | **Input manual** — uno por talla |
| `SIZE` | VARCHAR(50) | **Talla** que cubre esta cabecera |
| `INICIO_SERIALIZACION` | INT | Primer serial — autocalculado o manual |
| `FIN_SERIALIZACION` | INT | Último serial |
| `TOTAL_LABEL` | INT | DPPs totales (unidades × piezas/set) |
| `IDENTIFIER_TYPE` | VARCHAR(45) | Copia del tipo del identificador |
| `ESTAMPADO` | VARCHAR(100) | `CON ESTAMPADO` / `SIN ESTAMPADO` |
| `STATE_ORDER_LABEL_HEAD` | TINYINT | 1=On, 0=Off |

**Constraint clave**: `UNIQUE (ID_DLK_ORDER_DETAIL, SIZE)` (índice `uq_label_head_detail_size`) — evita duplicidad de talla por colorway.

### 2.2 `OD_ORDER_LABEL_DETAIL` — unidad serializada

Una fila por DPP (= un QR físico). Schema en `schema.prisma:961-985`.

| Columna | Notas |
|---|---|
| `ID_DLK_ORDER_LABEL_HEAD` | FK con `ON DELETE CASCADE` |
| `ITEM_GLOBAL` | Secuencial global dentro de la cabecera |
| `ITEM_BY_SIZE` | Contador dentro de la talla |
| `SERIAL_NUMBER` | Serial corto (1, 2, 3…) |
| `SGTIN_FULL` | `{GTIN}/{serial}` — UNIQUE |
| `URL_DPP_FULL` | GS1 Digital Link completo |
| `SIZE`, `COLOR`, `PRINT` | Atributos copiados de la cabecera |
| `PIECE_TYPE` | Para sets: nombre de la pieza (PANTALON, CAMISA, etc.) |
| `SET_GROUP_ID` | Agrupa piezas del mismo set físico |
| `IS_BLACKLISTED` | Lista negra (calidad) |

### 2.3 Relación con el colorway

`OD_ORDER_DETAIL` (colorway) tiene 24 columnas `SIZE_*` (size_0_3, …, size_XS, …, size_XXL) con la cantidad pedida por talla. Esas cantidades se usan como **default** al crear la etiqueta de una talla, pero el modal permite override (merma +15%, saldos).

El frontend filtra `SIZE_FIELDS` por cantidad > 0 para mostrar solo las tallas activas.

---

## 3. Endpoints backend

Definidos en `apps/backend/src/routes/order-label.routes.ts`. Todos bajo `/api/order-heads/:id/labels`.

| Método | Path | Descripción |
|---|---|---|
| `GET` | `/api/order-heads/:id/labels` | Lista todas las cabeceras de la orden |
| `POST` | `/api/order-heads/:id/labels` | Crea una cabecera (requiere `size` si trae `idDlkOrderDetail`) |
| `GET` | `/api/order-heads/:id/labels/:labelId` | Obtiene una cabecera por id |
| `PUT` | `/api/order-heads/:id/labels/:labelId` | Actualiza GTIN, estampado, estado |
| `GET` | `/api/order-heads/:id/labels/:labelId/details` | Lista detalles (unidades) de una cabecera |
| `GET` | `/api/order-heads/:id/labels/:labelId/pdf?size=40x100` | PDF de una sola cabecera |
| `GET` | `/api/order-heads/:id/labels/pdf?size=40x100` | PDF con TODAS las cabeceras de la orden |

Endpoint relacionado (en `order-head.routes.ts`):

| Método | Path | Descripción |
|---|---|---|
| `PUT` | `/api/order-heads/:id/details/:detailId` | Actualiza el colorway — incluido cualquier `size_X` para **agregar talla manual** |

Único tamaño soportado: `40x100`. Cualquier otro valor devuelve `400 — Tamaño inválido (usa 40x100)`.

---

## 4. Servicios backend

### `apps/backend/src/services/order-label.service.ts`

- **`LABEL_HEAD_FOR_LIST`** (líneas 13–51): SELECT base para listados — incluye `size`, `codGtin`, `inicioSerializacion`, `finSerializacion`, `totalLabel`, `digitalIdentifier`, `orderDetail`.
- **`create(input)`** (líneas ~250–500):
  - Si llega `idDlkOrderDetail`, exige `size` (talla obligatoria).
  - Valida duplicidad con `findFirst({ idDlkOrderDetail, size, flgStatutActif: 1 })`.
  - Resuelve cantidad para esa talla: `sizeBreakdown[talla] ?? totalLabel ?? cw.size_X`.
  - Calcula `rangeStart` — si no se pasa `inicioSerializacion`, continúa tras el último rango del mismo `codGtin` en la orden.
  - Crea la cabecera y N detalles via `createMany` dentro de una `$transaction`.
  - Si `esSet`, multiplica detalles por `numPiezas` con `setGroupId` común.
- **`update(labelId, input)`**: GTIN, estampado, estado. Si `statusStageOrderHead === 2`, promueve la orden a stage 4 (Ruta).
- **`buildLabelsPdf` / `buildLabelPdf`** (líneas ~605–680): arman el PDF; delegan a `label-pdf.ts`.

### `apps/backend/src/services/label-pdf.ts`

Renderiza el PDF físico — ver [§ 7](#7-generación-de-pdf).

---

## 5. Frontend — pantalla por orden

Ruta: `/orden-pedido/etiqueta/[id]` — archivo `apps/frontend/src/app/orden-pedido/etiqueta/[id]/order-etiqueta-detail-client.tsx`.

### Estructura visual

```
Stepper (etapa 3)
IdentificadorDigitalBar
[ Botón "Generar PDF de todas las etiquetas" ]

Tabla:
┌─────────────────────────────────────────────────────────────┐
│ Orden│Cod│OP │Estilo│Color│Tela│Talla│GTIN│Tipo│Total│Ini│Fin│Acción│
├─────────────────────────────────────────────────────────────┤
│ ───── shared con rowSpan ───── │  T1  │ …  │ …  │ … │ …│ …│ … │
│                                │  T2  │ …  │ …  │ … │ …│ …│ … │
│                                │  T3  │ …  │ …  │ … │ …│ …│ … │
│         │ + Agregar talla │ ← fila de cierre del grupo
├─────────────────────────────────────────────────────────────┤
│ (siguiente colorway…)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Lógica de filas

`buildTallaRows(colorways, labels)` (líneas ~13–63):

- Por cada colorway, filtra `SIZE_FIELDS` con cantidad > 0.
- Emite N filas de talla (1 por talla activa) + 1 fila de cierre con `isAddRow: true`.
- `colorwayRowSpan = tallas.length + 1` para que los shared cells (Orden, Estilo, Color Way, Fondo) abarquen todo el grupo, incluida la fila de "+ Agregar talla".
- Cada fila de talla matchea su LabelHead por `(idDlkOrderDetail, size)`.

### Acciones por fila

| Estado | Botones | Acción |
|---|---|---|
| Sin LabelHead | **Crear** | Abre `EtiquetaHeadModal` en modo `create` con la talla |
| Con LabelHead | **Editar / Ver / Generar** | Edita cabecera / muestra detalles / descarga PDF |
| Fila de cierre | **+ Agregar talla** | Abre `AgregarTallaModal` |

### Fetches al montar

```ts
GET /api/order-heads/:id        → order
GET /api/order-heads/:id/details → colorways[]
GET /api/order-heads/:id/labels  → labels[]
```

---

## 6. Modales

Todos en `apps/frontend/src/app/orden-pedido/etiqueta/[id]/`.

### `etiqueta-head-modal.tsx` — Crear / Editar cabecera

- Recibe `colorway`, `labelHead?`, `talla` (obligatoria en create).
- En `create`: pide GTIN, Identificador Digital, Estampado, Cantidad (default = `cw.size_X` de la talla), `inicioSerializacion` opcional, set + nombres de pieza.
- En `edit`: solo GTIN, Estampado, Estado. Total/Inicia/Termina son readonly.
- Payload create: `{ idDlkOrderDetail, idDlkDigitalIdentifier, codGtin, size, totalLabel, estampado, esSet, numPiezas, pieceTypes, inicioSerializacion? }`.

### `etiqueta-detalle-modal.tsx` — Ver detalles

Lista los `OdOrderLabelDetail` de una cabecera (item, talla, pieza, serial, sGTIN). Botón "Imprimir" usa `window.print()` sobre un HTML embebido.

### `generar-pdf-modal.tsx` — Generar PDF

- Único tamaño: 40 × 100 mm (hardcoded `LABEL_SIZE = "40x100"`).
- `labelHead === null` → PDF con todas las cabeceras de la orden.
- Descarga directa via blob.

### `agregar-talla-modal.tsx` — Agregar talla manualmente *(nuevo)*

- Lista las tallas con cantidad 0 o null (`SIZE_FIELDS` filtrado).
- Usuario elige talla + cantidad.
- `PUT /api/order-heads/:id/details/:detailId` con `{ [sizeField]: cantidad }`.
- Refresca la tabla → la nueva talla aparece como una fila más con botón "Crear".

---

## 7. Generación de PDF

Archivo: `apps/backend/src/services/label-pdf.ts`. Stack: `pdf-lib` + `qrcode`.

### 7.1 Tamaño y constantes

```ts
LABEL_SIZES = { "40x100": { wMm: 40, hMm: 100 } }   // único soportado
QR_SIZE_MM = 22                                      // QR fijo
QR_QUIET_MM = 2                                      // margen blanco alrededor del QR
LINE_THICKNESS = 0.25                                // pt — líneas finas
```

### 7.2 Layout (de arriba a abajo)

```
0 – 10 mm   ███ COSTURA (topMargin) — invisible al coserse
            Logo de marca (max 9 mm de alto, escala con aspect)
GAP (3mm)
            ─── hr
GAP
            sGTIN (Helvetica-Bold, autoshrink a innerW)
GAP
            ─── hr
GAP
            Subtítulo "Escanea para ver el Pasaporte Digital del Producto"
GAP
            QR 22 × 22 mm  (centrado en band sobrante, bias 70% arriba)
BIG_GAP (4mm)
            [ icono · icono · icono · icono · icono ]   (5 × 4 mm)
BIG_GAP
            "Proveedor del servicio:"
            "UMA TECHNOLOGY S.A.C." (bold)
            "Plataforma " + TRAZA(bold) + " SaaS DPP"
bottomMargin (3mm)
```

### 7.3 Detalles importantes

- **Costura de 10 mm**: los primeros 10 mm del label quedan dentro del dobladillo cosido. Por eso `topMargin = 10mm` — nada visible debe ir ahí.
- **QR con bias hacia abajo**: el QR centra dentro del band sobrante pero con `QR_TOP_BIAS = 0.7` → 70% del aire sobrante queda arriba, 30% abajo. Visualmente queda más cerca de los iconos.
- **`drawCenteredSegments`**: helper que dibuja una línea centrada con segmentos de distinto font. Usado para mezclar regular + bold en "Plataforma **TRAZA** SaaS DPP".
- **No hay separador encima de los iconos** (se quitó por feedback).
- **GAP / BIG_GAP**: dos constantes (3 mm y 4 mm) — todos los espaciados verticales son múltiplos para mantener ritmo visual.
- **QR**: 1200 px de resolución, `errorCorrectionLevel: "M"`, `margin: 0` (el margen blanco se dibuja como un `drawRectangle` separado para conservar 22 mm netos).
- **Sin texto debajo del QR**: el subtítulo va arriba.

### 7.4 Pruebas locales

Script ad-hoc (no commiteado):
```js
import { buildLabelsPdf } from "./src/services/label-pdf.ts";
import { writeFileSync } from "node:fs";
const pdf = await buildLabelsPdf(
  [{ sgtinFull: "07750530110099/1", urlDppFull: "https://dpp.test/01/07750530110099/10/QWE-1/21/1" }],
  { size: "40x100", brandName: "MARCA TEST", logo: null }
);
writeFileSync("/tmp/etiqueta.pdf", pdf);
```
Correr: `cd apps/backend && npx tsx /tmp/test.mjs`.

---

## 8. Iconos de sostenibilidad

Ubicación: `apps/backend/src/assets/label-icons/`.

| Archivo | Símbolo |
|---|---|
| `trazabilidad.png` | Fábrica → flecha → caja |
| `circular.png` | 3 flechas circulares (reúso) |
| `carbono.png` | Pie + CO₂ |
| `agua.png` | Gotas |
| `no-toxico.png` | "NON TOXIC" + hojas |

### Optimización (script `scripts/optimize-label-icons.mjs`)

- **Resize** a 256 × 256 px (suficiente para 4 mm impresos a 300+ dpi).
- **Fondo claro → transparente**: pixel a pixel, lum > 215 = alpha 0, lum < 110 = negro opaco, en el medio = gradiente.
- **PNG con paleta indexada** (`palette: true`, `effort: 10`).
- Resultado: los 5 iconos pesan ~15 KB en total (vs ~3.85 MB de los originales).

Para re-procesar (ej. tras agregar un icono nuevo a la carpeta):
```bash
cd apps/backend
node scripts/optimize-label-icons.mjs
```

### Cargado en runtime

`label-pdf.ts` los lee con `readFileSync` resolviendo desde `import.meta.url`:
```ts
const ICONS_DIR = join(__dirname, "..", "assets", "label-icons");
```

Esto fuerza que los `.png` deben estar en `dist/src/assets/label-icons/` cuando corre `node dist/src/index.js` en prod. Ver [§ 9.2](#92-copy-assetsmjs).

---

## 9. Scripts de build y soporte

### 9.1 `scripts/optimize-label-icons.mjs`

Ver [§ 8](#optimización-script-scriptsoptimize-label-iconsmjs). Devdep: `sharp`.

### 9.2 `scripts/copy-assets.mjs`

Copia `src/assets/` → `dist/src/assets/` después de `tsc`. Necesario porque `tsc` solo emite `.js` — los binarios (PNGs) no se copian.

```json
"scripts": {
  "build": "tsc && node scripts/copy-assets.mjs"
}
```

**Síntoma si falta**: `ENOENT: no such file or directory, open '/usr/src/app/apps/backend/dist/src/assets/label-icons/trazabilidad.png'` y el backend crashea al startup.

---

## 10. Migraciones

### `20260522120000_od_label_head_per_size`

Cambio crítico de esta sesión. Convierte el modelo "1 cabecera por colorway" → "1 cabecera por (colorway × talla)".

```sql
DELETE FROM `OD_ORDER_LABEL_DETAIL`;
DELETE FROM `OD_ORDER_LABEL_HEAD`;

ALTER TABLE `OD_ORDER_LABEL_HEAD`
  ADD COLUMN `SIZE` VARCHAR(50) NULL AFTER `COD_GTIN`;

CREATE UNIQUE INDEX `uq_label_head_detail_size`
  ON `OD_ORDER_LABEL_HEAD` (`ID_DLK_ORDER_DETAIL`, `SIZE`);
```

⚠️ **Destructiva**: borra todas las cabeceras y detalles existentes. Aplicada en prod el 2026-05-22 con backup previo (`backup_prod_labels_20260522_231204.sql`).

---

## 11. Deploy

### Backend

Host: seenode (`web-300ixhl1vesu.up-de-fra1-k8s-1.apps.run-on-seenode.com`).
DB prod: MySQL en seenode (`up-de-fra1-mysql-2.db.run-on-seenode.com:11550`).

**Env vars críticos** del backend:
- `DATABASE_URL` — conexión MySQL prod
- `CORS_ORIGIN` — debe incluir el dominio del frontend de prod, **sin slash final**, separado por comas si hay varios. Si está vacío, el backend solo acepta `localhost:3000/3001` → CORS falla.

**Aplicar migración a prod** (manual desde local):
```bash
mysqldump -h <host> -P <port> -u <user> -p<pass> --no-tablespaces --skip-lock-tables \
  --set-gtid-purged=OFF --column-statistics=0 <db> \
  OD_ORDER_LABEL_HEAD OD_ORDER_LABEL_DETAIL > backup.sql

cd apps/backend
DATABASE_URL="mysql://..." npx prisma migrate deploy
DATABASE_URL="mysql://..." npx prisma migrate status   # debe mostrar Applied
```

Después de deploy, **reiniciar el servicio del backend** para que tome el cliente Prisma regenerado.

### Frontend

Host: seenode (`web-lidipx0p6r3r.up-de-fra1-k8s-1.apps.run-on-seenode.com`). Next.js, sin pasos de DB.

---

## 12. Pendientes / próximos pasos

1. **GTIN auto-computado** (discutido pero no implementado): generar `codGtin = modelo + color + talla` automáticamente — hoy el GTIN se ingresa manual por talla. Requiere decidir formato (separador, length, check digit GS1, etc.) y posiblemente expandir `codGtin` de `VARCHAR(14)` a `VARCHAR(50)`.
2. **Quitar una talla agregada manualmente**: hoy el modal solo agrega; para sacar una talla hay que editar el colorway y poner la cantidad en 0. Considerar acción de "quitar talla" en cada fila (solo si no tiene LabelHead).
3. **Endpoint PDF agrupado por colorway**: hoy es por talla individual o todas las de la orden. Si se necesita "PDF de un colorway entero", agregar `/api/order-heads/:id/details/:detailId/labels/pdf`.
4. **UI multi-talla bulk-create**: actualmente cada talla requiere un modal individual para crear su etiqueta. Podría haber un wizard "crear etiquetas para todas las tallas activas del colorway" que ahorre clicks.
5. **Validar que el GTIN sea único por marca**: hoy no hay validación. Si dos cabeceras comparten GTIN dentro de una orden, los rangos seriales se concatenan (puede ser intencional para misma referencia, pero conviene confirmarlo).
6. **Tests automáticos** de generación de PDF — comparar bytes o page count para no romper el layout silenciosamente.

---

## 13. Decisiones de diseño

- **Una cabecera por (colorway × talla)** en vez de "una por colorway con tallas adentro": permite GTIN y rango serial diferenciado por talla, alineado con prácticas GS1 (cada SKU = un GTIN).
- **Sin auto-compute de GTIN**: se descartó hasta tener especificación firme del formato (modelo+color+talla concatenado vs. GTIN-14 GS1 con prefijo y check digit).
- **Costura fija en 10 mm**: hardcoded en `topMargin`. Si la prenda usa otra altura de costura, hay que ajustarlo.
- **PDF de un solo tamaño (40 × 100)**: se eliminaron las opciones 25 × 50 y 40 × 50 anteriores. Si se necesita otra impresora con otro formato, agregar la key en `LABEL_SIZES` y revisar el layout (varios tamaños hardcoded en mm asumen 100 mm de alto).
- **Iconos optimizados al committeo**: los `.png` finales se commitean ya procesados — el script de optimización es solo para volver a generar si llega un icono nuevo. Esto evita tener que correr `sharp` en cada build de prod.
- **`copy-assets` corre en build, no en runtime**: más rápido al arrancar y evita errores de path en cold-start.
- **Migración destructiva consensuada**: borrar OD_ORDER_LABEL_HEAD/DETAIL fue OK porque los datos eran de pruebas; en una migración productiva real (con etiquetas ya impresas y en circulación), se debería hacer un split de los rangos serializados por talla en vez de borrar.
