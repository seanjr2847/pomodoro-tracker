# 하네스: SaaS Boilerplate Generator

**목표:** SaaS 보일러플레이트를 에이전트 팀으로 생성/확장하여 solo founder가 하루 안에 배포할 수 있는 모노레포를 만든다.

## 에이전트 팀

| 에이전트 | 역할 |
|---------|------|
| architect | DB 스키마(Prisma), 인증(NextAuth), 멀티테넌시, 공유 계약/타입 설계 |
| frontend | Next.js 15 App Router 대시보드 UI, 페이지, Feature 모듈 컴포넌트 |
| backend | API 라우트, Server Actions, RBAC 미들웨어, 빌링(Paddle) 통합 |
| devops | Docker, CI/CD(GitHub Actions), 환경변수, Vercel 배포 설정 |
| qa-inspector | 모듈 간 통합 정합성 교차 검증 (API-프론트 경계면, 환경변수, 라우팅) |

## 스킬

| 스킬 | 용도 | 사용 에이전트 |
|------|------|-------------|
| saas-orchestrator | SaaS 팀 전체 조율 (파이프라인+팬아웃) | 리더(메인) |
| schema-design | Prisma 스키마, 인증, 멀티테넌시, 공유 계약 | architect |
| dashboard-builder | Next.js 대시보드 UI, 페이지, 컴포넌트 | frontend |
| api-builder | API 라우트, Server Actions, RBAC, 빌링 | backend |
| deploy-config | Docker, CI/CD, 환경변수, 배포 | devops |
| contract-validator | 통합 정합성 교차 검증 | qa-inspector |

## 실행 규칙

- SaaS 보일러플레이트 생성/확장/수정 요청 시 `saas-orchestrator` 스킬을 통해 에이전트 팀으로 처리
- 후속 작업: 보일러플레이트 수정, 부분 재실행, 업데이트, 보완, 다시 실행, 이전 결과 개선, 스키마 수정, API 추가, 페이지 추가, 배포 설정 변경도 포함
- 단순 질문/확인은 에이전트 팀 없이 직접 응답
- 모든 에이전트는 `model: "opus"` 사용
- 중간 산출물: `_workspace/` 디렉토리

## 아키텍처 패턴

파이프라인 + 팬아웃:
1. **architect** (단독) → 스키마/계약 설계
2. **frontend + backend + devops** (병렬) → 구현
3. **qa-inspector** (점진적) → 경계면 검증

## 스택

- Next.js 15 + App Router + React 19
- Prisma + Neon (PostgreSQL)
- NextAuth (Auth.js) + Google OAuth
- Paddle 빌링 (환경변수 토글)
- shadcn/ui + Tailwind CSS v4
- Vercel 배포

## 디렉토리

에이전트: `.claude/agents/saas-boilerplate/`
스킬: `.claude/skills/saas-boilerplate/`
