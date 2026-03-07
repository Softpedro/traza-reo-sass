"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@fullstack-reo/ui";
import {
  navItems,
  type NavItem,
  type NavLeafItem,
  type NavCollapsibleItem,
  type NavSectionHeader,
} from "@/lib/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of navItems) {
      if (item.type === "collapsible") {
        initial[item.basePath] = pathname.startsWith(item.basePath);
      }
    }
    return initial;
  });

  function toggleSection(basePath: string) {
    setExpanded((prev) => ({ ...prev, [basePath]: !prev[basePath] }));
  }

  function isLeafActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderLeaf(item: NavLeafItem, indent: number) {
    const active = isLeafActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
        style={{ paddingLeft: `${indent * 12 + 12}px` }}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        {item.label}
      </Link>
    );
  }

  function renderSectionHeader(item: NavSectionHeader, indent: number) {
    return (
      <div
        key={`header-${item.label}`}
        className="px-3 pt-3 pb-1 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border mb-1"
        style={{ paddingLeft: `${indent * 12 + 12}px` }}
      >
        {item.label}
      </div>
    );
  }

  function renderCollapsible(item: NavCollapsibleItem) {
    const isOpen = expanded[item.basePath] ?? false;
    const isChildActive = pathname.startsWith(item.basePath);

    return (
      <div key={item.basePath}>
        <button
          onClick={() => toggleSection(item.basePath)}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isChildActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="mt-1 space-y-0.5">
            {item.children.map((child) => {
              if (child.type === "section-header") {
                return renderSectionHeader(child, 2);
              }
              return renderLeaf(child, 3);
            })}
          </div>
        )}
      </div>
    );
  }

  function renderItem(item: NavItem) {
    if (item.type === "leaf") return renderLeaf(item, 1);
    return renderCollapsible(item);
  }

  return (
    <aside className="w-52 shrink-0 border-r bg-[hsl(var(--sidebar-bg))] py-6 px-4">
      <nav className="space-y-1">{navItems.map(renderItem)}</nav>
    </aside>
  );
}
