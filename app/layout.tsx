import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { SonnerToaster } from "@/shared/ui";
import { generateSiteMetadata } from "@/features/seo";
import { AnalyticsProvider, GAScript } from "@/features/analytics";
import { MonitoringProvider } from "@/features/monitoring";
import { CookieBanner } from "@/features/cookie-consent";
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
        <GAScript />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <MonitoringProvider>
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </MonitoringProvider>
            <SonnerToaster richColors position="bottom-right" />
            <CookieBanner />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
