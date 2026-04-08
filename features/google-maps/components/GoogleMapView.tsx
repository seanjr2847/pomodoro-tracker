"use client";

import { isGoogleMapsEnabled } from "../lib/config";
import type { GoogleMapProps } from "../types";

/**
 * Google Maps placeholder component.
 * To enable, install @vis.gl/react-google-maps:
 *   pnpm add @vis.gl/react-google-maps
 * Then restore the full implementation.
 */
export function GoogleMapView({ className }: GoogleMapProps) {
  if (!isGoogleMapsEnabled) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-8 text-sm text-muted-foreground ${className ?? ""}`}
      >
        Google Maps API key가 설정되지 않았습니다.
        <br />
        <code className="mt-1 font-mono text-xs">
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-8 text-sm text-muted-foreground ${className ?? ""}`}
    >
      Google Maps 컴포넌트를 사용하려면{" "}
      <code className="mx-1 font-mono text-xs">
        pnpm add @vis.gl/react-google-maps
      </code>
      를 설치하세요.
    </div>
  );
}
