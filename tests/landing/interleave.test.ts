import { describe, it, expect } from "vitest";
import { interleave } from "@/features/landing/lib/renderSections";

const section = (badge: string) =>
  ({
    badge,
    title: `Title ${badge}`,
    description: "desc",
    cta: { text: "CTA", href: "/" },
    image: null,
    cards: [],
  }) as any;

const testimonial = (name: string) =>
  ({
    quote: "Great product",
    name,
    role: "CEO",
    company: "Acme",
    companyLogo: null,
    avatar: null,
  }) as any;

describe("interleave", () => {
  it("returns empty array for empty inputs", () => {
    expect(interleave([], [])).toEqual([]);
  });

  it("alternates sections and testimonials of equal length", () => {
    const result = interleave(
      [section("A"), section("B")],
      [testimonial("Alice"), testimonial("Bob")]
    );
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ type: "section", data: section("A") });
    expect(result[1]).toEqual({ type: "testimonial", data: testimonial("Alice") });
    expect(result[2]).toEqual({ type: "section", data: section("B") });
    expect(result[3]).toEqual({ type: "testimonial", data: testimonial("Bob") });
  });

  it("handles more sections than testimonials", () => {
    const result = interleave(
      [section("A"), section("B"), section("C")],
      [testimonial("Alice")]
    );
    expect(result).toHaveLength(4);
    expect(result.map((i) => i.type)).toEqual([
      "section",
      "testimonial",
      "section",
      "section",
    ]);
  });

  it("handles more testimonials than sections", () => {
    const result = interleave(
      [section("A")],
      [testimonial("Alice"), testimonial("Bob"), testimonial("Carol")]
    );
    expect(result).toHaveLength(4);
    expect(result.map((i) => i.type)).toEqual([
      "section",
      "testimonial",
      "testimonial",
      "testimonial",
    ]);
  });

  it("handles sections only", () => {
    const result = interleave([section("A"), section("B")], []);
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.type === "section")).toBe(true);
  });

  it("handles testimonials only", () => {
    const result = interleave([], [testimonial("Alice")]);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("testimonial");
  });
});
