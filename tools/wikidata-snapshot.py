#!/usr/bin/env python3
"""
wikidata-snapshot.py — kontrollierte SPARQL-Abfragen gegen Wikidata.

Liest alle .rq-Dateien aus data/queries/, schickt sie gegen den
Wikidata-SPARQL-Endpunkt und schreibt das Ergebnis als versionierten
JSON-Snapshot nach data/wikidata-snapshots/<DATUM>-<name>.json. Aktualisiert
data/wikidata-snapshots/manifest.json mit den geschriebenen Dateien.

Verwendung:
    python tools/wikidata-snapshot.py                    # alle Queries
    python tools/wikidata-snapshot.py concept-labels     # nur eine Query

Voraussetzungen:
    pip install requests
"""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlencode

import requests

ENDPOINT = "https://query.wikidata.org/sparql"
USER_AGENT = (
    "CONTEXT-Wikidata-Snapshot/0.1 "
    "(https://github.com/DigitalHumanitiesCraft/context)"
)
TIMEOUT_SECONDS = 60

REPO_ROOT = Path(__file__).resolve().parent.parent
QUERIES_DIR = REPO_ROOT / "data" / "queries"
SNAPSHOTS_DIR = REPO_ROOT / "data" / "wikidata-snapshots"
MANIFEST_PATH = SNAPSHOTS_DIR / "manifest.json"


def load_query(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def run_query(sparql: str) -> dict:
    response = requests.get(
        ENDPOINT,
        params={"query": sparql, "format": "json"},
        headers={"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"},
        timeout=TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json()


def snapshot_filename(query_name: str, today: str) -> str:
    return f"{today}-{query_name}.json"


def write_snapshot(target: Path, payload: dict) -> None:
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def update_manifest(entries: list[dict]) -> None:
    if MANIFEST_PATH.exists():
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    else:
        manifest = {"snapshots": []}

    by_file = {item["file"]: item for item in manifest.get("snapshots", [])}
    for entry in entries:
        by_file[entry["file"]] = entry

    manifest["snapshots"] = sorted(by_file.values(), key=lambda item: item["file"], reverse=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def main(argv: list[str]) -> int:
    if not QUERIES_DIR.is_dir():
        print(f"Queries-Ordner nicht gefunden: {QUERIES_DIR}", file=sys.stderr)
        return 1

    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)

    query_files = sorted(QUERIES_DIR.glob("*.rq"))
    if not query_files:
        print(f"Keine .rq-Dateien gefunden in {QUERIES_DIR}", file=sys.stderr)
        return 1

    filter_name = argv[1] if len(argv) > 1 else None
    if filter_name:
        query_files = [path for path in query_files if path.stem == filter_name]
        if not query_files:
            print(f"Keine Query mit Namen {filter_name} gefunden.", file=sys.stderr)
            return 1

    today = date.today().isoformat()
    manifest_entries: list[dict] = []

    for query_path in query_files:
        name = query_path.stem
        print(f"[{name}] sende Query an {ENDPOINT} ...")
        sparql = load_query(query_path)
        try:
            payload = run_query(sparql)
        except requests.RequestException as error:
            print(f"[{name}] Fehler: {error}", file=sys.stderr)
            return 2

        filename = snapshot_filename(name, today)
        target = SNAPSHOTS_DIR / filename
        write_snapshot(target, payload)
        bindings_count = len(payload.get("results", {}).get("bindings", []))
        print(f"[{name}] {bindings_count} Ergebnisse geschrieben nach {target.name}")

        manifest_entries.append(
            {
                "file": filename,
                "query": query_path.name,
                "date": today,
                "endpoint": ENDPOINT,
                "status": "live",
                "bindings": bindings_count,
            }
        )

    update_manifest(manifest_entries)
    print(f"Manifest aktualisiert: {MANIFEST_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
