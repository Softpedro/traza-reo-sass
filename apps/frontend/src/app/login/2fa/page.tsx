"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@fullstack-reo/ui";
import { useAuth } from "@/components/auth-provider";

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Cargando...</div>}>
      <TwoFactorPageInner />
    </Suspense>
  );
}

function TwoFactorPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verify2FA, status } = useAuth();

  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("from") || "/";

  useEffect(() => {
    // Si ya está autenticado por algún motivo (race condition), salta
    if (status === "authenticated") {
      router.replace(redirectTo);
      return;
    }
    // Si no hay tempToken (entró directo), regresa a /login
    if (typeof window !== "undefined") {
      const t = window.sessionStorage.getItem("reo:auth:tempToken");
      if (!t) {
        router.replace("/login");
      }
    }
  }, [status, redirectTo, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await verify2FA(code.trim());
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al validar el código");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Verificación 2FA</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {useBackup
              ? "Ingresa uno de tus códigos de respaldo."
              : "Ingresa el código de 6 dígitos de tu app autenticadora."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code">{useBackup ? "Código de respaldo" : "Código TOTP"}</Label>
            <Input
              id="code"
              autoFocus
              inputMode={useBackup ? "text" : "numeric"}
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={useBackup ? "XXXX-XXXX-XXXX-XXXX" : "123456"}
              maxLength={useBackup ? 19 : 6}
              required
              disabled={submitting}
              className="font-mono tracking-widest"
            />
          </div>

          {error && (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting || !code}>
            {submitting ? "Validando..." : "Verificar"}
          </Button>

          <div className="space-y-2 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setUseBackup((prev) => !prev);
                setCode("");
                setError(null);
              }}
              className="text-primary hover:underline"
            >
              {useBackup ? "Usar código del autenticador" : "Usar código de respaldo"}
            </button>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.sessionStorage.removeItem("reo:auth:tempToken");
                    window.sessionStorage.removeItem("reo:auth:tempUserLogin");
                  }
                  router.replace("/login");
                }}
                className="text-muted-foreground hover:underline"
              >
                Cancelar e iniciar sesión con otra cuenta
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
