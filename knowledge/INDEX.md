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
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
---

# Wissensbasis CONTEXT

Einstieg in die deklarative Wissensbasis von CONTEXT. Alles in diesem Ordner ist Knowledge oder Process. Imperative Steuerung liegt im Repo-Root ([`../CLAUDE.md`](../CLAUDE.md)).

## Lese-Reihenfolge

Für einen Reviewer, der das Projekt zum ersten Mal versteht:

1. [project.md](project.md) — Was CONTEXT ist und welche Asymmetrie der Erforschbarkeit es sichtbar macht.
2. [specification.md](specification.md) — Funktionsumfang als Single-Page-Explorer, Decision Log.
3. [user-stories.md](user-stories.md) — Drei Forschungsrollen, an denen sich das Interface misst.
4. [data.md](data.md) — Sechs Knotentypen, Curated-vs-Harvested-Trennung, Reifegrad-Vokabular, Tradition-Hauptgruppen.
5. [design.md](design.md) — Coverage-Karte als Startseite, Reifegrad-Marker, Belegtrennung.
6. [architecture.md](architecture.md) — Statisches Frontend, drei kuratorische Werkzeuge (Wikidata-Snapshot, Scholarly-Harvest, Validate), Discovery-Pipeline geplant.
7. [discovery-workflows.md](discovery-workflows.md) — Resource-Discovery-Methodik mit drei Repositorien-Klassen.
8. [wikidata-als-drehscheibe.md](wikidata-als-drehscheibe.md) — Wikidata-Fan-out per SPARQL, konkrete Beispielabfragen.
9. [journal.md](journal.md) — Genese: Prototyp v0 → Iteration 1 → Iteration 1.1.

Vertiefungs-Atome für Lookup und methodisches Lehrmaterial:

- [konzept-inventar.md](konzept-inventar.md) — alle 11 Konzepte als kompakte Lookup-Tabelle.
- [tradition-hauptgruppen.md](tradition-hauptgruppen.md) — sieben Hauptgruppen mit Substrings, Reifegrad und Discovery-Priorität.
- [hygiene-regeln.md](hygiene-regeln.md) — Pre-Ingest-Checks, Flag-Vokabular, Saraei-Lehrbeispiel.

## Begriffslexikon

| Begriff | Bedeutung im Projekt |
|---|---|
| Asymmetrie der Erforschbarkeit | Leitidee. CONTEXT kartiert nicht Wirkungen von Kontemplation, sondern die Ungleichheit, mit der unterschiedliche Traditionen empirisch zugänglich sind. |
| Reifegrad | Kontrolliertes Vokabular auf Konzeptebene, vier Werte: `etabliert`, `berührt`, `beginnend`, `fehlend`. Bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst. |
| Konzept | Kontemplatives Phänomen oder mentaler Zustand. Zentraler Knotentyp, an dem Quelltext und empirische Studie zusammenlaufen. |
| Werk | Sprachneutrale historische Texteinheit, verankert über Wikidata-QID. |
| Digitale Repräsentation | Konkrete Edition oder Faksimile eines Werks in einem Repositorium. Volltext und Faksimile werden visuell unterschieden. |
| Repositorium | Infrastruktur, in der Repräsentationen liegen. Verankert über Wikidata-QID. |
| Studie | Empirische Untersuchung, die ein Konzept stützt, einschränkt, methodisch-kritisch behandelt oder Nebenwirkungen dokumentiert. |
| Referenz / Knotenpunkt | Theoretische Schlüsselarbeit, an die sich viele Studien anschließen. Eigener Knotentyp seit Iteration 1. |
| Evidence-Gap-Knoten | Konzept mit Reifegrad `fehlend`, erstklassiger Eintrag mit kuratierter Begründung, warum die Praxis empirisch unsichtbar ist. |
| Watchlist-Knoten | Laufende Studie ohne peer-reviewte Ergebnisse, als Studie mit `evidence_type: laufend` geführt. Halbjährlicher Re-Check vorgesehen. |
| Curated vs harvested | Im Datenformat getrennte Bereiche: was kuratorisch entschieden wurde (Konzept-Zuordnung, Evidenz-Typ) versus was aus APIs stammt (Titel, Zitationen, OA-Status). Re-Harvest überschreibt keine Kuration. |
| QID | Wikidata-Identifikator als sprachübergreifender Drehpunkt. Alle QIDs werden vor Produktiv-Ingest gegen die Wikidata-API verifiziert. |
| Aufnahmegrund | Referenz auf wissenschaftliche Sekundärliteratur, die einen Konzept-Eintrag rechtfertigt. Pflichtfeld für nicht-Gap-Konzepte. |
| Evidenzgrad | Typ der Studie–Konzept-Beziehung: `stützend`, `einschränkend`, `methodisch-kritisch`, `nebenwirkungen-dokumentierend`, `laufend`. |
| Belegtrennung | Visuelle Unterscheidung zwischen analysierbarem Volltext (`edition`) und reiner Faksimile-Belegschicht (`facsimile`). |
| Brücken-Ansicht | Zweispaltige Detailansicht im Explorer pro Konzept. Links Quelle, rechts Empirie. |
| Snapshot | Versionierte JSON-Datei mit Wikidata- oder Scholarly-API-Ergebnis. Reproduzierbar, datiert. |
| Hauptgruppe | Aggregation feiner Tradition-Strings zu einer von sieben Hauptgruppen (Buddhismus, Christentum, Islam, Daoismus, Judentum, Hinduismus, Säkulare und wissenschaftliche Kontexte). Aggregations-Mapping ist in `assets/data-loader.js` definiert. |
| Resource Discovery | Methodisches Auffinden von Quellen in fachspezifischen Repositorien und Aggregatoren über Wikidata-QID als Drehscheibe. Drei Klassen: Volltext, Faksimile, Ikonografie. |

## Pipeline-Werkzeuge

Drei kuratorische Skripte unter [`../tools/`](../tools/):

| Tool | Funktion |
|---|---|
| `wikidata-snapshot.py` | LOD-Anker. Schickt SPARQL-Queries aus `data/queries/` an Wikidata, persistiert Ergebnis als datierten Snapshot. |
| `scholarly-harvest.py` | Anreicherung. Holt für verifizierte DOIs Metadaten aus Crossref, Unpaywall und OpenAlex; trennt curated von harvested; flag-basierte Hygiene. |
| `validate-data.py` | Integritätstests. Drei Schichten: lokale Konsistenz (offline), Wikidata-QID-Verifikation (online), URL-Lebenszeichen (online). |

## Action-Layer

Imperative Steuerung des Coding-Agenten lebt in [`../CLAUDE.md`](../CLAUDE.md). Bei UI-Generierung gilt: erst [design.md](design.md) lesen, dann CLAUDE.md-Designprinzipien anwenden.

## Related (im Vault)

- [[Project Overview CONTEXT]] — Vault-Mission-Control
- [[Konvention Promptotyping Documents]] — Konvention dieser Wissensbasis
