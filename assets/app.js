// app.js — Single-Page Explorer. Hash-Router mit fünf Renderern:
// home (Coverage-Karte), tradition, konzept, studie, gap, repositorium, referenz, aggregation, about.

import { loadAll } from "./data-loader.js";

// ---------- Helpers ----------

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function renderError(target, err) {
  target.innerHTML = `<div class="state-error" role="alert">Fehler beim Laden: ${escapeHtml(err.message)}</div>`;
  console.error(err);
}

function evidenceClass(type) {
  if (type === "stützend") return "stuetzend";
  if (type === "einschränkend") return "einschraenkend";
  if (type === "methodisch-kritisch") return "methodisch-kritisch";
  if (type === "nebenwirkungen-dokumentierend") return "nebenwirkungen-dokumentierend";
  if (type === "laufend") return "laufend";
  return "";
}

function maturityClass(m) {
  if (m === "etabliert") return "etabliert";
  if (m === "berührt") return "beruehrt";
  if (m === "beginnend") return "beginnend";
  if (m === "fehlend") return "fehlend";
  return "";
}

function maturityLabel(m) {
  return m || "—";
}

function wikidataLink(qid, snapshotDate) {
  if (!qid) return "";
  const title = snapshotDate
    ? `Wikidata-Eintrag ${qid} (verifiziert ${snapshotDate})`
    : `Wikidata-Eintrag ${qid}`;
  return `<a class="wikidata-link" href="https://www.wikidata.org/wiki/${escapeAttr(qid)}" target="_blank" rel="noopener" title="${escapeAttr(title)}">${escapeHtml(qid)}</a>`;
}

function provenanceHover(source, date) {
  if (!source && !date) return "";
  const tooltip = `Quelle: ${source || "—"} · ${date || "—"}`;
  return `<span class="prov-marker" tabindex="0" aria-label="${escapeAttr(tooltip)}" title="${escapeAttr(tooltip)}">i</span>`;
}

function harvestedField(value, source, date) {
  return `<span class="harvested-field" data-harvested="true">${escapeHtml(value)}${provenanceHover(source, date)}</span>`;
}

function tradSlug(label) {
  return label
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/[ß]/g, "ss")
    .normalize("NFD")                // dekomponiert ā in a + Macron
    .replace(/\p{M}/gu, "")          // entfernt alle kombinierenden Diakritika
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function navTo(hash) {
  window.location.hash = hash;
}

// ---------- Router ----------

let DATA = null;

const ROUTES = {
  "":              { name: "home",         render: renderHome },
  "aggregation":   { name: "aggregation",  render: renderAggregation },
  "about":         { name: "about",        render: renderAbout },
};

function parseHash() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return { route: "home", id: null };
  const parts = raw.split("/");
  const route = parts[0];
  const id = parts.slice(1).join("/") || null;
  return { route, id };
}

function dispatch() {
  const { route, id } = parseHash();
  const root = document.getElementById("view-root");
  if (!root) return;

  document.querySelectorAll(".site-nav a[data-nav]").forEach(a => {
    const expected = a.dataset.nav;
    const active = (expected === "home" && route === "home") || expected === route;
    a.classList.toggle("is-current", !!active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  try {
    if (route === "home")             renderHome(root);
    else if (route === "aggregation") renderAggregation(root);
    else if (route === "about")       renderAbout(root);
    else if (route === "tradition")   renderTradition(root, id);
    else if (route === "konzept")     renderKonzept(root, id);
    else if (route === "studie")      renderStudie(root, id);
    else if (route === "gap")         renderGap(root, id);
    else if (route === "repositorium")renderRepositorium(root, id);
    else if (route === "referenz")    renderReferenz(root, id);
    else {
      root.innerHTML = `<div class="state-error" role="alert">Unbekannte Route: <code>${escapeHtml(route)}</code>. <a href="#">Zur Übersicht</a></div>`;
    }
  } catch (err) {
    renderError(root, err);
  }

  updateBreadcrumb(route, id);

  // Fokus auf Hauptinhalt setzen, damit Tastaturbedienung Sinn behält
  const main = document.getElementById("main-content");
  if (main) main.focus({ preventScroll: false });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function updateBreadcrumb(route, id) {
  const nav = document.getElementById("breadcrumb");
  const list = document.getElementById("breadcrumb-list");
  if (!nav || !list) return;
  if (route === "home") {
    nav.hidden = true;
    list.innerHTML = "";
    return;
  }
  nav.hidden = false;
  const crumbs = [{ href: "#", label: "Übersicht" }];

  if (route === "konzept" && id) {
    const c = DATA?.conceptById.get(id);
    crumbs.push({ href: `#konzept/${id}`, label: c?.label?.translit || id, current: true });
  } else if (route === "tradition" && id) {
    crumbs.push({ href: `#tradition/${id}`, label: capitalizeFirst(id.replace(/-/g, " ")), current: true });
  } else if (route === "studie" && id) {
    const s = DATA?.studyById.get(id);
    crumbs.push({ href: `#studie/${id}`, label: s ? `${s.authors?.[0] || "?"} ${s.year || ""}` : id, current: true });
  } else if (route === "gap" && id) {
    const c = DATA?.conceptById.get(id);
    crumbs.push({ href: `#gap/${id}`, label: c?.label?.de || id, current: true });
  } else if (route === "repositorium" && id) {
    const r = DATA?.repoById.get(id);
    crumbs.push({ href: `#repositorium/${id}`, label: r?.label || id, current: true });
  } else if (route === "referenz" && id) {
    const r = DATA?.referenceById.get(id);
    crumbs.push({ href: `#referenz/${id}`, label: r?.title?.slice(0, 60) || id, current: true });
  } else if (route === "aggregation") {
    crumbs.push({ href: "#aggregation", label: "Audit (Aggregation)", current: true });
  } else if (route === "about") {
    crumbs.push({ href: "#about", label: "Methodische Position", current: true });
  }

  list.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    if (isLast) return `<li aria-current="page">${escapeHtml(c.label)}</li>`;
    return `<li><a href="${escapeAttr(c.href)}">${escapeHtml(c.label)}</a></li>`;
  }).join('<li class="sep" aria-hidden="true">›</li>');
}

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------- Home: Coverage-Karte ----------

function renderHome(root) {
  const concepts = DATA.concepts;
  const studies = DATA.studies;
  const repos = DATA.repositories;
  const refs = DATA.references;
  const works = DATA.works;
  const coverage = DATA.coverage;

  const stats = [
    { label: "Konzepte", value: concepts.length, href: null },
    { label: "Werke", value: works.length, href: null },
    { label: "Studien", value: studies.length, href: null },
    { label: "Repositorien", value: repos.length, href: null },
    { label: "Knotenpunkte", value: refs.length, href: null },
  ];

  const maturityCounts = countMaturities(concepts);

  const coverageRows = coverage.map(t => {
    const slug = tradSlug(t.label);
    const studyCount = countStudiesForTradition(t);
    const subgroupNote = (t.subgroups && t.subgroups.length > 1)
      ? `<span class="cov-subgroups" title="Substrings im Datenbestand">${escapeHtml(t.subgroups.join(" · "))}</span>`
      : "";
    return `
      <li>
        <a class="coverage-row" href="#tradition/${escapeAttr(slug)}" aria-label="Tradition ${escapeAttr(t.label)} ansehen">
          <span class="cov-label">
            ${escapeHtml(t.label)}
            ${subgroupNote}
          </span>
          <span class="cov-maturity">
            <span class="maturity ${maturityClass(t.dominant_maturity)}" title="Reifegrad: ${escapeAttr(t.dominant_maturity)}">${escapeHtml(maturityLabel(t.dominant_maturity))}</span>
            ${t.has_gap ? `<span class="gap-marker" title="Diese Tradition enthält einen Lücken-Knoten">+ Lücke</span>` : ""}
          </span>
          <span class="cov-stats">
            <span><strong>${t.concept_count}</strong> Konzept${t.concept_count === 1 ? "" : "e"}</span>
            <span><strong>${studyCount}</strong> Studie${studyCount === 1 ? "" : "n"}</span>
          </span>
          <span class="cov-arrow" aria-hidden="true">→</span>
        </a>
      </li>
    `;
  }).join("");

  root.innerHTML = `
    <section class="home-hero">
      <h1>Asymmetrie der Erforschbarkeit</h1>
      <p class="lead">
        CONTEXT verbindet historische kontemplative Überlieferung mit empirischer
        Bewusstseinsforschung. Die Karte unten zeigt, welche Traditionen empirisch
        sichtbar sind und welche nicht. Die Ungleichheit selbst ist der Befund,
        nicht ein Defizit.
      </p>
    </section>

    <section class="stat-row" aria-label="Bestandszahlen">
      ${stats.map(s => `
        <div class="stat-card">
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${escapeHtml(s.label)}</div>
        </div>
      `).join("")}
      <div class="stat-card stat-card-maturity">
        <div class="stat-maturity-row">
          ${["etabliert","berührt","beginnend","fehlend"].map(m => `
            <span class="maturity ${maturityClass(m)}" title="${maturityCounts[m]||0} Konzepte mit Reifegrad ${escapeAttr(m)}">
              <strong>${maturityCounts[m]||0}</strong> ${escapeHtml(m)}
            </span>
          `).join("")}
        </div>
        <div class="stat-label">Reifegrad-Verteilung</div>
      </div>
    </section>

    <section class="coverage-section">
      <header class="section-header">
        <h2>Coverage nach Tradition</h2>
        <a class="section-action" href="#aggregation">Audit-Ansicht öffnen →</a>
      </header>
      <p class="lead">
        Sortiert nach Reifegrad. Klick öffnet die Tradition mit ihren Konzepten.
      </p>
      <ul class="coverage-list">${coverageRows}</ul>
    </section>

    <section class="coverage-section">
      <header class="section-header">
        <h2>Knotenpunkt-Referenzen</h2>
      </header>
      <p class="lead">
        Vier theoretische Anker, deren Folgepapers den empirischen Strang
        zusammenhalten. Quelle: kuratierte Auswahl aus der Sekundärliteratur.
      </p>
      <ul class="reference-list">
        ${refs.map(r => `
          <li>
            <a class="reference-row" href="#referenz/${escapeAttr(r.id)}">
              <span class="ref-title">${escapeHtml(r.title)}</span>
              <span class="ref-meta">${escapeHtml((r.authors||[]).slice(0,2).join(", "))}${r.authors?.length > 2 ? " u. a." : ""} · ${escapeHtml(r.year)}</span>
              <span class="cov-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function countMaturities(concepts) {
  const counts = { etabliert: 0, "berührt": 0, beginnend: 0, fehlend: 0 };
  for (const c of concepts) {
    if (counts[c.maturity] != null) counts[c.maturity]++;
  }
  return counts;
}

function countStudiesForTradition(tradition) {
  const set = new Set();
  for (const cid of tradition.concept_ids) {
    const list = DATA.studiesByConcept.get(cid) || [];
    for (const s of list) set.add(s.id);
  }
  return set.size;
}

// ---------- Tradition (Aggregat) ----------

function renderTradition(root, slug) {
  if (!slug) {
    root.innerHTML = `<div class="state-error" role="alert">Keine Tradition angegeben.</div>`;
    return;
  }
  const tradition = DATA.traditions.find(t => tradSlug(t.label) === slug);
  if (!tradition) {
    root.innerHTML = `<div class="state-error" role="alert">Tradition <code>${escapeHtml(slug)}</code> nicht gefunden. <a href="#">Zur Übersicht</a></div>`;
    return;
  }
  document.title = `${tradition.label} — CONTEXT`;
  const concepts = tradition.concept_ids.map(id => DATA.conceptById.get(id)).filter(Boolean);

  const conceptCards = concepts.map(c => {
    const studyCount = (DATA.studiesByConcept.get(c.id) || []).length;
    const isGap = c.maturity === "fehlend";
    const href = isGap ? `#gap/${c.id}` : `#konzept/${c.id}`;
    return `
      <li>
        <a class="concept-card" href="${escapeAttr(href)}">
          <div class="card-head">
            <span class="label-original">${escapeHtml(c.label.original)}</span>
            <span class="maturity ${maturityClass(c.maturity)}">${escapeHtml(c.maturity)}</span>
          </div>
          <div class="label-translit">${escapeHtml(c.label.translit)}</div>
          <div class="label-de">${escapeHtml(c.label.de)}</div>
          <p class="summary">${escapeHtml(c.summary || "")}</p>
          <div class="markers">
            <span><strong>${studyCount}</strong> Studie${studyCount === 1 ? "" : "n"}</span>
            ${c.wikidata_qid ? `<span class="lod-anchor" title="Wikidata-QID">${escapeHtml(c.wikidata_qid)}</span>` : ""}
          </div>
        </a>
      </li>
    `;
  }).join("");

  const subgroupBlock = (tradition.subgroups && tradition.subgroups.length > 1)
    ? `<p class="page-subgroups"><span class="key">Substrings im Datenbestand:</span> ${escapeHtml(tradition.subgroups.join(" · "))}</p>`
    : "";

  root.innerHTML = `
    <header class="page-header">
      <span class="page-kind">Hauptgruppe</span>
      <h1>${escapeHtml(tradition.label)}</h1>
      <div class="page-meta">
        <span class="maturity ${maturityClass(tradition.dominant_maturity)}">${escapeHtml(tradition.dominant_maturity)}</span>
        <span>${tradition.concept_count} Konzept${tradition.concept_count === 1 ? "" : "e"}</span>
        ${tradition.has_gap ? `<span class="gap-marker">Enthält Lücken-Knoten</span>` : ""}
      </div>
      ${subgroupBlock}
    </header>

    <section>
      <h2>Konzepte in dieser Hauptgruppe</h2>
      <ul class="concept-grid">${conceptCards}</ul>
    </section>
  `;
}

// ---------- Konzept (Brücken-Ansicht) ----------

function renderKonzept(root, id) {
  if (!id) {
    root.innerHTML = `<div class="state-error" role="alert">Kein Konzept angegeben.</div>`;
    return;
  }
  const c = DATA.conceptById.get(id);
  if (!c) {
    root.innerHTML = `<div class="state-error" role="alert">Konzept <code>${escapeHtml(id)}</code> nicht gefunden. <a href="#">Zur Übersicht</a></div>`;
    return;
  }
  if (c.maturity === "fehlend") {
    renderGap(root, id);
    return;
  }
  document.title = `${c.label.translit} — CONTEXT`;

  const works = c.works || [];
  const studies = c.studies || [];
  const references = c.references || [];
  const snapshotDate = DATA.snapshot.wikidata;

  const traditions = (c.traditions || []).map(t => {
    const slug = tradSlug(t);
    return `<a class="tradition-chip" href="#tradition/${escapeAttr(slug)}">${escapeHtml(t)}</a>`;
  }).join("");

  const relatedList = (c.related_concepts || []).filter(r => r.target).map(rel =>
    `<li><span class="relation">${escapeHtml(rel.relation)}</span> <a href="#konzept/${escapeAttr(rel.id)}">${escapeHtml(rel.target.label.translit)}</a></li>`
  ).join("");

  const leftColumn = works.length > 0
    ? works.map(renderWorkItem).join("")
    : `<div class="empty-column-notice">
         Kein historischer Quelltext direkt an diesem Konzept verankert. Das
         Konzept ist empirisch-deskriptiv, seine historische Anbindung läuft
         über verwandte Konzepte (siehe oben). Die Brücke verläuft hier
         asymmetrisch — das ist eine Eigenschaft des Modells, kein Datenmangel.
       </div>`;

  const rightColumn = studies.length > 0
    ? studies.map(s => renderStudyItem(s, snapshotDate)).join("")
    : `<div class="empty-column-notice">Noch keine kuratierte empirische Studie für dieses Konzept im Bestand.</div>`;

  const refSection = references.length
    ? `
      <section class="concept-references">
        <h3>Knotenpunkt-Referenzen</h3>
        <ul>
          ${references.map(r => `<li><a href="#referenz/${escapeAttr(r.id)}">${escapeHtml(r.title)}</a> <span class="ref-meta">(${escapeHtml((r.authors||[])[0] || "")} ${escapeHtml(r.year)})</span></li>`).join("")}
        </ul>
      </section>`
    : "";

  root.innerHTML = `
    <header class="page-header bridge-header">
      <span class="page-kind">Konzept</span>
      <div class="label-original">${escapeHtml(c.label.original)}</div>
      <div class="label-translit">${escapeHtml(c.label.translit)}</div>
      <div class="label-translation">${escapeHtml(c.label.de)} · ${escapeHtml(c.label.en)}</div>
      <div class="page-meta">
        <span class="maturity ${maturityClass(c.maturity)}">${escapeHtml(c.maturity)}</span>
        ${c.wikidata_qid ? `<span class="lod-anchor-chip">${wikidataLink(c.wikidata_qid, snapshotDate)}</span>` : ""}
      </div>
      <div class="traditions">${traditions}</div>
      <div class="aufnahmegrund">
        <span class="key">Aufnahmegrund</span>
        ${escapeHtml(c.aufnahmegrund?.citation || "—")}
        ${c.aufnahmegrund?.doi
          ? ` · <button class="btn-inline" data-doi="${escapeAttr(c.aufnahmegrund.doi)}" aria-label="DOI ${escapeAttr(c.aufnahmegrund.doi)} im Resolver öffnen">DOI öffnen</button>`
          : ""}
      </div>
      ${relatedList ? `
        <section class="related-concepts">
          <div class="label">Verwandte Konzepte</div>
          <ul>${relatedList}</ul>
        </section>` : ""}
    </header>

    <div class="bridge">
      <section class="bridge-column" aria-labelledby="col-source">
        <header class="column-header">
          <h2 id="col-source" class="column-title">Quelle — historische Überlieferung</h2>
          <span class="column-count">${works.length} Werk${works.length === 1 ? "" : "e"}</span>
        </header>
        ${leftColumn}
      </section>

      <section class="bridge-column" aria-labelledby="col-empirie">
        <header class="column-header">
          <h2 id="col-empirie" class="column-title">Empirie — Bewusstseinsforschung</h2>
          <span class="column-count">${studies.length} Studie${studies.length === 1 ? "" : "n"}</span>
        </header>
        ${rightColumn}
      </section>
    </div>

    ${refSection}
  `;
}

function renderWorkItem(w) {
  const snapshotDate = DATA.snapshot.wikidata;
  const reprs = (w.representations || []).map(rep => {
    const typeClass = rep.type === "edition" ? "edition" : "facsimile";
    const typeLabel = rep.type === "edition" ? "Edition" : "Faksimile";
    const repoLabel = rep.repository ? rep.repository.label : rep.repository_id;
    const repoLink = rep.repository
      ? `<a href="#repositorium/${escapeAttr(rep.repository_id)}">${escapeHtml(repoLabel)}</a>`
      : escapeHtml(repoLabel);
    return `
      <div class="meta">
        <span class="repr-type ${typeClass}">${typeLabel}</span>
        <span><a href="${escapeAttr(rep.url)}" target="_blank" rel="noopener">${escapeHtml(rep.format || "öffnen")}</a> @ ${repoLink}</span>
        ${rep.note ? `<span class="provenance">${escapeHtml(rep.note)}</span>` : ""}
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
        ${w.wikidata_qid ? wikidataLink(w.wikidata_qid, snapshotDate) : ""}
      </div>
      ${reprs}
    </div>
  `;
}

function renderStudyItem(s, snapshotDate) {
  const evClass = evidenceClass(s.evidence_type);
  const authors = (s.authors || []).join(", ");
  const sampleN = s.n != null ? `n = ${s.n}` : "";
  const sampleType = s.sample_type ? `<span class="sample-type-marker">${escapeHtml(s.sample_type)}${sampleN ? ` · ${sampleN}` : ""}</span>` : "";
  return `
    <article class="item">
      <h3 class="title"><a href="#studie/${escapeAttr(s.id)}">${escapeHtml(s.title)}</a></h3>
      <div class="meta">
        <span>${escapeHtml(authors)}</span>
        <span><span class="key">Jahr</span> ${escapeHtml(s.year)}</span>
        <span><span class="key">Methode</span> ${escapeHtml(s.method)}</span>
        <span class="evidence-badge ${evClass}">${escapeHtml(s.evidence_type)}</span>
      </div>
      <div class="meta">
        <span class="domain-chip">${escapeHtml(s.domain || "")}</span>
        ${sampleType}
        ${s.doi
          ? `<button class="btn-inline" data-doi="${escapeAttr(s.doi)}" aria-label="DOI ${escapeAttr(s.doi)} im Resolver öffnen">DOI öffnen</button>`
          : ""}
      </div>
      <div class="provenance">
        Provenienz: ${escapeHtml(s.provenance?.source || "—")} · ${escapeHtml(s.provenance?.date || "—")}
      </div>
    </article>
  `;
}

// ---------- Studie ----------

function renderStudie(root, id) {
  if (!id) {
    root.innerHTML = `<div class="state-error" role="alert">Keine Studie angegeben.</div>`;
    return;
  }
  const s = DATA.studyById.get(id);
  if (!s) {
    root.innerHTML = `<div class="state-error" role="alert">Studie <code>${escapeHtml(id)}</code> nicht gefunden.</div>`;
    return;
  }
  document.title = `${(s.authors || [])[0] || ""} ${s.year || ""} — CONTEXT`;

  const evClass = evidenceClass(s.evidence_type);
  const linkedConcepts = [s.concept_id, ...(s.additional_concepts || [])]
    .map(cid => DATA.conceptById.get(cid))
    .filter(Boolean);
  const conceptLinks = linkedConcepts.map(c =>
    `<li><a href="#konzept/${escapeAttr(c.id)}">${escapeHtml(c.label.translit)}</a> <span class="relation">(${escapeHtml(c.label.de)})</span></li>`
  ).join("");

  root.innerHTML = `
    <article class="study-detail">
      <header class="page-header">
        <span class="page-kind">Studie</span>
        <h1 class="study-title">${escapeHtml(s.title)}</h1>
        <div class="study-authors">${escapeHtml((s.authors || []).join(", "))} (${escapeHtml(s.year)})</div>
        <div class="page-meta">
          <span><span class="key">Journal</span> ${escapeHtml(s.journal || "—")}</span>
          <span><span class="key">Methode</span> ${escapeHtml(s.method || "—")}</span>
          ${s.n != null ? `<span><span class="key">N</span> ${escapeHtml(s.n)}</span>` : ""}
          <span class="domain-chip">${escapeHtml(s.domain || "")}</span>
          <span class="evidence-badge ${evClass}">${escapeHtml(s.evidence_type)}</span>
          ${s.sample_type ? `<span class="sample-type-marker">${escapeHtml(s.sample_type)}</span>` : ""}
        </div>
        <div class="page-actions">
          ${s.doi
            ? `<button class="btn-primary" data-doi="${escapeAttr(s.doi)}" aria-label="DOI ${escapeAttr(s.doi)} im Resolver öffnen">DOI öffnen</button>`
            : `<span class="btn-disabled" aria-disabled="true">Kein DOI vergeben</span>`}
          <button class="btn-secondary" data-bibtex="${escapeAttr(s.id)}" aria-label="BibTeX in die Zwischenablage kopieren">BibTeX kopieren</button>
        </div>
      </header>

      <p class="study-summary">${escapeHtml(s.summary || "")}</p>

      <section class="concept-links">
        <h3>Verlinkte Konzepte</h3>
        <ul>${conceptLinks}</ul>
      </section>

      <footer class="study-footer">
        Provenienz dieser Verknüpfung: ${escapeHtml(s.provenance?.source || "—")} · ${escapeHtml(s.provenance?.date || "—")}
      </footer>
    </article>
  `;
}

// ---------- Lücken-Knoten ----------

function renderGap(root, id) {
  if (!id) {
    root.innerHTML = `<div class="state-error" role="alert">Kein Lücken-Knoten angegeben.</div>`;
    return;
  }
  const c = DATA.conceptById.get(id);
  if (!c) {
    root.innerHTML = `<div class="state-error" role="alert">Lücken-Knoten <code>${escapeHtml(id)}</code> nicht gefunden.</div>`;
    return;
  }
  document.title = `Lücke: ${c.label.de} — CONTEXT`;

  const reasons = c.gap_reasons || c.reasons || c.summary?.split(/\.\s+/).filter(Boolean) || [];
  const reasonsList = Array.isArray(reasons) && reasons.length
    ? `<ol class="reason-list">${reasons.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ol>`
    : `<p class="lead">${escapeHtml(c.summary || "")}</p>`;

  root.innerHTML = `
    <header class="page-header page-header-gap">
      <span class="page-kind">Lücken-Knoten</span>
      <h1>${escapeHtml(c.label.de)}</h1>
      <div class="label-original">${escapeHtml(c.label.original || "")}</div>
      <div class="page-meta">
        <span class="maturity fehlend">${escapeHtml(c.maturity)}</span>
        ${c.wikidata_qid ? wikidataLink(c.wikidata_qid, DATA.snapshot.wikidata) : ""}
      </div>
    </header>

    <section class="gap-body">
      <h2>Warum diese Praxis empirisch unsichtbar ist</h2>
      ${reasonsList}
    </section>

    <section class="gap-note">
      <h2>Was das bedeutet</h2>
      <p>
        Lücken-Knoten sind erstklassig: Sie tragen einen kuratierten
        Aufnahmegrund, auch wenn keine peer-reviewte Studie existiert. Die
        Absenz ist der Befund. Nicht-empirischer Kontext (etwa
        philologische oder historische Sekundärliteratur) ist ausdrücklich
        als nicht-empirisch markiert.
      </p>
      ${c.aufnahmegrund?.citation ? `
        <div class="aufnahmegrund">
          <span class="key">Kuratierte Begründung</span>
          ${escapeHtml(c.aufnahmegrund.citation)}
        </div>` : ""}
    </section>
  `;
}

// ---------- Repositorium ----------

function renderRepositorium(root, id) {
  if (!id) {
    root.innerHTML = `<div class="state-error" role="alert">Kein Repositorium angegeben.</div>`;
    return;
  }
  const repo = DATA.repoById.get(id);
  if (!repo) {
    root.innerHTML = `<div class="state-error" role="alert">Repositorium <code>${escapeHtml(id)}</code> nicht gefunden.</div>`;
    return;
  }
  document.title = `${repo.label} — CONTEXT`;

  const works = DATA.worksByRepo.get(id) || [];
  const traditions = (repo.tradition_scope || []).map(t => {
    const slug = tradSlug(t);
    return `<a class="tradition-chip" href="#tradition/${escapeAttr(slug)}">${escapeHtml(t)}</a>`;
  }).join("");
  const snapshotDate = DATA.snapshot.wikidata;

  const worksList = works.length
    ? works.map(({ work, representation }) => `
      <article class="item">
        <h3 class="title">
          <a href="#konzept/${escapeAttr(work.concept_ids[0])}">${escapeHtml(work.label.translit)}</a>
          ${work.label.original ? ` — <span class="translit">${escapeHtml(work.label.original)}</span>` : ""}
        </h3>
        <div class="meta">
          <span><span class="key">Tradition</span> ${escapeHtml(work.tradition)}</span>
          <span><span class="key">Sprache</span> ${escapeHtml(work.language)}</span>
          <span class="repr-type ${representation.type}">${representation.type === "edition" ? "Edition" : "Faksimile"}</span>
          <span><a href="${escapeAttr(representation.url)}" target="_blank" rel="noopener">öffnen</a> · ${escapeHtml(representation.format || "")}</span>
        </div>
      </article>
    `).join("")
    : `<div class="empty-column-notice">Keine Werke aus dem CONTEXT-Bestand greifen aktuell auf dieses Repositorium zu.</div>`;

  root.innerHTML = `
    <header class="page-header">
      <span class="page-kind">Repositorium</span>
      <h1>${escapeHtml(repo.label)}</h1>
      <div class="page-meta">
        ${repo.country ? `<span><span class="key">Land</span> ${escapeHtml(repo.country)}</span>` : ""}
        ${repo.host_institution ? `<span><span class="key">Träger</span> ${escapeHtml(repo.host_institution)}</span>` : ""}
        ${repo.wikidata_qid ? wikidataLink(repo.wikidata_qid, snapshotDate) : ""}
      </div>
      <div class="page-actions">
        <a class="btn-primary" href="${escapeAttr(repo.url)}" target="_blank" rel="noopener">Repositorium öffnen</a>
      </div>
      <p>${escapeHtml(repo.description || "")}</p>
      <div class="traditions">${traditions}</div>
    </header>

    <section>
      <h2>Werke aus CONTEXT, die hier liegen <span class="column-count">(${works.length})</span></h2>
      ${worksList}
    </section>
  `;
}

// ---------- Knotenpunkt-Referenz ----------

function renderReferenz(root, id) {
  if (!id) {
    root.innerHTML = `<div class="state-error" role="alert">Keine Referenz angegeben.</div>`;
    return;
  }
  const r = DATA.referenceById.get(id);
  if (!r) {
    root.innerHTML = `<div class="state-error" role="alert">Referenz <code>${escapeHtml(id)}</code> nicht gefunden.</div>`;
    return;
  }
  document.title = `${r.title.slice(0, 60)} — CONTEXT`;

  const conceptsAnchored = (r.concepts_anchored || []).map(cid => DATA.conceptById.get(cid)).filter(Boolean);

  root.innerHTML = `
    <header class="page-header">
      <span class="page-kind">Knotenpunkt-Referenz</span>
      <h1 class="study-title">${escapeHtml(r.title)}</h1>
      <div class="study-authors">${escapeHtml((r.authors || []).join(", "))} (${escapeHtml(r.year)})</div>
      <div class="page-meta">
        <span><span class="key">Journal</span> ${escapeHtml(r.journal || "—")}</span>
        ${r.open_access ? `<span class="oa-chip" title="Open Access">OA</span>` : ""}
        ${r.license ? `<span><span class="key">Lizenz</span> ${escapeHtml(r.license)}</span>` : ""}
      </div>
      <div class="page-actions">
        ${r.doi
          ? `<button class="btn-primary" data-doi="${escapeAttr(r.doi)}" aria-label="DOI ${escapeAttr(r.doi)} im Resolver öffnen">DOI öffnen</button>`
          : r.url
            ? `<a class="btn-primary" href="${escapeAttr(r.url)}" target="_blank" rel="noopener">Volltext öffnen</a>`
            : ""}
      </div>
      ${r.doi_status === "no-doi" && r.doi_note ? `
        <div class="hygiene-note" role="note">
          <span class="key">Hinweis zur Adressierung</span>
          ${escapeHtml(r.doi_note)}
        </div>` : ""}
    </header>

    <section>
      <h2>Kernthese</h2>
      <p>${escapeHtml(r.core_thesis || "")}</p>
    </section>

    <section>
      <h2>Verankert in Konzepten</h2>
      <ul>
        ${conceptsAnchored.map(c => `<li><a href="#konzept/${escapeAttr(c.id)}">${escapeHtml(c.label.translit)}</a> (${escapeHtml(c.label.de)})</li>`).join("")}
      </ul>
    </section>

    ${(r.follow_up_papers && r.follow_up_papers.length) ? `
      <section>
        <h2>Folgepaper-Cluster</h2>
        <p class="lead">Drei Folgepapers, die den Faden weiterführen.</p>
        <ul class="followup-list">
          ${r.follow_up_papers.map(fp => `
            <li>
              <div class="fp-title">${escapeHtml(fp.title)}</div>
              <div class="fp-meta">
                ${escapeHtml((fp.authors || []).join(", "))} · ${escapeHtml(fp.year)} · ${escapeHtml(fp.journal || "")}
              </div>
              ${fp.doi
                ? `<button class="btn-inline" data-doi="${escapeAttr(fp.doi)}" aria-label="DOI ${escapeAttr(fp.doi)} im Resolver öffnen">DOI öffnen</button>`
                : fp.doi_note ? `<span class="hygiene-note inline">${escapeHtml(fp.doi_note)}</span>` : ""}
            </li>
          `).join("")}
        </ul>
      </section>` : ""}
  `;
}

// ---------- Aggregation: Reifegrad-Matrix ----------

function renderAggregation(root) {
  document.title = "Audit — CONTEXT";
  const traditions = DATA.coverage;
  const maturityLevels = ["etabliert", "berührt", "beginnend", "fehlend"];

  // Matrix: Tradition x Reifegrad. Eintrag = Liste der Konzepte mit diesem Reifegrad in der Tradition.
  const matrix = traditions.map(t => {
    const cells = {};
    for (const m of maturityLevels) cells[m] = [];
    for (const cid of t.concept_ids) {
      const c = DATA.conceptById.get(cid);
      if (!c) continue;
      if (cells[c.maturity]) cells[c.maturity].push(c);
    }
    return { tradition: t, cells };
  });

  const headerCells = maturityLevels.map(m => `
    <th scope="col" class="maturity-col">
      <span class="maturity ${maturityClass(m)}">${escapeHtml(m)}</span>
    </th>
  `).join("");

  const bodyRows = matrix.map(row => {
    const tSlug = tradSlug(row.tradition.label);
    const cells = maturityLevels.map(m => {
      const list = row.cells[m];
      if (!list.length) return `<td class="cell-empty" aria-label="keine Konzepte mit Reifegrad ${escapeAttr(m)}">—</td>`;
      const items = list.map(c => {
        const href = c.maturity === "fehlend" ? `#gap/${c.id}` : `#konzept/${c.id}`;
        return `<a class="matrix-pill" href="${escapeAttr(href)}">${escapeHtml(c.label.translit || c.label.de)}</a>`;
      }).join("");
      return `<td><div class="matrix-cell">${items}</div></td>`;
    }).join("");
    return `
      <tr>
        <th scope="row"><a href="#tradition/${escapeAttr(tSlug)}">${escapeHtml(row.tradition.label)}</a></th>
        ${cells}
      </tr>
    `;
  }).join("");

  const gapInventory = DATA.concepts
    .filter(c => c.maturity === "fehlend")
    .map(c => `
      <li>
        <a href="#gap/${escapeAttr(c.id)}">${escapeHtml(c.label.de)}</a>
        <span class="ref-meta">${escapeHtml((c.traditions || []).join(", "))}</span>
      </li>
    `).join("");

  root.innerHTML = `
    <header class="page-header">
      <span class="page-kind">Audit</span>
      <h1>Reifegrad-Matrix</h1>
      <p class="lead">
        Welche Tradition wird mit welchem Reifegrad erforscht? Eine etablierte
        Buddhismus-Forschung mit eigener Klassifikation. Daneben berührte
        Traditionen ohne theoretischen Unterbau und ausdrücklich fehlende
        Felder, deren Absenz Befund ist.
      </p>
    </header>

    <section>
      <table class="maturity-matrix" aria-label="Reifegrad pro Tradition und Konzept">
        <thead>
          <tr>
            <th scope="col">Tradition</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </section>

    <section class="gap-inventory">
      <h2>Lücken-Inventar</h2>
      <p class="lead">
        Praktiken, die ausdrücklich als empirisch fehlend geführt werden,
        mit kuratierter Begründung pro Eintrag.
      </p>
      <ul class="gap-list">${gapInventory}</ul>
    </section>
  `;
}

// ---------- About ----------

function renderAbout(root) {
  document.title = "Methodische Position — CONTEXT";
  root.innerHTML = `
    <header class="page-header">
      <span class="page-kind">Methodische Position</span>
      <h1>Was CONTEXT ist und was nicht</h1>
    </header>

    <section class="prose">
      <h2>Leitidee</h2>
      <p>
        CONTEXT kartiert nicht die Wirkungen von Kontemplation. Es kartiert die
        Asymmetrie der Erforschbarkeit. Genau diese Ungleichheit zwischen den
        Traditionen ist der eigentliche Gegenstand, und der Graph soll sie
        sichtbar machen, statt sie zu wiederholen.
      </p>

      <h2>Was CONTEXT ist</h2>
      <p>
        Eine kuratierte semantische Verknüpfungsschicht über sechs Knotentypen:
        Konzepte, Werke, Repräsentationen, Repositorien, Studien und
        Knotenpunkt-Referenzen. Konzept-Knoten stehen im Zentrum und verbinden
        historische Werke mit empirischen Studien zum gleichen Phänomen.
        Wikidata-QID dient als Identifikator-Drehscheibe.
      </p>

      <h2>Was CONTEXT nicht ist</h2>
      <ul>
        <li><strong>Keine Volltextsammlung.</strong> Texte werden verknüpft, nicht kopiert.</li>
        <li><strong>Kein Vollständigkeitskorpus.</strong> Auswahl ist begründet, nicht erschöpfend.</li>
        <li><strong>Keine IIIF-Aggregation.</strong> Bilder von Texten sind nicht analysierbarer Volltext.</li>
        <li><strong>Keine Bewusstseinsforschung im engeren Sinn.</strong> Studien werden als Studien geführt, nicht als eigene Texttradition.</li>
        <li><strong>Keine esoterische Grauzone.</strong> Aufnahmekriterium ist seriöse wissenschaftliche Sekundärliteratur.</li>
        <li><strong>Kein Backend, kein Live-Endpunkt-Call.</strong> Wikidata- und Scholarly-API-Abfragen laufen über kuratorische Skripte und persistieren als datierte Snapshots im Repo.</li>
      </ul>

      <h2>Reifegrad als Erkenntnisinstrument</h2>
      <p>
        Konzepte tragen ein Reifegrad-Feld mit vier Werten:
        <code>etabliert</code>, <code>berührt</code>, <code>beginnend</code>, <code>fehlend</code>.
        Der Reifegrad bezieht sich auf den Forschungszustand, nicht auf die
        Tradition. Eine Tradition mit Reifegrad <code>fehlend</code> ist nicht
        weniger wertvoll — sie ist im aktuellen empirischen Diskurs weniger
        sichtbar, und das ist der Befund.
      </p>

      <h2>Architektur</h2>
      <p>
        Statisches Frontend, clientseitiges JSON-Laden, kein Backend. Drei
        kuratorische Skripte unter <code>tools/</code> pflegen den
        Datenbestand: ein Wikidata-Snapshot-Tool, ein Scholarly-Harvester
        gegen Crossref, Unpaywall und OpenAlex, ein Validator. Re-Harvest
        überschreibt keine kuratorische Arbeit.
      </p>

      <p>
        Datengrundlage und methodische Disziplin sind im Repo unter
        <a href="https://github.com/DigitalHumanitiesCraft/context/tree/main/knowledge" target="_blank" rel="noopener">knowledge/</a>
        dokumentiert.
      </p>
    </section>
  `;
}

// ---------- DOI- und BibTeX-Handler ----------

function bindGlobalActions() {
  document.addEventListener("click", e => {
    const doiBtn = e.target.closest("[data-doi]");
    if (doiBtn) {
      const doi = doiBtn.dataset.doi;
      if (doi) window.open(`https://doi.org/${doi}`, "_blank", "noopener");
      return;
    }
    const bibBtn = e.target.closest("[data-bibtex]");
    if (bibBtn) {
      const studyId = bibBtn.dataset.bibtex;
      const s = DATA?.studyById.get(studyId);
      if (!s) return;
      const bibtex = buildBibtex(s);
      navigator.clipboard.writeText(bibtex).then(
        () => flashStatus(bibBtn, "BibTeX kopiert"),
        () => flashStatus(bibBtn, "Kopieren fehlgeschlagen"),
      );
    }
  });
}

function buildBibtex(s) {
  const firstAuthor = (s.authors?.[0] || "anon").split(",")[0].toLowerCase().replace(/[^a-z]/g, "");
  const key = `${firstAuthor}${s.year || ""}`;
  const authors = (s.authors || []).join(" and ");
  const fields = [
    `  author = {${authors}}`,
    `  title = {${(s.title || "").replace(/[{}]/g, "")}}`,
    s.journal ? `  journal = {${s.journal}}` : null,
    s.year ? `  year = {${s.year}}` : null,
    s.doi ? `  doi = {${s.doi}}` : null,
    s.url ? `  url = {${s.url}}` : null,
  ].filter(Boolean).join(",\n");
  return `@article{${key},\n${fields}\n}`;
}

function flashStatus(button, message) {
  const original = button.textContent;
  button.textContent = message;
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 1600);
}

// ---------- Snapshot-Badge im Header ----------

function updateSnapshotBadge() {
  const badge = document.getElementById("snapshot-badge");
  if (!badge) return;
  const dateNode = badge.querySelector(".snapshot-date");
  const wd = DATA?.snapshot?.wikidata;
  if (!dateNode) return;
  if (wd) {
    dateNode.textContent = wd;
    badge.title = `Jüngster Wikidata-Snapshot: ${wd}`;
  } else {
    dateNode.textContent = "—";
    badge.title = "Kein Wikidata-Snapshot gefunden";
  }
}

// ---------- Init ----------

(async function init() {
  bindGlobalActions();
  try {
    DATA = await loadAll();
    updateSnapshotBadge();
  } catch (err) {
    const root = document.getElementById("view-root");
    if (root) renderError(root, err);
    return;
  }
  window.addEventListener("hashchange", dispatch);
  dispatch();
})();
