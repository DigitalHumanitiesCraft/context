// data-loader.js
// Lädt alle JSON-Dateien, das Wikidata-Snapshot-Manifest und baut In-Memory-Indizes
// mit Querverweisen. Single-Page-Explorer-Variante.

const SOURCES = {
  concepts:     "data/concepts.json",
  works:        "data/works.json",
  studies:      "data/studies.json",
  repositories: "data/repositories.json",
  references:   "data/references.json",
  subkorpora:   "data/subkorpora.json",
};
const WIKIDATA_MANIFEST = "data/wikidata-snapshots/manifest.json";
const SCHOLARLY_MANIFEST = "data/scholarly-snapshots/manifest.json";
const DISCOVERY_MANIFEST = "data/discovery-snapshots/manifest.json";

async function fetchJson(url, { optional = false } = {}) {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      if (optional) return null;
      throw new Error(`Konnte ${url} nicht laden (HTTP ${res.status})`);
    }
    return await res.json();
  } catch (err) {
    if (optional) return null;
    throw err;
  }
}

export async function loadAll() {
  const [concepts, works, studies, repositories, references, subkorpora, wikidataManifest, scholarlyManifest, discoveryManifest] = await Promise.all([
    fetchJson(SOURCES.concepts),
    fetchJson(SOURCES.works),
    fetchJson(SOURCES.studies),
    fetchJson(SOURCES.repositories),
    fetchJson(SOURCES.references),
    fetchJson(SOURCES.subkorpora, { optional: true }),
    fetchJson(WIKIDATA_MANIFEST, { optional: true }),
    fetchJson(SCHOLARLY_MANIFEST, { optional: true }),
    fetchJson(DISCOVERY_MANIFEST, { optional: true }),
  ]);

  const repoById = new Map(repositories.map(r => [r.id, r]));

  for (const w of works) {
    w.representations = (w.representations || []).map(rep => ({
      ...rep,
      repository: repoById.get(rep.repository_id) || null,
    }));
  }

  const worksByConcept = new Map();
  for (const w of works) {
    for (const cid of (w.concept_ids || [])) {
      if (!worksByConcept.has(cid)) worksByConcept.set(cid, []);
      worksByConcept.get(cid).push(w);
    }
  }

  const studiesByConcept = new Map();
  function attachStudyToConcept(study, cid) {
    if (!studiesByConcept.has(cid)) studiesByConcept.set(cid, []);
    studiesByConcept.get(cid).push(study);
  }
  for (const s of studies) {
    if (s.concept_id) attachStudyToConcept(s, s.concept_id);
    for (const extra of (s.additional_concepts || [])) attachStudyToConcept(s, extra);
  }
  for (const list of studiesByConcept.values()) {
    list.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  const worksByRepo = new Map();
  for (const w of works) {
    for (const rep of (w.representations || [])) {
      if (!rep.repository_id) continue;
      if (!worksByRepo.has(rep.repository_id)) worksByRepo.set(rep.repository_id, []);
      worksByRepo.get(rep.repository_id).push({ work: w, representation: rep });
    }
  }

  const referencesByConcept = new Map();
  for (const ref of references) {
    for (const cid of (ref.concepts_anchored || [])) {
      if (!referencesByConcept.has(cid)) referencesByConcept.set(cid, []);
      referencesByConcept.get(cid).push(ref);
    }
  }

  for (const c of concepts) {
    c.works = worksByConcept.get(c.id) || [];
    c.studies = studiesByConcept.get(c.id) || [];
    c.references = referencesByConcept.get(c.id) || [];
  }

  const conceptById = new Map(concepts.map(c => [c.id, c]));
  const studyById = new Map(studies.map(s => [s.id, s]));
  const workById = new Map(works.map(w => [w.id, w]));
  const referenceById = new Map(references.map(r => [r.id, r]));

  for (const c of concepts) {
    for (const rel of (c.related_concepts || [])) {
      rel.target = conceptById.get(rel.id) || null;
    }
  }

  // Tradition als Aggregat (Iteration 1, kein eigener Knotentyp)
  const traditions = aggregateTraditions(concepts);

  // Coverage-Karte sortiert nach Reifegrad
  const maturityOrder = { etabliert: 0, "berührt": 1, beginnend: 2, fehlend: 3 };
  const coverage = traditions.slice().sort((a, b) => {
    const ma = maturityOrder[a.dominant_maturity] ?? 9;
    const mb = maturityOrder[b.dominant_maturity] ?? 9;
    if (ma !== mb) return ma - mb;
    return a.label.localeCompare(b.label, "de");
  });

  // Snapshot-Datum aus Wikidata-Manifest (jüngstes)
  const wikidataLatest = (wikidataManifest?.snapshots || [])
    .map(s => s.date)
    .sort()
    .pop() || null;
  const scholarlyLatest = (scholarlyManifest?.snapshots || [])
    .map(s => s.date)
    .sort()
    .pop() || null;

  const subkorporaList = subkorpora || [];
  const subkorpusById = new Map(subkorporaList.map(s => [s.id, s]));
  const subkorporaByHauptgruppe = new Map();
  for (const sk of subkorporaList) {
    const hg = sk.hauptgruppe;
    if (!subkorporaByHauptgruppe.has(hg)) subkorporaByHauptgruppe.set(hg, []);
    subkorporaByHauptgruppe.get(hg).push(sk);
  }
  const subkorporaByConcept = new Map();
  for (const sk of subkorporaList) {
    for (const cid of (sk.concepts || [])) {
      if (cid === "alle") continue;
      if (!subkorporaByConcept.has(cid)) subkorporaByConcept.set(cid, []);
      subkorporaByConcept.get(cid).push(sk);
    }
  }

  return {
    concepts,
    works,
    studies,
    repositories,
    references,
    subkorpora: subkorporaList,
    conceptById,
    workById,
    studyById,
    repoById,
    referenceById,
    subkorpusById,
    subkorporaByHauptgruppe,
    subkorporaByConcept,
    worksByConcept,
    studiesByConcept,
    worksByRepo,
    referencesByConcept,
    traditions,
    coverage,
    snapshot: {
      wikidata: wikidataLatest,
      scholarly: scholarlyLatest,
    },
  };
}

// Mapping der feinen Tradition-Strings auf sieben Hauptgruppen für die Coverage-Karte.
// Kuratierte Entscheidung 2026-05-22, dokumentiert in knowledge/tradition-hauptgruppen.md.
const TRADITION_HAUPTGRUPPEN = {
  "Theravāda":                       "Buddhismus",
  "Pali-Buddhismus":                 "Buddhismus",
  "Dzogchen":                        "Buddhismus",
  "Zen":                             "Buddhismus",
  "Christliche Mystik":              "Christentum",
  "Orthodoxes Christentum":          "Christentum",
  "Sufismus":                        "Islam",
  "Islamische Mystik":               "Islam",
  "Daoismus":                        "Daoismus",
  "Chinesische Innere Kultivierung": "Daoismus",
  "Esoterischer Daoismus":           "Daoismus",
  "Kabbala":                         "Judentum",
  "Chassidismus":                    "Judentum",
  "Jüdische Mystik":                 "Judentum",
  "Advaita Vedānta":                 "Hinduismus",
  "Säkulare Achtsamkeit":            "Säkulare und wissenschaftliche Kontexte",
  "Klinische Psychologie":           "Säkulare und wissenschaftliche Kontexte",
  "Psychedelika-Forschung":          "Säkulare und wissenschaftliche Kontexte",
};

function aggregateTraditions(concepts) {
  const map = new Map();
  for (const c of concepts) {
    for (const t of (c.traditions || [])) {
      const hauptgruppe = TRADITION_HAUPTGRUPPEN[t] || t;
      if (!map.has(hauptgruppe)) {
        map.set(hauptgruppe, {
          label: hauptgruppe,
          concept_ids: new Set(),
          maturities: [],
          subgroups: new Set(),
        });
      }
      const entry = map.get(hauptgruppe);
      entry.concept_ids.add(c.id);
      entry.maturities.push(c.maturity);
      entry.subgroups.add(t);
    }
  }
  const maturityRank = { etabliert: 3, "berührt": 2, beginnend: 1, fehlend: 0 };
  const result = [];
  for (const entry of map.values()) {
    const best = entry.maturities.reduce(
      (acc, m) => (maturityRank[m] ?? -1) > (maturityRank[acc] ?? -1) ? m : acc,
      entry.maturities[0],
    );
    const hasGap = entry.maturities.some(m => m === "fehlend");
    result.push({
      label: entry.label,
      concept_ids: Array.from(entry.concept_ids),
      subgroups: Array.from(entry.subgroups).sort((a, b) => a.localeCompare(b, "de")),
      dominant_maturity: best,
      has_gap: hasGap,
      concept_count: entry.concept_ids.size,
    });
  }
  return result;
}
