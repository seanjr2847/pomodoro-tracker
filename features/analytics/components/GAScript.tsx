import Script from "next/script";
import { analyticsConfig, isGAEnabled } from "../lib/config";

export function GAScript() {
  if (!isGAEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsConfig.gaId}');
        `}
      </Script>
    </>
  );
}
