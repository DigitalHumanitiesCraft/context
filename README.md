# CONTEXT — Contemplative Corpora Graph

Föderierte Linked-Open-Data-Schicht, die historische kontemplative Überlieferung mit empirischer Bewusstseinsforschung verbindet. Kein Korpus, keine Textsammlung, sondern eine Brückeninfrastruktur über fünf Knotentypen (Konzept, Werk, Repräsentation, Repositorium, Studie) mit Wikidata-QID als Identifikator-Drehscheibe.

## Stand

Prototyp v0 mit synthetischen Platzhalterdaten für fünf Konzepte. Drei UI-Seiten lauffähig: Konzept-Index, Brücken-Ansicht, Methodische Position. Reale Datenmodellierung folgt.

## Lokal starten

```
python -m http.server 8000
```

Dann öffnen:
- `http://localhost:8000/` — Konzept-Index
- `http://localhost:8000/concept.html?id=jhana` — Brücken-Ansicht
- `http://localhost:8000/about.html` — Methodische Position

## Repo-Struktur

```
context/
├── CLAUDE.md              Action-Layer für Coding-Agenten
├── index.html             Landing, Konzept-Index
├── concept.html           Brücken-Ansicht
├── about.html             Methodische Position
├── assets/                CSS und JS
├── data/                  JSON-Datenstand (synthetische Platzhalter)
└── knowledge/             Promptotyping-Wissensbasis (8 Dokumente)
```

## Wissensbasis

Volle deklarative Wissensbasis im `knowledge/`-Ordner. Einstieg über [`knowledge/INDEX.md`](knowledge/INDEX.md).

## Methodische Position

Aufnahmekriterium ist seriöse wissenschaftliche Sekundärliteratur. Materialbegriff bewusst weit über Traditionen hinweg (Pali, Sanskrit, klassisches Chinesisch, Tibetisch, christliche Mystik, Latein, Griechisch, Arabisch). Bewusstseinsforschung im engeren Sinn ist nur als Studie, die ein Konzept untersucht, vertreten — nicht als eigenständige Texttradition. Bekannte Verzerrung der Abdeckung wird im Interface explizit gemacht.

## Lizenz

Code: MIT. Daten: synthetische Platzhalter, kein realer Korpus im aktuellen Stand.

## Kontakt

Christopher Pollin, [DigitalHumanitiesCraft](https://dhcraft.org).
