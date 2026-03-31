import { describe, it, expect, beforeEach } from "vitest";

// Mock window + localStorage before importing module
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, val: string) => { store[key] = val; },
  removeItem: (key: string) => { delete store[key]; },
};

// @ts-expect-error -- simulate browser window for consent module
globalThis.window = { localStorage: mockLocalStorage };
// @ts-expect-error -- also set localStorage on globalThis for compat
globalThis.localStorage = mockLocalStorage;

import { getConsent, setConsent, hasConsented, hasResponded } from "../lib/consent";

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k]);
});

describe("getConsent", () => {
  it("returns null when no consent stored", () => {
    expect(getConsent()).toBeNull();
  });

  it("returns 'accepted' after accepting", () => {
    setConsent("accepted");
    expect(getConsent()).toBe("accepted");
  });

  it("returns 'declined' after declining", () => {
    setConsent("declined");
    expect(getConsent()).toBe("declined");
  });
});

describe("hasConsented", () => {
  it("returns false when no consent", () => {
    expect(hasConsented()).toBe(false);
  });

  it("returns true after accepting", () => {
    setConsent("accepted");
    expect(hasConsented()).toBe(true);
  });

  it("returns false after declining", () => {
    setConsent("declined");
    expect(hasConsented()).toBe(false);
  });
});

describe("hasResponded", () => {
  it("returns false when no response", () => {
    expect(hasResponded()).toBe(false);
  });

  it("returns true after accepting", () => {
    setConsent("accepted");
    expect(hasResponded()).toBe(true);
  });

  it("returns true after declining", () => {
    setConsent("declined");
    expect(hasResponded()).toBe(true);
  });
});
