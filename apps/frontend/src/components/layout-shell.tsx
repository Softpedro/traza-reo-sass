"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth-guard";

const PUBLIC_ROUTE_PREFIXES = ["/login"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
        </div>
        <footer className="flex items-center justify-center border-t px-6 py-3 text-xs text-muted-foreground">
          {/* <span className="font-semibold">MREO-01</span> */}
          <span className="font-semibold">UMA TECHNOLOGY</span>
        </footer>
      </div>
    </AuthGuard>
  );
}
