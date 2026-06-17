---
# sandbox-vsb7
title: ASCII Bar Chart and Sparkline Renderer (Go)
status: todo
type: feature
created_at: 2026-06-16T14:35:32Z
updated_at: 2026-06-16T14:35:32Z
---

A Go package that renders ASCII bar charts and compact unicode sparklines from labeled numeric data. Both renderers implement a shared interface so callers can treat them uniformly and swap them at runtime. The render output is a plain string — making the function return value itself the test assertion, with no side effects to mock.

**Hinweise:**
- Standalone Go package, not part of the existing TypeScript calculator
- Tests assert on the returned string directly — no I/O, no mocks
- The shared interface is the load-bearing design choice; both renderers must satisfy it at compile time

## High-Level Plan

**Approach** — Define a common renderer interface with a single method that accepts labeled numeric data and returns a string. Implement two concrete renderers (bar chart and sparkline) that satisfy it. This keeps the API uniform, lets callers hold either renderer behind the same type, and makes tests pure string comparisons.

**Steps**
- Step 1 — Define the shared renderer interface: one method, labeled numeric data in, string out
- Step 2 — Implement the bar chart renderer: scale values to a fixed display width, draw horizontal filled bars with labels and raw values aligned
- Step 3 — Implement the sparkline renderer: map each value to a unicode block character (▁▂▃▄▅▆▇█) proportional to the range, return a single compact line
- Step 4 — Write table-driven tests for both renderers asserting exact string output (empty input, single point, multiple points, all-equal values)

**Acceptance Criteria**
- Rendering two labeled data points returns a non-empty string for both renderers
- Bar chart output contains each label exactly once, bars proportional to input values
- Sparkline output is a single line with one unicode block character per data point, proportional to the value range
- Both renderers satisfy the shared interface — compile-time check passes (`go build ./...`)
- All-equal values → all bars are the same width / all blocks are the same character
- Empty input → returns an empty string
- All tests pass with `go test ./...`

**Non-Goals**
- Vertical bar charts
- ANSI colour codes
- Terminal width auto-detection
- CLI binary or REPL integration (library only)
- Floating-point formatting options beyond basic rounding
