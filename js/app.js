/* =========================================================================
   SPARK DOC HUB — APP LOGIC
   Non serve modificare questo file per aggiungere contenuti: usa js/data.js
   ========================================================================= */

const state = {
  lang: "it",
  fw: FW_VERSIONS[0].id,
  view: "home"
};

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
  document.querySelector(".content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
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
      renderChecklists();
      renderCollaudo();
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
   CHECKLIST
   ------------------------------------------------------------------- */
function renderChecklists() {
  const container = document.getElementById("checklistContainer");
  const lists = CHECKLISTS.filter(c => matchesFw(c.fw));

  if (lists.length === 0) {
    container.innerHTML = `<div class="empty-state">${(I18N[state.lang] || I18N.it).empty_state}</div>`;
    return;
  }

  container.innerHTML = "";
  lists.forEach(list => {
    const card = document.createElement("div");
    card.className = "checklist-card";
    const rows = list.items.map((text, i) => `
      <div class="check-row">
        <input type="checkbox" id="${list.id}-${i}">
        <label for="${list.id}-${i}">${text}</label>
      </div>
    `).join("");
    card.innerHTML = `<h3>${list.title}</h3>${rows}`;
    container.appendChild(card);
  });

  container.querySelectorAll('.check-row input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", () => {
      const label = cb.nextElementSibling;
      label.classList.toggle("done", cb.checked);
    });
  });
}

/* ---------------------------------------------------------------------
   COLLAUDO
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
function renderDocuments() {
  const container = document.getElementById("documentsContainer");
  const docs = DOCUMENTS[state.fw] || [];

  if (docs.length === 0) {
    container.innerHTML = `<div class="empty-state">${(I18N[state.lang] || I18N.it).empty_state}</div>`;
    return;
  }

  container.innerHTML = "";
  docs.forEach(doc => {
    const row = document.createElement("a");
    row.className = "doc-row";
    row.href = doc.url;
    row.target = "_blank";
    row.rel = "noopener";
    row.style.textDecoration = "none";
    row.innerHTML = `
      <span class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/></svg></span>
      <span class="doc-meta">
        <span class="doc-title">${doc.title}</span><br>
        <span class="doc-type">${doc.type}</span>
      </span>
      <span class="doc-action">Apri</span>
    `;
    container.appendChild(row);
  });
}

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
  const navBtn = document.getElementById("navSimulator");
  const card = document.getElementById("cardSimulator");
  const lockMsg = document.getElementById("simFwLock");
  const deviceWrap = document.getElementById("simDeviceWrap");

  [navBtn, card].forEach(el => {
    if (!el) return;
    el.classList.toggle("is-disabled", !available);
  });

  if (lockMsg) lockMsg.style.display = available ? "none" : "block";
  if (deviceWrap) deviceWrap.style.display = available ? "flex" : "none";

  if (!available && state.view === "simulator") {
    goToView("home");
  }
}

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
}

function bindAccordion(container) {
  const rows = container.querySelectorAll(".sim-row");
  rows.forEach(row => {
    row.querySelector(".sim-row-main").addEventListener("click", () => {
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
  renderChecklists();
  renderCollaudo();
  renderDocuments();
  renderDevice();
}

init();
