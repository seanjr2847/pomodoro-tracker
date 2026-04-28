---
name: design-concept
description: "웹사이트 디자인 컨셉 수립 스킬. 브랜드 아이덴티티, 컬러 시스템(Primary/Secondary/Semantic/다크모드 토큰), 타이포그래피 스케일, 공간 시스템, 디자인 원칙을 정의한다. 웹사이트 디자인, 브랜딩, 색상 선택, 폰트 설정, 무드보드, 디자인 방향 수립 요청 시 반드시 이 스킬을 사용할 것. '디자인해줘', '색상 잡아줘', '감성 좀 잡아줘', '브랜드 느낌 설정' 등의 표현도 트리거 대상이다."
---

# Design Concept Skill

## 목적

사용자의 모호한 감성적 요구사항을 구체적이고 시스템화된 디자인 언어로 변환한다. 결과물은 `web-engineer`가 CSS 변수로 직접 구현 가능한 수준이어야 한다.

## 실행 프로세스

### Step 1: 브리핑 분석

사용자 입력에서 다음을 추출:
- **도메인**: 무엇을 만드는가 (SaaS, 포트폴리오, 커머스, 블로그...)
- **타겟**: 누가 사용하는가 (연령, 성별, 직군, 기술 수준)
- **감성 키워드**: 어떤 느낌이어야 하는가 (모던, 따뜻한, 신뢰감, 역동적...)
- **레퍼런스**: 좋아하는 사이트 또는 피하고 싶은 스타일

정보가 없으면 합리적 가정 → "이 컨셉은 [가정]을 전제로 합니다" 명시.

### Step 2: 감성 → 컬러 변환

감성 키워드를 컬러로 변환하는 기준:

| 감성 | 색조 방향 | 채도 | 명도 |
|------|---------|------|------|
| 신뢰/전문 | Blue, Navy | 중간 | 중간 |
| 따뜻함/친근 | Orange, Amber, Sand | 높음 | 밝음 |
| 고급/럭셔리 | Gold, Deep Purple, Black | 낮음 | 어둠 |
| 자연/친환경 | Green, Sage, Terracotta | 중간 | 중간 |
| 미래/혁신 | Cyan, Violet, Electric Blue | 높음 | 어둠 |
| 미니멀/클린 | White, Light Gray | 없음 | 매우 밝음 |

**컬러 시스템 구조:**
```
Primary: 브랜드의 핵심 색상 (CTA, 강조, 링크)
Secondary: 보조 색상 (배경 강조, 섹션 구분)
Neutral: 5단계 회색 (텍스트, 테두리, 배경)
  - 50 (가장 밝음) → 900 (가장 어둠)
Semantic:
  - Success: Green 계열
  - Warning: Amber 계열
  - Error: Red 계열
  - Info: Blue 계열
```

**WCAG 준수 필수:** Primary 색상 on white 배경의 대비율이 4.5:1 이상이어야 한다. oklch 색상 공간 기준.

### Step 3: 타이포그래피 선택

폰트 선택 기준:

| 용도 | 추천 폰트 | 특성 |
|------|---------|------|
| 모던 SaaS | Inter, Geist | 가독성, 중립 |
| 고급/에디토리얼 | Fraunces, Playfair Display | 개성, 감성 |
| 기술/테크 | JetBrains Mono, Fira Code | 코드 감성 |
| 한국어 포함 | Pretendard, Noto Sans KR | 가독성 |
| 친근/캐주얼 | Nunito, Poppins | 둥글고 따뜻함 |

**타이포 스케일 (8px 기반):**
```
xs:   12px / 1.5
sm:   14px / 1.5
base: 16px / 1.75
lg:   18px / 1.75
xl:   20px / 1.5
2xl:  24px / 1.3
3xl:  30px / 1.2
4xl:  36px / 1.1
5xl:  48px / 1.0
6xl:  60px / 1.0
```

### Step 4: 공간 시스템

8px 기반 시스템:
```
4px  — 미세 간격 (아이콘-텍스트)
8px  — 소형 (컴포넌트 내부)
12px — 중소형
16px — 기본 단위
24px — 중형 (컴포넌트 간)
32px — 대형 (섹션 내 블록)
48px — 특대형 (섹션 간)
64px — 섹션 패딩
96px — 페이지 레벨 여백
```

### Step 5: 시각적 언어 결정

형태 언어:
- **Sharp (각진)**: `border-radius: 0~4px` — 전문, 정밀
- **Rounded (둥근)**: `border-radius: 8~12px` — 친근, 현대적
- **Pill (알약형)**: `border-radius: 9999px` — 미니멀, 소프트

그림자 시스템:
```
없음 (Flat): 미니멀, 고급
Subtle (sm/md): 모던, 일반적
Layered (lg): 입체감, 풍부함
```

## 산출물 형식

`_workspace/01_design_concept.md`에 위 Step들의 결과를 작성.
CSS 변수 형식으로 직접 사용 가능하게 출력:

```css
/* 컬러 시스템 — globals.css 적용 예시 */
:root {
  --color-primary: oklch(0.55 0.18 264);
  --color-primary-hover: oklch(0.45 0.18 264);
  /* ... */
}
```
