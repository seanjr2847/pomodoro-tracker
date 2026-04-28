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
  name: "Pomodoro Tracker",
  description: "25분 집중. 5분 휴식. 끝없는 성장.",
  url: "https://pomodoro-tracker.vercel.app",
  creator: "Pomodoro Tracker",
  email: "hello@pomodoro-tracker.com",

  theme: {
    primary: "#E84A5F",
    primaryDark: "#F06477",
    gradient: "linear-gradient(135deg, #E84A5F 0%, #F06477 50%, #7BC8A4 100%)",
  },

  banner: null,

  hero: {
    title: "25분 집중. 5분 휴식.\n끝없는 성장.",
    subtitle:
      "포모도로 기법으로 작업 시간을 측정하고, 카테고리별 통계로 집중도를 시각화하세요.",
    cta: {
      primary: { text: "무료로 시작", href: "/timer" },
      secondary: { text: "기능 보기", href: "#features" },
    },
  },

  featureTabs: [
    {
      tab: "타이머",
      title: "스마트 포모도로 타이머",
      description:
        "25분 작업 + 5분 휴식이 자동으로 전환됩니다. 4사이클 후 15분 긴 휴식.",
      href: "/timer",
      image: null,
    },
    {
      tab: "통계",
      title: "시각화된 생산성 분석",
      description:
        "카테고리별 시간 분포, 일일/주간/월간 트렌드를 한눈에 확인하세요.",
      href: "/dashboard",
      image: null,
    },
    {
      tab: "카테고리",
      title: "맞춤형 작업 분류",
      description:
        "공부, 코딩, 운동 등 자신만의 카테고리를 만들고 색상으로 구분하세요.",
      href: "/categories",
      image: null,
    },
  ],

  logos: [],

  value: {
    title: "왜 포모도로 기법인가요?",
    description:
      "25분 집중 사이클은 과학적으로 검증된 생산성 향상 기법입니다. 짧은 휴식으로 피로를 줄이고 장시간 몰입할 수 있습니다.",
    highlights: ["집중력 향상", "번아웃 방지", "자동 기록"],
  },

  sections: [
    {
      badge: "타이머",
      title: "간편한 포모도로 타이머",
      description:
        "시작 버튼 하나로 25분 작업이 시작됩니다. 타이머가 끝나면 브라우저 알림으로 자동 안내됩니다.",
      cta: { text: "타이머 시작", href: "/timer" },
      image: null,
      cards: [
        {
          icon: "Play",
          title: "원클릭 시작",
          description: "복잡한 설정 없이 바로 시작하세요.",
          href: null,
        },
        {
          icon: "Bell",
          title: "자동 알림",
          description: "작업/휴식 전환 시 브라우저 알림.",
          href: null,
        },
        {
          icon: "SkipForward",
          title: "유연한 제어",
          description: "일시정지, 중지, 스킵 자유롭게.",
          href: null,
        },
      ],
    },
    {
      badge: "통계",
      title: "데이터로 보는 나의 집중력",
      description:
        "완료한 포모도로 개수, 카테고리별 시간 분포, 7일/30일 트렌드를 차트로 확인하세요.",
      cta: { text: "통계 보기", href: "/dashboard" },
      image: null,
      cards: [
        {
          icon: "BarChart3",
          title: "주간 누적 시간",
          description: "이번 주 얼마나 집중했는지 Bar 차트로.",
          href: null,
        },
        {
          icon: "PieChart",
          title: "카테고리 비중",
          description: "어떤 작업에 시간을 많이 썼는지 Pie 차트로.",
          href: null,
        },
        {
          icon: "TrendingUp",
          title: "30일 트렌드",
          description: "한 달간 집중도 변화를 라인 차트로.",
          href: null,
        },
      ],
    },
  ],

  testimonials: [
    {
      quote:
        "포모도로 기법을 써보니 실제로 집중력이 올라갔어요. 통계로 확인하니 동기부여도 됩니다!",
      name: "김민준",
      role: "프론트엔드 개발자",
      company: "스타트업",
      companyLogo: null,
      avatar: null,
    },
    {
      quote:
        "25분 단위로 쪼개니까 긴 프로젝트도 부담 없이 시작할 수 있어요. 타이머만 켜면 되니까요.",
      name: "이서연",
      role: "대학생",
      company: "고려대학교",
      companyLogo: null,
      avatar: null,
    },
  ],

  integrations: null,

  cta: {
    title: "지금 바로 집중을 시작하세요",
    subtitle: "로그인 없이도 타이머를 사용할 수 있습니다.",
    button: { text: "타이머 시작", href: "/timer" },
  },

  pricing: {
    plans: [
      {
        id: "free",
        name: "무료",
        price: "₩0",
        features: [
          "무제한 포모도로 타이머",
          "카테고리 관리",
          "7일/30일 통계",
          "브라우저 알림",
        ],
        cta: "시작하기",
        href: "/timer",
      },
    ],
  },

  legal: {
    companyName: "Pomodoro Tracker",
    country: "South Korea",
    effectiveDate: "2026-01-01",
  },

  about: null,

  dashboardMenu: [
    { label: "통계", href: "/dashboard", icon: "BarChart3" },
    { label: "카테고리", href: "/categories", icon: "Tag" },
  ],

  emptyState: {
    icon: "Coffee",
    title: "아직 완료한 포모도로가 없어요",
    description: "타이머를 시작해서 첫 사이클을 완료해보세요",
    ctaText: "타이머 시작",
    ctaHref: "/timer",
  },

  social: null,
};
