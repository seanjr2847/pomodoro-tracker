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