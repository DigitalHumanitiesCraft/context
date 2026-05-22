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
status: draft
language: de
version: 0.1
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

CONTEXT (Contemplative Corpora Graph) ist eine föderierte Linked-Open-Data-Schicht, die zwei bislang getrennte Wissenswelten verbindet: die historische kontemplative Überlieferung und die empirische Bewusstseinsforschung. Kein Korpus, keine Textsammlung, sondern eine Brückeninfrastruktur.

## Was CONTEXT ist

Eine kuratierte semantische Verknüpfungsschicht über fünf Knotentypen. Konzept-Knoten stehen im Zentrum und verbinden historische Werke aus Buddhismus, Yoga, christlicher Mystik, Daoismus und Neuplatonismus mit neurowissenschaftlichen und klinisch-psychologischen Studien zum gleichen Phänomen. Wikidata-QID dient als Identifikator-Drehscheibe, eigene Ordnungsontologie als Klammer.

Der wissenschaftliche Beitrag liegt nicht im Auffinden eines einzelnen Werks, sondern im Sichtbarmachen der Brücke zwischen einem kontemplativen Konzept, seiner historischen Quelle und seiner modernen empirischen Untersuchung. Diese Brücke existiert in keinem bestehenden Repositorium, weil historische Textkorpora und empirische Forschungsliteratur in getrennten Infrastrukturen liegen.

## Was CONTEXT nicht ist

- **Keine Volltextsammlung.** Texte werden verknüpft, nicht kopiert. Repräsentationen verweisen auf fachspezifische Repositorien.
- **Kein Vollständigkeitskorpus.** Auswahl ist begründet, nicht erschöpfend. Der Anspruch alles zu erfassen führt zur Unfertigkeit.
- **Keine IIIF-Aggregation.** Bilder von Texten sind nicht analysierbarer Volltext. IIIF ist höchstens optionale Belegschicht, nicht Aggregationsprinzip.
- **Keine Bewusstseinsforschung im engeren Sinn.** Kognitive Neurowissenschaft und Phänomenologie des Bewusstseins werden nicht als eigenständige Texttradition geführt, sondern nur als Studien, die ein Konzept aus der kontemplativen Überlieferung untersuchen.
- **Keine esoterische Grauzone.** Aufnahmekriterium ist seriöse wissenschaftliche Sekundärliteratur.

## Drei Verschiebungen in der Konzeptentwicklung

Das Projekt hat in der Entwicklung drei Verschiebungen durchlaufen, die jede für sich den Anspruch geschärft haben.

**Erstens.** Weg vom Vollständigkeitskorpus hin zur kuratierten Auswahl. Ein Korpus ist immer eine begründete Auswahl, nicht eine Sammlung von allem.

**Zweitens.** Weg von der Faksimile-Aggregation über IIIF hin zur semantischen Volltext-Föderation. Da die Forschungsfrage auf inhaltliche Analyse zielt, ist Volltext primär, Bild sekundär.

**Drittens, die folgenreichste.** Weg von der Werk-zentrierten Struktur hin zur konzept-zentrierten Brückeninfrastruktur. Forschende ordnen Meditationsforschung nicht nach Tradition oder Sprache, sondern nach Bewusstseinszustand und Phänomen. Ein Pali-Begriff wie *Jhāna* steht in ihrer Arbeitsweise neben einer fMRT-Studie, die genau diesen Zustand misst. Diese Einsicht macht aus dem Werk-Repositorium eine Brückeninfrastruktur.

## Materialbegriff

Bewusst weit über Traditionen hinweg: Pali- und Sanskrit-Quellen, klassisches Chinesisch, Tibetisch, christliche Mystik, lateinische und griechische Texte, arabische Überlieferung, daoistische und neuplatonische Werke. Bewusstseinsforschung im engeren Sinn bleibt davon getrennt, weil zeitlich, sprachlich und gattungsmäßig nicht kommensurabel mit Textüberlieferung.

## Aufnahmekriterium

Ein Konzept, Werk oder eine Studie wird aufgenommen, wenn seriöse wissenschaftliche Sekundärliteratur die Verbindung herstellt. Pro Eintrag ist der Aufnahmegrund als Referenz dokumentiert. Das schützt vor der esoterischen Grauzone und macht die kuratorischen Entscheidungen nachvollziehbar.

## Bekannte Verzerrung

Die faktische Abdeckung folgt der Erschließungslage, nicht dem Anspruch. Latein, Griechisch und klassisches Chinesisch sind gut digitalisiert. Arabisch und Tibetisch deutlich schlechter. Diese Verzerrung wird im Interface über Coverage-Marker explizit gemacht, nicht verschwiegen.

## Kuratorischer Kern

Ein erheblicher Teil der Arbeit ist nicht per SPARQL automatisierbar, sondern besteht im Lesen von Forschungsliteratur und im Überführen impliziter Korpusangaben in explizite Struktur. Genau diese kuratorische Arbeit ist der wissenschaftliche Mehrwert.

## Stand 2026-05-22

Prototyp v0 mit synthetischen Platzhalterdaten für fünf Konzepte. Repo angelegt, Wissensbasis geschrieben, drei UI-Seiten lauffähig (Konzept-Index, Brücken-Ansicht, Methodische Position). Reale Datenmodellierung von drei bis fünf Konzepten als nächster Schritt.

## Related (im Vault)

- [[Project Overview CONTEXT]]
- [[Linked Open Data]]
- [[Wikidata]]
- [[Knowledge Graph]]
