import { LegalDocument, getPrivacyPolicy } from "@/features/legal";
import { Navbar } from "@/features/landing";
import { Footer } from "@/features/landing";

export default function PrivacyPage() {
  const data = getPrivacyPolicy();
  return (
    <>
      <Navbar />
      <LegalDocument {...data} />
      <Footer />
    </>
  );
}
