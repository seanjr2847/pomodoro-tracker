import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { PublicBanner, resolveShareSlugAction } from "@/features/share";

export default async function SharedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await resolveShareSlugAction(slug);

  if (!result || !("success" in result) || !result.success) notFound();

  const data = result.data;
  if (!data) notFound();

  if ("expired" in data && data.expired) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">This link has expired</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The owner may create a new share link.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Shared Content</CardTitle>
          {"resourceType" in data && (
            <p className="text-sm text-muted-foreground">
              {data.resourceType} &middot; {data.resourceId}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Resource content would be loaded here based on resourceType and resourceId.
          </p>
        </CardContent>
      </Card>
      <div className="mt-8">
        <PublicBanner />
      </div>
    </main>
  );
}
