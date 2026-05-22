---
title: Discovery-Workflows
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Wissensdokument
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/knowledge
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-knowledge
status: draft
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
human-reviewed: false
author: claude-code-worker
topics: ["[[Linked Open Data]]", "[[Wikidata]]", "[[Resource Discovery]]"]
related: [data, architecture, wikidata-als-drehscheibe]
---

# Discovery-Workflows

Methodisches Dokument für die Suche nach relevanten Quellen pro Tradition. CONTEXT soll nicht nur kuratierte Anker zeigen, sondern als Resource-Discovery-Werkzeug die föderierte LOD-Landschaft erschließen. Dieses Dokument beschreibt die Methodik, das Werkzeug `tools/discovery.py` als geplantes viertes Skript und die Workflow-Skelette pro Hauptgruppe.

## Drei Repositorien-Klassen

Resource Discovery in CONTEXT unterscheidet drei Klassen, die im Datenmodell über `representations[].type` abgebildet werden.

### 1. Volltext-Fachrepos

Analysierbarer Volltext einer Tradition, oft TEI-XML oder strukturierte Plaintexte. Im Schema mit `type: edition`. Beispiele im aktuellen Bestand:

| Repositorium | Tradition | Schnittstelle |
|---|---|---|
| GRETIL | Sanskrit, Pali (Buddhismus, Hinduismus) | OAI-PMH, HTML-Volltexte |
| CBETA | Chinesischer Buddhismus | REST-API, TEI-XML |
| SuttaCentral | Pali-Kanon mehrsprachig | REST-API, GitHub |
| BDRC | Tibetisch | REST-API, IIIF |
| TLG | Griechisch | Login-API |
| Access to Insight | Theravada-Translations | HTML |
| Stanford Sōtō | Zen | HTML |

Diese Klasse trägt die analytische Hauptarbeit, weil sie analysierbaren Volltext liefert.

### 2. Faksimile-Aggregatoren

Bildmaterial historischer Quellen, oft IIIF-Manifeste. Im Schema mit `type: facsimile`. Im aktuellen Bestand noch nicht erfasst, weil die Iteration 1 sich auf Volltext konzentriert hat. Wikidata-QID dient als Brücke: Pro Werk-QID lassen sich Faksimiles in Aggregatoren auflisten.

Kandidaten:

| Aggregator | Stärke | Schnittstelle |
|---|---|---|
| Europeana | Europäische Mystik, christlich-monastische Tradition, jüdisch-mystische Mss. in europäischen Bibliotheken | REST + SPARQL |
| Deutsche Digitale Bibliothek | Deutschsprachige Klosterbestände | REST |
| BnF / Gallica | Französische, arabische, hebräische, lateinische Mss. | REST + IIIF |
| Vatican DigiVatLib | Christlich-byzantinische Mss. | IIIF + REST |
| British Library Digitised Mss. | Sehr breit, inkl. orientalisch | IIIF |
| National Library of Israel (Ktiv) | Hebräische und aramäische Mss., wichtig für Kabbala-Gap | REST + OAI-PMH |
| Kulturpool | Österreichische Kulturerbe-Daten | REST |
| Wikimedia Commons | Genereller Bild-Anker | REST + SPARQL |

Methodische Grenze: Faksimiles sind nicht analysierbarer Volltext. Sie ergänzen die Editionsschicht als Belegmaterial, ersetzen sie nicht. Das war von Anfang an im Datenmodell vorgesehen ([[Datengrundlage CONTEXT|data.md]] Sektion "Belegtrennung").

### 3. Ikonografie und Museumsobjekte

Materielle Zeugnisse einer Praxis: Skulpturen, Ritualgegenstände, kalligrafische Werke. Im aktuellen Schema nicht modelliert. Iteration 3 oder später, wenn überhaupt.

Kandidaten:

- Met Museum Open Access API
- British Museum Collection Online
- Smithsonian Open Access
- Wikidata über `depicts`-Statements

## Workflow-Methodik

Drei Schritte pro Discovery-Lauf:

### Schritt 1: Wikidata-QID als Eintrittspunkt

Pro Konzept oder Werk mit verifizierter QID läuft eine SPARQL-Abfrage auf Wikidata, die alle externen Identifier ausgibt. Details und Beispiel-Snippet in [[Wikidata als Drehscheibe|wikidata-als-drehscheibe.md]].

### Schritt 2: Fan-out zu Klassen

Pro externer Identifier-Klasse läuft eine spezialisierte Abfrage:

- **Volltext-Discovery**: API der Fachrepos abfragen. Pro Repo eigene Suchstrategie (Volltextsuche, Klassifikations-Browse, Topic-Tags).
- **Faksimile-Discovery**: Aggregator-API mit QID oder Titel-Suche. Output ist eine Kandidatenliste von Faksimile-Repräsentationen.
- **Ikonografie-Discovery**: später.

### Schritt 3: Kuratorischer Filter

Output jeder Discovery-Pipeline ist ein datierter Kandidaten-Snapshot in JSON. Pro Kandidat: Quelle, Identifier, Vorschau, Vertrauenswert. Kuratorische Prüfung übernimmt den Kandidaten ins kuratierte Datenset oder verwirft ihn mit Begründung. Re-Discovery überschreibt keine kuratierten Felder, das ist dieselbe Regel wie bei `scholarly-harvest.py`.

## Tool-Skizze: `tools/discovery.py`

Geplantes viertes kuratorisches Skript, analog zu den drei bestehenden. CLI-Skizze:

```
python tools/discovery.py --tradition buddhismus
python tools/discovery.py --concept jhana --class volltext
python tools/discovery.py --work visuddhimagga --class faksimile
python tools/discovery.py --all --offline   # für CI-Tests
```

Output: `data/discovery-snapshots/YYYY-MM-DD-<scope>.json` mit Kandidatenliste, Manifest pro Lauf, Vertrauensbewertung pro Kandidat.

Voraussetzungen vor Implementierung:

1. Pro Tradition mindestens einen Volltext-Workflow konkret ausarbeiten (Schritt-für-Schritt).
2. Wikidata-Drehscheibe-Snippet aus [[Wikidata als Drehscheibe|wikidata-als-drehscheibe.md]] verifizieren.
3. Mindestens ein Aggregator-Beispiel (vorgeschlagen: Sefaria für Judentum, weil dort der größte Mehrwert).

## Workflow-Skelette pro Hauptgruppe

Jede Hauptgruppe bekommt einen knappen Workflow-Eintrag. Ausführliche Pro-Tradition-Dokumente folgen in Iteration 2.

### Buddhismus

Bestand bereits gut. Volltext über GRETIL (Sanskrit), CBETA (Chinesisch), SuttaCentral (Pali), BDRC (Tibetisch), Access to Insight (Übersetzungen), Stanford Sōtō (Zen). Discovery-Fokus: Sekundärliteratur, die neue Werke benennt, anstelle neuer Repos.

Beispiel-Saat: Visuddhimagga Q200447 → CBETA-Suche, GRETIL-Suche, BDRC-Faksimile.

### Christentum

Volltext: TLG (Griechisch byzantinisch). Faksimile-Lücke: Vatican DigiVatLib, BnF Gallica, Bibliotheca Augustana. Discovery-Fokus: Philokalia-Handschriften, Werke der Wüstenväter, mystische Theologie (Dionysius, Eckhart, Johannes vom Kreuz).

Beispiel-Saat: Philokalia Q929140 → Vatican-Suche, BnF-Gallica-Suche.

### Islam

Volltext-Lücke. Kandidat: OpenITI (https://openiti.org), eine Forschungsinitiative für offene islamische Texte, Daten als GitHub-Repos. Plus Brockhaus-OnlineDictionary für Bibliografie. Faksimile: BnF Manuscripts orientaux, Princeton Digital Manuscripts.

Beispiel-Saat: Risāla al-Qushayrī (sufi-dhikr-Anker) → OpenITI, BnF.

### Daoismus

Volltext-Lücke. Kandidat: ctext.org (Chinese Text Project) mit REST-API, sehr starkes Repository für klassische chinesische Texte. Daodejing, Zhuangzi, Huainanzi liegen dort als TEI. Faksimile: Wikimedia Commons für Schriftrollen.

Beispiel-Saat: Wuzhen pian (Neidan-Klassiker) → ctext.org-Suche.

### Judentum

Volltext-Lücke, mit großem Discovery-Wert weil aktuell Gap-Knoten. Kandidat: Sefaria.org mit REST-API und vollständigem Kategorie-Index. Liefert Zohar, Sefer Yetzirah, Hassidische Texte. Faksimile: National Library of Israel Ktiv-Plattform.

Beispiel-Saat: Zohar (kabbalah-gap-Anker) → Sefaria-API, NLI-Ktiv.

### Hinduismus

Volltext: GRETIL deckt Sanskrit-Tradition gut ab. Erweiterung: DSAL (Digital South Asia Library), Sanskrit Heritage. Faksimile: bislang keine direkte Quelle, BL Digitised Mss. teilweise.

Beispiel-Saat: Aṣṭāvakra Gītā Q780145 → GRETIL, DSAL.

### Säkulare und wissenschaftliche Kontexte

Anders gelagert. Hier ist `scholarly-harvest.py` der Discovery-Pfad, nicht Volltext-Repos. Crossref, OpenAlex, PubMed liefern Studien. Discovery zielt auf neue Studien zu bekannten Konzepten plus Watchlist-Updates.

## Was bewusst nicht im Discovery-Scope

- **Generative-Text-APIs als Suchhilfe**. Kandidaten müssen aus belegbaren Quellen kommen, nicht aus Modell-Konfabulationen.
- **Lizenz-unsichere Quellen**. Nur Repositorien mit klarer Lizenz oder offener Sekundärliteratur.
- **Forenbeiträge, Wikis ohne Sekundärquellen**. Wikidata gilt als Identifier-Drehscheibe, nicht als Aussagequelle.

## Iteration 2 — konkrete Schritte

1. Pro Tradition ein eigenes Workflow-Dokument (`knowledge/discovery-<tradition>.md`) mit Schritt-für-Schritt, Beispielabfragen, Output-Schema.
2. `tools/discovery.py` als Skelett, beginnend mit dem Sefaria-Pfad (höchster Showcase-Wert).
3. Schema-Erweiterung: `representations[].type` um `iconography` ergänzen, wenn Museum-Quellen aufgenommen werden.
4. Discovery-Snapshot-Manifeste analog zu Wikidata-/Scholarly-Manifesten.

## Iteration-2-Pilot-Bestand (2026-05-22)

Sieben Subkorpora live oder partial gepullt. Schema in [[Datengrundlage CONTEXT|data.md]] Sektion "7. Subkorpus (Iteration 2)", Daten in [`../data/subkorpora.json`](../data/subkorpora.json) und [`../data/discovery-snapshots/`](../data/discovery-snapshots/).

| ID | API | Status | Volumen | Anker-Records |
|---|---|---|---|---|
| `openalex-meditation-broad` | OpenAlex /works | live | 13.522 OA-Treffer | (Bulk-Snapshot pending) |
| `openalex-egodissolution-jhana` | OpenAlex /works | live | 2.324 OA-Treffer seit 2018 | Mason 2020, Smith 2020, Stoliker 2022 |
| `openalex-qigong-sufi-hesychasm` | OpenAlex /works | live | 96.241 OA-Treffer | Jahnke 2010, Zou 2017, Yeung 2018, Jones 2001 |
| `pubmed-meditation-neural` | PubMed E-utilities | live | 1.396 Treffer | Cahn 2006, Lenze 2022, Brown 2009, Basso 2018, Ni 2024 |
| `sefaria-kabbalah` | Sefaria | live-partial | ~900 Passagen im Zohar | Zohar (Aramäisch, 11.-14. Jh., 1558 Mantua) |
| `openiti-arabic-corpus` | OpenITI GitHub | live-metadata | 11.195 Buchtitel, 2843 Autoren, 2.25 Mrd. Wörter | (Genre-Filter pending) |
| `ctext-daoist-classics` | ctext.org | partial | ~26 Mio. Zeichen | (API-Syntax pending) |
| `cbeta-mahayana-meditation` | CBETA | failed | geschätzt 2920 Gesamttexte | (Host nicht erreichbar) |
| `gretil-pali-sanskrit` | GRETIL OAI-PMH | todo | geschätzt 2000 | (OAI-Endpunkt zu verifizieren) |
| `wikidata-tradition-works` | Wikidata SPARQL | partial | Topic-basiert unergiebig | (Strategie über Autor-QIDs nötig) |

**Befund aus dem Pilot**: Open-Access-Studien-APIs (OpenAlex, PubMed) liefern leicht Hunderttausende Treffer und sind technisch unkompliziert. Volltext-Fachrepos für Asiatische und Vorder-asiatische Traditionen brauchen mehr kuratorische Vorarbeit, weil die API-Konventionen weniger standardisiert sind. Das spiegelt sich in der Reifegrad-Asymmetrie: was schwer empirisch beforscht wurde, ist auch schwer maschinell zu discovern.

## Tool-Status `tools/discovery.py`

Pluggable Adapter pro Subkorpus, datierter Snapshot-Output. CLI:

```
python tools/discovery.py --list                    # alle Subkorpora auflisten
python tools/discovery.py --subkorpus <id>          # einzelnen Subkorpus pullen
python tools/discovery.py --all                     # alle live-fähigen pullen
python tools/discovery.py --all --dry-run           # nur planen, nichts schreiben
```

Aktuell implementiert: OpenAlex (4 Subkorpora), PubMed, Sefaria (Zohar-Anker), OpenITI (Stats). Skelette mit `NotImplementedError`: ctext, CBETA, GRETIL, Wikidata-Bulk. Pluggable über `ADAPTERS`-Dict in `tools/discovery.py`.

## Related (im Vault)

- [[Wikidata]]
- [[Linked Open Data]]
- [[Resource Discovery]]
- [[SPARQL]]
