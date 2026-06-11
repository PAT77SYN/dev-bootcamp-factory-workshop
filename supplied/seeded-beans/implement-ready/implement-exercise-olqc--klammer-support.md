---
# implement-exercise-olqc
title: Klammer-Unterstützung im Rechner
status: in-progress
type: feature
priority: normal
created_at: 2026-05-26T12:06:51Z
updated_at: 2026-05-26T12:36:23Z
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
- src/lexer.h:9 — TokenType-Enum um `LPAREN` und `RPAREN` erweitern
- src/lexer.cpp:39 — Punktuations-Switch in `Lexer::next()` um Branches für `(` und `)` ergänzen, jeweils ein Single-Char-Token zurückgeben
- src/lexer.cpp:55 — `token_type_name`-Switch um Namen für `LPAREN`/`RPAREN` ergänzen (Parser-Fehlermeldungen)
- src/parser.h:13 — Grammatik-Kommentar aktualisieren: `factor := NUMBER | '(' expr ')'`
- src/parser.cpp:64 — `parse_factor()` um `LPAREN`-Alternative: `advance()` über `(`, rekursiv `parse_expr()`, dann `RPAREN` erwarten; leeres `()` und fehlendes `)` als `std::runtime_error` im Stil von :40/:68
- tests/lexer_test.cpp:16 ja— neuer TEST `LexerTest.Parentheses` analog zu `AllOperators`
- tests/parser_test.cpp:28 — neue TESTs `ParensGroupOverridesPrecedence`, `NestedParens` analog zu `MulBindsTighterThanAdd`
- tests/parser_test.cpp:39 — neue TESTs `MissingClosingParenThrows`, `EmptyParensThrows`, `StrayClosingParenThrows` analog zu `TrailingTokenThrows`/`MissingOperandThrows`
- tests/evaluator_test.cpp:16 — neue TESTs `ParensSimple`, `ParensRightSide`, `NestedParens`, `ParensOverridePrecedence`, `RegressionNoParens` über `eval_str` Helper

### New signatures
- (keine neuen Klassen/Funktionen) — `Token Lexer::next()` und `NodePtr Parser::parse_factor()` behalten ihre Signatur; Erweiterung rein innerhalb bestehender Switches/Branches
- AST/Evaluator unverändert — Gruppierung wird durch Baumform kodiert, kein neuer `NodeKind`

### Test sketch
- LexerTest.Parentheses — Input `"()"` → Token-Sequenz `LPAREN, RPAREN, END`
- ParserTest.ParensGroupOverridesPrecedence — Input `"(1+2)*3"` → AST `Mul(Add(1,2), 3)`
- ParserTest.NestedParens — Input `"((1+2)*(3+4))"` → AST `Mul(Add(1,2), Add(3,4))`
- ParserTest.MissingClosingParenThrows — Input `"(1+2"` → `std::runtime_error`
- ParserTest.EmptyParensThrows — Input `"()"` → `std::runtime_error`
- ParserTest.StrayClosingParenThrows — Input `"1+2)"` → `std::runtime_error`
- EvaluatorTest.ParensSimple — Input `"(1+2)*3"` → `9`
- EvaluatorTest.ParensRightSide — Input `"2*(3+4)"` → `14`
- EvaluatorTest.NestedParens — Input `"((1+2)*(3+4))"` → `21`
- EvaluatorTest.ParensOverridePrecedence — Input `"(2+3)*(4-1)"` → `15`
- EvaluatorTest.RegressionNoParens — Input `"1+2*3"` → `7` (unverändertes Verhalten)
