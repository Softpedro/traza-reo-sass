# API de Pasaporte Digital (DPP) — Guía de integración

Endpoint de **lectura** que devuelve, en un solo JSON, toda la información de una prenda para
renderizar su Pasaporte Digital de Producto (la app pública, ej. `dpp.trazar.io`). Recibe la URL
del QR (GS1 Digital Link) y resuelve la prenda en REO.

---

## 1. Endpoint

```
GET  {BASE_URL}/api/dpp/passport?url={URL_DEL_QR}
```

- **BASE_URL (prod):** `https://web-300ixhl1vesu.up-de-fra1-k8s-1.apps.run-on-seenode.com`
- Solo **HTTPS**.
- Método **GET**, sin body.

## 2. Autenticación — API Key

Cada request debe llevar la clave en el header:

```
X-API-Key: <TU_API_KEY>
```

> La clave (`qpk_…`) se entrega por canal seguro. Es la misma credencial del API de ingesta de
> escaneos. Si se filtra, avísanos para rotarla.

## 3. Parámetro

| Param | En | Obligatorio | Descripción |
|-------|----|-------------|-------------|
| `url` | query | **Sí** | Contenido **exacto** del QR (GS1 Digital Link). **URL-encodear** (tiene `/` y `:`). |

La `url` tiene el formato `.../01/{GTIN}/10/{lote}/21/{serial}`. El servicio extrae GTIN, lote y
serial de la ruta y resuelve la prenda por esos tres — **no** por el dominio, así que sirve aunque
el dominio del QR cambie (`dpp.trazar.io`, `dpp.qapary.com`, etc.).

## 4. Ejemplo (curl)

```bash
curl -G "https://web-300ixhl1vesu.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/dpp/passport" \
  -H "X-API-Key: <TU_API_KEY>" \
  --data-urlencode "url=https://dpp.trazar.io/01/07750549420014/10/OP28261/21/1"
```

## 5. Respuesta `200` — esquema

```jsonc
{
  "unit": {
    "gtin":        "string",   // GTIN-14 de la prenda
    "lote":        "string",   // lote (orden de producción) del QR
    "serial":      "string",   // serie de la unidad
    "sgtin":       "string",   // SGTIN (gtin/serial)
    "productCode": "string",   // código de producto legible (gtin/10/lote/21/serial)
    "blacklisted": false       // true si la unidad está en lista negra
  },
  "header": {
    "title":     "string",     // nombre de la pieza
    "traceable": true,
    "brand": {
      "name":    "string",
      "logoUrl": "string|null",            // data URL (base64) o null
      "social": {
        "facebook":  "string|null",
        "instagram": "string|null",
        "whatsapp":  "string|null",
        "ecommerce": "string|null"
      }
    }
  },
  "images": ["string"],        // 0..N data URLs (base64). [] si no hay
  "description": {
    "title":      "string|null",   // nombre del modelo
    "collection": "string|null",   // colección
    "body":       "string|null"    // descripción larga
  },
  "information": {
    "name":        "string|null",
    "brand":       "string|null",
    "gtin":        "string",
    "productCode": "string",
    "category":    "string|null",
    "color":       "string|null",  // "Fondo / Estampado"
    "year":        0,              // number|null
    "season":      "string|null"
  },
  "materials": {
    "composition":        "string|null",
    "recycled":           false,         // boolean
    "recycledPercentage": 0,             // number|null
    "recycledInput":      "string|null"
  },
  "packaging": {                          // objeto, o null si el modelo no tiene empaque
    "type":               "string",
    "weight":             0,             // number|null (gramos)
    "volume":             0,             // number|null (m3)
    "recycling":          "string|null",
    "percentageRecycled": 0,             // number|null
    "recycled":           true           // boolean derivado
  },
  "care": {
    "text": "string|null"   // texto único: intro + viñetas "*" + cierre (ver §6)
  },
  "suppliers": [
    { "name": "string", "address": "string|null", "ruc": "string", "gps": "string|null" }
  ],
  "manufacturing": {
    "location": "string|null",
    "timeline": [
      { "stage": "string", "startAt": "ISO-8601|null", "endAt": "ISO-8601|null", "responsible": "string|null" }
    ]
  }
}
```

### Ejemplo real (recortado en base64)

```json
{
  "unit": { "gtin": "07750549420014", "lote": "OP28261", "serial": "1", "sgtin": "07750549420014/1", "productCode": "7750549420014/10/OP28261/21/1", "blacklisted": false },
  "header": { "title": "Blusa Pijama Eleganza Dream Garden", "traceable": true, "brand": { "name": "QAPARY", "logoUrl": "data:image/png;base64,iV...", "social": { "facebook": "https://www.facebook.com/QAPARY.PE", "instagram": "", "whatsapp": "+51 934029711", "ecommerce": "https://www.qapary.com/" } } },
  "images": ["data:image/jpeg;base64,/9j..."],
  "description": { "title": "Pijama Eleganza Natural", "collection": "Dream Garden", "body": "Blusa de pijama manga larga, confeccionada en Interlock 50/1 Estampado (100% Pima Cotton)..." },
  "information": { "name": "Blusa Pijama Eleganza Dream Garden", "brand": "QAPARY", "gtin": "07750549420014", "productCode": "7750549420014/10/OP28261/21/1", "category": "Ropa de Dormir / Homewear Femenino (Sup.)", "color": "NAVY PEONY / SIN ESTAMPADO", "year": 2025, "season": "Spring 25" },
  "materials": { "composition": "100% Pima Cotton. Tela: Interlock 50/1 Estampado. Densidad 0.19 kg/m2.", "recycled": false, "recycledPercentage": null, "recycledInput": null },
  "packaging": { "type": "Empaque primario individual (Blusa XS) en bolsa biodegradable...", "weight": 200, "volume": 0.003, "recycling": "Biodegradable / carton reciclado", "percentageRecycled": 100, "recycled": true },
  "care": { "text": "Para conservar la suavidad color y forma de tu pijama Eleganza:\n* Lavar a máquina en ciclo delicado.\n* Usar agua fría (máx. 30°C)\n..." },
  "suppliers": [ { "name": "BERGMAN / RIVERA S.A.", "address": "Jr. Chiclayo 985 Miraflores", "ruc": "20516438445", "gps": "-12.1147, -77.0387" } ],
  "manufacturing": { "location": null, "timeline": [] }
}
```

## 6. Notas de render

- **`care.text`** es UN solo texto. Las líneas que empiezan con `*` son la **lista de cuidados**;
  el resto son párrafos (intro / cierre). Separá por `\n` y formateá las `*` como viñetas.
- **`images` y `brand.logoUrl`** son **data URLs** (`data:image/...;base64,...`): se pueden poner
  directo en `<img src>`. Pueden venir vacíos (`[]` / `null`).
- **`packaging`** puede ser `null` (modelo sin empaque). `weight` en gramos, `volume` en m³; el
  texto "Aprox. 200 g" lo arma el front.
- **`manufacturing.timeline`** hoy puede venir `[]` (ruta aún no cargada). La estructura ya es
  estable: construí contra ella.

## 7. Respuestas de error

| HTTP | Cuerpo | Significado |
|------|--------|-------------|
| `400` | `{ "error": "url es obligatoria" }` | Falta el parámetro `url`. |
| `401` | `{ "error": "API key no proporcionada / inválida" }` | Falta o es incorrecta la `X-API-Key`. |
| `404` | `{ "error": "Prenda no encontrada para esa URL" }` | El GTIN/lote/serial no corresponde a ninguna prenda. |
| `500` | `{ "error": "Error interno" }` | Error del servidor. |

## 8. Recomendaciones

- **Cachea** la respuesta por `productCode` (los datos cambian poco). Invalidá si necesitás frescura.
- Ante `5xx`, reintentá con backoff. Ante `4xx`, corregí el request (URL/credencial).
- Si llamás desde el **navegador**, requiere habilitar **CORS** para tu origen (avísanos el dominio).
  Si llamás **server-side**, no aplica.
