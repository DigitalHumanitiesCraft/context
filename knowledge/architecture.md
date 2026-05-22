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
status: draft
language: de
version: 0.1
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
related: [project, data, design]
---

# Architektur CONTEXT

Statisches Frontend, clientseitiges Datenladen, kein Backend. Deployment auf GitHub Pages aus dem `main`-Branch.

## Komponentenübersicht

```
Repo-Root
├── HTML-Seiten (index, concept, about)
│      lädt
│      ↓
├── assets/app.js               ← Routing, Filter, Rendering
│      verwendet
│      ↓
├── assets/data-loader.js       ← Fetch und Index-Aufbau
│      lädt
│      ↓
└── data/*.json                 ← Vier JSON-Dateien als Datenstand
```

Kein Bundler, kein Build-Step. Browser lädt HTML, CSS und JS direkt. ES-Module über `<script type="module">`.

## Datenfluss

1. Benutzer öffnet eine der drei HTML-Seiten.
2. Die Seite lädt `assets/app.js` als Modul.
3. `app.js` ruft `data-loader.js` auf, das die vier JSON-Dateien parallel fetcht.
4. `data-loader.js` baut eine In-Memory-Indexstruktur: Konzept-Map, Werk-Map, Studie-Map mit Querverweisen.
5. `app.js` rendert je nach Seite den Konzept-Index oder die Brücken-Ansicht.
6. Bei der Brücken-Ansicht liest `app.js` den `?id=`-Parameter und filtert den In-Memory-Index.

Filter sind reine Client-State-Operationen, kein Reload.

## JSON-Datenmodell

Vier Dateien unter `data/`:

| Datei | Inhalt |
|---|---|
| `concepts.json` | Konzept-Array, jedes mit `id`, `label`, `wikidata_qid`, `aufnahmegrund`, `traditions`, `placeholder` |
| `works.json` | Werk-Array mit `id`, `label`, `wikidata_qid`, `tradition`, `language`, `concept_ids[]`, `representations[]` |
| `studies.json` | Studie-Array mit `id`, `title`, `authors`, `year`, `doi`, `method`, `concept_id`, `evidence_type`, `provenance` |
| `repositories.json` | Repositorien-Array mit `id`, `label`, `url`, `tradition_scope` |

Die Querverweise zwischen Dateien laufen über `id`-Werte. Die Index-Aufbauphase in `data-loader.js` löst sie zu Objektreferenzen auf.

## Stack-Wahl

Vanilla JS mit ES-Modulen. Keine Frameworks. Begründung:

- **GitHub-Pages-tauglich ohne Build-Pipeline.** Repository klonen und öffnen reicht.
- **Lesbar für Reviewer.** Jede Funktion ist nachvollziehbar ohne Toolchain-Kenntnis.
- **Stabil über Zeit.** Vanilla-Stack altert nicht.
- **DHCraft-Konvention.** Folgt zbz-ocr-tei, Agentic-Edition-Pipeline und Klawiter-Rescue.

## Geplanter zweiter Datenpfad: SPARQL

Sobald reale Konzepte modelliert sind, soll ein zweiter Datenpfad parallel zum JSON-Pfad laufen. Wikidata-SPARQL-Queries gegen den öffentlichen Endpoint, automatisch erschließbare Teilmenge (etwa Werk-Metadaten, Personennamen, alternative Sprachlabels). Queries liegen als Dateien unter `data/queries/` und sind versioniert, sodass die automatisch erschlossene Teilmenge reproduzierbar bleibt.

Im Prototyp v0 ist der SPARQL-Pfad noch nicht implementiert. Das Frontend trägt nur den JSON-Pfad.

## Deployment

GitHub Pages aus `main`, Source-Folder `/`. Sobald Pages aktiviert ist, deployt jeder Push automatisch. Die Site ist statisch hostbar überall, wo HTTP-Files serviert werden — Pages ist nur eine Wahl, keine Abhängigkeit.

## Was bewusst nicht in der Architektur ist

- **Kein Backend.** Keine Datenbank, kein API-Server. Daten sind clientseitig.
- **Kein Build-Step.** Kein Webpack, Vite, Rollup. Browser lädt Quelltexte direkt.
- **Kein Framework.** Kein React, Vue, Svelte. Vanilla JS reicht für drei Seiten.
- **Kein Authentifizierungsschema.** Statisch, jeder kann lesen, niemand kann schreiben außer über PR gegen den Repo.

## Web Components als Option

Wenn die Komponentenanzahl wächst (etwa wenn ein dritter View hinzukommt), lassen sich die wiederkehrenden Bauteile (`concept-card`, `bridge-column`, `evidence-badge`) als native Web Components kapseln. Im Prototyp v0 reicht inline-HTML mit CSS-Klassen, weil die Anzahl Komponenteninstanzen gering ist.

## Related (im Vault)

- [[Linked Open Data]]
- [[SPARQL]]
- [[Wikidata]]
- [[Web Components]]
