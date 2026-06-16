# API de Ingesta DPP — Guía de integración

Endpoint para registrar el **escaneo de una etiqueta DPP** (QR) de QAPARY. Cuando tu lector
escanea el QR obtiene una URL (GS1 Digital Link); con esta API nos informas **qué prenda** se
escaneó y **cuándo**.

---

## 1. Endpoint

```
POST  https://web-300ixhl1vesu.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/dpp/scan
```

- Solo **HTTPS**.
- `Content-Type: application/json`

## 2. Autenticación — API Key

Cada request debe llevar tu clave en el header:

```
X-API-Key: <TU_API_KEY>
```

> La clave (`qpk_…`) te la entregamos por un canal seguro, **no** está en este documento.
> Si se filtra, avísanos para rotarla.

## 3. Cuerpo (JSON)

| Campo        | Tipo   | Obligatorio | Descripción |
|--------------|--------|-------------|-------------|
| `url`        | string | **Sí**      | El **contenido exacto del QR** escaneado (GS1 Digital Link). Debe ser del dominio `dpp.qapary.com`. |
| `phase`      | string | **Sí**      | Fase del escaneo: **`inicio`** o **`fin`** (sin distinción de mayúsculas). Indica si el escaneo marca el inicio o el fin. |
| `scannedAt`  | string | Recomendado | Fecha y hora del escaneo, en **ISO 8601 con zona horaria** (ej. `2026-06-14T20:30:00-05:00`). Si se omite, usamos la hora de recepción. |
| `typeEvent`  | string | No          | Tipo de evento. Por defecto `SCAN`. |
| `deviceId`   | string | No          | Identificador del lector/dispositivo. |
| `observation`| string | No          | Nota libre. |

Ejemplo de `url` (lo que devuelve el QR):
```
https://dpp.qapary.com/01/07750549420014/10/OP28261/21/1
```

## 4. Ejemplo (curl)

```bash
curl -X POST \
  "https://web-300ixhl1vesu.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/dpp/scan" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <TU_API_KEY>" \
  -d '{
    "url": "https://dpp.qapary.com/01/07750549420014/10/OP28261/21/1",
    "phase": "inicio",
    "scannedAt": "2026-06-14T20:30:00-05:00"
  }'
```

## 5. Respuestas

| HTTP | Cuerpo | Significado |
|------|--------|-------------|
| `201` | `{ "ok": true }` | Escaneo registrado correctamente. |
| `400` | `{ "error": "url es obligatoria" }` | Falta el campo `url`. |
| `400` | `{ "error": "phase es obligatoria y debe ser \"inicio\" o \"fin\"" }` | Falta `phase` o trae un valor distinto de `inicio`/`fin`. |
| `401` | `{ "error": "API key no proporcionada / inválida" }` | Falta o es incorrecta la `X-API-Key`. |
| `404` | `{ "error": "Prenda no encontrada para esa URL" }` | La URL no corresponde a ninguna prenda nuestra. |
| `422` | `{ "error": "La URL no corresponde al dominio DPP" }` | La `url` no es de `dpp.qapary.com`. |
| `500` | `{ "error": "..." }` | Error interno. |

## 6. Comportamiento y recomendaciones

- **Cada llamada registra un evento.** No deduplicamos: si escaneas la misma prenda varias
  veces, se registran varias lecturas (es intencional).
- Manda `scannedAt` con la **hora real del dispositivo** (con su offset de zona horaria);
  nosotros guardamos también la hora de recepción.
- **Reintentos:** ante `5xx`, reintentar con backoff (ej. 1s, 5s, 30s). Ante `4xx`, **no**
  reintentar a ciegas: corregir el request (URL/credencial).
- Envía **un request por escaneo**. Si necesitas envío por lotes, avísanos.
