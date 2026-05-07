import { apiUrl } from "./api";
import { clearAuth, getStoredToken } from "./auth-storage";

export type ApiFetchOptions = RequestInit & {
  /** Si es true, no inyecta el header Authorization aunque haya token (útil para /login). */
  skipAuth?: boolean;
};

/**
 * Wrapper sobre fetch que:
 *  - acepta un path relativo (ej. "/api/foo") o una URL absoluta ya construida con apiUrl()
 *  - inyecta `Authorization: Bearer <token>` cuando hay sesión
 *  - en 401 limpia la sesión local (el AuthProvider redirige al detectarlo)
 */
export async function apiFetch(pathOrUrl: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { skipAuth, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (!skipAuth) {
    const token = getStoredToken();
    if (token && !finalHeaders.has("Authorization")) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const target = /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : apiUrl(pathOrUrl);
  const res = await fetch(target, { ...rest, headers: finalHeaders });

  if (res.status === 401 && !skipAuth) {
    clearAuth();
  }

  return res;
}
