const CONSENT_KEY = "cookie-consent";

export type ConsentStatus = "accepted" | "declined" | null;

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentStatus;
}

export function setConsent(status: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, status);
}

export function hasConsented(): boolean {
  return getConsent() === "accepted";
}

export function hasResponded(): boolean {
  return getConsent() !== null;
}
