"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api-fetch";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  persistAuth,
  type AuthUser,
} from "@/lib/auth-storage";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated"; user: null };

type LoginSuccess = {
  requires2FA: false;
  token: string;
  expiresIn: string;
  user: AuthUser;
};

type LoginRequires2FA = {
  requires2FA: true;
  tempToken: string;
  userLogin: string;
};

type LoginResponse = LoginSuccess | LoginRequires2FA;

const TEMP_TOKEN_KEY = "reo:auth:tempToken";
const TEMP_USER_KEY = "reo:auth:tempUserLogin";

type AuthContextValue = AuthState & {
  /** Devuelve el usuario si el login fue completo, o `{ requires2FA: true }` para que la UI redirija. */
  login: (userLogin: string, password: string) => Promise<LoginResponse>;
  /** Llamado desde /login/2fa con tempToken + código. */
  verify2FA: (code: string) => Promise<AuthUser>;
  logout: () => void;
  /** Refresca user (ej. después de activar/desactivar 2FA). */
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });
  const validatedRef = useRef(false);

  const setAuthenticated = useCallback((user: AuthUser) => {
    setState({ status: "authenticated", user });
  }, []);

  const setUnauthenticated = useCallback(() => {
    clearAuth();
    setState({ status: "unauthenticated", user: null });
  }, []);

  /** Valida el token contra /api/auth/me al montar (refresca user, limpia sesión expirada). */
  useEffect(() => {
    if (validatedRef.current) return;
    validatedRef.current = true;

    const token = getStoredToken();
    const cachedUser = getStoredUser();
    if (!token) {
      setState({ status: "unauthenticated", user: null });
      return;
    }
    // Estado optimista mientras se revalida
    if (cachedUser) {
      setState({ status: "authenticated", user: cachedUser });
    }

    apiFetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          setUnauthenticated();
          return;
        }
        const fresh = (await res.json()) as Partial<AuthUser> & { idDlkUserReo: number };
        const merged: AuthUser = { ...(cachedUser ?? ({} as AuthUser)), ...fresh } as AuthUser;
        persistAuth(token, merged);
        setAuthenticated(merged);
      })
      .catch(() => {
        if (!cachedUser) setUnauthenticated();
      });
  }, [setAuthenticated, setUnauthenticated]);

  const login = useCallback(
    async (userLogin: string, password: string): Promise<LoginResponse> => {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userLogin, password }),
        skipAuth: true,
      });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : `Error ${res.status} al iniciar sesión`;
        throw new Error(msg);
      }
      const data = body as LoginResponse;
      if (data.requires2FA) {
        // Guarda tempToken en sessionStorage (no localStorage: más volátil) para /login/2fa
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(TEMP_TOKEN_KEY, data.tempToken);
          window.sessionStorage.setItem(TEMP_USER_KEY, data.userLogin);
        }
        return data;
      }
      persistAuth(data.token, data.user);
      setAuthenticated(data.user);
      return data;
    },
    [setAuthenticated]
  );

  const verify2FA = useCallback(
    async (code: string): Promise<AuthUser> => {
      const tempToken =
        typeof window !== "undefined" ? window.sessionStorage.getItem(TEMP_TOKEN_KEY) : null;
      if (!tempToken) {
        throw new Error("Sesión 2FA expirada. Vuelve a iniciar sesión.");
      }
      const res = await apiFetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code }),
        skipAuth: true,
      });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : `Error ${res.status} al validar código`;
        throw new Error(msg);
      }
      const data = body as LoginSuccess;
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(TEMP_TOKEN_KEY);
        window.sessionStorage.removeItem(TEMP_USER_KEY);
      }
      persistAuth(data.token, data.user);
      setAuthenticated(data.user);
      return data.user;
    },
    [setAuthenticated]
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(TEMP_TOKEN_KEY);
      window.sessionStorage.removeItem(TEMP_USER_KEY);
    }
    setUnauthenticated();
  }, [setUnauthenticated]);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;
    const res = await apiFetch("/api/auth/me");
    if (!res.ok) return;
    const fresh = (await res.json()) as Partial<AuthUser> & { idDlkUserReo: number };
    setState((prev) => {
      if (prev.status !== "authenticated") return prev;
      const merged = { ...prev.user, ...fresh } as AuthUser;
      persistAuth(token, merged);
      return { status: "authenticated", user: merged };
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, verify2FA, logout, refreshUser }),
    [state, login, verify2FA, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
