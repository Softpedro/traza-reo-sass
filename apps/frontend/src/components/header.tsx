"use client";

import { Search } from "lucide-react";
import { Input } from "@fullstack-reo/ui";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-[hsl(var(--header-bg))] px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-primary">
          TRAZA
        </span>
      </div>

      <div className="relative w-full max-w-md mx-8">
        <Input
          placeholder="Buscar..."
          className="pr-9"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="w-20" />
    </header>
  );
}
