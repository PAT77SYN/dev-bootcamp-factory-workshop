#!/usr/bin/env bash
# Judge: Acceptance Criteria are specific and measurable.
# Usage: bash eval-kit/judges/ac-specific.sh <bean-file>
# Outputs one line: PASS  AC are specific and measurable
#                or FAIL  AC are specific and measurable

BEAN="${1:?usage: ac-specific.sh <bean-file>}"
BODY="$(cat "$BEAN")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROMPT_FILE="$SCRIPT_DIR/ac-specific-prompt.md"

AC="$(awk '/^\*\*Acceptance Criteria\*\*/{f=1;next} /^\*\*/{f=0} f' <<<"$BODY" | sed '/^[[:space:]]*$/d')"

if [ -z "$AC" ]; then
  echo "FAIL  AC are specific and measurable"
  exit 0
fi

printf '%s' "$AC" | claude -p "$(cat "$PROMPT_FILE")" 2>/dev/null \
  || echo "FAIL  AC are specific and measurable"
