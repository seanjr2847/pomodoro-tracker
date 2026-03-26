import type { SiteConfig } from "@/config/site";

type Section = SiteConfig["sections"][number];
type TestimonialData = SiteConfig["testimonials"][number];

export type InterleavedItem =
  | { type: "section"; data: Section }
  | { type: "testimonial"; data: TestimonialData };

/**
 * Interleave sections and testimonials:
 * Section[0], Testimonial[0], Section[1], Testimonial[1], ...
 */
export function interleave(
  sections: Section[],
  testimonials: TestimonialData[]
): InterleavedItem[] {
  const items: InterleavedItem[] = [];
  const maxLen = Math.max(sections.length, testimonials.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < sections.length) {
      items.push({ type: "section", data: sections[i] });
    }
    if (i < testimonials.length) {
      items.push({ type: "testimonial", data: testimonials[i] });
    }
  }

  return items;
}
