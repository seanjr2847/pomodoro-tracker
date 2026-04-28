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
    plans: Array<{
      id: string;
      name: string;
      price: string;
      features: string[];
      highlighted?: boolean;
      cta: string;
      href?: string;
      priceId?: string;
    }>;
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
    primaryDark: "#818cf8",
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
      href: "/#features",
      image: "https://placehold.co/960x540/f5f5f5/a3a3a3?text=Analytics+Dashboard",
    },
    {
      tab: "Automation",
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and focus on what truly matters.",
      href: "/#features",
      image: "https://placehold.co/960x540/f0f4ff/6366f1?text=Automation+Workflows",
    },
    {
      tab: "Collaboration",
      title: "Team Collaboration",
      description:
        "Work together seamlessly with built-in collaboration tools.",
      href: "/#features",
      image: "https://placehold.co/960x540/f0fdf4/16a34a?text=Team+Workspace",
    },
  ],

  logos: [
    { src: "https://cdn.worldvectorlogo.com/logos/vercel.svg", alt: "Vercel", href: "https://vercel.com" },
    { src: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg", alt: "Stripe", href: "https://stripe.com" },
    { src: "https://cdn.worldvectorlogo.com/logos/notion-2.svg", alt: "Notion", href: "https://notion.so" },
    { src: "https://cdn.worldvectorlogo.com/logos/linear-1.svg", alt: "Linear", href: "https://linear.app" },
    { src: "https://cdn.worldvectorlogo.com/logos/figma-1.svg", alt: "Figma", href: "https://figma.com" },
  ],

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
      cta: { text: "Explore Analytics", href: "/#features" },
      image: "https://placehold.co/960x480/0f172a/94a3b8?text=User+Analytics+Overview",
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
    {
      badge: "Automation",
      title: "Let the platform do the heavy lifting",
      description:
        "Build powerful workflows that run automatically. From onboarding emails to billing reminders — automate the repetitive so your team can focus on growth.",
      cta: { text: "See Automation", href: "/#features" },
      image: "https://placehold.co/960x480/0f172a/94a3b8?text=Workflow+Automation",
      cards: [
        {
          icon: "Zap",
          title: "Trigger-based Workflows",
          description: "Fire actions on any user or system event.",
          href: null,
        },
        {
          icon: "Mail",
          title: "Email Sequences",
          description: "Drip campaigns that convert and retain.",
          href: null,
        },
        {
          icon: "Bell",
          title: "Smart Notifications",
          description: "Reach users on the right channel at the right time.",
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
      avatar: "https://i.pravatar.cc/64?img=47",
    },
    {
      quote:
        "The best boilerplate we've used. Auth, billing, and dashboard — all production-ready from day one.",
      name: "Alex Kim",
      role: "Founder",
      company: "Launchpad",
      companyLogo: null,
      avatar: "https://i.pravatar.cc/64?img=12",
    },
  ],

  integrations: {
    title: "Connects with your stack",
    description: "Plug into the tools your team already uses. No migration required.",
    cta: { text: "View all integrations", href: "/#integrations" },
    items: [
      { name: "Stripe", icon: "CreditCard", href: "https://stripe.com" },
      { name: "Slack", icon: "MessageSquare", href: "https://slack.com" },
      { name: "GitHub", icon: "GitBranch", href: "https://github.com" },
      { name: "Notion", icon: "FileText", href: "https://notion.so" },
      { name: "Figma", icon: "Layers", href: "https://figma.com" },
      { name: "Vercel", icon: "Triangle", href: "https://vercel.com" },
    ],
  },

  cta: {
    title: "Ready to get started?",
    subtitle: "Join thousands of teams already using Acme SaaS.",
    button: { text: "Start for free", href: "/dashboard" },
  },

  pricing: {
    plans: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        features: [
          "Up to 3 projects",
          "Basic analytics",
          "Community support",
          "1GB storage",
        ],
        cta: "Get Started",
        href: "/dashboard",
      },
      {
        id: "pro",
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
        highlighted: true,
        cta: "Upgrade to Pro",
      },
    ],
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

  dashboardMenu: [
    { label: "Kanban", href: "/dashboard/kanban", icon: "Kanban" },
    { label: "History", href: "/dashboard/history", icon: "History" },
  ],

  social: {
    twitter: "https://twitter.com/acme",
    github: "https://github.com/acme",
  },
};
