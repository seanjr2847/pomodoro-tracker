"use client";

import Script from "next/script";
import { paddleClientConfig } from "../config/paddle";

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  if (!paddleClientConfig.clientToken) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Paddle?.Initialize({
            token: paddleClientConfig.clientToken,
            environment: paddleClientConfig.environment,
          });
        }}
      />
    </>
  );
}
