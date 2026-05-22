#!/usr/bin/env python3
"""
scholarly-harvest.py — kontrollierte Anreicherung von Studien- und
Referenzdaten gegen Crossref, Unpaywall und OpenAlex.

Liest data/seeds.json, fragt pro DOI drei offene APIs ab und schreibt das
Ergebnis als datierten Snapshot nach
data/scholarly-snapshots/<DATUM>-scholarly.json. Trennt strikt zwischen
'curated' (kuratorisch entschiedene Felder aus den lokalen JSONs) und
'harvested' (aus APIs geholte Felder). Re-Harvest überschreibt keine
Kuration.

Verwendung:
    python tools/scholarly-harvest.py                       # live
    python tools/scholarly-harvest.py --offline             # gegen Fixtures
    python tools/scholarly-harvest.py --offline --dry-run   # ohne Schreiben

Voraussetzungen für den Live-Modus:
    pip install requests
    Umgebungsvariable UNPAYWALL_EMAIL muss gesetzt sein (Unpaywall verlangt
    einen E-Mail-Kontakt pro Anfrage).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent
SEEDS_PATH = REPO_ROOT / "data" / "seeds.json"
CONCEPTS_PATH = REPO_ROOT / "data" / "concepts.json"
STUDIES_PATH = REPO_ROOT / "data" / "studies.json"
REFERENCES_PATH = REPO_ROOT / "data" / "references.json"
SNAPSHOTS_DIR = REPO_ROOT / "data" / "scholarly-snapshots"
MANIFEST_PATH = SNAPSHOTS_DIR / "manifest.json"
FIXTURES_PATH = REPO_ROOT / "data" / "fixtures" / "responses.json"

USER_AGENT = (
    "CONTEXT-Scholarly-Harvest/0.1 "
    "(https://github.com/DigitalHumanitiesCraft/context)"
)
TIMEOUT_SECONDS = 30

CROSSREF_BASE = "https://api.crossref.org/works/"
UNPAYWALL_BASE = "https://api.unpaywall.org/v2/"
OPENALEX_BASE = "https://api.openalex.org/works/doi:"

CURATED_FIELDS_STUDY = (
    "concept_id", "additional_concepts", "evidence_type", "provenance",
    "summary", "method", "sample_type", "n", "domain"
)
CURATED_FIELDS_REFERENCE = (
    "concepts_anchored", "core_thesis", "type", "doi_status", "doi_note"
)


def load_json(path: Path) -> dict | list:
    return json.loads(path.read_text(encoding="utf-8"))


def fetch_crossref(doi: str, http) -> Optional[dict]:
    response = http.get(
        CROSSREF_BASE + doi,
        headers={"User-Agent": USER_AGENT},
        timeout=TIMEOUT_SECONDS,
    )
    if response.status_code == 404:
        return None
    response.raise_for_status()
    return response.json().get("message")


def fetch_unpaywall(doi: str, email: str, http) -> Optional[dict]:
    response = http.get(
        UNPAYWALL_BASE + doi,
        params={"email": email},
        headers={"User-Agent": USER_AGENT},
        timeout=TIMEOUT_SECONDS,
    )
    if response.status_code == 404:
        return None
    response.raise_for_status()
    return response.json()


def fetch_openalex(doi: str, http) -> Optional[dict]:
    response = http.get(
        OPENALEX_BASE + doi,
        headers={"User-Agent": USER_AGENT},
        timeout=TIMEOUT_SECONDS,
    )
    if response.status_code == 404:
        return None
    response.raise_for_status()
    return response.json()


def project_crossref(payload: dict | None) -> dict:
    if payload is None:
        return {"status": "missing"}
    title = (payload.get("title") or [None])[0]
    container = (payload.get("container-title") or [None])[0]
    authors_raw = payload.get("author") or []
    authors = []
    for author in authors_raw:
        given = author.get("given", "").strip()
        family = author.get("family", "").strip()
        if family:
            authors.append(f"{family}, {given}".rstrip(", "))
        elif author.get("name"):
            authors.append(author["name"])
    issued = payload.get("issued", {}).get("date-parts", [[None]])[0]
    year = issued[0] if issued else None
    return {
        "status": "ok",
        "title": title,
        "journal": container,
        "authors": authors,
        "year": year,
        "volume": payload.get("volume"),
        "issue": payload.get("issue"),
        "page": payload.get("page"),
        "publisher": payload.get("publisher"),
        "is_referenced_by_count": payload.get("is-referenced-by-count"),
        "type": payload.get("type"),
    }


def project_unpaywall(payload: dict | None) -> dict:
    if payload is None:
        return {"status": "missing"}
    best_oa = payload.get("best_oa_location") or {}
    return {
        "status": "ok",
        "is_oa": payload.get("is_oa"),
        "oa_status": payload.get("oa_status"),
        "best_oa_url": best_oa.get("url"),
        "best_oa_license": best_oa.get("license"),
        "best_oa_version": best_oa.get("version"),
    }


def project_openalex(payload: dict | None) -> dict:
    if payload is None:
        return {"status": "missing"}
    referenced = payload.get("referenced_works") or []
    related = payload.get("related_works") or []
    return {
        "status": "ok",
        "openalex_id": payload.get("id"),
        "cited_by_count": payload.get("cited_by_count"),
        "referenced_works_count": len(referenced),
        "related_works": related[:10],
        "concepts": [
            {"display_name": c.get("display_name"), "score": c.get("score")}
            for c in (payload.get("concepts") or [])[:5]
        ],
    }


def derive_flags(seed: dict, crossref: dict, harvested: dict) -> list[str]:
    flags = list(seed.get("flags") or [])
    if crossref.get("status") == "missing":
        if seed.get("doi") is not None:
            flags.append("crossref-missing")
    if harvested["unpaywall"].get("status") == "missing":
        if seed.get("doi") is not None:
            flags.append("unpaywall-missing")
    if harvested["openalex"].get("status") == "missing":
        if seed.get("doi") is not None:
            flags.append("openalex-missing")

    if seed.get("doi") and seed["kind"] == "study":
        curated = _find_curated_study(seed.get("study_id"))
        if curated and crossref.get("authors"):
            curated_authors = curated.get("authors") or []
            harvested_authors = crossref["authors"]
            if curated_authors and harvested_authors:
                cs = {_last_name(a) for a in curated_authors}
                hs = {_last_name(a) for a in harvested_authors}
                if cs != hs:
                    flags.append("author-set-mismatch")
                elif curated_authors != harvested_authors:
                    flags.append("author-order-mismatch")
    return sorted(set(flags))


def _last_name(author: str) -> str:
    return author.split(",")[0].strip().lower()


_CURATED_STUDIES_CACHE: list[dict] | None = None


def _find_curated_study(study_id: str | None) -> dict | None:
    global _CURATED_STUDIES_CACHE
    if _CURATED_STUDIES_CACHE is None:
        if STUDIES_PATH.exists():
            _CURATED_STUDIES_CACHE = load_json(STUDIES_PATH)  # type: ignore[assignment]
        else:
            _CURATED_STUDIES_CACHE = []
    if not study_id or _CURATED_STUDIES_CACHE is None:
        return None
    for item in _CURATED_STUDIES_CACHE:
        if item.get("id") == study_id:
            return item
    return None


def detect_gaps(seeds: list[dict], concepts: list[dict]) -> dict:
    """Vergleicht maturity-Werte mit der Saat-Coverage."""
    by_concept: dict[str, list[dict]] = {c["id"]: [] for c in concepts}
    for seed in seeds:
        if seed["kind"] != "study":
            continue
        by_concept.setdefault(seed["concept_id"], []).append(seed)
        for ac in seed.get("additional_concepts", []):
            by_concept.setdefault(ac, []).append(seed)

    true_gaps = []
    seed_incomplete = []
    consistent = []
    for c in concepts:
        seeds_for = by_concept.get(c["id"], [])
        maturity = c.get("maturity")
        if maturity == "fehlend":
            if seeds_for:
                seed_incomplete.append({
                    "concept_id": c["id"],
                    "maturity": maturity,
                    "kind": "fehlend-aber-saaten-vorhanden",
                    "seed_count": len(seeds_for),
                    "note": "Maturity sagt fehlend, aber Saaten existieren. Maturity prüfen oder Saaten umetikettieren.",
                })
            else:
                true_gaps.append({
                    "concept_id": c["id"],
                    "maturity": maturity,
                    "kind": "echte-luecke",
                })
        else:
            if not seeds_for:
                seed_incomplete.append({
                    "concept_id": c["id"],
                    "maturity": maturity,
                    "kind": "maturity-behauptet-evidenz-saaten-fehlen",
                    "seed_count": 0,
                    "note": "Maturity behauptet Evidenz, aber keine Saaten in seeds.json.",
                })
            else:
                consistent.append({"concept_id": c["id"], "maturity": maturity, "seed_count": len(seeds_for)})
    return {
        "true_gaps": true_gaps,
        "seed_incomplete": seed_incomplete,
        "consistent": consistent,
    }


def load_fixtures() -> dict:
    if not FIXTURES_PATH.exists():
        return {"crossref": {}, "unpaywall": {}, "openalex": {}}
    return load_json(FIXTURES_PATH)  # type: ignore[return-value]


def fixture_get(fixtures: dict, api: str, doi: str | None) -> Optional[dict]:
    if doi is None:
        return None
    return fixtures.get(api, {}).get(doi)


def update_manifest(entry: dict) -> None:
    if MANIFEST_PATH.exists():
        manifest = load_json(MANIFEST_PATH)
    else:
        manifest = {"snapshots": []}
    by_file = {item["file"]: item for item in manifest.get("snapshots", [])}
    by_file[entry["file"]] = entry
    manifest["snapshots"] = sorted(by_file.values(), key=lambda x: x["file"], reverse=True)
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--offline", action="store_true",
                        help="Liest aus data/fixtures/responses.json statt aus dem Netz.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Schreibt keinen Snapshot, gibt das Ergebnis auf stdout aus.")
    parser.add_argument("--seed", default=None,
                        help="Nur eine bestimmte seed_id verarbeiten (z. B. zum Debug).")
    args = parser.parse_args(argv[1:])

    if not SEEDS_PATH.exists():
        print(f"Saat-Datei nicht gefunden: {SEEDS_PATH}", file=sys.stderr)
        return 1
    if not CONCEPTS_PATH.exists():
        print(f"Concepts-Datei nicht gefunden: {CONCEPTS_PATH}", file=sys.stderr)
        return 1

    seeds_doc = load_json(SEEDS_PATH)
    seeds = seeds_doc.get("seeds", [])  # type: ignore[union-attr]
    concepts = load_json(CONCEPTS_PATH)

    if args.seed:
        seeds = [s for s in seeds if s["seed_id"] == args.seed]
        if not seeds:
            print(f"Saat {args.seed!r} nicht in seeds.json gefunden.", file=sys.stderr)
            return 1

    http = None
    fixtures = {}
    if args.offline:
        fixtures = load_fixtures()
    else:
        try:
            import requests  # type: ignore
        except ImportError:
            print("Live-Modus braucht 'requests'. pip install requests, oder --offline benutzen.",
                  file=sys.stderr)
            return 1
        email = os.environ.get("UNPAYWALL_EMAIL")
        if not email:
            print("UNPAYWALL_EMAIL Umgebungsvariable muss im Live-Modus gesetzt sein.",
                  file=sys.stderr)
            return 1
        http = requests.Session()

    records = []
    for seed in seeds:
        doi = seed.get("doi")
        record = {
            "seed_id": seed["seed_id"],
            "doi": doi,
            "kind": seed["kind"],
            "curated": {
                "concept_id": seed.get("concept_id"),
                "additional_concepts": seed.get("additional_concepts", []),
                "study_id": seed.get("study_id"),
                "reference_id": seed.get("reference_id"),
                "parent_reference_id": seed.get("parent_reference_id"),
                "fallback_url": seed.get("fallback_url"),
            },
            "harvested": {},
            "flags": [],
        }

        if args.offline:
            crossref_raw = fixture_get(fixtures, "crossref", doi)
            unpaywall_raw = fixture_get(fixtures, "unpaywall", doi)
            openalex_raw = fixture_get(fixtures, "openalex", doi)
        elif doi is None:
            crossref_raw = unpaywall_raw = openalex_raw = None
        else:
            email = os.environ["UNPAYWALL_EMAIL"]
            try:
                crossref_raw = fetch_crossref(doi, http)
                unpaywall_raw = fetch_unpaywall(doi, email, http)
                openalex_raw = fetch_openalex(doi, http)
            except Exception as error:  # noqa: BLE001
                print(f"[{seed['seed_id']}] API-Fehler: {error}", file=sys.stderr)
                record["flags"].append("api-error")
                crossref_raw = unpaywall_raw = openalex_raw = None

        crossref_proj = project_crossref(crossref_raw)
        record["harvested"] = {
            "crossref": crossref_proj,
            "unpaywall": project_unpaywall(unpaywall_raw),
            "openalex": project_openalex(openalex_raw),
        }
        record["flags"] = derive_flags(seed, crossref_proj, record["harvested"])
        records.append(record)

    gaps = detect_gaps(seeds, concepts)
    today = date.today().isoformat()
    snapshot = {
        "snapshot_date": today,
        "snapshot_mode": "offline-fixtures" if args.offline else "live-apis",
        "seeds_total": len(seeds),
        "records": records,
        "gap_report": gaps,
        "endpoints": {
            "crossref": CROSSREF_BASE,
            "unpaywall": UNPAYWALL_BASE,
            "openalex": OPENALEX_BASE,
        },
        "policy": {
            "curated_fields_study": list(CURATED_FIELDS_STUDY),
            "curated_fields_reference": list(CURATED_FIELDS_REFERENCE),
            "rule": "Re-Harvest überschreibt keine kuratierten Felder. Konflikte werden als Flag ausgewiesen.",
        },
    }

    if args.dry_run:
        json.dump(snapshot, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0

    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{today}-scholarly.json"
    target = SNAPSHOTS_DIR / filename
    target.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    update_manifest({
        "file": filename,
        "date": today,
        "mode": snapshot["snapshot_mode"],
        "seeds_total": snapshot["seeds_total"],
        "true_gaps": len(gaps["true_gaps"]),
        "seed_incomplete": len(gaps["seed_incomplete"]),
    })
    print(f"Snapshot geschrieben: {target}")
    print(f"  Saaten: {len(seeds)}")
    print(f"  Echte Lücken: {len(gaps['true_gaps'])}")
    print(f"  Saat-Unvollständigkeit: {len(gaps['seed_incomplete'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
