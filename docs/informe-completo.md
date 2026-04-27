# Informe Técnico Completo — Plataforma REO (TRAZA)

**Última actualización:** 2026-04-25
**Repositorio:** `fullStack_reo` · rama `main`
**Stack:** monorepo pnpm — `apps/backend` (Node + Express + Prisma + MariaDB) · `apps/frontend` (Next.js 15 App Router) · `packages/ui`

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Stack y arquitectura](#2-stack-y-arquitectura)
3. [Línea de tiempo del proyecto](#3-línea-de-tiempo-del-proyecto)
4. [Mapa de módulos del frontend](#4-mapa-de-módulos-del-frontend)
5. [Modelo de datos (schema Prisma)](#5-modelo-de-datos-schema-prisma)
   - 5.1 [Tablas LG_ — auditoría](#51-tablas-lg_--auditoría)
   - 5.2 [Tablas MD_ — maestros](#52-tablas-md_--maestros)
   - 5.3 [Tablas OD_ — operativas](#53-tablas-od_--operativas)
6. [Endpoints del backend (todos)](#6-endpoints-del-backend-todos)
7. [Servicios del backend](#7-servicios-del-backend)
8. [Flujo de Orden de Pedido (6 etapas)](#8-flujo-de-orden-de-pedido-6-etapas)
9. [Cambios de la última sesión (commit `5b120a9`)](#9-cambios-de-la-última-sesión-commit-5b120a9)
10. [Capacidades CIRPASS-2 / DPP](#10-capacidades-cirpass-2--dpp)
11. [Estado de implementación por módulo](#11-estado-de-implementación-por-módulo)
12. [Patrones de arquitectura](#12-patrones-de-arquitectura)
13. [Próximos pasos sugeridos](#13-próximos-pasos-sugeridos)
14. [Cómo levantar el proyecto](#14-cómo-levantar-el-proyecto)
15. [Capturas — placeholders](#15-capturas--placeholders)
16. [Anexo: pendientes y deuda técnica](#16-anexo-pendientes-y-deuda-técnica)

---

## 1. Resumen ejecutivo

REO (marca de producto: **TRAZA**) es una plataforma de **trazabilidad textil y Pasaporte Digital de Producto (DPP)** alineada con CIRPASS-2 / GS1. El objetivo es acompañar a una orden de producción desde su **registro** hasta el **etiquetado serializado** de cada prenda, pasando por **suministro de insumos**, **ruta productiva**, **trazabilidad** y, finalmente, **lista negra** para piezas defectuosas.

La base operativa ya cubre:
- Configuración completa de la organización (empresa matriz, marcas, sub-marcas, fábricas, maquilas, usuarios).
- Configuración de la cadena de producción jerárquica (eslabón → proceso → subproceso → actividad), incluyendo inputs, outputs y procedimientos en cada nivel.
- Gestión de insumos con carga masiva por Excel (proveedores, materiales, avíos).

El módulo principal — **Orden de Pedido** — está implementado en sus dos primeras etapas (Registro y Suministro). Las etapas 3-6 tienen UI placeholder; en esta sesión se dejó preparado en BD el soporte completo para la **Etapa 3 — Etiqueta** (3 tablas nuevas: `MD_DIGITAL_IDENTIFIER`, `OD_ORDER_LABEL_HEAD`, `OD_ORDER_LABEL_DETAIL`) y se cerraron las dos transiciones automáticas de estado entre etapas (Registro→Suministro y Suministro→Etiqueta).

---

## 2. Stack y arquitectura

```
fullStack_reo/                        (monorepo pnpm)
├── apps/
│   ├── backend/                      Express + Prisma + MariaDB
│   │   ├── prisma/schema.prisma      27+ modelos
│   │   ├── src/index.ts              entrypoint, healthcheck, ubigeo, /api/ordenes (legacy)
│   │   ├── src/routes/               1 archivo por dominio (~25 routers)
│   │   └── src/services/             1 service por dominio
│   └── frontend/                     Next.js 15 App Router + Tailwind
│       ├── src/app/                  rutas (configuracion, cadena-produccion, orden-pedido, ordenes)
│       ├── src/components/           Header, Sidebar, BulkUploadModal, UbigeoSelector
│       └── src/lib/                  api.ts, nav-items.ts
├── packages/ui/                      componentes compartidos (DataTable, Dialog, etc.)
├── docker-compose.yml                MariaDB 10.11 (puerto 3306, DB reo_dev)
└── pnpm-workspace.yaml
```

| Pieza | Detalle |
|---|---|
| **DB** | MariaDB 10.11 en Docker (`reo_dev`). DATABASE_URL: `mysql://root:root@localhost:3306/reo_dev`. |
| **ORM** | Prisma 7.4.2 con cliente generado en `apps/backend/generated/prisma`. |
| **API** | Express. Healthcheck `/health` con timeout de 8s a la BD. Middleware `json-bigint.ts` para IDs de 64 bits. |
| **Front** | Next.js 15 App Router. Cliente apunta a `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`). |
| **Tabla UI** | `@tanstack/react-table` envuelto por `DataTable` del paquete `@fullstack-reo/ui`. |
| **Diagramas** | `@xyflow/react` (React Flow) en eslabón, proceso, subproceso, actividad y ruta. |
| **Localización** | es-PE (fechas y números formateados con `.toLocaleDateString("es-PE")`). |

---

## 3. Línea de tiempo del proyecto

| Fecha | Commit | Descripción |
|---|---|---|
| 2026-04-25 | `5b120a9` | **feat: avance** — transición Suministro→Etiqueta + filtros por etapa + 3 modelos Prisma nuevos (sesión actual) |
| 2026-04-23 | `2ee3615` | feat: avance |
| 2026-04-05 | `0bafd18` | feat: fix orden de pedido |
| 2026-04-05 | `bc48cd8`, `1738fd3`, `3ee6da2` | **feat: Orden de Pedido Registro** (alta inicial del módulo Registro) |
| 2026-03-31 | `d050c58` | fix: backend 503 |
| 2026-03-25 | `ffdbc26` | feat: migrations prisma |
| 2026-03-25 | `7fcf070` | **feat: add avios materials y suppliers** (módulo de insumos completo) |
| 2026-03-21 | `3694596` | feat: update modal for the configuration |
| 2026-03-17 | `ed6013a` | feat: diagrama general, actividades |
| 2026-03-16 | `1b374cf`, `466d768` | feat: integracion de actividades |
| 2026-03-16 | `3f52de5` | editar y ver subproceso |
| 2026-03-13 | `2df1362` | feat: subproceso |
| 2026-03-11 | `a5824c6` | **feat: add process management** (CRUD de procesos) |
| 2026-03-07 | `eb59757` | fix: create tables (creación inicial de tablas en BD) |
| 2026-03-06 | `313f989` | first commit |

---

## 4. Mapa de módulos del frontend

```
apps/frontend/src/app/
├── page.tsx                                          (Inicio "TRAZA")
├── layout.tsx
├── configuracion/
│   ├── reo/
│   │   ├── empresa/                                  ✅ Empresa matriz (MdParentCompany)
│   │   ├── marca/                                    ✅ Marcas (MdBrand)
│   │   ├── submarca/                                 ✅ Submarcas (MdSubbrand)
│   │   ├── usuario/                                  ✅ Usuarios (MdUserReo)
│   │   ├── fabrica/                                  ✅ Fábricas propias (MdFacility)
│   │   ├── maquila/                                  ✅ Maquilas (MdMaquila)
│   │   └── fabrica-maquila/                          ✅ Plantas de maquila (MdFacilityMaquila)
│   ├── cadena-produccion/                            (configuración macro de cadenas)
│   └── insumos/
│       ├── proveedores/                              ✅ Proveedores (MdSupplier)
│       ├── materiales/                               ✅ + carga masiva Excel (MdMaterial)
│       └── avios/                                    ✅ + carga masiva Excel (MdAvio)
├── cadena-produccion/
│   ├── eslabon/                                      ✅ + diagrama React Flow (MdProductionChain)
│   ├── proceso/                                      ✅ + inputs/outputs/procedures + diagramas
│   ├── subproceso/                                   ✅ + inputs/outputs/procedures + diagramas
│   └── actividad/                                    ✅ + inputs/outputs/procedures + diagrama general
├── orden-pedido/                                     (flujo principal, 6 etapas)
│   ├── registro/                                     ✅ ETAPA 1 — operativa
│   │   └── [id]/detalle/                             ✅ wizard de 6 pasos (1-2 inline, 3-6 navegan)
│   ├── suministro/                                   ✅ ETAPA 2 — operativa
│   ├── etiqueta/                                     ⚠️ ETAPA 3 — placeholder; BD lista
│   ├── ruta/                                         ⚠️ ETAPA 4 — diagrama con datos mock
│   ├── trazabilidad/                                 ❌ ETAPA 5 — placeholder
│   ├── lista-negra/                                  ❌ ETAPA 6 — placeholder
│   └── _components/
└── ordenes/                                          ✅ alias de Registro (reusa OrderRegistroClient)
```

> Leyenda: ✅ operativo · ⚠️ parcial · ❌ pendiente

---

## 5. Modelo de datos (schema Prisma)

Convención general:
- **Prefijo `LG_`** → tablas de log/auditoría.
- **Prefijo `MD_`** → maestros (datos relativamente estables).
- **Prefijo `OD_`** → operativas (transaccionales, ciclo de vida corto).
- Todas las tablas tienen columnas estándar de auditoría: `codUsuarioCargaDl`, `fehProcesoCargaDl`, `fehProcesoModifDl`, `desAccion`, `flgStatutActif`.
- **Soft delete**: ningún `DELETE` físico. Se setea `flgStatutActif=0`.

### 5.1 Tablas LG_ — auditoría

| Tabla | Modelo | Propósito |
|---|---|---|
| `LG_USER_ACCESS` | `LgUserAccess` | Auditoría de accesos: IP, browser, OS, geolocalización, estado de login. PK BigInt. |
| `LG_PARENT_COMPANY` | `LgParentCompany` | Auditoría de cambios en empresas matrices. Snapshot completo por cambio + `typeOperation` (INSERT/UPDATE/DELETE). |

### 5.2 Tablas MD_ — maestros

#### Organización

| Tabla | Modelo | Campos clave | Relaciones |
|---|---|---|---|
| `MD_PARENT_COMPANY` | `MdParentCompany` | `codParentCompany` (UK), `numRucParentCompany` (UK), `typeParentCompany` (1=Marca Propia, 2=Maquila, 3=Híbrido, 4=Comercializadora), `codGlnParentCompany`, `logoParentCompany` (Bytes) | brands, facilities, processes, users, ordenes (legacy), maquilaRelations |
| `MD_BRAND` | `MdBrand` | `codBrand` (UK), `nameBrand`, social media, `logoBrand` | parentCompany, subbrands, orderHeads |
| `MD_SUBBRAND` | `MdSubbrand` | `codSubbrand` (UK), social media, `logoSubbrand` | brand |
| `MD_FACILITY` | `MdFacility` | `codFacility` (UK), `codGlnFacility`, `gpsLocationFacility` | parentCompany |
| `MD_MAQUILA` | `MdMaquila` | `codMaquila` (UK), `numRucMaquila`, `categoryMaquila`, `canisterDataMaquila` (IPFS/blockchain) | facilities, parentCompanies |
| `MD_FACILITY_MAQUILA` | `MdFacilityMaquila` | `codFacilityMaquila` (UK), `codGln` | maquila |
| `MD_PARENT_COMPANY_MAQUILA` | `MdParentCompanyMaquila` | join M:M (`codParentCompany` + `codMaquila`) | parentCompany, maquila |
| `MD_USER_REO` | `MdUserReo` | `codUserReo` (UK), `userLogin` (UK), `password` (hash), `failedAttempts`, `isLocked`, `twoFactorSecret`, `lastLoginIp` | parentCompany, accessLogs |
| `MD_UBIGEO` | `MdUbigeo` | `codUbigeo` (6 dígitos Perú), `desDepartamento`, `desProvincia`, `desDistrito` | — (~1.9k filas semilla) |

#### Insumos

| Tabla | Modelo | Campos clave |
|---|---|---|
| `MD_SUPPLIER` | `MdSupplier` | `nameSupplier`, `rucSupplier`, `typeSupplier` (1=Fibra, 2=Hilado, 3=Tela, 4=Químico, 5=Servicios, 6=Otro), `ubigeoSupplier` |
| `MD_MATERIAL` | `MdMaterial` | Composición + sostenibilidad: `recycled`, `percentageRecycledMaterials`, `renewableMaterial`, `percentageRenewableMaterial`, `typeDyes`, `dyeClass`, `finishes`, `certification` (GOTS, Fair Trade, ISO14001…) |
| `MD_AVIO` | `MdAvio` | `typeAvio` (botón, cremallera, etiqueta, cinta, hilo…), `materialAvio`, `weight`, `unitMeasurement`, `recycled`, `certificates` |

#### Cadena de producción

```
MdProductionChain (eslabón)
   └── MdProcess
        ├── MdInputProcess / MdOutputProcess / MdProcedureProcess
        └── MdSubprocess
             ├── MdInputSubprocess / MdOutputSubprocess / MdProcedureSubprocess
             └── MdActivities
                  └── MdInputActivities / MdOutputActivities / MdProcedureActivities
```

| Tabla | Modelo | Notas |
|---|---|---|
| `MD_PRODUCTION_CHAIN` | `MdProductionChain` | `codProductionChain` (UK), `numPrecedenciaTrazabilidad`, `numPrecedenciaProductiva` |
| `MD_PROCESS` | `MdProcess` | `criticalityProcess`, `outsourcedProcess`, `processCertification`, `ordenPrecedenciaProcess` |
| `MD_SUBPROCESS` | `MdSubprocess` | similar a Process pero un nivel abajo |
| `MD_ACTIVITIES` | `MdActivities` | `typeActivities`, `machineRequired`, `skillRequired`, `checklistActivities` |
| `MD_INPUT_*` | `MdInput{Process,Subprocess,Activities}` | tipos de entrada con cantidad, fuente, certificación |
| `MD_OUTPUT_*` | `MdOutput{Process,Subprocess,Activities}` | tipos de salida con destino, calidad, certificación |
| `MD_PROCEDURE_*` | `MdProcedure{Process,Subprocess,Activities}` | protocolo: `pcc` (Punto Crítico de Control), `safetyRequirement`, `validationMethod` |

#### Identificadores digitales (nuevo, sesión actual)

| Tabla | Modelo | Campos clave | Relaciones |
|---|---|---|---|
| `MD_DIGITAL_IDENTIFIER` | `MdDigitalIdentifier` | `codDigitalIdentifier` (UK), `typeDigitalIdentifier` (QR/NFC/RFID), `materialDigitalIdentifier`, `locationDigitalIdentifier`, `standardIsoDigitalIdentifier`, `specificationDigitalIdentifier` (Bytes) | labelHeads (`OdOrderLabelHead[]`) |

#### Legacy

| Tabla | Modelo | Estado |
|---|---|---|
| `MD_ORDEN_PEDIDO` | `MdOrdenPedido` | **DEPRECATED**. Modelo antiguo. El sistema actual usa `OD_ORDER_HEAD`. Coexisten por compatibilidad histórica. |

### 5.3 Tablas OD_ — operativas

```mermaid
erDiagram
    MD_BRAND ||--o{ OD_ORDER_HEAD : "fk_order_head_brand"
    OD_ORDER_HEAD ||--o{ OD_ORDER_DETAIL : "fk_detail_order_head"
    OD_ORDER_HEAD ||--o{ OD_ORDER_LABEL_HEAD : "fk_label_head_order"
    MD_DIGITAL_IDENTIFIER ||--o{ OD_ORDER_LABEL_HEAD : "fk_label_head_digital_master"
    OD_ORDER_LABEL_HEAD ||--o{ OD_ORDER_LABEL_DETAIL : "fk_label_detail_to_head"
```

#### `OD_ORDER_HEAD` (cabecera de orden)

| Grupo | Campos |
|---|---|
| Identificación | `codOrderHead` (VARCHAR 100), `idDlkBrand` (FK → MdBrand) |
| Producción | `quantityOrderHead`, `fecEntry` (DATE), `dateProbableDespatch` (DATE) |
| Etapas del flujo | `stageOrderHead` (1-6), `statusStageOrderHead` (1=Iniciado, 2=Concluido) |
| Archivo principal | `fileOrderHead` (MediumBlob) |
| Archivos de Suministro | `fileSuppliesUdp/Prod/Final` + sus `feh*` (Date) |
| Auditoría | `stateOrderHead`, `flgStatutActif`, etc. |

**Reglas de negocio embebidas en `OrderHeadService`:**
1. Si `stageOrderHead=1` y `statusStageOrderHead=2` (Concluido) → automáticamente pasa a `stage=2, status=1`.
2. Si `stageOrderHead=2` y `statusStageOrderHead=2` → automáticamente pasa a `stage=3, status=1`.
3. Al crear, si el archivo adjunto es Excel, se parsea y se generan automáticamente filas en `OD_ORDER_DETAIL` (transacción).

#### `OD_ORDER_DETAIL` (líneas de la orden)

- Cabecera: FK `idDlkOrderHead`. Cada detalle es un **estilo/SKU**.
- Identificación: `codOrderDetail`, `codEstilo` (inmutables tras creación), `nomEstilo`, `imgEstilo` (Bytes).
- Especificación de tela: `desTela`, `colorAway`, `fondoTela`, `versionTela`.
- Cantidades por talla: `size0_3`, `size3_6`, `size0_6`, `size6_12`, `size12_18`, `size2`–`size16`, `sizeS`–`sizeXxl`. Total: `totalEstilo` (map: `TOTAL_ORDER_PRODUCTION`).
- Archivo: `supplyFile` (MediumBlob, BOM individual).

#### `OD_ORDER_LABEL_HEAD` (cabecera de etiquetas — DPP, **nuevo**)

| Grupo | Campos |
|---|---|
| FKs | `idDlkOrderHead` (→ OdOrderHead), `idDlkDigitalIdentifier` (→ MdDigitalIdentifier) |
| Estilo | `codEstilo`, `nameEstilo`, `descriptionEstilo`, `genderEstilo`, `seasonEstilo` |
| Comercio | `codGtin` (GS1 GTIN-14) |
| Identificador físico | `identifierType`, `identifierMaterial`, `identifierLocation` |
| Serialización | `inicioSerializacion`, `finSerializacion`, `totalLabel` |
| Firmas digitales | `signOpenResponsible` + `fehSignOpen`, `signCloseResponsible` + `fehSignClose`, `digitalCertificateId` |

#### `OD_ORDER_LABEL_DETAIL` (unidad serializada — **nuevo**)

| Grupo | Campos |
|---|---|
| Ordenamiento | `itemGlobal`, `itemBySize` |
| Identidad inmutable | `serialNumber` (GS1 AI 21), `sgtinFull` (UK, idx_sgtin_unique), `urlDppFull` |
| Atributos prenda | `color`, `print`, `size` |
| Control de calidad | `isBlacklisted` (TinyInt), `reasonBlacklist`, `codUsuarioAuditor` |

---

## 6. Endpoints del backend (todos)

> Base URL: `http://localhost:4000`

### Salud y utilidad

| Método | Path | Archivo | Descripción |
|---|---|---|---|
| GET | `/health/live` | `index.ts:111` | Healthcheck sin BD |
| GET | `/health` | `index.ts:117` | Healthcheck con conexión a MariaDB (timeout 8s) |
| GET | `/api/ubigeo` | `index.ts:207` | Maestro de ubigeos del Perú (~1.9k filas), soporta `?limit=N` o `?limit=all` |

### Órdenes legacy (`MD_ORDEN_PEDIDO`)

> Estas rutas siguen activas pero el sistema moderno usa `/api/order-heads`.

| Método | Path | Archivo |
|---|---|---|
| GET | `/api/ordenes` | `index.ts:234` |
| GET | `/api/ordenes/:id` | `index.ts:249` |
| POST | `/api/ordenes` | `index.ts:264` |
| PUT | `/api/ordenes/:id` | `index.ts:297` |
| DELETE | `/api/ordenes/:id` | `index.ts:322` |

### Empresa, marcas, instalaciones, usuarios

Cada router expone CRUD completo (`GET list`, `GET :id`, `POST`, `PUT`, `DELETE` soft):

| Router | Rutas base | Service |
|---|---|---|
| `parent-company.routes.ts` | `/api/parent-companies` | `ParentCompanyService` |
| `brand.routes.ts` | `/api/brands` | `BrandService` |
| `subbrand.routes.ts` | `/api/subbrands` | `SubbrandService` |
| `facility.routes.ts` | `/api/facilities` | `FacilityService` |
| `maquila.routes.ts` | `/api/maquilas` | `MaquilaService` |
| `facility-maquila.routes.ts` | `/api/facilities-maquila` | `FacilityMaquilaService` |
| `user-reo.routes.ts` | `/api/users` | `UserReoService` |

### Insumos

| Router | Rutas base | Notas |
|---|---|---|
| `supplier.routes.ts` | `/api/suppliers` | CRUD estándar |
| `material.routes.ts` | `/api/materials` | CRUD + `GET /api/materials/template/download` + `POST /api/materials/bulk-upload` (Excel base64) |
| `avios.routes.ts` | `/api/avios` | CRUD + `GET /api/avios/template/download` + `POST /api/avios/bulk-upload` (Excel base64) |

### Cadena de producción (jerárquica)

| Router | Rutas base |
|---|---|
| `production-chain.routes.ts` | `/api/production-chains` |
| `process.routes.ts` | `/api/processes` |
| `subprocess.routes.ts` | `/api/subprocesses` |
| `activity.routes.ts` | `/api/activities` |

### Inputs / Outputs / Procedures (por nivel)

Estructura uniforme. CRUD + `listByXxx`:

| Router | Rutas base | Filtro |
|---|---|---|
| `input-process.routes.ts` | `/api/input-processes` | `?processId=N` |
| `output-process.routes.ts` | `/api/output-processes` | `?processId=N` |
| `procedure-process.routes.ts` | `/api/procedure-processes` | `?processId=N` |
| `input-subprocess.routes.ts` | `/api/input-subprocesses` | `?subprocessId=N` (obligatorio) |
| `output-subprocess.routes.ts` | `/api/output-subprocesses` | `?subprocessId=N` (obligatorio) |
| `procedure-subprocess.routes.ts` | `/api/procedure-subprocesses` | `?subprocessId=N` (obligatorio) |
| `input-activities.routes.ts` | `/api/input-activities` | `?activityId=N` (obligatorio) |
| `output-activities.routes.ts` | `/api/output-activities` | `?activityId=N` (obligatorio) |
| `procedure-activities.routes.ts` | `/api/procedure-activities` | `?activityId=N` (obligatorio) |

### Orden de pedido (flujo principal — `OD_ORDER_HEAD`)

| Método | Path | Descripción |
|---|---|---|
| GET | `/api/order-heads` | Lista (filtro opcional `?stage=N`) |
| GET | `/api/order-heads/:id` | Cabecera con flags de archivos presentes |
| GET | `/api/order-heads/:id/file` | Descarga `FILE_ORDER_HEAD` |
| GET | `/api/order-heads/:id/details` | Lista detalles (líneas) |
| GET | `/api/order-heads/:id/details/:detailId/image` | Descarga `IMG_ESTILO` con Content-Type detectado |
| POST | `/api/order-heads` | Crea + parsea Excel automáticamente si está adjunto |
| PUT | `/api/order-heads/:id` | Actualiza (aplica regla `stage=1+status=2 → stage=2+status=1`) |
| PUT | `/api/order-heads/:id/details/:detailId` | Actualiza detalle (`codOrderDetail`, `codEstilo` inmutables) |
| GET | `/api/order-heads/:id/suministro/file/:kind` | Descarga archivo UDP/PROD/FINAL |
| PUT | `/api/order-heads/:id/suministro` | Actualiza archivos + status (aplica regla `status=2 → stage=3+status=1`) |

---

## 7. Servicios del backend

Todos los services se construyen con `new XxxService(prisma)` y exponen el patrón uniforme:
- `list()`
- `getById(id)`
- `create(body)`
- `update(id, body)`
- `softDelete(id)`

### Casos especiales

#### `OrderHeadService` (crítico)

Archivo: `apps/backend/src/services/order-head.service.ts`.

- `list(filter?: {stage?: number})` — filtrado opcional por etapa.
- `getById(id)` — incluye flags booleanos de archivos presentes.
- `getArchivo(id)`, `getDetailImage(headId, detailId)`, `getSuministroFile(id, kind)` — descarga de blobs con Content-Type adecuado.
- `listDetailsByHeadId(headId)` — devuelve `null` si la cabecera no existe.
- `create(body)` — **crea cabecera + parsea Excel adjunto + crea detalles en transacción**. Generación automática de `codOrderDetail = {codOrderHead}-{n}`. Apoyado por `order-excel-parser.ts` y `order-excel-images.ts`.
- `update(id, body)` — **regla 1**: si al guardar `stage=1` y `status=2`, fuerza `stage=2, status=1` (líneas 431-457).
- `updateDetail(headId, detailId, body)` — `codOrderDetail` y `codEstilo` son inmutables.
- `updateSuministro(id, body)` — actualiza UDP/PROD/FINAL + sub-estado. **Regla 2** (nueva): si `status=2`, fuerza `stage=3, status=1` (líneas 665-670).

#### `MaterialService` y `AviosService`

- `buildTemplate()` — genera Excel vacío para descarga.
- `bulkCreate(fileBase64)` — parsea Excel y crea múltiples registros con reporte de errores.

#### Servicios `Input/Output/Procedure` por nivel

- Suman `listByProcess(id)` / `listBySubprocess(id)` / `listByActivity(id)` al CRUD estándar.

### Helpers

- `apps/backend/src/services/order-excel-parser.ts` — parsea Excel de órdenes (líneas, cantidades por talla).
- `apps/backend/src/services/order-excel-images.ts` — extrae imágenes embebidas en Excel.
- `apps/backend/src/middleware/json-bigint.ts` — serializa BigInt en JSON (necesario para `LG_USER_ACCESS.idLogAccess`).

---

## 8. Flujo de Orden de Pedido (6 etapas)

### 8.1 Diagrama del flujo

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

### 8.2 Reglas de transición (acordadas)

1. **Concluido = aprobación.** Marcar `Concluido = Sí` en la edición dispara la promoción automática a la siguiente etapa.
2. **Cualquier usuario logueado puede aprobar.** No hay roles/autorización extra (por ahora).
3. **El sub-estado se reinicia.** La orden entra a la siguiente etapa con `status = Iniciado`.
4. **Solo hacia adelante.** No hay devoluciones ni rechazos.
5. **Cada tabla muestra solo su etapa.** Filtrado por `stageOrderHead === N`.

### 8.3 Etapas

#### Etapa 1 — Registro (`stage=1`) ✅

- **Frontend**: `/orden-pedido/registro` con tabla, alta, edición, ver, detalle.
- **Detalle (wizard)**: `/orden-pedido/registro/[id]/detalle?step=N`. Pasos 1-2 inline; 3-6 redirigen.
- **Tabla columnas**: Orden pedido, Empresa (marca), Cantidad, Fecha ingreso, Probable despacho, Etapa, **Estado** (con selector Concluido), Acciones.
- **Modales**: `OrderHeadModal` (crear/editar), `OrderHeadVerModal` (ver), `OrderHeadDetalleModal` (acceso al detalle).
- **Filtro de tabla**: `stageOrderHead === 1` (sesión actual).

#### Etapa 2 — Suministro (`stage=2`) ✅

- **Frontend**: `/orden-pedido/suministro`.
- **Modelo de archivo**: 3 archivos por orden (UDP, PROD, FINAL) con sus fechas. Adicionalmente cada `OdOrderDetail` puede tener su propio `supplyFile`.
- **Vista inline en wizard**: `SuministroStepView` muestra columnas especiales con previsualizaciones.
- **Filtro de tabla**: `stageOrderHead === 2` (sesión actual).
- **Sub-estados**: `1=Sin Iniciar`, `2=Iniciado`, `3=Concluido` (definido en `constants.ts` del módulo Suministro — nota: el campo `statusStageOrderHead` solo usa 1/2 en backend; la UI muestra una etiqueta enriquecida).

#### Etapa 3 — Etiqueta (`stage=3`) ⚠️

- **Frontend**: placeholder ("Módulo en construcción").
- **BD**: ✅ tablas creadas en sesión actual (ver §9).
- **Backend**: ❌ aún sin endpoints.

#### Etapa 4 — Ruta (`stage=4`) ⚠️

- **Frontend**: diagrama React Flow con nodos demo (`Origen`, `Proceso`, `Destino`), aristas animadas, controles. **Datos hardcodeados**, sin conexión a órdenes específicas.
- **BD**: `MD_PRODUCTION_CHAIN` existe con `numPrecedenciaTrazabilidad` y `numPrecedenciaProductiva`, pero no hay vínculo a órdenes.
- **Backend**: ❌.

#### Etapa 5 — Trazabilidad (`stage=5`) ❌

Placeholder.

#### Etapa 6 — Lista negra (`stage=6`) ❌

Placeholder. La columna `IS_BLACKLISTED` ya existe en `OD_ORDER_LABEL_DETAIL` (Etapa 3).

---

## 9. Cambios de la última sesión (commit `5b120a9`)

> Fecha: 2026-04-25. Working tree limpio.

### 9.1 Backend — transición Suministro → Etiqueta

**Archivo:** `apps/backend/src/services/order-head.service.ts:664-668`

Antes, `updateSuministro()` actualizaba archivos y status pero no promovía la orden. Se agregó la regla análoga a la de Registro:

```ts
// Regla de transición: al cerrar Suministro (status=2 "Concluido"),
// la orden pasa a Etiqueta (stage=3 + status=1 "Iniciado").
if (data.statusStageOrderHead === 2) {
  data.stageOrderHead = 3;
  data.statusStageOrderHead = 1;
}
```

### 9.2 Frontend — filtro por etapa actual

| Archivo | Cambio |
|---|---|
| `apps/frontend/src/app/orden-pedido/registro/order-registro-client.tsx:42` | La tabla filtra ahora `stageOrderHead === 1`. Las órdenes promovidas desaparecen. |
| `apps/frontend/src/app/orden-pedido/suministro/order-suministro-client.tsx:42` | Cambió de `>= 2` a `=== 2`. Las concluidas pasan a Etiqueta y dejan de aparecer aquí. |

### 9.3 BD — 3 tablas nuevas para Etiqueta

Se ejecutaron 3 sentencias DDL en `reo_dev`, en este orden por dependencias:

1. `MD_DIGITAL_IDENTIFIER` — maestro de identificadores digitales (QR/NFC/RFID).
2. `OD_ORDER_LABEL_HEAD` — cabecera de orden de etiquetas (FK a `OD_ORDER_HEAD` y a `MD_DIGITAL_IDENTIFIER`).
3. `OD_ORDER_LABEL_DETAIL` — unidades serializadas (FK a `OD_ORDER_LABEL_HEAD`).

ER de las nuevas tablas:

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

### 9.4 Schema Prisma

`prisma db pull` reescribió todo el schema (cambió `Int` por `Boolean` en TINYINT(1) y removió precisiones `@db.DateTime(3)`). Se hizo rollback con `git checkout` y se agregaron los 3 modelos a mano respetando el estilo del proyecto:

- camelCase (`MdDigitalIdentifier`, `OdOrderLabelHead`, `OdOrderLabelDetail`).
- `Int @db.TinyInt @default(1)` para flags 0/1 (consistente con el resto).
- `@db.DateTime(3)` donde el DDL lo definió.
- `@@map(...)` apuntando al nombre de tabla original.
- Relación inversa `labels OdOrderLabelHead[]` agregada en `OdOrderHead`.

Verificaciones: `prisma validate` ✅ · `prisma generate` ✅ · `tsc --noEmit` (backend + frontend) ✅.

---

## 10. Capacidades CIRPASS-2 / DPP

Las nuevas tablas de Etiqueta dejan listo el soporte para **Pasaporte Digital de Producto** alineado con el estándar CIRPASS-2 / GS1:

| Capacidad | Implementación en BD |
|---|---|
| **DPP por unidad física** | `OD_ORDER_LABEL_DETAIL.sgtinFull` (UK) + `urlDppFull`. Cada prenda tiene una identidad digital única. |
| **GTIN del producto** | `OD_ORDER_LABEL_HEAD.codGtin` (VARCHAR 14, GS1 GTIN-14). |
| **Serialización GS1 AI(21)** | `OD_ORDER_LABEL_DETAIL.serialNumber` + `inicioSerializacion` / `finSerializacion` en la cabecera. |
| **Identificador físico** | `MD_DIGITAL_IDENTIFIER` describe QR/NFC/RFID, material, ubicación, ISO aplicado. |
| **Firmas digitales** | `signOpenResponsible` (apertura del lote) + `signCloseResponsible` (cierre) + `digitalCertificateId`. |
| **Lista negra de calidad** | `OD_ORDER_LABEL_DETAIL.isBlacklisted` + `reasonBlacklist` + `codUsuarioAuditor`. |
| **Sostenibilidad** | `MD_MATERIAL` y `MD_AVIO` registran `recycled`, `percentageRecycledMaterials`, `renewableMaterial`, `certification` (GOTS, Fair Trade, ISO14001). |
| **Trazabilidad de cadena** | `MD_PRODUCTION_CHAIN.numPrecedenciaTrazabilidad`. |

---

## 11. Estado de implementación por módulo

| Módulo | Backend | Frontend | BD | Estado |
|---|---|---|---|---|
| Inicio | — | ✅ | — | ✅ |
| Configuración → Empresa | ✅ | ✅ | ✅ | ✅ |
| Configuración → Marca | ✅ | ✅ | ✅ | ✅ |
| Configuración → Submarca | ✅ | ✅ | ✅ | ✅ |
| Configuración → Usuario | ✅ | ✅ | ✅ | ✅ |
| Configuración → Fábrica | ✅ | ✅ | ✅ | ✅ |
| Configuración → Maquila | ✅ | ✅ | ✅ | ✅ |
| Configuración → Fábrica-Maquila | ✅ | ✅ | ✅ | ✅ |
| Insumos → Proveedores | ✅ | ✅ | ✅ | ✅ |
| Insumos → Materiales | ✅ + bulk Excel | ✅ + bulk | ✅ | ✅ |
| Insumos → Avíos | ✅ + bulk Excel | ✅ + bulk | ✅ | ✅ |
| Cadena → Eslabón | ✅ | ✅ + diagrama | ✅ | ✅ |
| Cadena → Proceso | ✅ + IO/Procedure | ✅ + diagramas + modales anidados | ✅ | ✅ |
| Cadena → Subproceso | ✅ + IO/Procedure | ✅ + diagramas | ✅ | ✅ |
| Cadena → Actividad | ✅ + IO/Procedure | ✅ + diagrama general | ✅ | ✅ |
| Orden → **Registro** | ✅ + Excel parser + transición a stage 2 | ✅ tabla + modales + wizard detalle | ✅ | ✅ |
| Orden → **Suministro** | ✅ + transición a stage 3 (nuevo) | ✅ tabla + modal de archivos | ✅ | ✅ |
| Orden → **Etiqueta** | ❌ sin endpoints | ❌ placeholder | ✅ 3 tablas + Prisma client (nuevo) | ⚠️ |
| Orden → Ruta | ❌ | ⚠️ React Flow con datos mock | ⚠️ | ❌ |
| Orden → Trazabilidad | ❌ | ❌ | ⚠️ | ❌ |
| Orden → Lista negra | ❌ | ❌ | ⚠️ vía OD_ORDER_LABEL_DETAIL | ❌ |
| Órdenes (raíz) | ✅ (reusa order-heads) | ✅ alias de Registro | ✅ | ✅ |

---

## 12. Patrones de arquitectura

### 12.1 Frontend — Client Component + Modal Dialog

```
page.tsx (server)
  └─ <XxxClient/> (client)
        ├─ <DataTable/> (de @fullstack-reo/ui)
        ├─ useState modal state (create/edit/view)
        └─ <XxxModal/> + <XxxVerModal/> + <XxxDetalleModal/>
```

### 12.2 Estado de modales

```ts
type ModalState = { open: boolean; mode: "create" | "edit" | "view"; entity: T | null };
useEffect(() => {
  if (!open) return;
  if (mode === "create") setForm(emptyForm);
  else if (mode === "edit" && entity) setForm(hydrateFromEntity(entity));
}, [open, mode, entity]);
```

### 12.3 Subida de archivos

Los modales convierten archivos a base64 con `FileReader.readAsDataURL(file)` antes de enviar al backend en el body. El backend lo decodifica con `Buffer.from(raw, "base64")` y lo persiste como `Bytes` / `MediumBlob`.

### 12.4 Constantes localizadas

Cada módulo expone su `constants.ts` con enums mapeados a strings es-PE, helpers como `concluidoToStatus(0|1) → 1|2` y opciones para selects (`SI_NO`, `ACTIVO_OPTIONS`, `ORDER_HEAD_STAGES`, `ORDER_HEAD_STATUS`, `SUMINISTRO_STATUS`).

### 12.5 Diagramas con React Flow

Patrón uniforme con `Background`, `Controls`, `MiniMap`, `Handle`, `Position`. Usado en: Eslabón, Proceso, Subproceso, Actividad, Ruta. Cada uno define `nodeTypes` propios.

### 12.6 Backend — service por dominio

- 1 `*.routes.ts` que valida payloads y devuelve 400/404/500.
- 1 `*.service.ts` que recibe el cliente Prisma y encapsula la lógica.
- Soft delete uniforme (`flgStatutActif=0`).

---

## 13. Próximos pasos sugeridos

### 13.1 Etapa 3 — Etiqueta (siguiente bloque)

1. **Frontend (lectura):** tabla en `/orden-pedido/etiqueta` filtrada por `stageOrderHead === 3` (solo lectura) para validar la llegada desde Suministro.
2. **Backend:** endpoints CRUD para `OdOrderLabelHead`:
   - `GET /api/order-heads/:id/labels`
   - `POST /api/order-heads/:id/labels`
   - `PUT /api/order-heads/:id/labels/:labelId`
3. **Backend:** servicio que **genere los detalles serializados** automáticamente a partir de `INICIO_SERIALIZACION`, `FIN_SERIALIZACION` y `TOTAL_LABEL`. Cada detalle tendrá su `sgtinFull` y `urlDppFull` calculados.
4. **Frontend:** wizard/modal para gestionar la cabecera (GTIN + identificador digital + serialización + firma de apertura).
5. **Transición Etiqueta → Ruta:** misma regla en `updateLabel()` cuando `status=2`.

### 13.2 Bloques posteriores

- **Etapa 4 — Ruta**: vincular `MdProductionChain` con cada orden (tabla intermedia probablemente nueva: `OD_ORDER_ROUTE`).
- **Etapa 5 — Trazabilidad**: query/dashboard sobre `OD_ORDER_LABEL_DETAIL` + cadena.
- **Etapa 6 — Lista negra**: vista filtrada de `OD_ORDER_LABEL_DETAIL.isBlacklisted=1`.

### 13.3 Mejoras transversales

- **Autenticación y roles**: hoy no hay middleware de auth en backend ni control de quién puede aprobar etapas.
- **Auditoría**: aprovechar `codUsuarioCargaDl` y `desAccion` que ya están en todas las tablas.
- **Migrations**: usar `prisma migrate dev` en vez de DDL manual + rollback. Riesgo identificado: `prisma db pull` rompe el estilo del schema.
- **Modelo legacy `MdOrdenPedido`**: decidir si se elimina o se mantiene.
- **Firmas digitales en Etiqueta**: definir si el certificado vive en backend o se pide al usuario en el momento.

---

## 14. Cómo levantar el proyecto

```bash
# 1. BD (MariaDB en Docker)
docker compose up -d mariadb

# 2. Backend
cd apps/backend
pnpm install
npx prisma generate
pnpm dev
# escucha en http://localhost:4000

# 3. Frontend
cd apps/frontend
pnpm install
pnpm dev
# escucha en http://localhost:3000
```

`DATABASE_URL` en `apps/backend/.env`: `mysql://root:root@localhost:3306/reo_dev`.

---

## 15. Capturas — placeholders

> Toma cada captura con tu herramienta preferida (Snipping Tool / ShareX / Flameshot) y guárdala con el nombre indicado dentro de `docs/img/`. El doc renderiza la imagen automáticamente.

### 15.1 Inicio

![Inicio](./img/00-inicio-traza.png)

**Qué debe mostrar:** página `/` con el título "TRAZA" y el botón a "Ver Órdenes de Pedido".

### 15.2 Configuración

![Configuración - Empresa](./img/10-configuracion-empresa.png)
![Configuración - Marca](./img/11-configuracion-marca.png)
![Configuración - Insumos / Materiales](./img/12-insumos-materiales.png)
![Configuración - Materiales / carga masiva](./img/13-insumos-bulk-upload.png)

### 15.3 Cadena de producción

![Cadena - Eslabón con diagrama](./img/20-cadena-eslabon-diagrama.png)
![Cadena - Proceso con inputs/outputs](./img/21-cadena-proceso.png)
![Cadena - Actividad - diagrama general](./img/22-cadena-actividad-diagrama.png)

### 15.4 Orden de Pedido

![Registro - listado](./img/30-registro-tabla.png)
![Registro - modal con Concluido](./img/31-registro-modal-concluido.png)
![Detalle de orden - wizard](./img/32-registro-detalle-wizard.png)
![Suministro - listado](./img/33-suministro-tabla.png)
![Suministro - modal UDP/PROD/FINAL](./img/34-suministro-modal-archivos.png)
![Etiqueta - placeholder actual](./img/35-etiqueta-placeholder.png)
![Ruta - diagrama React Flow](./img/36-ruta-diagrama.png)

### 15.5 BD

![DBeaver - tablas nuevas de Etiqueta](./img/40-bd-tablas-etiqueta.png)

**Qué debe mostrar:** un cliente de BD listando `MD_DIGITAL_IDENTIFIER`, `OD_ORDER_LABEL_HEAD`, `OD_ORDER_LABEL_DETAIL` dentro de `reo_dev`, idealmente con las FKs visibles.

---

## 16. Anexo: pendientes y deuda técnica

- **Sin autenticación**: el backend no exige token. Cualquier cliente puede llamar a `/api/...`.
- **Sin roles**: el filtro de acciones por rol está pendiente. La regla acordada hoy (cualquier logueado aprueba) es solo provisional.
- **Modelo legacy `MdOrdenPedido`**: convive con `OdOrderHead`. Decidir.
- **`stateOrderHead` vs `flgStatutActif`**: dos columnas con propósito similar (estado/activo). Confirmar uso real.
- **`SUMINISTRO_STATUS` UI con 3 valores vs `statusStageOrderHead` BD con 2**: el front muestra "Sin Iniciar / Iniciado / Concluido" pero el campo de BD acepta solo 1/2. Revisar coherencia.
- **`OdOrderHead.stateOrderHead` siempre default 1**: nadie lo lee/escribe explícitamente.
- **Carga de imágenes desde Excel**: implementada en `order-excel-images.ts`. Buena cobertura, conviene documentar formatos soportados.
- **`prisma db pull` peligroso**: convierte `Int @db.TinyInt` en `Boolean` y elimina precisiones `DateTime(3)`. **Nunca correr sin commit limpio** y revisar diff antes de aceptar.
- **Sin tests**: no hay suite automatizada en `apps/backend` ni en `apps/frontend`.
- **Sin observabilidad**: no hay logs estructurados ni métricas. `console.log` en varios services.

---

*Documento generado el 2026-04-25 a partir de exploración exhaustiva del código + `git log` + decisiones de la sesión actual.*
