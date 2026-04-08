---
name: saas-orchestrator
description: "SaaS 보일러플레이트 생성 에이전트 팀을 조율하는 오케스트레이터. 아키텍처 설계, 프론트엔드, 백엔드, DevOps, QA를 파이프라인+팬아웃 패턴으로 조율. SaaS 보일러플레이트 생성, 새 SaaS 프로젝트 스캐폴드, 보일러플레이트 확장. 후속 작업: 보일러플레이트 수정, 부분 재실행, 업데이트, 보완, 다시 실행, 이전 결과 개선, 스키마 수정, API 추가, 페이지 추가, 배포 설정 변경 요청 시에도 반드시 이 스킬을 사용."
---

# SaaS Orchestrator

SaaS 보일러플레이트 생성 에이전트 팀을 조율하여 clone-and-ship 가능한 모노레포를 생성하는 통합 스킬.

## 실행 모드: 에이전트 팀

## 에이전트 구성

| 팀원 | 에이전트 타입 | 역할 | 스킬 | 출력 |
|------|-------------|------|------|------|
| architect | architect (커스텀) | DB 스키마, 인증, 멀티테넌시, 공유 계약 | schema-design | 01_architect_*.md |
| frontend | frontend (커스텀) | Next.js 대시보드 UI, 페이지, 컴포넌트 | dashboard-builder | 02_frontend_pages.md |
| backend | backend (커스텀) | API 라우트, 빌링, RBAC, Server Actions | api-builder | 02_backend_api.md |
| devops | devops (커스텀) | Docker, CI/CD, 환경변수, 배포 | deploy-config | 03_devops_config.md |
| qa-inspector | qa-inspector (커스텀) | 통합 정합성 교차 검증 | contract-validator | 04_qa_report.md |

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `_workspace/` 디렉토리 존재 여부 확인
2. 실행 모드 결정:
   - **`_workspace/` 미존재** -> 초기 실행. Phase 1 진행
   - **`_workspace/` 존재 + 부분 수정 요청** -> 부분 재실행. 해당 에이전트만 재호출
   - **`_workspace/` 존재 + 새 입력** -> 새 실행. 기존을 `_workspace_{timestamp}/`로 이동

### Phase 1: 요구사항 분석

1. 사용자 입력에서 파악:
   - SaaS 도메인 (B2B/B2C, 업종)
   - 핵심 기능 목록
   - 멀티테넌시 요구 (개인/팀/조직)
   - 빌링 요구 (무료/유료 플랜)
2. `_workspace/` 생성
3. `_workspace/00_input/requirements.md`에 정리된 요구사항 저장

### Phase 2: Foundation 설계 (architect 단독)

architect를 서브 에이전트로 호출 (다른 에이전트와 통신 불필요한 초기 설계):

```
Agent(
  name: "architect",
  subagent_type: "architect",
  model: "opus",
  prompt: "schema-design 스킬을 참조하여 SaaS 아키텍처를 설계하라.
    요구사항: [_workspace/00_input/requirements.md]
    산출물: _workspace/01_architect_schema.prisma, _workspace/01_architect_contracts.ts,
            _workspace/01_architect_env.md, _workspace/01_architect_plan.md"
)
```

완료 후 산출물 확인 -> qa-inspector에게 점진적 검증 요청 (서브 에이전트):
```
Agent(name: "qa-arch", subagent_type: "qa-inspector", model: "opus",
  prompt: "contract-validator 스킬의 점진적 검증 모드 - architect 완료. 
    _workspace/01_architect_*.md 파일들의 내적 일관성 검증.")
```

### Phase 3: 병렬 구현 (frontend + backend + devops 에이전트 팀)

팀 구성:
```
TeamCreate(
  team_name: "saas-builders",
  members: [
    { name: "frontend", agent_type: "frontend", model: "opus",
      prompt: "dashboard-builder 스킬을 참조하여 SaaS 대시보드 UI를 구현하라.
        architect 계약: _workspace/01_architect_contracts.ts
        아키텍처 계획: _workspace/01_architect_plan.md" },
    { name: "backend", agent_type: "backend", model: "opus",
      prompt: "api-builder 스킬을 참조하여 SaaS 백엔드를 구현하라.
        스키마: _workspace/01_architect_schema.prisma
        계약: _workspace/01_architect_contracts.ts
        환경변수: _workspace/01_architect_env.md" },
    { name: "devops", agent_type: "devops", model: "opus",
      prompt: "deploy-config 스킬을 참조하여 배포 인프라를 구성하라.
        환경변수: _workspace/01_architect_env.md" },
    { name: "qa", agent_type: "qa-inspector", model: "opus",
      prompt: "contract-validator 스킬을 참조하여 점진적 QA를 수행하라.
        각 에이전트 완료 알림을 받으면 즉시 해당 경계면 검증.
        architect 계약: _workspace/01_architect_contracts.ts" }
  ]
)
```

작업 등록:
```
TaskCreate(tasks: [
  // frontend 작업
  { title: "대시보드 레이아웃 구현", assignee: "frontend",
    description: "사이드바, 탑바, 메인 콘텐츠 영역" },
  { title: "핵심 페이지 생성", assignee: "frontend",
    description: "요구사항의 핵심 기능별 페이지" },
  { title: "Feature 모듈 컴포넌트", assignee: "frontend",
    description: "barrel export 규칙 준수" },

  // backend 작업
  { title: "API CRUD 엔드포인트", assignee: "backend",
    description: "핵심 리소스 CRUD + 인증" },
  { title: "RBAC 미들웨어", assignee: "backend",
    description: "역할 기반 접근 제어" },
  { title: "Server Actions", assignee: "backend",
    description: "Form 처리, 데이터 변이" },

  // devops 작업
  { title: "Docker 설정", assignee: "devops",
    description: "Dockerfile + docker-compose.yml" },
  { title: "CI/CD 파이프라인", assignee: "devops",
    description: "GitHub Actions - lint, build, deploy" },
  { title: ".env.example 갱신", assignee: "devops",
    description: "architect + backend 환경변수 병합" },

  // QA 작업 (의존성 있음)
  { title: "backend API 검증", assignee: "qa",
    description: "API shape vs architect 계약 교차 검증",
    depends_on: ["API CRUD 엔드포인트"] },
  { title: "frontend-backend 정합성", assignee: "qa",
    description: "프론트 타입 vs API shape 교차 검증",
    depends_on: ["핵심 페이지 생성", "API CRUD 엔드포인트"] },
  { title: "환경변수 완전성 검증", assignee: "qa",
    description: "코드 참조 vs .env.example 교차 검증",
    depends_on: [".env.example 갱신"] }
])
```

팀원 간 통신 규칙:
- frontend <-> backend: API shape 합의 (SendMessage)
- backend -> devops: 필요 환경변수 전달
- qa -> frontend/backend: 경계면 불일치 즉시 알림
- 각 팀원: 작업 완료 시 TaskUpdate + 리더 알림

### Phase 4: 최종 통합 검증

1. 모든 팀원 작업 완료 대기 (TaskGet)
2. 팀 정리
3. 최종 QA를 서브 에이전트로 실행:
   ```
   Agent(name: "final-qa", subagent_type: "qa-inspector", model: "opus",
     prompt: "contract-validator 스킬의 전체 교차 검증 + pnpm build 실행.
       모든 산출물: _workspace/*.md")
   ```
4. QA 리포트 확인 -> 실패 항목이 있으면 해당 에이전트 재호출

### Phase 5: 정리 및 보고

1. `_workspace/` 보존 (감사 추적용)
2. 사용자에게 결과 요약:
   - 생성된 파일 목록
   - 아키텍처 결정 요약
   - 환경변수 설정 가이드
   - 배포 방법 (Vercel / Docker)
   - QA 리포트 요약

## 데이터 흐름

```
[requirements] 
    -> [architect] -> contracts, schema, env
        -> [frontend + backend + devops] (병렬, SendMessage로 조율)
            -> [qa-inspector] (점진적 검증)
                -> [final-qa] (전체 검증)
                    -> 최종 산출물
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| architect 실패 | 재시도 1회. 재실패 시 사용자에게 요구사항 명확화 요청 |
| frontend/backend 1개 실패 | 다른 에이전트는 계속 진행, 실패 에이전트 재시작 |
| QA에서 경계면 불일치 발견 | 해당 에이전트에게 SendMessage로 수정 요청 |
| pnpm build 실패 | 에러 로그 분석 -> 원인 에이전트 재호출 |
| 팀원 과반 실패 | 사용자에게 알리고 진행 여부 확인 |

## 테스트 시나리오

### 정상 흐름
1. 사용자가 "프로젝트 관리 SaaS, 팀 기반, 무료+Pro 플랜" 요청
2. Phase 1: 요구사항 분석 -> _workspace/00_input/ 생성
3. Phase 2: architect가 스키마/계약 생성 -> QA 점진 검증 통과
4. Phase 3: 팀 구성 -> frontend/backend/devops 병렬 구현 -> QA 점진 검증
5. Phase 4: 최종 QA -> pnpm build 성공
6. Phase 5: 결과 요약 보고

### 에러 흐름
1. Phase 3에서 QA가 API shape 불일치 발견
2. QA -> backend에게 SendMessage: "app/api/projects/route.ts:15 응답이 { projects: [...] }인데 계약은 { data: [...] }"
3. backend가 수정 -> TaskUpdate 완료
4. QA 재검증 -> 통과
5. Phase 4 정상 진행
