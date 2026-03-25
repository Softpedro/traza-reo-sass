import { Home, Settings, type LucideIcon } from "lucide-react";

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

/** Subsección colapsable dentro de un collapsible (ej. REO, Cadena de suministro) */
export type NavGroupItem = {
  type: "group";
  id: string;
  label: string;
  children: NavLeafItem[];
};

export type NavCollapsibleItem = {
  type: "collapsible";
  label: string;
  icon?: LucideIcon;
  basePath: string;
  children: (NavSectionHeader | NavGroupItem | NavLeafItem)[];
};

export type NavItem = NavLeafItem | NavCollapsibleItem;

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
      {
        type: "group",
        id: "reo",
        label: "REO",
        children: [
          { type: "leaf", label: "Empresa", href: "/configuracion/reo/empresa" },
          { type: "leaf", label: "Fábrica", href: "/configuracion/reo/fabrica" },
          { type: "leaf", label: "Maquila", href: "/configuracion/reo/maquila" },
          { type: "leaf", label: "Fábrica Maquila", href: "/configuracion/reo/fabrica-maquila" },
          { type: "leaf", label: "Marca", href: "/configuracion/reo/marca" },
          { type: "leaf", label: "Submarca", href: "/configuracion/reo/submarca" },
          { type: "leaf", label: "Usuario", href: "/configuracion/reo/usuario" },
        ],
      },
      {
        type: "group",
        id: "cadena-suministro",
        label: "Cadena de suministro",
        children: [
          { type: "leaf", label: "Eslabón", href: "/configuracion/cadena-produccion/eslabon" },
          { type: "leaf", label: "Proceso", href: "/configuracion/cadena-produccion/proceso" },
          { type: "leaf", label: "Subproceso", href: "/configuracion/cadena-produccion/subproceso" },
          { type: "leaf", label: "Actividad", href: "/configuracion/cadena-produccion/actividad" },
        ],
      },
      {
        type: "group",
        id: "insumos",
        label: "Insumos",
        children: [
          { type: "leaf", label: "Proveedores", href: "/configuracion/insumos/proveedores" },
          { type: "leaf", label: "Materiales", href: "/configuracion/insumos/materiales" },
          { type: "leaf", label: "Avíos", href: "/configuracion/insumos/avios" },
        ],
      },
    ],
  },
];
