---
# sandbox-exercise-olqc
title: Parentheses Support (Shunting-Yard)
status: completed
type: feature
priority: normal
created_at: 2026-05-26T12:06:51Z
updated_at: 2026-06-16T13:37:03Z
---

Der Rechner unterstützt aktuell nur flache Ausdrücke mit `+ - * /` und fest verdrahteter Vorrangordnung. Nutzer können die Auswertungsreihenfolge nicht explizit steuern. Diese Feature ergänzt runde Klammern `(` und `)` als Gruppierung, sodass beliebig tief verschachtelte Teilausdrücke vor dem umgebenden Ausdruck ausgewertet werden. Verhalten ohne Klammern bleibt unverändert.

**Hinweise:**
- Gewählter Ansatz: Shunting-Yard-Algorithmus (Dijkstra) — der Parser wird vollständig ersetzt
- Der Algorithmus läuft in einem einzelnen Links-nach-rechts-Durchlauf über den Token-Strom
- Er verwendet einen Operator-Stack und eine Output-Queue zur Einhaltung von Vorrang und Assoziativität
- Klammern sind Stack-Sentinels: `(` wird gepusht, `)` räumt Operatoren bis zum passenden `(` ab
- Die Output-Queue enthält Postfix-RPN; der Evaluator muss entsprechend angepasst werden
- Fehlende oder überzählige Klammern müssen als verständliche Fehlermeldungen gemeldet werden

## High-Level Plan

**Approach** — Den rekursiven Abstiegsparser durch Dijkstras Shunting-Yard-Algorithmus ersetzen. Der Algorithmus verarbeitet den Token-Strom in einem einzigen Links-nach-rechts-Durchlauf: Operanden landen direkt in der Output-Queue, Operatoren werden über einen Stack nach Vorrang/Assoziativität geordnet. Klammern steuern den Stack als Sentinels. Der Evaluator wird aktualisiert, um die entstehende Postfix-Ausgabe auszuwerten. Die REPL-Schnittstelle bleibt unverändert.

**Steps**
- Schritt 1 — Token-Typ-Menge um `LPAREN` und `RPAREN` erweitern; Lexer anpassen, sodass `(` und `)` diese Token erzeugen
- Schritt 2 — Parser als Shunting-Yard-Algorithmus neu schreiben: Token-Strom in eine Postfix-Output-Queue überführen; Operator-Stack für Vorrang und Assoziativität verwenden
- Schritt 3 — Klammern im Algorithmus behandeln: `(` als Sentinel auf den Operator-Stack pushen; `)` Operatoren bis zum passenden `(` in die Queue räumen; fehlende oder überzählige Klammern als `Error` melden
- Schritt 4 — Evaluator auf Postfix-Repräsentation umstellen, sodass er die RPN-Queue auswertet und eine Zahl liefert
- Schritt 5 — Tests ergänzen: neue Token-Typen, Klammerausdrücke, Verschachtelungen, Fehlerpfade sowie Regressionstests für alle bestehenden Operatoren

**Acceptance Criteria**
- `(2 + 3) * 4` ergibt `20`
- `2 * (3 + 4)` ergibt `14`
- Verschachtelte Klammern `((1+2)*(3+4))` ergeben `21`
- `(2 + 3` (fehlende schließende Klammer) erzeugt eine verständliche Fehlermeldung; REPL läuft weiter
- `2 + 3)` (überzählige schließende Klammer) erzeugt eine verständliche Fehlermeldung; REPL läuft weiter
- `()` (leerer Klammerausdruck) erzeugt eine verständliche Fehlermeldung
- Alle bisherigen klammerfreien Ausdrücke liefern unverändert dieselben Ergebnisse (regressionssicher)

**Non-Goals**
- Implizite Multiplikation wie `2(3+4)`
- Funktionsaufrufe wie `sin(x)`
- Unäres Minus oder Plus
- Änderung der REPL-Schnittstelle oder des Ausgabeformats
- Performance-Optimierungen am Parser

## Refined Plan

### Files to change
- src/lexer.ts:3 — extend TokenType enum with LPAREN and RPAREN
- src/lexer.ts:49 — add `(` and `)` branches in Lexer.next() character switch
- src/lexer.ts:72 — add LPAREN and RPAREN cases in tokenTypeName()
- src/parser.ts:32 — replace recursive-descent body with shunting-yard; NodeKind / BinOp / Node interface / parse() signature all stay the same; algorithm builds Node AST on output stack instead of raw RPN tokens
- tests/lexer.test.ts:13 — add it("tokenizes parentheses") alongside existing operator test
- tests/parser.test.ts:27 — add it("parens override precedence"), it("parens on right side"), it("nested parens"), it("throws on unclosed paren"), it("throws on extra close paren"), it("throws on empty parens")
- tests/evaluator.test.ts:10 — add e2e tests via existing evalStr() helper: parens simple, parens right, nested, regression without parens

### New signatures
- `next(): Token` — callers unchanged; two new switch arms added for `(` → LPAREN and `)` → RPAREN (src/lexer.ts:49)
- `parse(source: string): Node` — external signature unchanged; internal implementation replaced by shunting-yard that builds Node tree on output stack (src/parser.ts:104)
- `tokenTypeName(type: TokenType): string` — callers unchanged; LPAREN and RPAREN cases added (src/lexer.ts:72)

### Test sketch
- tokenizesParens — Input `"()"` → token sequence [LPAREN, RPAREN, END]
- parensOverridePrecedence — Input `"(2+3)*4"` → evalStr → 20
- parensOnRight — Input `"2*(3+4)"` → evalStr → 14
- nestedParens — Input `"((1+2)*(3+4))"` → evalStr → 21
- parensUnclosed — Input `"(1+2"` → parse throws Error
- parensExtraClose — Input `"1+2)"` → parse throws Error
- parensEmpty — Input `"()"` → parse throws Error
- regression — Input `"1+2*3"` → evalStr → 7 (no parens, existing precedence unchanged)

## Implementation Log

**Branch:** `sandbox-exercise-olqc-klammer-support` (from `e0f27b8`)
**Commit(s):** `fbb08cd` — feat(parser): add parentheses support via shunting-yard algorithm

### Changes
- src/lexer.ts — LPAREN and RPAREN added to TokenType enum, Lexer.next() switch, and tokenTypeName()
- src/parser.ts — recursive-descent Parser class fully replaced by shunting-yard; NodeKind / BinOp / Node / parse() signature unchanged; evaluator untouched
- tests/lexer.test.ts — added "tokenizes parentheses"
- tests/parser.test.ts — added 6 new tests: parens override precedence, parens on right side, nested parens, throws on unclosed paren, throws on extra close paren, throws on empty parens
- tests/evaluator.test.ts — added 4 e2e tests via evalStr(): parens simple, parens on right side, nested parens, regression no parens

### Verification
- typecheck: green (tsc --noEmit, 0 errors)
- build: green (tsc, 0 errors)
- tests: 27/27 passed (3 test files)
- AC: `(2 + 3) * 4` → 20 ✓ | `2 * (3 + 4)` → 14 ✓ | `((1+2)*(3+4))` → 21 ✓ | `(2 + 3` → error ✓ | `2 + 3)` → error ✓ | `()` → error ✓ | `1+2*3` → 7 (regression) ✓

### Deviations
- Evaluator unchanged: the refined plan mentioned updating the evaluator to walk a "postfix representation", but the shunting-yard was implemented to build Node AST nodes on the output stack directly — so the evaluator and main.ts required zero changes.
