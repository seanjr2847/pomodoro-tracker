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

          // Default: deny analytics until user consents
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
          });

          // Check existing consent
          var consent = localStorage.getItem('cookie-consent');
          if (consent === 'accepted') {
            gtag('consent', 'update', {
              analytics_storage: 'granted',
            });
          }

          gtag('js', new Date());
          gtag('config', '${analyticsConfig.gaId}');
        `}
      </Script>
    </>
  );
}
