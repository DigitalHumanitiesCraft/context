// data-loader.js
// Lädt die vier JSON-Dateien parallel und baut einen In-Memory-Index mit Querverweisen.
// Keine externe Abhängigkeit, nur native fetch und ES-Module.

const SOURCES = {
  concepts:     "data/concepts.json",
  works:        "data/works.json",
  studies:      "data/studies.json",
  repositories: "data/repositories.json",
};

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Konnte ${url} nicht laden (HTTP ${res.status})`);
  return res.json();
}

export async function loadAll() {
  const [concepts, works, studies, repositories] = await Promise.all([
    fetchJson(SOURCES.concepts),
    fetchJson(SOURCES.works),
    fetchJson(SOURCES.studies),
    fetchJson(SOURCES.repositories),
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
  for (const s of studies) {
    if (!studiesByConcept.has(s.concept_id)) studiesByConcept.set(s.concept_id, []);
    studiesByConcept.get(s.concept_id).push(s);
  }
  for (const list of studiesByConcept.values()) {
    list.sort((a, b) => b.year - a.year);
  }

  for (const c of concepts) {
    c.works = worksByConcept.get(c.id) || [];
    c.studies = studiesByConcept.get(c.id) || [];
  }

  const conceptById = new Map(concepts.map(c => [c.id, c]));

  return {
    concepts,
    works,
    studies,
    repositories,
    conceptById,
    repoById,
  };
}
