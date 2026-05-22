---
title: Tradition-Hauptgruppen
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
topics: ["[[Klassifikation]]"]
related: [data, konzept-inventar, discovery-workflows]
---

# Tradition-Hauptgruppen

Im Bestand stehen 18 feine Tradition-Strings, die ab Iteration 1.1 zu sieben kuratierten Hauptgruppen aggregiert werden. Diese Hauptgruppen ordnen die Coverage-Karte und führen pro Gruppe einen Discovery-Workflow. Dieses Dokument beschreibt die Zuordnung, die Begründung und den aktuellen Discovery-Status pro Gruppe.

## Mapping-Tabelle

Quelle: `assets/data-loader.js` Konstante `TRADITION_HAUPTGRUPPEN`.

| Hauptgruppe | Substrings im Datenbestand | Konzepte |
|---|---|---|
| Buddhismus | Theravāda, Pali-Buddhismus, Dzogchen, Zen | jhana, nirodha-samapatti, nichtduales-gewahrsein, ich-aufloesung |
| Christentum | Christliche Mystik, Orthodoxes Christentum | hesychasm, ich-aufloesung |
| Islam | Sufismus, Islamische Mystik | sufi-dhikr |
| Daoismus | Daoismus, Chinesische Innere Kultivierung, Esoterischer Daoismus | qigong, neidan-gap |
| Judentum | Kabbala, Chassidismus, Jüdische Mystik | kabbalah-gap |
| Hinduismus | Advaita Vedānta | nichtduales-gewahrsein |
| Säkulare und wissenschaftliche Kontexte | Säkulare Achtsamkeit, Klinische Psychologie, Psychedelika-Forschung | mbsr, ich-aufloesung |

Einige Konzepte hängen an mehreren Hauptgruppen, weil sie traditionsübergreifend operationalisiert werden (z.B. nichtduales-gewahrsein in Buddhismus und Hinduismus über Dzogchen/Zen einerseits und Advaita Vedānta andererseits). Das Aggregat dedupliziert über `Set<concept_id>`.

## Reifegrad pro Hauptgruppe (Stand 2026-05-22)

`dominant_maturity` ist der höchste Reifegrad innerhalb einer Gruppe. `has_gap` markiert, ob mindestens ein Gap-Knoten enthalten ist.

| Hauptgruppe | dominant_maturity | has_gap | Konzept-Anzahl |
|---|---|---|---|
| Buddhismus | etabliert | nein | 4 |
| Christentum | etabliert | nein | 2 |
| Hinduismus | etabliert | nein | 1 |
| Säkulare und wissenschaftliche Kontexte | etabliert | nein | 2 |
| Daoismus | berührt | ja | 2 |
| Islam | berührt | nein | 1 |
| Judentum | fehlend | ja | 1 |

Die Coverage-Karte sortiert nach dieser Hierarchie etabliert > berührt > beginnend > fehlend.

## Methodische Begründung pro Gruppe

**Buddhismus.** Vier Subgruppen, weil die buddhistische Tradition empirisch und philologisch am differenziertesten erforscht ist. Theravāda und Pali-Buddhismus werden in der Sekundärliteratur unterschiedlich verwendet (sprach- vs. schulbezogen), bleiben aber beide eigenständige Substrings. Dzogchen und Zen markieren die Mahayana/Vajrayana-Erweiterung.

**Christentum.** Zwei Subgruppen für die orthodoxe Linie (Hesychasm) und die breitere christliche Mystik (die ich-aufloesung über Eckhart, Johannes vom Kreuz mitträgt).

**Islam.** Sufismus und Islamische Mystik sind funktionale Synonyme, im Bestand getrennt geführt, weil unterschiedliche Sekundärliteratur sie unterschiedlich benennt.

**Daoismus.** Drei Subgruppen: Daoismus als breite Tradition, Chinesische Innere Kultivierung als Praxisrahmen (umfasst Qigong, Taijiquan, Neidan), Esoterischer Daoismus als engerer Begriff für die Innere Alchemie. Das Verhältnis ist: Esoterischer Daoismus ⊂ Chinesische Innere Kultivierung ⊂ Daoismus. Die feine Differenzierung bleibt erhalten, weil Neidan-Forschung anders verläuft als Qigong-Forschung.

**Judentum.** Kabbala, Chassidismus und Jüdische Mystik gehen alle in den `kabbalah-gap`-Knoten ein. Drei Substrings, weil die Gap-Begründung verschiedene Traditionsschichten betrifft: lurianische Kabbala (16. Jh.), chassidische Praxis (18. Jh. ff.), Hitbodedut/Hitbonenut als kontemplative Techniken.

**Hinduismus.** Aktuell nur Advaita Vedānta. Eine Erweiterung auf Yoga (Patanjali), Bhakti, Tantra wäre denkbar, ist aber nicht im Bestand. Discovery-Pfad sinnvoll: GRETIL plus DSAL.

**Säkulare und wissenschaftliche Kontexte.** Drei Subgruppen, weil säkulare Achtsamkeit (MBSR, MBCT), klinische Psychologie (Anwendungsfeld) und Psychedelika-Forschung methodisch verschiedene Diskurse sind. Sie werden zusammengefasst, weil sie alle auf moderner empirischer Wissenschaft basieren, nicht auf einer Texttradition.

## Discovery-Status pro Hauptgruppe

Ausführlich in [[Discovery-Workflows|discovery-workflows.md]].

| Hauptgruppe | Volltext-Repos im Bestand | Faksimile-Pfad geplant | Discovery-Priorität |
|---|---|---|---|
| Buddhismus | GRETIL, CBETA, SuttaCentral, BDRC, Access to Insight, Stanford Sōtō | Wikimedia Commons, BL Digitised Mss. | niedrig (gut versorgt) |
| Christentum | TLG | Vatican DigiVatLib, BnF Gallica, Bibliotheca Augustana | mittel |
| Islam | — | OpenITI, BnF Manuscripts orientaux | hoch (Lücke) |
| Daoismus | — | ctext.org als Volltext-Quelle, Wikimedia | hoch (Lücke + Gap) |
| Judentum | — | Sefaria.org als Volltext-Quelle, NLI Ktiv | sehr hoch (Gap + Lücke) |
| Hinduismus | GRETIL | DSAL, BL Digitised Mss. | mittel |
| Säkulare und wissenschaftliche Kontexte | (PubMed über Studien) | Crossref/OpenAlex/Unpaywall | laufende Discovery via `scholarly-harvest.py` |

## Was bei der Aggregation passiert

Pro Konzept werden die Substrings durch das Mapping zu einer Hauptgruppe umgesetzt. Wenn ein Konzept zwei Substrings derselben Gruppe trägt (z.B. jhana mit Theravāda und Pali-Buddhismus), erscheint die Hauptgruppe nur einmal pro Konzept. Wenn ein Konzept Substrings aus verschiedenen Gruppen trägt (z.B. nichtduales-gewahrsein mit Zen und Advaita Vedānta), erscheint es in beiden Hauptgruppen.

In der UI sichtbar:

- Coverage-Karte: Hauptgruppe als primärer Eintrag, Subgroup-Strings als Untertext.
- Tradition-Detailseite: Hauptgruppe als Header, Subgroups in der Page-Meta-Sektion, Konzepte als Cards.

## Erweiterung

Iteration 2 kann das Mapping als eigenständigen Knotentyp formalisieren (`data/traditions.json`), mit Hauptgruppe und Subgroups als Knoten plus Hierarchie über `parent_id`. Das aktuelle Mapping in `data-loader.js` bleibt dann als Fallback. Neue Substrings (z.B. wenn weitere Konzepte aufgenommen werden) werden zuerst hier dokumentiert, dann ins Mapping eingetragen.

## Related (im Vault)

- [[Datengrundlage CONTEXT|data.md]]
- [[Konzept-Inventar|konzept-inventar.md]]
- [[Discovery-Workflows|discovery-workflows.md]]
