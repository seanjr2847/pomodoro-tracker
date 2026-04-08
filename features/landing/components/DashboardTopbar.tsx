"use client";

import { usePathname } from "next/navigation";
import { Search, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { UserMenu } from "@/features/auth";
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui";
import { DashboardSidebar } from "./DashboardSidebar";

const pathLabels: Record<string, string> = {
  "api-keys": "API Keys",
  settings: "Settings",
  history: "History",
  kanban: "Kanban",
};

function TopbarBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const currentSegment = segments[segments.length - 1];
  const currentLabel = pathLabels[currentSegment] ?? currentSegment;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="text-muted-foreground">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">{currentLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-8 w-8"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function DashboardTopbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <DashboardSidebar />
        </div>
        <TopbarBreadcrumb />
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 h-8 text-xs text-muted-foreground px-3"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            ⌘K
          </kbd>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
        <div className="ml-1">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
