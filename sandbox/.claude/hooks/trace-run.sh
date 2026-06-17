#!/usr/bin/env bash
# Stop hook — append one record per turn to runs/trace.jsonl.
# Captures: session, branch, git state, active bean, turn count, transcript path.
INPUT="$(cat)"
session="$(echo "$INPUT" | jq -r '.session_id // .sessionId // "unknown"' 2>/dev/null)"
project_dir="$(echo "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)"
project_dir="${project_dir:-${CLAUDE_PROJECT_DIR:-.}}"

cd "$project_dir" 2>/dev/null || exit 0
mkdir -p runs

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
changed="$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')"
commits="$(git rev-list --count HEAD 2>/dev/null || echo 0)"

# Active bean (first in-progress, else "none")
bean="$(beans list --json -s in-progress 2>/dev/null | jq -r '.[0].id // "none"')"

# Transcript path and turn count (non-fatal if missing)
project_encoded="$(echo "${project_dir}" | sed 's|[/.]|-|g')"
transcript="${HOME}/.claude/projects/${project_encoded}/${session}.jsonl"
turns="$(python3 -c "
import sys,json
count=0
try:
  with open('${transcript}') as f:
    for line in f:
      try:
        obj=json.loads(line)
        if obj.get('type')=='user' and not obj.get('isMeta') and not obj.get('isSidechain'):
          count+=1
      except: pass
except: pass
print(count)
" 2>/dev/null || echo 0)"

printf '{"at":"%s","session":"%s","bean":"%s","branch":"%s","turns":%s,"changed_files":%s,"commits":%s,"transcript":"%s"}\n' \
  "$ts" "$session" "$bean" "$branch" "$turns" "$changed" "$commits" "$transcript" \
  >> runs/trace.jsonl
exit 0
