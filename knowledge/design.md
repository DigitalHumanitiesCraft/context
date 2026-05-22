---
title: Gestaltung CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Design
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/design
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-design
status: draft
language: de
version: 0.1
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Scholar-Centered Design]]", "[[Information Visualisation]]"]
related: [specification, architecture]
---

# Gestaltung CONTEXT

CONTEXT positioniert sich als Forschungswerkzeug, nicht als Dashboard und nicht als Lese-Edition. Die Oberfläche dient dem Verbinden zweier verstreuter Literaturkulturen und macht ihre Asymmetrien sichtbar, statt sie zu glätten.

## Designhaltung

Bibliothekarisch-funktional. Dichte Datenansicht. Lücken werden nicht kaschiert, sondern als Eigenschaft des Bestands offengelegt. Belegtrennung ist visuell sichtbar: analysierbare Editionen unterscheiden sich von reinen Faksimile-Belegen. Evidenzgrad einer empirischen Studie wird immer mitgeführt, weil eine Studie ein Konzept stützen, einschränken oder methodisch-kritisch behandeln kann.

Das Interface vermeidet Dekoration. Keine Hero-Bilder, keine Loader-Spinner, keine Animation. Eine Schriftfamilie für Lauftext, eine für UI, eine Akzentfarbe für Interaktion und Evidenzgrade in drei Sättigungen.

## Designsystem

**Tokens.** Farben, Typografie und Spacing leben in [`../assets/tokens.css`](../assets/tokens.css) als einzige Quelle. Das Dokument beschreibt nur die Kategorien.

- **Farben.** Anthrazit-Lauftext auf Off-White. Eine Akzentfarbe (Tintenblau) für Links und Interaktion. Evidenzgrad-Badges in drei Sättigungen desselben Akzents (stützend voll, einschränkend mittel, methodisch-kritisch hell). Coverage-Banner in gedämpftem Warnocker.
- **Typografie.** Eine Serif für Lauftext und Konzept-Labels (Originalschrift, Transliteration, Übersetzung). Eine Sans für UI-Elemente, Chips und Metadaten. Schriftgrößen folgen einer modularen Skala (1.25 als Verhältnis).
- **Spacing.** 4er-Raster. Lauftext bricht bei 72 Zeichen. Brücken-Ansicht ist 1:1 symmetrisch ab 768 px Breite, darunter gestapelt.

**Komponenten.** Liegen in [`../assets/components.css`](../assets/components.css). Kategorien:

- *Konzept-Card* für den Index. Trägt mehrsprachiges Label, Traditions-Chip, Quellenzähler.
- *Brücken-Spalte* für die Detailansicht. Trägt eine Liste von Werken oder Studien mit konsistenten Untertypen.
- *Evidenzgrad-Badge*. Eines von drei States.
- *Belegtrennung-Marker*. Edition versus Faksimile durch unterschiedliche Iconfarbe.
- *Coverage-Banner*. Bleibt am Seitenanfang sichtbar, scrollt mit.
- *Filter-Chip*. Toggle-Verhalten, Akzentfärbung im aktiven Zustand.

**Layout.** Single-Container, max-width 1080 px, zentriert. Mobile-first.

## Interaktionsmuster

Filter wirken kumulativ. Mehrere aktive Filter zeigen die Schnittmenge; der gefilterte Zustand ist durch Akzent-Färbung der Filter-Chips und durch eine Trefferanzahl oberhalb der Liste sichtbar.

Navigation in die Brücken-Ansicht geschieht über die ganze Konzept-Card als Klickfläche, nicht über einen versteckten "Mehr"-Button.

Spaltensymmetrie in der Brücken-Ansicht ist ein bewusstes Designprinzip, auch wenn eine Spalte leer bleibt. Eine leere Quelle-Spalte (DMN-Konzept) wird mit einem expliziten Erklärungssatz gefüllt, nicht ausgeblendet. Das macht den asymmetrischen Charakter solcher Konzepte sichtbar.

Provenienz pro Verknüpfung erscheint als unauffälliger, aber lesbarer Untertext an der Studie, nicht in einem ausklappbaren Akkordeon. Wer einen Eintrag sieht, sieht sofort, wer ihn auf welcher Grundlage gezogen hat.

## Visualisierungslogik

Bewusst keine Graphvisualisierung im MVP. Bei n=5 Konzepten trägt eine Force-directed-Darstellung keinen analytischen Mehrwert und würde die methodische Pointe (Brücke zwischen zwei Welten) verwässern. Visualisierung folgt erst, wenn der Datenstand sie methodisch rechtfertigt.

Coverage-Marker als visuelles Element für die bekannte Verzerrung. Sprachverteilung der Quellseite wird als kleines Balkendiagramm im Header der Brücken-Ansicht denkbar, ist aber im Prototyp v0 als Textbanner umgesetzt — visuelle Verfeinerung folgt nach Validierung.

## Anbindung an den Action-Layer

Die imperative Übersetzung der Designhaltung lebt in [`../CLAUDE.md`](../CLAUDE.md), Sektion "Designprinzipien". Beispielhafte Imperative, abgeleitet:

- Aus "Lücken werden nicht kaschiert" wird "Leere Datenfelder zeigen einen erklärenden Satz, nicht eine ausgeblendete Sektion".
- Aus "Belegtrennung ist visuell sichtbar" wird "Edition und Faksimile bekommen unterschiedliche Icon-Farben".
- Aus "Evidenzgrad wird immer mitgeführt" wird "Jede Studie–Konzept-Verknüpfung trägt sichtbar einen Badge".

Diese Imperative gehören in `CLAUDE.md`, nicht in dieses Dokument. Hier stehen sie als Beleg, dass die Komposition Knowledge → Action eingehalten ist.

## Related (im Vault)

- [[Scholar-Centered Design]]
- [[Information Visualisation]]
