"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import { BarChart3, Zap, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, Card, CardContent, Button } from "@/shared/ui";

const tabIcons: Record<string, React.ReactNode> = {
  Analytics: <BarChart3 className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />,
  Automation: <Zap className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />,
  Collaboration: <Users className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />,
};

export function FeatureTabs() {
  const { featureTabs } = siteConfig;

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

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Tabs defaultValue={featureTabs[0].tab} className="w-full">
        <TabsList className="mx-auto flex w-fit">
          {featureTabs.map((tab) => (
            <TabsTrigger key={tab.tab} value={tab.tab}>
              {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {featureTabs.map((tab) => (
          <TabsContent key={tab.tab} value={tab.tab} className="mt-8">
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold">{tab.title}</h3>
                <p className="mt-3 text-muted-foreground">{tab.description}</p>
                <div className="mt-6 overflow-hidden rounded-lg border">
                  {tab.image ? (
                    <img src={tab.image} alt={tab.title} className="w-full" />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-neutral-700">
                          {tabIcons[tab.tab] ?? <BarChart3 className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{tab.title}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" className="mt-6">
                  <Link href={tab.href}>Learn more</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
