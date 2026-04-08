---
name: contract-validator
description: "SaaS 보일러플레이트의 통합 정합성을 검증한다. API 응답-프론트 타입 교차 비교, 라우팅 경로 매핑, 환경변수 완전성, barrel export 규칙, Prisma-API-UI 데이터 흐름 검증. QA 검증, 통합 테스트, 정합성 확인 요청 시 사용."
---

# Contract Validator -- 통합 정합성 검증 스킬

모듈 간 경계면을 교차 비교하여 통합 정합성을 검증한다. "존재 확인"이 아니라 "양쪽 동시 읽기"가 핵심이다.

## 검증 워크플로우

### Step 1: 계약 로딩

```
1. Read _workspace/01_architect_contracts.ts -- 기준 진실 (source of truth)
2. Read _workspace/01_architect_env.md -- 환경변수 명세
3. Read _workspace/02_frontend_pages.md -- 프론트 구현 목록
4. Read _workspace/02_backend_api.md -- API 구현 목록
```

### Step 2: 경계면 교차 검증

#### 2-1. API Shape <-> 프론트 타입

각 API route의 `NextResponse.json()` 호출부와 대응 훅/컴포넌트의 타입을 비교:

```
검증 절차:
1. Grep "NextResponse.json" in app/api/ -- API 응답 shape 추출
2. Grep "fetch\(|fetchJson" in features/ -- 프론트 호출 추출
3. 각 엔드포인트의 응답 shape vs 프론트 타입 1:1 비교
4. 래핑 여부 확인: API가 { data: [...] } 반환 시 프론트가 .data 접근하는지
```

#### 2-2. 라우팅 경로 매핑

```
검증 절차:
1. app/ 하위 page.tsx 파일에서 URL 경로 추출
2. Grep "href=|router.push|redirect\(" -- 모든 링크 수집
3. 각 링크가 실제 존재하는 page와 매칭되는지 확인
4. 동적 세그먼트 [param]의 올바른 파라미터 전달 확인
```

#### 2-3. Prisma -> API -> UI 데이터 흐름

```
검증 절차:
1. Read prisma/schema.prisma -- 필드명 추출
2. API 응답에서 같은 데이터의 필드명 확인
3. 프론트 타입에서 필드명 확인
4. snake_case(DB) -> camelCase(API/UI) 변환 일관성 확인
```

#### 2-4. 환경변수 완전성

```
검증 절차:
1. Grep "process\.env\." -- 코드에서 참조하는 변수 수집
2. Read .env.example -- 정의된 변수 목록
3. 코드 참조 중 .env.example에 없는 것 = 누락
4. .env.example에 있지만 코드에서 참조 안 하는 것 = 불필요 (경고)
```

#### 2-5. Barrel Export 규칙

```
검증 절차:
1. Grep "from \"@/features/" -- 모든 feature import 수집
2. 각 import가 index.ts barrel export를 경유하는지 확인
3. deep import (features/x/components/Y) 발견 시 위반 보고
```

### Step 3: 빌드 검증

```bash
pnpm lint && pnpm build
```

빌드 실패 시 에러 로그 분석 -> 원인 에이전트 식별 -> 수정 요청

### Step 4: 리포트 생성

`_workspace/04_qa_report.md` 형식:

```markdown
# QA 검증 리포트

## 요약
- 통과: N개
- 실패: M개
- 미검증: K개

## 실패 항목
### [FAIL] API shape 불일치: /api/resources
- 생산자: app/api/resources/route.ts:15 -- { items: [...] }
- 소비자: features/resources/hooks/useResources.ts:8 -- Resource[] 기대
- 수정: 훅에서 response.items로 접근하거나 API에서 배열 직접 반환

## 통과 항목
### [PASS] 라우팅 정합성
- 모든 href가 실제 page 경로와 매칭
```

## 점진적 검증 모드

전체 검증이 아닌 특정 경계면만 검증할 때:

| 트리거 | 검증 범위 |
|--------|----------|
| architect 완료 | 스키마 내적 일관성, 계약 타입 유효성 |
| backend API 완료 | API shape vs 계약, 환경변수 사용 |
| frontend 완료 | 프론트 타입 vs API shape, 라우팅 |
| devops 완료 | 환경변수 완전성, Docker 빌드 |
| 최종 | 전체 교차 검증 + pnpm build |
