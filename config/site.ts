export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  creator: string;
  email: string;

  theme: {
    primary: string;
    primaryDark?: string;
    gradient: string;
  };

  banner: {
    text: string;
    href: string;
  } | null;

  hero: {
    title: string;
    subtitle: string;
    cta: {
      primary: { text: string; href: string };
      secondary: { text: string; href: string } | null;
    };
  };

  featureTabs: Array<{
    tab: string;
    title: string;
    description: string;
    href: string;
    image: string | null;
  }>;

  logos: Array<{
    src: string;
    alt: string;
    href: string | null;
  }>;

  value: {
    title: string;
    description: string;
    highlights: string[];
  } | null;

  sections: Array<{
    badge: string;
    title: string;
    description: string;
    cta: { text: string; href: string };
    image: string | null;
    cards: Array<{
      icon: string;
      title: string;
      description: string;
      href: string | null;
    }>;
  }>;

  testimonials: Array<{
    quote: string;
    name: string;
    role: string;
    company: string;
    companyLogo: string | null;
    avatar: string | null;
  }>;

  integrations: {
    title: string;
    description: string;
    cta: { text: string; href: string };
    items: Array<{ name: string; icon: string; href: string }>;
  } | null;

  cta: {
    title: string;
    subtitle: string | null;
    button: { text: string; href: string };
  };

  pricing: {
    free: { name: string; price: string; features: string[] };
    pro: { name: string; price: string; features: string[] };
  };

  legal: {
    companyName: string;
    country: string;
    effectiveDate: string;
  };

  about: {
    headline: string;
    story: string;
    mission: { title: string; description: string } | null;
    values: Array<{ title: string; description: string }>;
    team: Array<{
      name: string;
      role: string;
      image: string | null;
      link: string | null;
    }>;
  } | null;

  dashboardMenu?: Array<{
    label: string;
    href: string;
    icon: string;
  }>;

  emptyState?: {
    icon: string;
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
  };

  social: {
    twitter?: string;
    github?: string;
    discord?: string;
  } | null;
}

export const siteConfig: SiteConfig = {
  name: "Acme SaaS",
  description: "The modern platform to supercharge your workflow.",
  url: "https://acme.example.com",
  creator: "Acme Inc.",
  email: "hello@acme.example.com",

  theme: {
    primary: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
  },

  banner: {
    text: "We just launched v2.0 — Check out what's new!",
    href: "/blog",
  },

  hero: {
    title: "Build faster.\nShip smarter.",
    subtitle:
      "Everything you need to launch your SaaS in days, not months. Authentication, billing, and a beautiful landing page — all in one template.",
    cta: {
      primary: { text: "Get Started Free", href: "/dashboard" },
      secondary: { text: "View on GitHub", href: "https://github.com" },
    },
  },

  featureTabs: [
    {
      tab: "Analytics",
      title: "Real-time Analytics",
      description:
        "Track every metric that matters with our powerful analytics dashboard.",
      href: "/features/analytics",
      image: null,
    },
    {
      tab: "Automation",
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and focus on what truly matters.",
      href: "/features/automation",
      image: null,
    },
    {
      tab: "Collaboration",
      title: "Team Collaboration",
      description:
        "Work together seamlessly with built-in collaboration tools.",
      href: "/features/collaboration",
      image: null,
    },
  ],

  logos: [],

  value: {
    title: "Why teams choose Acme",
    description:
      "We help thousands of teams ship better products, faster. Our platform handles the infrastructure so you can focus on building.",
    highlights: ["10x faster", "99.9% uptime", "Enterprise-grade security"],
  },

  sections: [
    {
      badge: "Analytics",
      title: "Understand your users like never before",
      description:
        "Gain deep insights into user behavior with our powerful analytics engine. Track conversions, monitor engagement, and make data-driven decisions.",
      cta: { text: "Learn more", href: "/features/analytics" },
      image: null,
      cards: [
        {
          icon: "BarChart3",
          title: "Real-time Dashboards",
          description: "Monitor your key metrics in real-time.",
          href: null,
        },
        {
          icon: "TrendingUp",
          title: "Growth Tracking",
          description: "Track your growth trajectory over time.",
          href: null,
        },
        {
          icon: "Users",
          title: "User Segmentation",
          description: "Segment users by behavior and attributes.",
          href: null,
        },
      ],
    },
  ],

  testimonials: [
    {
      quote:
        "Acme SaaS cut our development time in half. We launched our product in just two weeks.",
      name: "Jane Doe",
      role: "CTO",
      company: "TechCorp",
      companyLogo: null,
      avatar: null,
    },
  ],

  integrations: null,

  cta: {
    title: "Ready to get started?",
    subtitle: "Join thousands of teams already using Acme SaaS.",
    button: { text: "Start for free", href: "/dashboard" },
  },

  pricing: {
    free: {
      name: "Free",
      price: "$0",
      features: [
        "Up to 3 projects",
        "Basic analytics",
        "Community support",
        "1GB storage",
      ],
    },
    pro: {
      name: "Pro",
      price: "$19/mo",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "100GB storage",
        "Custom domains",
        "Team collaboration",
      ],
    },
  },

  legal: {
    companyName: "Acme Inc.",
    country: "United States",
    effectiveDate: "2026-01-01",
  },

  about: {
    headline: "We're building the future of SaaS tooling.",
    story:
      "Acme started in 2024 with a simple idea: launching a SaaS product shouldn't take months. We've been building tools that help developers ship faster, so they can focus on solving real problems for their users.",
    mission: {
      title: "Our Mission",
      description:
        "To eliminate repetitive setup work and let every developer launch a production-ready SaaS in days, not months.",
    },
    values: [
      {
        title: "Ship Fast",
        description: "We believe in rapid iteration and getting products in front of users quickly.",
      },
      {
        title: "Stay Simple",
        description: "Complexity is the enemy. We keep our tools lean and focused.",
      },
      {
        title: "Open by Default",
        description: "Transparency builds trust. We share our work openly whenever we can.",
      },
    ],
    team: [
      { name: "Jane Doe", role: "Founder & CEO", image: null, link: null },
      { name: "John Smith", role: "CTO", image: null, link: null },
    ],
  },

  social: {
    twitter: "https://twitter.com/acme",
    github: "https://github.com/acme",
  },
};
