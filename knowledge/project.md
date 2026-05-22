---
title: Projekt CONTEXT
project:
  name: CONTEXT — Contemplative Corpora Graph
  repository: https://github.com/DigitalHumanitiesCraft/context
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Projekt-Wissensdokument
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/project
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-project
status: active
language: de
version: 0.2
created: 2026-05-22
updated: 2026-05-22
authors: [Christopher Pollin]
generated-with: Claude Code mit Claude Opus 4.7
topics: ["[[Linked Open Data]]", "[[Knowledge Graph]]", "[[Scholar-Centered Design]]"]
knowledge-sources:
  vocabularies:
    - label: Wikidata
      url: https://www.wikidata.org
    - label: GND
      url: https://gnd.network
    - label: VIAF
      url: https://viaf.org
  apis:
    - label: Crossref
      url: https://api.crossref.org
    - label: Unpaywall
      url: https://unpaywall.org
    - label: OpenAlex
      url: https://openalex.org
  repositories:
    - label: GRETIL
      url: http://gretil.sub.uni-goettingen.de
    - label: CBETA
      url: https://www.cbeta.org
    - label: SuttaCentral
      url: https://suttacentral.net
related: [specification, data, design]
---

# Projekt CONTEXT

CONTEXT (Contemplative Corpora Graph) ist eine föderierte Linked-Open-Data-Schicht, die zwei bislang getrennte Wissenswelten verbindet: die historische kontemplative Überlieferung und die empirische Bewusstseinsforschung. Der Beitrag ist nicht das Sammeln, sondern das Sichtbarmachen einer Brücke und ihrer Asymmetrien.

## Leitidee

CONTEXT kartiert nicht die Wirkungen von Kontemplation. Es kartiert die **Asymmetrie der Erforschbarkeit**. Genau diese Ungleichheit zwischen den Traditionen ist der eigentliche Gegenstand, und der Graph soll sie sichtbar machen statt sie zu wiederholen.

Das hat eine konkrete strukturelle Folge: Konzepte tragen ein Reifegrad-Feld (`maturity`) mit kontrolliertem Vokabular `etabliert | berührt | beginnend | fehlend`. Der Reifegrad bezieht sich auf den Forschungszustand, nicht auf die Tradition selbst. Eine Tradition mit `maturity: fehlend` ist nicht weniger wertvoll oder weniger real — sie ist im aktuellen empirischen Diskurs weniger sichtbar, und das ist der Befund.

## Was CONTEXT ist

Eine kuratierte semantische Verknüpfungsschicht über sechs Knotentypen: Konzepte, Werke, Repräsentationen, Repositorien, Studien und Knotenpunkt-Referenzen. Konzept-Knoten stehen im Zentrum und verbinden historische Werke aus Buddhismus, Yoga, christlicher Mystik, Daoismus, Sufismus und benachbarten Traditionen mit neurowissenschaftlichen und klinisch-psychologischen Studien zum gleichen Phänomen. Wikidata-QID dient als Identifikator-Drehscheibe, eigene Ordnungsontologie als Klammer.

Stand Iteration 1 (2026-05-22) liegen elf Konzepte vor, davon sechs vollständig belegt durch peer-reviewte Studien (Jhāna, Nichtduales Gewahrsein, Nirodha Samāpatti, DMN-Suppression, Ich-Auflösung, MBSR), zwei berührt (Sufi-Dhikr, Qigong je eine Studie), eines beginnend (Hesychasmus, Rubinart 2017 als westkatholische Operationalisierung plus Templeton-Watchlist), zwei explizit fehlend (klassisches Neidan, jüdisch-mystische Meditation Hitbodedut/Hitbonenut).

Bestand insgesamt: 11 Konzepte, 5 Werke, 18 Studien, 9 Repositorien, 4 Knotenpunkt-Referenzen.

## Was CONTEXT nicht ist

- **Keine Volltextsammlung.** Texte werden verknüpft, nicht kopiert. Repräsentationen verweisen auf fachspezifische Repositorien.
- **Kein Vollständigkeitskorpus.** Auswahl ist begründet, nicht erschöpfend. Der Anspruch alles zu erfassen führt zur Unfertigkeit.
- **Keine IIIF-Aggregation.** Bilder von Texten sind nicht analysierbarer Volltext. IIIF ist höchstens optionale Belegschicht, nicht Aggregationsprinzip.
- **Keine Bewusstseinsforschung im engeren Sinn.** Kognitive Neurowissenschaft und Phänomenologie des Bewusstseins werden nicht als eigenständige Texttradition geführt, sondern nur als Studien, die ein Konzept aus der kontemplativen Überlieferung untersuchen.
- **Keine esoterische Grauzone.** Aufnahmekriterium ist seriöse wissenschaftliche Sekundärliteratur.
- **Kein Backend, kein Live-Endpunkt-Call zur Browser-Laufzeit.** Wikidata- und Scholarly-API-Abfragen laufen über kuratorische Skripte und persistieren als datierte Snapshots im Repo.

## Drei Verschiebungen in der Konzeptentwicklung

**Erstens.** Weg vom Vollständigkeitskorpus hin zur kuratierten Auswahl. Ein Korpus ist immer eine begründete Auswahl, nicht eine Sammlung von allem.

**Zweitens.** Weg von der Faksimile-Aggregation über IIIF hin zur semantischen Volltext-Föderation. Da die Forschungsfrage auf inhaltliche Analyse zielt, ist Volltext primär, Bild sekundär.

**Drittens, die folgenreichste.** Weg von der Werk-zentrierten Struktur hin zur konzept-zentrierten Brückeninfrastruktur. Forschende ordnen Meditationsforschung nicht nach Tradition oder Sprache, sondern nach Bewusstseinszustand und Phänomen. Ein Pali-Begriff wie *Jhāna* steht in ihrer Arbeitsweise neben einer fMRT-Studie, die genau diesen Zustand misst. Diese Einsicht macht aus dem Werk-Repositorium eine Brückeninfrastruktur.

**Iteration 1 ergänzt eine vierte Verschiebung.** Weg von der reinen Forschungskartierung hin zur Wissenschaftskritik. Die Reifegrad-Markierung und die zwei Evidence-Gap-Knoten machen CONTEXT zum Instrument, das auch dokumentiert, welche Traditionen empirisch unsichtbar sind und warum.

## Materialbegriff

Bewusst weit über Traditionen hinweg: Pali- und Sanskrit-Quellen, klassisches Chinesisch, Tibetisch, christliche Mystik, lateinische und griechische Texte, arabische und islamische Überlieferung, daoistische und neuplatonische Werke, jüdisch-mystische Praxis. Bewusstseinsforschung im engeren Sinn bleibt davon getrennt, weil zeitlich, sprachlich und gattungsmäßig nicht kommensurabel mit Textüberlieferung.

## Aufnahmekriterium

Ein Konzept, Werk oder eine Studie wird aufgenommen, wenn seriöse wissenschaftliche Sekundärliteratur die Verbindung herstellt. Pro Eintrag ist der Aufnahmegrund als Referenz dokumentiert. Das schützt vor der esoterischen Grauzone und macht die kuratorischen Entscheidungen nachvollziehbar.

Evidence-Gap-Knoten sind eine Ausnahme: Sie werden ohne empirischen Aufnahmegrund geführt, aber mit kuratierter Begründung, warum die Praxis empirisch unsichtbar ist. Nicht-empirischer Kontext (Idel und Arzy 2015 zur Kabbala, Pregadio zur Neidan-Forschung) wird ausdrücklich als nicht-empirisch markiert.

## Bekannte Verzerrung und der Reifegrad als Antwort darauf

Die faktische Abdeckung folgt der Erschließungslage, nicht dem Anspruch. Latein, Griechisch und klassisches Chinesisch sind gut digitalisiert. Arabisch und Tibetisch deutlich schlechter. Diese Verzerrung wird im Interface über das Reifegrad-Feld auf Konzeptebene explizit gemacht, nicht verschwiegen.

Die vier Reifegrade tragen unterschiedliche Begründungen. `etabliert` für den fortgeschrittenen Buddhismus, der eigene Klassifikation (Sparby/Sacchet), Messinstrumente und Methodenreflexion hat. `berührt` für Sufi-Dhikr und daoistische Kultivation, neurowissenschaftlich angefasst, aber ohne theoretischen Unterbau. `beginnend` für die christlich-mystische Linie, getragen von einem einzigen Übergangsbeleg (Rubinart 2017) und einer laufenden, noch stummen Studie (Templeton WCT 30294). `fehlend` für jüdische Mystik und klassisches Neidan.

## Kuratorischer Kern

Ein erheblicher Teil der Arbeit ist nicht per SPARQL automatisierbar, sondern besteht im Lesen von Forschungsliteratur und im Überführen impliziter Korpusangaben in explizite Struktur. Genau diese kuratorische Arbeit ist der wissenschaftliche Mehrwert.

Die Datenpipeline trennt deshalb strikt zwischen `curated` (kuratorisch entschiedene Felder wie Konzept-Zuordnung, Evidenz-Typ, Aufnahmegrund) und `harvested` (aus APIs geholte Felder wie Titel, Zitationen, OA-Status). Re-Harvest überschreibt keine kuratorische Arbeit. Diese Trennung ist im Schema und im Tool `scholarly-harvest.py` umgesetzt.

## Stand Iteration 1 (2026-05-22)

UI als Coverage-Karten-Startseite mit polymorphen Detailseiten (Tradition, Konzept, Studie, Referenz, Lücken-Knoten) konzipiert. Datenbasis: elf Konzepte (sechs etabliert, zwei berührt, eines beginnend, zwei fehlend), fünf Werke, achtzehn Studien (inklusive Templeton-Watchlist), neun Repositorien, vier Knotenpunkt-Referenzen. Drei kuratorische Skripte (Wikidata-Snapshot, Scholarly-Harvest, Validate). Alle Wikidata-QIDs gegen die Live-API verifiziert.

## Was als nächstes ansteht (Iteration 2)

1. **Resource-Discovery-Werkzeug als vierter Pipeline-Strang**. CONTEXT soll nicht nur kuratierte Anker zeigen, sondern Forschende beim Auffinden relevanter Quellen über fachspezifische Repos und Aggregatoren unterstützen. Methodik und Workflow-Skelette in [[Discovery-Workflows|discovery-workflows.md]], SPARQL-Drehscheiben-Logik in [[Wikidata als Drehscheibe|wikidata-als-drehscheibe.md]]. Implementierung als `tools/discovery.py` mit drei Pfaden (Volltext, Faksimile, Wikidata-Topic-Expansion).
2. **Diff zwischen Snapshots** in der UI sichtbar machen (Zitations-Entwicklung, OA-Status-Wechsel, neue Cluster-Kandidaten).
3. **Wikidata-Snapshot-Daten** (mehrsprachige Labels, Wikipedia-Links, Werk-Autor, Trägerinstitution) in der UI sichtbar machen — aktuell liegen sie ungenutzt im Repo.
4. **Templeton-Watchlist** halbjährlich re-checken (nächster Check 2026-11-22).
5. **Hebräisch- und jiddischsprachige Quellen** für den kabbalistischen Gap konsultieren (Sefaria.org, NLI Ktiv), bevor der Negativ-Befund als final dokumentiert wird.

## Related (im Vault)

- [[Project Overview CONTEXT]]
- [[Linked Open Data]]
- [[Wikidata]]
- [[Knowledge Graph]]
- [[Scholar-Centered Design]]
