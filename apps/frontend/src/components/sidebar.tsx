"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Shirt } from "lucide-react";
import { cn } from "@fullstack-reo/ui";
import {
  navItems,
  type NavItem,
  type NavLeafItem,
  type NavCollapsibleItem,
  type NavSectionHeader,
  type NavGroupItem,
} from "@/lib/nav-items";

function getInitialGroupExpanded(
  pathname: string
): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  for (const item of navItems) {
    if (item.type === "collapsible" && item.children) {
      for (const child of item.children) {
        if (child.type === "group") {
          const hasActiveChild = child.children.some(
            (leaf) =>
              pathname === leaf.href || pathname.startsWith(leaf.href + "/")
          );
          initial[child.id] = hasActiveChild;
        }
      }
    }
  }
  return initial;
}

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

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => getInitialGroupExpanded(pathname)
  );

  useEffect(() => {
    setExpandedGroups((prev) => {
      const next = getInitialGroupExpanded(pathname);
      const onlyOpen = Object.fromEntries(
        Object.entries(next).filter(([, v]) => v)
      );
      return { ...prev, ...onlyOpen };
    });
  }, [pathname]);

  function toggleSection(basePath: string) {
    setExpanded((prev) => ({ ...prev, [basePath]: !prev[basePath] }));
  }

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }

  function isLeafActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderLeaf(item: NavLeafItem, indent: number) {
    const active = isLeafActive(item.href);
    const numbered = item.listIndex != null;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-neutral-900",
          numbered && "pl-2",
          active
            ? numbered
              ? "font-bold underline decoration-2 underline-offset-4 bg-black/10"
              : "bg-black/15 font-semibold"
            : "font-medium text-neutral-900/85 hover:bg-black/10 hover:text-neutral-900"
        )}
        style={{ paddingLeft: `${indent * 12 + 12}px` }}
      >
        {item.listIndex != null && (
          <span className="min-w-[1.1rem] shrink-0 tabular-nums">{item.listIndex}.</span>
        )}
        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
        <span>{item.label}</span>
      </Link>
    );
  }

  function renderSectionHeader(item: NavSectionHeader, indent: number) {
    return (
      <div
        key={`header-${item.label}`}
        className="border-b border-black/15 px-3 pb-1.5 pt-4 text-xs font-semibold uppercase tracking-wider text-neutral-800/90 first:pt-1"
        style={{ paddingLeft: `${indent * 12 + 12}px` }}
      >
        {item.label}
      </div>
    );
  }

  function renderGroup(item: NavGroupItem, indent: number) {
    const isOpen = expandedGroups[item.id] ?? true;
    const hasActiveChild = item.children.some(
      (leaf) =>
        pathname === leaf.href || pathname.startsWith(leaf.href + "/")
    );

    return (
      <div key={item.id} className="mt-1 first:mt-0">
        <button
          type="button"
          onClick={() => toggleGroup(item.id)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-800/80 transition-colors hover:bg-black/10 hover:text-neutral-900",
            hasActiveChild && "text-neutral-900"
          )}
          style={{ paddingLeft: `${indent * 12 + 12}px` }}
        >
          <ChevronDown
            className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")}
          />
          <span className="text-left">{item.label}</span>
        </button>
        {isOpen && (
          <div className="mt-0.5 space-y-0.5">
            {item.children.map((leaf) => renderLeaf(leaf, indent + 1))}
          </div>
        )}
      </div>
    );
  }

  function renderCollapsible(item: NavCollapsibleItem) {
    const isOpen = expanded[item.basePath] ?? false;
    const isChildActive = pathname.startsWith(item.basePath);

    return (
      <div key={item.basePath}>
        <button
          type="button"
          onClick={() => toggleSection(item.basePath)}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-neutral-900",
            isChildActive
              ? "bg-black/15 font-semibold"
              : "text-neutral-900/85 hover:bg-black/10"
          )}
        >
          {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="mt-1 space-y-0.5 pb-1">
            {item.children.map((child) => {
              if (child.type === "section-header") {
                return renderSectionHeader(child, 2);
              }
              if (child.type === "group") {
                return renderGroup(child, 2);
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
    <aside className="flex w-56 shrink-0 flex-col border-r border-black/10 bg-[hsl(var(--sidebar-bg))] px-4 py-5">
      <div className="mb-5 px-1">
        <div className="mb-2 flex items-center justify-between gap-1">
          <span className="text-lg font-black tracking-tight text-neutral-900">TRAZA</span>
          <span className="flex gap-0.5 text-neutral-900">
            <Shirt className="h-5 w-5" strokeWidth={2.2} aria-hidden />
            <Shirt className="h-5 w-5 -translate-x-1" strokeWidth={2.2} aria-hidden />
          </span>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-2 rounded-full border border-neutral-900",
                i < 3 ? "bg-neutral-900" : "bg-transparent"
              )}
            />
          ))}
        </div>
      </div>
      <nav className="space-y-1">{navItems.map(renderItem)}</nav>
    </aside>
  );
}
