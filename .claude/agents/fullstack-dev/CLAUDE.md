# 하네스: Full-Stack Dev

**목표:** `spec.md` 기술문서를 기반으로 풀스택 웹사이트를 에이전트 팀으로 구현한다. 구현 계획 수립부터 백엔드/프론트엔드 병렬 구현, 통합 QA까지 파이프라인으로 실행한다.

## 핵심 입력: spec.md

프로젝트 루트의 `spec.md`는 **기능 요구사항 + API 스펙**을 담은 단일 진실 소스다. 모든 에이전트는 이 파일을 최우선 참조 문서로 사용한다.

## 에이전트 팀

| 에이전트 | 역할 |
|---------|------|
| fullstack-architect | spec.md 분석, 구현 계획 수립 (페이지/DB/컴포넌트 계층) |
| frontend-dev | Next.js 페이지, React 컴포넌트, 클라이언트 로직 구현 |
| backend-dev | API 라우트, Server Actions, Prisma 스키마 구현 |
| fullstack-qa | spec 준수율 검증, API↔Frontend 경계면 검증, 빌드 확인 |

## 스킬

| 스킬 | 용도 | 사용 에이전트 |
|------|------|-------------|
| fullstack-orchestrator | 풀스택 개발 팀 전체 조율 (계획→구현→QA) | 리더(메인) |
| architecture-design | spec.md 기반 구현 계획 수립 방법론 | fullstack-architect |
| frontend-build | Next.js 프론트엔드 구현 컨벤션 | frontend-dev |
| api-build | API/Server Action/Prisma 구현 컨벤션 | backend-dev |
| integration-qa | 통합 정합성 검증 체크리스트 (spec 준수율 + 경계면 교차 비교) | fullstack-qa |

## 실행 규칙

- 풀스택 기능 개발 / 페이지+API 구현 / spec 기반 구현 요청 시 `fullstack-orchestrator` 스킬을 통해 에이전트 팀으로 처리
- 후속 작업: 다시 구현해줘, 개선해줘, 특정 기능만 수정해줘, 버그 수정해줘도 포함
- 단순 질문/확인은 에이전트 팀 없이 직접 응답
- 중간 산출물: `_workspace/` 디렉토리

## 파이프라인

1. **fullstack-architect** → spec.md 분석 + 구현 계획 (`_workspace/01_implementation_plan.md`)
2. **backend-dev** + **frontend-dev** (병렬, SendMessage로 API 계약 조율) → 코드 구현 (`_workspace/02_backend_notes.md`, `_workspace/03_frontend_notes.md`)
3. **fullstack-qa** → 통합 검증 리포트 (`_workspace/04_qa_report.md`)

## 스택

- Next.js 15 + App Router
- TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui
- Prisma 6 + Neon (PostgreSQL)
- TanStack Query/Table, react-hook-form + Zod

## 디렉토리

에이전트: `.claude/agents/fullstack-dev/`
스킬: `.claude/skills/`
