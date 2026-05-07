"use client";

import { LogOut, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@fullstack-reo/ui";
import { useAuth } from "@/components/auth-provider";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
        <span className="text-xl font-bold tracking-tight text-primary">
          TRAZA
        </span>
      </div>

      <div className="relative w-full max-w-md mx-8">
        <Input placeholder="Buscar..." className="pr-9" />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <Link
            href="/configuracion/mi-cuenta"
            className="text-right text-xs leading-tight hover:underline"
            title="Mi cuenta"
          >
            <p className="flex items-center justify-end gap-1 font-medium">
              <User className="h-3 w-3" />
              {displayName}
            </p>
            <p className="text-muted-foreground">{user.userLogin}</p>
          </Link>
        )}
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
      </div>
    </header>
  );
}
