import { redirect } from "next/navigation";
import { auth } from "@/features/auth";
import { DashboardSidebar, DashboardTopbar } from "@/features/landing";
import { SessionProvider } from "next-auth/react";

// Dev-only mock session for testing without OAuth
const devSession =
  process.env.NODE_ENV === "development" && !process.env.GOOGLE_CLIENT_ID
    ? {
        user: {
          id: "dev-user",
          name: "Dev User",
          email: "dev@localhost",
          image: null,
          role: "USER",
        },
        expires: new Date(Date.now() + 86400000).toISOString(),
      }
    : null;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = devSession ?? (await auth());
  if (!session) redirect("/");

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
