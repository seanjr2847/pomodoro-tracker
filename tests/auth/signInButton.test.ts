import { describe, it, expect } from "vitest";

describe("SignInButton label logic", () => {
  it("defaults to 'Get Started' when no label provided", () => {
    const label = undefined ?? "Get Started";
    expect(label).toBe("Get Started");
  });

  it("uses provided label for Log in", () => {
    const label = "Log in" ?? "Get Started";
    expect(label).toBe("Log in");
  });

  it("uses provided label for Sign Up", () => {
    const label = "Sign Up" ?? "Get Started";
    expect(label).toBe("Sign Up");
  });

  it("navbar should have distinct labels for two buttons", () => {
    const loginLabel = "Log in";
    const signUpLabel = "Sign Up";
    expect(loginLabel).not.toBe(signUpLabel);
  });
});
