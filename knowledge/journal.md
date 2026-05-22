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
version: 0.1
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
---

# Journal CONTEXT

Chronologische Genese des Projekts. Neue Einträge oben.

## 2026-05-22 — Prototyp v0

**Konzeptpapier verabschiedet.** Erweiterte Fassung des Wissensdokuments mit fünf Knotentypen (Konzept als zentraler neuer Knoten) und sieben Optimierungspunkten als Grundlage. Die folgenreichste Verschiebung gegenüber der ersten Skizze: weg von der Werk-zentrierten Struktur hin zur konzept-zentrierten Brückeninfrastruktur. Das macht aus einem Werk-Repositorium eine Brücke zwischen kontemplativer Überlieferung und Bewusstseinsforschung.

**Repo angelegt.** `DigitalHumanitiesCraft/context` über `gh repo create` initialisiert.

**Knowledge-Ordner geschrieben.** Acht Promptotyping-Dokumente nach Konvention `[[Konvention Promptotyping Documents]]`. INDEX, project, data, specification, user-stories, design, architecture, journal. Frontmatter mit Pflichtkern, `template:`-Feldern für Vorlagen-Adressierbarkeit, `version: 0.1` repo-weit.

**Synthetische Platzhalterdaten erzeugt.** Fünf Konzepte mit `placeholder: true`. Jhāna, Nichtduales Gewahrsein, Nirodha Samāpatti, DMN-Suppression, Hesychasm-Herzensgebet. DMN-Konzept absichtlich ohne Quelltexte, um zu zeigen, dass eine leere linke Spalte ein valider Zustand ist und visuell explizit gemacht wird.

**Drei UI-Seiten gebaut.** index.html (Konzept-Index mit Filtern), concept.html (Brücken-Ansicht zweispaltig), about.html (Methodische Position). Vanilla JS ohne Build-Step, JSON-Datenladen clientseitig.

**Designentscheidungen.** Bibliothekarisch-funktional. Eine Akzentfarbe (Tintenblau), drei Sättigungen für Evidenzgrade. Coverage-Banner als sichtbare Offenlegung der Verzerrung. Keine Graphvisualisierung im MVP — bei n=5 ohne analytischen Mehrwert.

**CLAUDE.md als Action-Layer.** Drei imperative Designprinzipien aus design.md abgeleitet: Lücken nicht kaschieren, Belegtrennung visuell, Evidenzgrad immer mitführen. Verweis auf knowledge/INDEX.md als Wissensbasis-Einstieg.

**Lokaler Webserver.** `python -m http.server 8000` im Repo-Root für die Review-Schleife.

## Was als nächstes ansteht

1. Drei bis fünf reale Konzepte modellieren als Härtetest des Schemas.
2. SPARQL-Probelauf gegen Wikidata für die automatisch erschließbare Teilmenge der Werk-Metadaten.
3. Beitragsmechanismus über GitHub Issues spezifizieren, sobald Schema validiert.
4. Methodenkritik-Sektion in der Brücken-Ansicht ausbauen (Nebenwirkungen und methodische Einwände).
