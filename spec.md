# Pomodoro Tracker — 제품 스펙

## 1. 제품 개요

### 한 줄 설명
포모도로 기법(25분 작업 + 5분 휴식)으로 작업 시간을 측정하고 카테고리별 통계를 제공하는 생산성 SaaS.

### 타겟 유저
집중력 관리가 필요한 직장인, 학생, 프리랜서.

### 핵심 가치 제안
"25분 사이클로 작업 → 자동으로 통계가 쌓인다. 하루/주/월 단위로 집중도를 시각화."

### 언어
**한국어 단일.** 모든 UI/카피/에러/알림 한국어. 영어 잔재 절대 금지.

### 디자인 톤
- 색상: 토마토색 `#E84A5F` primary + sage `#7BC8A4` secondary
- 폰트: Pretendard (한글 가독성)
- 톤: 친근, 깔끔, 군더더기 없음
- 아이콘: lucide-react 만 (이모지 절대 금지)

## 2. 핵심 기능 (MVP)

### F-1. 포모도로 타이머 (`/timer`)
- 25분 작업 + 5분 휴식 자동 전환
- 4 사이클 후 15분 긴 휴식
- 시작 / 일시정지 / 중지 / 스킵 버튼
- 잔여 시간 큰 폰트로 가운데 정렬
- 작업/휴식 끝나면 브라우저 Notification API 알림

### F-2. 작업 카테고리 (`/categories`)
- 사용자가 카테고리 CRUD (예: "공부", "코딩", "운동", "독서")
- 색상 8가지 프리셋
- 타이머 시작 전 카테고리 선택

### F-3. 세션 기록
- 완료된 포모도로 사이클 자동 저장
- 시간, 카테고리, 메모(선택) 기록
- 마지막 7일/30일 세션 리스트

### F-4. 통계 대시보드 (`/dashboard`)
- 오늘 완료한 포모도로 개수 (큰 카드)
- 이번 주 누적 시간 (Bar 차트)
- 카테고리별 비중 (Pie 차트)
- 7일/30일 트렌드 라인 (Recharts)

### F-5. 인증
- NextAuth + Google OAuth
- 로그인 안 한 사용자도 타이머는 사용 가능 (localStorage)
- 통계는 로그인 후 보기

## 3. 기술 스택

- Next.js 15 (App Router)
- PostgreSQL (Prisma ORM, NEON)
- NextAuth v5 + Google
- Tailwind CSS + shadcn/ui
- lucide-react (아이콘)
- Recharts (차트)
- Vercel 배포

## 4. 페이지

| 라우트 | 인증 |
|--------|------|
| `/` 랜딩 | 공개 |
| `/timer` 메인 타이머 | 공개 |
| `/dashboard` 통계 | 로그인 필수 |
| `/categories` 카테고리 관리 | 로그인 필수 |
| `/login` | - |
| `/pricing` | 공개 |

## 5. 데이터 모델 (Prisma)

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  image     String?
  createdAt DateTime   @default(now())
  sessions  Session[]
  categories Category[]
}

model Category {
  id      String    @id @default(cuid())
  userId  String
  user    User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name    String
  color   String
  sessions Session[]
  createdAt DateTime @default(now())
}

model Session {
  id          String    @id @default(cuid())
  userId      String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  durationMin Int
  type        String   // 'work' | 'break'
  note        String?
  startedAt   DateTime
  completedAt DateTime
  createdAt   DateTime  @default(now())
}
```

## 6. seed 데이터 (필수, 빈 사이트 방지)
- 카테고리 4개: 공부(빨강), 코딩(파랑), 운동(초록), 독서(보라)
- 세션 12개: 최근 7일 분산, 다양한 카테고리

## 7. UX 가이드

### 헤더
- 좌측: 로고 (텍스트 "Pomodoro Tracker" + Timer SVG 아이콘)
- 우측 네비: 타이머 / 대시보드 / 요금제 / 로그인

### 랜딩 hero
- 헤드라인: "25분 집중. 5분 휴식. 끝없는 성장."
- 서브카피: "포모도로 기법으로 작업 시간을 측정하고, 카테고리별 통계로 집중도를 시각화하세요."
- Primary CTA: "무료로 시작" (토마토색, 큰 사이즈)
- Secondary CTA: "기능 보기" (외곽선)

### 빈 상태 (반드시 4단 구조)
**아이콘 (Lucide) + 헤드라인 + 설명 + CTA 버튼**

예: 통계 페이지 빈 상태
- `Inbox` 아이콘 (큰 크기)
- "아직 완료한 포모도로가 없어요"
- "타이머를 시작해서 첫 사이클을 완료해보세요"
- "타이머 시작" 버튼 → `/timer`

### 모든 버튼에 적절한 lucide 아이콘
- 타이머: `Play`, `Pause`, `Square`, `SkipForward`
- 대시보드: `BarChart3`, `PieChart`, `TrendingUp`
- 카테고리: `Tag`, `Plus`, `Edit`, `Trash`
- 빈 상태: `Inbox`, `Coffee`

## 8. 절대 금지
- 영어 카피 잔재 ("Get Started", "Submit" 등)
- 이모지 (🍅 🚀 같은 거 — lucide SVG로 대체)
- 의미없는 보라/파란 그라데이션 카드
- "Lorem ipsum" / "Sample" / "TODO"
- AI 디자인 패턴 (그라데이션 + 빈 카드)
