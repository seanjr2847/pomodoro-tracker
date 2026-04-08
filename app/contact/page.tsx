import { Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui";
import { ContactForm } from "@/features/contact";
import { Navbar, Footer } from "@/features/landing";
import { submitContactWithEmail } from "./actions";

export const metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} team.`,
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-3 py-20 lg:px-4 xl:px-0">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription>
              Have a question or feedback? We&apos;d love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm action={submitContactWithEmail} />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
