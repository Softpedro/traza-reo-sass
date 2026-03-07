export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Construye la URL absoluta para una ruta del API (ej: apiUrl("/api/facilities") => "http://localhost:4000/api/facilities") */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL.replace(/\/$/, "")}${p}`;
}