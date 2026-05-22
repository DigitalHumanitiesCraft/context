---
title: Konzept-Inventar
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
topics: ["[[Wikidata]]"]
related: [data, tradition-hauptgruppen]
---

# Konzept-Inventar

Kompakte Übersicht aller elf Konzepte im Bestand (Stand 2026-05-22). Tabellarisch organisiert für Lookup, nicht für Lektüre. Ausführliche Beschreibungen liegen in `data/concepts.json` und in der UI unter `#konzept/<id>` bzw. `#gap/<id>`.

## Übersicht nach Reifegrad

| ID | Original | Translit | Reifegrad | Wikidata | Hauptgruppe | Studien |
|---|---|---|---|---|---|---|
| `jhana` | झान, ඣාන | Jhāna, Dhyāna | etabliert | [Q6577829](https://www.wikidata.org/wiki/Q6577829) | Buddhismus | 6 |
| `nichtduales-gewahrsein` | अद्वैत, རིག་པ | Advaita, Rigpa | etabliert | [Q2505322](https://www.wikidata.org/wiki/Q2505322) | Buddhismus, Hinduismus | 6 |
| `nirodha-samapatti` | निरोधसमापत्ति | Nirodha Samāpatti | etabliert | [Q17039003](https://www.wikidata.org/wiki/Q17039003) | Buddhismus | 4 |
| `dmn-suppression` | — | Default Mode Network Suppression | etabliert | [Q1182555](https://www.wikidata.org/wiki/Q1182555) | (rein empirisch) | 1 |
| `ich-aufloesung` | — | Ego Death, Self-Dissolution | etabliert | [Q5348168](https://www.wikidata.org/wiki/Q5348168) | Säkulare/Wissenschaftliche, Buddhismus, Christentum | 5 |
| `mbsr` | — | Mindfulness-Based Stress Reduction | etabliert | [Q341036](https://www.wikidata.org/wiki/Q341036) | Säkulare/Wissenschaftliche | 3 |
| `sufi-dhikr` | ذِكْر | Dhikr | berührt | [Q948437](https://www.wikidata.org/wiki/Q948437) | Islam | 1 |
| `qigong` | 氣功 | Qìgōng | berührt | [Q204368](https://www.wikidata.org/wiki/Q204368) | Daoismus | 1 |
| `hesychasm` | Ἡσυχασμός | Hēsychasmos | beginnend | [Q629589](https://www.wikidata.org/wiki/Q629589) | Christentum | 2 |
| `neidan-gap` | 內丹 | Nèidān | fehlend | — | Daoismus | 0 |
| `kabbalah-gap` | התבודדות, התבוננות | Hitbodedut, Hitbonenut | fehlend | — | Judentum | 0 |

## Aufnahmegründe (primäre Sekundärliteratur)

| Konzept | Aufnahmegrund (citation) | DOI |
|---|---|---|
| jhana | Chowdhury 2025, NeuroImage | [10.1016/j.neuroimage.2024.120973](https://doi.org/10.1016/j.neuroimage.2024.120973) |
| nichtduales-gewahrsein | Josipovic 2012, Frontiers Hum Neurosci | [10.3389/fnhum.2011.00183](https://doi.org/10.3389/fnhum.2011.00183) |
| nirodha-samapatti | Bodhi 2011, Sparby/Sacchet 2024 | [10.1007/s12671-024-02367-w](https://doi.org/10.1007/s12671-024-02367-w) |
| dmn-suppression | Carhart-Harris/Friston 2019 | [10.1124/pr.118.017160](https://doi.org/10.1124/pr.118.017160) |
| ich-aufloesung | Timmermann 2023, Carhart-Harris 2014 | [10.1016/j.tics.2022.11.006](https://doi.org/10.1016/j.tics.2022.11.006) |
| mbsr | Hoge 2023, JAMA Psychiatry | [10.1001/jamapsychiatry.2022.3679](https://doi.org/10.1001/jamapsychiatry.2022.3679) |
| sufi-dhikr | Saraei 2023, Religion Brain Behavior | [10.1080/2153599X.2022.2108888](https://doi.org/10.1080/2153599X.2022.2108888) |
| qigong | Henz/Schöllhorn 2017, Frontiers in Psychology | [10.3389/fpsyg.2017.00154](https://doi.org/10.3389/fpsyg.2017.00154) |
| hesychasm | Rubinart 2017, Pastoral Psychology | [10.1007/s11089-017-0762-4](https://doi.org/10.1007/s11089-017-0762-4) |
| neidan-gap | (kuratierte Begründung der empirischen Unsichtbarkeit) | — |
| kabbalah-gap | (kuratierte Begründung der empirischen Unsichtbarkeit) | — |

## Konzept-zu-Konzept-Beziehungen

Beziehungstypen: `vertieft-zu`, `vertieft-aus`, `verwandt-mit`, `korreliert-mit`, `operationalisiert`, `operationalisiert-durch`. Vollständige Kanten in `data/concepts.json` unter `related_concepts[]`.

Auswahl wichtiger Beziehungen:

- jhana `vertieft-zu` nirodha-samapatti (in der theravadischen Stufenpraxis ist Nirodha Samāpatti die Vertiefung über Jhāna hinaus).
- jhana `verwandt-mit` nichtduales-gewahrsein (über die Sparby-Sacchet-Klassifikation als advanced meditation).
- dmn-suppression `operationalisiert` nichtduales-gewahrsein, ich-aufloesung (DMN als neuronales Korrelat dieser Zustände).
- ich-aufloesung `verwandt-mit` nichtduales-gewahrsein (selbsttranszendente Zustände).

## Asymmetrie auf einen Blick

Sechs Konzepte etabliert, zwei berührt, einer beginnend, zwei fehlend. Die Asymmetrie ist nicht zufällig: die etablierten konzentrieren sich in buddhistischen und säkular-wissenschaftlichen Traditionen (Pali/Theravada, Zen, Advaita, Säkulare Achtsamkeit, Psychedelika). Die fehlenden liegen in jüdischer Mystik und daoistischer Innerer Alchemie. Berührte Konzepte (Sufismus, Qigong) sind je durch genau eine Studie belegt und damit fragil. Hesychasm steht "beginnend" durch eine westkatholische Operationalisierung (Rubinart 2017) plus eine laufende RCT (Templeton WCT 30294).

## Methodische Note

Das Inventar ist kein Korpus-Anspruch. Aufnahmekriterium ist seriöse wissenschaftliche Sekundärliteratur, die die Verbindung herstellt. Gap-Knoten sind Erstklass-Einträge: sie werden ohne empirischen Aufnahmegrund geführt, aber mit kuratierter Begründung der Unsichtbarkeit. Das macht aus einer fehlenden Studie einen ausgewiesenen Befund.

## Related (im Vault)

- [[Datengrundlage CONTEXT|data.md]]
- [[Tradition-Hauptgruppen|tradition-hauptgruppen.md]]
- [[Hygiene-Regeln|hygiene-regeln.md]]
