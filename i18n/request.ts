import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "ko"] as const;
const DEFAULT_LOCALE = "en";

function resolveLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0])
    .find((lang) => SUPPORTED_LOCALES.includes(lang as (typeof SUPPORTED_LOCALES)[number]));

  return preferred ?? DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const headersList = await headers();
  const locale = resolveLocale(headersList.get("accept-language"));

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
