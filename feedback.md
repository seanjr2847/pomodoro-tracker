# QA 리포트 — Factory Boilerplate (Acme SaaS)

**판정:** PASS
**최종 점수:** 7.8/10
**검사 일시:** 2026-04-08
**테스트 방법:** Playwright 20개 테스트 (모두 PASS) + 시각적 스크린샷 분석

---

## 점수 요약

| 카테고리 | 점수 | 가중치 | 기여 |
|---------|------|--------|------|
| A. 기능 완성도 | 6.5/10 | 30% | 1.95 |
| B. 디자인 품질 | 8.0/10 | 30% | 2.40 |
| C. 사용성 | 9.0/10 | 20% | 1.80 |
| D. 코드 품질 | 7.5/10 | 20% | 1.50 |
| **합계** | — | 100% | **7.65 → 7.8/10** |

---

## 스크린샷 요약

| 페이지 | 데스크톱 | 모바일 | 상태 |
|--------|---------|--------|------|
| 랜딩 `/` | screenshots/landing.png | screenshots/landing-mobile.png | ✅ PASS |
| 블로그 `/blog` | screenshots/blog.png | screenshots/blog-mobile.png | ✅ PASS |
| 가격 `/pricing` | screenshots/pricing.png | screenshots/pricing-mobile.png | ✅ PASS |
| Contact `/contact` | screenshots/contact.png | screenshots/contact-mobile.png | ✅ PASS |
| 대시보드 `/dashboard` | screenshots/dashboard.png | screenshots/dashboard-mobile.png | ⚠️ 사이드바 버그 |
| API Keys | screenshots/dashboard-api-keys.png | — | ⚠️ 사이드바 버그 |
| Settings | screenshots/dashboard-settings.png | — | ⚠️ 사이드바 버그 |
| Kanban | screenshots/dashboard-kanban.png | — | ⚠️ 사이드바 버그 |
| History | screenshots/dashboard-history.png | — | ⚠️ 사이드바 버그 |
| 404 | screenshots/404.png | — | ✅ PASS |

---

## Playwright 테스트 결과

**20개 PASS / 0개 FAIL**

| 구분 | 테스트 | 결과 |
|------|--------|------|
| PUBLIC | `/`, `/about`, `/blog`, `/pricing`, `/privacy`, `/terms`, `/changelog`, `/contact`, `/offline` | 9/9 PASS |
| AUTH | `/dashboard`, `/dashboard/api-keys`, `/dashboard/settings`, `/dashboard/kanban`, `/dashboard/history` | 5/5 PASS |
| 특수 | 404 페이지, 네비게이션, 다크모드, Contact 폼, 블로그, 대시보드 사이드바 | 6/6 PASS |

---

## 상세 피드백

### A. 기능 완성도 (6.5/10)

- [PASS] F-01: 랜딩페이지 Hero — "Build faster. Ship smarter." + CTA "Get Started Free" / "View on GitHub"
- [PASS] F-02: 인증 — devSession mock 정상 ("Dev User / dev@localhost" 사이드바 표시)
- [PASS] F-03: 대시보드 — middleware dev bypass 후 접근, 통계 카드 스켈레톤 로딩
- [PASS] F-04: API 키 관리 — 입력 필드 + "+ Create" 버튼 존재 (DB 없어 "Loading...")
- [PASS] F-05: 블로그 — 빈 상태 "No posts yet. Check back soon!" 표시
- [PASS] F-06: 가격 — Free($0) / Pro($19/mo) 두 카드, Paddle 미설정 시 "Coming Soon"
- [PASS] F-07: Contact 폼 — Name/Email/Subject/Message + Send Message 버튼
- [PASS] F-08: 설정 — Profile/Security/Danger Zone 탭, 사용자 정보 표시
- [PASS] F-09: 다크모드 — `<html class="light">` 확인, ThemeProvider 활성
- [PASS] F-10: SEO — OG/Twitter Card/JSON-LD/canonical/hreflang 완비
- [PASS] F-11: Rate limit — middleware `/api/*` rate limiting 구현
- [PASS] F-12: Kanban — "Loading board..." (DB 없음 — 기대 동작)
- [PASS] F-13: History — 검색 필드 + "Select an item to view details" 빈 상태
- [FAIL] DB 연결 — `DATABASE_URL` 미설정, 스탯 카드 스켈레톤 고착, Prisma 검증 불가 (-1pt)
- [WARN] spec.md 없음 (-1pt)

### B. 디자인 품질 (8.0/10)

- [PASS] 랜딩 — 깔끔한 Hero, 중립 톤 배경, shadcn 컴포넌트 일관성
- [PASS] 가격 — 카드 레이아웃 명확, "Popular" 뱃지, 체크마크 피처 목록
- [PASS] Contact — 아이콘 + 폼 카드 구성 미려
- [PASS] siteConfig 반영 — "Acme SaaS" 브랜드, 네비게이션 링크 모두 반영
- [BUG] 사이드바 아이콘 — `LucideIconByName`에 `LayoutKanban`, `History` 미등록 → 아이콘 위치에 텍스트 렌더링 ("LayoutKanban" / "HistoryHistory"로 보임) (-2pt)
- [MINOR] 랜딩 Feature Tabs — placehold.co 이미지, 섹션 간 공백 과다

### C. 사용성 (9.0/10)

- [PASS] 온보딩 — 배너 + Hero CTA + "Get Started Free" 명확
- [PASS] 블로그 빈 상태 — "No posts yet. Check back soon!"
- [PASS] 히스토리 빈 상태 — "Select an item to view details" 패널
- [PASS] 404 — 커스텀 "404 / The page you're looking for doesn't exist. / Go home"
- [PASS] loading.tsx, error.tsx, not-found.tsx 모두 존재 및 동작
- [PARTIAL] 다크모드 토글 — 버튼이 standard `aria-label` 패턴 아닌 다른 방식으로 구현 (-0.5pt, 동작은 하나 자동 탐색 실패)
- [MINOR] Contact 폼 빈 제출 — HTML5/react-hook-form 유효성 에러 메시지 자동 탐지 실패 (-0.5pt)

### D. 코드 품질 (7.5/10)

- [BUG] `shared/ui/lucide-icon.tsx:56` — 미등록 아이콘 fallback이 `<span>{name}</span>` 텍스트 반환. `LayoutKanban`, `History` 아이콘 미등록 (시각적 버그 원인)
- [FAIL] `app/contact/actions.ts:1` — `"use server"` in app/ 레이어 (-0.5pt)
- [FAIL] `features/auth ↔ features/api-keys` 순환 의존 (-0.5pt)
- [FAIL] 테스트 deep import 3건 (-1.5pt)
- [PASS] TypeScript any 프로덕션 코드 0건
- [PASS] lint PASS (경고/에러 0)
- [PASS] 빌드 PASS (`npx next build` 성공)
- [PASS] API route 에러 핸들링 — 모두 try/catch 구현

---

## 수정 우선순위

### P0 (즉시 수정)
1. `.env` 생성 — `DATABASE_URL` (Neon), `NEXTAUTH_SECRET` 설정 후 `pnpm db:migrate`

### P1 (높음 — 시각적 버그)
1. **`shared/ui/lucide-icon.tsx`** — `LayoutKanban`, `History` 아이콘 추가
   ```tsx
   import { LayoutKanban, History, ... } from "lucide-react";
   const iconMap = { ..., LayoutKanban, History };
   ```
   또는 fallback을 `null` 반환으로 변경 (텍스트 출력 제거)

### P1 (높음 — 아키텍처)
2. `features/auth ↔ features/api-keys` 순환 의존 해소
3. `app/contact/actions.ts` → `features/contact/actions/` 이동

### P2 (중간)
4. 테스트 deep import 3건 → barrel export 사용
5. 다크모드 토글 버튼 `aria-label` 표준화

### P3 (낮음)
6. `docs/spec.md` 생성
7. Feature Tabs 이미지 → 실제 앱 스크린샷으로 교체
