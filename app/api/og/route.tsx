import { ImageResponse } from "@vercel/og";
import { DefaultOG } from "@/features/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? undefined;
  const rawDescription = searchParams.get("description") ?? undefined;

  // Input validation: truncate to safe lengths
  const title = rawTitle?.slice(0, 100);
  const description = rawDescription?.slice(0, 200);

  return new ImageResponse(<DefaultOG title={title} description={description} />, {
    width: 1200,
    height: 630,
  });
}
