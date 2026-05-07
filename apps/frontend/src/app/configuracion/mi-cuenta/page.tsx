"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@fullstack-reo/ui";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-fetch";

type Me = {
  idDlkUserReo: number;
  userLogin: string;
  emailUser: string;
  twoFactorEnabled: number;
  backupCodesRemaining: number;
};

type SetupData = {
  secret: string;
  qrDataUrl: string;
  otpauthUrl: string;
};

export default function MiCuentaPage() {
  const { refreshUser } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para los dialogs
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [setupCode, setSetupCode] = useState("");
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSubmitting, setSetupSubmitting] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState<string[] | null>(null);

  const [disableOpen, setDisableOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disableError, setDisableError] = useState<string | null>(null);
  const [disableSubmitting, setDisableSubmitting] = useState(false);

  const [regenOpen, setRegenOpen] = useState(false);
  const [regenCode, setRegenCode] = useState("");
  const [regenError, setRegenError] = useState<string | null>(null);
  const [regenSubmitting, setRegenSubmitting] = useState(false);

  async function loadMe() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) throw new Error("No se pudo cargar la sesión");
      const data = (await res.json()) as Me;
      setMe(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMe();
  }, []);

  async function startSetup() {
    setSetupError(null);
    setSetupCode("");
    setShowBackupCodes(null);
    try {
      const res = await apiFetch("/api/auth/2fa/setup", { method: "POST" });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string" ? (body as { error: string }).error : `Error ${res.status}`;
        throw new Error(msg);
      }
      setSetupData(body as SetupData);
      setSetupOpen(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo iniciar el setup");
    }
  }

  async function handleConfirmSetup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (setupSubmitting) return;
    setSetupSubmitting(true);
    setSetupError(null);
    try {
      const res = await apiFetch("/api/auth/2fa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: setupCode.trim() }),
      });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string" ? (body as { error: string }).error : `Error ${res.status}`;
        throw new Error(msg);
      }
      const data = body as { backupCodes: string[] };
      setShowBackupCodes(data.backupCodes);
      setSetupCode("");
      await loadMe();
      await refreshUser();
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : "Error al confirmar");
    } finally {
      setSetupSubmitting(false);
    }
  }

  function closeSetupDialog() {
    setSetupOpen(false);
    setSetupData(null);
    setSetupCode("");
    setSetupError(null);
    setShowBackupCodes(null);
  }

  async function handleDisable(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disableSubmitting) return;
    setDisableSubmitting(true);
    setDisableError(null);
    try {
      const res = await apiFetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword, code: disableCode.trim() }),
      });
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null);
        const msg = body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string" ? (body as { error: string }).error : `Error ${res.status}`;
        throw new Error(msg);
      }
      setDisableOpen(false);
      setDisablePassword("");
      setDisableCode("");
      await loadMe();
      await refreshUser();
    } catch (err) {
      setDisableError(err instanceof Error ? err.message : "Error al desactivar");
    } finally {
      setDisableSubmitting(false);
    }
  }

  async function handleRegen(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (regenSubmitting) return;
    setRegenSubmitting(true);
    setRegenError(null);
    try {
      const res = await apiFetch("/api/auth/2fa/regenerate-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: regenCode.trim() }),
      });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string" ? (body as { error: string }).error : `Error ${res.status}`;
        throw new Error(msg);
      }
      const data = body as { backupCodes: string[] };
      setShowBackupCodes(data.backupCodes);
      setRegenCode("");
      setRegenOpen(false);
      await loadMe();
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : "Error al regenerar");
    } finally {
      setRegenSubmitting(false);
    }
  }

  function copyBackupCodes() {
    if (!showBackupCodes) return;
    navigator.clipboard.writeText(showBackupCodes.join("\n"));
  }

  if (loading || !me) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  const enabled = me.twoFactorEnabled === 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Configuración &gt; Mi Cuenta</p>
        <h1 className="mt-1 text-2xl font-semibold">Mi Cuenta</h1>
      </div>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">Autenticación de dos factores (2FA)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Añade una capa extra de seguridad usando una app como Google Authenticator, Authy o 1Password.
            </p>
            <p className="mt-3 text-sm">
              Estado:{" "}
              <span className={enabled ? "font-medium text-green-700" : "font-medium text-amber-700"}>
                {enabled ? "Activo" : "Inactivo"}
              </span>
            </p>
            {enabled && (
              <p className="mt-1 text-sm">
                Códigos de respaldo restantes:{" "}
                <span className="font-medium">{me.backupCodesRemaining} / 8</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {!enabled && <Button onClick={startSetup}>Activar 2FA</Button>}
            {enabled && (
              <>
                <Button variant="outline" onClick={() => setRegenOpen(true)}>
                  Regenerar códigos
                </Button>
                <Button variant="destructive" onClick={() => setDisableOpen(true)}>
                  Desactivar 2FA
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Setup dialog (QR + confirm) o backup codes después de confirmar ─── */}
      <Dialog open={setupOpen} onOpenChange={(o) => (!o ? closeSetupDialog() : setSetupOpen(o))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{showBackupCodes ? "Guarda tus códigos de respaldo" : "Activar 2FA"}</DialogTitle>
            <DialogDescription>
              {showBackupCodes
                ? "Estos códigos solo se muestran una vez. Guárdalos en un lugar seguro: te servirán si pierdes acceso a tu app autenticadora."
                : "Escanea el QR con tu app autenticadora y luego ingresa el código de 6 dígitos que muestra."}
            </DialogDescription>
          </DialogHeader>

          {!showBackupCodes && setupData && (
            <form onSubmit={handleConfirmSetup} className="space-y-4">
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={setupData.qrDataUrl} alt="QR 2FA" className="h-48 w-48" />
              </div>
              <div className="rounded-md bg-muted/40 p-3 text-center text-xs">
                <p className="text-muted-foreground">¿No puedes escanear?</p>
                <p className="font-mono break-all">{setupData.secret}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="setup-code">Código del autenticador</Label>
                <Input
                  id="setup-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={setupCode}
                  onChange={(e) => setSetupCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="font-mono tracking-widest"
                />
              </div>
              {setupError && (
                <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {setupError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeSetupDialog} disabled={setupSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={setupSubmitting || setupCode.length !== 6}>
                  {setupSubmitting ? "Validando..." : "Activar"}
                </Button>
              </div>
            </form>
          )}

          {showBackupCodes && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/40 p-4 font-mono text-sm">
                {showBackupCodes.map((c) => (
                  <div key={c}>{c}</div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={copyBackupCodes}>
                  Copiar
                </Button>
                <Button onClick={closeSetupDialog}>Listo</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Disable dialog ─── */}
      <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Desactivar 2FA</DialogTitle>
            <DialogDescription>
              Confirma tu contraseña y un código del autenticador para desactivar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDisable} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="disable-password">Contraseña</Label>
              <Input
                id="disable-password"
                type="password"
                autoComplete="current-password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="disable-code">Código del autenticador</Label>
              <Input
                id="disable-code"
                inputMode="numeric"
                maxLength={6}
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                required
                className="font-mono tracking-widest"
              />
            </div>
            {disableError && (
              <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {disableError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDisableOpen(false)} disabled={disableSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={disableSubmitting}>
                {disableSubmitting ? "Desactivando..." : "Desactivar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Regenerate dialog ─── */}
      <Dialog open={regenOpen} onOpenChange={setRegenOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Regenerar códigos de respaldo</DialogTitle>
            <DialogDescription>
              Los códigos anteriores se invalidan. Ingresa un código del autenticador para confirmar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegen} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="regen-code">Código del autenticador</Label>
              <Input
                id="regen-code"
                inputMode="numeric"
                maxLength={6}
                value={regenCode}
                onChange={(e) => setRegenCode(e.target.value)}
                required
                className="font-mono tracking-widest"
              />
            </div>
            {regenError && (
              <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {regenError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setRegenOpen(false)} disabled={regenSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={regenSubmitting}>
                {regenSubmitting ? "Generando..." : "Regenerar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
