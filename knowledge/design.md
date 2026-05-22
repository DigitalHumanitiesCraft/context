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
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Scholar-Centered Design]]", "[[Information Visualisation]]"]
related: [specification, architecture]
---

# Gestaltung CONTEXT

CONTEXT ist ein Forschungswerkzeug, kein Dashboard und keine Lese-Edition. Die Oberfläche verbindet zwei verstreute Literaturkulturen und macht ihre Asymmetrien sichtbar, statt sie zu glätten. Die Designhaltung dieses Dokuments ist abgeleitet aus dem CONTEXT-Design-Wissensdokument (Pollin 2026, intern) und gibt die Designentscheidungen für Iteration 1 und 2 vor.

## Designhaltung

Bibliothekarisch-funktional. Dichte Datenansicht. Lücken werden nicht kaschiert, sondern als Eigenschaft des Bestands offengelegt. Belegtrennung ist visuell sichtbar: analysierbare Editionen unterscheiden sich von reinen Faksimile-Belegen. Evidenzgrad einer empirischen Studie wird immer mitgeführt. Reifegrad einer Tradition wird als eigenes visuelles Merkmal geführt, weil die Asymmetrie der Erforschbarkeit der eigentliche Forschungsgegenstand ist.

Das Interface vermeidet Dekoration. Keine Hero-Bilder, keine Loader-Spinner, keine Animation. Eine Schriftfamilie für Lauftext, eine für UI, eine Monospace für Identifikatoren. Eine Akzentfarbe für Interaktion, eine Sekundärfarbe für Belege, vier Statusfarben für Reifegrade.

## Vier Designprinzipien

Aus dem Design-Wissensdokument:

1. **Die Asymmetrie ist das Interface.** Der Reifegrad einer Tradition ist die primäre Ordnungsachse, nicht eine nachgelagerte Filteroption.
2. **Jeder Knoten ist Eingang und Ausgang.** Bewegung als Graph von Tradition zu Konzept zu Studie zu Referenz, über Brücken und Folgepaper-Cluster, statt durch starre Baumnavigation.
3. **Provenienz ist sichtbar, nicht versteckt.** Snapshot-Datum, Flags, Status verifiziert-vs-Watchlist und LOD-Anker gehören an die Oberfläche.
4. **Lücken sind erstklassige Seiten.** Ein Gap-Knoten ist keine Leerstelle, sondern eine eigene Seite mit Begründung, kuratierten Kontextlinks und Watchlist-Vermerk.

## Tragende UI-Entscheidung: Coverage-Karte als Startseite

Die Startseite ist keine Suchmaske, sondern die Coverage-Karte selbst. Wer die Site öffnet, sieht sofort, welche Tradition wie weit erforscht ist und wo die Lücken liegen. Eine Oberfläche, die nur die gut beforschten Knoten zeigt, würde den Forschungsbias wiederholen. Eine, die die Lücken als eigene Knoten führt, macht die Asymmetrie selbst zum Gegenstand.

## Informationsarchitektur — fünf Seitentypen

1. **Übersicht (Coverage-Karte).** Einstiegsseite. Reifegrade aller Traditionen plus Kennzahlen plus übergreifende Knoten.
2. **Traditionsseite.** Alle Konzepte und Studien einer Tradition mit ihrem Reifegrad. Aktuell als Aggregation, ab Iteration 2 als eigenständiger Knotentyp.
3. **Konzeptseite.** Herzstück. Konzept, zugehörige Studien, theoretische Referenzen, Reifegrad, Brücken zu anderen Konzepten.
4. **Studien- und Referenzdetailseite.** Bibliografischer Datensatz mit sichtbarer Trennung von geernteten und kuratierten Feldern, Open-Access-Status, Flags, Folgepaper-Cluster, LOD-Anker, Snapshot-Datum.
5. **Lücken-Knoten.** Vollwertige Seite für eine empirisch fehlende Praxis: Begründung der Unsichtbarkeit, kuratierte Kontextlinks ausdrücklich als nicht-empirisch markiert, Watchlist-Status falls vorhanden.

Navigationsmodell ist ein Graph. Aus jeder Seite führen Kanten in benachbarte Knoten. Globale Suche und Filter liegen quer darüber.

## Die Startseite im Detail

Vier Bereiche von oben nach unten.

**Kopfbereich.** Projektname, kurzer Untertitel, rechts ein klickbares Provenienz-Badge mit dem Snapshot-Datum.

**Suchfeld.** Client-seitige Volltextsuche über Konzepte, Studien, Traditionen, Werke, Referenzen. Live während des Tippens.

**Kennzahlen-Karten.** Vier Stat-Cards: Konzepte, Studien, Traditionen, Lücken. Gibt schnellen Überblick über den Korpuszustand. Lücken bekommt eigene Card, damit die Asymmetrie auf einen Blick sichtbar wird.

**Coverage-Liste.** Liste der Traditionen nach Forschungsreife sortiert. Jede Zeile: Tradition, Ankerstudie als Kurzbeschreibung, Status-Chip für den Reifegrad, rechts Anzahl der Konzepte oder Lücken-Marker. Eine Tradition kann mehrere Chips tragen, wenn sie zugleich berührt und ungedeckt ist (Daoismus mit belegtem Qigong und ungedecktem Neidan).

Unter der Liste ein **Querschnittsbereich** für übergreifende Knoten: Neurophänomenologie als Methode, Psychedelika-Forschung als Brücke. Diese gehören keiner Tradition, sind aber tragend für die Brückeninfrastruktur.

**Fußzeile.** Lese-Hilfe: Reifegradskala, Trennung verifiziert vs Watchlist, Liste der LOD-Anker (Wikidata, DOI, OpenAlex).

## Die Detailseiten

**Konzeptseite.** Oben Titel mehrsprachig (Original, Transliteration, Übersetzung), Tradition, Reifegrad-Marker, Wikidata-QID als klickbarer Link. Aufnahmegrund in eigener Box. Verwandte Konzepte als typisierte Kanten. Darunter zweispaltig: links Werke mit Repräsentationen und Belegtrennung, rechts Studien chronologisch absteigend mit Evidenzgrad-Badges. Konzeptübergreifende Studien (Britton 2021, Goldberg 2022) erscheinen auf jeder Konzeptseite einmal, Deduplikation auf der Studien-Detailseite.

**Studien- und Referenzdetailseite.** Zwei Feldgruppen sichtbar getrennt:

- **Geerntete Felder** stammen aus offenen Schnittstellen (Crossref, Unpaywall, OpenAlex) und tragen das Snapshot-Datum als Badge. Titel, Autoren, Journal, Volume, Issue, Pages, Cited-by, OA-Status, OA-URL, Lizenz, referenced_works, related_works.
- **Kuratierte Felder** stammen aus Handarbeit und bleiben bei Re-Harvest unangetastet. Konzept-Zuordnung, Evidenz-Typ, Aufnahmegrund, Sample-Type, Domain, Provenienz-Stempel.

Flags wie `no-doi-use-fallback-url` oder `author-order-mismatch` stehen als eigene Hinweise sichtbar. LOD-Anker (DOI, OpenAlex, Wikidata) erscheinen in Monospace als klickbare Identifikatoren.

**Lücken-Knoten-Seite.** Erklärt, warum eine Praxis empirisch fehlt: Eingebundenheit in Liturgie und Studium, kleine abgeschlossene Gemeinschaften, theologische Reserve gegen Outcome-Denken, fehlende Manualisierung, konzeptuelle Verwaschung durch Substitution. Verlinkt nicht-empirischen Kontext ausdrücklich als solchen (Idel/Arzy 2015 für Kabbala, Pregadio-Forschung für Neidan). Watchlist-Eintrag wo vorhanden mit Zeitform laufend und ohne Ergebnisse.

## Reifegrad- und Statussystem

Reifegrad ist die zentrale Statusdimension, kommt aus dem kuratierten Feld `maturity` auf der Konzeptebene. Er bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst — Tooltip macht das klar.

Vier Stufen mit fester Farbzuordnung:

- **etabliert** (Grün) — eigene Klassifikation und Messinstrumente vorhanden.
- **berührt** (Blau) — neurowissenschaftlich gemessen, aber ohne theoretischen Unterbau.
- **beginnend** (Amber) — getragen von einem einzigen Übergangsbeleg.
- **fehlend** (Rot/Coral) — kein Empiriebeleg, geführt als Gap-Knoten.

Für hochverdichtete Stufenkarten genügt eine reduzierte Zweifarbenlesart (Teal für belegt, Coral für Lücke), mit der Stufe über Position und Beschriftung. Die vierstufige Statusfarbe ist die kanonische, die Zweifarbenlesart die vereinfachte Variante.

## Provenienz und Vertrauen

Vier Elemente machen Herkunft sichtbar:

- **Snapshot-Datum im Kopf jeder Seite** macht klar, auf welchen Stand sich die Angaben beziehen.
- **Flags** machen Unschärfen sichtbar statt sie zu glätten (fehlender DOI bei Varela 1996, abweichende Autorenreihenfolge bei Saraei 2023, unsichere Stichprobenangabe bei Henz/Schöllhorn 2017).
- **Trennung verifiziert / Watchlist** verhindert, dass laufende Studien (Templeton WCT 30294) wie gesicherte Befunde erscheinen.
- **LOD-Anker als klickbare Identifikatoren** halten den föderierten Charakter lebendig und erlauben den Sprung in Wikidata, OpenAlex und zur DOI-Auflösung.

## Komponenten und visuelle Sprache

Zurückhaltend und wissenschaftlich, flach statt dekorativ, dünne Trennlinien, viel Weißraum. Wirkt wie ein Forschungswerkzeug, nicht wie ein Produktdashboard.

Wiederkehrende Komponenten:

- **Stat-Card** für Summen
- **Status-Chip** für Reifegrad in vier Farben
- **Coverage-Zeile** für eine Tradition in der Startseiten-Liste
- **Provenienz-Badge** für Snapshot-Datum
- **Suchfeld** mit Live-Treffern
- **Konzept-Karte** für die Brücken-Ansicht
- **Bridge-Spalte** für die zweispaltige Konzept-Detailansicht
- **Evidenzgrad-Badge** in fünf Werten
- **Belegtrennung-Marker** (Edition vs Faksimile)
- **Cluster-Liste** aufklappbar für Folgepapers
- **Flag-Hinweis** für Hygiene-Warnungen
- **LOD-Anker-Chip** für DOI, QID, OpenAlex in Monospace

Identifikatoren wie DOI und QID erscheinen in Monospace, weil sie technische Zeichenketten sind und so zitierbar bleiben.

## Layout

Single-Container für Header und Footer, max-width 1080 px. Im Inhaltsbereich wechselt das Layout je nach Seitentyp:

- **Startseite (Coverage-Karte).** Einspaltig, gestapelt: Kopf, Suche, Stat-Cards-Reihe, Tradition-Liste, Querschnittsbereich, Fußzeile.
- **Konzept-Detail.** Header oben, darunter zweispaltige Brücken-Ansicht (Werke links, Studien rechts), responsive Stapelung unter 768 px.
- **Studien- und Referenz-Detail.** Einspaltig mit visueller Trennlinie zwischen geernteten und kuratierten Feldgruppen.
- **Tradition-Detail.** Einspaltig mit Aggregation aller Konzepte einer Tradition.
- **Lücken-Knoten.** Einspaltig, deutlich anders eingefärbt (Coral-Akzent), zeigt Begründungs-Liste statt Brücken-Ansicht.

## Interaktionsmuster

Filter wirken kumulativ. Mehrere aktive Filter zeigen die Schnittmenge.

Auswahl in der Liste aktualisiert die Detail-Ansicht ohne Page-Reload. URL-Hash ändert sich, sodass Bookmarks und Direkt-Links funktionieren (`#konzept/jhana`, `#studie/chowdhury-2025`, `#tradition/buddhismus`, `#gap/kabbalah`).

Folgepaper-Cluster sind aufklappbar. Standardmäßig zugeklappt, weil die Listen lang werden können (Lindahl 2017 hat 412 Citations laut Crossref-Snapshot).

Spaltensymmetrie in der Konzept-Brücken-Ansicht ist ein bewusstes Designprinzip, auch wenn eine Spalte leer bleibt. Bei DMN-Suppression zeigt die linke Spalte einen erklärenden Satz über die Konzept-zu-Konzept-Beziehung statt einer ausgeblendeten Sektion.

Provenienz pro Verknüpfung erscheint als unauffälliger, aber lesbarer Untertext an der Studie, nicht in einem ausklappbaren Akkordeon.

Klick auf einen Wikidata-QID öffnet wikidata.org. Klick auf einen DOI öffnet den DOI-Resolver. Klick auf eine Repräsentations-URL öffnet die Edition im Quell-Repositorium.

## Visualisierungslogik

Bewusst keine Graphvisualisierung im MVP. Bei elf Konzepten trägt eine Force-directed-Darstellung keinen analytischen Mehrwert und würde die methodische Pointe verwässern.

**Reifegrad als visuelle Hauptachse.** Auf der Startseite als Sortier- und Filter-Logik der Coverage-Liste. In der Detail-Pane als Marker neben dem Konzept-Titel. Eine Reifegrad-Verteilung des Gesamtbestands kann als kleines Stab-Diagramm im Footer geführt werden — zeigt auf einen Blick, wie viele Konzepte etabliert, berührt, beginnend, fehlend sind.

**Diff zwischen Snapshots.** Sobald mehrere Snapshots akkumuliert sind (Wikidata- oder Scholarly-Harvest), kann die UI eine "Was hat sich verändert"-Sektion zeigen: Zitations-Entwicklung pro Studie, OA-Status-Wechsel, neue Cluster-Kandidaten aus OpenAlex. Iteration 2.

## Datenbindung

Die Oberfläche ist eine Projektion des Datenmodells, jedes Element hat eine Quelle.

| UI-Element | Datenquelle |
|---|---|
| Status-Chip auf Konzept | `concepts[].maturity` |
| Sortierung der Coverage-Liste | Reifegrad-Hierarchie etabliert > berührt > beginnend > fehlend |
| Tradition-Aggregation | `concepts[].traditions[]` per Reduce |
| Geernteter Block in Studien-Detail | `harvested.*` aus scholarly-snapshots |
| Kuratierter Block | direkter Bezug aus `studies.json` |
| Folgepaper-Cluster | `harvested.referenced_works[]`, `harvested.related_works[]` |
| Flag-Hinweise | `flags[]` aus Normalisierung |
| Lücken-Knoten-Seite | Konzept mit `maturity: fehlend` |
| Querschnittsbereich Methode | `references.json` mit type:knotenpunkt |
| Snapshot-Datum-Badge | jüngster Eintrag aus `wikidata-snapshots/manifest.json` |

Ein Konzept mit Reifegrad fehlend und ohne zugehörige Studie wird zum Lücken-Knoten. Ein Konzept ohne Studie, aber mit höherem Reifegrad, gilt intern als unvollständige Seed-Liste und wird nicht als Lücke angezeigt — der Harvester meldet das als `seed_incomplete`.

## Anbindung an den Action-Layer

Imperative Übersetzung der Designhaltung lebt in [`../CLAUDE.md`](../CLAUDE.md), Sektion "Designprinzipien". Beispiele:

- Aus "Asymmetrie ist das Interface" wird "Reifegrad ist auf jeder Konzept-Karte und in der Detail-Pane sichtbar, nicht versteckt".
- Aus "Lücken werden nicht kaschiert" wird "Leere Datenfelder zeigen einen erklärenden Satz, nicht eine ausgeblendete Sektion".
- Aus "Belegtrennung ist visuell sichtbar" wird "Edition und Faksimile bekommen unterschiedliche Icon-Farben".
- Aus "Evidenzgrad wird immer mitgeführt" wird "Jede Studie–Konzept-Verknüpfung trägt sichtbar einen Badge".
- Aus "Provenienz ist sichtbar" wird "Snapshot-Datum, Flags, Quelle erscheinen ohne Akkordeon".

## Offene Designfragen

Aus dem Design-Wissensdokument:

1. Ob die Startseite die ruhige Listenform behält oder die Asymmetrie räumlich als Stufenkarte zeigt. Die Liste ist scanbarer, die Stufenkarte eindringlicher.
2. Ob der Querschnitt aus Methode und Psychedelika-Brücke auf der Startseite sichtbar bleibt oder in eine eigene Ebene wandert.
3. Wie tief die Graph-Navigation visuell ausgespielt wird, also ob es neben den Detailseiten eine eigene Graph-Ansicht gibt oder ob die Kanten ausschließlich kontextuell auf den Seiten erscheinen.

Aus dem Bau-Plan:

4. Ob Light- und Dark-Mode beide unterstützt werden oder nur einer. Iteration 1 fokussiert Light. Tokens sind aber so vorbereitet, dass Dark später ohne UI-Bruch möglich ist.
5. Ob Tradition als eigener Knotentyp in `traditions.json` formalisiert wird. Iteration 1 nutzt Aggregation, Iteration 2 kann das formalisieren ohne UI-Bruch.

## Related (im Vault)

- [[Scholar-Centered Design]]
- [[Information Visualisation]]
