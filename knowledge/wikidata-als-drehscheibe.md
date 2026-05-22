---
title: Wikidata als Drehscheibe
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
topics: ["[[Wikidata]]", "[[SPARQL]]", "[[Linked Open Data]]"]
related: [discovery-workflows, architecture, data]
---

# Wikidata als Drehscheibe

Wikidata ist in CONTEXT der sprachübergreifende Identifikator-Anker und gleichzeitig der Drehpunkt für Discovery. Pro Werk- oder Konzept-QID lassen sich über SPARQL die externen Identifier auslesen, die in fachspezifischen Repositorien und Aggregatoren genutzt werden. Damit wird aus einer einzigen QID ein Fan-out zu zwanzig oder mehr Plattformen.

## Methodische Position

CONTEXT speichert nur die QID, nicht alle externen Identifier. Das ist eine bewusste Entscheidung: Externe Identifier ändern sich, neue kommen hinzu, alte verschwinden. Wikidata pflegt diese Verweise zentral. Wer eine externe ID braucht, fragt Wikidata zur Snapshot-Zeit ab und persistiert das Ergebnis als datierten Snapshot in `data/wikidata-snapshots/`.

Daraus folgt: Jeder Discovery-Lauf beginnt bei Wikidata. Wikidata ist die einzige Quelle, die nicht durch Discovery erschlossen werden muss, sondern Discovery erst ermöglicht.

## Property-Inventar für Fan-out

Wikidata kennt Hunderte externer-Identifier-Properties (https://www.wikidata.org/wiki/Wikidata:List_of_properties/identifier). Für CONTEXT besonders relevant:

| Property | Bedeutung | Beispiel |
|---|---|---|
| `wdt:P227` | GND-Identifier (Deutsche Nationalbibliothek) | Visuddhimagga: 4198840-3 |
| `wdt:P214` | VIAF-Identifier | universeller Authority-File |
| `wdt:P244` | LCCN (Library of Congress) | für US-Bibliotheksanker |
| `wdt:P5101` | Crossref-Funder-ID | für Institutionen |
| `wdt:P356` | DOI | für wissenschaftliche Werke |
| `wdt:P648` | Open Library ID | |
| `wdt:P724` | Internet Archive ID | für Faksimiles via archive.org |
| `wdt:P727` | Europeana-Entität | wichtig für europäische Mss. |
| `wdt:P953` | Volltext-URL | |
| `wdt:P973` | beschrieben in URL | |
| `wdt:P1006` | NTA-Identifier (Niederländische Bibliothek) | |
| `wdt:P1407` | ShareCite-Identifier | |
| `wdt:P1417` | Encyclopaedia Britannica ID | |
| `wdt:P3219` | Encyclopaedia Universalis | |
| `wdt:P3417` | Quora topic | |
| `wdt:P3553` | Zhihu topic | |
| `wdt:P4659` | Musée d'Orsay | |
| `wdt:P2671` | Google Knowledge Graph | |

Für die kontemplative Domäne besonders relevant:

| Property | Bedeutung |
|---|---|
| `wdt:P407` | Sprache des Werks |
| `wdt:P50` | Autor |
| `wdt:P571` | Entstehungszeit |
| `wdt:P136` | Genre |
| `wdt:P921` | Hauptthema (für Topic-Expansion) |
| `wdt:P31` | ist eine Instanz von (Klassifikation) |
| `wdt:P279` | Unterklasse von (Hierarchie) |

## Beispiel 1: Externe Identifier für ein Werk

Visuddhimagga hat QID Q200447. Welche externen Identifier hat das Werk?

```sparql
SELECT ?prop ?propLabel ?identifier WHERE {
  VALUES ?work { wd:Q200447 }
  ?work ?p ?identifier .
  ?prop wikibase:directClaim ?p ;
        wikibase:propertyType wikibase:ExternalId .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
ORDER BY ?propLabel
```

Output (Auszug): GND-Nummer, VIAF-ID, Open-Library-ID, mehrere Bibliothekskataloge. Genau das ist das Discovery-Gold: pro QID dreißig bis fünfzig externe Verweise, die jeweils zu einem konkreten Repositorium oder Katalog führen.

## Beispiel 2: Werke einer Tradition

Welche Werke mit Sprache Pali sind in Wikidata erfasst, mit Autor und Entstehungszeit?

```sparql
SELECT ?work ?workLabel ?author ?authorLabel ?inception WHERE {
  ?work wdt:P31/wdt:P279* wd:Q571 ;        # ist Buch
        wdt:P407 wd:Q36727 .              # Sprache Pali
  OPTIONAL { ?work wdt:P50 ?author . }
  OPTIONAL { ?work wdt:P571 ?inception . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
ORDER BY ?inception
LIMIT 100
```

Damit lässt sich pro Tradition eine Discovery-Saat erzeugen: Liste aller Werke einer Sprache mit Anker zu Autor, Entstehungszeit, externen Identifiern.

## Beispiel 3: Topic-Expansion für ein Konzept

Welche Konzepte sind als verwandt mit "Nondualism" (Q2505322) markiert oder als seine Instanzen?

```sparql
SELECT ?related ?relatedLabel WHERE {
  {
    ?related wdt:P279 wd:Q2505322 .          # ist Unterklasse von
  } UNION {
    ?related wdt:P31 wd:Q2505322 .           # ist Instanz von
  } UNION {
    ?related wdt:P921 wd:Q2505322 .          # Hauptthema ist Nondualism
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 100
```

Damit kann ein Konzept im Bestand seine semantische Nachbarschaft in Wikidata aufdecken. Das ist die Grundlage für die `harvest.py`-Topic-Expansion aus der Roadmap.

## Beispiel 4: Europeana-Verfügbarkeit pro QID

Hat ein Werk eine Europeana-Entität (Property P727)?

```sparql
SELECT ?work ?workLabel ?europeanaId WHERE {
  VALUES ?work { wd:Q200447 wd:Q544764 wd:Q780145 wd:Q929140 wd:Q3100748 }
  OPTIONAL { ?work wdt:P727 ?europeanaId . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
```

Output zeigt, welche der CONTEXT-Werke direkt in Europeana auffindbar sind. Wer einen Europeana-ID hat, kann darüber Faksimiles und Manifest abrufen. Das ist der konkrete Fan-out für die Faksimile-Klasse.

## Anbindung an das CONTEXT-Schema

Discovery-Output über Wikidata-Drehscheibe wird in `data/discovery-snapshots/YYYY-MM-DD-fanout.json` persistiert. Schema-Skizze:

```json
{
  "snapshot_date": "2026-05-22",
  "qid_pool": ["Q200447", "Q544764", "Q780145"],
  "records": [
    {
      "qid": "Q200447",
      "label": "Visuddhimagga",
      "external_ids": {
        "P227": "4198840-3",
        "P214": "183148956",
        "P724": "visuddhimagga00bhad",
        "P727": null
      },
      "language_links": {
        "dewiki": "https://de.wikipedia.org/wiki/...",
        "enwiki": "https://en.wikipedia.org/wiki/..."
      }
    }
  ]
}
```

Pro QID-Eintrag eine Tabelle externer Identifier. Damit wird `tools/discovery.py` keine eigenen Repos crawlen müssen, sondern kann die Identifier aus Wikidata in spezialisierte Lookup-Pfade einspeisen.

## Hygiene-Regeln

1. **SPARQL-Query versioniert ablegen** in `data/queries/fanout.rq`, mit Kommentar und erwartetem Output-Schema.
2. **Snapshot datieren** und in `manifest.json` registrieren, analog zu den bestehenden Wikidata-Snapshots.
3. **Keine fehlenden Properties stillschweigend ignorieren**. Wenn P727 (Europeana) für eine QID `null` ist, wird das explizit im Output dokumentiert. Andere Discovery-Pfade können daraus Lücken-Befunde ableiten.
4. **Keine Live-Endpunkte zur Browser-Laufzeit** (siehe Architektur-Position). Snapshots sind die Wahrheit zum Snapshot-Zeitpunkt.

## Wikidata-Endpunkte

| Zweck | URL |
|---|---|
| SPARQL-Query-Service | https://query.wikidata.org/sparql |
| Entity-Lookup | https://www.wikidata.org/wiki/Special:EntityData/Q200447.json |
| Search API | https://www.wikidata.org/w/api.php?action=wbsearchentities |

Alle drei werden bereits in `tools/wikidata-snapshot.py` und `tools/validate-data.py --wikidata` benutzt.

## Related (im Vault)

- [[Wikidata]]
- [[SPARQL]]
- [[Linked Open Data]]
- [[Wikidata Query Service]]
