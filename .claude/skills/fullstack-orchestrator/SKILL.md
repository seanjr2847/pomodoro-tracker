---
name: fullstack-orchestrator
description: "풀스택 웹사이트 개발 에이전트 팀 오케스트레이터. spec.md 기반 기능 구현, 페이지+API 개발, 새 기능 추가, 기존 기능 수정, 와이어프레임/스펙 구현 요청 시 반드시 이 스킬을 사용할 것. 후속 작업(다시 만들어줘, 특정 기능만 수정, 버그 고쳐줘, 구현 보완해줘, 재실행, 이전 결과 기반 개선)도 이 스킬로 처리할 것."
---

# Fullstack Orchestrator

에이전트 팀 모드. fullstack-architect, frontend-dev, backend-dev, fullstack-qa 4명이 파이프라인으로 협업한다.

## Phase 0: 컨텍스트 확인

`_workspace/` 디렉토리 존재 여부 확인:

- **미존재** → 초기 실행: Phase 1부터 진행
- **존재 + 사용자가 부분 수정 요청** → 부분 재실행: 해당 에이전트만 재호출 (Phase 2 해당 태스크부터)
- **존재 + 새 spec/요청** → 새 실행: 기존 `_workspace/`를 `_workspace_prev_<timestamp>/`로 이동 후 Phase 1부터

## Phase 1: 준비

1. `spec.md` (프로젝트 루트) 존재 확인 — 없으면 사용자에게 요청 후 중단
2. `_workspace/` 디렉토리 생성
3. 사용자 요청 원문을 `_workspace/00_request.md`에 저장

## Phase 2: 팀 구성

```
TeamCreate:
  team_name: "fullstack-team"
  members:
    - name: "fullstack-architect"
      subagent_type: "fullstack-architect"
      model: "opusplan"
      prompt: |
        당신은 fullstack-architect다. .claude/agents/fullstack-dev/CLAUDE.md를 먼저 읽어라.
        spec.md (프로젝트 루트)를 분석하고 _workspace/01_implementation_plan.md를 작성하라.
        완료 후 backend-dev와 frontend-dev에게 SendMessage로 알려라.

    - name: "backend-dev"
      subagent_type: "backend-dev"
      model: "opusplan"
      prompt: |
        당신은 backend-dev다. .claude/agents/fullstack-dev/CLAUDE.md를 먼저 읽어라.
        fullstack-architect의 완료 메시지를 받은 후 작업을 시작하라.
        spec.md의 API 스펙과 _workspace/01_implementation_plan.md를 기반으로 백엔드를 구현하라.
        각 API 완성 시 frontend-dev에게 응답 shape을 SendMessage로 알려라.
        완료 후 _workspace/02_backend_notes.md를 작성하라.

    - name: "frontend-dev"
      subagent_type: "frontend-dev"
      model: "opusplan"
      prompt: |
        당신은 frontend-dev다. .claude/agents/fullstack-dev/CLAUDE.md를 먼저 읽어라.
        fullstack-architect의 완료 메시지를 받은 후 _workspace/01_implementation_plan.md를 읽고 페이지/컴포넌트 뼈대를 잡아라.
        backend-dev의 API 완성 메시지를 받으며 실제 API 연동을 구현하라.
        완료 후 _workspace/03_frontend_notes.md를 작성하라.

    - name: "fullstack-qa"
      subagent_type: "fullstack-qa"
      model: "opusplan"
      prompt: |
        당신은 fullstack-qa다. .claude/agents/fullstack-dev/CLAUDE.md를 먼저 읽어라.
        backend-dev와 frontend-dev 모두 완료 메시지를 보낸 후 작업을 시작하라.
        spec.md, 모든 _workspace/ 산출물, 실제 코드를 검증하라.
        완료 후 _workspace/04_qa_report.md를 작성하고 오케스트레이터에게 보고하라.
```

```
TaskCreate:
  - title: "구현 계획 수립"
    description: "spec.md 분석 → _workspace/01_implementation_plan.md 작성"
    assignee: "fullstack-architect"
    depends_on: []

  - title: "백엔드 구현"
    description: "API 라우트, Server Actions, Prisma 스키마 구현 → _workspace/02_backend_notes.md"
    assignee: "backend-dev"
    depends_on: ["구현 계획 수립"]

  - title: "프론트엔드 구현"
    description: "Next.js 페이지, 컴포넌트, 훅 구현 → _workspace/03_frontend_notes.md"
    assignee: "frontend-dev"
    depends_on: ["구현 계획 수립"]

  - title: "통합 QA 검증"
    description: "spec 준수율 + 경계면 검증 + 빌드 확인 → _workspace/04_qa_report.md"
    assignee: "fullstack-qa"
    depends_on: ["백엔드 구현", "프론트엔드 구현"]
```

## Phase 3: 실행 모니터링

팀원들이 자체 조율한다 (SendMessage). 리더는 다음 상황에서 개입:

- 특정 팀원이 30분 이상 응답 없음 → SendMessage로 상태 확인
- 팀원이 해결 불가 오류 보고 → 다른 팀원에게 지원 요청 또는 사용자에게 보고
- 의존성 태스크가 완료됐는데 후속 팀원이 시작 안 함 → TaskUpdate로 상태 수동 갱신

## Phase 4: 결과 통합

모든 태스크 완료 후:

1. `_workspace/04_qa_report.md` 읽기
2. PASS인 경우 → 완료 메시지 출력
3. FAIL인 경우 → 주요 버그 목록과 함께 사용자에게 보고, 수정 여부 결정 요청

완료 메시지 형식:
```
## 구현 완료

spec.md 기반 풀스택 구현이 완료됐다.

**QA 결과:** [PASS/FAIL]
**spec 준수율:** [X/Y 항목]

**구현된 기능:**
- [목록]

**주요 파일:**
- [주요 변경/생성 파일 목록]

**미구현/주의사항:**
- [있다면]
```

## Phase 5: 정리

```
SendMessage(to: "all", "작업 완료. 팀 해산합니다.")
TeamDelete("fullstack-team")
```

`_workspace/`는 보존한다 (사후 검증/감사 추적).

## 에러 핸들링

- **backend-dev 실패**: frontend-dev에게 알림 (API 없이 mock으로 진행), 사용자에게 보고
- **frontend-dev 실패**: QA에게 알림 (백엔드만 검증), 사용자에게 보고
- **빌드 실패 (QA 보고)**: 담당 에이전트에게 재작업 요청 (1회), 여전히 실패 시 사용자에게 에러 로그 보고
- **spec.md 없음**: 즉시 중단, 사용자에게 파일 제공 요청

## 테스트 시나리오

### 정상 흐름
1. spec.md에 "사용자 프로필 수정 API + 설정 페이지 UI" 정의
2. architect가 구현 계획 수립 (페이지: `/dashboard/settings`, API: `PATCH /api/users/me`)
3. backend-dev가 API 구현 → frontend-dev에게 응답 shape 전달
4. frontend-dev가 설정 페이지 + 폼 구현
5. fullstack-qa가 API shape ↔ 폼 타입 교차 비교, `pnpm build` 확인
6. PASS → 완료 보고

### 에러 흐름
1. spec.md API 스펙에 `user_id` (snake_case)로 정의
2. backend-dev가 Prisma 필드명 `userId` (camelCase)로 응답에 포함
3. frontend-dev가 `user_id`로 접근 → 타입 불일치
4. fullstack-qa가 경계면 검증에서 발견 → backend-dev에게 수정 요청
5. backend-dev가 응답 변환 추가 → 재검증 → PASS
