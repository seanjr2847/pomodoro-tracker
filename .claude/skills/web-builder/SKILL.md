---
name: web-builder
description: "웹사이트 프론트엔드 구현 스킬. Next.js 15 App Router + Tailwind CSS v4 + TypeScript로 디자인 스펙을 실제 코드로 변환한다. 성능 최적화(Core Web Vitals), SEO, 시맨틱 HTML을 포함한다. '구현해줘', '코드 짜줘', '컴포넌트 만들어줘', '페이지 만들어줘', '퍼블리싱', '랜딩페이지 만들어줘' 등의 표현 시 반드시 이 스킬을 사용할 것."
---

# Web Builder Skill

## 목적

UI 스펙을 실제 동작하는 Next.js 코드로 변환한다. 디자인 시스템의 CSS 변수를 Tailwind와 연동하여 일관성 있는 구현을 보장한다.

## 구현 체크리스트

구현 시작 전 확인:
- [ ] `_workspace/01_design_concept.md` 읽음 (컬러/타이포)
- [ ] `_workspace/02_ui_spec.md` 읽음 (컴포넌트/레이아웃)
- [ ] `config/site.ts` 구조 파악 (기존 설정 활용)
- [ ] `app/globals.css` 현재 CSS 변수 확인

## 구현 패턴

### 1. CSS 변수 → Tailwind 연동

`app/globals.css`에 CSS 변수 정의, `tailwind.config`에서 참조:

```css
/* app/globals.css */
@layer base {
  :root {
    --color-brand: oklch(0.55 0.18 264);
    --color-brand-50: oklch(0.97 0.02 264);
    --color-brand-100: oklch(0.93 0.05 264);
    /* ... */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
  }
  .dark {
    --color-brand: oklch(0.65 0.15 264); /* 다크모드에서 약간 밝게 */
  }
}
```

### 2. 섹션 컴포넌트 구조

```tsx
// features/landing/components/HeroSection.tsx
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            ...
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            ...
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/demo">See demo →</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 3. 이미지 최적화

```tsx
import Image from "next/image";

// 좋음
<Image
  src="/hero.webp"
  alt="제품 스크린샷 — 대시보드 메인 화면"
  width={1200}
  height={800}
  priority // Hero 이미지에만
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  className="rounded-xl object-cover"
/>

// 나쁨: alt 없음, sizes 없음
<img src="/hero.png" />
```

### 4. 폰트 로딩

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});
```

### 5. 애니메이션 (Tailwind v4)

```tsx
// 스크롤 트리거 — Intersection Observer
"use client";
import { useEffect, useRef, useState } from "react";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
```

### 6. Skip Navigation (접근성)

```tsx
// app/layout.tsx 또는 루트 레이아웃
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-primary"
>
  메인 콘텐츠로 이동
</a>
<main id="main-content">
  {children}
</main>
```

### 7. 시맨틱 HTML 규칙

```tsx
// 올바른 구조
<header role="banner">
  <nav aria-label="메인 내비게이션">
    <ul role="list">
      <li><a href="/">홈</a></li>
    </ul>
  </nav>
</header>

<main id="main-content">
  <section aria-labelledby="features-heading">
    <h2 id="features-heading">기능</h2>
    {/* 내용 */}
  </section>
</main>

<footer role="contentinfo">
  {/* 푸터 */}
</footer>
```

## 성능 최적화

### Core Web Vitals 목표
- LCP: < 2.5s
- FID/INP: < 100ms
- CLS: < 0.1

### 실천 방법
- Hero 이미지: `priority` 속성 + `preload`
- 비 Hero 이미지: lazy loading (기본값)
- 폰트: `display: swap`으로 FOIT 방지
- 큰 컴포넌트: `dynamic()` import (필요 시)
- 외부 스크립트: `next/script`의 `strategy="lazyOnload"`

## Barrel Export 규칙

```typescript
// features/landing/index.ts에 추가
export { HeroSection } from "./components/HeroSection";
export { FeatureSection } from "./components/FeatureSection";
// ...
```

```typescript
// 올바른 import (barrel 경유)
import { HeroSection } from "@/features/landing";

// 금지 (deep import)
import { HeroSection } from "@/features/landing/components/HeroSection";
```
