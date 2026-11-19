/* =========================================================================
   SPARK DOC HUB — SEGNALAZIONI (problemi del prodotto)
   -------------------------------------------------------------------------
   Elenco dei problemi riscontrati su Spark, collegati a componenti, errori
   e S/N già presenti in data.js / fleet.js. Ogni segnalazione tiene traccia
   delle soluzioni provate e del loro esito.

   I dati restano SOLO su questo dispositivo/browser (IndexedDB, come le
   cartelle di manutenzione). Per non perderli o passarli su un altro
   dispositivo: Esporta → Backup (.json) e poi Importa backup.
   Per la segnalazione massiva: Esporta → Report PDF / Excel (CSV).
   ========================================================================= */

const ISSUE_DB_NAME = "SparkSegnalazioniDB";
const ISSUE_DB_VERSION = 1;
const ISSUE_STORE = "issues";

const ISSUE_TYPES = [
  { id: "difetto", label: "Difetto" },
  { id: "miglioria", label: "Migliorìa" },
  { id: "documentazione", label: "Documentazione" }
];
const ISSUE_SEVERITIES = [
  { id: "bloccante", label: "Bloccante", rank: 4 },
  { id: "alta", label: "Alta", rank: 3 },
  { id: "media", label: "Media", rank: 2 },
  { id: "bassa", label: "Bassa", rank: 1 }
];
const ISSUE_STATUSES = [
  { id: "aperta", label: "Aperta" },
  { id: "analisi", label: "In analisi" },
  { id: "soluzione", label: "Soluzione proposta" },
  { id: "verificata", label: "Verificata" },
  { id: "chiusa", label: "Chiusa" }
];
const SOLUTION_OUTCOMES = [
  { id: "daprovare", label: "Da provare" },
  { id: "funziona", label: "Funziona" },
  { id: "parziale", label: "Parziale" },
  { id: "nonfunziona", label: "Non funziona" }
];

const issueLabel = (list, id) => (list.find(x => x.id === id) || { label: id || "" }).label;
const severityRank = id => (ISSUE_SEVERITIES.find(s => s.id === id) || { rank: 0 }).rank;
const isIssueOpen = issue => issue.status !== "chiusa";

/* ---------------------------------------------------------------------
   STORAGE (IndexedDB) + cache in memoria
   ------------------------------------------------------------------- */
let ISSUES = []; // cache: tutte le segnalazioni, aggiornata dopo ogni modifica
let issuesLoaded = false;
let issuesPendingDetail = null;

function issueOpenDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(ISSUE_DB_NAME, ISSUE_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ISSUE_STORE)) {
        db.createObjectStore(ISSUE_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function issueTx(mode, fn) {
  const db = await issueOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ISSUE_STORE, mode);
    const result = fn(tx.objectStore(ISSUE_STORE));
    tx.oncomplete = () => resolve(result && "result" in result ? result.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function issuesLoad() {
  try {
    ISSUES = (await issueTx("readonly", store => store.getAll())) || [];
  } catch (err) {
    console.error("Segnalazioni: lettura fallita", err);
    ISSUES = [];
  }
  return ISSUES;
}

async function issueSave(issue) {
  issue.updatedAt = new Date().toISOString();
  await issueTx("readwrite", store => store.put(issue));
  await issuesAfterChange();
}

async function issueDelete(id) {
  await issueTx("readwrite", store => store.delete(id));
  await issuesAfterChange();
}

async function issuesAfterChange() {
  await issuesLoad();
  issuesRenderList();
  issuesMarkMapHotspots();
  // Scheda componente aperta: aggiorna il riquadro segnalazioni
  if (state.detail && state.detail.type === "component") issuesRenderComponentBlock(state.detail.id);
}

function issueNewId() {
  return "iss-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

function issueNextNumber() {
  return ISSUES.reduce((m, i) => Math.max(m, i.num || 0), 0) + 1;
}

function issueById(id) {
  return ISSUES.find(i => i.id === id) || null;
}

/* ---------------------------------------------------------------------
   DATI COLLEGATI (componenti, errori, S/N)
   ------------------------------------------------------------------- */
function issueComponentName(id) {
  const nome = (typeof UTENZE !== "undefined" && UTENZE[id]) || "";
  return nome ? displayName(nome) : "";
}

function issueErrorList(fw) {
  if (fw === "7.9" && typeof ERRORS_79 !== "undefined") return ERRORS_79;
  return ERRORS;
}

function issueErrorText(code, fw) {
  const er = issueErrorList(fw).find(e => e.code === code);
  return er ? er.text : "";
}

function issueFwLabel(fw) {
  const v = FW_VERSIONS.find(f => f.id === fw);
  return v ? v.label : (fw || "");
}

function issueSnLabel(sn) {
  const unit = typeof sparkFindUnit === "function" ? sparkFindUnit(sn) : null;
  return unit ? `${unit.sn} · ${unit.cliente}` : sn;
}

function issueOpenForComponent(id) {
  return ISSUES.filter(i => isIssueOpen(i) && (i.components || []).includes(id));
}

/* ---------------------------------------------------------------------
   ELENCO: filtri, raggruppamento, render
   ------------------------------------------------------------------- */
const issueFilters = { status: "open", severity: "", component: "", search: "", group: "list" };

function issuesFiltered() {
  const q = issueFilters.search.trim().toLowerCase();
  return ISSUES.filter(i => {
    if (issueFilters.status === "open" && !isIssueOpen(i)) return false;
    if (issueFilters.status === "closed" && isIssueOpen(i)) return false;
    if (issueFilters.severity && i.severity !== issueFilters.severity) return false;
    if (issueFilters.component && !(i.components || []).includes(issueFilters.component)) return false;
    if (q) {
      const hay = [
        "#" + i.num, i.title, i.description,
        ...(i.components || []).map(c => c + " " + issueComponentName(c)),
        ...(i.errors || []), ...(i.sns || []),
        ...(i.solutions || []).map(s => s.text)
      ].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) =>
    (isIssueOpen(b) - isIssueOpen(a)) ||
    (severityRank(b.severity) - severityRank(a.severity)) ||
    String(b.updatedAt).localeCompare(String(a.updatedAt))
  );
}

function issueBadgesHtml(issue) {
  return `
    <span class="iss-badge sev-${escapeHtml(issue.severity)}">${escapeHtml(issueLabel(ISSUE_SEVERITIES, issue.severity))}</span>
    <span class="iss-badge st-${escapeHtml(issue.status)}">${escapeHtml(issueLabel(ISSUE_STATUSES, issue.status))}</span>
    ${issue.type && issue.type !== "difetto" ? `<span class="iss-badge type">${escapeHtml(issueLabel(ISSUE_TYPES, issue.type))}</span>` : ""}`;
}

function issueTileHtml(issue) {
  const comps = (issue.components || []).slice(0, 6).map(c => `<span class="iss-chip">${escapeHtml(c)}</span>`).join("") +
    ((issue.components || []).length > 6 ? `<span class="iss-chip more">+${issue.components.length - 6}</span>` : "");
  const meta = [
    (issue.sns || []).length ? `${issue.sns.length} ${issue.sns.length === 1 ? "macchina" : "macchine"}` : "",
    (issue.solutions || []).length ? `${issue.solutions.length} ${issue.solutions.length === 1 ? "soluzione" : "soluzioni"}` : "",
    (issue.errors || []).length ? (issue.errors || []).join(", ") : ""
  ].filter(Boolean).join(" · ");
  return `
    <button class="iss-tile ${isIssueOpen(issue) ? "" : "closed"}" data-issue-open="${escapeHtml(issue.id)}">
      <span class="iss-sev-bar sev-${escapeHtml(issue.severity)}"></span>
      <span class="iss-tile-body">
        <span class="iss-tile-top"><span class="iss-num">#${issue.num}</span>${issueBadgesHtml(issue)}</span>
        <span class="iss-tile-title">${escapeHtml(issue.title)}</span>
        ${comps ? `<span class="iss-chips">${comps}</span>` : ""}
        ${meta ? `<span class="iss-tile-meta">${escapeHtml(meta)}</span>` : ""}
      </span>
      ${CHEVRON_SVG}
    </button>`;
}

function issuesRenderSummary() {
  const box = document.getElementById("issuesSummary");
  if (!box) return;
  const open = ISSUES.filter(isIssueOpen);
  const count = sev => open.filter(i => i.severity === sev).length;
  const machines = new Set(open.flatMap(i => i.sns || [])).size;
  box.innerHTML = `
    <div class="iss-stat"><strong>${open.length}</strong><span>aperte</span></div>
    <div class="iss-stat sev-bloccante"><strong>${count("bloccante")}</strong><span>bloccanti</span></div>
    <div class="iss-stat sev-alta"><strong>${count("alta")}</strong><span>alta gravità</span></div>
    <div class="iss-stat"><strong>${machines}</strong><span>macchine coinvolte</span></div>`;
}

function issuesRenderComponentFilter() {
  const sel = document.getElementById("issueFilterComponent");
  if (!sel) return;
  const used = Array.from(new Set(ISSUES.flatMap(i => i.components || []))).sort();
  sel.innerHTML = `<option value="">Tutti i componenti</option>` +
    used.map(id => `<option value="${escapeHtml(id)}">${escapeHtml(id)} ${escapeHtml(issueComponentName(id))}</option>`).join("");
  if (!used.includes(issueFilters.component)) issueFilters.component = "";
  sel.value = issueFilters.component;
}

function issuesRenderList() {
  const container = document.getElementById("issuesContainer");
  if (!container) return;
  issuesRenderSummary();
  issuesRenderComponentFilter();

  const items = issuesFiltered();
  const countEl = document.getElementById("issuesCount");
  if (countEl) countEl.textContent = `${items.length} ${items.length === 1 ? "segnalazione" : "segnalazioni"}`;

  if (ISSUES.length === 0) {
    container.innerHTML = `<div class="empty-state">Nessuna segnalazione. Usa «Nuova segnalazione» oppure il pulsante «Segnala un problema» nella scheda di un componente.</div>`;
    return;
  }
  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state">Nessuna segnalazione corrisponde ai filtri.</div>`;
    return;
  }

  if (issueFilters.group === "component") {
    // Una segnalazione compare sotto ogni componente coinvolto
    const groups = new Map();
    items.forEach(i => {
      const comps = (i.components || []).length ? i.components : ["—"];
      comps.forEach(c => { if (!groups.has(c)) groups.set(c, []); groups.get(c).push(i); });
    });
    const keys = Array.from(groups.keys()).sort((a, b) => {
      if (a === "—") return 1;
      if (b === "—") return -1;
      return groups.get(b).length - groups.get(a).length || a.localeCompare(b);
    });
    container.innerHTML = keys.map(k => {
      const list = groups.get(k);
      const machines = new Set(list.flatMap(i => i.sns || [])).size;
      const title = k === "—" ? "Nessun componente indicato" : `${k} · ${issueComponentName(k)}`;
      return `
        <h3 class="category-heading iss-group-head">
          <span>${escapeHtml(title)}</span>
          <span class="iss-group-count">${list.length} segn.${machines ? ` · ${machines} macch.` : ""}</span>
        </h3>
        ${list.map(issueTileHtml).join("")}`;
    }).join("");
  } else {
    container.innerHTML = items.map(issueTileHtml).join("");
  }
}

/* ---------------------------------------------------------------------
   VISTE (lista / dettaglio / form)
   ------------------------------------------------------------------- */
function issuesShow(which) {
  document.getElementById("issuesListView").style.display = which === "list" ? "block" : "none";
  document.getElementById("issueDetailView").style.display = which === "detail" ? "block" : "none";
  document.getElementById("issueFormView").style.display = which === "form" ? "block" : "none";
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}

function closeIssueViews() {
  if (!document.getElementById("issuesListView")) return;
  issuesShow("list");
  if (state.detail && (state.detail.type === "issue" || state.detail.type === "issueform")) state.detail = null;
  scheduleHistorySync();
}

/* -- Dettaglio ---------------------------------------------------- */
function openIssueDetail(id) {
  const issue = issueById(id);
  if (!issue) {
    // Ricarica della pagina: i dati arrivano da IndexedDB dopo, la apre issuesInit
    if (!issuesLoaded) { issuesPendingDetail = id; state.detail = { type: "issue", id }; return; }
    closeIssueViews();
    return;
  }
  document.getElementById("issueDetailTitle").innerHTML =
    `<span class="iss-num big">#${issue.num}</span> ${escapeHtml(issue.title)}`;
  document.getElementById("issueDetailSub").innerHTML = `<span class="cd-badges">${issueBadgesHtml(issue)}</span>`;

  const row = (label, value) => value ? `<div class="sn-unit-row"><span class="sn-unit-label">${escapeHtml(label)}</span><span class="sn-unit-value">${value}</span></div>` : "";
  const compLinks = (issue.components || []).map(c =>
    `<button type="button" class="iss-chip link" data-issue-goto-comp="${escapeHtml(c)}">${escapeHtml(c)} <small>${escapeHtml(issueComponentName(c))}</small></button>`).join("");
  const errLinks = (issue.errors || []).map(code => {
    const txt = issueErrorText(code, issue.fw);
    return `<div class="iss-err"><span class="cd-err-code">${escapeHtml(code)}</span><span class="cd-err-txt">${escapeHtml(txt || "—")}</span></div>`;
  }).join("");
  const snChips = (issue.sns || []).map(sn => `<span class="iss-chip">${escapeHtml(issueSnLabel(sn))}</span>`).join("");

  const statusOptions = ISSUE_STATUSES.map(s =>
    `<option value="${s.id}" ${s.id === issue.status ? "selected" : ""}>${escapeHtml(s.label)}</option>`).join("");

  const solutions = (issue.solutions || []).map(sol => `
    <div class="iss-sol out-${escapeHtml(sol.outcome)}">
      <div class="iss-sol-text">${escapeHtml(sol.text).replace(/\n/g, "<br>")}</div>
      <div class="iss-sol-foot">
        <span class="iss-sol-date">${escapeHtml(formatDateIt(sol.date))}</span>
        <div class="iss-outcome-row">
          ${SOLUTION_OUTCOMES.map(o => `<button type="button" class="iss-outcome ${o.id === sol.outcome ? "active" : ""} out-${o.id}" data-sol-outcome="${o.id}" data-sol-id="${escapeHtml(sol.id)}">${escapeHtml(o.label)}</button>`).join("")}
          <button type="button" class="iss-icon-btn" data-sol-delete="${escapeHtml(sol.id)}" aria-label="Elimina soluzione">${TRASH_ICON_SVG}</button>
        </div>
      </div>
    </div>`).join("");

  const photos = (issue.photos || []).map(p =>
    `<a class="iss-photo" href="${p.dataUrl}" target="_blank" rel="noopener"><img src="${p.dataUrl}" alt="${escapeHtml(p.name || "foto")}"></a>`).join("");

  document.getElementById("issueDetailFields").innerHTML = `
    <div class="iss-status-row">
      <label for="issueStatusSelect">Stato</label>
      <select id="issueStatusSelect" class="iss-input">${statusOptions}</select>
    </div>

    ${issue.description ? `<div class="iss-section"><h3 class="sub-heading">Descrizione</h3><p class="iss-desc">${escapeHtml(issue.description).replace(/\n/g, "<br>")}</p></div>` : ""}

    <div class="sn-unit-card">
      ${row("Tipo", escapeHtml(issueLabel(ISSUE_TYPES, issue.type)))}
      ${row("Versione FW", escapeHtml(issueFwLabel(issue.fw)))}
      ${row("Creata", escapeHtml(formatDateIt(issue.createdAt)))}
      ${row("Ultima modifica", escapeHtml(formatDateIt(issue.updatedAt)))}
    </div>

    ${compLinks ? `<div class="iss-section"><h3 class="sub-heading">Componenti coinvolti</h3><div class="iss-chips">${compLinks}</div></div>` : ""}
    ${errLinks ? `<div class="iss-section"><h3 class="sub-heading">Errori collegati</h3>${errLinks}</div>` : ""}
    ${snChips ? `<div class="iss-section"><h3 class="sub-heading">Macchine coinvolte (${issue.sns.length})</h3><div class="iss-chips">${snChips}</div></div>` : ""}
    ${photos ? `<div class="iss-section"><h3 class="sub-heading">Foto</h3><div class="iss-photos">${photos}</div></div>` : ""}

    <div class="iss-section">
      <h3 class="sub-heading">Soluzioni e tentativi (${(issue.solutions || []).length})</h3>
      ${solutions || `<p class="iss-muted">Nessuna soluzione ancora. Aggiungi cosa hai provato o cosa proporre.</p>`}
      <div class="iss-sol-add">
        <textarea id="issueNewSolution" class="iss-input" rows="2" placeholder="Nuova soluzione o tentativo (es. sostituito L_2, ritarato PO_1…)"></textarea>
        <button type="button" class="new-maint-btn" id="issueAddSolutionBtn">Aggiungi soluzione</button>
      </div>
    </div>

    <div class="iss-detail-actions">
      <button type="button" class="new-maint-btn secondary" id="issueEditBtn">Modifica</button>
      <button type="button" class="new-maint-btn danger" id="issueDeleteBtn">Elimina</button>
    </div>`;

  issuesShow("detail");
  state.detail = { type: "issue", id };
  scheduleHistorySync();
}

/* -- Form (nuova / modifica) --------------------------------------- */
let issueDraft = null; // segnalazione in modifica

function openIssueForm(idOrPrefill) {
  const existing = typeof idOrPrefill === "string" && idOrPrefill !== "new" ? issueById(idOrPrefill) : null;
  const prefill = typeof idOrPrefill === "object" && idOrPrefill ? idOrPrefill : {};
  issueDraft = existing ? JSON.parse(JSON.stringify(existing)) : {
    id: null, title: "", description: "", type: "difetto", severity: "media", status: "aperta",
    fw: state.fw, components: [], errors: [], sns: [], solutions: [], photos: [],
    ...prefill
  };
  document.getElementById("issueFormTitle").textContent = existing ? `Modifica #${existing.num}` : "Nuova segnalazione";
  issuesRenderForm();
  issuesShow("form");
  state.detail = { type: "issueform", id: existing ? existing.id : "new" };
  scheduleHistorySync();
  setTimeout(() => document.getElementById("issFormTitle")?.focus(), 50);
}

function issueSelectHtml(id, list, value) {
  return `<select id="${id}" class="iss-input">${list.map(o =>
    `<option value="${o.id}" ${o.id === value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}</select>`;
}

function issuesRenderForm() {
  const d = issueDraft;
  const box = document.getElementById("issueFormFields");
  box.innerHTML = `
    <label class="iss-field">
      <span>Titolo *</span>
      <input type="text" id="issFormTitle" class="iss-input" maxlength="140" placeholder="Es. Laser L_2 non rileva il barellino in carico" value="${escapeHtml(d.title)}">
    </label>
    <label class="iss-field">
      <span>Descrizione</span>
      <textarea id="issFormDesc" class="iss-input" rows="4" placeholder="Cosa succede, quando, come si riproduce">${escapeHtml(d.description)}</textarea>
    </label>
    <div class="iss-field-grid">
      <label class="iss-field"><span>Tipo</span>${issueSelectHtml("issFormType", ISSUE_TYPES, d.type)}</label>
      <label class="iss-field"><span>Gravità</span>${issueSelectHtml("issFormSeverity", ISSUE_SEVERITIES, d.severity)}</label>
      <label class="iss-field"><span>Stato</span>${issueSelectHtml("issFormStatus", ISSUE_STATUSES, d.status)}</label>
      <label class="iss-field"><span>Versione FW</span>${issueSelectHtml("issFormFw", [{ id: "", label: "Non specificata" }, ...FW_VERSIONS], d.fw)}</label>
    </div>

    <div class="iss-field">
      <span>Componenti coinvolti</span>
      <div class="iss-picked" id="issPickedComps"></div>
      <div class="search-box iss-picker-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" id="issCompSearch" placeholder="Cerca componente (es. L_2, laser, motore)…" autocomplete="off">
      </div>
      <div class="iss-picker" id="issCompPicker"></div>
    </div>

    <div class="iss-field">
      <span>Errori collegati</span>
      <div class="iss-picked" id="issPickedErrors"></div>
      <div class="search-box iss-picker-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" id="issErrSearch" placeholder="Codice o parola (es. L200, laser)…" autocomplete="off">
      </div>
      <div class="iss-picker" id="issErrPicker"></div>
    </div>

    <div class="iss-field">
      <span>Macchine coinvolte (S/N)</span>
      <div class="iss-picked" id="issPickedSns"></div>
      <div class="search-box iss-picker-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" id="issSnSearch" placeholder="S/N o cliente — Invio per aggiungere un S/N non in elenco" autocomplete="off">
      </div>
      <div class="iss-picker" id="issSnPicker"></div>
    </div>

    <div class="iss-field">
      <span>Foto</span>
      <div class="iss-photos" id="issFormPhotos"></div>
      <label class="new-maint-btn secondary iss-photo-btn">
        <input type="file" id="issPhotoInput" accept="image/*" multiple hidden>
        Aggiungi foto
      </label>
    </div>

    <div class="iss-detail-actions">
      <button type="button" class="new-maint-btn secondary" id="issFormCancel">Annulla</button>
      <button type="button" class="new-maint-btn" id="issFormSave">Salva segnalazione</button>
    </div>`;
  issuesRenderPicked();
  issuesRenderCompPicker("");
  issuesRenderErrPicker("");
  issuesRenderSnPicker("");
  issuesRenderFormPhotos();
}

function issuesReadFormFields() {
  const d = issueDraft;
  d.title = document.getElementById("issFormTitle").value.trim();
  d.description = document.getElementById("issFormDesc").value.trim();
  d.type = document.getElementById("issFormType").value;
  d.severity = document.getElementById("issFormSeverity").value;
  d.status = document.getElementById("issFormStatus").value;
  d.fw = document.getElementById("issFormFw").value;
}

function issuesRenderPicked() {
  const d = issueDraft;
  const chip = (kind, value, label) =>
    `<button type="button" class="iss-chip picked" data-unpick="${kind}" data-value="${escapeHtml(value)}">${label} <span aria-hidden="true">×</span></button>`;
  document.getElementById("issPickedComps").innerHTML = d.components.map(c =>
    chip("components", c, `${escapeHtml(c)} <small>${escapeHtml(issueComponentName(c))}</small>`)).join("") || `<span class="iss-muted">Nessuno</span>`;
  document.getElementById("issPickedErrors").innerHTML = d.errors.map(c =>
    chip("errors", c, escapeHtml(c))).join("") || `<span class="iss-muted">Nessuno</span>`;
  document.getElementById("issPickedSns").innerHTML = d.sns.map(sn =>
    chip("sns", sn, escapeHtml(issueSnLabel(sn)))).join("") || `<span class="iss-muted">Nessuna</span>`;
}

function issuesRenderCompPicker(query) {
  const q = query.trim().toLowerCase();
  const picked = new Set(issueDraft.components);
  const box = document.getElementById("issCompPicker");
  const groups = (typeof COMPONENT_FILTER_GROUPS !== "undefined") ? COMPONENT_FILTER_GROUPS : { tutti: { label: "", cats: null } };
  const dict = I18N[state.lang] || I18N.it;
  let html = "";
  Object.keys(groups).forEach(gk => {
    const g = groups[gk];
    const comps = COMPONENTS.filter(c => (!g.cats || g.cats.includes(c.categoria)))
      .filter(c => !q || (c.id + " " + issueComponentName(c.id) + " " + c.categoria).toLowerCase().includes(q));
    if (!comps.length) return;
    html += `<div class="iss-picker-group">${escapeHtml(dict[g.label] || gk)}</div>` + comps.map(c =>
      `<button type="button" class="iss-chip option ${picked.has(c.id) ? "on" : ""}" data-pick="components" data-value="${escapeHtml(c.id)}">${escapeHtml(c.id)} <small>${escapeHtml(issueComponentName(c.id))}</small></button>`).join("");
  });
  box.innerHTML = html || `<span class="iss-muted">Nessun componente trovato.</span>`;
}

function issuesRenderErrPicker(query) {
  const q = query.trim().toLowerCase();
  const box = document.getElementById("issErrPicker");
  if (!q) { box.innerHTML = `<span class="iss-muted">Scrivi per cercare tra gli errori ${escapeHtml(issueFwLabel(issueDraft.fw || state.fw))}.</span>`; return; }
  const picked = new Set(issueDraft.errors);
  const list = issueErrorList(issueDraft.fw || state.fw)
    .filter(e => (e.code + " " + e.text + " " + (e.en || "")).toLowerCase().includes(q)).slice(0, 25);
  box.innerHTML = list.map(e =>
    `<button type="button" class="iss-err-option ${picked.has(e.code) ? "on" : ""}" data-pick="errors" data-value="${escapeHtml(e.code)}"><span class="cd-err-code">${escapeHtml(e.code)}</span><span class="cd-err-txt">${escapeHtml(e.text)}</span></button>`).join("")
    || `<span class="iss-muted">Nessun errore trovato.</span>`;
}

function issuesRenderSnPicker(query) {
  const q = query.trim().toLowerCase();
  const picked = new Set(issueDraft.sns);
  const box = document.getElementById("issSnPicker");
  const fleet = typeof SPARK_FLEET !== "undefined" ? SPARK_FLEET : [];
  const list = fleet.filter(u => !q || (u.sn + " " + u.cliente + " " + (u.fs || "")).toLowerCase().includes(q));
  box.innerHTML = list.map(u =>
    `<button type="button" class="iss-chip option ${picked.has(u.sn) ? "on" : ""}" data-pick="sns" data-value="${escapeHtml(u.sn)}">${escapeHtml(u.sn)} <small>${escapeHtml(u.cliente)}</small></button>`).join("")
    || `<span class="iss-muted">Nessuno S/N in elenco: premi Invio per aggiungerlo.</span>`;
}

function issuesRenderFormPhotos() {
  document.getElementById("issFormPhotos").innerHTML = issueDraft.photos.map(p => `
    <div class="iss-photo">
      <img src="${p.dataUrl}" alt="${escapeHtml(p.name || "foto")}">
      <button type="button" class="iss-photo-del" data-photo-delete="${escapeHtml(p.id)}" aria-label="Rimuovi foto">×</button>
    </div>`).join("");
}

/* Foto ridimensionate (max 1280 px, JPEG) per tenere leggeri backup e PDF */
function issueResizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Immagine non leggibile"));
      img.onload = () => {
        const max = 1280;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function issueSaveForm() {
  issuesReadFormFields();
  const d = issueDraft;
  if (!d.title) {
    alert("Inserisci almeno il titolo della segnalazione.");
    document.getElementById("issFormTitle").focus();
    return;
  }
  const isNew = !d.id;
  if (isNew) {
    d.id = issueNewId();
    d.num = issueNextNumber();
    d.createdAt = new Date().toISOString();
  }
  try {
    await issueSave(d);
  } catch (err) {
    alert("Errore durante il salvataggio: " + (err && err.message ? err.message : err));
    if (isNew) d.id = null;
    return;
  }
  const id = d.id;
  issueDraft = null;
  // Dal form si passa alla scheda, senza lasciare il form nella cronologia
  if (history.state && history.state.route && history.state.route.detail && history.state.route.detail.type === "issueform") {
    nav.applying = true;
    openIssueDetail(id);
    nav.applying = false;
    history.replaceState(Object.assign({}, history.state, { route: currentRoute() }), "");
  } else {
    openIssueDetail(id);
  }
}

/* ---------------------------------------------------------------------
   AGGANCI: scheda componente e mappa
   ------------------------------------------------------------------- */
function issuesRenderComponentBlock(id) {
  const box = document.getElementById("componentIssuesBlock");
  if (!box) return;
  const open = issueOpenForComponent(id);
  const list = open.slice(0, 5).map(i => `
    <button type="button" class="iss-mini" data-issue-goto="${escapeHtml(i.id)}">
      <span class="iss-sev-dot sev-${escapeHtml(i.severity)}"></span>
      <span class="iss-mini-num">#${i.num}</span>
      <span class="iss-mini-title">${escapeHtml(i.title)}</span>
    </button>`).join("");
  box.innerHTML = `
    <div class="iss-comp-block ${open.length ? "has" : ""}">
      <div class="iss-comp-head">
        <span>${open.length ? `${open.length} ${open.length === 1 ? "segnalazione aperta" : "segnalazioni aperte"}` : "Nessuna segnalazione aperta"}</span>
        <button type="button" class="map-link-btn" data-issue-new-comp="${escapeHtml(id)}">Segnala un problema</button>
      </div>
      ${list}
      ${open.length > 5 ? `<button type="button" class="iss-link" data-issue-filter-comp="${escapeHtml(id)}">Vedi tutte (${open.length})</button>` : ""}
    </div>`;
}

function issuesMarkMapHotspots() {
  const el = document.getElementById("mapHotspots");
  if (!el || typeof MAP_VIEWS === "undefined" || state.mapViewIndex === undefined) return;
  const view = MAP_VIEWS[state.mapViewIndex];
  if (!view) return;
  Array.from(el.children).forEach((btn, i) => {
    const h = view.hotspots[i];
    btn.classList.toggle("has-issue", !!h && issueOpenForComponent(h.id).length > 0);
  });
}

function issuesDecorateMapAnswer(answer, compId) {
  if (typeof COMPONENTS === "undefined" || !COMPONENTS.some(c => c.id === compId)) return;
  const n = issueOpenForComponent(compId).length;
  const wrap = document.createElement("div");
  wrap.className = "iss-map-actions";
  wrap.innerHTML = `
    <button type="button" class="map-link-btn" data-issue-new-comp="${escapeHtml(compId)}">Segnala un problema</button>
    ${n ? `<button type="button" class="iss-link" data-issue-filter-comp="${escapeHtml(compId)}">${n} ${n === 1 ? "segnalazione aperta" : "segnalazioni aperte"}</button>` : ""}`;
  answer.appendChild(wrap);
}

function issueNewForComponent(id) {
  goToView("issues");
  openIssueForm({ components: [id] });
}

function issueShowForComponent(id) {
  goToView("issues");
  issueFilters.component = id;
  issueFilters.status = "open";
  issuesSyncFilterControls();
  issuesRenderList();
}

function issueGoToComponent(id) {
  goToView("simulator");
  goToComponent(id);
}

/* ---------------------------------------------------------------------
   EXPORT: report PDF, Excel (CSV), backup JSON + import
   ------------------------------------------------------------------- */
function issueTodayStamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function issueExportCsv(items) {
  const cols = ["N", "Titolo", "Tipo", "Gravità", "Stato", "Componenti", "Errori", "Versione FW", "S/N", "N. macchine",
    "Descrizione", "Soluzioni (esito)", "Creata", "Ultima modifica"];
  const cell = v => {
    const s = String(v ?? "").replace(/\r?\n/g, " ");
    return /[";]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = items.map(i => [
    i.num, i.title, issueLabel(ISSUE_TYPES, i.type), issueLabel(ISSUE_SEVERITIES, i.severity), issueLabel(ISSUE_STATUSES, i.status),
    (i.components || []).map(c => `${c} ${issueComponentName(c)}`.trim()).join(", "),
    (i.errors || []).join(", "), issueFwLabel(i.fw),
    (i.sns || []).map(issueSnLabel).join(", "), (i.sns || []).length,
    i.description,
    (i.solutions || []).map(s => `${s.text} [${issueLabel(SOLUTION_OUTCOMES, s.outcome)}]`).join(" | "),
    formatDateIt(i.createdAt), formatDateIt(i.updatedAt)
  ]);
  const csv = "﻿" + [cols, ...rows].map(r => r.map(cell).join(";")).join("\r\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `Spark_segnalazioni_${issueTodayStamp()}.csv`);
}

function issueExportBackup() {
  const data = { app: "Spark Doc Hub", kind: "segnalazioni", version: 1, exportedAt: new Date().toISOString(), issues: ISSUES };
  downloadBlob(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }), `Spark_segnalazioni_backup_${issueTodayStamp()}.json`);
}

async function issueImportBackup(file) {
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch (err) {
    alert("File non valido: non è un backup delle segnalazioni.");
    return;
  }
  const incoming = Array.isArray(data) ? data : data && data.issues;
  if (!Array.isArray(incoming) || incoming.some(i => !i || !i.id || !i.title)) {
    alert("File non valido: non è un backup delle segnalazioni.");
    return;
  }
  // Unione: per ogni id vince la versione modificata più di recente
  let added = 0, updated = 0;
  const byId = new Map(ISSUES.map(i => [i.id, i]));
  const toWrite = [];
  incoming.forEach(i => {
    const cur = byId.get(i.id);
    if (!cur) { toWrite.push(i); added++; }
    else if (String(i.updatedAt) > String(cur.updatedAt)) { toWrite.push(i); updated++; }
  });
  if (!toWrite.length) { alert("Niente da importare: le segnalazioni del file sono già presenti."); return; }
  if (!confirm(`Importare ${added} nuove segnalazioni e aggiornarne ${updated}?`)) return;
  try {
    await issueTx("readwrite", store => { toWrite.forEach(i => store.put(i)); });
  } catch (err) {
    alert("Errore durante l'importazione: " + (err && err.message ? err.message : err));
    return;
  }
  await issuesAfterChange();
}

function issueLoadHtml2pdf() {
  if (window.html2pdf) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "js/vendor/html2pdf.bundle.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Libreria PDF non disponibile"));
    document.head.appendChild(s);
  });
}

function issueReportHtml(items) {
  const filtersDesc = [
    issueFilters.status === "open" ? "solo aperte" : issueFilters.status === "closed" ? "solo chiuse" : "tutte",
    issueFilters.severity ? "gravità " + issueLabel(ISSUE_SEVERITIES, issueFilters.severity) : "",
    issueFilters.component ? "componente " + issueFilters.component : "",
    issueFilters.search ? `ricerca «${issueFilters.search}»` : ""
  ].filter(Boolean).join(" · ");

  // Riepilogo per componente
  const byComp = new Map();
  items.forEach(i => (i.components || []).forEach(c => {
    if (!byComp.has(c)) byComp.set(c, []);
    byComp.get(c).push(i);
  }));
  const compRows = Array.from(byComp.entries())
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([c, list]) => {
      const maxSev = list.reduce((m, i) => severityRank(i.severity) > severityRank(m) ? i.severity : m, "bassa");
      const machines = new Set(list.flatMap(i => i.sns || [])).size;
      return `<tr><td><b>${escapeHtml(c)}</b> ${escapeHtml(issueComponentName(c))}</td><td class="c">${list.length}</td>
        <td><span class="rb sev-${maxSev}">${escapeHtml(issueLabel(ISSUE_SEVERITIES, maxSev))}</span></td><td class="c">${machines}</td>
        <td>${list.map(i => "#" + i.num).join(", ")}</td></tr>`;
    }).join("");

  const issuesHtml = items.map(i => `
    <div class="ri">
      <div class="ri-head">
        <span class="ri-num">#${i.num}</span>
        <span class="ri-title">${escapeHtml(i.title)}</span>
      </div>
      <div class="ri-badges">
        <span class="rb sev-${escapeHtml(i.severity)}">${escapeHtml(issueLabel(ISSUE_SEVERITIES, i.severity))}</span>
        <span class="rb">${escapeHtml(issueLabel(ISSUE_STATUSES, i.status))}</span>
        <span class="rb">${escapeHtml(issueLabel(ISSUE_TYPES, i.type))}</span>
        ${i.fw ? `<span class="rb">${escapeHtml(issueFwLabel(i.fw))}</span>` : ""}
      </div>
      ${i.description ? `<p>${escapeHtml(i.description).replace(/\n/g, "<br>")}</p>` : ""}
      <table class="rk">
        ${(i.components || []).length ? `<tr><th>Componenti</th><td>${i.components.map(c => `<b>${escapeHtml(c)}</b> ${escapeHtml(issueComponentName(c))}`).join(", ")}</td></tr>` : ""}
        ${(i.errors || []).length ? `<tr><th>Errori</th><td>${i.errors.map(c => `<b>${escapeHtml(c)}</b> ${escapeHtml(issueErrorText(c, i.fw))}`).join("<br>")}</td></tr>` : ""}
        ${(i.sns || []).length ? `<tr><th>Macchine (${i.sns.length})</th><td>${i.sns.map(s => escapeHtml(issueSnLabel(s))).join(", ")}</td></tr>` : ""}
        <tr><th>Date</th><td>creata ${escapeHtml(formatDateIt(i.createdAt))} · aggiornata ${escapeHtml(formatDateIt(i.updatedAt))}</td></tr>
      </table>
      ${(i.solutions || []).length ? `
        <div class="rs-title">Soluzioni e tentativi</div>
        ${i.solutions.map(s => `<div class="rs out-${escapeHtml(s.outcome)}"><span class="rs-out">${escapeHtml(issueLabel(SOLUTION_OUTCOMES, s.outcome))}</span>${escapeHtml(s.text).replace(/\n/g, "<br>")}</div>`).join("")}` : ""}
      ${(i.photos || []).length ? `<div class="rp">${i.photos.map(p => `<img src="${p.dataUrl}">`).join("")}</div>` : ""}
    </div>`).join("");

  const open = items.filter(isIssueOpen).length;
  const machines = new Set(items.flatMap(i => i.sns || [])).size;
  return `
    <style>
      .rep { font-family: 'Poppins', Arial, sans-serif; color: #14212e; font-size: 10.5px; line-height: 1.45; padding: 4px; }
      .rep h1 { font-size: 18px; color: #004082; margin: 0 0 2px; }
      .rep h2 { font-size: 12.5px; color: #004082; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: .04em; }
      .rep .sub { color: #55677a; margin: 0 0 12px; }
      .rep .stats { display: flex; gap: 8px; margin-bottom: 6px; }
      .rep .stats div { border: 1px solid #dee6ed; border-radius: 6px; padding: 6px 10px; }
      .rep .stats b { font-size: 15px; display: block; color: #004082; }
      .rep table { border-collapse: collapse; width: 100%; }
      .rep .rc th, .rep .rc td { border-bottom: 1px solid #dee6ed; padding: 4px 6px; text-align: left; vertical-align: top; }
      .rep .rc th { background: #e9f1f8; font-size: 9.5px; text-transform: uppercase; }
      .rep .c { text-align: center; }
      .rep .ri { border: 1px solid #dee6ed; border-radius: 6px; padding: 9px 11px; margin-bottom: 9px; page-break-inside: avoid; }
      .rep .ri-head { font-size: 12.5px; font-weight: 700; margin-bottom: 4px; }
      .rep .ri-num { color: #004082; margin-right: 6px; }
      .rep .ri p { margin: 6px 0; }
      .rep .rb { display: inline-block; border-radius: 99px; padding: 1px 7px; margin-right: 4px; font-size: 9px; font-weight: 600; background: #e9f1f8; color: #004082; }
      .rep .rb.sev-bloccante { background: #b42318; color: #fff; }
      .rep .rb.sev-alta { background: #fde2cc; color: #9a3c00; }
      .rep .rb.sev-media { background: #fff1c2; color: #7a5a00; }
      .rep .rb.sev-bassa { background: #eef1f4; color: #55677a; }
      .rep .rk th { width: 95px; text-align: left; color: #55677a; font-weight: 600; padding: 2px 6px 2px 0; vertical-align: top; }
      .rep .rk td { padding: 2px 0; }
      .rep .rs-title { font-weight: 700; margin: 8px 0 4px; }
      .rep .rs { border-left: 3px solid #dee6ed; padding: 2px 0 2px 8px; margin-bottom: 4px; }
      .rep .rs.out-funziona { border-color: #1f8a5f; }
      .rep .rs.out-nonfunziona { border-color: #b42318; }
      .rep .rs.out-parziale { border-color: #d98e04; }
      .rep .rs-out { font-weight: 700; margin-right: 6px; }
      .rep .rp img { height: 110px; margin: 6px 6px 0 0; border-radius: 4px; }
    </style>
    <div class="rep">
      <h1>SPARK — Report segnalazioni</h1>
      <p class="sub">Generato il ${escapeHtml(formatDateIt(new Date().toISOString()))} · ${items.length} segnalazioni (${escapeHtml(filtersDesc)})</p>
      <div class="stats">
        <div><b>${items.length}</b>segnalazioni</div>
        <div><b>${open}</b>aperte</div>
        <div><b>${items.filter(i => i.severity === "bloccante").length}</b>bloccanti</div>
        <div><b>${machines}</b>macchine coinvolte</div>
      </div>
      ${compRows ? `<h2>Riepilogo per componente</h2>
        <table class="rc"><tr><th>Componente</th><th class="c">Segn.</th><th>Gravità max</th><th class="c">Macchine</th><th>Segnalazioni</th></tr>${compRows}</table>` : ""}
      <h2>Dettaglio segnalazioni</h2>
      ${issuesHtml}
    </div>`;
}

async function issueExportPdf(items, btn) {
  const label = btn ? btn.textContent : "";
  if (btn) { btn.disabled = true; btn.textContent = "Creo il PDF…"; }
  // Lo stile del report va nella <head> per tutta la durata dell'export:
  // html2pdf ignora il <style> contenuto nella sorgente.
  const html = issueReportHtml(items);
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const styleEl = document.createElement("style");
  styleEl.textContent = styleMatch ? styleMatch[1] : "";
  document.head.appendChild(styleEl);
  try {
    await issueLoadHtml2pdf();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    // Sorgente come stringa: html2pdf la impagina nel suo contenitore
    // (un elemento fuori schermo verrebbe catturato vuoto).
    const blob = await html2pdf().set({
      margin: [10, 10, 12, 10],
      filename: `Spark_report_segnalazioni_${issueTodayStamp()}.pdf`,
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
      pagebreak: { mode: ["css", "legacy"], avoid: [".ri", "tr"] }
    }).from(styleMatch ? html.replace(styleMatch[0], "") : html, "string").outputPdf("blob");
    downloadBlob(blob, `Spark_report_segnalazioni_${issueTodayStamp()}.pdf`);
  } catch (err) {
    alert("Impossibile creare il PDF: " + (err && err.message ? err.message : err));
  } finally {
    styleEl.remove();
    if (btn) { btn.disabled = false; btn.textContent = label; }
  }
}

/* ---------------------------------------------------------------------
   EVENTI
   ------------------------------------------------------------------- */
function issuesSyncFilterControls() {
  document.querySelectorAll("#issueStatusRow .filter-chip").forEach(c => c.classList.toggle("active", c.dataset.issueStatus === issueFilters.status));
  document.querySelectorAll("#issueGroupRow .filter-chip").forEach(c => c.classList.toggle("active", c.dataset.issueGroup === issueFilters.group));
  const sev = document.getElementById("issueFilterSeverity");
  if (sev) sev.value = issueFilters.severity;
  const comp = document.getElementById("issueFilterComponent");
  if (comp) comp.value = issueFilters.component;
  const search = document.getElementById("issueSearch");
  if (search) search.value = issueFilters.search;
}

function issuesBindEvents() {
  const view = document.getElementById("view-issues");
  if (!view) return;

  document.getElementById("issueNewBtn").addEventListener("click", () => openIssueForm("new"));

  document.getElementById("issueStatusRow").addEventListener("click", e => {
    const chip = e.target.closest("[data-issue-status]");
    if (!chip) return;
    issueFilters.status = chip.dataset.issueStatus;
    issuesSyncFilterControls();
    issuesRenderList();
  });
  document.getElementById("issueGroupRow").addEventListener("click", e => {
    const chip = e.target.closest("[data-issue-group]");
    if (!chip) return;
    issueFilters.group = chip.dataset.issueGroup;
    issuesSyncFilterControls();
    issuesRenderList();
  });
  document.getElementById("issueFilterSeverity").addEventListener("change", e => { issueFilters.severity = e.target.value; issuesRenderList(); });
  document.getElementById("issueFilterComponent").addEventListener("change", e => { issueFilters.component = e.target.value; issuesRenderList(); });
  document.getElementById("issueSearch").addEventListener("input", e => { issueFilters.search = e.target.value; issuesRenderList(); });

  document.getElementById("issuesContainer").addEventListener("click", e => {
    const tile = e.target.closest("[data-issue-open]");
    if (tile) openIssueDetail(tile.dataset.issueOpen);
  });

  // Export / import
  document.getElementById("issueExportPdf").addEventListener("click", e => {
    const items = issuesFiltered();
    if (!items.length) { alert("Nessuna segnalazione da esportare con i filtri attuali."); return; }
    issueExportPdf(items, e.currentTarget);
  });
  document.getElementById("issueExportCsv").addEventListener("click", () => {
    const items = issuesFiltered();
    if (!items.length) { alert("Nessuna segnalazione da esportare con i filtri attuali."); return; }
    issueExportCsv(items);
  });
  document.getElementById("issueExportJson").addEventListener("click", () => {
    if (!ISSUES.length) { alert("Nessuna segnalazione da salvare."); return; }
    issueExportBackup();
  });
  document.getElementById("issueImportInput").addEventListener("change", async e => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (file) await issueImportBackup(file);
  });

  // Dettaglio
  document.getElementById("issueDetailBackBtn").addEventListener("click", () => navBack(closeIssueViews));
  document.getElementById("issueDetailFields").addEventListener("change", async e => {
    if (e.target.id !== "issueStatusSelect") return;
    const issue = issueById(state.detail && state.detail.id);
    if (!issue) return;
    issue.status = e.target.value;
    await issueSave(issue);
    openIssueDetailInPlace(issue.id);
  });
  document.getElementById("issueDetailFields").addEventListener("click", async e => {
    const issue = issueById(state.detail && state.detail.id);
    if (!issue) return;
    const comp = e.target.closest("[data-issue-goto-comp]");
    const outcome = e.target.closest("[data-sol-outcome]");
    const solDel = e.target.closest("[data-sol-delete]");
    if (comp) { issueGoToComponent(comp.dataset.issueGotoComp); return; }
    if (e.target.closest("#issueEditBtn")) { openIssueForm(issue.id); return; }
    if (e.target.closest("#issueDeleteBtn")) {
      if (!confirm(`Eliminare definitivamente la segnalazione #${issue.num} «${issue.title}»? Non si può annullare.`)) return;
      await issueDelete(issue.id);
      navBack(closeIssueViews);
      return;
    }
    if (e.target.closest("#issueAddSolutionBtn")) {
      const ta = document.getElementById("issueNewSolution");
      const text = ta.value.trim();
      if (!text) { ta.focus(); return; }
      issue.solutions = issue.solutions || [];
      issue.solutions.push({ id: issueNewId(), text, outcome: "daprovare", date: new Date().toISOString() });
      if (issue.status === "aperta" || issue.status === "analisi") issue.status = "soluzione";
      await issueSave(issue);
      openIssueDetailInPlace(issue.id);
      return;
    }
    if (outcome) {
      const sol = (issue.solutions || []).find(s => s.id === outcome.dataset.solId);
      if (!sol) return;
      sol.outcome = outcome.dataset.solOutcome;
      await issueSave(issue);
      openIssueDetailInPlace(issue.id);
      return;
    }
    if (solDel) {
      if (!confirm("Eliminare questa soluzione?")) return;
      issue.solutions = (issue.solutions || []).filter(s => s.id !== solDel.dataset.solDelete);
      await issueSave(issue);
      openIssueDetailInPlace(issue.id);
    }
  });

  // Form
  document.getElementById("issueFormBackBtn").addEventListener("click", () => navBack(closeIssueFormBack));
  const form = document.getElementById("issueFormFields");
  form.addEventListener("click", async e => {
    const pick = e.target.closest("[data-pick]");
    const unpick = e.target.closest("[data-unpick]");
    const photoDel = e.target.closest("[data-photo-delete]");
    if (pick || unpick) {
      const btn = pick || unpick;
      const kind = btn.dataset.pick || btn.dataset.unpick;
      const value = btn.dataset.value;
      const list = issueDraft[kind];
      const idx = list.indexOf(value);
      if (idx === -1 && pick) list.push(value); else if (idx !== -1) list.splice(idx, 1);
      issuesRenderPicked();
      if (kind === "components") issuesRenderCompPicker(document.getElementById("issCompSearch").value);
      if (kind === "errors") issuesRenderErrPicker(document.getElementById("issErrSearch").value);
      if (kind === "sns") issuesRenderSnPicker(document.getElementById("issSnSearch").value);
      return;
    }
    if (photoDel) {
      issueDraft.photos = issueDraft.photos.filter(p => p.id !== photoDel.dataset.photoDelete);
      issuesRenderFormPhotos();
      return;
    }
    if (e.target.closest("#issFormCancel")) { navBack(closeIssueFormBack); return; }
    if (e.target.closest("#issFormSave")) { await issueSaveForm(); }
  });
  form.addEventListener("input", e => {
    if (e.target.id === "issCompSearch") issuesRenderCompPicker(e.target.value);
    if (e.target.id === "issErrSearch") issuesRenderErrPicker(e.target.value);
    if (e.target.id === "issSnSearch") issuesRenderSnPicker(e.target.value);
  });
  form.addEventListener("change", async e => {
    if (e.target.id === "issFormFw") {
      issueDraft.fw = e.target.value;
      issuesRenderErrPicker(document.getElementById("issErrSearch").value);
    }
    if (e.target.id === "issPhotoInput") {
      const files = Array.from(e.target.files || []);
      e.target.value = "";
      for (const f of files) {
        try {
          issueDraft.photos.push({ id: issueNewId(), name: f.name, dataUrl: await issueResizeImage(f) });
        } catch (err) {
          alert(`Foto «${f.name}» non caricata: ${err.message || err}`);
        }
      }
      issuesRenderFormPhotos();
    }
  });
  form.addEventListener("keydown", e => {
    if (e.target.id !== "issSnSearch" || e.key !== "Enter") return;
    e.preventDefault();
    const raw = e.target.value.trim();
    if (!raw) return;
    const unit = typeof sparkFindUnit === "function" ? sparkFindUnit(raw) : null;
    const sn = unit ? unit.sn : raw;
    if (!issueDraft.sns.includes(sn)) issueDraft.sns.push(sn);
    e.target.value = "";
    issuesRenderPicked();
    issuesRenderSnPicker("");
  });

  // Agganci da scheda componente e mappa (pulsanti generati dinamicamente)
  document.addEventListener("click", e => {
    const newComp = e.target.closest("[data-issue-new-comp]");
    const filterComp = e.target.closest("[data-issue-filter-comp]");
    const gotoIssue = e.target.closest("[data-issue-goto]");
    if (newComp) { e.stopPropagation(); issueNewForComponent(newComp.dataset.issueNewComp); }
    else if (filterComp) { e.stopPropagation(); issueShowForComponent(filterComp.dataset.issueFilterComp); }
    else if (gotoIssue) { e.stopPropagation(); goToView("issues"); openIssueDetail(gotoIssue.dataset.issueGoto); }
  });
}

/* Ridisegna la scheda aperta senza aggiungere voci alla cronologia */
function openIssueDetailInPlace(id) {
  const y = window.scrollY;
  const c = document.querySelector(".content");
  const cy = c ? c.scrollTop : 0;
  nav.applying = true;
  try { openIssueDetail(id); } finally { nav.applying = false; }
  window.scrollTo(0, y);
  if (c) c.scrollTop = cy;
}

/* Annulla/indietro dal form: torna alla scheda (se in modifica) o all'elenco */
function closeIssueFormBack() {
  const editingId = issueDraft && issueDraft.id;
  issueDraft = null;
  if (editingId && issueById(editingId)) openIssueDetail(editingId);
  else closeIssueViews();
}

async function issuesInit() {
  issuesBindEvents();
  await issuesLoad();
  issuesLoaded = true;
  issuesSyncFilterControls();
  issuesRenderList();
  issuesMarkMapHotspots();
  if (issuesPendingDetail) {
    // Ricarica con una segnalazione aperta: ora i dati ci sono
    const id = issuesPendingDetail;
    issuesPendingDetail = null;
    if (state.view === "issues") {
      if (issueById(id)) openIssueDetailInPlace(id);
      else closeIssueViews();
    }
  }
  if (state.detail && state.detail.type === "component") issuesRenderComponentBlock(state.detail.id);
}
