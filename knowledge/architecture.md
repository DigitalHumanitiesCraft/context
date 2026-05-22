---
title: Architektur CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Architecture
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/architecture
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-architecture
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Linked Open Data]]", "[[SPARQL]]"]
knowledge-sources:
  standards:
    - label: HTML Living Standard
      url: https://html.spec.whatwg.org
    - label: CSS Cascading Style Sheets
      url: https://www.w3.org/Style/CSS
    - label: SPARQL 1.1
      url: https://www.w3.org/TR/sparql11-query
  apis:
    - label: Crossref REST
      url: https://api.crossref.org
    - label: Unpaywall
      url: https://unpaywall.org/products/api
    - label: OpenAlex
      url: https://docs.openalex.org
related: [project, data, design]
---

# Architektur CONTEXT

Statisches Frontend, clientseitiges Datenladen, kein Backend. Deployment auf GitHub Pages aus dem `main`-Branch. Drei kuratorische Skripte unter `tools/` für die Pflege des Datenbestands.

## Komponentenübersicht

```
Repo-Root
├── index.html                        ← Single-Page-Explorer mit Hash-Router
│                                       Routen: # / #aggregation / #about /
│                                       #tradition/<slug> / #konzept/<id> /
│                                       #gap/<id> / #studie/<id> /
│                                       #repositorium/<id> / #referenz/<id>
│      lädt
│      ↓
├── assets/app.js                     ← Hash-Router, neun Renderer,
│                                       Tradition-Hauptgruppen-Aggregation
│      verwendet
│      ↓
├── assets/data-loader.js             ← Fetch, Index-Aufbau, Tradition-Aggregat
│                                       zu sieben Hauptgruppen, Manifest-Lese-Logik
│      lädt
│      ↓
└── data/*.json                       ← Fünf JSON-Dateien plus Manifeste
```

Kuratorische Pipeline (offline, läuft auf Kuratoren-Maschine):

```
Saaten und Queries
  ↓
data/queries/*.rq          ─→  tools/wikidata-snapshot.py  ─→  data/wikidata-snapshots/
data/seeds.json (DOIs)     ─→  tools/scholarly-harvest.py  ─→  data/scholarly-snapshots/
data/*.json                ─→  tools/validate-data.py      ─→  Pass/Fail-Report
                                       (drei Schichten)
[geplant Iteration 2]
data/queries/fanout.rq     ─→  tools/discovery.py          ─→  data/discovery-snapshots/
```

Browser lädt nur die persistierten JSON-Dateien. Kein Live-Endpunkt-Call zur Laufzeit. ES-Module über `<script type="module">`.

## Datenfluss im Frontend

1. Benutzer öffnet `index.html`.
2. Die Seite lädt `assets/app.js` als Modul.
3. `app.js` ruft `data-loader.js` auf, das die fünf JSON-Dateien plus `wikidata-snapshots/manifest.json` parallel fetcht.
4. `data-loader.js` baut eine In-Memory-Indexstruktur: Konzept-Map, Werk-Map, Studie-Map, Repo-Map, Referenz-Map mit Querverweisen plus eine flache `entities[]`-Liste für die globale Suche plus eine Tradition-Aggregation (`concepts[].traditions[]` per Reduce).
5. `app.js` liest den URL-Hash und ruft den passenden Renderer auf.
6. Bei leerem Hash rendert die Coverage-Karte (Stat-Cards, Tradition-Liste sortiert nach Reifegrad).
7. Bei `#konzept/<id>` rendert die Brücken-Ansicht. Bei `#studie/<id>` die Detail-Seite mit getrennten Feldgruppen. Bei `#tradition/<id>` die Tradition-Seite. Bei `#gap/<id>` die Lücken-Knoten-Seite mit Begründungsliste.

Filter und Suche sind reine Client-State-Operationen, kein Reload.

## JSON-Datenmodell

Fünf Dateien unter `data/`:

| Datei | Inhalt |
|---|---|
| `concepts.json` | Konzept-Array mit allen Pflichtfeldern, `related_concepts[]`, `maturity` |
| `works.json` | Werk-Array mit `concept_ids[]` und eingebetteten `representations[]` |
| `studies.json` | Studie-Array mit `concept_id`, `additional_concepts[]`, Pflicht-Enums (evidence_type, sample_type, domain) |
| `repositories.json` | Repositorien-Array mit Wikidata-QID, Tradition-Scope, Sprachen |
| `references.json` | Knotenpunkt-Referenz-Array mit `concepts_anchored[]` und je drei `follow_up_papers[]` |

Plus zwei abgeleitete Ordner:

- `wikidata-snapshots/` mit datierten SPARQL-Antworten und `manifest.json`.
- `scholarly-snapshots/` mit datierten Crossref/Unpaywall/OpenAlex-Antworten und Manifest (Iteration 2).

Die Querverweise zwischen Dateien laufen über `id`-Werte. Die Index-Aufbauphase in `data-loader.js` löst sie zu Objektreferenzen auf.

## Stack-Wahl

Vanilla JS mit ES-Modulen. Keine Frameworks. Begründung:

- **GitHub-Pages-tauglich ohne Build-Pipeline.** Repository klonen und öffnen reicht.
- **Lesbar für Reviewer.** Jede Funktion ist nachvollziehbar ohne Toolchain-Kenntnis.
- **Stabil über Zeit.** Vanilla-Stack altert nicht.
- **DHCraft-Konvention.** Folgt zbz-ocr-tei, Agentic-Edition-Pipeline und Klawiter-Rescue.

## Kuratorische Skripte (Pipeline)

Drei Python-Skripte unter [`../tools/`](../tools/), alle deterministisch, alle mit datiertem Output, alle reproduzierbar.

### `wikidata-snapshot.py`

Liest SPARQL-Queries aus `data/queries/*.rq`, schickt sie an `query.wikidata.org/sparql`, schreibt das Ergebnis als datierte JSON-Datei nach `data/wikidata-snapshots/YYYY-MM-DD-<name>.json`. Aktualisiert `manifest.json`.

Aktuell drei Queries:
- `concept-labels.rq` — mehrsprachige Labels und Wikipedia-Links für sieben Konzept-QIDs.
- `works-by-qid.rq` — Autor, Entstehungszeit, Sprache, Genre für fünf Werk-QIDs.
- `repositories.rq` — Webseite und Trägerinstitution für sechs Repositorien.

Refresh-Vorgang: `python tools/wikidata-snapshot.py` oder pro Query `python tools/wikidata-snapshot.py concept-labels`.

### `scholarly-harvest.py`

Liest DOI-Saaten aus `data/seeds.json` und ruft drei offene APIs pro DOI ab:

- **Crossref** für bibliografische Metadaten (Titel, Autoren, Journal, Pages, Cited-by).
- **Unpaywall** für Open-Access-Status und beste OA-URL.
- **OpenAlex** für `referenced_works` und `related_works` als Cluster-Kandidaten.

Output nach `data/scholarly-snapshots/YYYY-MM-DD-scholarly.json` mit getrennten Bereichen `curated` (Handarbeit) und `harvested` (API-Output). Re-Harvest überschreibt keine Kuration.

Hygiene-Flags pro Datensatz:
- `no-doi-use-fallback-url` für Werke ohne DOI (Varela 1996).
- `author-order-mismatch` wenn Crossref-Reihenfolge von Kuration abweicht (Saraei 2023).
- `author-set-mismatch` wenn die Mengen sich unterscheiden.
- `crossref-missing`, `unpaywall-missing`, `openalex-missing` bei API-Ausfall.

Evidence-Gap-Detection: Skript prüft jedes Konzept aus `seeds.json` und meldet drei Klassen — echte Gaps (`maturity: fehlend`), seed-incomplete (Maturity sagt evidence exists, aber Saat fehlt), consistent (Saat-Anzahl deckt Maturity). Iteration-1.1-Offline-Snapshot: 2 echte Gaps, 0 seed-incomplete, 9 consistent.

Offline-Modus über Fixtures: `python tools/scholarly-harvest.py --offline` liest aus `data/fixtures/responses.json`. Reproduzierbar, testbar, CI-fähig.

### `validate-data.py`

Drei Schichten, alle CLI-steuerbar:

- **Schicht 1 (offline):** JSON-Parsing, ID-Eindeutigkeit, Referenz-Integrität, Pflichtfelder, Enum-Validierung. Prüft auch das `maturity`-Feld auf das kontrollierte Vokabular.
- **Schicht 2 (Wikidata):** jede QID gegen `Special:EntityData` prüfen, Existenz und Label-Vorhandensein.
- **Schicht 3 (URLs):** HEAD-Request auf jede URL in Repräsentationen und Repositorien.

Exit-Codes: 0 grün, 1 Schicht 1 rot, 2 Schicht 2 rot, 3 Schicht 3 rot. Damit CI-tauglich.

## Deployment

GitHub Pages aus `main`, Source-Folder `/`. Sobald Pages aktiviert ist, deployt jeder Push automatisch. Die Site ist statisch hostbar überall, wo HTTP-Files serviert werden — Pages ist nur eine Wahl, keine Abhängigkeit.

Lokal: `python -m http.server 8000` im Repo-Root.

## Was bewusst nicht in der Architektur ist

- **Kein Backend.** Keine Datenbank, kein API-Server. Daten sind clientseitig.
- **Kein Build-Step für das Frontend.** Kein Webpack, Vite, Rollup. Browser lädt Quelltexte direkt.
- **Kein Framework.** Kein React, Vue, Svelte. Vanilla JS reicht für einen Single-Page-Explorer.
- **Kein Live-Endpunkt-Call.** Externe APIs werden ausschließlich über kuratorische Skripte angesprochen, Output ist statisches JSON im Repo.
- **Keine Authentifizierung.** Statisch, jeder kann lesen, niemand kann schreiben außer über PR gegen den Repo.

## Was in Iteration 2 ergänzt wird

- **Discovery-Pipeline** als viertes Skript `tools/discovery.py`. Methodik und Workflow-Skelette in [[Discovery-Workflows|discovery-workflows.md]], SPARQL-Logik in [[Wikidata als Drehscheibe|wikidata-als-drehscheibe.md]]. Drei Pfade: Volltext (Fachrepos), Faksimile (Aggregatoren wie Europeana, BnF, Vatican DigiVatLib), Wikidata-Topic-Expansion über `wdt:P31/wdt:P279/wdt:P921`. Wikidata als Fan-out-Drehscheibe.
- **Diff-Visualisierung** zwischen zwei Snapshots in der UI sichtbar machen.
- **Wikidata-Snapshot-Daten in der UI nutzen** (mehrsprachige Labels, Wikipedia-Links, Werk-Autor, Trägerinstitution).

## Web Components als Option

Wenn die Komponentenanzahl wächst, lassen sich die wiederkehrenden Bauteile (`concept-card`, `bridge-column`, `evidence-badge`) als native Web Components kapseln. Im Single-Page-Explorer der Iteration 1 reicht inline-HTML mit CSS-Klassen.

## Related (im Vault)

- [[Linked Open Data]]
- [[SPARQL]]
- [[Wikidata]]
- [[Web Components]]
