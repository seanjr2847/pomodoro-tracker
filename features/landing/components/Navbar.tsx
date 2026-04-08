"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/shared/ui";
import { SignInButton } from "@/features/auth";
import { cn } from "@/shared/utils/cn";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-30 w-full transition-all",
        scrolled
          ? "border-b border-neutral-100 bg-white/75 backdrop-blur-lg dark:border-white/10 dark:bg-black/75"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-14 max-w-screen-lg items-center justify-between px-3 lg:px-4 xl:px-0">
        {/* Logo */}
        <Link href="/" className="text-lg font-medium tracking-tight">
          {siteConfig.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-900/5 dark:text-white/70 dark:hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 lg:flex">
          <SignInButton variant="ghost" className="h-8 rounded-lg px-4 text-[0.8125rem]" label="Log in" />
          <SignInButton
            variant="default"
            className="h-8 rounded-lg border border-black bg-black px-4 text-[0.8125rem] text-white hover:ring-4 hover:ring-neutral-200 dark:border-white dark:bg-white dark:text-black dark:hover:ring-white/10"
            label="Sign Up"
          />
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-1 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <SignInButton variant="outline" className="h-10 rounded-lg border border-neutral-300 bg-white text-sm dark:border-white/20 dark:bg-transparent" label="Log in" />
                <SignInButton variant="default" className="h-10 rounded-lg border border-black bg-black text-sm text-white dark:border-white dark:bg-white dark:text-black" label="Sign Up" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
