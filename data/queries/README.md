# SPARQL-Queries gegen Wikidata

Reproduzierbare Abfragen, deren Ergebnisse als Snapshots unter
`../wikidata-snapshots/` persistiert sind. Snapshots werden manuell aktualisiert,
das Frontend lädt nur die persistierten JSON-Dateien — kein Live-Endpoint-Call
zur Laufzeit. Damit ist die Site offline-tauglich und GitHub-Pages-kompatibel.

## Refresh-Vorgang

1. Query-Datei `*.rq` öffnen, prüfen ob noch aktuell.
2. Query gegen https://query.wikidata.org/sparql ausführen.
3. Ergebnis als JSON exportieren und unter `../wikidata-snapshots/YYYY-MM-DD-<name>.json` ablegen.
4. `../wikidata-snapshots/manifest.json` aktualisieren (Dateiname, Datum, Query-Referenz).

## Vorhandene Queries

- `concept-labels.rq` — Mehrsprachige Labels und Beschreibungen für die fünf Konzepte.
- `works-by-qid.rq` — Metadaten zu den modellierten Werken (Autor, Entstehungszeit, Sprache).
- `repositories.rq` — Optional, Wikidata-IDs der Repositorien als externe Anker.

## Konvention

- UTF-8, LF-Zeilenenden.
- Eine Query pro Datei.
- Kommentar am Dateianfang: Zweck, erwartete Ergebnis-Spalten, Snapshot-Datei.
- Wo möglich `SERVICE wikibase:label` für mehrsprachige Labels.
