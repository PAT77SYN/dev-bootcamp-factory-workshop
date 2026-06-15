---
# sandbox-exercise-olqc
title: Klammer-Unterstützung im Rechner
status: in-progress
type: feature
priority: normal
created_at: 2026-05-26T12:06:51Z
updated_at: 2026-06-15T00:00:00Z
---

Der Rechner unterstützt aktuell nur flache Ausdrücke mit `+ - * /` und fest verdrahteter Vorrangordnung. Nutzer können die Auswertungsreihenfolge nicht explizit steuern. Wir ergänzen runde Klammern `(` und `)` als Gruppierung, sodass beliebig tief verschachtelte Teilausdrücke vor dem umgebenden Ausdruck ausgewertet werden. Verhalten ohne Klammern bleibt unverändert.

**Hinweise:**
- Gewählter Ansatz: Minimal-Delta — Klammern als zusätzliche Eingabe-Symbole aufnehmen und die innerste Ausdrucksebene um eine Gruppierungs-Alternative erweitern
- Bestehende Vorrang- und Assoziativitätsregeln bleiben unangetastet
- Unäres Minus, Funktionen und andere Klammerformen sind explizit nicht Teil dieses Beans

## High-Level Plan

**Approach** — Grammatik-Erweiterung. Runde Klammern werden als neue Eingabe-Symbole erkannt und als zusätzliche Alternative in der innersten Ausdrucksebene zugelassen. Damit fügt sich Gruppierung sauber in die vorhandene rekursive Struktur ein; Operator-Vorrang und Assoziativität bleiben unverändert.

**Steps**
- Schritt 1 — Eingabeerkennung um die zwei Klammer-Symbole erweitern, sodass `(` und `)` als eigene Token entstehen
- Schritt 2 — Innerste Ausdrucksebene um die Alternative „geklammerter Teilausdruck" ergänzen, der rekursiv einen vollständigen Ausdruck enthalten darf
- Schritt 3 — Fehlerfälle (fehlende schließende Klammer, überzählige schließende Klammer, leerer Klammerinhalt) als verständliche Parserfehler melden, ohne den REPL zu beenden
- Schritt 4 — Tests auf allen Ebenen ergänzen: Symbol-Erkennung, Grammatik mit Verschachtelung, End-zu-End-Auswertung sowie Fehlerpfade

**Acceptance Criteria**
- `(1+2)*3` ergibt `9`
- `2*(3+4)` ergibt `14`
- Verschachtelte Klammern werden korrekt aufgelöst, z.B. `((1+2)*(3+4))` ergibt `21`
- Klammern überschreiben Vorrang, z.B. `(2+3)*(4-1)` ergibt `15`
- Alle bisherigen Ausdrücke ohne Klammern liefern unverändert dieselben Ergebnisse (Regression-frei)
- Fehlende schließende Klammer (`(1+2`) erzeugt eine verständliche Parserfehlermeldung, REPL läuft weiter
- Überzählige schließende Klammer (`1+2)`) erzeugt eine Parserfehlermeldung, REPL läuft weiter
- Leerer Klammerausdruck `()` erzeugt eine Parserfehlermeldung

**Non-Goals**
- Unäres Minus / unäres Plus
- Eckige `[]` oder geschweifte `{}` Klammern
- Variablen, Funktionen, weitere Operatoren
- Änderung der bestehenden Operator-Vorrangordnung
- Performance-Optimierungen am Parser

## Refined Plan

### Files to change
- src/lexer.ts:3 — TokenType-Enum um `LPAREN` und `RPAREN` erweitern
- src/lexer.ts:49 — Symbol-Switch in `Lexer.next()` um Branches für `(` und `)` ergänzen, jeweils ein Single-Char-Token zurückgeben
- src/lexer.ts:72 — `tokenTypeName`-Switch um Namen für `LPAREN`/`RPAREN` ergänzen (Parser-Fehlermeldungen)
- src/parser.ts:35 — Grammatik-Kommentar aktualisieren: `factor := NUMBER | '(' expr ')'`
- src/parser.ts:85 — `parseFactor()` um `LPAREN`-Alternative: `advance()` über `(`, rekursiv `parseExpr()`, dann `RPAREN` erwarten; leeres `()` und fehlendes `)` als `Error` im Stil von :58/:87
- tests/lexer.test.ts:13 — neuer `it("tokenizes parentheses")` analog zu „tokenizes all operators"
- tests/parser.test.ts:27 — neue Tests `it("parens group overrides precedence")`, `it("nested parens")` analog zu „binds multiplication tighter than addition"
- tests/parser.test.ts:41 — neue Tests `it("throws on a missing closing paren")`, `it("throws on empty parens")`, `it("throws on a stray closing paren")` analog zu „throws on a trailing token"/„throws on a missing operand"
- tests/evaluator.test.ts:10 — neue Tests `it("parens simple")`, `it("parens on the right side")`, `it("nested parens")`, `it("parens override precedence")`, `it("regression without parens")` über den `evalStr`-Helper

### New signatures
- (keine neuen Klassen/Funktionen) — `Lexer.next(): Token` und `Parser.parseFactor(): Node` behalten ihre Signatur; Erweiterung rein innerhalb bestehender Switches/Branches
- AST/Evaluator unverändert — Gruppierung wird durch Baumform kodiert, kein neuer `NodeKind`

### Test sketch
- lexer „tokenizes parentheses" — Input `"()"` → Token-Sequenz `LPAREN, RPAREN, END`
- parser „parens group overrides precedence" — Input `"(1+2)*3"` → AST `Mul(Add(1,2), 3)`
- parser „nested parens" — Input `"((1+2)*(3+4))"` → AST `Mul(Add(1,2), Add(3,4))`
- parser „throws on a missing closing paren" — Input `"(1+2"` → `Error`
- parser „throws on empty parens" — Input `"()"` → `Error`
- parser „throws on a stray closing paren" — Input `"1+2)"` → `Error`
- evaluator „parens simple" — Input `"(1+2)*3"` → `9`
- evaluator „parens on the right side" — Input `"2*(3+4)"` → `14`
- evaluator „nested parens" — Input `"((1+2)*(3+4))"` → `21`
- evaluator „parens override precedence" — Input `"(2+3)*(4-1)"` → `15`
- evaluator „regression without parens" — Input `"1+2*3"` → `7` (unverändertes Verhalten)
