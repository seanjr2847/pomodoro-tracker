const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmKey = (typeof UTM_PARAMS)[number];
export type UtmData = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "utm_params";

export function parseUtmParams(searchParams: URLSearchParams): UtmData {
  const utm: UtmData = {};
  for (const key of UTM_PARAMS) {
    const value = searchParams.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export function saveUtmParams(utm: UtmData): void {
  if (typeof window === "undefined" || Object.keys(utm).length === 0) return;
  try {
    const existing = getUtmParams();
    const merged = { ...existing, ...utm };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // sessionStorage unavailable
  }
}

export function getUtmParams(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}

export function captureUtmFromUrl(): UtmData {
  if (typeof window === "undefined") return {};
  const utm = parseUtmParams(new URLSearchParams(window.location.search));
  saveUtmParams(utm);
  return utm;
}
