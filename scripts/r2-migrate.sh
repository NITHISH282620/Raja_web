#!/usr/bin/env bash
# Upload public media to R2, using the object keys the Neon migration recorded.
#
# Uses the existing wrangler OAuth session rather than minting R2 API tokens:
# the instruction was not to introduce credentials where existing access works,
# and a one-off migration from this machine already has that access.
#
# Idempotent — an R2 PUT overwrites by key, so re-running converges.
set -uo pipefail
cd "$(dirname "$0")/.."

BUCKET=${BUCKET:-raja-public-media}
LIST=${1:-/tmp/r2-upload-list.txt}
OK=0; FAIL=0

while IFS='|' read -r local key ctype; do
  [ -z "${local:-}" ] && continue
  if npx wrangler r2 object put "$BUCKET/$key" --file="$local" --content-type="$ctype" --remote >/dev/null 2>&1; then
    OK=$((OK+1))
  else
    FAIL=$((FAIL+1))
    echo "FAILED: $key" >&2
  fi
  if [ $(( (OK+FAIL) % 25 )) -eq 0 ]; then echo "  ... $((OK+FAIL)) processed (ok=$OK fail=$FAIL)"; fi
done < "$LIST"

echo "uploaded=$OK failed=$FAIL"
exit $([ "$FAIL" -eq 0 ] && echo 0 || echo 1)
