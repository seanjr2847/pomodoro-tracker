---
name: ui-system
description: "웹사이트 UI 시스템 설계 스킬. 컴포넌트 구조, 레이아웃 그리드, 반응형 브레이크포인트, 인터랙션 패턴, 페이지 구조를 설계한다. 레이아웃 설계, 컴포넌트 정의, 반응형 전략, 섹션 구성, Hero/Feature/CTA 설계, 인터랙션 명세 요청 시 반드시 이 스킬을 사용할 것. '어떻게 배치할까', '섹션 구성 잡아줘', '컴포넌트 뭐가 필요해' 등의 표현도 트리거 대상이다."
---

# UI System Skill

## 목적

디자인 컨셉을 화면 레벨로 구체화한다. 개발자가 바로 구현할 수 있는 수준의 스펙을 작성한다.

## 실행 프로세스

### Step 1: 페이지 구조 정의

각 페이지의 목적과 섹션을 정의한다. 랜딩 페이지 기준:

```
1. Header/Nav (고정 또는 스크롤)
   - 로고
   - 메뉴 (모바일: 햄버거)
   - CTA 버튼

2. Hero Section
   - 헤드라인 (H1)
   - 서브헤드 (1~2줄)
   - CTA 버튼 (Primary + Secondary)
   - 비주얼 (이미지/영상/일러스트/3D)

3. Social Proof (선택)
   - 고객사 로고 / 리뷰 수

4. Features Section
   - 섹션 헤드
   - Feature 카드 (3~6개)

5. How It Works (선택)
   - 단계별 설명

6. Testimonials (선택)
   - 고객 후기 카드

7. Pricing (해당 시)
   - 플랜 카드

8. CTA Section (마지막)
   - 강력한 헤드라인
   - 최종 CTA

9. Footer
   - 링크 그룹
   - 법적 문구
```

### Step 2: 그리드 & 레이아웃

**컨테이너:**
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px; /* 모바일 */
}
@media (min-width: 768px) {
  .container { padding: 0 32px; }
}
@media (min-width: 1024px) {
  .container { padding: 0 48px; }
}
```

**브레이크포인트:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**그리드:**
- 모바일: 1 컬럼
- 태블릿: 2 컬럼
- 데스크탑: 3~4 컬럼

### Step 3: 컴포넌트 인벤토리

**기본 컴포넌트:**

| 컴포넌트 | Variant | 상태 |
|---------|---------|------|
| Button | primary, secondary, ghost, destructive | default, hover, focus, disabled, loading |
| Card | default, bordered, elevated, glass | - |
| Badge | default, success, warning, error, info | - |
| Input | default, error | default, focus, disabled |
| Avatar | sm, md, lg | default, fallback |
| Skeleton | - | loading |

**섹션 컴포넌트:**

| 컴포넌트 | Props |
|---------|-------|
| HeroSection | headline, sub, ctaPrimary, ctaSecondary, visual |
| FeatureCard | icon, title, description, variant |
| TestimonialCard | quote, author, avatar, company |
| PricingCard | plan, price, features, cta, highlighted |
| SectionHeader | headline, sub, align |

### Step 4: 인터랙션 패턴

**진입 애니메이션 (스크롤 트리거):**
- 헤드라인: `fade-up` 200ms delay
- 카드들: 순차 `fade-up` 50ms stagger
- 비주얼: `fade-in` 동시

**Hover 상태:**
- 버튼: `translateY(-1px)` + 그림자 강화 (100ms)
- 카드: `translateY(-4px)` + 그림자 (150ms)
- 링크: 색상 전환 (100ms)

**포커스:**
- 아웃라인 제거 대신: `outline: 2px solid var(--color-primary); outline-offset: 2px`
- 모든 인터랙티브 요소에 적용

**트랜지션 원칙:**
- 마이크로 인터랙션: 100~200ms, `ease-out`
- 레이아웃 변화: 200~300ms, `ease-in-out`
- 페이지 전환: 300~400ms

### Step 5: 반응형 전략

각 섹션의 모바일/데스크탑 레이아웃 변화:

| 섹션 | 모바일 | 데스크탑 |
|------|--------|---------|
| Hero | 텍스트 위 / 비주얼 아래 | 좌우 분할 |
| Features | 1열 카드 | 3열 그리드 |
| Testimonials | 1개씩 슬라이드 | 3열 그리드 |
| Pricing | 세로 스택 | 가로 3열 |
| Footer | 2열 | 4열 |

### Step 6: 다크모드 전략

토글 방식: `next-themes`, `.dark` 클래스 기반

원칙:
- 배경은 순수 흑색(`#000`) 금지 → `oklch(0.13 0.01 264)` 같은 약간 채도 있는 어두운 색
- 카드 배경은 배경보다 약간 밝게
- 텍스트 대비는 화이트 모드와 동일한 4.5:1 이상

## 산출물 형식

`_workspace/02_ui_spec.md`에 작성. 각 섹션을 Tailwind 클래스 힌트와 함께 기술하여 web-engineer가 바로 참조 가능하게.
