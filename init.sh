#!/bin/bash
set -e

case "$1" in
  tidy)
    echo "🧹 Tidy..."
    pnpm lint --fix
    echo "✅ Tidy 완료"
    ;;
  verify)
    echo "🔍 Verify..."
    pnpm build
    pnpm lint
    echo "✅ Verify 완료"
    ;;
  *)
    echo "Usage: ./init.sh [tidy|verify]"
    ;;
esac