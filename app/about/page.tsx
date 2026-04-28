import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/features/landing";
import { Footer } from "@/features/landing";
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent } from "@/shared/ui";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}`,
};

export default function AboutPage() {
  const { about } = siteConfig;
  if (!about) notFound();

  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-black">
      <Navbar />

      <main className="mx-auto max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
        {/* Headline */}
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="font-sans text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.15] dark:text-white">
            {about.headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            {about.story}
          </p>
        </section>

        {/* Mission */}
        {about.mission && (
          <section className="mx-auto mt-20 max-w-2xl text-center">
            <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
              {about.mission.title}
            </span>
            <p className="mt-4 text-xl font-medium leading-relaxed text-neutral-900 dark:text-white">
              {about.mission.description}
            </p>
          </section>
        )}

        {/* Values */}
        {about.values.length > 0 && (
          <section className="mt-20">
            <h2 className="text-center font-sans text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">
              Our Values
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((v) => (
                <Card
                  key={v.title}
                  className="border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900"
                >
                  <CardContent className="p-6">
                    <h3 className="font-medium text-neutral-900 dark:text-white">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {v.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Team */}
        {about.team.length > 0 && (
          <section className="mt-20">
            <h2 className="text-center font-sans text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">
              Meet the Team
            </h2>
            <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {about.team.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                const content = (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.image ?? undefined} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-neutral-200 to-neutral-300 text-lg font-medium text-neutral-700 dark:from-neutral-700 dark:to-neutral-600 dark:text-neutral-200">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {member.role}
                      </p>
                    </div>
                  </div>
                );

                return member.link ? (
                  <a
                    key={member.name}
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl p-6 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={member.name} className="p-6">
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
