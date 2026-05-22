---
title: Spezifikation CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Specification
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/specification
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-specification
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Requirements Engineering]]", "[[Decision Records]]"]
related: [project, data, design, user-stories]
---

# Spezifikation CONTEXT

Funktionsumfang von Iteration 1 und Entscheidungslog aller Optimierungspunkte aus dem Konzeptpapier und dem Deep-Research-Bericht.

## MVP-Features in Iteration 1

### F1. Coverage-Karte als Startseite

Die Startseite ist keine Suchmaske, sondern die Coverage-Karte selbst. Vier Bereiche von oben nach unten: Kopf mit Snapshot-Badge, globales Suchfeld, vier Stat-Cards (Konzepte/Studien/Traditionen/Lücken), Liste der Traditionen nach Forschungsreife mit Status-Chips, optional Querschnittsbereich für übergreifende Knoten.

**Akzeptanzkriterien.**

- Tradition-Hauptgruppen-Liste sortiert nach Reifegrad-Hierarchie (etabliert > berührt > beginnend > fehlend). Sieben Hauptgruppen aggregieren 18 feine Tradition-Strings ([[data.md|data.md Sektion Tradition als Aggregat]]).
- Jede Hauptgruppen-Zeile zeigt Name, Subgroup-Strings als Untertext, Reifegrad-Chip, Konzept-Anzahl und Studien-Anzahl.
- Hauptgruppe mit gemischtem Reifegrad zeigt zusätzlich einen "+ Lücke"-Marker, wenn sie einen Gap-Knoten enthält (z.B. Daoismus mit Qigong belegt und Neidan ungedeckt).
- Stat-Cards zeigen die aktuellen Bestandszahlen: 11 Konzepte, 5 Werke, 18 Studien, 9 Repositorien, 4 Knotenpunkte; plus Reifegrad-Verteilung (6/2/1/2).
- Provenienz-Badge im Header trägt das jüngste Snapshot-Datum aus `wikidata-snapshots/manifest.json`.
- Globales Suchfeld durchsucht client-seitig alle Entitäten (Konzepte, Studien, Traditionen, Werke, Referenzen).
- Fußzeile zeigt Reifegradskala, Verifiziert-vs-Watchlist-Hinweis und LOD-Anker-Liste.

### F2. Fünf Seitentypen mit polymorphen Renderern

Aus der Coverage-Karte führen Kanten in fünf Seitentypen, jeder mit eigenem Renderer.

- **Übersicht (Startseite):** Coverage-Karte wie in F1.
- **Tradition-Seite:** alle Konzepte und Studien einer Tradition mit Reifegrad. Aktuell als Aggregation aus `concepts[].traditions[]`, Iteration 2 als eigenständiger Knotentyp.
- **Konzept-Seite:** Header mit mehrsprachigem Label, Reifegrad-Marker, Wikidata-QID, Aufnahmegrund. Darunter zweispaltige Brücken-Ansicht (Werke links, Studien rechts) plus verwandte Konzepte als typisierte Kanten.
- **Studien- und Referenz-Detail:** zwei sichtbar getrennte Feldgruppen — geerntet (Crossref/Unpaywall/OpenAlex mit Snapshot-Datum) und kuratiert (Konzept-Zuordnung, Evidenz-Typ, Aufnahmegrund). Flags als eigene Hinweise. LOD-Anker in Monospace.
- **Lücken-Knoten:** vollwertige Seite für `maturity: fehlend`-Konzepte. Begründung der empirischen Unsichtbarkeit, kuratierte Kontextlinks ausdrücklich als nicht-empirisch markiert, Watchlist-Status wo vorhanden.

URL-Hash macht jeden Zustand zitierfähig: `#konzept/jhana`, `#studie/chowdhury-2025`, `#tradition/buddhismus`, `#gap/kabbalah`.

### F3. Reifegrad als sichtbarer Marker

Jedes Konzept trägt einen Reifegrad-Marker (`etabliert`/`berührt`/`beginnend`/`fehlend`) sowohl in der Trefferliste als auch in der Detail-Pane. Filter nach Reifegrad ist eine der Kernoptionen in der linken Spalte.

**Akzeptanzkriterien.**

- Vier Reifegrad-Werte sichtbar als farblich differenzierte Marker.
- Tooltip oder Hinweistext macht klar: Reifegrad bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst.
- Evidence-Gap-Knoten erscheinen mit `maturity: fehlend` und kuratierter Begründung in der Detail-Pane.

### F4. Curated-vs-harvested-Trennung im Datenformat

Die JSON-Dateien unterscheiden zwischen kuratorisch entschiedenen und aus APIs geernteten Feldern. Re-Harvest überschreibt keine Kuration.

### F5. Reproduzierbare externe Schichten

Drei kuratorische Skripte unter `tools/`:

- `wikidata-snapshot.py` für Wikidata-Anker.
- `scholarly-harvest.py` für Crossref/Unpaywall/OpenAlex-Anreicherung.
- `validate-data.py` für Integritätstests in drei Schichten.

Jeder Snapshot ist datiert. Decision-Log-Punkt 6 (SPARQL-Reproduzierbarkeit) ist damit von `deferred` auf `accepted` gehoben.

## Was bewusst nicht im MVP ist

- **Live-SPARQL-Call zur Browser-Laufzeit.** Wikidata-Abfragen laufen über das kuratorische Skript, nicht im Frontend.
- **Diff-Visualisierung zwischen Snapshots.** Geplant für Iteration 2.
- **Discovery-Pfade.** `harvest.py` mit Wikidata-Topic-Expansion, Crossref-Crawl und PubMed-Suche steht für Iteration 2.
- **Beitragsmechanismus über GitHub Issues.** Erst sinnvoll nach weiterer Schema-Validierung.
- **Mehrsprachiges Interface.** Frontend-Texte zunächst deutsch.

## Decision Log

Acht Optimierungspunkte mit Implementierungsstatus in Iteration 1.

| Nr | Punkt | Status v0.2 | Begründung |
|---|---|---|---|
| 1 | Provenienz pro Aussage | accepted | `provenance: { source, date }` ist Pflichtfeld an Studien |
| 2 | Konzept-Disambiguierung über Traditionen | accepted | `traditions[]` plus `related_concepts[]` mit typisierten Kanten |
| 3 | Mehrsprachige Labels | accepted | Pflichtfelder `label.{original, translit, de, en}` |
| 4 | Versionierung des Vokabulars | accepted | `id`-Werte stabil, repo-weite `version:` markiert Schema-Stand |
| 5 | Evidenzgrad statt bloßer Verlinkung | accepted | Fünf Werte inkl. `nebenwirkungen-dokumentierend` und `laufend` |
| 6 | Reproduzierbarkeit der SPARQL-Schicht | accepted | `tools/wikidata-snapshot.py` plus datierte Snapshots |
| 7 | Beitragsweg für Dritte | deferred | Erst sinnvoll nach Schema-Validierung an realen Konzepten |
| 8 | Aussagengranularität — Stichprobentyp mitführen | accepted | `sample_type` und `n` als Pflichtfelder an Studien |
| 9 | Reifegrad-Feld auf Konzeptebene | accepted | `maturity` als kontrolliertes Vokabular mit vier Werten |
| 10 | Curated-vs-harvested-Trennung | accepted | Im `scholarly-harvest.py` umgesetzt, Re-Harvest schützt Kuration |
| 11 | Evidence-Gap-Knoten als Erstklass-Einträge | accepted | Neidan und Kabbalah als vollwertige Konzepte mit Begründung |
| 12 | Watchlist-Knoten für laufende Studien | accepted | Templeton WCT 30294 mit `evidence_type: laufend` |
| 13 | Theoretische Knotenpunkt-Referenzen | accepted | `references.json` mit vier Knoten und je drei Folgepapers |
| 14 | Diff-Visualisierung zwischen Snapshots | deferred | Iteration 2, sobald mehrere Snapshots akkumuliert sind |
| 15 | Discovery-Pipeline (Wikidata-Topic, Crossref, PubMed) | deferred | Iteration 2, optionaler vierter Strang |
| 16 | Coverage-Karte als Startseite statt Suchmaske | accepted | Tragende UI-Entscheidung Iteration 1: Asymmetrie ist das Interface, nicht eine nachgelagerte Filteroption |
| 17 | Stat-Cards mit Bestandszahlen oben | accepted | Vier Karten (Konzepte/Studien/Traditionen/Lücken); Lücken bekommt eigene Karte, damit die Asymmetrie sichtbar wird |
| 18 | Snapshot-Badge im Header jeder Seite | accepted | Liest jüngstes Datum aus `wikidata-snapshots/manifest.json`; macht Provenienz lebendig |
| 19 | Lücken-Knoten als eigener Renderer | accepted | Eigene Render-Route für `maturity: fehlend`, mit Begründungsliste statt Brücken-Spalte |
| 20 | Curated/Harvested-Trennung im Studien-Detail visuell | accepted | Zwei sichtbare Feldgruppen, geerntet mit Snapshot-Datum-Badge, kuratiert mit Provenienz-Stempel |
| 21 | Folgepaper-Cluster aus OpenAlex aufklappbar | accepted-schema-deferred-ui | Schemafeld `harvested.referenced_works[]` ist bereit, UI-Sichtbarkeit folgt sobald Scholarly-Harvest produktiv läuft |
| 22 | Globale client-seitige Volltextsuche | accepted | Sucht über Konzepte, Studien, Traditionen, Werke, Referenzen live |
| 23 | Fußzeile mit Lese-Hilfe | accepted | Reifegradskala, Verifiziert-vs-Watchlist, LOD-Anker-Liste |
| 24 | Identifikatoren in Monospace | accepted | DOI, QID, OpenAlex-ID in Monospace; klickbar, zitierbar |
| 25 | Tradition als eigenständiger Knotentyp | deferred | Iteration 2; aktuelle Aggregation aus `concepts[].traditions[]` reicht für die Coverage-Karte |
| 26 | Tradition-Hauptgruppen-Aggregation (Iteration 1.1) | accepted | Sieben kuratierte Hauptgruppen statt 18 feiner Strings; Mapping in `assets/data-loader.js` als Konstante `TRADITION_HAUPTGRUPPEN`; Subgroups bleiben als Untertext sichtbar |
| 27 | `placeholder`-Feld entfernt (Iteration 1.1) | accepted | Gap-Knoten sind durch `maturity: fehlend` ausreichend markiert; doppelte Wahrheit aufgelöst |
| 28 | Discovery-Pipeline als viertes Skript | deferred | Iteration 2; Methodik in [[Discovery-Workflows|discovery-workflows.md]], SPARQL-Logik in [[Wikidata als Drehscheibe|wikidata-als-drehscheibe.md]] |
| 29 | Drei Repositorien-Klassen (Volltext, Faksimile, Ikonografie) | accepted-schema-deferred-ui | Schema-Feld `representations[].type` ist bereits da; Faksimile-Aggregatoren werden in Iteration 2 mit konkreten Inhalten gefüllt |

## Ethische Verankerung im Modell

Vier strukturelle Mechanismen, im Datenmodell und im UI verankert.

1. **Aufnahmekriterium als Pflichtfeld.** Jeder Konzept-, Werk- und Studien-Eintrag trägt `aufnahmegrund` mit Referenz auf wissenschaftliche Sekundärliteratur. Ohne Aufnahmegrund kein Eintrag (außer Evidence-Gaps mit kuratierter Begründung).
2. **Reifegrad sichtbar.** Sichtbare Offenlegung der Forschungsasymmetrie auf Konzeptebene. Der Reifegrad bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst.
3. **Belegtrennung.** Repräsentationen tragen `type: edition | facsimile`, das UI unterscheidet visuell.
4. **Evidenzgrad statt Verlinkung.** Studien-Konzept-Beziehungen tragen einen `evidence_type`, der auch einschränkende, methodisch-kritische und nebenwirkungs-dokumentierende Befunde abbildet. Nebenwirkungen und methodische Einwände bleiben sichtbar.

Zusätzlich: **Wissenschaftskritische Funktion.** Evidence-Gap-Knoten und der Watchlist-Knoten machen explizit, was empirisch fehlt oder noch nicht abgeschlossen ist. Damit wird CONTEXT zum Instrument der Wissenschaftskritik, nicht nur zum Mapping-Tool.

## Hygiene-Regeln (Iteration 1)

Vier Regeln vor jedem Produktiv-Ingest:

1. **QIDs verifizieren.** Alle Wikidata-QIDs vor Aufnahme gegen die Wikidata-API prüfen, keine erfundenen anlegen. Tool: `validate-data.py --wikidata`.
2. **Population markieren.** Bei Studien klar machen, in welcher Population gemessen wurde. Beispiel Rubinart 2017: westkatholisch, nicht orthodox-monastisch — nicht mit Hesychasmus selbst verschmelzen.
3. **Autorenreihenfolge prüfen.** Beispiel Saraei 2023: Verlagsversion gegenprüfen, Korrespondenzautor steht oft an erster Stelle der Landing-Page. Der Harvester markiert das als `author-order-mismatch`-Flag.
4. **Stichprobenangabe verifizieren.** Beispiel Henz/Schöllhorn 2017: n aus 2017er-Volltext nicht eindeutig rekonstruierbar, ist als unsicher markiert.

## Related (im Vault)

- [[Project Overview CONTEXT]]
- [[Linked Open Data]]
