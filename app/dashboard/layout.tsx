import { redirect } from "next/navigation";
import { auth } from "@/features/auth";
import { devSession } from "@/features/auth";
import { DashboardSidebar, DashboardTopbar } from "@/features/landing";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/shared/providers/QueryProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = devSession ?? (await auth());
  if (!session) redirect("/");

  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <div className="flex h-dvh bg-background">
          <DashboardSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardTopbar />
            <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </QueryProvider>
    </SessionProvider>
  );
}
