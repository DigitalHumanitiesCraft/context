---
title: User Stories CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage User Stories
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/user-stories
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-user-stories
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Scholar-Centered Design]]", "[[User Stories]]"]
related: [specification, design]
---

# User Stories CONTEXT

Vier Forschungsrollen, an denen sich der Single-Page-Explorer misst. Die Stories sind keine Personas, sondern operationale Anwendungsszenarien.

## Rolle 1: Religionswissenschaftlerin sucht historische Quellen zu einem Phänomen

**Kontext.** Eine Religionswissenschaftlerin schreibt einen Aufsatz über kontemplative Zustände im frühen Theravāda-Buddhismus. Sie kennt den Begriff *Jhāna* und sucht primäre Textstellen plus einen Eindruck, ob und wie diese Zustände empirisch untersucht werden.

**Pfad.** Sie öffnet die Startseite und sieht die Coverage-Karte: Buddhismus ganz oben mit Reifegrad `etabliert`, Anker Ehmann 2025 plus Lindahl 2017 als Beschreibung. Klick auf den Buddhismus-Eintrag öffnet die Tradition-Seite mit allen sechs zugehörigen Konzepten (Jhāna, Nichtduales Gewahrsein, Nirodha Samāpatti, plus durch related_concepts erreichbare DMN-Suppression und Ich-Auflösung). Klick auf Jhāna öffnet die Konzept-Seite: links Visuddhimagga und Aṅguttara Nikāya mit Verweis auf SuttaCentral, rechts Chowdhury 2025, Lutz 2004, Sparby/Sacchet 2024 plus die konzeptübergreifenden Britton 2021 und Goldberg 2022. Sie klickt auf Chowdhury 2025, sieht in der Studien-Detailseite den DOI als klickbaren Resolver-Link, kopiert ihn in die Literaturverwaltung.

**Erfolgskriterium.** Sie hat in unter fünf Klicks gefunden, was sie in zwei getrennten Datenbanken (eine philologisch, eine biomedizinisch) hätte suchen müssen — ohne Page-Reload. Die Coverage-Karte hat ihr zusätzlich gezeigt, dass die Asymmetrie der Erforschbarkeit selbst Forschungsgegenstand ist.

## Rolle 2: Bewusstseinsforscher sucht historische Vorläufer einer Studie

**Kontext.** Ein Bewusstseinsforscher arbeitet an einem Paper über die Suppression des Default Mode Networks während fortgeschrittener Meditation. Er weiß, dass kontemplative Traditionen Zustände der Selbstauflösung beschreiben, aber kennt die Quelltexte nicht. Er sucht historische Begriffe für das Phänomen.

**Pfad.** Er öffnet die Startseite und nutzt das globale Suchfeld mit Stichwort "DMN" oder "Default Mode Network". Treffer: das Konzept DMN-Suppression. Klick öffnet die Konzept-Seite. Die Quellseite ist nicht leer — die Konzept-zu-Konzept-Kanten zeigen "operationalisiert: nichtduales-gewahrsein, ich-aufloesung" als typisierte Beziehung. Er klickt auf Ich-Auflösung: Aṣṭāvakra Gītā, Genjōkōan in der Quellspalte, Timmermann 2023, Carhart-Harris 2014, Irrmischer 2025 rechts. Er klickt auf die Knotenpunkt-Referenz Carhart-Harris 2014 (Entropic Brain) und sieht drei dokumentierte Folgepapers (Carhart-Harris 2018, REBUS 2019, Girn 2022) als Lesepfad.

**Erfolgskriterium.** Er hat einen historischen Anker für seine Studie, der durch wissenschaftliche Sekundärliteratur belegt ist und nicht aus der esoterischen Grauzone stammt. Er hat zusätzlich den theoretischen Stammbaum seines eigenen Forschungsstrangs visualisiert.

## Rolle 3: Lehrende für Digital Humanities sucht Vergleichsbeispiel für LOD-Föderation

**Kontext.** Eine DH-Lehrende bereitet eine Sitzung über Linked Open Data vor und sucht ein Beispiel für föderierte Aggregation über Wikidata-QIDs. Sie sucht ein Projekt, das die LOD-Logik nicht nur behauptet, sondern in einer schmalen, lesbaren Implementierung zeigt.

**Pfad.** Auf der Startseite sieht sie das Provenienz-Badge "Snapshot 2026-05-22" im Header — das macht sofort klar, dass diese Site auf datierte Snapshots zurückgreift, nicht auf Live-Calls. Sie klickt durch zu einem beliebigen Konzept, sieht in der Detail-Pane den Wikidata-QID als Monospace-Link zu wikidata.org. Sie öffnet die Studien-Detailseite und sieht die saubere Trennung in zwei Feldgruppen: oben "geerntet aus Crossref/Unpaywall/OpenAlex (Snapshot 2026-05-22)", unten "kuratiert". Sie inspiziert über die Browser-Devtools die JSON-Strukturen unter `data/`. Im Repo findet sie unter `tools/` drei kuratorische Skripte (Wikidata-Snapshot, Scholarly-Harvest, Validate-Data) plus `data/queries/*.rq` als versionierte SPARQL-Queries plus `data/wikidata-snapshots/` als datierte Antwort-Snapshots.

**Erfolgskriterium.** Sie kann CONTEXT im Unterricht als kleines, lesbares Beispiel für LOD-Föderation einsetzen. Sie nutzt das Repo zugleich als Demonstration für ein vollständiges Pipeline-Pattern: kuratierte Saat plus API-Anreicherung plus statisches Frontend plus drei orthogonale Tools.

## Rolle 4: Wissenschaftskritikerin will Forschungsasymmetrien sichtbar machen

**Kontext.** Eine Wissenschaftshistorikerin oder Wissenschaftsforscherin interessiert sich für die Frage, welche kontemplativen Traditionen empirisch zugänglich sind und welche nicht. Sie sucht eine Datenbasis, die die Ungleichheit der Erforschbarkeit als eigenen Befund führt.

**Pfad.** Die Coverage-Karte zeigt ihr sofort die Asymmetrie: Buddhismus mit Status `etabliert`, Islam mit `berührt`, Daoismus zugleich `berührt` und mit `+ Lücke`-Marker, Christentum mit `beginnend`. Klick auf den Lücken-Marker beim Daoismus öffnet die Lücken-Knoten-Seite zu Neidan. Sie sieht: vier kuratierte Gründe für die empirische Unsichtbarkeit (Eingebundenheit in Liturgie und Schriftstudium, kleine abgeschlossene Lehrer-Schüler-Linien, theologische Reserve gegen Outcome-Denken, fehlende Manualisierung). Die Verlinkung zu Pregadio-Forschung ist ausdrücklich als nicht-empirisch markiert. Sie wechselt zur Kabbalah-gap-Seite und sieht fünf Gründe plus den Hinweis "soft negative: hebräisch-sprachige Quellen wären zusätzlich zu prüfen". Auf der Hesychasmus-Konzeptseite findet sie Rubinart 2017 mit klarem Hinweis auf westkatholische Population plus den Templeton-Watchlist-Knoten mit Zeitform "laufend, kein peer-reviewter Outcome".

**Erfolgskriterium.** Sie hat eine kuratierte Karte der Forschungsasymmetrie: nicht eine Liste dessen, was Meditation tut, sondern eine Karte dessen, was über welche Tradition gewusst werden kann.

## Was die Stories an Designentscheidungen prüfen

| Designentscheidung | Geprüft durch |
|---|---|
| Konzept als Einstiegsknoten | Rolle 1 und 2 |
| Filter nach Tradition | Rolle 1 |
| Filter nach Forschungsfeld | Rolle 2 |
| Filter nach Reifegrad | Rolle 4 |
| Brücken-Layout (zweispaltig) in Detail-Pane | Rolle 1 und 2 |
| Konzept-Disambiguierung über Traditionen | Rolle 2 |
| Aufnahmegrund sichtbar | alle (Schutz vor Esoterik) |
| Single-Page-Verhalten (kein Reload) | Rolle 1 und 2 |
| Knotenpunkt-Referenzen als eigener Typ | Rolle 2 und 3 |
| Wissenschaftskritische Reifegrad-Markierung | Rolle 4 |
| Evidence-Gap-Knoten als Erstklass-Eintrag | Rolle 4 |
| Datenpipeline transparent (Tools sichtbar) | Rolle 3 |

## Was die Stories ausschließen

Keine Rolle verlangt im MVP eine Volltextsuche im Werk, eine Graphvisualisierung der Gesamtstruktur, eine Bearbeitung im Browser oder ein mehrsprachiges Interface. Diese Funktionen sind nicht durch eine Forschungsoperation gedeckt.

## Related (im Vault)

- [[Scholar-Centered Design]]
- [[Project Overview CONTEXT]]
