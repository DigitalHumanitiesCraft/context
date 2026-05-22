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
status: draft
language: de
version: 0.1
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Scholar-Centered Design]]", "[[User Stories]]"]
related: [specification, design]
---

# User Stories CONTEXT

Drei Forschungsrollen, an denen sich das Interface misst. Die Stories sind keine Personas, sondern operationale Anwendungsszenarien — sie beschreiben, was eine Person tut, wenn sie mit CONTEXT arbeitet, und woran sich der Erfolg bemisst.

## Rolle 1: Religionswissenschaftlerin sucht historische Quellen zu einem Phänomen

**Kontext.** Eine Religionswissenschaftlerin schreibt einen Aufsatz über kontemplative Zustände im frühen Theravāda-Buddhismus. Sie kennt den Begriff *Jhāna* und sucht primäre Textstellen plus einen Eindruck, ob und wie diese Zustände empirisch untersucht werden.

**Pfad.** Öffnet `index.html`, sieht das Konzept-Index, filtert nach Tradition "Pali-Buddhismus". Klickt auf *Jhāna*. Brücken-Ansicht erscheint. Linke Spalte listet Visuddhimagga mit Verweis auf GRETIL und Anguttara Nikāya mit Verweis auf SuttaCentral. Rechte Spalte zeigt eine fMRT-Studie als stützenden Befund. Sie kopiert die Werk-Referenzen und die DOI der Studie in ihre Literaturverwaltung.

**Erfolgskriterium.** Sie hat in unter drei Klicks gefunden, was sie in zwei getrennten Datenbanken (eine philologisch, eine biomedizinisch) hätte suchen müssen.

## Rolle 2: Bewusstseinsforscher sucht historische Vorläufer einer Studie

**Kontext.** Ein Bewusstseinsforscher arbeitet an einem Paper über die Suppression des Default Mode Networks während fortgeschrittener Meditation. Er weiß, dass kontemplative Traditionen Zustände der Selbstauflösung beschreiben, aber kennt die Quelltexte nicht. Er sucht historische Begriffe für das Phänomen.

**Pfad.** Öffnet `index.html`, filtert nach Evidenz-Typ "stützend". Sieht alle Konzepte, zu denen es stützende empirische Befunde gibt. Klickt auf *Nichtduales Gewahrsein*. Brücken-Ansicht zeigt links Aṣṭāvakra Gītā (Advaita Vedānta) und Khregs chod-Texte (Dzogchen) als historische Quellen, rechts seine eigene Forschungsrichtung. Er erkennt, dass dasselbe Phänomen in zwei Traditionen unter unterschiedlichen Namen beschrieben wird (Konzept-Disambiguierung), und prüft den Aufnahmegrund.

**Erfolgskriterium.** Er hat einen historischen Anker für seine Studie, der durch wissenschaftliche Sekundärliteratur belegt ist und nicht aus der esoterischen Grauzone stammt.

## Rolle 3: Lehrende für Digital Humanities sucht Vergleichsbeispiel für LOD-Föderation

**Kontext.** Eine DH-Lehrende bereitet eine Sitzung über Linked Open Data vor und sucht ein Beispiel für föderierte Aggregation über Wikidata-QIDs. Sie sucht ein Projekt, das die LOD-Logik nicht nur behauptet, sondern in einer schmalen, lesbaren Implementierung zeigt.

**Pfad.** Öffnet `about.html`, liest die methodische Position. Klickt zur Brücken-Ansicht eines Konzepts. Inspiziert über die Browser-Devtools die JSON-Strukturen unter `data/`. Stellt fest, dass die Wikidata-QIDs als Drehscheibe wirken, dass die `provenance`-Felder Belegtrennung und Provenienz pro Aussage sichtbar machen, und dass das Schema offen dokumentiert ist (`knowledge/data.md`).

**Erfolgskriterium.** Sie kann CONTEXT im Unterricht als kleines, lesbares Beispiel für LOD-Föderation einsetzen, weil das Schema deklarativ verfügbar ist und das Frontend ohne Build-Step auf GitHub Pages läuft.

## Was die Stories an Designentscheidungen prüfen

| Designentscheidung | Geprüft durch |
|---|---|
| Konzept als Einstiegsknoten | Rolle 1 und 2 |
| Filter nach Tradition | Rolle 1 |
| Filter nach Evidenz-Typ | Rolle 2 |
| Brücken-Layout (zweispaltig) | Rolle 1 und 2 |
| Konzept-Disambiguierung über Traditionen | Rolle 2 |
| Aufnahmegrund sichtbar | Rolle 2 (Schutz vor Esoterik) |
| Methodische Position als About-Seite | Rolle 3 |
| Schema lesbar in `knowledge/` | Rolle 3 |

## Was die Stories ausschließen

Keine Rolle verlangt im MVP eine Volltextsuche im Werk, eine Graphvisualisierung der Gesamtstruktur, eine Bearbeitung im Browser oder ein mehrsprachiges Interface. Diese Funktionen sind nicht durch eine Forschungsoperation gedeckt.

## Related (im Vault)

- [[Scholar-Centered Design]]
- [[Project Overview CONTEXT]]
