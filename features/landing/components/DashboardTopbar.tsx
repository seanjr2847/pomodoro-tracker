import { siteConfig } from "@/config/site";
import { UserMenu } from "@/features/auth";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardTopbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar trigger */}
        <div className="md:hidden">
          <DashboardSidebar />
        </div>
        <span className="text-sm font-semibold md:hidden">{siteConfig.name}</span>
      </div>
      <UserMenu />
    </header>
  );
}
