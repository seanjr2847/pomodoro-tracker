import { auth } from "@/features/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BillingStatus, isBillingEnabled, getSubscriptionByUserId } from "@/features/billing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from "@/shared/ui";
import { DeleteAccountButton } from "./DeleteAccountButton";

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

export default async function SettingsPage() {
  const session = devSession ?? (await auth());
  if (!session?.user) redirect("/");
  const t = await getTranslations("settings");

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile")}</CardTitle>
          <CardDescription>{t("profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ""} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isBillingEnabled && (
        <SubscriptionSection userId={session.user.id!} t={t} />
      )}

      <Separator />

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
    </div>
  );
}

async function SubscriptionSection({
  userId,
  t,
}: {
  userId: string;
  t: Awaited<ReturnType<typeof getTranslations<"settings">>>;
}) {
  const subscription = await getSubscriptionByUserId(userId);
  const plan = subscription?.plan ?? "Free";
  const renewalDate = subscription?.currentPeriodEnd
    ? subscription.currentPeriodEnd.toLocaleDateString()
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("subscription")}</CardTitle>
        <CardDescription>{t("subscriptionDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <BillingStatus plan={plan} renewalDate={renewalDate} />
      </CardContent>
    </Card>
  );
}
