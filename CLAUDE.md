# Project

Next.js + Neon(PostgreSQL) + Prisma + Vercel.
우선순위: 정확성 > 안전성 > 속도. 확신 없으면 docs/ 먼저 업데이트.

## 작업 루프
1) progress/claude-progress.txt + git log + docs/TASKS.md 읽기
2) 미완료 항목 하나만 선택해서 구현
3) ./init.sh tidy → ./init.sh verify → 둘 다 성공해야 완료
4) progress/claude-progress.txt 업데이트 (다음 액션 포함)
5) docs/TASKS.md 상태 업데이트 → git commit (feat:/fix:/docs:)

## NEVER
- 테스트/린트 삭제 (예외: docs/TESTING.md에 이유 기록)
- 브레이킹 체인지 (사전 문서화 없이)
- 목적 없는 대규모 리팩토링
- .env 커밋, 기존 마이그레이션(prisma/migrations/) 수정, 의존성 버전 임의 변경
- 클라이언트 컴포넌트에서 DB 직접 접근 (Server Actions 사용)
- feature 모듈 간 직접 import 금지 (index.ts barrel export 통해서만)

## Commands
- `pnpm dev` / `pnpm build` / `pnpm lint`
- `pnpm db:generate` (Prisma Client 생성) / `pnpm db:migrate` (마이그레이션)
- `./init.sh tidy` (포맷+린트) / `./init.sh verify` (타입체크+빌드+린트)

## 참조
- @docs/TASKS.md — 피처 선택, 상태 업데이트 시
- @docs/REPO_MAP.md — 파일 위치, 디렉토리 구조 확인 시
- @docs/WORKFLOWS.md — 환경 셋업, 배포, DB 마이그레이션, 검증 시
- @docs/TESTING.md — 테스트 작성, 테스트/린트 예외 기록 시
- @docs/STYLEGUIDE.md — 코드 작성, 새 컴포넌트/Feature 모듈 추가 시

## 하네스: SaaS Boilerplate Generator

**목표:** SaaS 보일러플레이트를 에이전트 팀으로 생성/확장하여 solo founder가 하루 안에 배포할 수 있는 모노레포를 만든다.

**에이전트 팀:**
| 에이전트 | 역할 |
|---------|------|
| architect | DB 스키마(Prisma), 인증(NextAuth), 멀티테넌시, 공유 계약/타입 설계 |
| frontend | Next.js 15 App Router 대시보드 UI, 페이지, Feature 모듈 컴포넌트 |
| backend | API 라우트, Server Actions, RBAC 미들웨어, 빌링(Paddle) 통합 |
| devops | Docker, CI/CD(GitHub Actions), 환경변수, Vercel 배포 설정 |
| qa-inspector | 모듈 간 통합 정합성 교차 검증 (API-프론트 경계면, 환경변수, 라우팅) |
| design-director | 브랜드 아이덴티티, 컬러 시스템, 타이포그래피, 무드보드 |
| ui-designer | 컴포넌트 설계, 레이아웃, 인터랙션 패턴, 반응형 전략 |
| web-engineer | Next.js 구현, 시맨틱 HTML, 성능 최적화 |
| a11y-auditor | WCAG 2.1 AA 감사, ARIA, 키보드 네비게이션, 접근성 수정 |

**스킬:**
| 스킬 | 용도 | 사용 에이전트 |
|------|------|-------------|
| saas-orchestrator | SaaS 팀 전체 조율 (파이프라인+팬아웃) | 리더(메인) |
| schema-design | Prisma 스키마, 인증, 멀티테넌시, 공유 계약 | architect |
| dashboard-builder | Next.js 대시보드 UI, 페이지, 컴포넌트 | frontend |
| api-builder | API 라우트, Server Actions, RBAC, 빌링 | backend |
| deploy-config | Docker, CI/CD, 환경변수, 배포 | devops |
| contract-validator | 통합 정합성 교차 검증 | qa-inspector |
| web-orchestrator | 웹사이트 구축 팀 전체 조율 (디자인→UI→구현→접근성) | 리더(메인) |
| design-concept | 브랜드 아이덴티티, 컬러 시스템, 타이포그래피 수립 | design-director |
| ui-system | 컴포넌트 설계, 레이아웃, 인터랙션 패턴 명세 | ui-designer |
| web-builder | Next.js + Tailwind 구현, 성능 최적화, SEO | web-engineer |
| a11y-checker | WCAG 2.1 AA 감사 + 코드 직접 수정 | a11y-auditor |

**실행 규칙:**
- SaaS 보일러플레이트 생성/확장/수정 요청 시 `saas-orchestrator` 스킬을 통해 에이전트 팀으로 처리
- 웹사이트 구축/디자인/프론트엔드 생성 요청 시 `web-orchestrator` 스킬을 통해 에이전트 팀으로 처리
- 단순 질문/확인은 에이전트 팀 없이 직접 응답
- 모든 에이전트는 `model: "opus"` 사용
- 중간 산출물: `_workspace/` 디렉토리

**디렉토리 구조:**
```
.claude/
├── agents/
│   ├── architect.md
│   ├── frontend.md
│   ├── backend.md
│   ├── devops.md
│   ├── qa-inspector.md
│   ├── design-director.md
│   ├── ui-designer.md
│   ├── web-engineer.md
│   └── a11y-auditor.md
└── skills/
    ├── saas-orchestrator/
    ├── schema-design/
    ├── dashboard-builder/
    ├── api-builder/
    ├── deploy-config/
    ├── contract-validator/
    ├── web-orchestrator/
    ├── design-concept/
    ├── ui-system/
    ├── web-builder/
    └── a11y-checker/
```

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-06 | 초기 구성 | 전체 | SaaS 보일러플레이트 생성 하네스 구축 |
| 2026-04-08 | 웹 디자인 하네스 추가 | design-director, ui-designer, web-engineer, a11y-auditor + 5개 스킬 | 심미적 웹사이트 구축 + 접근성 하네스 신규 구축 |