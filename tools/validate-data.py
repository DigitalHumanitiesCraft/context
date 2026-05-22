#!/usr/bin/env python3
"""
validate-data.py — Datenintegrität der CONTEXT-JSON-Dateien prüfen.

Drei Schichten:
- Schicht 1 (lokal, offline): JSON-Parsing, ID-Eindeutigkeit, Referenz-Integrität,
  Pflichtfelder, Enum-Validierung.
- Schicht 2 (online, Wikidata): jede QID gegen wbgetentities prüfen.
- Schicht 3 (online, URLs): HEAD-Request auf jede URL in Repräsentationen und
  Repositorien.

Verwendung:
    python tools/validate-data.py                  # nur Schicht 1
    python tools/validate-data.py --wikidata       # Schicht 1 + 2
    python tools/validate-data.py --urls           # Schicht 1 + 3
    python tools/validate-data.py --all            # alle drei

Exit-Codes:
    0 — alle gewählten Schichten grün
    1 — Schicht 1 hat Fehler
    2 — Schicht 2 hat Fehler
    3 — Schicht 3 hat Fehler

Voraussetzungen: pip install requests (nur für --wikidata oder --urls).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"

EVIDENCE_TYPES = {
    "stützend", "einschränkend", "methodisch-kritisch",
    "nebenwirkungen-dokumentierend", "laufend",
}
SAMPLE_TYPES = {
    "einzelfall", "vergleichsstudie", "klinisch",
    "bevölkerungsrepräsentativ", "rct", "meta-analyse",
    "übersichtsarbeit", "theoriebildung", "experimentell",
}
DOMAINS = {
    "meditation-research", "psychedelics-research",
    "clinical-trial", "school-based",
}
MATURITY_LEVELS = {"etabliert", "berührt", "beginnend", "fehlend"}
REL_TYPES = {
    "vertieft-zu", "vertieft-aus", "verwandt-mit",
    "korreliert-mit", "operationalisiert", "operationalisiert-durch",
}


class Report:
    def __init__(self, layer):
        self.layer = layer
        self.passes = []
        self.failures = []

    def check(self, condition, message):
        if condition:
            self.passes.append(message)
            print(f"  [PASS] {message}")
        else:
            self.failures.append(message)
            print(f"  [FAIL] {message}")

    def summary(self):
        total = len(self.passes) + len(self.failures)
        print(f"\n[{self.layer}] {len(self.passes)}/{total} Tests bestanden, "
              f"{len(self.failures)} Fehler\n")
        return len(self.failures) == 0


def load_json(name):
    path = DATA_DIR / name
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def section(title):
    print(f"\n=== {title} ===")


# ---------- Schicht 1: lokale Konsistenz ----------

def layer1():
    section("Schicht 1: lokale Konsistenz")
    r = Report("Schicht 1")

    concepts = load_json("concepts.json")
    works = load_json("works.json")
    studies = load_json("studies.json")
    repos = load_json("repositories.json")

    concept_ids = {c["id"] for c in concepts}
    repo_ids = {r["id"] for r in repos}

    r.check(len(concept_ids) == len(concepts), "Konzept-IDs sind eindeutig")
    r.check(len({w["id"] for w in works}) == len(works), "Werk-IDs sind eindeutig")
    r.check(len({s["id"] for s in studies}) == len(studies), "Studien-IDs sind eindeutig")
    r.check(len(repo_ids) == len(repos), "Repositorien-IDs sind eindeutig")

    for c in concepts:
        for field in ("id", "label", "wikidata_qid", "aufnahmegrund",
                      "traditions", "summary", "maturity"):
            r.check(field in c, f"Konzept '{c.get('id', '?')}' hat Feld '{field}'")
        for sub in ("original", "translit", "de", "en"):
            r.check(sub in c.get("label", {}), f"Konzept '{c['id']}' label.{sub} vorhanden")
        r.check(c.get("maturity") in MATURITY_LEVELS,
                f"Konzept '{c['id']}' maturity in {MATURITY_LEVELS}")
        for rel in c.get("related_concepts", []):
            r.check(rel.get("id") in concept_ids,
                    f"Konzept '{c['id']}' related '{rel.get('id')}' existiert")
            r.check(rel.get("relation") in REL_TYPES,
                    f"Konzept '{c['id']}' relation '{rel.get('relation')}' gültig")
        # Lücken-Knoten haben maturity=fehlend und kuratierte Begründung statt empirischer Citation.
        if c.get("maturity") != "fehlend":
            citation = (c.get("aufnahmegrund") or {}).get("citation", "")
            r.check(bool(citation),
                    f"Konzept '{c['id']}' nicht-Lücke hat aufnahmegrund.citation")

    for w in works:
        for cid in w.get("concept_ids", []):
            r.check(cid in concept_ids,
                    f"Werk '{w['id']}' concept_id '{cid}' existiert")
        for rep in w.get("representations", []):
            r.check(rep.get("repository_id") in repo_ids,
                    f"Werk '{w['id']}' repräsentation repository_id '{rep.get('repository_id')}' existiert")
            r.check(rep.get("type") in {"edition", "facsimile"},
                    f"Werk '{w['id']}' repräsentation type gültig")
            r.check("url" in rep, f"Werk '{w['id']}' repräsentation hat url")

    for s in studies:
        r.check(s.get("concept_id") in concept_ids,
                f"Studie '{s['id']}' concept_id '{s.get('concept_id')}' existiert")
        for extra in s.get("additional_concepts", []):
            r.check(extra in concept_ids,
                    f"Studie '{s['id']}' additional_concept '{extra}' existiert")
        r.check(s.get("evidence_type") in EVIDENCE_TYPES,
                f"Studie '{s['id']}' evidence_type in {EVIDENCE_TYPES}")
        r.check(s.get("sample_type") in SAMPLE_TYPES,
                f"Studie '{s['id']}' sample_type in SAMPLE_TYPES")
        r.check(s.get("domain") in DOMAINS,
                f"Studie '{s['id']}' domain in DOMAINS")
        r.check(isinstance(s.get("year"), int),
                f"Studie '{s['id']}' year ist Integer")
        r.check(isinstance(s.get("authors"), list) and len(s["authors"]) > 0,
                f"Studie '{s['id']}' hat Autoren-Liste")
        # Watchlist-Studien (evidence_type: laufend) und no-doi-Fallbacks (Varela 1996)
        # dürfen ohne DOI bleiben; alle anderen brauchen einen DOI.
        if s.get("evidence_type") != "laufend":
            r.check(bool(s.get("doi")), f"Studie '{s['id']}' hat DOI")

    for repo in repos:
        for field in ("id", "label", "url", "wikidata_qid", "tradition_scope"):
            r.check(field in repo, f"Repo '{repo.get('id', '?')}' hat Feld '{field}'")

    return r.summary()


# ---------- Schicht 2: Wikidata-QIDs ----------

def layer2():
    section("Schicht 2: Wikidata-QIDs")
    try:
        import requests
    except ImportError:
        print("  [SKIP] requests nicht installiert (pip install requests)")
        return True

    r = Report("Schicht 2")

    qids = []
    for c in load_json("concepts.json"):
        if c.get("wikidata_qid"):
            qids.append(("Konzept", c["id"], c["wikidata_qid"]))
    for w in load_json("works.json"):
        if w.get("wikidata_qid"):
            qids.append(("Werk", w["id"], w["wikidata_qid"]))
    for repo in load_json("repositories.json"):
        if repo.get("wikidata_qid"):
            qids.append(("Repo", repo["id"], repo["wikidata_qid"]))

    headers = {
        "User-Agent": "CONTEXT-validate/0.1 (https://github.com/DigitalHumanitiesCraft/context)",
    }

    for kind, local_id, qid in qids:
        url = f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"
        try:
            resp = requests.get(url, headers=headers, timeout=30)
            ok = resp.status_code == 200
            if ok:
                data = resp.json()
                entity = data.get("entities", {}).get(qid, {})
                labels = entity.get("labels", {})
                has_label = bool(labels.get("en") or labels.get("de"))
                r.check(has_label, f"{kind} '{local_id}' QID {qid} existiert und hat Label")
            else:
                r.check(False, f"{kind} '{local_id}' QID {qid} HTTP {resp.status_code}")
        except requests.RequestException as err:
            r.check(False, f"{kind} '{local_id}' QID {qid} Netzfehler: {err}")

    return r.summary()


# ---------- Schicht 3: URL-Lebenszeichen ----------

def layer3():
    section("Schicht 3: URL-Lebenszeichen")
    try:
        import requests
    except ImportError:
        print("  [SKIP] requests nicht installiert (pip install requests)")
        return True

    r = Report("Schicht 3")

    urls = []
    for w in load_json("works.json"):
        for rep in w.get("representations", []):
            if rep.get("url"):
                urls.append(("Werk-Repr", w["id"], rep["url"]))
    for repo in load_json("repositories.json"):
        if repo.get("url"):
            urls.append(("Repo", repo["id"], repo["url"]))

    headers = {"User-Agent": "CONTEXT-validate/0.1"}
    ok_codes = {200, 301, 302, 303, 307, 308}

    for kind, local_id, url in urls:
        try:
            resp = requests.head(url, headers=headers, timeout=15, allow_redirects=True)
            r.check(resp.status_code in ok_codes,
                    f"{kind} '{local_id}' {url} HTTP {resp.status_code}")
        except requests.RequestException as err:
            r.check(False, f"{kind} '{local_id}' {url} Netzfehler: {type(err).__name__}")

    return r.summary()


# ---------- main ----------

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--wikidata", action="store_true", help="Schicht 2 ausführen")
    p.add_argument("--urls", action="store_true", help="Schicht 3 ausführen")
    p.add_argument("--all", action="store_true", help="alle Schichten ausführen")
    args = p.parse_args()

    run_wikidata = args.wikidata or args.all
    run_urls = args.urls or args.all

    l1 = layer1()
    if not l1:
        return 1

    l2 = layer2() if run_wikidata else True
    if not l2:
        return 2

    l3 = layer3() if run_urls else True
    if not l3:
        return 3

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
