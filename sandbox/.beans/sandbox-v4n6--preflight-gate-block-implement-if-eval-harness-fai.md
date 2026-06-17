---
# sandbox-v4n6
title: 'Preflight gate: block /implement if eval harness fails'
status: completed
type: feature
priority: normal
created_at: 2026-06-17T09:50:26Z
updated_at: 2026-06-17T09:56:23Z
---

The /implement skill has no quality gate on the bean's content before it starts
work. A bean with vague AC, missing Refined Plan, or wrong altitude in the
High-Level Plan can sail through into code. This feature adds a hard preflight
check: run the full eval harness against the target bean and abort before any
branch or file is touched if any check returns FAIL.

**Hinweise:**
- Gate must fire before Phase 2 (branch creation) — no side-effects if it aborts.
- Error output must name the failing check(s) explicitly so the author knows what to fix.
- All existing preflight aborts use the same ERROR: … pattern — this gate must match.
- eval-kit/check.sh is the harness; it exits with output lines starting PASS or FAIL.

## High-Level Plan

**Approach** — Add a new preflight step to the implement skill that resolves the
bean file path from the bean ID, runs the full eval harness against it, and
aborts with a descriptive error if any check returns FAIL. The gate runs after
the existing clean-tree and branch checks so it only fires when the environment
is sane.

**Steps**
- Resolve the bean file path from the bean ID
- Run the full eval harness and capture output
- Scan output for any FAIL lines
- If any found, print each failing check and abort cleanly
- If all pass, continue to the existing Phase 2

**Acceptance Criteria**
- Invoking /implement on a bean where all checks pass proceeds to branch creation uninterrupted
- Invoking /implement on a bean where the AC judge returns FAIL aborts before any branch is created, printing: `ERROR: bean failed quality checks` followed by each failing check line
- No file is created, no branch exists, and the working tree is unchanged after a gate abort
- The error message names every failing check, not just the first

**Non-Goals**
- Caching eval results inside the bean body
- Running only a subset of checks
- Auto-fixing or auto-re-planning failing beans

## Refined Plan

### Files to change
- .claude/skills/implement/SKILL.md:50-58 — insert eval-harness gate after the existing clean-tree/branch checks, before Phase 2; resolves bean file path via `beans show <id> --json | jq -r '.path'`, runs `bash eval-kit/check.sh .beans/<path>`, collects FAIL lines, aborts with ERROR message naming all failing checks

### New signatures
- (none) — extends SKILL.md prose only; no source functions

### Test sketch
- gate_pass — good-bean.md (all PASS) → preflight continues to branch creation uninterrupted
- gate_fail_ac — broken-bean.md (FAIL AC are specific and measurable) → aborts before branch, prints `ERROR: bean failed quality checks` + all FAIL lines
- gate_fail_multiple — broken-bean.md (FAIL altitude + FAIL AC) → error names both failing checks, not just the first
- gate_no_side_effects — after gate abort, no branch created, no files changed, working tree clean

## Implementation Log

**Branch:** feat/sandbox-v4n6-preflight-gate-block-implement-if-eval

**Commits:**
- e90e153 — Preflight gate: abort /implement if eval harness has any FAIL

**Final test status:** PASS  (npm test → 29 tests, 5 files, all green)

## Summary of Changes

- Added eval-harness gate to Phase 1 preflight in `.claude/skills/implement/SKILL.md`: resolves the bean file path, runs `eval-kit/check.sh` against it, collects all FAIL lines, and aborts with `ERROR: bean failed quality checks` + each failing check before any branch is created.
- All four Acceptance Criteria exercised: pass-through on clean bean, abort on vague AC, no branch created on abort, all failing checks named.
