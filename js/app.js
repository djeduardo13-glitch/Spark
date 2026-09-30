/* =========================================================================
   SPARK DOC HUB — APP LOGIC
   Non serve modificare questo file per aggiungere contenuti: usa js/data.js
   ========================================================================= */

const state = {
  lang: "it",
  fw: FW_VERSIONS[0].id,
  view: "home",
  detail: null // pagina di dettaglio aperta: { type: "procedure"|"sn"|"component"|"sequence", id }
};

/* ---------------------------------------------------------------------
   CRONOLOGIA DI NAVIGAZIONE (tasto "indietro")
   Ogni cambio di pagina interna (sezione, scheda del Tecnico, dettaglio)
   viene registrato nella cronologia del browser: il tasto indietro del
   telefono/browser torna alla pagina precedente invece di uscire dall'app.
   ------------------------------------------------------------------- */
const nav = { applying: false, timer: null, backIntent: false };

function currentRoute() {
  return {
    view: state.view,
    simMode: state.view === "simulator" ? (state.simMode || "panel") : null,
    detail: state.detail ? { type: state.detail.type, id: state.detail.id } : null
  };
}

function sameRoute(a, b) {
  return !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
}

function currentScroll() {
  const c = document.querySelector(".content");
  return Math.max(window.scrollY || 0, c ? c.scrollTop : 0);
}

// Raggruppa i cambi fatti nello stesso clic in un'unica voce di cronologia
function scheduleHistorySync() {
  if (nav.applying) return;
  clearTimeout(nav.timer);
  nav.timer = setTimeout(syncHistory, 0);
}

function syncHistory() {
  const route = currentRoute();
  const cur = history.state;
  if (!cur || !cur.route) {
    history.replaceState({ route, prev: null }, "");
    return;
  }
  const backIntent = nav.backIntent;
  nav.backIntent = false;
  if (sameRoute(cur.route, route)) return;
  // Pulsante "Torna a..." verso la pagina precedente: equivale al tasto indietro
  if (backIntent && sameRoute(cur.prev, route)) {
    history.back();
    return;
  }
  history.replaceState(Object.assign({}, cur, { scroll: currentScroll() }), "");
  history.pushState({ route, prev: cur.route, scroll: 0 }, "");
}

function applyRoute(route) {
  nav.applying = true;
  try {
    goToView(route.view);
    if (route.view === "simulator" && route.simMode && route.simMode !== state.simMode) switchSimMode(route.simMode);
    closeProcedureDetail();
    closeSnFolder();
    closeComponentDetail();
    closeSequenceDetail();
    closeFwTable();
    const d = route.detail;
    if (d) {
      if (d.type === "procedure") openProcedureDetail(d.id);
      else if (d.type === "sn") openSnFolder(d.id);
      else if (d.type === "component") openComponentDetail(d.id);
      else if (d.type === "fwtable") openFwTable();
      else if (d.type === "sequence") {
        const step = OPERATION_SEQUENCE.find(s => s.id === d.id);
        if (step) syncSequenceType(step.tipo);
        openSequenceDetail(d.id);
      }
    }
  } finally {
    nav.applying = false;
  }
}

// Da usare per i pulsanti "Torna a..." dentro l'app
function navBack(closeFn) {
  nav.backIntent = true;
  closeFn();
}

window.addEventListener("popstate", (e) => {
  if (!e.state || !e.state.route) return;
  applyRoute(e.state.route);
  const y = e.state.scroll || 0;
  requestAnimationFrame(() => {
    window.scrollTo(0, y);
    document.querySelector(".content").scrollTo?.(0, y);
  });
});

/* ---------------------------------------------------------------------
   I18N
   ------------------------------------------------------------------- */
function applyI18n() {
  const dict = I18N[state.lang] || I18N.it;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
}

document.getElementById("langSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-pill");
  if (!btn || btn.disabled) return;
  document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  state.lang = btn.dataset.lang;
  applyI18n();
});

/* ---------------------------------------------------------------------
   NAVIGAZIONE TRA VIEW
   ------------------------------------------------------------------- */
function goToView(viewId) {
  state.view = viewId;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + viewId).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === viewId));
  closeDrawer();
  if (viewId === "checklist" && typeof closeProcedureDetail === "function") closeProcedureDetail();
  if (viewId === "checklist" && typeof closeSnFolder === "function") closeSnFolder();
  if (viewId === "documents" && typeof closeFwTable === "function") closeFwTable();
  if (viewId !== "simulator" && typeof closeComponentDetail === "function") closeComponentDetail();
  if (viewId !== "simulator" && typeof closeSequenceDetail === "function") closeSequenceDetail();
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
  scheduleHistorySync();
}

document.getElementById("sidebarNav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-item");
  if (!btn) return;
  goToView(btn.dataset.view);
});

document.querySelectorAll("[data-goto]").forEach(el => {
  el.addEventListener("click", () => goToView(el.dataset.goto));
});

/* ---------------------------------------------------------------------
   DRAWER MOBILE
   ------------------------------------------------------------------- */
const appShell = document.getElementById("appShell");
const drawerBackdrop = document.getElementById("drawerBackdrop");

function openDrawer() {
  appShell.classList.add("drawer-open");
  drawerBackdrop.classList.add("open");
}
function closeDrawer() {
  appShell.classList.remove("drawer-open");
  drawerBackdrop.classList.remove("open");
}

document.getElementById("menuToggle").addEventListener("click", openDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);

/* ---------------------------------------------------------------------
   FW SWITCH
   ------------------------------------------------------------------- */
function renderFwSwitch() {
  const el = document.getElementById("fwSwitch");
  el.innerHTML = "";
  FW_VERSIONS.forEach(fw => {
    const btn = document.createElement("button");
    btn.className = "fw-pill" + (fw.id === state.fw ? " active" : "");
    btn.textContent = fw.label;
    btn.addEventListener("click", () => {
      state.fw = fw.id;
      renderFwSwitch();
      updateSimulatorAvailability();
      renderMaintenance();
      renderDocuments();
      renderDevice();
    });
    el.appendChild(btn);
  });
}

function matchesFw(entryFw) {
  return entryFw === null || entryFw === undefined || entryFw === state.fw;
}

/* ---------------------------------------------------------------------
   LIVELLI DI ACCESSO (mostrati in cima al Simulatore)
   ------------------------------------------------------------------- */
function renderAccessLevels() {
  const el = document.getElementById("accessLevels");
  if (!el || typeof ACCESS_LEVELS === "undefined" || ACCESS_LEVELS.length === 0) return;
  const dict = I18N[state.lang] || I18N.it;
  const rows = ACCESS_LEVELS.map(l => `
    <tr>
      <td class="al-level">${l.level}</td>
      <td class="al-pass">${l.password}</td>
      <td>${l.permessi}</td>
    </tr>
  `).join("");
  el.innerHTML = `
    <h4>${dict.access_title || "Livelli di accesso"}</h4>
    <table class="access-table"><tbody>${rows}</tbody></table>
  `;
}

/* ---------------------------------------------------------------------
   PROCEDURE GUIDATE (Manutenzione)
   ------------------------------------------------------------------- */
function renderProcedures() {
  const container = document.getElementById("proceduresContainer");
  if (!container) return;

  if (typeof PROCEDURES === "undefined" || PROCEDURES.length === 0) {
    container.innerHTML = "";
    return;
  }

  const dict = I18N[state.lang] || I18N.it;
  const CATEGORY_ORDER = [
    { key: "calibrazioni", label: dict.proc_cat_calibrazioni },
    { key: "regolazioni", label: dict.proc_cat_regolazioni },
    { key: "sostituzioni", label: dict.proc_cat_sostituzioni },
    { key: "diagnostica", label: dict.proc_cat_diagnostica }
  ];

  function tileHtml(proc) {
    return `
      <button class="procedure-tile" data-proc-id="${proc.id}">
        <span class="procedure-tile-text">
          <span class="procedure-title">${proc.title}</span>
        </span>
        <svg class="procedure-tile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    `;
  }

  let html = "";
  CATEGORY_ORDER.forEach(cat => {
    const items = PROCEDURES.filter(p => p.category === cat.key);
    if (items.length === 0) return;
    html += `<h4 class="category-heading">${cat.label}</h4>`;
    html += items.map(tileHtml).join("");
  });

  const uncategorized = PROCEDURES.filter(p => !CATEGORY_ORDER.some(c => c.key === p.category));
  if (uncategorized.length > 0) {
    html += uncategorized.map(tileHtml).join("");
  }

  container.innerHTML = html;
  container.querySelectorAll("[data-proc-id]").forEach(tile => {
    tile.addEventListener("click", () => openProcedureDetail(tile.dataset.procId));
  });
}

function openProcedureDetail(procId) {
  const proc = PROCEDURES.find(p => p.id === procId);
  if (!proc) return;

  document.getElementById("procedureDetailTitle").textContent = proc.title;
  document.getElementById("procedureDetailIntro").textContent = proc.intro;

  const stepsHtml = proc.steps.map((s, i) => `
    <div class="procedure-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-body">
        <h4>${s.title}</h4>
        <p>${s.detail}</p>
        ${s.img ? `<img class="procedure-step-img" src="${s.img}" alt="${s.title}">` : ""}
      </div>
    </div>
  `).join("");
  document.getElementById("procedureDetailSteps").innerHTML = stepsHtml;

  document.getElementById("maintenanceListView").style.display = "none";
  document.getElementById("procedureDetailView").style.display = "block";
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
  state.detail = { type: "procedure", id: procId };
  scheduleHistorySync();
}

function closeProcedureDetail() {
  document.getElementById("procedureDetailView").style.display = "none";
  document.getElementById("maintenanceListView").style.display = "block";
  if (state.detail && state.detail.type === "procedure") state.detail = null;
  scheduleHistorySync();
}

document.getElementById("procedureBackBtn").addEventListener("click", () => navBack(closeProcedureDetail));

/* ---------------------------------------------------------------------
   MANUTENZIONE — cronologia per SN
   Unisce due sorgenti:
   - MAINTENANCE_RECORDS in data.js (PDF pubblicati sul sito, statici)
   - i PDF salvati dal form su questo dispositivo (IndexedDB, js/storage.js)
   ------------------------------------------------------------------- */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1).replace(".", ",") + " MB";
}

function formatDateIt(value) {
  const d = new Date(value);
  if (isNaN(d)) return String(value || "");
  const hasTime = String(value).includes("T");
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    (hasTime ? " · " + d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "");
}

// Tiene i file locali già letti, per aprirli/scaricarli senza rileggere il DB.
const localMaintFiles = new Map();

const DOC_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/></svg>';
const TRASH_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-14"/></svg>';

const FOLDER_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>';
const CHEVRON_SVG = '<svg class="procedure-tile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';

let maintRenderSeq = 0;
let maintFolders = {}; // { SN: [voci ordinate dalla più recente] }

async function loadMaintenanceFolders() {
  let localFolders = {};
  if (typeof sparkGetAllFolders === "function") {
    try { localFolders = await sparkGetAllFolders(); }
    catch (err) { console.warn("Impossibile leggere l'archivio locale:", err); }
  }
  const folders = {};
  Object.keys(MAINTENANCE_RECORDS).forEach(sn => {
    folders[sn] = (folders[sn] || []).concat(MAINTENANCE_RECORDS[sn].map(rec => ({
      source: "static", title: rec.title, date: rec.date, url: rec.url
    })));
  });
  localMaintFiles.clear();
  Object.keys(localFolders).forEach(sn => {
    folders[sn] = (folders[sn] || []).concat(localFolders[sn].map(f => {
      localMaintFiles.set(f.id, f);
      return { source: "local", id: f.id, title: f.filename, date: f.addedAt, size: f.blob && f.blob.size };
    }));
  });
  Object.keys(folders).forEach(sn => folders[sn].sort((a, b) => (a.date < b.date ? 1 : -1)));
  return folders;
}

function maintRowHtml(item) {
  const dict = I18N[state.lang] || I18N.it;
  if (item.source === "static") {
    return `
      <a class="doc-row" href="${escapeHtml(item.url)}" target="_blank" rel="noopener" style="text-decoration:none;">
        <span class="doc-icon">${DOC_ICON_SVG}</span>
        <span class="doc-meta">
          <span class="doc-title">${escapeHtml(item.title)}</span><br>
          <span class="doc-type">${escapeHtml(formatDateIt(item.date))}</span>
        </span>
        <span class="doc-action">${escapeHtml(dict.maint_open || "Apri")}</span>
      </a>`;
  }
  const meta = [formatDateIt(item.date), formatFileSize(item.size), dict.maint_local_badge || "su questo dispositivo"]
    .filter(Boolean).join(" · ");
  return `
    <div class="doc-row">
      <span class="doc-icon">${DOC_ICON_SVG}</span>
      <span class="doc-meta">
        <span class="doc-title">${escapeHtml(item.title)}</span><br>
        <span class="doc-type">${escapeHtml(meta)}</span>
      </span>
      <span class="doc-row-actions">
        <button type="button" class="doc-action" data-maint-open="${item.id}">${escapeHtml(dict.maint_open || "Apri")}</button>
        <button type="button" class="doc-action doc-action-secondary" data-maint-download="${item.id}">${escapeHtml(dict.maint_download || "Scarica")}</button>
        <button type="button" class="doc-icon-btn" data-maint-delete="${item.id}" title="${escapeHtml(dict.maint_delete || "Elimina")}" aria-label="${escapeHtml(dict.maint_delete || "Elimina")}">${TRASH_ICON_SVG}</button>
      </span>
    </div>`;
}

/* Elenco cartelle S/N (una per seriale, dalla più recente) */
async function renderMaintenance() {
  const container = document.getElementById("checklistContainer");
  if (!container) return;
  const dict = I18N[state.lang] || I18N.it;
  const seq = ++maintRenderSeq;

  const folders = await loadMaintenanceFolders();
  if (seq !== maintRenderSeq) return; // è partito un render più recente
  maintFolders = folders;

  const sns = Object.keys(folders).sort((a, b) => (folders[a][0].date < folders[b][0].date ? 1 : -1));
  if (sns.length === 0) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(dict.maint_empty || dict.empty_state)}</div>`;
  } else {
    container.innerHTML = sns.map(sn => `
      <button class="procedure-tile sn-folder-tile" data-sn-folder="${escapeHtml(sn)}">
        <span class="sn-folder-icon">${FOLDER_ICON_SVG}</span>
        <span class="procedure-tile-text"><span class="procedure-title">${escapeHtml(sn)}</span></span>
        ${CHEVRON_SVG}
      </button>`).join("");
  }

  // Se una cartella è aperta, aggiorna anche il suo contenuto
  if (state.detail && state.detail.type === "sn") renderSnFolderFiles(state.detail.id);
}

function renderSnFolderFiles(sn) {
  const dict = I18N[state.lang] || I18N.it;
  const files = maintFolders[sn] || [];
  const box = document.getElementById("snFolderFiles");
  if (files.length === 0) {
    box.innerHTML = `<div class="empty-state">${escapeHtml(dict.maint_folder_empty || dict.empty_state)}</div>`;
    return;
  }
  const hasLocal = files.some(f => f.source === "local");
  box.innerHTML = files.map(maintRowHtml).join("") +
    (hasLocal ? `<p class="maint-storage-note">${escapeHtml(dict.maint_storage_note || "")}</p>` : "");
}

function openSnFolder(sn) {
  document.getElementById("snFolderTitle").textContent = "S/N " + sn;
  renderSnFolderFiles(sn);
  document.getElementById("maintenanceListView").style.display = "none";
  document.getElementById("procedureDetailView").style.display = "none";
  document.getElementById("snFolderView").style.display = "block";
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
  state.detail = { type: "sn", id: sn };
  scheduleHistorySync();
}

function closeSnFolder() {
  document.getElementById("snFolderView").style.display = "none";
  if (document.getElementById("procedureDetailView").style.display !== "block") {
    document.getElementById("maintenanceListView").style.display = "block";
  }
  if (state.detail && state.detail.type === "sn") state.detail = null;
  scheduleHistorySync();
}

document.getElementById("snFolderBackBtn").addEventListener("click", () => navBack(closeSnFolder));

document.getElementById("checklistContainer").addEventListener("click", (e) => {
  const tile = e.target.closest("[data-sn-folder]");
  if (tile) openSnFolder(tile.dataset.snFolder);
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

document.getElementById("snFolderFiles").addEventListener("click", async (e) => {
  const dict = I18N[state.lang] || I18N.it;
  const openBtn = e.target.closest("[data-maint-open]");
  const dlBtn = e.target.closest("[data-maint-download]");
  const delBtn = e.target.closest("[data-maint-delete]");

  if (openBtn) {
    const f = localMaintFiles.get(Number(openBtn.dataset.maintOpen));
    if (!f) return;
    const url = URL.createObjectURL(f.blob);
    const win = window.open(url, "_blank");
    if (!win) downloadBlob(f.blob, f.filename); // popup bloccato: scarica
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } else if (dlBtn) {
    const f = localMaintFiles.get(Number(dlBtn.dataset.maintDownload));
    if (f) downloadBlob(f.blob, f.filename);
  } else if (delBtn) {
    const id = Number(delBtn.dataset.maintDelete);
    const f = localMaintFiles.get(id);
    if (!f) return;
    const msg = (dict.maint_delete_confirm || "Eliminare {file}?").replace("{file}", f.filename);
    if (!confirm(msg)) return;
    try {
      await sparkDeleteFile(id);
    } catch (err) {
      alert("Errore durante l'eliminazione: " + (err && err.message ? err.message : err));
    }
    await renderMaintenance();
    // Cartella rimasta vuota: torna all'elenco S/N
    if (state.detail && state.detail.type === "sn" && !maintFolders[state.detail.id]) navBack(closeSnFolder);
  }
});

// Aggiorna la cronologia quando il form salva un PDF, o quando si torna all'app.
if ("BroadcastChannel" in window) {
  new BroadcastChannel("spark-maintenance").addEventListener("message", () => renderMaintenance());
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") renderMaintenance();
});
window.addEventListener("pageshow", (e) => { if (e.persisted) renderMaintenance(); });

/* ---------------------------------------------------------------------
   COLLAUDO
   La sezione "Collaudo" non è più una view autonoma (riorganizzazione
   navigazione). Funzione e dati (COLLAUDO in data.js) restano qui
   intatti e inutilizzati, pronti per essere richiamati da Documenti
   quando il collaudo diventerà un documento scaricabile.
   ------------------------------------------------------------------- */
function renderCollaudo() {
  const container = document.getElementById("collaudoContainer");
  const procedures = COLLAUDO.filter(c => matchesFw(c.fw));

  if (procedures.length === 0) {
    container.innerHTML = `<div class="empty-state">${(I18N[state.lang] || I18N.it).empty_state}</div>`;
    return;
  }

  container.innerHTML = "";
  procedures.forEach(proc => {
    const card = document.createElement("div");
    card.className = "collaudo-card";
    const steps = proc.steps.map((s, i) => `
      <div class="collaudo-step">
        <div class="step-num">${i + 1}</div>
        <div class="step-body">
          <h4>${s.title}</h4>
          <p>${s.detail}</p>
        </div>
      </div>
    `).join("");
    card.innerHTML = `<h3>${proc.title}</h3><div class="collaudo-steps">${steps}</div>`;
    container.appendChild(card);
  });
}

/* ---------------------------------------------------------------------
   DOCUMENTI
   ------------------------------------------------------------------- */
// Cartella "Versioni FW": sempre in cima, vale per tutti i firmware
function fwFolderTileHtml() {
  const dict = I18N[state.lang] || I18N.it;
  return `
    <button class="procedure-tile sn-folder-tile" id="fwFolderTile">
      <span class="sn-folder-icon">${FOLDER_ICON_SVG}</span>
      <span class="procedure-tile-text"><span class="procedure-title">${dict.fw_table_title}</span></span>
      ${CHEVRON_SVG}
    </button>`;
}

function renderDocuments() {
  const container = document.getElementById("documentsContainer");
  const docs = DOCUMENTS[state.fw] || [];

  if (docs.length === 0) {
    container.innerHTML = fwFolderTileHtml() + `<div class="empty-state">${(I18N[state.lang] || I18N.it).empty_state}</div>`;
    return;
  }

  const dict = I18N[state.lang] || I18N.it;
  const CATEGORY_ORDER = [
    { key: "manuali", label: dict.doc_cat_manuali },
    { key: "tecnica", label: dict.doc_cat_tecnica },
    { key: "firmware", label: dict.doc_cat_firmware },
    { key: "schemi", label: dict.doc_cat_schemi }
  ];

  function rowHtml(doc) {
    return `
      <a class="doc-row" href="${doc.url}" target="_blank" rel="noopener" style="text-decoration:none;">
        <span class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/></svg></span>
        <span class="doc-meta">
          <span class="doc-title">${doc.title}</span><br>
          <span class="doc-type">${doc.type}</span>
        </span>
        <span class="doc-action">Apri</span>
      </a>
    `;
  }

  let html = fwFolderTileHtml();
  CATEGORY_ORDER.forEach(cat => {
    const items = docs.filter(d => d.category === cat.key);
    if (items.length === 0) return;
    html += `<h4 class="category-heading">${cat.label}</h4>`;
    html += items.map(rowHtml).join("");
  });

  const uncategorized = docs.filter(d => !CATEGORY_ORDER.some(c => c.key === d.category));
  if (uncategorized.length > 0) {
    html += `<h4 class="category-heading">${dict.doc_cat_altro}</h4>`;
    html += uncategorized.map(rowHtml).join("");
  }

  container.innerHTML = html;
}

/* Tabella Versioni FW: una riga per workcode, colonna Workcode fissa
   (su telefono le altre colonne scorrono in orizzontale). */
function renderFwTable() {
  const dict = I18N[state.lang] || I18N.it;
  const cell = v => v
    ? `<td>${escapeHtml(v)}</td>`
    : `<td class="fw-not-tracked">${escapeHtml(dict.fw_table_not_tracked)}</td>`;
  const head = `<tr><th scope="col">${escapeHtml(dict.fw_table_workcode)}</th>` +
    FW_COMPONENT_COLUMNS.map(c => `<th scope="col">${escapeHtml(c.label)}</th>`).join("") + `</tr>`;
  const body = FW_COMPONENT_VERSIONS.map(r =>
    `<tr><th scope="row">${escapeHtml(r.workcode)}</th>` + FW_COMPONENT_COLUMNS.map(c => cell(r[c.key])).join("") + `</tr>`
  ).join("");
  document.getElementById("fwTableContainer").innerHTML =
    `<div class="fw-table-wrap"><table class="fw-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

function openFwTable() {
  renderFwTable();
  document.getElementById("documentsListView").style.display = "none";
  document.getElementById("fwTableView").style.display = "block";
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
  state.detail = { type: "fwtable", id: "fw" };
  scheduleHistorySync();
}

function closeFwTable() {
  document.getElementById("fwTableView").style.display = "none";
  document.getElementById("documentsListView").style.display = "block";
  if (state.detail && state.detail.type === "fwtable") state.detail = null;
  scheduleHistorySync();
}

document.getElementById("documentsContainer").addEventListener("click", (e) => {
  if (e.target.closest("#fwFolderTile")) openFwTable();
});
document.getElementById("fwTableBackBtn").addEventListener("click", () => navBack(closeFwTable));

/* ---------------------------------------------------------------------
   SIMULATORE
   ------------------------------------------------------------------- */

Object.assign(state, { simScreen: "boot", simCategory: null, simMotorSide: "motori-sx", simInfoId: null });

const SIM_ICONS = {
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-2 5-5 2 2-5 5-2Z"/></svg>',
  motor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  rostro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h13"/><path d="m12 6 6 6-6 6"/><circle cx="19" cy="12" r="2"/></svg>',
  hmi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
  workpanel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  params: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>',
  faults: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg>',
  power: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="M6.3 6.3a9 9 0 1 0 11.4 0"/></svg>'
};

function simIconMarkup(iconKey) {
  const imgSrc = (typeof SIMULATOR_ICON_IMAGES !== "undefined") ? SIMULATOR_ICON_IMAGES[iconKey] : null;
  if (imgSrc) return `<img src="${imgSrc}" alt="" class="sim-icon-img">`;
  return SIM_ICONS[iconKey] || "";
}

function simIconButton(item) {
  const imgSrc = (typeof SIMULATOR_ICON_IMAGES !== "undefined") ? SIMULATOR_ICON_IMAGES[item.icon] : null;
  const cls = "sim-icon-btn" + (imgSrc ? " has-img" : "");
  return `<button class="${cls}" data-sim-action="${item.id}" title="${item.label}">${simIconMarkup(item.icon)}</button>`;
}

/* ---------------------------------------------------------------------
   DISPONIBILITÀ SIMULATORE — solo FW 8.2.x.x
   ------------------------------------------------------------------- */
const SIMULATOR_FW = "8.2";

function isSimulatorAvailable() {
  return state.fw === SIMULATOR_FW;
}

function updateSimulatorAvailability() {
  const available = isSimulatorAvailable();
  const lockMsg = document.getElementById("simFwLock");
  const deviceWrap = document.getElementById("simDeviceWrap");

  if (lockMsg) lockMsg.style.display = available ? "none" : "block";
  if (deviceWrap) deviceWrap.style.display = available ? "flex" : "none";
  // Nota: la Mappa Componenti (fisica) non dipende dalla versione FW,
  // quindi la sezione Simulatore resta sempre accessibile: qui blocchiamo
  // solo il contenuto della modalità "Pannello Spark".
}

/* ---------------------------------------------------------------------
   MAPPA COMPONENTI
   ------------------------------------------------------------------- */
Object.assign(state, { simMode: "panel", mapViewIndex: 0 });

function switchSimMode(mode) {
  state.simMode = mode;
  scheduleHistorySync();
  // La Mappa è una sotto-sezione di Componenti
  const pillMode = mode === "map" ? "components" : mode;
  document.querySelectorAll(".sim-mode-pill").forEach(p => p.classList.toggle("active", p.dataset.simMode === pillMode));
  document.querySelectorAll(".comp-sub-pill").forEach(p => p.classList.toggle("active", p.dataset.subMode === mode));
  document.getElementById("simPanelMode").style.display = mode === "panel" ? "block" : "none";
  document.getElementById("simMapMode").style.display = mode === "map" ? "block" : "none";
  document.getElementById("simParamsMode").style.display = mode === "params" ? "block" : "none";
  document.getElementById("simErrorsMode").style.display = mode === "errors" ? "block" : "none";
  document.getElementById("simComponentsMode").style.display = mode === "components" ? "block" : "none";
  document.getElementById("simSequenceMode").style.display = mode === "sequence" ? "block" : "none";
  if (mode !== "components" && typeof closeComponentDetail === "function") closeComponentDetail();
  if (mode !== "sequence" && typeof closeSequenceDetail === "function") closeSequenceDetail();
  if (mode === "map") renderMapView();
  if (mode === "params") renderParameters();
  if (mode === "errors") renderErrors();
  if (mode === "components") renderComponents();
  if (mode === "sequence") renderSequence();
  updateCompSubSwitch();
}

// Mostra "Elenco / Mappa" solo in Componenti, e non dentro la scheda di un componente
function updateCompSubSwitch() {
  const el = document.getElementById("compSubSwitch");
  if (!el) return;
  const inComponents = state.simMode === "components" || state.simMode === "map";
  const inDetail = state.detail && state.detail.type === "component";
  el.style.display = inComponents && !inDetail ? "inline-flex" : "none";
}

document.getElementById("compSubSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest(".comp-sub-pill");
  if (!btn || btn.dataset.subMode === state.simMode) return;
  switchSimMode(btn.dataset.subMode);
});

document.getElementById("simModeSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest(".sim-mode-pill");
  if (!btn) return;
  switchSimMode(btn.dataset.simMode);
});

function renderParamDesc(desc) {
  return desc.map(block => {
    if (block.t === "p") return `<p class="param-p">${block.h}</p>`;
    if (block.t === "ul") return `<ul class="param-ul">${block.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    if (block.t === "img") return `<figure class="param-figure"><img src="${block.src}" alt="${block.caption}"><figcaption>${block.caption}</figcaption></figure>`;
    if (block.t === "formula") return `<div class="param-formula">${block.lines.map(l => `<div>${l}</div>`).join("")}</div>`;
    return "";
  }).join("");
}

function renderParameters(filterText) {
  const list = document.getElementById("paramList");
  const query = (filterText || "").trim().toLowerCase();
  const items = PARAMETERS.filter(pr => query === "" || pr.name.toLowerCase().includes(query));

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state">${(I18N[state.lang] || I18N.it).empty_state}</div>`;
    return;
  }

  list.innerHTML = "";
  const block = document.createElement("div");
  block.className = "code-list";
  list.appendChild(block);
  items.forEach((pr, i) => {
    const row = document.createElement("div");
    row.className = "param-row";
    row.innerHTML = `
      <button class="param-question">
        <span class="param-q-left">
          <span class="param-name">${pr.name}</span>
          <span class="param-badges">
            <span class="param-badge">Default ${pr.default}</span>
            <span class="param-badge ghost">Min ${pr.min}</span>
            <span class="param-badge ghost">Max ${pr.max}</span>
            <span class="param-badge ghost">${pr.unit}</span>
          </span>
        </span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="param-answer">${renderParamDesc(pr.desc)}</div>
    `;
    block.appendChild(row);
  });
  bindAccordion(list, ".param-row", ".param-question");
}


/* ---------------------------------------------------------------------
   ERRORI
   ------------------------------------------------------------------- */
const CAT_COLOR = { L: "cat-l", W: "cat-w", E: "cat-e" };

/* Ordine di visualizzazione delle sezioni (solo presentazione).
   Le categorie sono quelle già presenti in ERRORS (cat/catLabel), non rinominate.
   Eventuali categorie future non elencate qui vengono accodate in fondo. */
const ERROR_SECTION_ORDER = ["E", "L", "W"];

function renderErrors(filterText) {
  const list = document.getElementById("errorList");
  const dict = I18N[state.lang] || I18N.it;
  const query = (filterText || "").trim().toLowerCase();
  const items = ERRORS.filter(er =>
    query === "" ||
    er.code.toLowerCase().includes(query) ||
    er.text.toLowerCase().includes(query)
  );

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state">${dict.empty_state}</div>`;
    return;
  }

  const extraCats = [...new Set(items.map(er => er.cat))].filter(c => !ERROR_SECTION_ORDER.includes(c));
  const sections = [...ERROR_SECTION_ORDER, ...extraCats];

  list.innerHTML = "";
  sections.forEach(cat => {
    const group = items.filter(er => er.cat === cat);
    if (group.length === 0) return;

    const title = document.createElement("h4");
    title.className = "error-section-title";
    title.textContent = group[0].catLabel;
    list.appendChild(title);

    const block = document.createElement("div");
    block.className = "code-list";
    list.appendChild(block);

    group.forEach(er => {
      const row = document.createElement("div");
      row.className = "param-row";
      row.dataset.errorCode = er.code;
      row.innerHTML = `
        <button class="param-question">
          <span class="param-q-left">
            <span class="error-headline"><span class="param-name error-code">${er.code}</span><span class="error-sep"> – </span><span class="error-desc">${er.text}</span></span>
          </span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="param-answer"></div>
      `;
      row.querySelector(".param-answer").appendChild(buildRelationBlock(
        dict.relation_components_title,
        getErrorComponents(er.code).map(id => ({
          label: `${id} — ${UTENZE[id] || id}`,
          onClick: () => goToComponent(id)
        })),
        dict.relation_no_components,
        "list"
      ));
      block.appendChild(row);
    });
  });
  /* bindAccordion agisce su tutte le righe della lista (anche tra sezioni
     diverse): aprendo un errore si chiude quello aperto prima. */
  bindAccordion(list, ".param-row", ".param-question");
}


/* ---------------------------------------------------------------------
   RELAZIONI COMPONENTI ↔ PARAMETRI ↔ ERRORI
   Le uniche fonti sono PARAM_COMPONENTS e ERROR_COMPONENTS (data.js).
   Tutto il resto è calcolato qui a runtime, senza copiare dati.
   ------------------------------------------------------------------- */
function getErrorComponents(code) {
  return ERROR_COMPONENTS[code] || [];
}

function getComponentErrors(id) {
  return ERRORS.filter(er => (ERROR_COMPONENTS[er.code] || []).includes(id)).map(er => er.code);
}

function getComponentParams(id) {
  return PARAMETERS.filter(pr => (PARAM_COMPONENTS[pr.name] || []).includes(id)).map(pr => pr.name);
}

/* Blocco "titolo + elenco cliccabile" riusato in dettaglio errore e dettaglio
   componente. items: [{label, onClick}]. mode: "chips" (compatto) | "list" (una per riga). */
/* Componente -> passaggi della sequenza: letto a runtime da OPERATION_SEQUENCE
   (solo l'array "componenti" di ogni passaggio, nessuna tabella duplicata). */
function getComponentSequenceSteps(id) {
  if (typeof OPERATION_SEQUENCE === "undefined") return [];
  return OPERATION_SEQUENCE.filter(step => (step.componenti || []).includes(id));
}

function buildRelationBlock(title, items, emptyText, mode) {
  const block = document.createElement("div");
  block.className = "relation-block";

  const label = document.createElement("span");
  label.className = "relation-label";
  label.textContent = title;
  block.appendChild(label);

  if (items.length === 0) {
    const none = document.createElement("span");
    none.className = "relation-none";
    none.textContent = emptyText;
    block.appendChild(none);
    return block;
  }

  const wrap = document.createElement("div");
  wrap.className = mode === "list" ? "relation-list" : "relation-chips";
  items.forEach(it => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = mode === "list" ? "relation-link" : "relation-chip";
    btn.textContent = it.label;
    btn.addEventListener("click", (e) => { e.stopPropagation(); it.onClick(); });
    wrap.appendChild(btn);
  });
  block.appendChild(wrap);
  return block;
}

/* Apre un errore nella schermata Errori (un solo dettaglio aperto). */
function goToError(code) {
  const search = document.getElementById("errorSearch");
  if (search) search.value = "";
  switchSimMode("errors");
  const row = document.querySelector(`#errorList [data-error-code="${code}"]`);
  if (row) {
    row.classList.add("open");
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* Apre un parametro nella schermata Parametri. */
function goToParameter(name) {
  const search = document.getElementById("paramSearch");
  if (search) search.value = "";
  switchSimMode("params");
  const row = Array.from(document.querySelectorAll("#paramList .param-row"))
    .find(r => r.querySelector(".param-name").textContent === name);
  if (row) {
    row.classList.add("open");
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* Apre la scheda di un componente in Tecnico → Componenti. */
function goToComponent(id) {
  switchSimMode("components");
  openComponentDetail(id);
}

/* ---------------------------------------------------------------------
   TECNICO → LOGICA DI FUNZIONAMENTO
   Legge OPERATION_SEQUENCE (e OPERATION_SEQUENCE_NOTES per la premessa
   di carico). Componenti/parametri citati sono risolti a runtime tramite
   goToComponent/goToParameter già usate da Componenti ed Errori.
   ------------------------------------------------------------------- */
state.sequenceType = "carico";

function renderSequence() {
  const container = document.getElementById("sequenceContainer");
  if (!container || typeof OPERATION_SEQUENCE === "undefined") return;
  const dict = I18N[state.lang] || I18N.it;
  const steps = OPERATION_SEQUENCE.filter(s => s.tipo === state.sequenceType);

  container.innerHTML = "";
  steps.forEach(step => {
    const tile = document.createElement("button");
    tile.className = "procedure-tile";
    tile.dataset.stepId = step.id;
    tile.innerHTML = `
      <span class="procedure-tile-text">
        <span class="procedure-title">${dict.sequence_step_label} ${step.numero}</span>
        <span class="procedure-intro">${step.descrizione}</span>
      </span>
      <svg class="procedure-tile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    `;
    tile.addEventListener("click", () => openSequenceDetail(step.id));
    container.appendChild(tile);
  });
}

// Allinea il selettore Carico/Scarico al passaggio aperto, così "Torna alla
// sequenza" mostra la lista giusta
function syncSequenceType(tipo) {
  if (!tipo || state.sequenceType === tipo) return;
  state.sequenceType = tipo;
  document.querySelectorAll("#sequenceTypeRow .filter-chip").forEach(c => c.classList.toggle("active", c.dataset.seq === tipo));
  renderSequence();
}

function goToSequenceStep(stepId) {
  const step = OPERATION_SEQUENCE.find(s => s.id === stepId);
  if (!step) return;
  switchSimMode("sequence");
  syncSequenceType(step.tipo);
  openSequenceDetail(stepId);
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}

function openSequenceDetail(stepId) {
  const step = OPERATION_SEQUENCE.find(s => s.id === stepId);
  if (!step) return;
  const dict = I18N[state.lang] || I18N.it;

  document.getElementById("sequenceDetailTitle").textContent = `${dict.sequence_step_label} ${step.numero}`;
  document.getElementById("sequenceDetailSub").textContent = step.tipo === "carico" ? dict.sequence_carico : dict.sequence_scarico;

  const fields = document.getElementById("sequenceDetailFields");
  let html = `<div class="component-field"><span class="component-field-value">${step.descrizione}</span></div>`;

  const note = (step.numero === 0 && step.tipo === "carico") ? OPERATION_SEQUENCE_NOTES.carico : null;
  if (note) {
    html += `<div class="component-field"><span class="component-field-label">${dict.sequence_field_condizione}</span><span class="component-field-value">${note.testo}</span></div>`;
  }
  fields.innerHTML = html;

  const componentIds = [...step.componenti, ...(note ? note.componenti : [])].filter((v, i, a) => a.indexOf(v) === i);
  fields.appendChild(buildRelationBlock(
    dict.sequence_field_componenti,
    componentIds.map(id => ({ label: `${id} — ${UTENZE[id] || id}`, onClick: () => goToComponent(id) })),
    dict.sequence_no_componenti,
    "chips"
  ));
  fields.appendChild(buildRelationBlock(
    dict.sequence_field_parametri,
    step.parametri.map(name => ({ label: name, onClick: () => goToParameter(name) })),
    dict.sequence_no_parametri,
    "chips"
  ));

  document.getElementById("sequenceListView").style.display = "none";
  document.getElementById("sequenceDetailView").style.display = "block";
  state.detail = { type: "sequence", id: stepId };
  scheduleHistorySync();
}

function closeSequenceDetail() {
  document.getElementById("sequenceDetailView").style.display = "none";
  document.getElementById("sequenceListView").style.display = "block";
  if (state.detail && state.detail.type === "sequence") state.detail = null;
  scheduleHistorySync();
}

document.getElementById("sequenceBackBtn").addEventListener("click", () => navBack(closeSequenceDetail));

document.getElementById("sequenceTypeRow").addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  state.sequenceType = chip.dataset.seq;
  document.querySelectorAll("#sequenceTypeRow .filter-chip").forEach(c => c.classList.toggle("active", c === chip));
  closeSequenceDetail();
  renderSequence();
});

/* ---------------------------------------------------------------------
   TECNICO → COMPONENTI
   Legge da COMPONENTS (id+categoria) unendo UTENZE (nome) e
   SENSOR_DETAILS (cavo/tipo/intro/bullets/dove). Nessun dato duplicato.
   ------------------------------------------------------------------- */
const CAT_LABEL_KEY = {
  magnetici: "cat_magnetici", finecorsa: "cat_finecorsa", laser: "cat_laser",
  potenziometri: "cat_potenziometri", angolari: "cat_angolari", pressione: "cat_pressione",
  comandi: "cat_comandi", motori: "cat_motori", attuatori: "cat_attuatori",
  elettrovalvole: "cat_elettrovalvole", freni: "cat_freni", illuminazione: "cat_illuminazione",
  alimentazione: "cat_alimentazione", segnalazione: "cat_segnalazione",
  comunicazione: "cat_comunicazione", altrisensori: "cat_altrisensori",
  schede: "cat_schede"
};

state.componentCategory = "all";

function renderComponents(filterText) {
  const container = document.getElementById("componentsContainer");
  if (!container || typeof COMPONENTS === "undefined") return;
  const dict = I18N[state.lang] || I18N.it;
  const query = (filterText || "").trim().toLowerCase();

  const items = COMPONENTS.filter(c => {
    if (state.componentCategory !== "all" && c.categoria !== state.componentCategory) return false;
    if (query === "") return true;
    const nome = (UTENZE[c.id] || "").toLowerCase();
    const det = SENSOR_DETAILS[c.id] || {};
    const catLabel = (dict[CAT_LABEL_KEY[c.categoria]] || c.categoria).toLowerCase();
    const haystack = [c.id, nome, det.tipo || "", det.cavo || "", catLabel].join(" ").toLowerCase();
    return haystack.includes(query);
  });

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state">${dict.empty_state}</div>`;
    return;
  }

  container.innerHTML = "";
  items.forEach(c => {
    const nome = UTENZE[c.id] || c.id;
    const catLabel = dict[CAT_LABEL_KEY[c.categoria]] || c.categoria;
    const tile = document.createElement("button");
    tile.className = "procedure-tile";
    tile.innerHTML = `
      <span class="procedure-tile-text">
        <span class="procedure-title">${nome} <span class="component-id-tag">${c.id}</span></span>
        <span class="procedure-intro">${catLabel}</span>
      </span>
      <svg class="procedure-tile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    `;
    tile.addEventListener("click", () => openComponentDetail(c.id));
    container.appendChild(tile);
  });
}

/* Trova la prima occorrenza di un componente tra gli hotspot della mappa.
   Associazione SOLO per ID identico (nessuna interpretazione/somiglianza). */
function findComponentHotspot(id) {
  for (let vi = 0; vi < MAP_VIEWS.length; vi++) {
    const hi = MAP_VIEWS[vi].hotspots.findIndex(h => h.id === id);
    if (hi !== -1) return { viewIndex: vi, hotspotIndex: hi };
  }
  return null;
}

function goToComponentOnMap(id) {
  const loc = findComponentHotspot(id);
  if (!loc) return;
  switchSimMode("map");
  state.mapViewIndex = loc.viewIndex;
  renderMapView();
  const hotspotBtn = document.getElementById("mapHotspots").children[loc.hotspotIndex];
  if (hotspotBtn) {
    hotspotBtn.click();
    hotspotBtn.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function openComponentDetail(id) {
  const comp = COMPONENTS.find(c => c.id === id);
  if (!comp) return;
  const dict = I18N[state.lang] || I18N.it;
  const nome = UTENZE[id] || id;
  const det = SENSOR_DETAILS[id] || {};
  const catLabel = dict[CAT_LABEL_KEY[comp.categoria]] || comp.categoria;

  document.getElementById("componentDetailTitle").textContent = `${id} — ${nome}`;
  // Sotto il nome: il tipo specifico del componente (es. "Laser distanza"),
  // oppure la categoria se il tipo non è indicato
  // Se il tipo è generico ("Analogico") lo si affianca al tipo di sensore
  const TIPO_PREFIX = { angolari: "Sensore angolare", pressione: "Sensore di pressione" };
  let sub = det.tipo ? det.tipo.replace(/\s+/g, " ").trim() : catLabel;
  if (det.tipo && sub.toLowerCase() === "analogico" && TIPO_PREFIX[comp.categoria]) sub = TIPO_PREFIX[comp.categoria] + " · " + sub;
  document.getElementById("componentDetailSub").textContent = sub;

  const fields = document.getElementById("componentDetailFields");
  let html = "";
  // Ordine: Codice cavo, Collegamento, Funzione, Logica, Errori, Parametri
  // ("Tipo" non viene mostrato: la categoria è già sotto il titolo)
  if (det.cavo) html += `<div class="component-field"><span class="component-field-label">${dict.component_field_codice}</span><span class="component-field-value">${det.cavo}</span></div>`;
  if (det.dove) html += `<div class="component-field"><span class="component-field-label">${dict.component_field_collegamento}</span><span class="component-field-value">${det.dove}</span></div>`;
  if (det.intro) html += `<div class="component-field"><span class="component-field-label">${dict.component_field_funzione}</span><span class="component-field-value">${det.intro}</span></div>`;
  if (det.bullets && det.bullets.length) {
    html += `<div class="component-field"><span class="component-field-label">${dict.component_field_logica}</span><ul class="component-field-list">`;
    det.bullets.forEach(b => { html += `<li>${b}</li>`; });
    html += `</ul></div>`;
  }
  if (html === "") html = `<div class="empty-state">${dict.component_no_details}</div>`;
  fields.innerHTML = html;

  fields.appendChild(buildSequenceUsageBlock(id));

  fields.appendChild(buildRelationBlock(
    dict.relation_errors_title,
    getComponentErrors(id).map(code => ({ label: code, onClick: () => goToError(code) })),
    dict.relation_no_errors,
    "chips"
  ));
  fields.appendChild(buildRelationBlock(
    dict.relation_params_title,
    getComponentParams(id).map(name => ({ label: name, onClick: () => goToParameter(name) })),
    dict.relation_no_params,
    "chips"
  ));

  const mapLinkWrap = document.getElementById("componentMapLinkWrap");
  if (findComponentHotspot(id)) {
    mapLinkWrap.style.display = "block";
    mapLinkWrap.querySelector("#componentMapLinkBtn").onclick = () => goToComponentOnMap(id);
  } else {
    mapLinkWrap.style.display = "none";
  }

  document.getElementById("componentsListView").style.display = "none";
  document.getElementById("componentDetailView").style.display = "block";
  state.detail = { type: "component", id: id };
  updateCompSubSwitch();
  scheduleHistorySync();
}

/* "Utilizzo nella logica": passaggi di Carico/Scarico in cui compare il
   componente, raggruppati per tipo. Il clic apre il passaggio nella
   Logica di funzionamento (stessa UI di sempre). */
function buildSequenceUsageBlock(id) {
  const dict = I18N[state.lang] || I18N.it;
  const steps = getComponentSequenceSteps(id);
  const block = document.createElement("div");
  block.className = "relation-block";

  const label = document.createElement("span");
  label.className = "relation-label";
  label.textContent = dict.relation_sequence_title;
  block.appendChild(label);

  if (steps.length === 0) {
    const none = document.createElement("span");
    none.className = "relation-none";
    none.textContent = dict.relation_no_sequence;
    block.appendChild(none);
    return block;
  }

  [["carico", dict.sequence_carico], ["scarico", dict.sequence_scarico]].forEach(([tipo, tipoLabel]) => {
    const group = steps.filter(st => st.tipo === tipo);
    if (group.length === 0) return;
    const head = document.createElement("span");
    head.className = "relation-group-title";
    head.textContent = tipoLabel;
    block.appendChild(head);

    const list = document.createElement("div");
    list.className = "relation-list";
    group.forEach(st => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "relation-link relation-step";
      btn.innerHTML = `<span class="relation-step-num">${dict.sequence_step_label} ${st.numero}</span><span class="relation-step-desc">${st.descrizione}</span>`;
      btn.addEventListener("click", (e) => { e.stopPropagation(); goToSequenceStep(st.id); });
      list.appendChild(btn);
    });
    block.appendChild(list);
  });
  return block;
}

function closeComponentDetail() {
  document.getElementById("componentDetailView").style.display = "none";
  document.getElementById("componentsListView").style.display = "block";
  if (state.detail && state.detail.type === "component") state.detail = null;
  updateCompSubSwitch();
  scheduleHistorySync();
}

document.getElementById("componentBackBtn").addEventListener("click", () => navBack(closeComponentDetail));


document.getElementById("componentFilterRow").addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  state.componentCategory = chip.dataset.cat;
  document.querySelectorAll("#componentFilterRow .filter-chip").forEach(c => c.classList.toggle("active", c === chip));
  renderComponents();
});

/* ---------------------------------------------------------------------
   RICERCA GLOBALE (errori + parametri)
   ------------------------------------------------------------------- */
(function setupGlobalSearch() {
  const input = document.getElementById("globalSearch");
  const results = document.getElementById("globalSearchResults");

  function closeResults() {
    results.style.display = "none";
    results.innerHTML = "";
  }

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    if (query === "") { closeResults(); return; }

    const dict = I18N[state.lang] || I18N.it;
    const errorMatches = ERRORS.filter(er =>
      er.code.toLowerCase().includes(query) || er.text.toLowerCase().includes(query)
    ).slice(0, 8);
    const paramMatches = PARAMETERS.filter(pr =>
      pr.name.toLowerCase().includes(query)
    ).slice(0, 8);
    // Componenti (sostituisce la ricerca che c'era dentro Componenti):
    // stessi campi di prima — ID, nome, codice cavo, tipo, categoria
    const componentMatches = (typeof COMPONENTS === "undefined" ? [] : COMPONENTS).filter(c => {
      const det = SENSOR_DETAILS[c.id] || {};
      const catLabel = dict[CAT_LABEL_KEY[c.categoria]] || c.categoria;
      return [c.id, UTENZE[c.id] || "", det.tipo || "", det.cavo || "", catLabel].join(" ").toLowerCase().includes(query);
    }).slice(0, 8);

    if (errorMatches.length === 0 && paramMatches.length === 0 && componentMatches.length === 0) {
      results.innerHTML = `<div class="gsr-empty">${dict.global_search_no_results || "Nessun risultato"}</div>`;
      results.style.display = "block";
      return;
    }

    let html = "";
    errorMatches.forEach(er => {
      html += `
        <button class="gsr-item" data-gsr-type="error" data-gsr-key="${er.code}">
          <span class="gsr-tag error">${dict.global_search_error_tag || "Errore"}</span>
          <span class="gsr-title">${er.code}</span>
          <span class="gsr-snippet">${er.text}</span>
        </button>`;
    });
    paramMatches.forEach(pr => {
      html += `
        <button class="gsr-item" data-gsr-type="param" data-gsr-key="${pr.name}">
          <span class="gsr-tag param">${dict.global_search_param_tag || "Parametro"}</span>
          <span class="gsr-title">${pr.name}</span>
          <span class="gsr-snippet">Default ${pr.default} ${pr.unit}</span>
        </button>`;
    });
    componentMatches.forEach(c => {
      html += `
        <button class="gsr-item" data-gsr-type="component" data-gsr-key="${c.id}">
          <span class="gsr-tag component">${dict.global_search_component_tag || "Componente"}</span>
          <span class="gsr-title">${c.id}</span>
          <span class="gsr-snippet">${UTENZE[c.id] || ""}</span>
        </button>`;
    });
    results.innerHTML = html;
    results.style.display = "block";

    results.querySelectorAll(".gsr-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.gsrType;
        const key = btn.dataset.gsrKey;
        closeResults();
        input.value = "";
        if (type === "param") goToParameter(key);
        else if (type === "error") goToError(key);
        else if (type === "component") goToComponent(key);
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#globalSearchBox")) closeResults();
  });
})();

function renderMapViewSwitch() {
  const el = document.getElementById("mapViewSwitch");
  el.innerHTML = "";
  MAP_VIEWS.forEach((v, i) => {
    const btn = document.createElement("button");
    btn.className = "map-view-pill" + (i === state.mapViewIndex ? " active" : "");
    btn.textContent = v.label;
    btn.addEventListener("click", () => {
      state.mapViewIndex = i;
      renderMapView();
    });
    el.appendChild(btn);
  });
}

const mapTransform = { scale: 1, tx: 0, ty: 0 };

function applyMapTransform() {
  const canvas = document.getElementById("mapCanvas");
  canvas.style.transform = `translate(${mapTransform.tx}px, ${mapTransform.ty}px) scale(${mapTransform.scale})`;
}

function resetMapTransform() {
  mapTransform.scale = 1;
  mapTransform.tx = 0;
  mapTransform.ty = 0;
  applyMapTransform();
}

function renderMapView() {
  renderMapViewSwitch();
  const view = MAP_VIEWS[state.mapViewIndex];
  const img = document.getElementById("mapImage");
  img.src = view.image;
  img.alt = view.label;
  resetMapTransform();
  document.getElementById("mapAnswer").style.display = "none";

  const hotspotsEl = document.getElementById("mapHotspots");
  hotspotsEl.innerHTML = "";
  view.hotspots.forEach((h, i) => {
    const btn = document.createElement("button");
    btn.className = "map-hotspot";
    btn.style.left = h.x + "%";
    btn.style.top = h.y + "%";
    btn.innerHTML = `<span class="map-hotspot-code">${h.id}</span>`;
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      document.querySelectorAll(".map-hotspot").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const answer = document.getElementById("mapAnswer");
      const meaning = UTENZE[h.id] || "";
      const details = (typeof SENSOR_DETAILS !== "undefined") ? SENSOR_DETAILS[h.id] : null;

      let extraHtml = "";
      if (details) {
        const bulletsHtml = (details.bullets && details.bullets.length)
          ? `<ul class="map-answer-bullets">${details.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`
          : "";
        extraHtml = `
          <div class="map-answer-extra">
            <div class="map-answer-tags">
              ${details.tipo ? `<span class="map-answer-tag">${details.tipo}</span>` : ""}
              ${details.cavo ? `<span class="map-answer-tag ghost">${details.cavo}</span>` : ""}
            </div>
            ${details.intro ? `<p class="map-answer-intro">${details.intro}</p>` : ""}
            ${bulletsHtml}
            ${details.dove ? `<p class="map-answer-dove"><strong>Dov'è collegato:</strong> ${details.dove}</p>` : ""}
          </div>
        `;
      }

      const isComponent = (typeof COMPONENTS !== "undefined") && COMPONENTS.some(c => c.id === h.id);
      const openCompBtnHtml = isComponent
        ? `<button type="button" class="map-link-btn" id="openComponentBtn" style="margin-top:10px;">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>
             <span data-i18n="open_component">Apri componente</span>
           </button>`
        : "";

      answer.innerHTML = `
        <div class="map-answer-head">
          <span class="map-answer-code">${h.id}</span>
          <span class="map-answer-text">${meaning || "Descrizione non ancora disponibile."}</span>
        </div>
        ${extraHtml}
        ${openCompBtnHtml}
      `;
      answer.style.display = "block";
      if (isComponent) {
        document.getElementById("openComponentBtn").addEventListener("click", () => {
          switchSimMode("components");
          openComponentDetail(h.id);
        });
      }
    });
    hotspotsEl.appendChild(btn);
  });
}

/* -- Pan (drag) e zoom (rotellina / pinch) -- */
(function setupMapPanZoom() {
  const viewport = document.getElementById("mapViewport");
  const pointers = new Map();
  let dragging = false;
  let startX = 0, startY = 0, startTx = 0, startTy = 0;
  let pinchStartDist = 0, pinchStartScale = 1;

  function clampScale(s) { return Math.min(4, Math.max(1, s)); }

  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".map-hotspot")) return;
    viewport.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startTx = mapTransform.tx; startTy = mapTransform.ty;
    } else if (pointers.size === 2) {
      dragging = false;
      const pts = Array.from(pointers.values());
      pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartScale = mapTransform.scale;
    }
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchStartDist > 0) {
        mapTransform.scale = clampScale(pinchStartScale * (dist / pinchStartDist));
        applyMapTransform();
      }
    } else if (dragging && pointers.size === 1) {
      mapTransform.tx = startTx + (e.clientX - startX);
      mapTransform.ty = startTy + (e.clientY - startY);
      applyMapTransform();
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStartDist = 0;
    if (pointers.size === 0) dragging = false;
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("pointerleave", endPointer);

  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    mapTransform.scale = clampScale(mapTransform.scale + delta);
    applyMapTransform();
  }, { passive: false });

  viewport.addEventListener("dblclick", () => resetMapTransform());

  document.getElementById("mapZoomIn").addEventListener("click", () => {
    mapTransform.scale = clampScale(mapTransform.scale + 0.4);
    applyMapTransform();
  });
  document.getElementById("mapZoomOut").addEventListener("click", () => {
    mapTransform.scale = clampScale(mapTransform.scale - 0.4);
    applyMapTransform();
  });
  document.getElementById("mapZoomReset").addEventListener("click", resetMapTransform);
})();

function renderDevice() {
  const screen = document.getElementById("deviceScreen");
  const dict = I18N[state.lang] || I18N.it;

  if (state.simScreen === "boot") {
    const now = new Date();
    const time = now.toLocaleTimeString("it-IT");
    const date = now.toLocaleDateString("it-IT");
    const versions = SIMULATOR_BOOT_INFO.map(v => `<div><span class="v-label">${v.label}</span>${v.value}</div>`).join("");
    screen.innerHTML = `
      <div class="sim-boot" id="simBootTap">
        <div>
          <div class="sim-clock">${time}</div>
          <div class="sim-date">${date}</div>
        </div>
        <div class="sim-versions">${versions}</div>
        <div class="sim-tap-hint">${dict.sim_tap_to_start || "Tocca lo schermo per iniziare"}</div>
      </div>
    `;
    document.getElementById("simBootTap").addEventListener("click", () => {
      state.simScreen = "menu";
      renderDevice();
    });
    return;
  }

  if (state.simScreen === "menu") {
    const row1 = SIMULATOR_MENU.slice(0, 4).map(simIconButton).join("");
    const row2 = SIMULATOR_MENU.slice(4).map(simIconButton).join("");
    screen.innerHTML = `
      <div class="sim-info" style="flex-direction:column;gap:6px;">
        <p style="color:#7fd6ff;font-family:'Poppins',sans-serif;font-weight:600;">SPARK — MENU</p>
      </div>
      <div class="sim-icon-rows">
        <div class="sim-icon-row">${row1}</div>
        <div class="sim-icon-row" style="grid-template-columns:repeat(5,1fr);">${row2}</div>
      </div>
    `;
    bindSimIcons();
    return;
  }

  if (state.simScreen === "motors") {
    renderSimCategory(state.simMotorSide, true);
    return;
  }

  if (state.simScreen === "category") {
    renderSimCategory(state.simCategory, false);
    return;
  }

  if (state.simScreen === "info") {
    const entry = MENU_LEGEND.find(e => e.id === state.simInfoId);
    screen.innerHTML = `
      <div class="sim-screen-title">${entry ? entry.label : ""}</div>
      <div class="sim-info"><p>${entry ? entry.meaning : ""}</p></div>
      <div class="sim-single-back">
        <button class="sim-icon-btn${SIMULATOR_ICON_IMAGES && SIMULATOR_ICON_IMAGES.back ? " has-img" : ""}" data-sim-action="menu">${simIconMarkup("back")}</button>
      </div>
    `;
    bindSimIcons();
    return;
  }

  if (state.simScreen === "paramscreen") {
    renderSimParamScreen();
    return;
  }
}

function renderSimParamScreen() {
  const screen = document.getElementById("deviceScreen");
  const page = state.simParamPage || 1;
  const names = PARAM_PAGES[page] || [];

  const rows = names.map(name => {
    const pr = PARAMETERS.find(p => p.name === name);
    const shortDesc = PARAM_SHORT_DESC[name] || "";
    const fullDescHtml = pr ? renderParamDesc(pr.desc).replace(/class="param-p"/g, 'class="sim-param-p"').replace(/class="param-ul"/g, 'class="sim-param-ul"').replace(/class="param-formula"/g, 'class="sim-param-formula"').replace(/class="param-figure"/g, 'class="sim-param-figure"') : "<p class=\"sim-param-p\">Nessuna descrizione tecnica dettagliata associata a questa voce.</p>";
    const hasSpecs = pr && (pr.default !== null || pr.min !== null || pr.max !== null);
    return `
      <div class="sim-row" data-sim-row="${name}">
        <div class="sim-row-main">
          <div class="sim-row-left" style="flex-direction:column;align-items:flex-start;gap:2px;">
            <span class="sim-row-code">${name}</span>
            ${shortDesc ? `<span class="sim-param-caption">${shortDesc}</span>` : ""}
          </div>
          <svg class="sim-row-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <div class="sim-row-answer">
          ${fullDescHtml}
          ${hasSpecs ? `
          <div class="sim-row-specs">
            <div class="sim-spec"><span class="spec-label">Default</span><span class="spec-value">${pr.default ?? "—"}</span></div>
            <div class="sim-spec"><span class="spec-label">Min</span><span class="spec-value">${pr.min ?? "—"}</span></div>
            <div class="sim-spec"><span class="spec-label">Max</span><span class="spec-value">${pr.max ?? "—"}</span></div>
          </div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  screen.innerHTML = `
    <div class="sim-screen-title">PARAMETRI</div>
    <div class="sim-side-switch">
      <button class="sim-side-pill ${page === 1 ? "active" : ""}" data-sim-param-page="1">Pagina 1</button>
      <button class="sim-side-pill ${page === 2 ? "active" : ""}" data-sim-param-page="2">Pagina 2</button>
    </div>
    <div class="sim-data-list">${rows}</div>
    <div class="sim-single-back">
      <button class="sim-icon-btn${SIMULATOR_ICON_IMAGES && SIMULATOR_ICON_IMAGES.back ? " has-img" : ""}" data-sim-action="menu">${simIconMarkup("back")}</button>
    </div>
  `;

  bindAccordion(screen);
  bindSimIcons();
  screen.querySelectorAll("[data-sim-param-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.simParamPage = parseInt(btn.dataset.simParamPage, 10);
      renderDevice();
    });
  });
}

function bindAccordion(container, rowSelector, headerSelector) {
  rowSelector = rowSelector || ".sim-row";
  headerSelector = headerSelector || ".sim-row-main";
  const rows = container.querySelectorAll(rowSelector);
  rows.forEach(row => {
    row.querySelector(headerSelector).addEventListener("click", () => {
      const wasOpen = row.classList.contains("open");
      rows.forEach(r => r.classList.remove("open"));
      if (!wasOpen) row.classList.add("open");
    });
  });
}

function simRowHtml(item) {
  return `
    <div class="sim-row" data-sim-row="${item.id}">
      <div class="sim-row-main">
        <div class="sim-row-left">
          <span class="sim-row-code">${item.label}</span>
          ${item.unit ? `<span class="sim-row-unit">${item.unit}</span>` : ""}
        </div>
        <svg class="sim-row-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="sim-row-answer">
        <div class="sim-row-meaning">${item.meaning}</div>
        <div class="sim-row-specs">
          <div class="sim-spec"><span class="spec-label">Unità</span><span class="spec-value">${item.unit || "—"}</span></div>
          <div class="sim-spec"><span class="spec-label">Min</span><span class="spec-value">${item.min !== null && item.min !== undefined ? item.min : "—"}</span></div>
          <div class="sim-spec"><span class="spec-label">Max</span><span class="spec-value">${item.max !== null && item.max !== undefined ? item.max : "—"}</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderSimCategory(categoryId, isMotors) {
  const screen = document.getElementById("deviceScreen");
  const dict = I18N[state.lang] || I18N.it;
  const cat = LEGEND_CATEGORIES.find(c => c.id === categoryId);
  const items = MENU_LEGEND.filter(e => e.category === categoryId && matchesFw(e.fw));

  const sideSwitch = isMotors ? `
    <div class="sim-side-switch">
      <button class="sim-side-pill ${state.simMotorSide === "motori-sx" ? "active" : ""}" data-sim-side="motori-sx">${(dict.sim_side_left || "SX")}</button>
      <button class="sim-side-pill ${state.simMotorSide === "motori-dx" ? "active" : ""}" data-sim-side="motori-dx">${(dict.sim_side_right || "DX")}</button>
    </div>` : "";

  let listHtml;
  if (cat && cat.splitAfter && items.length) {
    const splitIdx = items.findIndex(it => it.id === cat.splitAfter);
    const leftItems = splitIdx >= 0 ? items.slice(0, splitIdx + 1) : items;
    const rightItems = splitIdx >= 0 ? items.slice(splitIdx + 1) : [];
    listHtml = `
      <div class="sim-data-columns">
        <div class="sim-data-col">${leftItems.map(simRowHtml).join("")}</div>
        <div class="sim-data-col">${rightItems.map(simRowHtml).join("")}</div>
      </div>
    `;
  } else if (items.length) {
    listHtml = `<div class="sim-data-list">${items.map(simRowHtml).join("")}</div>`;
  } else {
    listHtml = `<div class="sim-info"><p>${dict.empty_state}</p></div>`;
  }

  screen.innerHTML = `
    <div class="sim-screen-title">${cat ? cat.label : ""}</div>
    ${sideSwitch}
    ${listHtml}
    <div class="sim-single-back">
      <button class="sim-icon-btn${SIMULATOR_ICON_IMAGES && SIMULATOR_ICON_IMAGES.back ? " has-img" : ""}" data-sim-action="menu">${simIconMarkup("back")}</button>
    </div>
  `;

  bindAccordion(screen);
  bindSimIcons();
  if (isMotors) {
    screen.querySelectorAll("[data-sim-side]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.simMotorSide = btn.dataset.simSide;
        renderDevice();
      });
    });
  }
}

function bindSimIcons() {
  document.querySelectorAll("[data-sim-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.simAction;
      if (action === "menu") {
        state.simScreen = "menu";
        renderDevice();
        return;
      }
      const item = SIMULATOR_MENU.find(m => m.id === action);
      if (!item) return;
      if (item.kind === "category") {
        state.simScreen = "category";
        state.simCategory = item.category;
      } else if (item.kind === "motors") {
        state.simScreen = "motors";
      } else if (item.kind === "info") {
        state.simScreen = "info";
        state.simInfoId = item.legendId;
      } else if (item.kind === "paramscreen") {
        state.simScreen = "paramscreen";
        state.simParamPage = 1;
      } else if (item.kind === "action") {
        state.simScreen = item.action;
      }
      renderDevice();
    });
  });
}
function init() {
  applyI18n();
  renderFwSwitch();
  renderAccessLevels();
  updateSimulatorAvailability();
  renderMaintenance();
  renderProcedures();
  renderDocuments();
  renderComponents();
  renderSequence();
  renderDevice();
  renderMapView();

  // Ricarica della pagina o ritorno dal form: ripristina la pagina in cui si era
  if (history.state && history.state.route) {
    applyRoute(history.state.route);
  } else {
    history.replaceState({ route: currentRoute(), prev: null }, "");
  }
}

init();
