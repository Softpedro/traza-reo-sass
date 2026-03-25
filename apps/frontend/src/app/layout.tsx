import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "TRAZA - Estado de Orden de Pedido",
  description: "Sistema de trazabilidad de órdenes de pedido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
          </div>
          <footer className="flex items-center justify-between border-t px-6 py-3 text-xs text-muted-foreground">
            <span className="font-semibold">MREO-01</span>
            <span className="font-semibold">UMA TECHNOLOGY</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
