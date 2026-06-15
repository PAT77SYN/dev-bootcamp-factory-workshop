# CLAUDE.md — calc sandbox

Context for Claude Code sessions inside this sandbox.

## What this is

A tiny TypeScript CLI calculator used as the **shared codebase** for the Tag 2 PM
exercise on factory-pipeline Skills (Planner -> Refine -> Implement).

Participants build their own Skills against this code. Each feature increment
is captured as a **Bean** in `.beans/<id>.md`, managed by the **beans CLI**
(`brew install hmans/beans/beans`). Skills read beans via `beans show --json
<id>` and write back via `beans update <id>` — never edit bean files directly.

Run `beans prime` once to load the full agent-facing reference (types,
statuses, commands, workflow). The SessionStart hook does this automatically.

## File layout

```
src/lexer.ts        Token stream. Types: NUMBER, PLUS, MINUS, STAR, SLASH, END.
src/parser.ts       Recursive descent. AST = interface Node { kind, value, op, left, right }.
src/evaluator.ts    Walks AST, returns number. Throws Error on div-by-zero.
src/main.ts         REPL. Catches Error, prints, continues.
tests/*.test.ts     Vitest. One file per source module.
package.json        Scripts, deps. ESM ("type": "module").
tsconfig.json       TypeScript config (strict mode, emits to dist/).
.beans/<id>.md      Per-feature bean files (managed by beans CLI).
.beans.yml          Beans CLI config (prefix, id length, defaults).
```

## Build & test

```bash
npm install
npm run build       # tsc, emits to dist/
npm test            # vitest run
npm run repl        # REPL via tsx (no build); or `npm start` after build
```

## Stack conventions

- **TypeScript with `strict` mode.** Lean on the type system. Keep types
  honest — no `any` escape hatches where a real type clarifies intent.
- **Vitest only.** No other test frameworks or extra test deps without a good
  reason. New deps earn their place or they don't go in.
- **Simple types/interfaces over deep class hierarchies.** `Node` is a single
  interface with a `kind` discriminator. Add new node kinds by extending the
  enum + the evaluator's switch. Resist class hierarchies unless the cost of
  the switch becomes real.
- **Errors throw `Error`** with a readable message. The REPL is the single
  catch point. Don't introduce error-code returns.
- **Clarity over premature optimization.** This is a teaching codebase.
- **Naming.** camelCase for functions and variables, PascalCase for types and
  enums. ESM imports use explicit `.js` extensions (e.g.
  `import { parse } from "./parser.js"`). Match what's already in `src/`.

## Beans workflow

Beans are managed by the `beans` CLI — never `Edit` or `Write` a bean file
directly. The factory-pipeline Skills compose like this:

1. **Planner** appends a `## High-Level Plan` section (approach + AC, no
   file paths) via `beans update <id> --body-append "..."`.
2. **Refine** appends a `## Refined Plan` section (files + signatures + test
   sketch) via the same mechanism. Set status to `in-progress` when work
   starts: `beans update <id> -s in-progress`.
3. **Implement** appends a `## Implementation Log` section with branch + commit
   SHAs. On completion: `beans update <id> -s completed`.

Body sections are conventions, not enforced — the CLI treats the body as one
markdown blob. Skills must append rather than rewrite. Run `beans prime` for
the full reference.

## What Claude should not do here

- Don't introduce another build system or test runner (no Jest, Mocha, esbuild
  scripts, Makefiles — npm + tsc + Vitest is the stack).
- Don't pull in heavy dependencies needlessly. Keep the dependency tree small.
- Don't restructure the AST into a class hierarchy "for cleanliness" — the
  flat interface is intentional.
- Don't touch files under `01-factory-pipeline/` (sibling dir, obsolete) or
  create `01-planner-rework/` / `02-refine/` / `03-implement/` here — those
  are owned by a different agent.
