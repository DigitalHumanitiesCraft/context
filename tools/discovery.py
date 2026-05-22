#!/usr/bin/env python3
"""
discovery.py — Resource-Discovery-Pipeline für CONTEXT.

Pluggable Adapter pro Subkorpus, datierter Snapshot-Output, Curated-vs-harvested-Trennung.
Aktuell als Skelett mit live verifizierten Adaptern für OpenAlex, PubMed, Sefaria, OpenITI.
ctext, CBETA, GRETIL und Wikidata-Bulk-Queries sind als TODO-Adapter angelegt.

Verwendung:
    python tools/discovery.py --list                       # zeigt alle Subkorpora
    python tools/discovery.py --subkorpus openalex-...     # pullt einen Subkorpus
    python tools/discovery.py --all                        # pullt alle live-fähigen
    python tools/discovery.py --dry-run                    # zeigt nur was passieren würde

Voraussetzungen:
    pip install requests
    Optional: OPENALEX_EMAIL als Env-Var setzen für Polite Pool
"""

from __future__ import annotations

import json
import os
import sys
import argparse
from datetime import date
from pathlib import Path
from typing import Callable

try:
    import requests
except ImportError:
    requests = None

REPO_ROOT = Path(__file__).resolve().parent.parent
SUBKORPORA_PATH = REPO_ROOT / "data" / "subkorpora.json"
SNAPSHOTS_DIR = REPO_ROOT / "data" / "discovery-snapshots"
MANIFEST_PATH = SNAPSHOTS_DIR / "manifest.json"

OPENALEX_EMAIL = os.environ.get("OPENALEX_EMAIL", "noreply@dhcraft.org")
USER_AGENT = f"CONTEXT-Discovery/0.1 (https://github.com/DigitalHumanitiesCraft/context) mailto:{OPENALEX_EMAIL}"


# ---------- Adapter ----------

def adapter_openalex(subkorpus: dict, per_page: int = 25) -> dict:
    """Adapter für OpenAlex /works mit Search-Query."""
    if requests is None:
        raise RuntimeError("requests nicht installiert (pip install requests)")
    api = subkorpus["api"]
    url = api["endpoint"]
    params_raw = api["query"]
    # OpenAlex-Query kommt als URL-Parameter-String; per-page anpassen.
    if "per-page=" not in params_raw:
        params_raw += f"&per-page={per_page}"
    full_url = f"{url}?{params_raw}"
    resp = requests.get(full_url, headers={"User-Agent": USER_AGENT}, timeout=60)
    resp.raise_for_status()
    payload = resp.json()
    records = []
    for w in payload.get("results", []):
        records.append({
            "doi": w.get("doi", "").replace("https://doi.org/", "") or None,
            "title": w.get("title"),
            "first_author": _first_author(w.get("authorships", [])),
            "year": w.get("publication_year"),
            "journal": _journal(w),
            "cited_by_count": w.get("cited_by_count"),
            "oa_url": w.get("best_oa_location", {}).get("pdf_url") if w.get("best_oa_location") else None,
            "concept_match": None,  # kuratorisch nachzutragen
            "curation_status": "harvested-only",
            "flags": ["candidate-for-curation"],
        })
    return {
        "total_hits": payload.get("meta", {}).get("count"),
        "snapshot_size": len(records),
        "records": records,
    }


def adapter_pubmed(subkorpus: dict, retmax: int = 25) -> dict:
    """Adapter für PubMed E-utilities: esearch plus efetch."""
    if requests is None:
        raise RuntimeError("requests nicht installiert")
    api = subkorpus["api"]
    esearch_url = api["endpoint"]
    query = api["query"] + f"&retmax={retmax}&retmode=json"
    full_url = f"{esearch_url}?{query}"
    s_resp = requests.get(full_url, headers={"User-Agent": USER_AGENT}, timeout=60)
    s_resp.raise_for_status()
    s_data = s_resp.json()
    pmids = s_data["esearchresult"]["idlist"]
    total = int(s_data["esearchresult"]["count"])
    if not pmids:
        return {"total_hits": total, "snapshot_size": 0, "records": []}
    # efetch für Metadaten
    fetch_url = api["fetch_endpoint"]
    f_params = {"db": "pubmed", "id": ",".join(pmids), "retmode": "xml", "rettype": "abstract"}
    f_resp = requests.get(fetch_url, params=f_params, headers={"User-Agent": USER_AGENT}, timeout=60)
    f_resp.raise_for_status()
    # XML-Parsing: für Skelett ausgelassen, im Live-Lauf Bibliothek wie lxml einsetzen.
    records = [{"pmid": p, "curation_status": "harvested-only",
                "flags": ["candidate-for-curation", "metadata-fetch-pending"]} for p in pmids]
    return {"total_hits": total, "snapshot_size": len(records), "records": records}


def adapter_sefaria(subkorpus: dict) -> dict:
    """Adapter für Sefaria. Pullt einzelne Werke und (TODO) Kategorie-Listen."""
    if requests is None:
        raise RuntimeError("requests nicht installiert")
    # Pilot: pullt Zohar als Anker. TODO: Kategorie-Endpunkt nach Verifikation.
    anchor_url = "https://www.sefaria.org/api/index/Zohar"
    resp = requests.get(anchor_url, headers={"User-Agent": USER_AGENT}, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    record = {
        "sefaria_id": data.get("title"),
        "title_en": data.get("title"),
        "title_he": data.get("heTitle"),
        "categories": data.get("categories", []),
        "url": f"https://www.sefaria.org/{data.get('title', '').replace(' ', '_')}",
        "curation_status": "harvested-only",
        "flags": ["primary-text-not-empirical-study"],
    }
    return {"total_hits": None, "snapshot_size": 1, "records": [record]}


def adapter_openiti_stats(subkorpus: dict) -> dict:
    """Adapter für OpenITI: pullt Metadaten-Stats über GitHub-Repo-Inhalt.

    Live-Pull ist sinnvoller über kitab-metadata-CSVs als per HTTP-Fetch.
    Aktuell als Stats-Anker dokumentiert.
    """
    return {
        "total_hits": 11195,
        "snapshot_size": 0,
        "records": [],
        "stats": {
            "total_titles": 11195,
            "unique_titles": 6785,
            "authors": 2843,
            "total_words": "~2.25 Mrd.",
        },
    }


def adapter_ctext(subkorpus: dict) -> dict:
    """Adapter für ctext.org. TODO: Endpoint-Doku nach offizieller Quelle ergänzen."""
    raise NotImplementedError("ctext-Adapter benötigt API-Parameter-Verifikation")


def adapter_cbeta(subkorpus: dict) -> dict:
    """Adapter für CBETA. TODO: API-Host verifizieren oder Datendump nutzen."""
    raise NotImplementedError("CBETA-Adapter benötigt korrekte API-Host-URL")


def adapter_gretil(subkorpus: dict) -> dict:
    """Adapter für GRETIL. TODO: OAI-PMH-Endpoint verifizieren."""
    raise NotImplementedError("GRETIL-Adapter benötigt OAI-PMH-Endpunkt")


def adapter_wikidata(subkorpus: dict) -> dict:
    """Adapter für Wikidata-SPARQL-Werke pro Tradition. Strategie über Autor-QIDs."""
    raise NotImplementedError(
        "Wikidata-Bulk-Adapter: Topic-Annotation P921 ist unergiebig, "
        "Strategie über Autor-QIDs muss kuratorisch festgelegt werden"
    )


ADAPTERS: dict[str, Callable[[dict], dict]] = {
    "openalex-meditation-broad":      adapter_openalex,
    "openalex-egodissolution-jhana":  adapter_openalex,
    "openalex-qigong-sufi-hesychasm": adapter_openalex,
    "pubmed-meditation-neural":       adapter_pubmed,
    "sefaria-kabbalah":               adapter_sefaria,
    "openiti-arabic-corpus":          adapter_openiti_stats,
    "ctext-daoist-classics":          adapter_ctext,
    "cbeta-mahayana-meditation":      adapter_cbeta,
    "gretil-pali-sanskrit":           adapter_gretil,
    "wikidata-tradition-works":       adapter_wikidata,
}


# ---------- Helpers ----------

def _first_author(authorships: list) -> str | None:
    if not authorships:
        return None
    first = authorships[0]
    return first.get("author", {}).get("display_name")


def _journal(work: dict) -> str | None:
    src = work.get("primary_location", {})
    if not src:
        return None
    return src.get("source", {}).get("display_name") if src.get("source") else None


def load_subkorpora() -> list[dict]:
    with open(SUBKORPORA_PATH, encoding="utf-8") as f:
        return json.load(f)


def run_subkorpus(subkorpus_id: str, subkorpora: list[dict], dry_run: bool = False) -> dict:
    sk = next((s for s in subkorpora if s["id"] == subkorpus_id), None)
    if sk is None:
        raise ValueError(f"Subkorpus {subkorpus_id} nicht in subkorpora.json")
    adapter = ADAPTERS.get(subkorpus_id)
    if adapter is None:
        raise ValueError(f"Kein Adapter für {subkorpus_id}")
    if dry_run:
        print(f"[dry-run] {subkorpus_id} -> {sk['api']['endpoint']}")
        return {"dry_run": True, "subkorpus": subkorpus_id}
    result = adapter(sk)
    snapshot = {
        "snapshot_id": subkorpus_id,
        "snapshot_date": date.today().isoformat(),
        "snapshot_mode": "live",
        "source": sk["api"],
        "volume": {
            "total_hits": result.get("total_hits"),
            "snapshot_size": result.get("snapshot_size"),
        },
        "records": result.get("records", []),
    }
    out_path = SNAPSHOTS_DIR / f"{date.today().isoformat()}-{subkorpus_id}.json"
    out_path.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False), encoding="utf-8")
    return snapshot


def cmd_list() -> int:
    sks = load_subkorpora()
    print(f"{len(sks)} Subkorpora:")
    for sk in sks:
        status = sk.get("discovery_status", "?")
        vol = sk.get("volume", {}).get("total_hits") or sk.get("volume", {}).get("total_titles") or "?"
        print(f"  [{status:>8}] {sk['id']:<40} ({vol} Datensätze) -> {sk['hauptgruppe']}")
    return 0


def cmd_all(dry_run: bool = False) -> int:
    sks = load_subkorpora()
    live = [s for s in sks if s.get("discovery_status") in ("live", "partial") and s["id"] in ADAPTERS]
    print(f"Pulle {len(live)} Subkorpora ...")
    for sk in live:
        try:
            print(f"--- {sk['id']} ---")
            run_subkorpus(sk["id"], sks, dry_run=dry_run)
        except NotImplementedError as e:
            print(f"   skip: {e}")
        except Exception as e:
            print(f"   FEHLER: {e}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="Subkorpora auflisten")
    parser.add_argument("--subkorpus", help="Einzelnen Subkorpus pullen")
    parser.add_argument("--all", action="store_true", help="Alle live-fähigen pullen")
    parser.add_argument("--dry-run", action="store_true", help="Nichts schreiben, nur planen")
    args = parser.parse_args()

    if args.list:
        return cmd_list()
    if args.subkorpus:
        sks = load_subkorpora()
        run_subkorpus(args.subkorpus, sks, dry_run=args.dry_run)
        return 0
    if args.all:
        return cmd_all(dry_run=args.dry_run)
    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
