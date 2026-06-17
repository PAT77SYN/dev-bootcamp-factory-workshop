#!/usr/bin/env bash
# PostToolUse hook — record npm build/test pass/fail to runs/tool-outcomes.jsonl.
# Only fires for Bash commands that invoke npm run build or npm test.
INPUT="$(cat)"
session="$(echo "$INPUT" | jq -r '.session_id // .sessionId // "unknown"' 2>/dev/null)"
project_dir="$(echo "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)"
project_dir="${project_dir:-${CLAUDE_PROJECT_DIR:-.}}"

cd "$project_dir" 2>/dev/null || exit 0
mkdir -p runs

tool="$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)"
[ "$tool" = "Bash" ] || exit 0

cmd="$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)"
case "$cmd" in
  *"npm run build"*|*"npm test"*) ;;
  *) exit 0 ;;
esac

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
response="$(echo "$INPUT" | jq -r '.tool_response // ""' 2>/dev/null)"

# Detect outcome by scanning response for error markers
if echo "$response" | grep -qiE '(error TS[0-9]|FAILED|npm ERR!|✗|× )'; then
  outcome="fail"
  first_error="$(echo "$response" | grep -iE '(error TS[0-9]|FAILED|npm ERR!|✗|× )' | head -1 | cut -c1-150)"
else
  outcome="pass"
  first_error=""
fi

cmd_short="$(echo "$cmd" | sed 's/^[[:space:]]*//' | cut -c1-80 | sed 's/"/\\"/g')"
first_error_json="$(printf '%s' "$first_error" | jq -Rsa '.' 2>/dev/null || echo '""')"

printf '{"at":"%s","session":"%s","cmd":"%s","outcome":"%s","first_error":%s}\n' \
  "$ts" "$session" "$cmd_short" "$outcome" "$first_error_json" \
  >> runs/tool-outcomes.jsonl
exit 0
