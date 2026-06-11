---
# refine-exercise-olqc
title: Klammer-Unterstützung im Rechner
status: todo
type: feature
created_at: 2026-05-26T12:06:51Z
updated_at: 2026-05-26T12:06:51Z
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
