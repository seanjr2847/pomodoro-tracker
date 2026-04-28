---
name: a11y-checker
description: "웹 접근성 감사 및 수정 스킬. WCAG 2.1 AA 기준으로 색상 대비율(4.5:1), ARIA 레이블, 키보드 네비게이션, 스크린 리더 호환성, 포커스 관리를 검증하고 코드를 직접 수정한다. '접근성 검토해줘', '색상 대비 확인', 'WCAG', 'aria', '스크린 리더', '키보드 네비게이션', '포커스 관리' 등 접근성 관련 모든 요청 시 반드시 이 스킬을 사용할 것."
---

# A11y Checker Skill

## 목적

장애가 있는 사용자를 포함한 모든 사람이 웹사이트를 사용할 수 있도록 WCAG 2.1 AA 기준을 충족한다. 감사 보고서 제출에서 끝나지 않고, 발견된 문제를 직접 수정한다.

## 감사 실행 절차

### Phase A: 색상 대비율 (설계 단계)

디자인 컨셉이 확정되면 즉시 실행.

**계산 방법:**
```
상대 휘도(L) = 0.2126 × R + 0.7152 × G + 0.0722 × B
(각 채널: c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4)

대비율 = (L_lighter + 0.05) / (L_darker + 0.05)
```

**통과 기준:**
| 텍스트 유형 | AA 기준 | AAA 기준 |
|-----------|---------|---------|
| 일반 텍스트 (< 18pt) | 4.5:1 | 7:1 |
| 대형 텍스트 (≥ 18pt 또는 굵은 14pt) | 3:1 | 4.5:1 |
| UI 컴포넌트 (버튼 테두리 등) | 3:1 | - |
| 비활성 컴포넌트 | 해당 없음 | - |

**확인 조합:**
- `--color-foreground` on `--color-background`
- `--color-muted-foreground` on `--color-background` ⚠️ 자주 실패
- `--color-primary` on `--color-background`
- `--color-primary-foreground` on `--color-primary`
- 에러/성공 텍스트 on 배경
- 다크모드 동일 확인

### Phase B: HTML 구조 감사

**Heading 계층 확인:**
```bash
# 페이지 내 heading 순서 추출 (grep 사용)
grep -n "h[1-6]" [파일]
```

올바른 순서: h1 → h2 → h3 (건너뛰기 금지)
페이지당 h1은 반드시 1개.

**시맨틱 HTML 체크리스트:**
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` 사용
- [ ] `<nav>`에 `aria-label` (여러 개면 구분 필수)
- [ ] `<button>` vs `<a>`: 페이지 이동은 `<a>`, 액션은 `<button>`
- [ ] `role="list"` + `<ul>`/`<ol>` 조합
- [ ] `<table>`에 `<caption>`, `<th scope="col/row">`

### Phase C: 인터랙티브 요소 감사

**버튼/링크:**
```tsx
// 나쁨
<button>→</button>
<a href="/signup">여기를 클릭</a>

// 좋음
<button aria-label="다음 슬라이드로 이동">→</button>
<a href="/signup">무료로 시작하기</a>
```

**아이콘 버튼:**
```tsx
// 아이콘만 있는 버튼은 반드시 aria-label
<button aria-label="메뉴 열기">
  <MenuIcon aria-hidden="true" />
</button>
```

**폼 요소:**
```tsx
// 올바른 레이블 연결
<label htmlFor="email">이메일</label>
<input id="email" type="email" aria-describedby="email-hint" />
<p id="email-hint" className="text-sm text-muted-foreground">
  업무용 이메일을 입력하세요
</p>

// 에러 상태
<input
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">
  올바른 이메일 형식이 아닙니다
</p>
```

### Phase D: 키보드 네비게이션

**포커스 순서 확인:**
Tab 키로 순서대로 이동이 되는지 DOM 순서와 비교.

```tsx
// 포커스 스타일 (Tailwind)
// 절대로 outline: none 만 하지 말 것
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

**Skip Navigation:**
```tsx
// layout.tsx 최상단
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-primary"
>
  메인 콘텐츠로 이동
</a>
```

**모달/다이얼로그:**
```tsx
// 모달 열릴 때 포커스 트랩 + 첫 포커스 요소로 이동
// 모달 닫힐 때 트리거 버튼으로 포커스 복귀
// Escape 키로 닫기
// role="dialog" + aria-modal="true" + aria-labelledby
```

### Phase E: 동적 콘텐츠

**로딩 상태:**
```tsx
<div aria-live="polite" aria-label="로딩 중">
  <Spinner aria-hidden="true" />
</div>
```

**토스트/알림:**
```tsx
// Sonner는 기본적으로 aria-live 지원
// role="alert"는 즉각적인 중요 알림에만
```

**무한 스크롤/페이지네이션:**
```tsx
<nav aria-label="페이지네이션">
  <button aria-label="이전 페이지">←</button>
  <button aria-current="page" aria-label="현재 3페이지">3</button>
  <button aria-label="다음 페이지">→</button>
</nav>
```

## 보고서 형식

`_workspace/04_a11y_report.md`:

```markdown
# 접근성 감사 보고서

감사 일시: {날짜}
기준: WCAG 2.1 AA

## 색상 대비율
| 조합 | 비율 | 기준 | 결과 |
|------|------|------|------|
| foreground on background | 15.8:1 | 4.5:1 | ✅ |
| muted-foreground on background | 3.2:1 | 4.5:1 | ❌ |

## Critical (즉시 수정 필요)
- [ ] {문제} — {파일:줄} — {수정 방법}

## Major (중요)
- [ ] ...

## Minor (권장)
- [ ] ...

## 수정 완료
- [x] {문제} — 수정 완료 ({파일})

## 점수 요약
합격: {n}개 / 전체: {n}개
```

## 자주 발생하는 패턴별 수정

### muted-foreground 대비 부족
```css
/* 수정 전: 회색이 너무 연함 */
--muted-foreground: oklch(0.65 0.01 0);

/* 수정 후: 충분한 대비 확보 */
--muted-foreground: oklch(0.50 0.01 0); /* 배경이 흰색이면 */
```

### 이미지 alt 누락
```tsx
// 장식용 이미지
<Image alt="" role="presentation" ... />

// 내용 있는 이미지
<Image alt="John Doe, CEO — 환한 미소로 카메라를 바라보는 남성" ... />
```
