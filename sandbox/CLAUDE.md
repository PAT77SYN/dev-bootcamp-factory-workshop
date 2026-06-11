# CLAUDE.md — calc sandbox

Context for Claude Code sessions inside this sandbox.

## What this is

A tiny C++17 CLI calculator used as the **shared codebase** for the Tag 2 PM
exercise on factory-pipeline Skills (Planner -> Refine -> Implement).

Participants build their own Skills against this code. Each feature increment
is captured as a **Bean** in `.beans/<id>.md`, managed by the **beans CLI**
(`brew install hmans/beans/beans`). Skills read beans via `beans show --json
<id>` and write back via `beans update <id>` — never edit bean files directly.

Run `beans prime` once to load the full agent-facing reference (types,
statuses, commands, workflow). The SessionStart hook does this automatically.

## File layout

```
src/lexer.{h,cpp}      Token stream. Types: NUMBER, PLUS, MINUS, STAR, SLASH, END.
src/parser.{h,cpp}     Recursive descent. AST = struct Node { kind, value, op, left, right }.
src/evaluator.{h,cpp}  Walks AST, returns int64_t. Throws std::runtime_error on div-by-zero.
src/main.cpp           REPL. Catches std::exception, prints, continues.
tests/*_test.cpp       GoogleTest. One file per source module.
CMakeLists.txt         C++17, FetchContent GoogleTest 1.14.
.beans/<id>.md         Per-feature bean files (managed by beans CLI).
.beans.yml             Beans CLI config (prefix, id length, defaults).
```

## Build & test

```bash
cmake -B build
cmake --build build
ctest --test-dir build
./build/calc        # REPL
```

## Stack conventions

- **C++17.** Use `std::variant`, `std::optional`, `std::string_view` where they
  clarify intent. Don't reach for newer standards.
- **GoogleTest only.** No Boost, no Catch2, no extra dependencies. New deps
  go through FetchContent or they don't go in.
- **Simple structs over deep OOP.** AST nodes are a single `struct Node` with
  a `kind` discriminator. Add new node kinds by extending the enum + the
  evaluator's switch. Resist abstract base classes unless the cost of the
  switch becomes real.
- **Errors throw `std::runtime_error`** with a readable message. The REPL is
  the single catch point. Don't introduce error-code returns.
- **No allocations in hot loops, but no premature optimization either.**
  Clarity wins. This is a teaching codebase.
- **Naming.** snake_case for functions and variables, PascalCase for types,
  `kFoo` for compile-time constants. Match what's already in `src/`.

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

- Don't introduce a build system other than CMake.
- Don't pull in extra C++ libraries (no Boost, fmt, spdlog, abseil).
- Don't restructure the AST into a class hierarchy "for cleanliness" — the
  flat struct is intentional.
- Don't touch files under `01-factory-pipeline/` (sibling dir, obsolete) or
  create `01-planner-rework/` / `02-refine/` / `03-implement/` here — those
  are owned by a different agent.
