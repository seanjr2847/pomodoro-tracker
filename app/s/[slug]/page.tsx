import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { PublicBanner } from "@/features/share";
import { resolveShareSlugAction } from "@/features/share/actions/share";

export default async function SharedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await resolveShareSlugAction(slug);

  if (!result) notFound();

  if (result.expired) {
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
          <p className="text-sm text-muted-foreground">
            {result.resourceType} &middot; {result.resourceId}
          </p>
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
