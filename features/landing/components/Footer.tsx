import Link from "next/link";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "제품",
    links: [
      { label: "기능", href: "/#features" },
      { label: "요금제", href: "/pricing" },
      { label: "블로그", href: "/blog" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "/about" },
      { label: "블로그", href: "/blog" },
    ],
  },
  {
    title: "법률",
    links: [
      { label: "개인정보", href: "/privacy" },
      { label: "약관", href: "/terms" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mb-20 mt-20 max-w-screen-lg px-3 lg:px-4 xl:px-0">
      <div className="rounded-t-2xl border border-neutral-200 bg-white/50 backdrop-blur-lg dark:border-white/10 dark:bg-neutral-900/50">
        <div className="py-16 px-6 sm:px-12">
          <div className="grid grid-cols-2 gap-8 xl:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                  {col.title}
                </h3>
                <ul className="mt-2.5 flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social */}
            {siteConfig.social && (
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                  소셜
                </h3>
                <ul className="mt-2.5 flex flex-col gap-3.5">
                  {siteConfig.social.twitter && (
                    <li>
                      <a
                        href={siteConfig.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                      >
                        Twitter
                      </a>
                    </li>
                  )}
                  {siteConfig.social.github && (
                    <li>
                      <a
                        href={siteConfig.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                      >
                        GitHub
                      </a>
                    </li>
                  )}
                  {siteConfig.social.discord && (
                    <li>
                      <a
                        href={siteConfig.social.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                      >
                        Discord
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-white/10">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              &copy; {year} {siteConfig.legal.companyName.replace(/\.$/, "")}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
