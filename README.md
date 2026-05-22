# CONTEXT — Contemplative Corpora Graph

Föderierte Linked-Open-Data-Schicht, die historische kontemplative Überlieferung mit empirischer Bewusstseinsforschung verbindet. Kein Korpus, keine Textsammlung, sondern eine Brückeninfrastruktur über sechs Knotentypen (Konzept, Werk, Repräsentation, Repositorium, Studie, Knotenpunkt-Referenz) mit Wikidata-QID als Identifikator-Drehscheibe.

## Stand

Iteration 1 (2026-05-22). Single-Page-Explorer mit Coverage-Karte als Startseite, Audit-Ansicht mit Reifegrad-Matrix, polymorphen Detailseiten für Tradition, Konzept, Studie, Lücken-Knoten, Repositorium und Knotenpunkt-Referenz. Datenbasis: 11 Konzepte, 5 Werke, 18 Studien, 9 Repositorien, 4 Knotenpunkte mit je 3 Folgepapers.

## Lokal starten

```
python -m http.server 8000
```

Dann öffnen: `http://localhost:8000/`

Die Navigation läuft über Hash-Routen, kein Reload:

- `#` Coverage-Karte (Startseite)
- `#aggregation` Audit-Ansicht mit Reifegrad-Matrix
- `#about` Methodische Position
- `#tradition/<slug>` Tradition mit ihren Konzepten
- `#konzept/<id>` Brücken-Ansicht für ein Konzept
- `#gap/<id>` Lücken-Knoten mit Begründung
- `#studie/<id>` Studien-Detailseite
- `#repositorium/<id>` Repositorium mit den dort liegenden Werken
- `#referenz/<id>` Knotenpunkt-Referenz mit Folgepaper-Cluster

## Repo-Struktur

```
context/
├── CLAUDE.md              Action-Layer für Coding-Agenten
├── index.html             Single-Page-Explorer
├── assets/                CSS und JS (Vanilla, ES-Module, kein Build)
├── data/                  Fünf JSON-Dateien plus Snapshot-Verzeichnisse
├── tools/                 Drei Python-Skripte (wikidata-snapshot, scholarly-harvest, validate)
└── knowledge/             Promptotyping-Wissensbasis (acht Dokumente)
```

## Wissensbasis

Volle deklarative Wissensbasis im `knowledge/`-Ordner. Einstieg über [`knowledge/INDEX.md`](knowledge/INDEX.md).

## Methodische Position

Aufnahmekriterium ist seriöse wissenschaftliche Sekundärliteratur. Materialbegriff bewusst weit über Traditionen hinweg. Bewusstseinsforschung im engeren Sinn ist nur als Studie, die ein Konzept untersucht, vertreten — nicht als eigenständige Texttradition. Bekannte Verzerrung der Abdeckung wird im Interface explizit gemacht: das Reifegrad-Feld mit den vier Werten etabliert, berührt, beginnend, fehlend ist erkennbares Erkenntnisinstrument.

## Lizenz

Code: MIT. Daten: kuratierte Sekundärliteratur, jede Aussage mit Aufnahmegrund und Provenienz.

## Kontakt

Christopher Pollin, [DigitalHumanitiesCraft](https://dhcraft.org).
