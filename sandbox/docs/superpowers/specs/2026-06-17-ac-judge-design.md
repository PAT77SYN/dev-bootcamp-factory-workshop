# Design: AC Specificity Judge

**Date:** 2026-06-17
**Status:** Approved

## Problem

The eval-kit `check.sh` harness can detect trivially vague AC (literal "it works") via grep, but cannot detect subtler vagueness — passive language, missing concrete examples, unmeasurable conditions. An LLM subagent can make this judgment reliably.

## Goal

Add one new eval to `check.sh` that calls a `claude -p` subagent and outputs `PASS  AC are specific and measurable` or `FAIL  AC are specific and measurable`, matching the existing harness format exactly.

## File Layout

```
eval-kit/
  check.sh                          # +1 line calling the judge
  judges/
    ac-specific.sh                  # runner: extract AC → claude → print result
    ac-specific-prompt.md           # prompt fed to the subagent
```

## Data Flow

1. `check.sh` calls `bash eval-kit/judges/ac-specific.sh "$BEAN"`
2. `ac-specific.sh` reads the bean file, extracts the `**Acceptance Criteria**` block with `awk`
3. The AC block is piped to `claude -p "$(cat eval-kit/judges/ac-specific-prompt.md)"`
4. The subagent replies with exactly one line: `PASS  AC are specific and measurable` or `FAIL  AC are specific and measurable`
5. The script echoes that line — no reformatting needed

## AC Extraction

```bash
AC="$(awk '/^\*\*Acceptance Criteria\*\*/{f=1;next} /^\*\*/{f=0} f' <<<"$BODY")"
```

Extracts lines between `**Acceptance Criteria**` and the next `**` heading (or end of section). If the block is empty the judge returns FAIL.

## Prompt (`ac-specific-prompt.md`)

```
You are evaluating Acceptance Criteria in a software feature spec.

Rule: every criterion must be specific and measurable — a concrete input/output,
a named behaviour, or a verifiable condition. Vague language ("it works",
"correctly", "properly", "handles edge cases", "performs well") fails.

Acceptance Criteria to evaluate:
{{AC_BLOCK}}

Reply with exactly one line:
PASS  AC are specific and measurable
or
FAIL  AC are specific and measurable
No other output.
```

The AC block is passed via stdin; the prompt is passed via `-p`.

## Expected Behaviour

| Bean | AC content | Result |
|---|---|---|
| `good-bean.md` | `7 % 3 → 1`, `modulo binds at same level as * and /` | `PASS` |
| `broken-bean.md` | `it works` | `FAIL` |

## Error Handling

- Empty AC block → `FAIL  AC are specific and measurable`
- `claude` CLI unavailable → script exits non-zero; `check.sh` treats as `FAIL`
- Unexpected LLM output → script echoes raw output (visible to user, doesn't crash harness)

## Out of Scope

- Scoring (1–5) — binary PASS/FAIL is sufficient
- Checking other sections (Non-Goals, Test Sketch) — separate judges if needed
- Caching LLM responses
