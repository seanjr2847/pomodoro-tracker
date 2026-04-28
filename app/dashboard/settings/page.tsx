import Link from "next/link";
import { auth, devSession } from "@/features/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Separator,
} from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { DeleteAccountButton } from "./DeleteAccountButton";

// ── billing (삭제 시 이 import + 아래 JSX 제거) ──
import { isBillingEnabled, BillingSection } from "./BillingSection";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "billing", label: "Billing", show: isBillingEnabled },
  { id: "security", label: "Security" },
  { id: "danger", label: "Danger Zone" },
].filter((t) => t.show !== false);

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = devSession ?? (await auth());
  if (!session?.user) redirect("/");
  const t = await getTranslations("settings");
  const { tab = "profile" } = await searchParams;

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      {/* Tab navigation */}
      <div className="border-b">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((tabItem) => (
            <Link
              key={tabItem.id}
              href={`?tab=${tabItem.id}`}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                tab === tabItem.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
              )}
            >
              {tabItem.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>{t("profileDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? ""}
                />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold">{session.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {session.user.email}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {(session.user as { role?: string }).role ?? "USER"}
                </Badge>
              </div>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Profile information is managed through your OAuth provider.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Billing tab */}
      {tab === "billing" && isBillingEnabled && (
        <BillingSection
          userId={session.user.id!}
          labels={{
            title: t("subscription"),
            description: t("subscriptionDescription"),
          }}
        />
      )}

      {/* Security tab */}
      {tab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Security settings coming soon.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Danger tab */}
      {tab === "danger" && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">{t("dangerZone")}</CardTitle>
            <CardDescription>{t("dangerDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountButton
              triggerLabel={t("deleteAccount")}
              title={t("deleteConfirmTitle")}
              description={t("deleteConfirmDescription")}
              cancelLabel={t("deleteConfirmCancel")}
              actionLabel={t("deleteConfirmAction")}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
