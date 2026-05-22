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
status: active
language: de
version: 0.2
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
  apis:
    - label: Crossref
      url: https://api.crossref.org
    - label: Unpaywall
      url: https://unpaywall.org
    - label: OpenAlex
      url: https://openalex.org
related: [project, specification, architecture]
---

# Datengrundlage CONTEXT

Das Datenmodell von CONTEXT umfasst sechs Knotentypen, verbunden als Graph über stabile Identifikatoren. Verweise ersetzen Kopien.

## Aktueller Stand: Iteration 1, weitgehend belegt

Stand 2026-05-22 liegen elf Konzepte vor. Sechs davon mit Reifegrad `etabliert`, zwei `berührt`, einer `beginnend`, zwei `fehlend` (Evidence-Gap-Knoten). Wikidata-QIDs für alle Konzepte mit Wikidata-Anker wurden gegen die Wikidata-API verifiziert und liegen als Snapshots unter [`../data/wikidata-snapshots/`](../data/wikidata-snapshots/), erzeugt durch das Tool unter [`../tools/wikidata-snapshot.py`](../tools/wikidata-snapshot.py).

**Bestand Iteration 1**: 11 Konzepte, 5 Werke, 18 Studien (inkl. Templeton-Watchlist als laufende Studie), 9 Repositorien, 4 Knotenpunkt-Referenzen.

## Sechs Knotentypen

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
| `wikidata_qid` | string \| null | Wikidata-QID falls vorhanden, gegen Live-API verifiziert |
| `aufnahmegrund` | object | `{ citation, doi }` der Sekundärliteratur; bei Evidence-Gap kuratierte Begründung |
| `traditions` | string[] | Liste der zugehörigen Traditionen |
| `summary` | string | Kuratierte Beschreibung |
| `related_concepts` | object[] | Typisierte Kanten zu anderen Konzepten |
| `maturity` | enum | `etabliert` \| `berührt` \| `beginnend` \| `fehlend` |

**Reifegrad-Vokabular.** Das Feld `maturity` ist kontrolliert auf vier Werte:

- `etabliert` — Tradition hat eigene Klassifikation, Messinstrumente, Methodenreflexion. Beispiel: fortgeschrittener Buddhismus mit Sparby/Sacchet-Klassifikation.
- `berührt` — Neurowissenschaftlich angefasst, aber ohne theoretischen Unterbau. Beispiel: Sufi-Dhikr (Saraei 2023), daoistisches Qigong (Henz/Schöllhorn 2017).
- `beginnend` — Getragen von einzelnem Übergangsbeleg, laufende Studien noch ohne Outcomes. Beispiel: Hesychasmus (Rubinart 2017 plus Templeton WCT 30294).
- `fehlend` — Empirisch unsichtbar, als evidence-gap-Knoten mit kuratierter Begründung geführt. Beispiel: jüdisch-mystische Meditation, klassisches Neidan.

**Wichtig**: Der Reifegrad bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst. Eine Tradition mit `maturity: fehlend` ist nicht weniger wertvoll — sie ist im empirischen Diskurs weniger sichtbar.

**Konzept-Disambiguierung über Traditionen.** Derselbe Zustand trägt in verschiedenen Traditionen verschiedene Namen, und ähnliche Namen meinen nicht immer dasselbe. Das Modell unterscheidet das auf zwei Ebenen: über `traditions[]` als Liste pro Konzept und über `related_concepts[]` als typisierte Kante zu anderen Konzepten.

**Konzept-zu-Konzept-Kanten.** Verwendete Relationen: `vertieft-zu`, `vertieft-aus`, `verwandt-mit`, `korreliert-mit`, `operationalisiert`, `operationalisiert-durch`. Dieser Mechanismus löst das DMN-Problem: DMN-Suppression hat keine eigene Texttradition, aber über `operationalisiert: nichtduales-gewahrsein, ich-aufloesung` läuft die historische Verankerung indirekt.

### 2. Werk

Sprachneutrale historische Texteinheit, verankert über Wikidata-QID.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | URL-sicherer Slug |
| `label` | object | Mehrsprachige Labels wie bei Konzepten |
| `wikidata_qid` | string \| null | Falls vorhanden, verifiziert |
| `author` | string \| null | Autor wo bekannt |
| `century` | string | Entstehungszeit |
| `tradition` | string | Zugehörige Tradition |
| `language` | string | ISO-Sprachcode des Originals |
| `concept_ids` | string[] | Verweis auf zugehörige Konzepte |
| `representations` | object[] | Digitale Repräsentationen |

### 3. Digitale Repräsentation

Konkrete Edition oder Faksimile eines Werks in einem Repositorium. Eingebettet in `works.json` unter `representations[]`.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Slug |
| `repository_id` | string | Verweis auf Repositorium |
| `type` | enum | `edition` \| `facsimile` (Belegtrennung) |
| `url` | string | Direkter Link |
| `format` | string | TEI-XML, plain text, PDF, IIIF |
| `note` | string \| null | Übersetzungs- oder Editionshinweis |

### 4. Repositorium

Infrastruktur, in der Repräsentationen liegen. Im Discovery-Kontext drei Klassen, abgebildet über `representations[].type`:

- **Volltext-Fachrepo** (`type: edition`): analysierbarer Volltext einer Tradition. Beispiele im Bestand: GRETIL, CBETA, SuttaCentral, BDRC, TLG, Access to Insight, Stanford Sōtō.
- **Faksimile-Aggregator** (`type: facsimile`): Bildmaterial historischer Quellen, oft IIIF. Im Iteration-1-Bestand noch nicht erfasst; Kandidaten siehe [[Discovery-Workflows|discovery-workflows.md]]: Europeana, BnF Gallica, Vatican DigiVatLib, BL Digitised Mss., National Library of Israel Ktiv, Kulturpool, Wikimedia Commons.
- **Ikonografie-Sammlung** (geplant für Iteration 3): Museumsobjekte, Skulpturen, kalligrafische Werke. Kandidaten: Met Museum API, British Museum, Smithsonian.

**Pflichtfelder.** `id`, `label`, `url`, `wikidata_qid`, `tradition_scope`, `languages`, `country`, `host_institution`, `description`.

### 5. Studie

Empirische Untersuchung, die ein Konzept stützt, einschränkt, methodisch-kritisch behandelt, Nebenwirkungen dokumentiert oder als laufende Watchlist-Studie geführt wird.

**Pflichtfelder.**

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Slug |
| `title` | string | Titel der Studie |
| `authors` | string[] | Autorenliste (curated) |
| `year` | integer | Publikationsjahr |
| `journal` | string \| null | Journal |
| `doi` | string \| null | DOI; für Varela 1996 explizit `null`, kein synthetischer DOI |
| `url` | string \| null | DOI-Resolver-Link oder Fallback |
| `method` | string | fMRT, EEG, RCT, Phänomenologie |
| `concept_id` | string | Verweis auf primäres Konzept |
| `additional_concepts` | string[] | Verweise auf weitere Konzepte für konzeptübergreifende Studien |
| `evidence_type` | enum | `stützend` \| `einschränkend` \| `methodisch-kritisch` \| `nebenwirkungen-dokumentierend` \| `laufend` |

| `sample_type` | enum | `einzelfall` \| `vergleichsstudie` \| `klinisch` \| `bevölkerungsrepräsentativ` \| `rct` \| `meta-analyse` \| `übersichtsarbeit` \| `theoriebildung` \| `experimentell` |
| `domain` | enum | `meditation-research` \| `psychedelics-research` \| `clinical-trial` \| `school-based` |
| `n` | integer \| null | Stichprobengröße, null bei Theoriebildung oder Übersichten |
| `provenance` | object | `{ source, date }` wer wann die Verknüpfung gezogen hat |
| `summary` | string | Kuratierte Beschreibung |

### 6. Knotenpunkt-Referenz

Theoretische Schlüsselarbeit, an die sich viele Studien anschließen. Eigener Knotentyp ab Iteration 1 in [`../data/references.json`](../data/references.json).

**Pflichtfelder.** `id`, `type: knotenpunkt`, `title`, `authors`, `year`, `journal`, `doi` (oder `null` mit `doi_status: no-doi`), `url`, `open_access`, `license`, `core_thesis`, `concepts_anchored`, `follow_up_papers` (drei pro Knoten).

**Aktuelle Knotenpunkte (alle vier mit je drei Folgepapers):**

- Varela 1996 — Neurophänomenologie (kein DOI, Volltext-URL)
- Sparby & Sacchet 2022/2024 — Klassifikationsbasis advanced meditation
- Lindahl et al. 2017 — Varieties of Contemplative Experience
- Carhart-Harris et al. 2014 — Entropic Brain

## Beziehungen

Die Kanten zwischen Knoten sind selbst typisiert. Fünf Kantentypen tragen das Modell.

| Beziehung | Quelle | Ziel | Bedeutung |
|---|---|---|---|
| `quelle_zu_konzept` | Werk | Konzept | Werk behandelt das Konzept als Begriff (über `concept_ids[]`) |
| `repräsentation_zu_werk` | Repräsentation | Werk | Repräsentation ist eine Ausgabe des Werks |
| `studie_zu_konzept` | Studie | Konzept | Studie untersucht das Konzept empirisch (über `concept_id` plus optional `additional_concepts[]`) |
| `konzept_zu_konzept` | Konzept | Konzept | Typisierte Beziehung zwischen Konzepten (über `related_concepts[]`) |
| `referenz_zu_konzept` | Knotenpunkt-Referenz | Konzept | Theoretische Verankerung mehrerer Konzepte (über `concepts_anchored[]`) |

Die `studie_zu_konzept`-Kante trägt `evidence_type`, `sample_type`, `domain`, `n` und `provenance`. Eine konzeptübergreifende Studie (Britton 2021, Goldberg 2022) erscheint primär unter `concept_id` und wird über `additional_concepts[]` zusätzlich an weitere Konzepte gehängt.

## Curated vs harvested

Iteration 1 trennt strikt zwischen kuratierten und geernteten Feldern. Diese Trennung ist umgesetzt im Tool [`../tools/scholarly-harvest.py`](../tools/scholarly-harvest.py).

**Curated (kuratorisch entschieden):**
- Konzept-Zuordnung (`concept_id`, `additional_concepts`, `concepts_anchored`)
- Evidenz-Typ und Aufnahmegrund
- Sample-Type, Domain, Reifegrad
- Provenienz-Stempel

**Harvested (aus offenen APIs geholt):**
- Titel, Autoren, Journal, Volume, Issue, Pages
- Open-Access-Status, OA-URL, Lizenz
- Cited-by-Count, Referenced-Works, Related-Works

**Prinzip:** Re-Harvest überschreibt keine Kuration. Wenn der Harvester eine andere Autorenreihenfolge findet als die Kuration vorgibt, erscheint ein Flag (`author-order-mismatch`), aber die kuratierte Liste bleibt unverändert.

## Externe Vokabulare und Identifikatoren

- **Wikidata-QID.** Drehscheibe für sprachübergreifende Anker. Wo eine QID existiert, wird sie geführt; wo nicht, bleibt `null` und kann kuratorisch nachgetragen werden. Alle QIDs werden vor Produktiv-Ingest gegen die Wikidata-API verifiziert (Tool: `validate-data.py --wikidata`).
- **GND.** Normdatei für Personen, Werke und Körperschaften im deutschsprachigen Raum.
- **VIAF.** Internationaler Authority File. Sekundärer Anker, wo GND nicht trägt.
- **Crossref.** Bibliografische Metadaten und Zitationszahlen via DOI.
- **Unpaywall.** Open-Access-Status und beste OA-URL pro DOI.
- **OpenAlex.** Referenced-Works und Related-Works als Cluster-Kandidaten für die Knotenpunkt-Referenzen.

## Was bewusst nicht modelliert wird

- **Volltexte.** CONTEXT trägt keine Texte, nur Verweise auf Repräsentationen in fachspezifischen Repositorien.
- **Faksimiles.** Bilder werden nicht aggregiert, IIIF ist optionale Belegschicht in der Repräsentation, nicht Aggregationsprinzip.
- **Bewusstseinsforschung im engeren Sinn.** Nur Studien, die ein historisches Konzept untersuchen, nicht eigenständige Forschungsstränge der Neurowissenschaft.
- **Erfundene DOIs.** Für Varela 1996 ist `doi: null` mit `doi_status: no-doi` und Volltext-URL. Wer den DOI später "ergänzt", verletzt die Hygiene-Regel.

## Versionierung des Vokabulars

Konzept-Identifikatoren sind stabil. Ein einmal vergebener `id`-Wert wird nicht recycelt, auch wenn sich die Beschreibung ändert. Schema-Änderungen erhöhen die repo-weite `version:`-Stufe in allen Knowledge-Dokumenten gemeinsam (Iteration 1 = `version: 0.2`).

## Reproduzierbarkeit der externen Schichten

Drei kuratorische Skripte unter [`../tools/`](../tools/):

- **`wikidata-snapshot.py`** liest Queries aus `data/queries/*.rq` und schreibt versionierte Snapshots nach `data/wikidata-snapshots/YYYY-MM-DD-<name>.json`. Manifest pro Lauf aktualisiert.
- **`scholarly-harvest.py`** liest DOI-Saaten und ruft Crossref + Unpaywall + OpenAlex pro DOI ab. Output nach `data/scholarly-snapshots/YYYY-MM-DD-scholarly.json`. Trennt curated und harvested, setzt Hygiene-Flags, erkennt Evidence-Gaps und Seed-incomplete-Zustände.
- **`validate-data.py`** prüft den Datenbestand in drei Schichten: lokale Konsistenz (offline), Wikidata-QID-Verifikation (online), URL-Lebenszeichen (online).

Jeder Snapshot ist datiert. Der Diff zwischen zwei Snapshots wird in Iteration 2 in der UI sichtbar gemacht (Zitations-Entwicklung, OA-Status-Wechsel).

## Folgepaper-Cluster aus OpenAlex

Pro Studie speist OpenAlex zwei Felder, die als aufklappbare Cluster-Liste in der Detail-Pane erscheinen:

- **`harvested.referenced_works[]`** — was die Studie zitiert. Rückwärts-Anker zu Vorarbeiten.
- **`harvested.related_works[]`** — was OpenAlex als ähnlich klassifiziert. Seitliche Cluster-Kandidaten.

Beispiel aus dem Snapshot-Format: Carhart-Harris 2014 (entropic brain) liefert sechs referenced_works und vier related_works, Lindahl 2017 liefert fünf referenced_works und drei related_works. Diese Cluster sind das Substrat, aus dem die Knotenpunkt-Referenzen ihre `follow_up_papers[]` ziehen — automatische Discovery der theoretischen Anschlüsse.

Cluster-Inhalte sind nicht-kuratiert. Sie erscheinen mit der Markierung "via OpenAlex", werden nicht in `studies.json` aufgenommen, bis sie kuratorisch geprüft sind. Damit bleibt die Trennung curated/harvested konsistent.

## Tradition als Aggregat

Traditionen sind typisierte Strings in `concepts[].traditions[]`. Im Bestand stehen achtzehn feine Tradition-Strings, die in `assets/data-loader.js` über ein kuratiertes Mapping zu **sieben Hauptgruppen** aggregiert werden. Diese Hauptgruppen ordnen die Coverage-Karte.

| Hauptgruppe | Substrings im Datenbestand |
|---|---|
| Buddhismus | Theravāda, Pali-Buddhismus, Dzogchen, Zen |
| Christentum | Christliche Mystik, Orthodoxes Christentum |
| Islam | Sufismus, Islamische Mystik |
| Daoismus | Daoismus, Chinesische Innere Kultivierung, Esoterischer Daoismus |
| Judentum | Kabbala, Chassidismus, Jüdische Mystik |
| Hinduismus | Advaita Vedānta |
| Säkulare und wissenschaftliche Kontexte | Säkulare Achtsamkeit, Klinische Psychologie, Psychedelika-Forschung |

Die Aggregations-Logik trägt pro Hauptgruppe das `dominant_maturity` (höchster Reifegrad ihrer Konzepte), ein `has_gap`-Flag, die Konzept-IDs und die `subgroups[]`-Liste. Letztere wird in der Coverage-Karte als Untertext angezeigt, damit die Differenzierung sichtbar bleibt.

Iteration 2 kann Tradition als eigenständigen Knotentyp formalisieren (`data/traditions.json`), mit Branches als Unterstrukturen. Konzepte hängen dann über `tradition_ids[]` an Tradition-Knoten. Die aktuelle Aggregations-Logik bleibt als Fallback erhalten.

## Belegte Daten in Iteration 1

Elf Konzepte, davon sechs etabliert, zwei berührt, einer beginnend, zwei fehlend.

| Konzept | Reifegrad | Tradition | Aufnahmegrund | Studien |
|---|---|---|---|---|
| Jhāna | etabliert | Theravāda, Pali-Buddhismus | Chowdhury 2025, NeuroImage | Chowdhury 2025, Lutz 2004, Sparby/Sacchet 2024, plus Britton 2021 und Goldberg 2022 (konzeptübergreifend) |
| Nichtduales Gewahrsein | etabliert | Advaita Vedānta, Dzogchen, Zen | Josipovic 2012, Frontiers Hum Neurosci | Josipovic 2012, Ehmann 2025, Sparby/Sacchet 2022, Kuyken 2022 |
| Nirodha Samāpatti | etabliert | Theravāda | Bodhi 2011, Sparby/Sacchet 2024 | Sparby/Sacchet 2022 plus Nebenwirkungs-Studien |
| DMN-Suppression | etabliert | (rein empirisch) | Carhart-Harris/Friston 2019 | Carhart-Harris/Friston 2019 |
| Ich-Auflösung | etabliert | Psychedelika, Zen, christliche Mystik | Timmermann 2023, Carhart-Harris 2014 | Timmermann 2023, Carhart-Harris 2014, Irrmischer 2025 |
| MBSR | etabliert | Säkulare Achtsamkeit | Hoge 2023, JAMA Psychiatry | Hoge 2023, Britton 2021, Goldberg 2022 |
| Hesychasmus | beginnend | Orthodoxes Christentum | Rubinart 2017 (westkatholische Operationalisierung) plus Templeton WCT 30294 (laufend) | Rubinart 2017, Templeton-Watchlist |
| Sufi-Dhikr | berührt | Sufismus, Islamische Mystik | Saraei 2023, Religion Brain Behavior | Saraei 2023 |
| Qigong | berührt | Daoismus | Henz/Schöllhorn 2017, Frontiers in Psychology | Henz/Schöllhorn 2017 |
| Neidan-gap | fehlend | Esoterischer Daoismus | Kein peer-reviewter Beleg | — |
| Kabbalah-gap | fehlend | Kabbala, Chassidismus | Kein peer-reviewter Beleg | — |

## Related (im Vault)

- [[Wikidata]]
- [[Linked Open Data]]
- [[RDF]]
- [[Datenmodellierung]]
- [[Knowledge Graph]]
