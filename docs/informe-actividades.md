# Informe de Actividades — Plataforma REO

**Última actualización:** 2026-04-25
**Repositorio:** `fullStack_reo` · rama `main`
**Stack:** monorepo pnpm — `apps/backend` (Node + Prisma + MariaDB) · `apps/frontend` (Next.js 15) · `packages/ui`

---

## 1. Resumen ejecutivo

La plataforma REO está construyendo el módulo de **Orden de Pedido**, un flujo secuencial de 6 etapas que acompaña a cada orden desde su registro hasta su trazabilidad final. Sobre una base de configuración previa (cadena de producción, procesos, subprocesos, actividades, insumos), las últimas iteraciones se enfocaron en habilitar las dos primeras etapas del flujo (**Registro** y **Suministro**) y dejar preparada la base de datos para **Etiqueta**.

En la sesión actual (25-abr-2026) se cerró la transición automática **Suministro → Etiqueta** en backend, se ajustaron los filtros de las tablas para que cada etapa muestre únicamente las órdenes activas en ella, y se crearon en BD las 3 tablas que dan soporte a Etiqueta (`MD_DIGITAL_IDENTIFIER`, `OD_ORDER_LABEL_HEAD`, `OD_ORDER_LABEL_DETAIL`) con su reflejo correspondiente en el `schema.prisma`.

---

## 2. Línea de tiempo (commits relevantes)

| Fecha | Commit | Descripción |
|---|---|---|
| 2026-04-25 | `5b120a9` | **feat: avance** — transición Suministro→Etiqueta + filtros por etapa + 3 modelos Prisma nuevos (sesión actual) |
| 2026-04-23 | `2ee3615` | feat: avance |
| 2026-04-05 | `0bafd18` | feat: fix orden de pedido |
| 2026-04-05 | `bc48cd8` `1738fd3` `3ee6da2` | **feat: Orden de Pedido Registro** (alta inicial del módulo Registro) |
| 2026-03-31 | `d050c58` | fix: backend 503 |
| 2026-03-25 | `ffdbc26` | feat: migrations prisma |
| 2026-03-25 | `7fcf070` | feat: add avios materials y suppliers (módulo de insumos) |
| 2026-03-21 | `3694596` | feat: update modal for the configuration |
| 2026-03-17 | `ed6013a` | feat: diagrama general, actividades |
| 2026-03-16 | `1b374cf` `466d768` | feat: integracion de actividades |
| 2026-03-16 | `3f52de5` | editar y ver subproceso |
| 2026-03-13 | `2df1362` | feat: subproceso |
| 2026-03-11 | `a5824c6` | feat: add process management (CRUD routes, services, frontend UI) |
| 2026-03-07 | `eb59757` | fix: create tables (creación inicial de tablas en BD) |
| 2026-03-06 | `313f989` | first commit |

> Ver `git log --oneline` para el detalle completo.

---

## 3. Mapa de módulos del frontend

```
src/app/
├── configuracion/
│   ├── reo/                      → empresa matriz, marcas, sub-marcas
│   ├── cadena-produccion/        → configuración de cadenas
│   └── insumos/                  → avíos, materiales, proveedores
├── cadena-produccion/
│   ├── eslabon/                  → eslabones (nodos)
│   ├── proceso/                  → procesos
│   ├── subproceso/               → subprocesos
│   └── actividad/                → actividades
└── orden-pedido/                 → flujo principal (6 etapas)
    ├── registro/                 ✅ ETAPA 1 — operativa
    ├── suministro/               ✅ ETAPA 2 — operativa
    ├── etiqueta/                 ⚠️ ETAPA 3 — placeholder; BD lista
    ├── ruta/                     ❌ ETAPA 4 — solo diagrama React Flow
    ├── trazabilidad/             ❌ ETAPA 5 — pendiente
    └── lista-negra/              ❌ ETAPA 6 — pendiente
```

---

## 4. Flujo de Orden de Pedido (estado actual)

### 4.1 Diagrama del flujo

```mermaid
flowchart LR
    A[Registro<br/>stage=1] -- Concluido --> B[Suministro<br/>stage=2]
    B -- Concluido --> C[Etiqueta<br/>stage=3]
    C -- Concluido --> D[Ruta<br/>stage=4]
    D -- Concluido --> E[Trazabilidad<br/>stage=5]
    E -- Concluido --> F[Lista negra<br/>stage=6]

    style A fill:#bbf7d0,stroke:#15803d
    style B fill:#bbf7d0,stroke:#15803d
    style C fill:#fde68a,stroke:#a16207
    style D fill:#fecaca,stroke:#991b1b
    style E fill:#fecaca,stroke:#991b1b
    style F fill:#fecaca,stroke:#991b1b
```

Verde = operativo · Amarillo = BD lista, falta UI · Rojo = pendiente

### 4.2 Reglas del flujo (acordadas en esta sesión)

1. **Concluido = aprobación.** Al editar una orden y marcar `Concluido = Sí`, el backend la promueve automáticamente a la siguiente etapa.
2. **Cualquier usuario logueado puede aprobar.** No hay roles ni autorización extra (por ahora).
3. **El estado se reinicia al pasar de etapa.** La orden entra a la siguiente con `status = Iniciado`.
4. **Solo hacia adelante.** No hay devoluciones ni rechazos.
5. **Cada tabla muestra solo su etapa.** Una vez aprobada, la orden desaparece de la etapa anterior y aparece en la siguiente.

### 4.3 Modelo de datos en `OdOrderHead`

| Campo | Significado |
|---|---|
| `stageOrderHead` | Etapa actual: 1=Registro, 2=Suministro, 3=Etiqueta, 4=Ruta, 5=Trazabilidad, 6=Lista negra |
| `statusStageOrderHead` | Sub-estado dentro de la etapa: 1=Iniciado, 2=Concluido |
| `flgStatutActif` | Bandera global activo/inactivo (0/1) |

---

## 5. Cambios de la sesión actual (2026-04-25)

> Todo lo descrito a continuación fue commiteado en `5b120a9 feat: avance`.

### 5.1 Backend — transición Suministro → Etiqueta

**Archivo:** `apps/backend/src/services/order-head.service.ts`

Antes, `updateSuministro()` actualizaba archivos y status pero **no promovía** la orden a Etiqueta cuando se marcaba Concluido. Se añadió la regla análoga a la que ya existía para Registro:

```ts
// Regla de transición: al cerrar Suministro (status=2 "Concluido"),
// la orden pasa a Etiqueta (stage=3 + status=1 "Iniciado").
if (data.statusStageOrderHead === 2) {
  data.stageOrderHead = 3;
  data.statusStageOrderHead = 1;
}
```

### 5.2 Frontend — filtro por etapa actual en cada tabla

**Registro** (`apps/frontend/src/app/orden-pedido/registro/order-registro-client.tsx`):
La tabla de Registro mostraba **todas** las órdenes; ahora filtra `stageOrderHead === 1`. Las órdenes ya promovidas a Suministro desaparecen.

**Suministro** (`apps/frontend/src/app/orden-pedido/suministro/order-suministro-client.tsx`):
El filtro pasó de `stageOrderHead >= 2` a `stageOrderHead === 2`. Las órdenes promovidas a Etiqueta desaparecen.

### 5.3 Base de datos — 3 tablas nuevas para Etiqueta

Se ejecutaron 3 sentencias DDL en `reo_dev`:

```mermaid
erDiagram
    OD_ORDER_HEAD ||--o{ OD_ORDER_LABEL_HEAD : "fk_label_head_order"
    MD_DIGITAL_IDENTIFIER ||--o{ OD_ORDER_LABEL_HEAD : "fk_label_head_digital_master"
    OD_ORDER_LABEL_HEAD ||--o{ OD_ORDER_LABEL_DETAIL : "fk_label_detail_to_head"

    MD_DIGITAL_IDENTIFIER {
        int ID_DLK_DIGITAL_IDENTIFIER PK
        string COD_DIGITAL_IDENTIFIER UK
        string TYPE_DIGITAL_IDENTIFIER
        string MATERIAL_DIGITAL_IDENTIFIER
        string LOCATION_DIGITAL_IDENTIFIER
        string STANDARD_ISO_DIGITAL_IDENTIFIER
        string SUPPLIER_DIGITAL_IDENTIFIER
        string MODEL_DIGITAL_IDENTIFIER
        blob SPECIFICATION_DIGITAL_IDENTIFIER
    }
    OD_ORDER_LABEL_HEAD {
        int ID_DLK_ORDER_LABEL_HEAD PK
        int ID_DLK_ORDER_HEAD FK
        int ID_DLK_DIGITAL_IDENTIFIER FK
        string COD_ORDER_LABEL
        string COD_GTIN
        int INICIO_SERIALIZACION
        int FIN_SERIALIZACION
        int TOTAL_LABEL
        text SIGN_OPEN_RESPONSIBLE
        text SIGN_CLOSE_RESPONSIBLE
        string DIGITAL_CERTIFICATE_ID
    }
    OD_ORDER_LABEL_DETAIL {
        int ID_DLK_ORDER_LABEL_DETAIL PK
        int ID_DLK_ORDER_LABEL_HEAD FK
        int ITEM_GLOBAL
        int ITEM_BY_SIZE
        string SERIAL_NUMBER
        string SGTIN_FULL UK
        string URL_DPP_FULL
        bool IS_BLACKLISTED
    }
```

**Notas de implementación:**
- `prisma db pull` reescribió todo el schema cambiando `Int` por `Boolean` y quitando precisiones `DateTime(3)`. Se hizo rollback con `git checkout` y los 3 modelos se agregaron a mano respetando el estilo del proyecto (camelCase, `Int @db.TinyInt`, `@@map(...)`).
- Se agregó la relación inversa `labels OdOrderLabelHead[]` en `OdOrderHead`.
- `prisma validate` ✅ · `prisma generate` ✅ · `tsc --noEmit` (backend + frontend) ✅.

### 5.4 Capacidades CIRPASS-2 que habilita el modelo

Las nuevas tablas dejan listo el soporte para:
- **Pasaporte Digital de Producto (DPP)** vía sGTIN (GS1) por unidad física.
- **Firma digital** de apertura y cierre de orden (`SIGN_OPEN_RESPONSIBLE`, `SIGN_CLOSE_RESPONSIBLE`, `DIGITAL_CERTIFICATE_ID`).
- **Lista negra** (`IS_BLACKLISTED`) con razón de rechazo y auditor que validó.
- **Identificadores físicos** (QR / NFC / RFID) descritos en la tabla maestra.

---

## 6. Capturas (placeholders)

> Toma cada captura con tu herramienta preferida (Snipping Tool / ShareX / Flameshot) y guárdala con el nombre indicado dentro de `docs/img/`. El doc renderizará la imagen automáticamente.

### 6.1 Registro

![Registro — listado](./img/01-registro-tabla.png)

**Qué debe mostrar:** la tabla del listado de Orden de Pedido > Registro, con al menos 2 órdenes en `stage=1` visibles. Notar la columna **Estado** y los botones **Editar / Ver / Detalle**.

![Registro — modal de edición con Concluido](./img/02-registro-modal-concluido.png)

**Qué debe mostrar:** el modal de edición abierto, con el campo **Concluido** desplegado en `Sí`. Esa es la acción que dispara el paso a Suministro.

### 6.2 Suministro

![Suministro — listado](./img/03-suministro-tabla.png)

**Qué debe mostrar:** la misma orden recién aprobada en Registro, ahora visible en Orden de Pedido > Suministro con `Estado = Iniciado`.

![Suministro — modal con archivos UDP/PROD/FINAL](./img/04-suministro-modal-archivos.png)

**Qué debe mostrar:** el modal de Suministro con los 3 slots de archivo (UDP, PROD, FINAL) y sus fechas, además del selector **Concluido**.

### 6.3 Etiqueta (estado actual)

![Etiqueta — placeholder](./img/05-etiqueta-placeholder.png)

**Qué debe mostrar:** la pantalla actual "Módulo en construcción". Sirve para documentar el punto de partida antes de implementar la UI.

### 6.4 BD — verificación de tablas creadas

![DBeaver / phpMyAdmin — tablas nuevas](./img/06-bd-tablas-etiqueta.png)

**Qué debe mostrar:** un cliente de BD listando `MD_DIGITAL_IDENTIFIER`, `OD_ORDER_LABEL_HEAD`, `OD_ORDER_LABEL_DETAIL` dentro de `reo_dev`, idealmente con las FKs visibles.

---

## 7. Estado por etapa

| Etapa | Backend | Frontend | BD | Estado global |
|---|---|---|---|---|
| **1. Registro** | CRUD + transición a stage 2 | Tabla, alta, edición, detalle, ver | ✅ `OD_ORDER_HEAD` + `OD_ORDER_DETAIL` | ✅ **Operativa** |
| **2. Suministro** | CRUD archivos UDP/PROD/FINAL + transición a stage 3 (nuevo) | Tabla, modal de archivos, edición de status | ✅ campos en `OD_ORDER_HEAD` | ✅ **Operativa** |
| **3. Etiqueta** | ❌ Sin endpoints | ❌ Solo placeholder | ✅ 3 tablas + Prisma client (nuevo) | ⚠️ **BD lista, falta API y UI** |
| **4. Ruta** | ❌ | ⚠️ Solo diagrama React Flow sin datos | ⚠️ `MD_PRODUCTION_CHAIN` existe pero sin vínculo a la orden | ❌ **Pendiente** |
| **5. Trazabilidad** | ❌ | ❌ | ⚠️ `numPrecedenciaTrazabilidad` en `MD_PRODUCTION_CHAIN` | ❌ **Pendiente** |
| **6. Lista negra** | ❌ | ❌ | ⚠️ `IS_BLACKLISTED` en `OD_ORDER_LABEL_DETAIL` (vía Etiqueta) | ❌ **Pendiente** |

---

## 8. Próximos pasos sugeridos

### Etapa 3 — Etiqueta (siguiente bloque de trabajo)

1. **Frontend (lectura):** tabla en `/orden-pedido/etiqueta` filtrada por `stageOrderHead === 3` (solo lectura) para validar que las órdenes llegan correctamente desde Suministro.
2. **Backend:** endpoints CRUD para `OdOrderLabelHead`:
   - `GET /api/order-heads/:id/labels` (lista cabeceras de etiqueta de una orden)
   - `POST /api/order-heads/:id/labels` (crea cabecera con GTIN + identificador digital + serialización)
   - `PUT /api/order-heads/:id/labels/:labelId` (firma de apertura/cierre, status, etc.)
3. **Backend:** servicio que **genere los detalles serializados** a partir de `INICIO_SERIALIZACION`, `FIN_SERIALIZACION` y `TOTAL_LABEL` (sGTIN únicos por unidad física).
4. **Frontend:** modal/wizard para gestionar la cabecera de etiqueta y disparar la generación.
5. **Transición Etiqueta → Ruta:** misma regla en `updateLabel()` cuando `status = 2`.

### Mejoras transversales
- Definir si la firma digital se hace con un certificado guardado en backend o si se pide al usuario en el momento.
- Auditoría: aprovechar `COD_USUARIO_CARGA_DL` y `DES_ACCION` que ya están en todas las tablas.
- Decidir si se mantiene `MdOrdenPedido` (modelo legacy) o se elimina.

---

## 9. Cómo levantar el proyecto

```bash
# BD (MariaDB en Docker)
docker compose up -d mariadb

# Backend
cd apps/backend
pnpm install
npx prisma generate
pnpm dev

# Frontend
cd apps/frontend
pnpm dev
```

`DATABASE_URL` por defecto: `mysql://root:root@localhost:3306/reo_dev`.

---

*Documento generado a partir de la conversación de implementación del 2026-04-25 + `git log` del repositorio.*
