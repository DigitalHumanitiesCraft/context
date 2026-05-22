---
title: Datengrundlage CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Datengrundlage
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/data
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-data
status: draft
language: de
version: 0.1
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Datenmodellierung]]", "[[Linked Open Data]]", "[[Knowledge Graph]]"]
knowledge-sources:
  vocabularies:
    - label: Wikidata
      url: https://www.wikidata.org
    - label: GND
      url: https://gnd.network
    - label: VIAF
      url: https://viaf.org
  standards:
    - label: RDF
      url: https://www.w3.org/RDF
    - label: SPARQL
      url: https://www.w3.org/TR/sparql11-query
related: [project, specification, architecture]
---

# Datengrundlage CONTEXT

Das Datenmodell von CONTEXT umfasst fünf Knotentypen, verbunden als Graph über stabile Identifikatoren. Verweise ersetzen Kopien.

## Aktueller Stand: synthetische Platzhalterdaten

Im Prototyp v0 liegen synthetische Platzhalterdaten für fünf Konzepte unter `data/`. Die Struktur ist realistisch, die Verknüpfungen sind nicht kuratorisch belegt. Jeder Datensatz trägt `placeholder: true`, jede Seite im UI führt einen Coverage-Banner. Reale Modellierung folgt schrittweise mit drei bis fünf realen Konzepten als Härtetest des Schemas.

Markierung des Platzhalterstatus liegt zusätzlich in [`../data/PLACEHOLDER.md`](../data/PLACEHOLDER.md).

## Fünf Knotentypen

### 1. Konzept

Kontemplatives Phänomen oder mentaler Zustand. Zentraler Knotentyp, an dem Quelltext und empirische Studie zusammenlaufen. Der Konzept-Knoten ist die methodische Innovation, die das Projekt von einem Werk-Repositorium in eine Brückeninfrastruktur verwandelt.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | URL-sicherer Slug, im Repo stabil |
| `label.original` | string | Begriff in Originalschrift |
| `label.translit` | string | Wissenschaftliche Transliteration |
| `label.de` | string | Deutsche Übersetzung |
| `label.en` | string | Englische Übersetzung |
| `wikidata_qid` | string | Wikidata-QID falls vorhanden, sonst `null` |
| `aufnahmegrund` | object | `{ citation, doi }` der Sekundärliteratur |
| `traditions` | string[] | Liste der zugehörigen Traditionen |
| `placeholder` | boolean | `true` bis kuratorisch validiert |

**Konzept-Disambiguierung.** Derselbe Zustand trägt in verschiedenen Traditionen verschiedene Namen, und ähnliche Namen meinen nicht immer dasselbe. Das Modell unterscheidet zwischen einem traditionsspezifischen Begriff (etwa Pali-Jhāna) und einem übergreifenden Phänomen-Konzept. Im Datenformat wird das über `traditions[]` als Liste mehrerer Traditionen pro Konzept abgebildet; eine spätere Version kann ein eigenes `phenomenon`-Feld einführen, das mehrere Tradition-spezifische Begriffe gruppiert.

### 2. Werk

Sprachneutrale historische Texteinheit, verankert über Wikidata-QID.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | URL-sicherer Slug |
| `label` | object | Mehrsprachige Labels wie bei Konzepten |
| `wikidata_qid` | string | Falls vorhanden |
| `tradition` | string | Zugehörige Tradition |
| `language` | string | ISO-Sprachcode des Originals |
| `placeholder` | boolean | `true` bis validiert |

### 3. Digitale Repräsentation

Konkrete Edition oder Faksimile eines Werks in einem Repositorium.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Slug |
| `work_id` | string | Verweis auf Werk |
| `repository_id` | string | Verweis auf Repositorium |
| `type` | enum | `edition` oder `facsimile` (Belegtrennung) |
| `url` | string | Direkter Link |
| `format` | string | TEI-XML, plain text, PDF, IIIF |

### 4. Repositorium

Infrastruktur, in der Repräsentationen liegen.

**Pflichtfelder.** `id`, `label`, `url`, `tradition_scope` (welche Traditionen das Repositorium abdeckt).

### 5. Forschungskontext / Studie

Empirische Untersuchung, die ein Konzept stützt, einschränkt oder methodisch-kritisch behandelt.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Slug |
| `title` | string | Titel der Studie |
| `authors` | string[] | Autorenliste |
| `year` | integer | Publikationsjahr |
| `doi` | string | Falls vorhanden |
| `method` | string | fMRT, EEG, Phänomenologie, HRV |
| `concept_id` | string | Verweis auf Konzept |
| `evidence_type` | enum | `stützend`, `einschränkend`, `methodisch-kritisch` |
| `provenance` | object | `{ source, date }` wer wann die Verknüpfung gezogen hat |

## Beziehungen

Die Kanten zwischen Knoten sind selbst typisiert. Drei Kantentypen tragen das Modell.

| Beziehung | Quelle | Ziel | Bedeutung |
|---|---|---|---|
| `quelle_zu_konzept` | Werk | Konzept | Werk behandelt das Konzept als Begriff |
| `repräsentation_zu_werk` | Repräsentation | Werk | Repräsentation ist eine Ausgabe des Werks |
| `studie_zu_konzept` | Studie | Konzept | Studie untersucht das Konzept empirisch |

Die `studie_zu_konzept`-Kante trägt `evidence_type` und `provenance` als Eigenschaften der Kante, nicht der Studie selbst. Eine Studie kann mehrere Konzepte mit unterschiedlichem Evidenzgrad berühren.

## Externe Vokabulare und Identifikatoren

- **Wikidata-QID.** Drehscheibe für sprachübergreifende Anker. Wo eine QID existiert, wird sie geführt; wo nicht, bleibt `null` und kann kuratorisch nachgetragen werden.
- **GND.** Normdatei für Personen, Werke und Körperschaften im deutschsprachigen Raum.
- **VIAF.** Internationaler Authority File. Sekundärer Anker, wo GND nicht trägt.

## Was bewusst nicht modelliert wird

- **Volltexte.** CONTEXT trägt keine Texte, nur Verweise auf Repräsentationen in fachspezifischen Repositorien.
- **Faksimiles.** Bilder werden nicht aggregiert, IIIF ist optionale Belegschicht in der Repräsentation, nicht Aggregationsprinzip.
- **Bewusstseinsforschung im engeren Sinn.** Nur Studien, die ein historisches Konzept untersuchen, nicht eigenständige Forschungsstränge der Neurowissenschaft.

## Versionierung des Vokabulars

Konzept-Identifikatoren sind stabil. Ein einmal vergebener `id`-Wert wird nicht recycelt, auch wenn sich die Beschreibung ändert. Schema-Änderungen erhöhen die repo-weite `version:`-Stufe.

## Reproduzierbarkeit der SPARQL-Schicht

Sobald reale Wikidata-Abfragen die automatisch erschließbare Teilmenge tragen, liegen die Queries als versionierte Dateien unter `data/queries/`. Im Prototyp v0 ist diese Schicht noch leer.

## Synthetische Platzhalterdaten im aktuellen Stand

Fünf Konzepte mit realistischer Struktur, jeweils mit `placeholder: true` markiert:

| Konzept | Tradition | Quellen synthetisch | Studien synthetisch |
|---|---|---|---|
| Jhāna | Pali-Buddhismus | Visuddhimagga, Anguttara Nikāya AN 9 | 2 |
| Nichtduales Gewahrsein | Advaita Vedānta, Dzogchen | Aṣṭāvakra Gītā, Khregs chod | 1 |
| Nirodha Samāpatti | Theravāda | Visuddhimagga XXIII | 1 |
| DMN-Suppression | (rein empirisch) | — | 1 |
| Hesychasm-Herzensgebet | Christliche Mystik | Philokalia | 1 |

Das DMN-Konzept demonstriert absichtlich, dass die Quellseite leer bleiben darf. Nicht jedes Phänomen hat eine historische Texttradition; das Modell trägt auch rein empirisch beschriebene Zustände.

## Related (im Vault)

- [[Wikidata]]
- [[Linked Open Data]]
- [[RDF]]
- [[Datenmodellierung]]
