# 추가 공통 패턴 기능명세서

보일러플레이트에 추가할 범용 패턴 6종.
**완성된 페이지가 아닌 조합 가능한 블록 + 훅**으로 제공한다. 레이아웃 조합은 각 프로젝트에서 한다.

---

## 설계 원칙

```
❌ 고정된 페이지 컴포넌트
<AIGenerationPage />  ← 레이아웃이 박혀있어서 못 바꿈

✅ 독립 블록 + 훅
훅: useGeneration(), useStreaming()  ← 로직만, UI 없음
블록: <StreamingText />, <ResultCard />  ← 최소 단위 UI
조합: 프로젝트에서 자유롭게 배치        ← 채팅형, 분할형, 위저드형 등
```

각 Feature는 3가지 레이어로 제공:

| 레이어 | 역할 | 예시 |
|--------|------|------|
| **훅** | 로직만 (UI 없음) | `useGeneration()`, `useKanban()` |
| **UI 블록** | 최소 단위 컴포넌트 | `StreamingText`, `KanbanColumn` |
| **조합 예시** | 참고용 1개 | `examples/generation-chat.tsx` |

---

## 1. AI Generation (`features/ai-generation/`)

### 1.1 개요

Gemini API 기반 텍스트 생성/분석의 로직과 UI 블록을 제공한다.
채팅형, 분할 패널형, 폼→결과형 등 어떤 레이아웃이든 훅 + 블록 조합으로 대응.

### 1.2 모듈 구조

```
features/ai-generation/
├── index.ts
├── hooks/
│   ├── useGeneration.ts            # 생성 요청 + 상태 관리
│   └── useStreaming.ts             # SSE 스트리밍 응답 처리
├── blocks/
│   ├── GenerationInput.tsx         # 텍스트 입력 + 제출 (react-hook-form + zod)
│   ├── StreamingText.tsx           # 스트리밍 타이핑 효과 표시
│   ├── ResultCard.tsx              # 완료된 결과 카드 (복사/재생성/저장 버튼)
│   ├── GenerationSkeleton.tsx      # 로딩 스켈레톤
│   └── CreditBadge.tsx             # 잔여 크레딧 표시 (Usage Metering 연동)
├── lib/
│   └── gemini.ts                   # Gemini API 클라이언트 (@google/generative-ai)
└── types/
    └── index.ts                    # Generation, GenerationStatus 타입
```

### 1.3 훅 상세

**useGeneration()**

```ts
const {
  generate,       // (input: string) => Promise<void>
  result,         // string | null — 완료된 결과
  status,         // 'idle' | 'loading' | 'streaming' | 'done' | 'error'
  error,          // Error | null
  reset,          // () => void — 상태 초기화
} = useGeneration({ model?: string, systemPrompt?: string });
```

**useStreaming()**

```ts
const {
  stream,         // ReadableStream | null
  text,           // string — 현재까지 수신된 텍스트
  isStreaming,     // boolean
  cancel,         // () => void — 스트리밍 중단
} = useStreaming(stream);
```

### 1.4 블록 상세

| 블록 | 역할 | 주요 props |
|------|------|-----------|
| `GenerationInput` | 텍스트 입력 + 제출 버튼 | `onSubmit`, `placeholder`, `disabled`, `children` (커스텀 필드 슬롯) |
| `StreamingText` | 토큰 단위 타이핑 표시 | `text`, `isStreaming`, `onCancel` |
| `ResultCard` | 완료된 결과 (마크다운 렌더링) | `result`, `onCopy`, `onRegenerate`, `onSave` |
| `GenerationSkeleton` | 로딩 스켈레톤 | `lines` (줄 수) |
| `CreditBadge` | 잔여 크레딧 | `used`, `limit` |

### 1.5 Gemini 클라이언트 (`gemini.ts`)

- `@google/generative-ai` SDK 사용.
- 환경변수: `GEMINI_API_KEY`.
- 스트리밍 (`generateContentStream`) / 논스트리밍 (`generateContent`) 지원.
- Rate Limiting 미들웨어 자동 적용.
- API Route에서 사용: `POST /api/generate`

### 1.6 조합 예시

```tsx
// 예시 A: 폼 → 결과 (가장 기본)
<GenerationInput onSubmit={generate} placeholder="제품 설명 입력..." />
{status === 'loading' && <GenerationSkeleton />}
{status === 'streaming' && <StreamingText text={text} onCancel={cancel} />}
{status === 'done' && <ResultCard result={result} onCopy onRegenerate />}

// 예시 B: 채팅 레이아웃
<div className="flex flex-col h-screen">
  <div className="flex-1 overflow-y-auto">
    {messages.map(msg => <MessageBubble key={msg.id} {...msg} />)}  // 프로젝트에서 만듦
    {status === 'streaming' && <StreamingText text={text} />}
  </div>
  <GenerationInput onSubmit={generate} />
</div>

// 예시 C: 좌우 분할
<div className="grid grid-cols-2 gap-4">
  <GenerationInput onSubmit={generate} />
  <div>
    {status === 'streaming' ? <StreamingText text={text} /> : <ResultCard result={result} />}
  </div>
</div>
```

---

## 2. Result History (`features/result-history/`)

### 2.1 개요

AI 생성 결과를 저장/조회/삭제하는 로직과 UI 블록.

### 2.2 모듈 구조

```
features/result-history/
├── index.ts
├── hooks/
│   └── useHistory.ts              # CRUD + 페이지네이션
├── blocks/
│   ├── HistoryItem.tsx            # 개별 항목 (제목 + 날짜 + 미리보기)
│   ├── HistoryDetail.tsx          # 상세 보기 (입력 + 결과 전체)
│   └── HistorySearch.tsx          # 검색 입력
├── actions/
│   └── history.ts                 # 서버 액션 (저장, 삭제, 조회)
└── types/
    └── index.ts
```

### 2.3 훅 상세

**useHistory()**

```ts
const {
  items,          // HistoryItem[] — 결과 목록
  total,          // number — 전체 개수
  isLoading,      // boolean
  save,           // (input, output, metadata?) => Promise<void>
  remove,         // (id: string) => Promise<void>
  search,         // (query: string) => void
  loadMore,       // () => void — 다음 페이지
  hasMore,        // boolean
} = useHistory({ pageSize?: number });
```

### 2.4 DB 스키마

```prisma
model Generation {
  id        String   @id @default(cuid())
  userId    String
  title     String
  input     Json
  output    String   @db.Text
  metadata  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, createdAt])
}
```

### 2.5 블록 상세

| 블록 | 역할 | 주요 props |
|------|------|-----------|
| `HistoryItem` | 한 줄 항목 (제목 + 날짜 + 미리보기) | `item`, `onClick`, `onDelete` |
| `HistoryDetail` | 상세 (입력 + 결과 마크다운) | `item`, `onCopy`, `onRegenerate`, `onShare` |
| `HistorySearch` | 검색 입력 | `onSearch`, `placeholder` |

### 2.6 조합 예시

```tsx
// 사이드바에 히스토리 목록
<div className="w-64">
  <HistorySearch onSearch={search} />
  {items.map(item => <HistoryItem key={item.id} item={item} onClick={setSelected} />)}
</div>

// 메인 영역에 상세
<div className="flex-1">
  {selected ? <HistoryDetail item={selected} /> : <EmptyState />}
</div>
```

---

## 3. Kanban Board (`features/kanban/`)

### 3.1 개요

드래그앤드롭 칸반 보드. 컬럼 정의를 props로 받아 어떤 용도든 대응.

### 3.2 모듈 구조

```
features/kanban/
├── index.ts
├── hooks/
│   └── useKanban.ts               # 보드 상태 + 드래그 핸들러
├── blocks/
│   ├── KanbanBoard.tsx            # 컬럼 나열 컨테이너
│   ├── KanbanColumn.tsx           # 개별 컬럼 (헤더 + 카드 리스트)
│   ├── KanbanCard.tsx             # 드래그 가능 카드
│   └── KanbanAddCard.tsx          # 카드 추가 인라인 폼
├── actions/
│   └── kanban.ts                  # 서버 액션 (CRUD, 순서 변경)
└── types/
    └── index.ts
```

### 3.3 훅 상세

**useKanban()**

```ts
const {
  columns,        // KanbanColumn[] — 컬럼 + 카드 데이터
  isLoading,      // boolean
  addCard,        // (columnId, title, content?) => Promise<void>
  moveCard,       // (cardId, toColumnId, position) => Promise<void>
  updateCard,     // (cardId, data) => Promise<void>
  deleteCard,     // (cardId) => Promise<void>
  onDragEnd,      // DragEndHandler — @hello-pangea/dnd 핸들러
} = useKanban({ boardId: string, columnDefs: ColumnDef[] });
```

- React Query로 데이터 패칭.
- 낙관적 업데이트 (드래그 시 즉시 UI 반영, 서버 응답 후 확정).
- `boardId`로 여러 보드 분리 가능.

### 3.4 DB 스키마

```prisma
model KanbanCard {
  id        String   @id @default(cuid())
  userId    String
  boardId   String
  column    String
  title     String
  content   String?  @db.Text
  position  Int
  metadata  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, boardId, column])
}
```

### 3.5 블록 상세

| 블록 | 역할 | 주요 props |
|------|------|-----------|
| `KanbanBoard` | DnD 컨텍스트 + 컬럼 나열 | `boardId`, `columnDefs`, `children` |
| `KanbanColumn` | 컬럼 헤더 + 카드 리스트 | `column`, `cards`, `onAddCard` |
| `KanbanCard` | 드래그 가능 카드 | `card`, `onClick`, `onDelete` |
| `KanbanAddCard` | 인라인 추가 폼 | `onAdd` |

### 3.6 조합 예시

```tsx
// 아웃리치 트래커 — 컬럼 정의만 바꾸면 됨
<KanbanBoard
  boardId="outreach"
  columnDefs={[
    { id: 'contacted', title: '연락함', color: 'blue' },
    { id: 'replied', title: '답변 받음', color: 'yellow' },
    { id: 'converted', title: '전환됨', color: 'green' },
  ]}
/>

// 할일 관리 — 같은 컴포넌트, 다른 용도
<KanbanBoard
  boardId="tasks"
  columnDefs={[
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]}
/>

// 칸반 카드 커스텀 — children으로 카드 렌더링 오버라이드
<KanbanColumn column={col} cards={cards}>
  {(card) => <MyCustomCard card={card} />}  // 프로젝트에서 커스텀
</KanbanColumn>
```

---

## 4. View Toggle (`shared/ui/`)

### 4.1 개요

카드 그리드 ↔ 리스트 테이블 전환. Feature가 아닌 `shared/ui/`에 배치.

### 4.2 파일

```
shared/ui/
├── ViewToggle.tsx               # 토글 버튼
├── CardGrid.tsx                 # 카드 그리드 레이아웃
└── ListView.tsx                 # 리스트 테이블 레이아웃
```

### 4.3 블록 상세

| 블록 | 역할 | 주요 props |
|------|------|-----------|
| `ViewToggle` | Grid/List 아이콘 토글 | `value`, `onChange` |
| `CardGrid` | 반응형 그리드 (1/2/3/4열) | `children` |
| `ListView` | shadcn data-table 래퍼 | `data`, `columns` |

- 선택 상태는 `localStorage`에 저장 (새로고침 유지).
- `ViewToggle`은 상태만 관리. `CardGrid`/`ListView` 중 뭘 렌더할지는 사용 측에서 분기.

### 4.4 조합 예시

```tsx
const [view, setView] = useState<'grid' | 'list'>('grid');

<ViewToggle value={view} onChange={setView} />

{view === 'grid' ? (
  <CardGrid>
    {items.map(item => <MyCard key={item.id} {...item} />)}  // 카드 디자인은 프로젝트에서
  </CardGrid>
) : (
  <ListView data={items} columns={myColumns} />  // 컬럼 정의도 프로젝트에서
)}
```

---

## 5. Share / Export (`features/share/`)

### 5.1 개요

결과를 공개 링크로 공유하거나 PDF로 다운로드.

### 5.2 모듈 구조

```
features/share/
├── index.ts
├── hooks/
│   └── useShare.ts                # 공유 링크 생성/삭제
├── blocks/
│   ├── ShareButton.tsx            # 공유 드롭다운 (링크 복사, SNS, PDF)
│   ├── ShareDialog.tsx            # 공유 설정 모달 (공개/비공개/비밀번호/만료)
│   └── PublicBanner.tsx           # 공개 페이지 하단 CTA ("이 앱으로 만들어보기")
├── actions/
│   └── share.ts                   # 서버 액션 (링크 CRUD)
├── lib/
│   └── pdf.ts                     # PDF 생성 유틸 (html2canvas + jsPDF)
└── types/
    └── index.ts
```

### 5.3 훅 상세

**useShare()**

```ts
const {
  shareLink,      // SharedLink | null — 현재 공유 링크
  isShared,       // boolean
  create,         // (resourceType, resourceId, options?) => Promise<string> — 공유 링크 URL 반환
  remove,         // () => Promise<void> — 공유 해제
  update,         // (options) => Promise<void> — 설정 변경
} = useShare({ resourceType: string, resourceId: string });
```

### 5.4 DB 스키마

```prisma
model SharedLink {
  id           String    @id @default(cuid())
  userId       String
  resourceType String
  resourceId   String
  slug         String    @unique
  isPublic     Boolean   @default(true)
  password     String?
  expiresAt    DateTime?
  viewCount    Int       @default(0)
  createdAt    DateTime  @default(now())
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([slug])
  @@index([userId, resourceType])
}
```

### 5.5 블록 상세

| 블록 | 역할 | 주요 props |
|------|------|-----------|
| `ShareButton` | 드롭다운 (🔗 링크 복사 / 🐦 Twitter / 📄 PDF) | `resourceType`, `resourceId`, `title` |
| `ShareDialog` | 공유 설정 모달 | `shareLink`, `onUpdate`, `onDelete` |
| `PublicBanner` | 공개 페이지 하단 CTA | `appName`, `ctaUrl` |

### 5.6 라우트

| 경로 | 접근 | 설명 |
|------|------|------|
| `/s/[slug]` | 공개 (미인증) | 공유된 결과 보기 |

- 비밀번호 보호 시 → 비밀번호 입력 폼 표시.
- 만료된 링크 → "이 링크는 만료되었습니다" 표시.
- 하단에 `PublicBanner` → 앱 랜딩으로 유도.

### 5.7 조합 예시

```tsx
// ResultCard에 공유 버튼 끼우기
<ResultCard result={result} onCopy>
  <ShareButton resourceType="generation" resourceId={result.id} title={result.title} />
</ResultCard>

// 히스토리 상세에서 공유
<HistoryDetail item={selected}>
  <ShareButton resourceType="generation" resourceId={selected.id} />
</HistoryDetail>
```

---

## 6. Multi-step Wizard (`shared/ui/`)

### 6.1 개요

멀티스텝 폼/위저드. Feature가 아닌 `shared/ui/`에 배치.

### 6.2 파일

```
shared/ui/
├── Wizard.tsx                   # 컨테이너 (상태 + Context)
├── WizardStep.tsx               # 개별 스텝
├── WizardProgress.tsx           # 스텝 인디케이터
└── WizardNavigation.tsx         # 이전/다음/완료 버튼
```

### 6.3 블록 상세

| 블록 | 역할 | 주요 props |
|------|------|-----------|
| `Wizard` | 상태 관리 + Context Provider | `onComplete`, `children` |
| `WizardStep` | 개별 스텝 래퍼 | `title`, `validation?`, `children` |
| `WizardProgress` | 스텝 인디케이터 (번호 + 제목) | 자동 (Wizard Context에서 읽음) |
| `WizardNavigation` | 이전/다음/완료 버튼 | 자동 (Wizard Context에서 읽음) |

- 스텝 간 데이터 공유: React Context.
- 완료된 스텝 클릭 → 해당 스텝으로 이동 가능.
- 유효성 검증 실패 시 다음 버튼 비활성.
- 스텝 내용은 `children`으로 자유 구성.

### 6.4 조합 예시

```tsx
// ICP 분석 위저드
<Wizard onComplete={handleComplete}>
  <WizardStep title="제품 설명" validation={validateStep1}>
    <GenerationInput placeholder="제품을 한 줄로 설명하세요..." />
  </WizardStep>
  <WizardStep title="타겟 고객">
    <ResultCard result={icpResult} />  // AI Generation 블록 재사용
  </WizardStep>
  <WizardStep title="채널 선택">
    <ChannelSelector />  // 프로젝트에서 만듦
  </WizardStep>
</Wizard>

// 온보딩 위저드 — 같은 Wizard, 다른 내용
<Wizard onComplete={completeOnboarding}>
  <WizardStep title="프로필"><ProfileForm /></WizardStep>
  <WizardStep title="플랜"><PricingCard /></WizardStep>
</Wizard>
```

---

## 프로젝트 구조 반영

```
features/
├── ai-generation/              # 훅 + 블록
├── result-history/             # 훅 + 블록
├── kanban/                     # 훅 + 블록
├── share/                      # 훅 + 블록
├── ... (기존 Features)

shared/ui/
├── ViewToggle.tsx              # 블록
├── CardGrid.tsx                # 블록
├── ListView.tsx                # 블록
├── Wizard.tsx                  # 블록
├── WizardStep.tsx              # 블록
├── WizardProgress.tsx          # 블록
├── WizardNavigation.tsx        # 블록
├── ... (기존 UI)
```

## 의존성 맵

```
ai-generation  → shared/ui (독립)
result-history → database, shared/ui (ViewToggle)
kanban         → database, shared/ui
share          → database, shared/ui

ai-generation과 result-history 연결은 사용 측(app/)에서:
  ResultCard의 onSave → useHistory().save() 호출
```

Feature 간 직접 의존 없음. 조합은 항상 `app/` 레이어 또는 프로젝트 코드에서.