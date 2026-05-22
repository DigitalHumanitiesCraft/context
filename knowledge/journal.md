---
title: Journal CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Journal
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/journal
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-journal
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
---

# Journal CONTEXT

Chronologische Genese des Projekts. Neue Einträge oben.

## 2026-05-22 — Iteration 1.1: Knowledge-Refactor und Discovery-Methodik

**Anlass und Position.** Nach Abschluss von Iteration 1 zeigte ein systematischer Review drei Inkonsistenzen zwischen Code, Daten und Wissensbasis: Die in `data.md` versprochene Tradition-Hauptgruppen-Aggregation war nicht implementiert (`aggregateTraditions` listete 18 Einzelstrings statt 7 Gruppen); das `placeholder`-Feld stand nur noch auf zwei Gap-Knoten und wurde von der UI nicht ausgewertet; mehrere Knowledge-Dokumente referenzierten alte Multi-Page-Dateien (`about.html`) oder beschrieben Iteration-1-Items als "Iteration 2". Zusätzlich kam aus der Showcase-Diskussion die Verschiebung: CONTEXT soll nicht nur kuratierte Anker zeigen, sondern als Resource-Discovery-Werkzeug die föderierte LOD-Landschaft erschließen.

**Pipeline-Korrekturen.** `aggregateTraditions` in `assets/data-loader.js` mit kuratiertem Mapping `TRADITION_HAUPTGRUPPEN` für die sieben Hauptgruppen (Buddhismus, Christentum, Islam, Daoismus, Judentum, Hinduismus, Säkulare und wissenschaftliche Kontexte). Pro Hauptgruppe trägt das Aggregat jetzt `dominant_maturity`, `has_gap`, `concept_ids[]` und `subgroups[]` mit den Substrings im Bestand. Coverage-Karte zeigt sieben Zeilen mit Subgroup-Untertext. Tradition-Detailseite zeigt die Subgroups in der Page-Meta-Sektion. `placeholder`-Feld aus allen JSON-Dateien (concepts, works, studies, repositories) entfernt, Validator-Test angepasst (statt `placeholder is False` jetzt `maturity != fehlend` für die `aufnahmegrund.citation`-Pflicht), `data/PLACEHOLDER.md` gelöscht, Tokens `--color-placeholder-*` zu `--color-gap-*` umbenannt. Validator Schicht 1 weiterhin grün, jetzt 378/378 Tests (vorher 389 mit placeholder-Checks).

**Discovery-Methodik als neue Wissensbasis-Knoten.** Zwei neue Dokumente: `knowledge/discovery-workflows.md` beschreibt die Methodik mit drei Repositorien-Klassen (Volltext-Fachrepos, Faksimile-Aggregatoren wie Europeana/BnF/Vatican DigiVatLib/NLI Ktiv, Ikonografie-Sammlungen) und führt pro Hauptgruppe ein Workflow-Skelett mit Beispiel-Saat. `knowledge/wikidata-als-drehscheibe.md` dokumentiert den SPARQL-basierten Fan-out-Mechanismus mit vier konkreten Beispielabfragen (externe Identifier pro Werk, Werke einer Sprache, Topic-Expansion, Europeana-Verfügbarkeit). Wikidata-QID wird damit zum Drehpunkt für drei Discovery-Pfade. Geplantes viertes kuratorisches Skript `tools/discovery.py` skizziert, Snapshot-Schema entworfen.

**Knowledge-Sync der bestehenden acht.** `INDEX.md` Lese-Reihenfolge auf neun Dokumente erweitert, "Drei-Spalten-Explorer" zu "Coverage-Karte als Startseite" korrigiert, Begriffslexikon um Hauptgruppe und Resource Discovery ergänzt. `data.md` Tradition-Aggregations-Sektion mit konkreter Hauptgruppen-Tabelle, `placeholder`-Pflichtfeld entfernt, Repositorium-Sektion um drei Klassen erweitert. `architecture.md` Komponentenübersicht aktualisiert (Single-Page mit Hash-Routen statt about.html), Pipeline-Schema um `discovery.py` ergänzt, Iteration-1-Items aus Iteration-2-Sektion herausgezogen. `specification.md` Decision Log um vier neue Einträge (Hauptgruppen-Aggregation, placeholder weg, Discovery-Pipeline, drei Repo-Klassen). `project.md` Iteration-2-Roadmap mit Discovery an erster Stelle.

**Methodische Pointe der Verschiebung.** CONTEXT positioniert sich weiter weg vom kuratierten Anzeige-Showcase, hin zum methodischen Discovery-Werkzeug. Drei Repositorien-Klassen bilden die föderierte LOD-Landschaft ab; Wikidata als Drehscheibe ist nicht mehr nur Identifikator-Anker, sondern aktiver Verteiler. Die Showcase-Funktion bleibt erhalten: Drei stark unterversorgte Hauptgruppen (Daoismus mit ctext.org, Judentum mit Sefaria, Islam mit OpenITI) bekommen über Discovery konkrete Quellenanker.

**Was bewusst nicht passiert ist.** Keine Atomisierung des Knowledge-Ordners zu 80 Einzelknoten, weil die acht Promptotyping-Dokumente bereits Research-Vault-Knoten sind und Reichhaltigkeit über Wikilinks und Frontmatter, nicht über Dateimultiplikation entsteht. Drei zusätzliche Vertiefungs-Atome (konzept-inventar, tradition-hauptgruppen, hygiene-regeln) für Lookup-Tabellen und methodisches Lehrmaterial, kein voller Atomisierungs-Refactor.

## 2026-05-22 — UI-Showcase plus Harvester-Vorarbeit (M1 bis M5)

**Strategische Positionierung als DHCraft-Showcase entschieden.** CONTEXT ist nicht Forschungsinstrument-im-Großen, sondern methodischer Showcase für Linked-Open-Data-Föderation mit Wikidata-Drehscheibe, kuratorischer Disziplin und Provenienz-pro-Aussage. Reiht sich neben zbz-ocr-tei (TEI-Pipeline), Klawiter-Rescue (XML zu RDF), HerData (CIDOC-CRM-Vokabular) und Agentic-Edition-Pipeline ein. Drei Outputs: Lehrartefakt (ULG Data Librarian), Repo-Showcase auf dhcraft.org, Promptotyping-Methodenanker. Diese Verortung gibt allen weiteren Iterationen die Filterfrage: was braucht ein Showcase, was wäre Selbstzweck?

**Acht Milestones definiert.** M1 bis M5 heute umgesetzt, M6 und M7 brauchen Netz und sind für eine Folge-Session, M8 (GitHub Pages aktivieren) ist Hand des Users.

**M1 — Single-Page-Refactor mit Hash-Router.** Multi-Page-Variante (`concept.html`, `study.html`, `repository.html`, `about.html`) verworfen, zu einer `index.html` zusammengezogen. Neun Hash-Routen: `#` (Coverage-Karte), `#aggregation` (Audit), `#about`, `#tradition/<slug>`, `#konzept/<id>`, `#gap/<id>`, `#studie/<id>`, `#repositorium/<id>`, `#referenz/<id>`. `app.js` mit neun Renderern, `data-loader.js` baut Tradition-Aggregat als Reduce über Konzepte plus liest Wikidata- und Scholarly-Manifeste mit. Coverage-Karte sortiert Traditionen nach Reifegrad mit Gap-Marker. Slug-Erzeugung mit NFD-Dekomposition und Unicode-Combining-Mark-Filter, damit `Theravāda` zu `theravada` und nicht zu `therav-da` wird.

**M2 — Provenienz-Hover und Snapshot-Badge.** Geerntete Felder bekommen einen kleinen `i`-Marker mit Tooltip, der Quelle und Datum nennt. Im Header rechts oben sitzt ein Snapshot-Badge mit dem Datum der jüngsten Wikidata-Snapshot-Datei (heute 2026-05-22). Beide Funktionen sind so vorbereitet, dass A3 und A4 später Provenienz-Quellen automatisch ausfüllen.

**M3 — Tastaturbedienbarkeit und Fokus.** Skip-Link zum Hauptinhalt, `:focus-visible` mit sichtbarer Akzent-Outline auf allen interaktiven Elementen, `main` ist `tabindex="-1"` und bekommt nach jedem Routenwechsel Fokus, `aria-current="page"` auf der aktiven Navlink-Zeile, `aria-label`-Beschriftungen auf den Coverage-Zeilen, `aria-live="polite"` auf `view-root` und Snapshot-Badge.

**M4 — Echte Knöpfe.** Drei Knopf-Klassen (`btn-primary`, `btn-secondary`, `btn-inline`) mit klaren Hover- und Fokuszuständen. Auf Studien-Detailseiten "DOI öffnen" (Resolver) und "BibTeX kopieren" (Clipboard-API plus `flashStatus`-Feedback). Auf Repositorium-Detailseiten "Repositorium öffnen". Brotkrumenpfad als zweite Navigation unter dem Header.

**M5 — Audit-Ansicht mit Reifegrad-Matrix.** Eigene Route `#aggregation`. Tabelle Tradition × Reifegrad. Pro Zelle die Konzept-Pillen, die in dieser Tradition und diesem Reifegrad liegen, klickbar in die Detailseite. Plus Lücken-Inventar als zweite Sektion. Damit wird die Asymmetrie der Erforschbarkeit auf einen Blick lesbar.

**Vorarbeit am Harvester (A1 aus Arbeitsplan).** `data/seeds.json` mit 34 Saaten neu angelegt: 18 Studien, 4 Knotenpunkt-Referenzen, 12 Folgepapers. Pro Saat DOI (oder `no-doi-use-fallback-url`-Flag), Konzept-Zuordnung, Hygiene-Flags. `tools/scholarly-harvest.py` implementiert: Offline-Modus gegen Fixtures, Live-Modus gegen Crossref/Unpaywall/OpenAlex (braucht `UNPAYWALL_EMAIL`), strikte Trennung `curated` vs `harvested`, Gap-Detector mit drei Klassen (echte Lücken, Saat-Unvollständigkeit, konsistente Konzepte), Hygiene-Flag-Erkennung (`crossref-missing`, `unpaywall-missing`, `openalex-missing`, `author-order-mismatch`, `author-set-mismatch`). `data/fixtures/responses.json` mit verifizierten API-Antwort-Auszügen für vier exemplarische DOIs (Chowdhury 2025, Carhart-Harris 2014, Rubinart 2017, Saraei 2023). `tools/README.md` um Live- und Offline-Lauf erweitert.

**Erster Offline-Snapshot.** `python tools/scholarly-harvest.py --offline` gegen Fixtures liefert: 34 Saaten, **2 echte Lücken** (Neidan, Kabbalah), **0 Saat-Unvollständigkeit**. Damit ist die Hauptkorrektur aus dem Arbeitsplan erreicht — Qigong und Hesychasmus werden nicht mehr fälschlich als Lücken gemeldet, weil Henz/Schöllhorn 2017 und Rubinart 2017 in den Saaten sitzen. Vier Fixture-DOIs liefern saubere `ok`-Antworten aus allen drei APIs.

**Echtbefund aus dem Snapshot.** Saraei 2023 löst `author-order-mismatch` aus. Crossref zeigt Batouli als Erstautor (Korrespondenzautor in der Tandfonline-Publikation), die kuratierten `studies.json` führen Saraei. Vor dem Live-Lauf in M7 sollte die Autorenreihenfolge der Kuration nochmal gegen Tandfonline geprüft werden. Das Flag-System hat hier präzise das geliefert, was es soll: einen Konflikt zwischen Kuration und Quelle ausweisen, nicht stillschweigend ausgleichen.

**Datenvalidator grün.** `python tools/validate-data.py` Schicht 1 (offline): 389/389 Tests bestanden, 0 Fehler. Schichten 2 (Wikidata-Live-Verifikation) und 3 (URL-Liveness) brauchen Netz und sind für M6 reserviert.

**Smoke-Test.** 17 erwartete HTTP-Pfade liefern 200, 4 alte Multi-Page-Pfade liefern korrekt 404, 6 HTML-Hooks (`view-root`, `snapshot-badge`, `breadcrumb`, `skip-link`, `main-content`, `site-nav`) sind im Markup. 63 dispatch-fähige Routen über alle Entitäten, 0 Bruchstellen.

**Was noch ansteht.** M6 (Wikidata-QID-Live-Verifikation), M7 (Scholarly-Harvest live), M8 (GitHub Pages aktivieren plus dhcraft.org-Projektliste ergänzen).

## 2026-05-22 — Iteration 1 abgeschlossen

**Leitidee geschärft auf Asymmetrie der Erforschbarkeit.** CONTEXT kartiert nicht die Wirkungen von Kontemplation, sondern die Ungleichheit, mit der unterschiedliche Traditionen empirisch zugänglich sind. Diese Verschiebung wurde aus dem Deep-Research-Auftrag heraus formuliert und ist die methodische Grundlage für Iteration 1.

**Reifegrad-Feld als zentrale Schema-Erweiterung.** Vier Werte (`etabliert | berührt | beginnend | fehlend`) auf Konzeptebene. Bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst. Reifegrad ist im UI sichtbarer Marker und Filter-Option. Macht aus einem Datenmangel ein Argument.

**Curated-vs-harvested-Trennung.** Schema unterscheidet ab Iteration 1 zwischen kuratorisch entschiedenen Feldern (Konzept-Zuordnung, Evidenz-Typ, Aufnahmegrund) und aus APIs geholten Feldern (Titel, Zitationen, OA-Status). Re-Harvest überschreibt keine Kuration. Im Tool `scholarly-harvest.py` umgesetzt.

**Drei kuratorische Skripte etabliert.**

- `tools/wikidata-snapshot.py` — Wikidata-LOD-Anker, drei Queries (concept-labels, works-by-qid, repositories), drei datierte Snapshots.
- `tools/scholarly-harvest.py` — Crossref/Unpaywall/OpenAlex-Anreicherung, getrennt curated/harvested, Hygiene-Flags (no-doi, author-order-mismatch, missing-source), Offline-Modus über Fixtures, Evidence-Gap-Detection als eigene Operation.
- `tools/validate-data.py` — Integritätstests in drei Schichten (lokale Konsistenz offline, Wikidata-QID-Verifikation online, URL-Lebenszeichen online), CLI-Flags `--wikidata` und `--urls`, Exit-Codes für CI.

**Wikidata-QIDs aller 17 Entitäten verifiziert.** Alle ursprünglich aus dem Gedächtnis gesetzten QIDs in Prototyp v0 waren falsch. Verifikation per Wikidata-Suchschnittstelle (`wbsearchentities`) ergab korrekte QIDs. Erkenntnis: QID-Verifikation ist kritisch, nicht optional.

Korrekte QIDs (Auswahl):
- Konzepte: Jhāna `Q6577829`, Nondualism `Q2505322`, Nirodha Samāpatti `Q17039003`, DMN `Q1182555`, Ego Death `Q5348168`, Hesychasm `Q629589`, MBSR `Q341036`, Dhikr `Q948437`, Qigong `Q204368`.
- Werke: Visuddhimagga `Q200447`, Aṅguttara Nikāya `Q544764`, Aṣṭāvakra Gītā `Q780145`, Philokalia `Q929140`, Genjōkōan `Q3100748`.
- Repositorien: GRETIL `Q5514440`, CBETA `Q10876581`, SuttaCentral `Q101286521`, BDRC `Q30324366`, TLG `Q2131030`, PubMed `Q180686`.

**Deep-Research-Ergebnisse integriert.** Sieben verifizierte DOIs neu aufgenommen:

- Rubinart 2017 (Jesusgebet, Pastoral Psychology, `10.1007/s11089-017-0762-4`) als Aufnahmegrund Hesychasmus mit ehrlichem Hinweis auf westkatholische Population.
- Sparby & Sacchet 2022 (Frontiers in Psychology, `10.3389/fpsyg.2021.795077`) und 2024 (Mindfulness, `10.1007/s12671-024-02367-w`) als Klassifikationsbasis.
- Saraei 2023 (Religion Brain Behavior, `10.1080/2153599X.2022.2108888`) für Sufi-Dhikr.
- Henz & Schöllhorn 2017 (Frontiers in Psychology, `10.3389/fpsyg.2017.00154`) für Qigong.
- Vier Knotenpunkt-Referenzen (Varela 1996 ohne DOI, Sparby/Sacchet, Lindahl VCE 2017, Carhart-Harris Entropic Brain 2014) mit je drei Folgepapers in `references.json`.

**Drei neue Konzepte plus zwei Gap-Knoten.** Sufi-Dhikr (maturity: berührt) mit Saraei 2023, Qigong (maturity: berührt) mit Henz/Schöllhorn 2017, MBSR (maturity: etabliert) mit Hoge 2023 (Korrektur einer fehlerhaften Jhāna-Zuordnung). Plus Neidan-gap und Kabbalah-gap (beide maturity: fehlend) als Erstklass-Knoten mit kuratierter Begründung der empirischen Unsichtbarkeit.

**Watchlist-Knoten eingeführt.** Templeton WCT Projekt 30294 (Hesychasmus-RCT am Brigham and Women's Hospital, Harvard) als laufende Studie mit `evidence_type: laufend` und `doi: null`. Halbjährlicher Re-Check vorgesehen (nächster Check 2026-11-22).

**DMN-Problem gelöst.** Über `related_concepts` läuft die historische Verankerung von DMN-Suppression indirekt über Eltern-Konzepte (Nichtduales Gewahrsein, Ich-Auflösung). Die leere linke Spalte wird zur didaktisch sichtbaren asymmetrischen Brücke statt zum Datenmangel.

**UI-Architektur grundlegend verändert.** Statt vier getrennter HTML-Seiten (concept, repository, study, about) jetzt ein Single-Page-Explorer mit Coverage-Karte als Startseite und polymorphen Detailseiten. URL-Hash für Zitierfähigkeit, kein Reload. Zwischenstand mit Drei-Spalten-Explorer in derselben Session wieder verworfen zugunsten Coverage-Karte plus Audit-Ansicht. Diese Verschiebung wurde im UI-Showcase-Block oben final umgesetzt.

**Sechster Knotentyp Knotenpunkt-Referenz.** `references.json` mit vier theoretischen Schlüsselarbeiten und je drei dokumentierten Folgepapers. Eigene Detailansicht in der polymorphen Detail-Pane.

**Hygiene-Regeln aus Deep-Research-Auftrag umgesetzt.**

1. QIDs alle gegen Live-API verifiziert, keine erfundenen.
2. Rubinart 2017 explizit als westkatholisch markiert, nicht als orthodox-monastisch.
3. Saraei 2023 Autorenreihenfolge ist im Skript per Flag prüfbar.
4. Henz/Schöllhorn 2017 n explizit als unsicher dokumentiert.

**Schema-Version repo-weit auf 0.2 erhöht.** Alle acht Knowledge-Dokumente sind synchronisiert.

## 2026-05-22 — Prototyp v0

**Konzeptpapier verabschiedet.** Erweiterte Fassung des Wissensdokuments mit fünf Knotentypen (Konzept als zentraler neuer Knoten) und sieben Optimierungspunkten als Grundlage. Die folgenreichste Verschiebung gegenüber der ersten Skizze: weg von der Werk-zentrierten Struktur hin zur konzept-zentrierten Brückeninfrastruktur. Das macht aus einem Werk-Repositorium eine Brücke zwischen kontemplativer Überlieferung und Bewusstseinsforschung.

**Repo angelegt.** `DigitalHumanitiesCraft/context` über `gh repo create` initialisiert.

**Knowledge-Ordner geschrieben.** Acht Promptotyping-Dokumente nach Konvention. INDEX, project, data, specification, user-stories, design, architecture, journal. Frontmatter mit Pflichtkern, `template:`-Feldern für Vorlagen-Adressierbarkeit, `version: 0.1` repo-weit.

**Synthetische Platzhalterdaten erzeugt.** Fünf Konzepte als synthetische Platzhalter. Jhāna, Nichtduales Gewahrsein, Nirodha Samāpatti, DMN-Suppression, Hesychasm-Herzensgebet. DMN-Konzept absichtlich ohne Quelltexte, um zu zeigen, dass eine leere linke Spalte ein valider Zustand ist und visuell explizit gemacht wird. (Das damalige `placeholder: true`-Feld wurde in Iteration 1.1 entfernt — siehe Eintrag oben.)

**Drei UI-Seiten gebaut.** index.html (Konzept-Index mit Filtern), concept.html (Brücken-Ansicht zweispaltig), about.html (Methodische Position). Vanilla JS ohne Build-Step, JSON-Datenladen clientseitig.

**Designentscheidungen.** Bibliothekarisch-funktional. Eine Akzentfarbe (Tintenblau), drei Sättigungen für Evidenzgrade. Coverage-Banner als sichtbare Offenlegung der Verzerrung. Keine Graphvisualisierung im MVP — bei n=5 ohne analytischen Mehrwert.

**CLAUDE.md als Action-Layer.** Drei imperative Designprinzipien aus design.md abgeleitet: Lücken nicht kaschieren, Belegtrennung visuell, Evidenzgrad immer mitführen. Verweis auf knowledge/INDEX.md als Wissensbasis-Einstieg.

**Lokaler Webserver.** `python -m http.server 8000` im Repo-Root für die Review-Schleife.

## Roadmap

Aktuell maßgeblich ist die Iteration-2-Roadmap in [[Projekt CONTEXT|project.md]] Sektion "Was als nächstes ansteht". Frühere Versionen dieser Liste sind in den jeweiligen Journal-Einträgen oben dokumentiert.
