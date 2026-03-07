import type { LucideIcon } from "lucide-react";

export type NavLeafItem = {
  type: "leaf";
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type NavSectionHeader = {
  type: "section-header";
  label: string;
};

export type NavCollapsibleItem = {
  type: "collapsible";
  label: string;
  icon?: LucideIcon;
  basePath: string;
  children: (NavSectionHeader | NavLeafItem)[];
};

export type NavItem = NavLeafItem | NavCollapsibleItem;

import { Home, Settings } from "lucide-react";

export const navItems: NavItem[] = [
  {
    type: "leaf",
    label: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    type: "collapsible",
    label: "Configuración",
    icon: Settings,
    basePath: "/configuracion",
    children: [
      { type: "section-header", label: "REO" },
      { type: "leaf", label: "Empresa", href: "/configuracion/reo/empresa" },
      { type: "leaf", label: "Fábrica", href: "/configuracion/reo/fabrica" },
      { type: "leaf", label: "Maquila", href: "/configuracion/reo/maquila" },
      { type: "leaf", label: "Fábrica Maquila", href: "/configuracion/reo/fabrica-maquila" },
      { type: "leaf", label: "Marca", href: "/configuracion/reo/marca" },
      { type: "leaf", label: "Submarca", href: "/configuracion/reo/submarca" },
      { type: "leaf", label: "Usuario", href: "/configuracion/reo/usuario" },
    ],
  },
];
