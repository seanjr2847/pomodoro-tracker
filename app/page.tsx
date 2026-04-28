import { LandingPage } from "@/features/landing";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/features/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <LandingPage />
    </>
  );
}
