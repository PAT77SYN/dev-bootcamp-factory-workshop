# Factory Pipeline Workshop — Team Takeaway

> A reference for attendees and a primer for those who couldn't join.

---

## Orientation

We started with a problem: multi-stage AI agent work becomes chaotic without clear boundaries — outputs are unverifiable, quality is inconsistent, and handoffs break silently. The workshop's answer is a **factory pipeline**: a deterministic workflow where each stage produces a durable artifact with an exact contract, and the next stage only proceeds when that contract is met. We built this end-to-end on a shared TypeScript calculator, adding four interlocking components that together form a self-improving, quality-gated development loop.

---

## The Journey

### 1 · Calculator Sandbox — the shared codebase

We needed a real codebase to run the factory against. The calculator is minimal by design: a lexer tokenizes input, a recursive-descent parser builds an AST, and an evaluator walks the tree. The REPL catches errors and continues. Simple enough to understand fully, complex enough to make factory stages non-trivial.

```
src/lexer.ts → src/parser.ts → src/evaluator.ts → src/main.ts
```

Through the session we extended it with real feature beans: decimal comma support (`1,5+2,5 → 4`), float division (`7/2 → 3,5`), and output formatting — each flowing through the full planner → refine → implement pipeline.

### 2 · Factory Pipeline Skills — the workflow engine

Three Claude Code skills compose the factory:

- **`/planner`** — takes a raw idea, asks one clarifying question at a time, proposes 2–3 approaches, and creates a Bean. The High-Level Plan stays abstract: no file paths, no function names.
- **`/refine`** — dispatches a single read-only subagent to map the codebase, then appends a `## Refined Plan` with verified file paths, signatures, and a test sketch. Never touches source.
- **`/implement`** — creates a feature branch, walks each file in the plan (edit → build → test → commit), and only commits when green. One logical step per commit. Never commits on main, never pushes.

The contract between stages is enforced by **exact heading matches** in the bean body:

```
/planner writes  →  ## High-Level Plan
/refine  reads + writes  →  ## Refined Plan
/implement reads + writes  →  ## Implementation Log
```

### 3 · Eval Kit — the quality gate

A vague bean produces vague code. The eval kit enforces four checks before any implementation starts:

| Check | What it catches |
|---|---|
| Planner altitude | High-Level Plan mentions a `.ts` file (too low-level) |
| Refined Plan present | `/refine` was never run |
| AC not placeholder | Acceptance criteria contains "it works" |
| AC specific & measurable | LLM judge: are criteria testable? |

The fourth check is a `claude -p` subagent call — each invocation is a headless Claude process that reads the AC block and returns `PASS` or `FAIL`. The prompt lives in `eval-kit/judges/ac-specific-prompt.md`, easy to iterate on independently.

`/implement` Phase 1 runs the full harness before creating any branch. If any check fails, it aborts with the failing check names listed. The working tree is untouched.

### 4 · Trace & Reflection System — the learning loop

Every turn now records observable data:

- **`trace-run.sh`** (Stop hook) — appends session ID, active bean, branch, turn count, commit count, and transcript path to `runs/trace.jsonl`.
- **`tool-outcome.sh`** (PostToolUse hook) — fires on every `npm run build` / `npm test` Bash call, records pass/fail and first error line to `runs/tool-outcomes.jsonl`.
- **`runs/reflect.sh`** — groups both logs by session and prints: bean, branch, time range, turns, commits, build/test failures.

This closes the loop: you can see which beans took the most rework, which stages produced the most failures, and where the factory needs tuning.

---

## Component Reference

### Calculator Sandbox

| File | Purpose |
|---|---|
| `src/lexer.ts` | Tokenizes input: NUMBER, operators, parens |
| `src/parser.ts` | Recursive-descent AST; Node kind discriminator |
| `src/evaluator.ts` | Tree-walk; throws on div-by-zero |
| `src/format.ts` | `formatResult(n)`: comma separator, no trailing zeros |
| `src/main.ts` | REPL; catches errors, prints, continues |
| `tests/*.test.ts` | Vitest; one file per module + E2E calc.test.ts |

```bash
npm install && npm run build   # compile
npm test                       # 29 tests, all green
npm run repl                   # interactive: > 1,5+2,5 → 4
```

### Factory Skills

```bash
/planner Add support for exponentiation X^Y   # creates a bean
/refine  sandbox-xxxx                         # appends Refined Plan
/implement sandbox-xxxx                       # branch → code → tests → commits
```

Skills live in `.claude/skills/`. Each is a `SKILL.md` with model, tools, and full phase-by-phase instructions.

### Beans CLI

```bash
brew install hmans/beans/beans
beans create "Title" -t feature -d "$(cat <<'EOF' ... EOF)"
beans show sandbox-xxxx --json
beans update sandbox-xxxx -s in-progress
beans list --json -s in-progress
```

Bean files are stored in `.beans/` as `<id>--<slug>.md`. The beans CLI owns frontmatter — never edit those files directly with an editor.

### Eval Kit

```bash
bash eval-kit/check.sh .beans/<bean-file>.md
# PASS  High-Level Plan names no source file
# PASS  Refined Plan is present
# PASS  acceptance criteria are real
# PASS  AC are specific and measurable
```

Add new checks to `eval-kit/check.sh` — same one-liner `pass/fail` pattern. LLM judges go in `eval-kit/judges/` with a companion `*-prompt.md`.

### Reflection

```bash
python3 runs/reflect.sh                # all sessions
python3 runs/reflect.sh <session-id>   # single session
cat runs/trace.jsonl | tail -5         # raw per-turn state
cat runs/tool-outcomes.jsonl | tail -5 # raw build/test outcomes
```

---

## Get Started

### Prerequisites

```bash
brew install hmans/beans/beans   # beans CLI
node --version                   # >= 20
which jq                         # JSON parsing (used in hooks)
which python3                    # for reflect.sh
```

### First run

```bash
cd sandbox
npm install
npm run build && npm test        # expect: 29 tests, all green
npm run repl                     # smoke-test: > 2+2 → 4, then exit
```

### Build your first feature

```bash
/planner Brief: add support for X        # creates sandbox-xxxx bean
/refine sandbox-xxxx                     # appends Refined Plan
/implement sandbox-xxxx                  # branch, code, tests, commits
```

### Review a session

```bash
python3 runs/reflect.sh                  # what was worked on, how many failures
bash eval-kit/check.sh .beans/<id>.md   # verify bean quality before implementing
```

### Key files to read

| File | Why |
|---|---|
| `CLAUDE.md` | Stack conventions, file layout, beans workflow |
| `.claude/skills/planner/SKILL.md` | Full planner spec (5 phases, guardrails) |
| `.claude/skills/refine/SKILL.md` | Refiner spec (subagent dispatch, path verification) |
| `.claude/skills/implement/SKILL.md` | Implementer spec (preflight gate, commit guards) |
| `eval-kit/check.sh` | Quality harness — add new checks here |
| `eval-kit/judges/ac-specific-prompt.md` | LLM judge prompt — iterate here |
