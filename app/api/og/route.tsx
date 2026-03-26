import { ImageResponse } from "@vercel/og";
import { DefaultOG } from "@/features/og/templates/DefaultOG";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? undefined;
  const description = searchParams.get("description") ?? undefined;

  return new ImageResponse(<DefaultOG title={title} description={description} />, {
    width: 1200,
    height: 630,
  });
}
