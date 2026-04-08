---
name: deploy-config
description: "Docker, CI/CD(GitHub Actions), 환경변수, Vercel 배포를 설정한다. Dockerfile, docker-compose, GitHub Actions 워크플로우, .env.example 갱신, 번들 분석 스크립트. 배포 설정, CI/CD 파이프라인, Docker, 환경 설정 요청 시 사용."
---

# Deploy Config -- SaaS 배포 인프라 스킬

SaaS 보일러플레이트를 clone-and-ship 가능하도록 배포 인프라를 구성한다.

## 사전 확인

```
1. Read _workspace/01_architect_env.md -- 환경변수 명세
2. Read _workspace/02_backend_api.md -- 외부 서비스 의존성
3. Read package.json -- 현재 스크립트/의존성
4. Read next.config.ts -- 현재 Next.js 설정
5. Read .env.example -- 기존 환경변수
```

## Dockerfile (멀티스테이지)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm db:generate && pnpm build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

## docker-compose.yml

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: saas
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm db:generate
      - run: pnpm build
```

## .env.example 갱신 규칙

- architect의 환경변수 명세와 backend의 추가 요구사항을 병합
- 기존 변수는 절대 삭제하지 않음
- 각 변수에 주석으로 용도 설명
- 선택적 변수는 `# Optional:` 접두사

## next.config.ts 업데이트

output: "standalone" 설정이 Docker 배포에 필요:
```typescript
const nextConfig = {
  output: "standalone",
  // ... 기존 설정 유지
};
```

## 검증 스크립트

`scripts/check-env.sh` -- 필수 환경변수 존재 확인:
```bash
#!/bin/bash
required=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
for var in "${required[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: $var is not set" && exit 1
  fi
done
echo "All required env vars are set"
```

## 산출물

구현 완료 후 `_workspace/03_devops_config.md`에 기록:
- 생성한 파일 목록
- CI/CD 파이프라인 단계 설명
- 환경변수 갱신 내역
- 배포 가이드 (Vercel / Docker)
