"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, cn } from "@fullstack-reo/ui";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-fetch";
import type { AuthUser } from "@/lib/auth-storage";

function initialsOf(user: AuthUser): string {
  const a = user.nameUser?.trim()?.[0] ?? "";
  const b = user.paternalLastNameUser?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

/** Trae la foto del usuario logueado (endpoint protegido) y la expone como object URL. */
function useProfilePhoto(user: AuthUser | null): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.hasPhotograph) {
      setSrc(null);
      return;
    }
    let active = true;
    let objectUrl: string | null = null;

    apiFetch("/api/auth/me/photo")
      .then(async (res) => {
        if (!res.ok) return;
        const blob = await res.blob();
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        /* sin foto: se usa el fallback de iniciales */
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user?.idDlkUserReo, user?.hasPhotograph]);

  return src;
}

function Avatar({ src, initials }: { src: string | null; initials: string }) {
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-black/10">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- object URL dinámico, no apto para next/image
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const photoSrc = useProfilePhoto(user);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const displayName = user
    ? `${user.nameUser} ${user.paternalLastNameUser}`.trim()
    : "";

  return (
    <header className="flex h-14 items-center justify-between border-b bg-[hsl(var(--header-bg))] px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/traza_logo.png"
            alt="TRAZA"
            width={100}
            height={100}
            priority
            className="h-full w-auto object-contain"
          />
        </Link>
      </div>

      <div className="relative w-full max-w-md mx-8">
        <Input placeholder="Buscar..." className="pr-9" />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-black/5"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title="Cuenta"
            >
              <Avatar src={photoSrc} initials={initialsOf(user)} />
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg"
              >
                <div className="flex items-center gap-3 border-b px-3 py-3">
                  <Avatar src={photoSrc} initials={initialsOf(user)} />
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.emailUser || user.userLogin}
                    </p>
                  </div>
                </div>

                <div className="p-1">
                  <Link
                    href="/configuracion/mi-cuenta"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-4 w-4" />
                    Mi cuenta
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5"
            title="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" />
            Salir
          </Button>
        )}
      </div>
    </header>
  );
}
