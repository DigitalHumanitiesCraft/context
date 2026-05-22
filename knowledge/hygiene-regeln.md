---
title: Hygiene-Regeln
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
topics: ["[[Datenqualität]]", "[[Provenienz]]"]
related: [data, architecture, specification]
---

# Hygiene-Regeln

Pre-Ingest-Checks und Flag-Vokabular für CONTEXT. Diese Regeln verhindern stille Vermischung von Kuration und automatisch gehobenen Daten und machen Konflikte sichtbar, statt sie zu glätten. Implementiert in `tools/scholarly-harvest.py` (Flag-Erkennung) und `tools/validate-data.py` (Pre-Ingest-Checks).

## Vier Pre-Ingest-Regeln

Vor jedem Produktiv-Ingest werden vier Hygiene-Regeln geprüft.

### 1. QIDs verifizieren

Alle Wikidata-QIDs müssen vor Aufnahme gegen die Wikidata-API geprüft werden. Tool: `python tools/validate-data.py --wikidata`. Schicht 2 des Validators schlägt mit Exit-Code 2 fehl, wenn eine QID nicht auflösbar ist oder kein Label trägt.

Hintergrund: In Prototyp v0 waren alle aus dem Gedächtnis gesetzten QIDs falsch. Die Lehrerfahrung war, dass QID-Verifikation kritisch ist, nicht optional. Iteration 1 hat alle siebzehn Entitäts-QIDs gegen `wbsearchentities` und die Live-API verifiziert.

### 2. Population markieren

Bei Studien muss die Population klar sein. Beispiel Rubinart 2017: die Studie operationalisiert Hesychasmus, aber in westkatholischer Population (Universitätsstudenten in Spanien), nicht in einer orthodox-monastischen Gemeinschaft. Das wird in `curated.population_note` festgehalten und löst das Flag `population-westkatholisch-nicht-orthodox` aus.

Das verhindert die Verschmelzung von "Hesychasmus selbst" und "westkatholische Operationalisierung von Hesychasmus".

### 3. Autorenreihenfolge prüfen

Bei jeder Studie wird die kuratierte Autorenliste gegen die Crossref-Antwort geprüft. Beispiel Saraei 2023: Crossref führt Batouli als Erstautor (Korrespondenzautor in der Tandfonline-Publikation), die kuratierten `studies.json` führen Saraei. Das löst `author-order-mismatch` aus.

Konfliktauflösung: Vor dem Live-Lauf in M7 prüft die kuratorische Hand die Tandfonline-Landing-Page und entscheidet, ob die Kuration umgestellt wird oder das Flag als bewusste Abweichung dokumentiert bleibt.

### 4. Stichprobenangabe verifizieren

Beispiel Henz/Schöllhorn 2017: Die Stichprobengröße `n` ist aus dem 2017er-Volltext nicht eindeutig rekonstruierbar. In solchen Fällen wird `n: null` gesetzt und das Flag `sample-size-unclear` getragen. Die Studie bleibt im Bestand, aber mit sichtbarer Unschärfe.

## Flag-Vokabular

Pro Datensatz in `data/scholarly-snapshots/<datum>-scholarly.json` als `flags[]`.

| Flag | Bedeutung | Konsequenz |
|---|---|---|
| `no-doi-use-fallback-url` | Studie hat keine DOI, nutzt URL als Fallback | Beispiel Varela 1996. Keine `doi-unverified`-Warnung, weil bewusst kein DOI |
| `author-order-mismatch` | Crossref-Reihenfolge weicht von Kuration ab | Kuratorische Prüfung vor Live-Ingest |
| `author-order-mismatch-possible` | Reihenfolge unklar, kuratorische Verifikation steht aus | Soft-Flag, blockt nicht |
| `author-set-mismatch` | Crossref-Autorenmenge unterscheidet sich von Kuration | Kuratorische Prüfung; oft fehlt ein Konsortial-Autor |
| `crossref-missing` | Crossref liefert keine Antwort für die DOI | API-Ausfall oder DOI ungültig; Snapshot bleibt mit harvested:null |
| `unpaywall-missing` | Unpaywall liefert keine OA-Antwort | Studie hat kein Open-Access-Profil oder Unpaywall-API ist down |
| `openalex-missing` | OpenAlex liefert keine Antwort | API-Ausfall oder Work-ID ungültig |
| `population-westkatholisch-nicht-orthodox` | Rubinart 2017: westkatholische Operationalisierung | Sichtbar in Studien-Detail, verhindert Verschmelzung |
| `watchlist-laufend` | Studie noch ohne peer-reviewte Ergebnisse | evidence_type: laufend; halbjährliches Re-Check |
| `sample-size-unclear` | n nicht eindeutig rekonstruierbar | n: null, sichtbar in Studien-Detail |
| `no-doi-jcs-pre-2010` | Vor-2010-Studie ohne registrierten DOI | Akzeptiert wegen DOI-Verbreitung erst ab 2000er |
| `duplicate-of-study-<id>` | Follow-up-Paper ist identisch mit einer bereits gepflegten Studie | wird nicht doppelt aufgenommen, Querverweis |
| `doi-unverified-pre-ingest` | DOI wurde kuratorisch eingetragen, aber noch nicht gegen Crossref geprüft | wird beim nächsten Live-Lauf automatisch gelöst |

## Curated vs Harvested

Strikte Trennung im Schema. Re-Harvest überschreibt keine kuratorischen Felder.

**Curated (kuratorisch entschieden, bleibt bei Re-Harvest unangetastet):**

- Konzept-Zuordnung (`concept_id`, `additional_concepts`, `concepts_anchored`)
- Evidenz-Typ
- Aufnahmegrund mit Begründungstext
- Sample-Type, Domain
- Population-Notiz
- Reifegrad eines Konzepts
- Provenienz-Stempel

**Harvested (aus offenen APIs geholt, wird bei Re-Harvest überschrieben):**

- Titel, Autoren, Journal, Volume, Issue, Pages
- Open-Access-Status, OA-URL, Lizenz
- Cited-by-Count
- `referenced_works[]`, `related_works[]`

**Konfliktfall**: Wenn der Harvester eine andere Information findet als die Kuration trägt (z.B. abweichende Autorenreihenfolge bei Saraei 2023), erscheint ein Flag, aber die kuratorische Aussage bleibt erhalten. Das Flag macht den Konflikt sichtbar, schreibt aber nicht still um.

## Lehrbeispiel Saraei 2023

Studie `saraei-2023` mit DOI `10.1080/2153599X.2022.2108888`. Kuratierte Autorenliste: ["Saraei, Mahdiyeh", ...]. Crossref-Antwort: Batouli als Erstautor.

**Diagnose**: Wahrscheinlich ist Batouli Korrespondenzautor und steht auf der Tandfonline-Landing-Page an erster Stelle. Crossref pflegt die Autorenliste in der von der Publikation gemeldeten Reihenfolge, was bei vielen Journalen Korrespondenzautor zuerst ist.

**Aktion**: Flag `author-order-mismatch` wird im Snapshot getragen. Vor dem Live-Lauf in M7 prüft die kuratorische Hand die Tandfonline-Publikation. Drei mögliche Ausgänge:

1. Tandfonline zeigt Batouli zuerst → Kuration wird auf Crossref-Reihenfolge umgestellt, Flag verschwindet beim nächsten Lauf.
2. Tandfonline zeigt Saraei zuerst → Kuration bleibt, Flag wird als bewusste Abweichung dokumentiert (`note: "Crossref-API zeigt abweichende Reihenfolge, Verlagsversion korrekt"`), Flag verschwindet, weil eine kuratierte Erklärung trägt.
3. Unklar → Flag bleibt, Recherche ausgewiesen.

Dieses Lehrbeispiel zeigt, wie eine Hygiene-Regel arbeitet: nicht stille Korrektur, sondern sichtbarer Konflikt mit kuratierter Auflösung.

## Validator-Schichten

Drei Schichten, alle CLI-steuerbar in `tools/validate-data.py`.

**Schicht 1 (offline)**: JSON-Parsing, ID-Eindeutigkeit, Referenz-Integrität, Pflichtfelder, Enum-Validierung. Aktueller Stand: 378/378 Tests grün (Iteration 1.1, nach Entfernung des placeholder-Felds).

**Schicht 2 (Wikidata)**: Jede QID gegen `Special:EntityData` prüfen, Existenz und Label-Vorhandensein. Aktiviert mit `--wikidata`.

**Schicht 3 (URLs)**: HEAD-Request auf jede URL in Repräsentationen und Repositorien. Aktiviert mit `--urls`.

Exit-Codes: 0 grün, 1 Schicht 1 rot, 2 Schicht 2 rot, 3 Schicht 3 rot. CI-tauglich.

## Related (im Vault)

- [[Datengrundlage CONTEXT|data.md]]
- [[Architektur CONTEXT|architecture.md]]
- [[Provenienz]]
- [[Datenqualität]]
