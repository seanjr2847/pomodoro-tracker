"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { BarChart3, Zap, Users } from "lucide-react";
import { Card, CardContent, Button } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";

const tabIcons: Record<string, React.ReactNode> = {
  Analytics: <BarChart3 className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />,
  Automation: <Zap className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />,
  Collaboration: <Users className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />,
};

export function FeatureTabs() {
  const { featureTabs } = siteConfig;
  const [activeTab, setActiveTab] = useState(featureTabs[0]?.tab ?? "");

  if (featureTabs.length === 0) return null;

  if (featureTabs.length === 1) {
    const tab = featureTabs[0];
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Card className="p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold">{tab.title}</h3>
            <p className="mt-3 text-muted-foreground">{tab.description}</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href={tab.href}>Learn more</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const activeIndex = featureTabs.findIndex((t) => t.tab === activeTab);
  const activeData = featureTabs[activeIndex] ?? featureTabs[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="w-full">
        {/* Tab triggers */}
        <div className="mx-auto flex w-fit rounded-lg bg-muted p-1">
          {featureTabs.map((tab) => (
            <button
              key={tab.tab}
              onClick={() => setActiveTab(tab.tab)}
              className={cn(
                "relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === tab.tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-md bg-background shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tab.tab}</span>
            </button>
          ))}
        </div>

        {/* Animated tab content */}
        <div className="relative mt-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold">{activeData.title}</h3>
                  <p className="mt-3 text-muted-foreground">{activeData.description}</p>
                  <div className="mt-6 overflow-hidden rounded-lg border">
                    {activeData.image ? (
                      <img src={activeData.image} alt={activeData.title} className="w-full" />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                        <div className="text-center">
                          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-neutral-700">
                            {tabIcons[activeData.tab] ?? <BarChart3 className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{activeData.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button asChild variant="outline" className="mt-6">
                    <Link href={activeData.href}>Learn more</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
