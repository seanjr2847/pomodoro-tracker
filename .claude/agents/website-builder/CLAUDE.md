# 하네스: Website Builder

**목표:** 심미적으로 아름답고 접근 가능한 웹사이트를 에이전트 팀으로 구축한다. 디자인 컨셉 수립부터 접근성 감사까지 파이프라인으로 실행한다.

## 에이전트 팀

| 에이전트 | 역할 |
|---------|------|
| design-director | 브랜드 아이덴티티, 컬러 시스템, 타이포그래피, 무드보드 |
| ui-designer | 컴포넌트 설계, 레이아웃, 인터랙션 패턴, 반응형 전략 |
| web-engineer | Next.js 구현, 시맨틱 HTML, 성능 최적화 |
| a11y-auditor | WCAG 2.1 AA 감사, ARIA, 키보드 네비게이션, 접근성 수정 |

## 스킬

| 스킬 | 용도 | 사용 에이전트 |
|------|------|-------------|
| web-orchestrator | 웹사이트 구축 팀 전체 조율 (디자인→UI→구현→접근성) | 리더(메인) |
| design-concept | 브랜드 아이덴티티, 컬러 시스템, 타이포그래피 수립 | design-director |
| ui-system | 컴포넌트 설계, 레이아웃, 인터랙션 패턴 명세 | ui-designer |
| web-builder | Next.js + Tailwind 구현, 성능 최적화, SEO | web-engineer |
| a11y-checker | WCAG 2.1 AA 감사 + 코드 직접 수정 | a11y-auditor |

## 실행 규칙

- 웹사이트 구축/디자인/프론트엔드 생성 요청 시 `web-orchestrator` 스킬을 통해 에이전트 팀으로 처리
- 후속 작업: 다시 만들어줘, 개선해줘, 업데이트해줘, 보완해줘도 포함
- 단순 질문/확인은 에이전트 팀 없이 직접 응답
- 모든 에이전트는 `model: "opus"` 사용
- 중간 산출물: `_workspace/` 디렉토리

## 파이프라인

1. **design-director** → 디자인 컨셉 (`_workspace/01_design_concept.md`)
2. **ui-designer** (+ a11y 색상 사전 검토) → UI 스펙 (`_workspace/02_ui_spec.md`)
3. **web-engineer** (+ a11y 병렬 감사) → 구현 (`_workspace/03_implementation_notes.md`)
4. **a11y-auditor** → 최종 감사 리포트 (`_workspace/04_a11y_report.md`)

## 스택

- Next.js 15 + App Router
- Tailwind CSS v4
- TypeScript
- shadcn/ui
- WCAG 2.1 AA 기준 접근성

## 디렉토리

에이전트: `.claude/agents/website-builder/`
스킬: `.claude/skills/website-builder/`
