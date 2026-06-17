---
# sandbox-vzwt
title: Kommazahlen-Support im Calculator
status: in-progress
type: feature
priority: normal
created_at: 2026-05-26T13:22:49Z
updated_at: 2026-06-17T09:07:15Z
---

Der Calculator unterstützt aktuell nur ganzzahlige Arithmetik. Nutzer wollen mit Dezimalwerten rechnen (z.B. `1,5 + 2,5`). Dieses Feature stellt die gesamte Rechen-Pipeline auf Fließkomma um, akzeptiert Komma als Dezimaltrennzeichen in der Eingabe und gibt Ergebnisse ohne überflüssige Nullen aus.

**Hinweise:**
- Komplett-Migration des internen Zahlentyps auf Fließkomma (keine Koexistenz mit Ganzzahltyp).
- Dezimaltrennzeichen in Ein- und Ausgabe ist ausschließlich das Komma; der Punkt wird weder akzeptiert noch ausgegeben.
- Output trimmt trailing zeros; ganzzahlige Ergebnisse erscheinen ohne Komma.
- Bestehende Division-Semantik ändert sich bewusst: `7/2` ergibt nun `3,5` statt `3`. Das ist Teil des Features, keine Regression.
- Division durch Null bleibt Laufzeitfehler über `Error`, REPL bleibt einziger Catch-Punkt.

## High-Level Plan

**Approach** — Direkte Migration in einer Bean. Da der Wechsel des Werttyps inhärent durch alle Pipeline-Schichten geht (Lexer, AST, Evaluator, REPL-Ausgabe), bleibt eine kohärente Änderung übersichtlicher als ein künstlich aufgesplitteter Zwischenstand. Pro Modul werden die Tests gemeinsam aktualisiert.

**Steps**
- Lexer akzeptiert Dezimalliterale mit Komma als Trennzeichen; das Zahl-Token trägt einen Fließkommawert.
- AST-Knoten und Parser-Konstanten führen Werte als Fließkomma-Typ.
- Evaluator rechnet durchgängig in Fließkomma; Division-durch-Null bleibt Laufzeitfehler.
- REPL-Ausgabe formatiert Ergebnisse: trailing zeros entfernt, Komma als Dezimaltrennzeichen, ganzzahlige Resultate ohne Komma.
- Vorhandene Unit-Tests jedes Moduls und ein End-to-End-Test über die REPL spiegeln das neue Verhalten.

**Acceptance Criteria**
- `2+2` liefert Ausgabe `4` (kein `4,0`).
- `1,5+2,5` liefert Ausgabe `4`.
- `7/2` liefert Ausgabe `3,5`.
- `1,5*2` liefert Ausgabe `3`.
- `1/0` wirft Laufzeitfehler; REPL fängt ab und druckt verständliche Meldung, läuft weiter.
- Ausgaben enthalten niemals einen Punkt als Dezimaltrennzeichen.
- Ausgaben enthalten niemals trailing zeros nach dem Komma.
- Bestehende Tests bleiben grün, sofern sie nicht explizit das alte Ganzzahl-Verhalten der Division prüfen — diese werden auf das neue Verhalten angepasst.

**Non-Goals**
- Keine wissenschaftliche Notation (`1e5`, `2,5e3`).
- Kein Punkt als alternatives Dezimaltrennzeichen.
- Kein separater Ganzzahltyp im AST oder Evaluator.
- Keine Konfigurierbarkeit der Nachkommastellen.
- Kein Tausendertrennzeichen in Ein- oder Ausgabe.
- Keine Erweiterung um neue Operatoren (z.B. `%`, `^`).

## Refined Plan

### Files to change
- src/lexer.ts:39-46 — extend number scan in `next()` to accept one comma as decimal separator; parse and accumulate float value (e.g. "1,5" → 1.5)
- src/lexer.ts:89-91 — `isDigit()` helper; add decimal-comma guard or companion check; a second comma in the same literal is rejected with Error
- src/evaluator.ts:26 — remove `Math.trunc()`; return raw float division `left / right`; div-by-zero throw at lines 23-24 stays unchanged
- src/main.ts:21 — replace direct string interpolation of evaluate result with `formatResult(evaluate(ast))`
- src/main.ts:4 — add import for `formatResult` from `./format.js`
- src/format.ts:NEW — new module exposing `formatResult(value: number): string`; comma as decimal separator, trailing zeros stripped, integer results rendered without comma; lives in `src/` because main.ts imports from `./format.js`
- tests/lexer.test.ts:22-32 — add test cases for decimal literals checking float value ("1,5" → NUMBER token value 1.5) and double-comma rejection
- tests/evaluator.test.ts:18-21 — update integer division truncation test: `7/2` now expects 3.5, not 3
- tests/format.test.ts:NEW — unit tests for `formatResult`; lives in `tests/` matching project convention
- tests/calc.test.ts:NEW — end-to-end tests chaining parse → evaluate → formatResult for all AC strings

### New signatures
- formatResult(value: number): string — render number: comma decimal separator, no trailing zeros, integer values without comma

### Test sketch
- lex_decimal_literal — "1,5" → NUMBER token, value 1.5
- lex_double_comma_rejected — "1,5,2" → Error thrown (edge case)
- eval_division_float — evalStr("7/2") → 3.5
- format_integer_no_comma — formatResult(4) → "4"
- format_decimal_comma — formatResult(3.5) → "3,5"
- format_no_trailing_zeros — formatResult(3.0) → "3"
- format_no_dot — formatResult(3.5) does not contain "." (edge case)
- calc_add_integer — parse→eval→format "2+2" → "4"
- calc_decimal_sum — parse→eval→format "1,5+2,5" → "4"
- calc_div_float — parse→eval→format "7/2" → "3,5"
- calc_decimal_mul — parse→eval→format "1,5*2" → "3"
- calc_div_by_zero — "1/0" → throws Error with readable message (edge case)

## Implementation Log

**Branch:** feat/sandbox-vzwt-kommazahlen-support-im-calculator

**Commits:**
- 04ad6d8 — Lexer: accept comma as decimal separator; reject double-comma
- 44d95b5 — Evaluator: remove Math.trunc(), division now returns float
- 24e5ed7 — Add formatResult: comma decimal separator, no trailing zeros
- 9b622b7 — Main: wire formatResult into REPL output
- f4014e1 — Add end-to-end tests covering all Acceptance Criteria

**Final test status:** PASS  (npm test → 29 tests, 5 files, all green)

## Summary of Changes

- **Lexer**: decimal literals with comma separator now tokenized as float (`1,5` → 1.5); second comma in a literal raises an error.
- **Evaluator**: `Math.trunc()` removed — division returns the true float result (`7/2` → 3.5).
- **format.ts** (new): `formatResult(value)` renders numbers with comma as decimal separator, strips trailing zeros, integer results appear without comma.
- **Main/REPL**: output now routed through `formatResult` — no dot ever appears in output.
- **Tests**: lexer, evaluator, format, and E2E test files updated/added; all six Acceptance Criteria exercised and passing.
