---
# sandbox-vzwt
title: Kommazahlen-Support im Calculator
status: todo
type: feature
created_at: 2026-05-26T13:22:49Z
updated_at: 2026-05-26T13:22:49Z
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