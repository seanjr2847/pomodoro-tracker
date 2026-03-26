import { LegalDocument, getTermsOfService } from "@/features/legal";
import { Navbar } from "@/features/landing";
import { Footer } from "@/features/landing";

export default function TermsPage() {
  const data = getTermsOfService();
  return (
    <>
      <Navbar />
      <LegalDocument {...data} />
      <Footer />
    </>
  );
}
