import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { siteConfig } from "@/config/site";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
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

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable}`} suppressHydrationWarning>
      <head>
        <FeatureHeadScripts />
      </head>
      <body
        className="antialiased"
        style={{
          "--site-primary": siteConfig.theme.primary,
          "--site-primary-dark": siteConfig.theme.primaryDark ?? siteConfig.theme.primary,
          "--site-gradient": siteConfig.theme.gradient,
        } as React.CSSProperties}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <FeatureProviders>{children}</FeatureProviders>
            <SonnerToaster richColors position="bottom-right" />
            <FeatureOverlays />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
