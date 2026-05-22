---
title: Wissensbasis CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Index
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/index
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-index
status: draft
language: de
version: 0.1
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
---

# Wissensbasis CONTEXT

Einstieg in die deklarative Wissensbasis von CONTEXT. Alles in diesem Ordner ist Knowledge oder Process. Imperative Steuerung liegt im Repo-Root ([`../CLAUDE.md`](../CLAUDE.md)).

## Lese-Reihenfolge

Für einen Reviewer, der das Projekt zum ersten Mal versteht:

1. [project.md](project.md) — Was ist CONTEXT, welche Brücke wird gebaut, was ist bewusst ausgeschlossen.
2. [specification.md](specification.md) — Drei MVP-Features mit Akzeptanzkriterien plus Decision Log.
3. [user-stories.md](user-stories.md) — Drei Forschungsrollen, an denen sich das Interface misst.
4. [data.md](data.md) — Fünf Knotentypen, Pflichtfelder, externe Vokabulare, Platzhalterstatus.
5. [design.md](design.md) — Designhaltung, Tokens, Brücken-Layout, Coverage-Marker.
6. [architecture.md](architecture.md) — Statisches Frontend, clientseitiges JSON-Laden, geplanter SPARQL-Pfad.
7. [journal.md](journal.md) — Genese, was im aktuellen Stand passiert ist und warum.

## Begriffslexikon

| Begriff | Bedeutung im Projekt |
|---|---|
| Konzept | Kontemplatives Phänomen oder mentaler Zustand. Zentraler Knotentyp, an dem Quelltext und empirische Studie zusammenlaufen. Beispiele: Jhāna, Nichtduales Gewahrsein, DMN-Suppression. |
| Werk | Sprachneutrale historische Texteinheit, verankert über Wikidata-QID. Beispiele: Visuddhimagga, Philokalia. |
| Digitale Repräsentation | Konkrete Edition oder Faksimile eines Werks in einem Repositorium. Volltext und Faksimile werden visuell unterschieden. |
| Repositorium | Infrastruktur, in der Repräsentationen liegen. Beispiele: GRETIL, CBETA, SuttaCentral, PubMed. |
| Forschungskontext / Studie | Empirische Untersuchung, die ein Konzept stützt, einschränkt oder methodisch-kritisch behandelt. |
| QID | Wikidata-Identifikator als sprachübergreifender Drehpunkt. |
| Aufnahmegrund | Referenz auf wissenschaftliche Sekundärliteratur, die einen Eintrag rechtfertigt. Pflichtfeld, schützt vor esoterischer Grauzone. |
| Evidenzgrad | Typ der Studie–Konzept-Beziehung: stützend, einschränkend, methodisch-kritisch. Nicht jede Studie bestätigt das Konzept. |
| Belegtrennung | Visuelle Unterscheidung zwischen analysierbarem Volltext und reiner Faksimile-Belegschicht. |
| Coverage-Marker | Sichtbare Offenlegung der Abdeckungsverzerrung. Sprachen und Traditionen sind nicht gleichmäßig erschlossen. |
| Brücken-Ansicht | Zweispaltige Detailansicht pro Konzept. Links Quelle, rechts Empirie. Die zentrale UI-Innovation. |
| Placeholder-Datensatz | Synthetische Daten im aktuellen Prototyp. Realistische Struktur, nicht reale Verknüpfungen. |

## Action-Layer

Imperative Steuerung des Coding-Agenten lebt in [`../CLAUDE.md`](../CLAUDE.md). Bei UI-Generierung gilt: erst [design.md](design.md) lesen, dann CLAUDE.md-Designprinzipien anwenden.

## Related (im Vault gespiegelt)

- [[Project Overview CONTEXT]] — Vault-Mission-Control
- [[Konvention Promptotyping Documents]] — Konvention dieser Wissensbasis
