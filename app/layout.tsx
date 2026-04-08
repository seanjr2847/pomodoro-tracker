import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

>>>>>>> 97a9b91764f415196c300c2eaf880163656b1071
>>>>>>> 59ae8c622d47cf77f719d73ca7f578c98600f5b2
import { SonnerToaster } from "@/shared/ui";
import { generateSiteMetadata } from "@/features/seo";
import {
  FeatureProviders,
  FeatureHeadScripts,
  FeatureOverlays,
} from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = generateSiteMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <FeatureHeadScripts />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
<<<<<<< HEAD
            <FeatureProviders>{children}</FeatureProviders>
=======
            <MonitoringProvider>
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </MonitoringProvider>
>>>>>>> 59ae8c622d47cf77f719d73ca7f578c98600f5b2
            <SonnerToaster richColors position="bottom-right" />
            <FeatureOverlays />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
