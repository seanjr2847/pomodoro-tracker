import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { AnimateOnScroll } from "@/shared/ui/animate-on-scroll";
import type { SiteConfig } from "@/config/site";

type TestimonialData = SiteConfig["testimonials"][number];

export function Testimonial({ testimonial }: { testimonial: TestimonialData }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <section className="mx-auto max-w-screen-lg px-3 lg:px-4 xl:px-0">
      <AnimateOnScroll animation="fade-in">
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 dark:border-white/10 dark:bg-neutral-900 sm:px-12">
        <blockquote className="text-center text-lg font-medium italic leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-xl">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <div className="mt-8 flex flex-col items-center gap-3">
          {testimonial.companyLogo && (
            <img
              src={testimonial.companyLogo}
              alt={testimonial.company}
              className="mb-2 h-6 opacity-60 dark:opacity-40"
            />
          )}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={testimonial.avatar ?? undefined} alt={testimonial.name} />
              <AvatarFallback className="bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-medium text-neutral-700 dark:from-neutral-700 dark:to-neutral-600 dark:text-neutral-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {testimonial.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
          </div>
        </div>
      </div>
      </AnimateOnScroll>
    </section>
  );
}
