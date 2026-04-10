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

## 하네스 구성

3개 하네스가 각자의 폴더로 분리되어 있다. 각 하네스 세부사항은 해당 폴더의 `CLAUDE.md`를 참조:

| 하네스 | 컨텍스트 파일 | 트리거 스킬 | 에이전트 수 |
|--------|-------------|-----------|-----------|
| Website Builder | `.claude/agents/website-builder/CLAUDE.md` | `web-orchestrator` | 4명 |
| SaaS QA | `.claude/agents/saas-qa/CLAUDE.md` | `saas-qa-tester` | 1명 |
| Full-Stack Dev | `.claude/agents/fullstack-dev/CLAUDE.md` | `fullstack-orchestrator` | 4명 |

**실행 규칙:**
- 웹사이트 구축/디자인/프론트엔드 생성 요청 → `web-orchestrator` 스킬
- SaaS 앱 QA/테스트/검증/채점/피드백 요청 → `saas-qa-tester` 스킬
- 풀스택 기능 개발/spec.md 기반 구현/페이지+API 구현 요청 → `fullstack-orchestrator` 스킬
- 단순 질문/확인 → 에이전트 팀 없이 직접 응답
- 중간 산출물: `_workspace/`

**디렉토리 구조:**
```
.claude/
├── agents/
│   ├── website-builder/    ← 웹사이트 하네스 컨텍스트
│   │   └── CLAUDE.md
│   ├── saas-qa/            ← QA 하네스 컨텍스트
│   │   └── CLAUDE.md
│   ├── fullstack-dev/      ← 풀스택 개발 하네스 컨텍스트
│   │   └── CLAUDE.md
│   └── *.md                ← 에이전트 파일 (각자 하네스 CLAUDE.md 참조)
└── skills/
    ├── fullstack-orchestrator/   ← 풀스택 팀 오케스트레이터
    ├── architecture-design/      ← spec 기반 구현 계획
    ├── frontend-build/           ← Next.js 프론트엔드 구현
    ├── api-build/                ← API/Server Action/Prisma 구현
    └── integration-qa/           ← 통합 정합성 검증
```