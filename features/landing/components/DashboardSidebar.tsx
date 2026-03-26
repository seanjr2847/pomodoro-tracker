"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Key, Settings, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Button, Sheet, SheetContent, SheetTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { LucideIconByName } from "@/shared/ui/lucide-icon";
import { cn } from "@/shared/utils/cn";

const STORAGE_KEY = "sidebar-collapsed";

const defaultItems = [
  { label: "Home", href: "/dashboard", icon: "Home" },
  { label: "API Keys", href: "/dashboard/api-keys", icon: "Key" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

function getMenuItems() {
  const extra = siteConfig.dashboardMenu ?? [];
  return [...defaultItems.slice(0, 1), ...extra, ...defaultItems.slice(1)];
}

const iconComponents: Record<string, typeof Home> = { Home, Key, Settings };

function MenuIcon({ name, className }: { name: string; className?: string }) {
  const BuiltIn = iconComponents[name];
  if (BuiltIn) return <BuiltIn className={className} />;
  return <LucideIconByName name={name} className={className} />;
}

function SidebarContent({ collapsed, onToggle }: { collapsed: boolean; onToggle?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const items = getMenuItems();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="truncate text-lg font-bold">
            {siteConfig.name}
          </Link>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const translationKey = item.label.toLowerCase();
          const label = translationKey === "home" || translationKey === "settings"
            ? t(translationKey)
            : item.label;

          const link = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <MenuIcon name={item.icon} className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{link}</div>;
        })}
      </nav>
    </div>
  );
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 border-r transition-[width] duration-200 md:block",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={toggle} />
      </aside>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
