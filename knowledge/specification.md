---
title: Spezifikation CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Specification
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/specification
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-specification
status: draft
language: de
version: 0.1
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Requirements Engineering]]", "[[Decision Records]]"]
related: [project, data, design, user-stories]
---

# Spezifikation CONTEXT

Funktionsumfang des Prototyps v0 und Entscheidungslog der sieben Optimierungspunkte aus dem Konzeptpapier.

## MVP-Features

### F1. Konzept-Index als Landing

Liste aller im Datenbestand vorhandenen Konzepte als Karten. Jede Karte trägt mehrsprachiges Label, Traditions-Chip, Anzahl Quellen und Studien als kompakten Marker, kurzen Aufnahmegrund.

**Akzeptanzkriterien.**

- Fünf synthetische Konzepte werden gerendert.
- Jede Karte ist klickbar und navigiert zur Brücken-Ansicht.
- Coverage-Banner ist sichtbar oberhalb der Liste.
- Filter nach Tradition reduziert die Liste.
- Filter nach Evidenz-Typ (stützend, einschränkend, methodisch-kritisch) reduziert die Liste anhand der Studien-Beziehungen.

### F2. Brücken-Ansicht pro Konzept

Zweispaltige Detailansicht, links Quelltexte, rechts empirische Studien. Header mit dreisprachigem Konzept-Label, Wikidata-QID, Aufnahmegrund. Unterhalb der Spalten eine Methodenkritik-Sektion.

**Akzeptanzkriterien.**

- URL-Form `concept.html?id=<slug>` lädt das richtige Konzept.
- Linke Spalte zeigt alle Werke des Konzepts mit Sprache und Repositorien-Link.
- Edition und Faksimile sind visuell unterschieden (Belegtrennung).
- Rechte Spalte zeigt alle Studien chronologisch absteigend (neueste oben), mit Evidenzgrad-Badge.
- Wenn keine Quelltexte vorhanden sind (DMN-Konzept), erscheint ein expliziter Hinweis "Kein historischer Quelltext kuratiert — Konzept ist empirisch-deskriptiv".
- Jede Studie–Konzept-Verknüpfung trägt sichtbare Provenienz.

### F3. Methodische Position (About-Seite)

Statische Seite, die Aufnahmekriterium, Materialbegriff, Ausschluss Bewusstseinsforschung, bekannte Verzerrung, Belegtrennung und die offenen Optimierungspunkte als Roadmap ausformuliert.

**Akzeptanzkriterien.**

- Aufnahmekriterium ist in einem Absatz formuliert.
- Materialbegriff listet die Traditionen.
- Bekannte Verzerrung benennt Latein, Griechisch, klassisches Chinesisch als überrepräsentiert und Arabisch, Tibetisch als unterrepräsentiert.
- Die sieben Optimierungspunkte erscheinen mit Status (accepted im Modell, deferred im aktuellen UI).

## Was bewusst nicht im MVP ist

- **Live-SPARQL gegen Wikidata.** Geplant für eine spätere Iteration, sobald reale Konzepte modelliert sind.
- **Graph-Visualisierung.** Brücken-Ansicht trägt die Pointe, eine Graphvisualisierung wäre Dekoration ohne validierten Mehrwert bei n=5.
- **Beitragsmechanismus über GitHub Issues.** Erst sinnvoll, wenn das Schema validiert ist.
- **Mehrsprachiges Interface.** Frontend-Texte zunächst deutsch.

## Decision Log

Die sieben Optimierungspunkte aus dem erweiterten Konzeptpapier mit Implementierungsstatus.

| Nr | Punkt | Status v0 | Begründung |
|---|---|---|---|
| 1 | Provenienz pro Aussage | accepted | `provenance: { source, date }` ist Pflichtfeld an `studie_zu_konzept`-Kanten |
| 2 | Konzept-Disambiguierung über Traditionen | partial | `traditions[]` als Liste, separates `phenomenon`-Feld zur Gruppierung deferred bis n>5 |
| 3 | Mehrsprachige Labels | accepted | Pflichtfelder `label.{original, translit, de, en}` |
| 4 | Versionierung des Vokabulars | accepted | `id`-Werte stabil, repo-weite `version:` markiert Schema-Stand |
| 5 | Evidenzgrad statt bloßer Verlinkung | accepted | `evidence_type: stützend / einschränkend / methodisch-kritisch` an Studie–Konzept-Kanten |
| 6 | Reproduzierbarkeit der SPARQL-Schicht | deferred | SPARQL-Pfad ist Prototyp v0 noch nicht implementiert, `data/queries/` als geplanter Ordner |
| 7 | Beitragsweg für Dritte | deferred | Erst sinnvoll nach Schema-Validierung an realen Konzepten |

## Ethische Verankerung im Modell

Drei strukturelle Mechanismen, im Datenmodell und im UI verankert.

1. **Aufnahmekriterium als Pflichtfeld.** Jeder Konzept-, Werk- und Studien-Eintrag trägt `aufnahmegrund` mit Referenz auf wissenschaftliche Sekundärliteratur. Ohne Aufnahmegrund kein Eintrag.
2. **Coverage-Marker.** Sichtbare Offenlegung der Abdeckungsverzerrung im Header jeder Liste.
3. **Belegtrennung.** Repräsentationen tragen `type: edition | facsimile`, das UI unterscheidet visuell.

Ein vierter Punkt, gesondert verankert: Studien-Konzept-Beziehungen tragen einen `evidence_type`, der auch einschränkende und methodisch-kritische Befunde abbildet. Nebenwirkungen und methodische Einwände bleiben damit sichtbar, das System produziert kein verzerrt positives Bild der Evidenzlage.

## Related (im Vault)

- [[Project Overview CONTEXT]]
- [[Linked Open Data]]
