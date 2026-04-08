/**
 * Billing Section for Settings page
 *
 * billing Feature 삭제 시: 이 파일 삭제 + page.tsx에서 import/사용부 제거
 */

import { BillingStatus, isBillingEnabled, getSubscriptionByUserId } from "@/features/billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui";

export { isBillingEnabled };

export async function BillingSection({
  userId,
  labels,
}: {
  userId: string;
  labels: { title: string; description: string };
}) {
  const subscription = await getSubscriptionByUserId(userId);
  const plan = subscription?.plan ?? "Free";
  const renewalDate = subscription?.currentPeriodEnd
    ? subscription.currentPeriodEnd.toLocaleDateString()
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <BillingStatus plan={plan} renewalDate={renewalDate} />
      </CardContent>
    </Card>
  );
}
