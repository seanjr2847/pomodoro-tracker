"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Key,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { useSession } from "@/features/auth";
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from "@/shared/ui";
import { LucideIconByName } from "@/shared/ui/lucide-icon";
import { cn } from "@/shared/utils/cn";

const STORAGE_KEY = "sidebar-collapsed";

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

function getGroupedMenuItems() {
  return {
    primary: [{ label: "Home", href: "/dashboard", icon: "Home" }] as MenuItem[],
    workspace: (siteConfig.dashboardMenu ?? []) as MenuItem[],
    account: [
      { label: "API Keys", href: "/dashboard/api-keys", icon: "Key" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
    ] as MenuItem[],
  };
}

const iconComponents: Record<string, typeof Home> = { Home, Key, Settings };

function MenuIcon({ name, className }: { name: string; className?: string }) {
  const BuiltIn = iconComponents[name];
  if (BuiltIn) return <BuiltIn className={className} />;
  return <LucideIconByName name={name} className={className} />;
}

function NavItem({
  item,
  isActive,
  collapsed,
  label,
}: {
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
  label: string;
}) {
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
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function NavGroup({
  label,
  items,
  collapsed,
  pathname,
  t,
}: {
  label?: string;
  items: MenuItem[];
  collapsed: boolean;
  pathname: string;
  t: ReturnType<typeof useTranslations>;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-1">
      {label && !collapsed && (
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          {label}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href;
        const key = item.label.toLowerCase();
        const displayLabel =
          key === "home" || key === "settings" ? t(key) : item.label;

        return (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive}
            collapsed={collapsed}
            label={displayLabel}
          />
        );
      })}
    </div>
  );
}

function UserFooter({ collapsed }: { collapsed: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="border-t p-3">
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    );
  }

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const content = (
    <div
      className={cn(
        "flex items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-muted cursor-default",
        collapsed ? "justify-center" : "gap-2.5"
      )}
    >
      <Avatar className="h-6 w-6 shrink-0">
        <AvatarImage src={image ?? undefined} alt={name ?? ""} />
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium leading-none">{name}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground leading-none">
              {email}
            </p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <div className="border-t p-3">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return <div className="border-t p-3">{content}</div>;
}

function SidebarContent({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const { primary, workspace, account } = getGroupedMenuItems();

  return (
    <div className="flex h-full flex-col">
      {/* Brand header */}
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
              {siteConfig.name.charAt(0)}
            </div>
            <span className="truncate text-sm font-semibold">
              {siteConfig.name}
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            {siteConfig.name.charAt(0)}
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <NavGroup
          items={primary}
          collapsed={collapsed}
          pathname={pathname}
          t={t}
        />
        {workspace.length > 0 && (
          <NavGroup
            label="Workspace"
            items={workspace}
            collapsed={collapsed}
            pathname={pathname}
            t={t}
          />
        )}
        <NavGroup
          label="Account"
          items={account}
          collapsed={collapsed}
          pathname={pathname}
          t={t}
        />
      </nav>

      {/* User footer */}
      <UserFooter collapsed={collapsed} />
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
