# Tools

Skripte zur Pflege des CONTEXT-Datenbestands. Laufen auf der Kuratoren-Maschine,
nicht im Browser. Output ist statisches JSON im Repo.

## wikidata-snapshot.py

Kontrollierte SPARQL-Abfrage gegen Wikidata mit deterministischem Snapshot.

### Voraussetzungen

```
pip install requests
```

### Verwendung

Alle Queries aus `data/queries/*.rq` abfragen:

```
python tools/wikidata-snapshot.py
```

Nur eine Query:

```
python tools/wikidata-snapshot.py concept-labels
```

### Wirkung

- Schreibt `data/wikidata-snapshots/YYYY-MM-DD-<name>.json` pro Query.
- Aktualisiert `data/wikidata-snapshots/manifest.json`.
- Schickt einen User-Agent-Header mit Repo-URL, wie von Wikidata vorgeschrieben.
- Timeout 60 Sekunden pro Query.

### Konvention

- Snapshot-Dateien werden nicht überschrieben, sondern neu angelegt — alte
  Stände bleiben für die Historie erhalten.
- Bei Schema-Änderungen einer Query wird die alte Snapshot-Datei zur Referenz
  belassen, die neue Datei erhält das aktuelle Datum.
- Tagesgleiche Mehrfachläufe überschreiben die Tagesdatei.

## scholarly-harvest.py

Reichert Studien- und Referenzdaten kontrolliert an, indem es pro DOI drei
offene APIs abfragt: Crossref für bibliografische Metadaten, Unpaywall für
Open-Access-Status, OpenAlex für Zitations- und Verknüpfungsdaten. Liest
`data/seeds.json` als Saat-Liste und schreibt datierte Snapshots.

### Voraussetzungen

Live-Modus:

```
pip install requests
export UNPAYWALL_EMAIL=<deine-e-mail@institution>
```

Unpaywall verlangt einen E-Mail-Kontakt pro Anfrage. Ohne `UNPAYWALL_EMAIL`
verweigert der Skript den Live-Lauf.

### Verwendung

Offline-Lauf gegen verifizierte Fixtures (für Tests und CI):

```
python tools/scholarly-harvest.py --offline
```

Live-Lauf gegen die drei APIs:

```
python tools/scholarly-harvest.py
```

Nur eine Saat verarbeiten, etwa zum Debug:

```
python tools/scholarly-harvest.py --offline --seed saraei-2023
```

Snapshot auf stdout statt in eine Datei schreiben:

```
python tools/scholarly-harvest.py --offline --dry-run
```

### Wirkung

- Schreibt `data/scholarly-snapshots/YYYY-MM-DD-scholarly.json` mit zwei
  klar getrennten Bereichen pro Saat: `curated` (Felder aus den lokalen
  JSONs, niemals überschrieben) und `harvested` (API-Antworten).
- Aktualisiert `data/scholarly-snapshots/manifest.json`.
- Trägt einen Gap-Report über alle Konzepte mit drei Klassen ein: echte
  Lücken (Maturity `fehlend` ohne Saaten), Saat-Unvollständigkeit
  (Inkonsistenz zwischen Maturity und Saatzahl) und konsistente Konzepte.
- Setzt Hygiene-Flags pro Saat: `crossref-missing`, `unpaywall-missing`,
  `openalex-missing` bei API-Ausfall mit DOI; `no-doi-use-fallback-url`
  bei Saaten ohne DOI; `author-order-mismatch` bzw. `author-set-mismatch`
  bei Abweichung zwischen kuratierten und Crossref-Autoren.

### Curated vs. harvested

Der Harvester garantiert, dass kuratorisch entschiedene Felder (Konzept-
Zuordnung, Evidenztyp, Aufnahmegrund, Stichprobentyp, Domäne) nicht durch
API-Antworten überschrieben werden. Konflikte zwischen Kuration und
Harvest werden als Flag ausgewiesen, nicht stillschweigend ausgeglichen.
Welche Felder als curated gelten, ist im Snapshot unter `policy` dokumentiert.

### Offline-Fixtures

`data/fixtures/responses.json` enthält verifizierte API-Antwort-Auszüge für
vier exemplarische DOIs (Chowdhury 2025, Carhart-Harris 2014, Rubinart 2017,
Saraei 2023). Strukturen entsprechen den echten API-Schemata, Werte stammen
aus den realen Publikationen. Diese Fixtures sind die Testgrundlage für
`--offline` und CI; sie ersetzen keinen Live-Snapshot.

### Konvention

- Snapshot-Dateien werden nicht überschrieben außer bei tagesgleichen
  Mehrfachläufen — die Tagesdatei wird dann ersetzt.
- Re-Harvest ist idempotent für die `curated`-Bereiche; nur `harvested`
  und `flags` ändern sich gegenüber dem vorigen Snapshot.
- Bei API-Fehlern (Timeout, 5xx) wird die Saat mit Flag `api-error`
  protokolliert, der Lauf bricht nicht ab.

## validate-data.py

Drei-schichtige Konsistenzprüfung über alle JSON-Dateien.

Siehe `tools/validate-data.py --help` für die CLI-Optionen und die
Exit-Codes (0 grün, 1 Schicht-1-rot, 2 Schicht-2-rot, 3 Schicht-3-rot).
