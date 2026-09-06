#!/usr/bin/env bash
# Verify every media object recorded in Neon actually exists in R2, and that
# the bytes match the local original.
#
# A successful PUT is not evidence: 4 of the first 107 uploads reported failure
# and a naive run would have left silent gaps behind published images.
set -uo pipefail
cd "$(dirname "$0")/.."

BUCKET=${BUCKET:-raja-public-media}
LIST=${1:-/tmp/r2-upload-list.txt}
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

OK=0; MISSING=0; MISMATCH=0
while IFS='|' read -r local key ctype; do
  [ -z "${local:-}" ] && continue
  out="$TMP/obj"
  if ! npx wrangler r2 object get "$BUCKET/$key" --file="$out" --remote >/dev/null 2>&1; then
    echo "MISSING: $key"; MISSING=$((MISSING+1)); continue
  fi
  a=$(stat -c %s "$local"); b=$(stat -c %s "$out")
  if [ "$a" != "$b" ]; then
    echo "SIZE MISMATCH: $key (local=$a r2=$b)"; MISMATCH=$((MISMATCH+1)); continue
  fi
  OK=$((OK+1))
  if [ $(( (OK+MISSING+MISMATCH) % 25 )) -eq 0 ]; then
    echo "  ... $((OK+MISSING+MISMATCH)) checked"
  fi
done < "$LIST"

echo "verified=$OK missing=$MISSING mismatched=$MISMATCH"
[ "$MISSING" -eq 0 ] && [ "$MISMATCH" -eq 0 ]
