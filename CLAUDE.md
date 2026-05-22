# CLAUDE.md — Action-Layer für CONTEXT

Imperative Steuerung für Coding-Agenten, die mit diesem Repo arbeiten. Knowledge liegt unter [`knowledge/`](knowledge/), Einstieg in [`knowledge/INDEX.md`](knowledge/INDEX.md).

## Vor jeder UI-Generierung

Lies [`knowledge/design.md`](knowledge/design.md) als Wertequelle. Die folgenden Designprinzipien sind aus der dort dokumentierten Designhaltung abgeleitet und im UI verbindlich.

## Designprinzipien

1. **Lücken werden nicht kaschiert.** Leere Datenfelder zeigen einen erklärenden Satz, nicht eine ausgeblendete Sektion. Das DMN-Konzept hat keine Quelltexte — die linke Spalte zeigt den expliziten Hinweis "Kein historischer Quelltext kuratiert", nicht eine versteckte Sektion.
2. **Belegtrennung ist visuell sichtbar.** Edition und Faksimile bekommen unterschiedliche Iconfarben. Analysierbarer Volltext und reine Belegschicht sind auf einen Blick unterscheidbar.
3. **Evidenzgrad wird immer mitgeführt.** Jede Studie–Konzept-Verknüpfung trägt sichtbar einen Badge: stützend, einschränkend oder methodisch-kritisch. Eine bloße Verlinkung ohne Typisierung ist nicht zulässig.
4. **Provenienz pro Aussage.** Jede kuratorisch gezogene Verknüpfung zeigt Quelle und Datum als unauffälligen, aber lesbaren Untertext. Nicht in einem Akkordeon.
5. **Coverage-Marker bleibt sichtbar.** Der Banner über die bekannte Verzerrung der Sprach- und Traditionsverteilung erscheint auf jeder Seite, nicht nur auf About.
6. **Keine Dekoration.** Keine Hero-Bilder, keine Loader-Spinner, keine Animation. Eine Akzentfarbe.

## Vor Datenmodellierung

Lies [`knowledge/data.md`](knowledge/data.md). Pflichtfelder der fünf Knotentypen sind dort dokumentiert. Konzept-Knoten tragen mehrsprachige Labels (Originalschrift, Transliteration, Übersetzung) und einen `aufnahmegrund` als Referenz auf wissenschaftliche Sekundärliteratur. Ohne Aufnahmegrund kein Eintrag.

`id`-Werte sind stabil und werden nicht recycelt, auch wenn sich die Beschreibung ändert.

## Vor Funktionserweiterung

Lies [`knowledge/specification.md`](knowledge/specification.md). Das Decision Log dokumentiert, welche Optimierungspunkte aus dem Konzeptpapier `accepted`, `partial` oder `deferred` sind. Eine Erweiterung verschiebt einen Punkt aus `deferred` in `accepted`; rückwirkende Änderungen an `accepted`-Entscheidungen verlangen eine neue Decision-Log-Zeile, nicht eine stille Überschreibung.

## Vor Schema-Änderungen

Schema-Änderungen erhöhen die repo-weite `version:`-Stufe in allen Knowledge-Dokumenten gemeinsam. Eine partielle Erhöhung ist nicht zulässig.

## Was bewusst nicht hier steht

- Beschreibungen, Erklärungen, Hintergrund. Das ist Knowledge und gehört in `knowledge/`.
- Token-Werte (Hex, Pixel). Das ist Code und gehört in `assets/tokens.css`.
- Roadmap und Was-kommt-als-nächstes. Das ist Process und gehört in `knowledge/journal.md`.

Dieses Dokument enthält nur Imperative — Regeln, an die sich der Agent halten soll.
