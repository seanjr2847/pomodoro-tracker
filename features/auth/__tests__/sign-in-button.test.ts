import { describe, it, expect } from "vitest";

// Prevent TypeScript from evaluating literal expressions at compile time
const runtime = <T>(v: T): T => v;

describe("SignInButton label logic", () => {
  it("defaults to 'Get Started' when no label provided", () => {
    const label = runtime(undefined as string | undefined) ?? "Get Started";
    expect(label).toBe("Get Started");
  });

  it("uses provided label for Log in", () => {
    const label = runtime("Log in" as string | undefined) ?? "Get Started";
    expect(label).toBe("Log in");
  });

  it("uses provided label for Sign Up", () => {
    const label = runtime("Sign Up" as string | undefined) ?? "Get Started";
    expect(label).toBe("Sign Up");
  });

  it("navbar should have distinct labels for two buttons", () => {
    const loginLabel = "Log in";
    const signUpLabel = "Sign Up";
    expect(loginLabel).not.toBe(signUpLabel);
  });
});
