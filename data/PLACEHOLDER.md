# Synthetische Platzhalterdaten

Die JSON-Dateien in diesem Ordner enthalten **keine real kuratierten Daten**. Sie sind im Prototyp v0 als Härtetest des Schemas angelegt.

## Was synthetisch ist

- **Verknüpfungen Konzept ↔ Werk.** Reale Werke werden genannt, aber die kuratorische Verknüpfung zu einem Konzept ist nicht durch Sekundärliteratur belegt.
- **Studien.** Titel, Autoren, DOI sind synthetisch.
- **Aufnahmegrund.** Verweise auf nicht-existente DOIs zur Demonstration der Schema-Pflichtfelder.
- **Evidenzgrade.** Frei zugeordnet, nicht durch Studieninhalt belegt.
- **Provenienz.** Generisches Quelle-Datum-Paar.

## Was strukturell real ist

- **Werknamen** (Visuddhimagga, Anguttara Nikāya, Aṣṭāvakra Gītā, Philokalia) sind echt.
- **Wikidata-QIDs** sind, wo angegeben, real und nachprüfbar.
- **Repositorien** (GRETIL, CBETA, SuttaCentral) existieren.
- **Sprachen, Traditionen, Konzept-Begriffe** sind philologisch akkurat.

## Markierung in der UI

Jede Seite trägt einen Coverage-Banner, der den synthetischen Status deutlich macht. Jeder JSON-Datensatz hat `placeholder: true`.

## Nächster Schritt

Drei bis fünf reale Konzepte vollständig modellieren, jeweils mit echtem Aufnahmegrund aus peer-reviewter Sekundärliteratur. Der Platzhalterstatus wird pro Datensatz auf `placeholder: false` gesetzt, sobald die kuratorische Belegung steht.
