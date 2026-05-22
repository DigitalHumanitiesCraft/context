// app.js
// Routing nach Seite, Rendering von Konzept-Index und Brücken-Ansicht.

import { loadAll } from "./data-loader.js";

const page = document.body.dataset.page;

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderError(target, err) {
  target.innerHTML = `<div class="state-error">Fehler beim Laden der Daten: ${escapeHtml(err.message)}</div>`;
  console.error(err);
}

function evidenceClass(type) {
  if (type === "stützend") return "stuetzend";
  if (type === "einschränkend") return "einschraenkend";
  if (type === "methodisch-kritisch") return "methodisch-kritisch";
  return "";
}

// ---------- Index page ----------

function uniqueTraditions(concepts) {
  const set = new Set();
  for (const c of concepts) for (const t of (c.traditions || [])) set.add(t);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "de"));
}

function renderConceptCard(c) {
  const sourceCount = c.works.length;
  const studyCount = c.studies.length;
  const traditions = (c.traditions || []).length
    ? c.traditions.map(t => `<span class="tradition-chip">${escapeHtml(t)}</span>`).join("")
    : `<span class="tradition-chip is-empty">rein empirisch</span>`;

  return `
    <li>
      <a class="concept-card" href="concept.html?id=${encodeURIComponent(c.id)}">
        <div class="labels">
          <span class="label-original">${escapeHtml(c.label.original)}</span>
          <span class="label-translit">${escapeHtml(c.label.translit)}</span>
          <span class="label-de">${escapeHtml(c.label.de)}</span>
        </div>
        <div class="traditions">${traditions}</div>
        <p class="summary">${escapeHtml(c.summary || "")}</p>
        <div class="markers">
          <span><span class="num">${sourceCount}</span> Quelle${sourceCount === 1 ? "" : "n"}</span>
          <span><span class="num">${studyCount}</span> Studie${studyCount === 1 ? "" : "n"}</span>
        </div>
      </a>
    </li>
  `;
}

function applyFilters(concepts, activeTraditions, activeEvidence) {
  return concepts.filter(c => {
    if (activeTraditions.size > 0) {
      const hasMatch = (c.traditions || []).some(t => activeTraditions.has(t));
      if (!hasMatch) return false;
    }
    if (activeEvidence.size > 0) {
      const hasMatch = (c.studies || []).some(s => activeEvidence.has(s.evidence_type));
      if (!hasMatch) return false;
    }
    return true;
  });
}

async function renderIndexPage() {
  const grid = document.getElementById("concept-grid");
  const filtersTraditions = document.getElementById("filters-traditions");
  const filtersEvidence = document.getElementById("filters-evidence");
  const resultsCount = document.getElementById("results-count");

  try {
    const data = await loadAll();
    const traditions = uniqueTraditions(data.concepts);

    const activeTraditions = new Set();
    const activeEvidence = new Set();

    filtersTraditions.innerHTML = traditions.map(t =>
      `<button type="button" class="filter-chip" data-tradition="${escapeHtml(t)}">${escapeHtml(t)}</button>`
    ).join("");

    const evidenceTypes = [
      { key: "stützend", label: "stützend" },
      { key: "einschränkend", label: "einschränkend" },
      { key: "methodisch-kritisch", label: "methodisch-kritisch" },
    ];
    filtersEvidence.innerHTML = evidenceTypes.map(e =>
      `<button type="button" class="filter-chip" data-evidence="${escapeHtml(e.key)}">${escapeHtml(e.label)}</button>`
    ).join("");

    function rerender() {
      const filtered = applyFilters(data.concepts, activeTraditions, activeEvidence);
      grid.innerHTML = filtered.map(renderConceptCard).join("");
      const total = data.concepts.length;
      resultsCount.textContent = filtered.length === total
        ? `${total} Konzepte`
        : `${filtered.length} von ${total} Konzepten`;
    }

    filtersTraditions.addEventListener("click", e => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      const t = btn.dataset.tradition;
      if (activeTraditions.has(t)) { activeTraditions.delete(t); btn.classList.remove("is-active"); }
      else { activeTraditions.add(t); btn.classList.add("is-active"); }
      rerender();
    });

    filtersEvidence.addEventListener("click", e => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      const ev = btn.dataset.evidence;
      if (activeEvidence.has(ev)) { activeEvidence.delete(ev); btn.classList.remove("is-active"); }
      else { activeEvidence.add(ev); btn.classList.add("is-active"); }
      rerender();
    });

    rerender();
  } catch (err) {
    renderError(grid, err);
  }
}

// ---------- Concept (bridge) page ----------

function renderWorkItem(w) {
  const reprs = (w.representations || []).map(rep => {
    const typeClass = rep.type === "edition" ? "edition" : "facsimile";
    const typeLabel = rep.type === "edition" ? "Edition" : "Faksimile";
    const repoLabel = rep.repository ? rep.repository.label : rep.repository_id;
    const repoUrl = rep.repository ? rep.repository.url : null;
    return `
      <div class="meta">
        <span class="repr-type ${typeClass}">${typeLabel}</span>
        <span><a href="${escapeHtml(rep.url)}" target="_blank" rel="noopener">${escapeHtml(repoLabel)}</a></span>
        <span><span class="key">Format</span> ${escapeHtml(rep.format)}</span>
      </div>
    `;
  }).join("");

  return `
    <div class="item">
      <div class="title">
        <span class="original">${escapeHtml(w.label.original)}</span>
        ${w.label.translit ? ` — <span class="translit">${escapeHtml(w.label.translit)}</span>` : ""}
      </div>
      <div class="meta">
        ${w.author ? `<span><span class="key">Autor</span> ${escapeHtml(w.author)}</span>` : ""}
        ${w.century ? `<span><span class="key">Zeit</span> ${escapeHtml(w.century)}</span>` : ""}
        <span><span class="key">Tradition</span> ${escapeHtml(w.tradition)}</span>
        <span><span class="key">Sprache</span> ${escapeHtml(w.language)}</span>
      </div>
      ${reprs}
    </div>
  `;
}

function renderStudyItem(s) {
  const evClass = evidenceClass(s.evidence_type);
  const authors = (s.authors || []).join(", ");
  return `
    <div class="item">
      <div class="title">${escapeHtml(s.title)}</div>
      <div class="meta">
        <span>${escapeHtml(authors)}</span>
        <span><span class="key">Jahr</span> ${escapeHtml(s.year)}</span>
        <span><span class="key">Methode</span> ${escapeHtml(s.method)}</span>
        <span class="evidence-badge ${evClass}">${escapeHtml(s.evidence_type)}</span>
      </div>
      <div class="meta">
        <span><span class="key">DOI</span> ${escapeHtml(s.doi)}</span>
      </div>
      <div class="provenance">
        Provenienz: ${escapeHtml(s.provenance?.source || "—")} · ${escapeHtml(s.provenance?.date || "—")}
      </div>
    </div>
  `;
}

async function renderConceptPage() {
  const root = document.getElementById("concept-root");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    root.innerHTML = `<div class="state-error">Kein Konzept angegeben. Verwenden Sie <code>?id=&lt;slug&gt;</code> in der URL.</div>`;
    return;
  }

  try {
    const data = await loadAll();
    const c = data.conceptById.get(id);
    if (!c) {
      root.innerHTML = `<div class="state-error">Konzept &quot;${escapeHtml(id)}&quot; nicht gefunden.</div>`;
      return;
    }

    document.title = `${c.label.translit} — CONTEXT`;

    const traditions = (c.traditions || []).length
      ? c.traditions.map(t => `<span class="tradition-chip">${escapeHtml(t)}</span>`).join("")
      : `<span class="tradition-chip is-empty">rein empirisch</span>`;

    const works = c.works || [];
    const studies = c.studies || [];

    const leftColumn = works.length > 0
      ? works.map(renderWorkItem).join("")
      : `<div class="empty-column-notice">
           Kein historischer Quelltext kuratiert. Dieses Konzept ist empirisch-deskriptiv,
           stammt also nicht aus einer Texttradition, sondern aus der modernen
           Bewusstseinsforschung selbst. Die Brücke verläuft hier asymmetrisch.
         </div>`;

    const rightColumn = studies.length > 0
      ? studies.map(renderStudyItem).join("")
      : `<div class="empty-column-notice">
           Noch keine kuratierte empirische Studie für dieses Konzept.
         </div>`;

    root.innerHTML = `
      <div class="placeholder-banner">Platzhalter-Datensatz</div>

      <div class="bridge-header">
        <div class="label-original">${escapeHtml(c.label.original)}</div>
        <div class="label-translit">${escapeHtml(c.label.translit)}</div>
        <div class="label-translation">${escapeHtml(c.label.de)} · ${escapeHtml(c.label.en)}</div>
        <div class="traditions">${traditions}</div>
        <div class="meta" style="margin-top: var(--space-3);">
          ${c.wikidata_qid ? `<span class="item"><span class="key">Wikidata</span> <a href="https://www.wikidata.org/wiki/${escapeHtml(c.wikidata_qid)}" target="_blank" rel="noopener">${escapeHtml(c.wikidata_qid)}</a></span>` : `<span class="item"><span class="key">Wikidata</span> —</span>`}
        </div>
        <div class="aufnahmegrund">
          <span class="key">Aufnahmegrund</span>
          ${escapeHtml(c.aufnahmegrund?.citation || "—")}
          ${c.aufnahmegrund?.doi ? ` · DOI ${escapeHtml(c.aufnahmegrund.doi)}` : ""}
        </div>
      </div>

      <div class="bridge">
        <section class="bridge-column">
          <header class="column-header">
            <span class="column-title">Quelle — historische Überlieferung</span>
            <span class="column-count">${works.length} Werk${works.length === 1 ? "" : "e"}</span>
          </header>
          ${leftColumn}
        </section>

        <section class="bridge-column">
          <header class="column-header">
            <span class="column-title">Empirie — Bewusstseinsforschung</span>
            <span class="column-count">${studies.length} Studie${studies.length === 1 ? "" : "n"}</span>
          </header>
          ${rightColumn}
        </section>
      </div>
    `;
  } catch (err) {
    renderError(root, err);
  }
}

// ---------- Dispatch ----------

if (page === "index") {
  renderIndexPage();
} else if (page === "concept") {
  renderConceptPage();
}
