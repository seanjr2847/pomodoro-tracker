---
name: web-orchestrator
description: "심미적으로 아름다운 웹사이트를 에이전트 팀으로 구축하는 오케스트레이터. design-director(디자인 컨셉) → ui-designer(UI 시스템) → web-engineer(구현) → a11y-auditor(접근성) 파이프라인 조율. 웹사이트 만들어줘, 랜딩페이지 구축, 디자인+구현, 프론트엔드 웹사이트 생성 요청 시 반드시 이 스킬을 사용할 것. 다시 만들어줘, 개선해줘, 업데이트해줘, 보완해줘 등 후속 요청도 포함."
---

# Web Orchestrator

웹사이트 구축 에이전트 팀을 조율한다. 디자인 컨셉 수립부터 접근성 감사까지 파이프라인으로 실행한다.

## 에이전트 팀

| 에이전트 | 역할 | 스킬 |
|---------|------|------|
| design-director | 브랜드 아이덴티티, 컬러 시스템, 타이포그래피 | design-concept |
| ui-designer | 컴포넌트 설계, 레이아웃, 인터랙션 | ui-system |
| web-engineer | Next.js 구현, 성능 최적화 | web-builder |
| a11y-auditor | WCAG 2.1 AA 감사, 접근성 수정 | a11y-checker |

## 실행 워크플로우

### Phase 0: 컨텍스트 확인

**하네스 컨텍스트 로드**: `.claude/agents/website-builder/CLAUDE.md`를 읽어라. 에이전트 팀 구성, 스킬 목록, 파이프라인을 파악한다.

`_workspace/` 존재 여부 확인:
- **미존재** → 초기 실행. Phase 1부터 전체 진행.
- **존재 + 부분 수정 요청** → 해당 에이전트만 재호출. (예: "색상 바꿔줘" → design-director만)
- **존재 + 새 요청** → `_workspace_{timestamp}/`로 이동 후 새 실행.

### Phase 1: 요구사항 분석

사용자 입력에서 추출:
- 웹사이트 목적/도메인
- 타겟 사용자
- 감성 키워드 또는 레퍼런스
- 필요한 페이지 (랜딩, 블로그, 대시보드...)
- 기술 제약 (Next.js 버전, 특정 라이브러리...)

`_workspace/` 생성 후 `_workspace/00_requirements.md`에 정리.

### Phase 2: 디자인 컨셉 (design-director 단독)

```
Agent(
  name: "design-director",
  subagent_type: "design-director",
  model: "opus",
  prompt: "design-concept 스킬을 참조하여 웹사이트 디자인 컨셉을 수립하라.
    요구사항: _workspace/00_requirements.md
    산출물: _workspace/01_design_concept.md"
)
```

완료 후 a11y-auditor에게 색상 사전 검토 요청 (서브 에이전트):
```
Agent(
  name: "color-precheck",
  subagent_type: "a11y-auditor",
  model: "opus",
  prompt: "a11y-checker 스킬의 Phase A(색상 대비율)만 실행하라.
    대상: _workspace/01_design_concept.md의 컬러 시스템
    실패 시: design-director가 정의한 색상을 WCAG AA 통과하도록 직접 수정"
)
```

### Phase 3: UI 시스템 (ui-designer 단독)

design-director 완료 후:
```
Agent(
  name: "ui-designer",
  subagent_type: "ui-designer",
  model: "opus",
  prompt: "ui-system 스킬을 참조하여 UI 시스템을 설계하라.
    디자인 컨셉: _workspace/01_design_concept.md
    산출물: _workspace/02_ui_spec.md"
)
```

### Phase 4: 구현 + 접근성 병렬

ui-designer 완료 후 팀 구성:
```
TeamCreate(
  team_name: "web-builders",
  members: [
    {
      name: "web-engineer",
      subagent_type: "web-engineer",
      model: "opus",
      prompt: "web-builder 스킬을 참조하여 웹사이트를 구현하라.
        UI 스펙: _workspace/02_ui_spec.md
        디자인 컨셉: _workspace/01_design_concept.md
        구현 완료 후 a11y-auditor에게 SendMessage로 감사 요청"
    },
    {
      name: "a11y-auditor",
      subagent_type: "a11y-auditor",
      model: "opus",
      prompt: "a11y-checker 스킬을 참조하여 접근성을 감사하라.
        web-engineer가 완료 메시지를 보내면 즉시 Phase B~E 전체 감사 실행.
        발견된 문제는 직접 수정 후 web-engineer에게 완료 보고.
        산출물: _workspace/04_a11y_report.md"
    }
  ]
)
```

작업 등록:
```
TaskCreate(tasks: [
  { title: "CSS 변수 + 글로벌 스타일 설정", assignee: "web-engineer",
    description: "globals.css에 컬러 토큰, 타이포 스케일 적용" },
  { title: "공통 컴포넌트 구현", assignee: "web-engineer",
    description: "Button, Card, Badge 등 재사용 컴포넌트" },
  { title: "레이아웃 + 네비게이션", assignee: "web-engineer",
    description: "Header, Footer, Skip Navigation 포함" },
  { title: "Hero 섹션", assignee: "web-engineer" },
  { title: "Feature 섹션", assignee: "web-engineer" },
  { title: "CTA / 나머지 섹션", assignee: "web-engineer" },
  { title: "접근성 감사 + 수정", assignee: "a11y-auditor",
    depends_on: ["레이아웃 + 네비게이션", "Hero 섹션"] },
  { title: "최종 접근성 검토", assignee: "a11y-auditor",
    depends_on: ["CTA / 나머지 섹션"] }
])
```

### Phase 5: 최종 검증

팀 완료 후:
- `pnpm lint` 실행
- `pnpm build` 실행 (빌드 성공 확인)
- `_workspace/04_a11y_report.md` 검토 (Critical 항목 없어야 함)

### Phase 6: 결과 보고

사용자에게 요약:
- 생성/수정된 파일 목록
- 디자인 컨셉 핵심 결정 (컬러, 폰트)
- 접근성 감사 결과 (합격률)
- 다음 단계 제안 (블로그 추가, 대시보드 등)

## 데이터 흐름

```
[요구사항]
    → [design-director] → 01_design_concept.md
        → [color-precheck] → 색상 대비 검증 + 수정
            → [ui-designer] → 02_ui_spec.md
                → [web-engineer] → 실제 코드 파일
                ↕ SendMessage
                → [a11y-auditor] → 04_a11y_report.md + 코드 수정
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 색상 대비 실패 | a11y-auditor가 직접 수정, 수정 불가 시 design-director 재호출 |
| 빌드 실패 | 에러 로그 → web-engineer 재호출 |
| 에이전트 1개 실패 | 나머지 계속 진행, 보고서에 누락 표기 |
| WCAG Critical 항목 | 무조건 수정 후 다음 Phase |

## 부분 재실행 가이드

| 사용자 요청 | 재실행 대상 |
|-----------|-----------|
| "색상 바꿔줘" | design-director → color-precheck → web-engineer (CSS 변수만) |
| "레이아웃 다시 잡아줘" | ui-designer → web-engineer |
| "접근성 다시 확인해줘" | a11y-auditor (최종 감사만) |
| "Hero 섹션 고쳐줘" | web-engineer (해당 파일만) |

## 테스트 시나리오

### 정상 흐름
1. "테크 스타트업 랜딩페이지 만들어줘. 모던하고 신뢰감 있는 느낌" 입력
2. Phase 1: 요구사항 추출 (SaaS, 개발자 타겟, 모던/신뢰)
3. Phase 2: design-director → Blue 계열 Primary, Inter 폰트, 깔끔한 레이아웃
4. color-precheck → 색상 대비 통과 확인
5. Phase 3: ui-designer → Hero+Features+Pricing+CTA 섹션 설계
6. Phase 4: web-engineer 구현 + a11y-auditor 병렬 감사
7. Phase 5: pnpm build 성공, WCAG AA 통과
8. Phase 6: 결과 보고

### 에러 흐름
1. design-director가 채도 높은 색상 선택 → 대비율 3.1:1 (실패)
2. a11y-auditor가 oklch 명도 조정 → 대비율 4.8:1 통과
3. `01_design_concept.md` 수정 후 web-engineer에게 수정된 컬러 토큰 전달
4. 정상 진행
