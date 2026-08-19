/**
 * Respuesta de error uniforme para toda la API.
 *
 * Antes cada archivo de rutas tenía su propia copia de `errorResponse` (29 en total)
 * y todas devolvían `e.message` tal cual al cliente. Eso publicaba el estado interno
 * del pool en la pantalla de login, p. ej.:
 *
 *   pool timeout: failed to retrieve a connection from pool after 60000ms
 *   (pool connections: active=0 idle=0 limit=3)
 *
 * Ahora el detalle real va solo al log del servidor y el cliente recibe un texto
 * accionable. Fuera de producción se adjunta `detail` para no perder ergonomía al
 * depurar en local.
 */

/**
 * Fallos de conectividad con MariaDB. Merecen 503 (transitorio, reintentable) en vez
 * de 500. La lista cubre el pool del driver `mariadb` que usa @prisma/adapter-mariadb,
 * los errores de socket y el rechazo por cupo (max_user_connections).
 *
 * Nota: la versión anterior hacía `message.includes("connection")`, que clasificaba
 * como problema de base cualquier error con esa palabra. Aquí los patrones son
 * específicos para evitar falsos 503.
 */
const DB_CONNECTION_PATTERNS = [
  "pool timeout",
  "retrieve a connection from pool",
  "er_get_connection_timeout",
  "er_con_count_error",
  "er_user_limit_reached",
  "er_access_denied_error",
  "econnrefused",
  "econnreset",
  "etimedout",
  "enotfound",
  "ehostunreach",
  "can't connect to",
  "connection lost",
  "closed the connection",
  "server has gone away",
];

/** Detecta si el error viene de no poder hablar con la base. */
export function isDbConnectionError(e: unknown): boolean {
  const message = e instanceof Error ? e.message : String(e ?? "");
  const raw = (e ?? {}) as { code?: unknown; errno?: unknown };
  const code = typeof raw.code === "string" ? raw.code : "";
  const haystack = `${message} ${code}`.toLowerCase();
  return DB_CONNECTION_PATTERNS.some((p) => haystack.includes(p));
}

const DB_CONNECTION_MESSAGE =
  "No hay conexión con la base de datos en este momento. Vuelve a intentarlo en unos minutos.";
const INTERNAL_MESSAGE = "Ocurrió un error interno. Si persiste, contacta al administrador.";

/** En producción no se filtra el mensaje crudo; en local sí, para poder depurar. */
const exposeDetail = process.env.NODE_ENV !== "production";

export type ApiErrorBody = {
  error: string;
  type: "DB_CONNECTION" | "INTERNAL";
  detail?: string;
};

/**
 * Traduce cualquier excepción a `{ status, body }` listo para `res.status(...).json(...)`.
 * Mantiene el contrato de la versión anterior, así que los ~200 sitios que la usaban
 * siguen funcionando sin cambios.
 */
export function errorResponse(e: unknown): { status: number; body: ApiErrorBody } {
  const detail = e instanceof Error ? e.message : "Error desconocido";
  const isDbError = isDbConnectionError(e);
  return {
    status: isDbError ? 503 : 500,
    body: {
      error: isDbError ? DB_CONNECTION_MESSAGE : INTERNAL_MESSAGE,
      type: isDbError ? "DB_CONNECTION" : "INTERNAL",
      ...(exposeDetail ? { detail } : {}),
    },
  };
}
