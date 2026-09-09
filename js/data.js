/* =========================================================================
   SPARK DOC HUB — DATI
   -------------------------------------------------------------------------
   Questo è l'UNICO file che dovrai modificare per aggiungere contenuti reali.
   Non serve toccare app.js o style.css per aggiungere voci: basta aggiungere
   oggetti agli array qui sotto seguendo lo schema esistente.
   ========================================================================= */

const FW_VERSIONS = [
  { id: "7.9", label: "FW 7.9" },
  { id: "8.2", label: "FW 8.2.x.x" }
];

/* ---------------------------------------------------------------------
   LIVELLI DI ACCESSO (password schermata impostazioni)
   Fonte: Menù Spark R01 del 16/06/2026
   ------------------------------------------------------------------- */
const ACCESS_LEVELS = [
  { level: "USER", password: "151010", permessi: "Solo lettura, nessun movimento manuale, salvare altezza di carico." },
  { level: "MAINTENANCE", password: "182133", permessi: "Modificare le posizioni degli attuatori del rostro e salvare altezza di carico." },
  { level: "FACTORY", password: "161112", permessi: "Modificare tutti i parametri e usare manualmente tutti i motori e attuatori." }
];

/* ---------------------------------------------------------------------
   CATEGORIE DELLA LEGGENDA MENU
   Corrispondono alle schermate del prodotto Spark.
   ------------------------------------------------------------------- */
const LEGEND_CATEGORIES = [
  { id: "menu-principale", label: "Menu Principale" },
  { id: "calibrazione", label: "Calibrazione" },
  { id: "motori-sx", label: "Scheda Motori SX (ECU MT LEFT)" },
  { id: "motori-dx", label: "Scheda Motori DX (ECU MT RIGHT)" },
  { id: "work-panel", label: "Work Panel" },
  { id: "rostro", label: "Rostro (ECU RST)" }
];

/* ---------------------------------------------------------------------
   LEGGENDA MENU
   Ogni voce: id, category (uno degli id in LEGEND_CATEGORIES), label
   (il codice/nome così come appare sullo schermo), unit (unità di misura,
   facoltativa), meaning (spiegazione), fw (null = tutte le versioni FW,
   altrimenti "7.9" o "8.2").
   Fonte: documento "Menù Spark" R01 del 16/06/2026.
   ------------------------------------------------------------------- */
const MENU_LEGEND = [
  // --- Menu Principale ---------------------------------------------
  { id: "mp-indietro", category: "menu-principale", label: "Tornare indietro", unit: "", meaning: "Riporta alla schermata utilizzatori.", fw: null },
  { id: "mp-workpanel", category: "menu-principale", label: "Work Panel", unit: "", meaning: "Settaggio altezza di carico e visualizzazione stati in tempo reale.", fw: null },
  { id: "mp-parametri", category: "menu-principale", label: "Parametri", unit: "", meaning: "Settaggio e visualizzazione dei parametri.", fw: null },
  { id: "mp-faults", category: "menu-principale", label: "Faults", unit: "", meaning: "Visualizzazione degli errori registrati.", fw: null },
  { id: "mp-poweroff", category: "menu-principale", label: "Power Off", unit: "", meaning: "Spegnimento del sistema.", fw: null },
  { id: "mp-calibration", category: "menu-principale", label: "Calibration", unit: "", meaning: "Calibrazione dello zero macchina.", fw: null },
  { id: "mp-motors", category: "menu-principale", label: "Motors (ECU MT)", unit: "", meaning: "Modalità manuale e visualizzazione dei parametri dei motori.", fw: null },
  { id: "mp-rostro", category: "menu-principale", label: "Rostro (ECU RST)", unit: "", meaning: "Regolazione degli attuatori e visualizzazione del laser.", fw: null },
  { id: "mp-hmi", category: "menu-principale", label: "HMI", unit: "", meaning: "Visualizzazione di vari parametri dell'interfaccia.", fw: null },

  // --- Calibrazione ---------------------------------------------------
  { id: "cal-a1", category: "calibrazione", label: "A_1", unit: "cnt", meaning: "Gradi di inclinazione sensore angolare DX (Gambe Piedi) — Tutto giù 2560, tutto su 640.", fw: null },
  { id: "cal-pr1", category: "calibrazione", label: "PR_1", unit: "cnt", meaning: "Sensore di pressione DX (Gambe Piedi).", fw: null },
  { id: "cal-a2", category: "calibrazione", label: "A_2", unit: "cnt", meaning: "Gradi di inclinazione sensore angolare SX (Gambe Testa) — Tutto giù 2600, tutto su 680.", fw: null },
  { id: "cal-pr2", category: "calibrazione", label: "PR_2", unit: "cnt", meaning: "Sensore di pressione SX (Gambe Testa).", fw: null },
  { id: "cal-po1", category: "calibrazione", label: "PO_1", unit: "mm", meaning: "Potenziometro lato Piedi DX.", fw: null },
  { id: "cal-po2", category: "calibrazione", label: "PO_2", unit: "mm", meaning: "Potenziometro lato Piedi SX.", fw: null },
  { id: "cal-po3", category: "calibrazione", label: "PO_3", unit: "mm", meaning: "Potenziometro lato Testa DX.", fw: null },
  { id: "cal-po4", category: "calibrazione", label: "PO_4", unit: "mm", meaning: "Potenziometro lato Testa SX.", fw: null },
  { id: "cal-m5c", category: "calibrazione", label: "M_5", unit: "°C", meaning: "Temperatura motore Gambe lato Piedi.", fw: null },
  { id: "cal-m6c", category: "calibrazione", label: "M_6", unit: "°C", meaning: "Temperatura motore Gambe lato Testa.", fw: null },
  { id: "cal-pwm", category: "calibrazione", label: "PWM MT DRIVER", unit: "%", meaning: "Potenza motori.", fw: null },
  { id: "cal-m6a", category: "calibrazione", label: "M_6", unit: "A", meaning: "Corrente motore Gambe lato Testa.", fw: null },
  { id: "cal-m3a", category: "calibrazione", label: "M_3", unit: "A", meaning: "Corrente motore Ruota lato Testa DX.", fw: null },
  { id: "cal-m4a", category: "calibrazione", label: "M_4", unit: "A", meaning: "Corrente motore Ruota lato Testa SX.", fw: null },
  { id: "cal-m5a", category: "calibrazione", label: "M_5", unit: "A", meaning: "Corrente motore Gambe lato Piedi.", fw: null },
  { id: "cal-m1a", category: "calibrazione", label: "M_1", unit: "A", meaning: "Corrente motore Ruota lato Piedi DX.", fw: null },
  { id: "cal-m2a", category: "calibrazione", label: "M_2", unit: "A", meaning: "Corrente motore Ruota lato Piedi SX.", fw: null },

  // --- Scheda Motori SX -------------------------------------------------
  { id: "msx-a2", category: "motori-sx", label: "A_2", unit: "cnt", meaning: "Gradi di inclinazione sensore angolare SX (Gambe Testa) — Tutto giù 2620, tutto su 630.", fw: null },
  { id: "msx-pr2", category: "motori-sx", label: "PR_2", unit: "cnt", meaning: "Sensore di pressione SX (Gambe Testa).", fw: null },
  { id: "msx-po2", category: "motori-sx", label: "PO_2", unit: "mm", meaning: "Potenziometro lato Piedi SX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "msx-po4", category: "motori-sx", label: "PO_4", unit: "mm", meaning: "Potenziometro lato Testa SX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "msx-m6c", category: "motori-sx", label: "M_6", unit: "°C", meaning: "Temperatura motore Gambe lato Testa.", fw: null },
  { id: "msx-m2c", category: "motori-sx", label: "M_2", unit: "°C", meaning: "Temperatura motore Ruota lato Piedi SX.", fw: null },
  { id: "msx-m4c", category: "motori-sx", label: "M_4", unit: "°C", meaning: "Temperatura motore Ruota lato Testa SX.", fw: null },
  { id: "msx-pwm", category: "motori-sx", label: "PWM MT DRIVER", unit: "%", meaning: "Potenza motori.", fw: null },
  { id: "msx-m6a", category: "motori-sx", label: "M_6", unit: "A", meaning: "Corrente motore Gambe lato Testa.", fw: null },
  { id: "msx-m2a", category: "motori-sx", label: "M_2", unit: "A", meaning: "Corrente motore Ruota lato Piedi SX.", fw: null },
  { id: "msx-m4a", category: "motori-sx", label: "M_4", unit: "A", meaning: "Corrente motore Ruota lato Testa SX.", fw: null },
  { id: "msx-ev2", category: "motori-sx", label: "EV_2", unit: "A", meaning: "Corrente elettrovalvola lato SX (Gamba Testa).", fw: null },
  { id: "msx-f2", category: "motori-sx", label: "F_2", unit: "A", meaning: "Corrente freno Ruota lato Piedi SX.", fw: null },
  { id: "msx-f4", category: "motori-sx", label: "F_4", unit: "A", meaning: "Corrente freno Ruota lato Testa SX.", fw: null },

  // --- Scheda Motori DX -------------------------------------------------
  { id: "mdx-a1", category: "motori-dx", label: "A_1", unit: "cnt", meaning: "Gradi di inclinazione sensore angolare DX (Gambe Piedi) — Tutto giù 2605, tutto su 670.", fw: null },
  { id: "mdx-pr1", category: "motori-dx", label: "PR_1", unit: "cnt", meaning: "Sensore di pressione DX (Gambe Piedi).", fw: null },
  { id: "mdx-po1", category: "motori-dx", label: "PO_1", unit: "mm", meaning: "Potenziometro lato Piedi DX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "mdx-po3", category: "motori-dx", label: "PO_3", unit: "mm", meaning: "Potenziometro lato Testa DX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "mdx-m5c", category: "motori-dx", label: "M_5", unit: "°C", meaning: "Temperatura motore Gambe Piedi.", fw: null },
  { id: "mdx-m1c", category: "motori-dx", label: "M_1", unit: "°C", meaning: "Temperatura motore Ruota Piedi DX.", fw: null },
  { id: "mdx-m3c", category: "motori-dx", label: "M_3", unit: "°C", meaning: "Temperatura motore Ruota Testa DX.", fw: null },
  { id: "mdx-pwm", category: "motori-dx", label: "PWM MT DRIVER", unit: "%", meaning: "Potenza motori.", fw: null },
  { id: "mdx-m5a", category: "motori-dx", label: "M_5", unit: "A", meaning: "Corrente motore Gambe Piedi.", fw: null },
  { id: "mdx-m1a", category: "motori-dx", label: "M_1", unit: "A", meaning: "Corrente motore Ruota Piedi DX.", fw: null },
  { id: "mdx-m3a", category: "motori-dx", label: "M_3", unit: "A", meaning: "Corrente motore Ruota Testa DX.", fw: null },
  { id: "mdx-ev1", category: "motori-dx", label: "EV_1", unit: "A", meaning: "Corrente elettrovalvola DX (Gambe Piedi).", fw: null },
  { id: "mdx-f1", category: "motori-dx", label: "F_1", unit: "A", meaning: "Corrente freno Ruota Piedi DX.", fw: null },
  { id: "mdx-f3", category: "motori-dx", label: "F_3", unit: "A", meaning: "Corrente freno Ruota Testa DX.", fw: null },

  // --- Work Panel ---------------------------------------------------
  { id: "wp-a1", category: "work-panel", label: "A_1", unit: "Deg", meaning: "Gradi di inclinazione sensore angolare DX (Gambe Piedi) — Tutto giù 0.0, tutto su 70.0.", fw: null },
  { id: "wp-a2", category: "work-panel", label: "A_2", unit: "Deg", meaning: "Gradi di inclinazione sensore angolare SX (Gambe Testa) — Tutto giù 0.0, tutto su 70.0.", fw: null },
  { id: "wp-pr1", category: "work-panel", label: "PR_1", unit: "Bar", meaning: "Sensore di pressione DX (Gambe Piedi).", fw: null },
  { id: "wp-pr2", category: "work-panel", label: "PR_2", unit: "Bar", meaning: "Sensore di pressione SX (Gambe Testa).", fw: null },
  { id: "wp-m5", category: "work-panel", label: "M_5", unit: "A", meaning: "Corrente motore Gambe Piedi.", fw: null },
  { id: "wp-m1", category: "work-panel", label: "M_1", unit: "A", meaning: "Corrente motore Ruota Piedi DX.", fw: null },
  { id: "wp-m2", category: "work-panel", label: "M_2", unit: "A", meaning: "Corrente motore Ruota Piedi SX.", fw: null },
  { id: "wp-m6", category: "work-panel", label: "M_6", unit: "A", meaning: "Corrente motore Gambe Testa.", fw: null },
  { id: "wp-m3", category: "work-panel", label: "M_3", unit: "A", meaning: "Corrente motore Ruota Testa DX.", fw: null },
  { id: "wp-m4", category: "work-panel", label: "M_4", unit: "A", meaning: "Corrente motore Ruota Testa SX.", fw: null },
  { id: "wp-l3", category: "work-panel", label: "L_3", unit: "Cnt", meaning: "Sensore allineamento slitta/barella verticale.", fw: null },
  { id: "wp-l4", category: "work-panel", label: "L_4", unit: "Cnt", meaning: "Sensore distanza allineamento rostro/barella orizzontale.", fw: null },
  { id: "wp-has", category: "work-panel", label: "HAS", unit: "", meaning: "Stato allineamento orizzontale.", fw: null },
  { id: "wp-g1", category: "work-panel", label: "G_1", unit: "Deg", meaning: "Gradi inclinazione giroscopio — Testa su 80.5, Piedi su 14.1, Orizzontale 47.0.", fw: null },
  { id: "wp-bt1", category: "work-panel", label: "BT_1", unit: "%", meaning: "Livello di carica batteria.", fw: null },
  { id: "wp-linked", category: "work-panel", label: "LINKED", unit: "", meaning: "Stato macchina.", fw: null },
  { id: "wp-r1", category: "work-panel", label: "R_1", unit: "On/off", meaning: "Reed magnetico sfera.", fw: null },
  { id: "wp-r2", category: "work-panel", label: "R_2", unit: "On/off", meaning: "Reed magnetico 10g.", fw: null },
  { id: "wp-r3", category: "work-panel", label: "R_3", unit: "On/off", meaning: "Reed magnetico barelli.", fw: null },
  { id: "wp-fc1", category: "work-panel", label: "FC_1", unit: "On/off", meaning: "Micro finecorsa orizzontale.", fw: null },
  { id: "wp-fc2", category: "work-panel", label: "FC_2", unit: "On/off", meaning: "Micro finecorsa verticale.", fw: null },
  { id: "wp-l1", category: "work-panel", label: "L_1", unit: "On/off", meaning: "Fotocellula presenza piano.", fw: null },
  { id: "wp-l2", category: "work-panel", label: "L_2", unit: "On/off", meaning: "Fotocellula catarifrangente slitta.", fw: null },
  { id: "wp-cs1", category: "work-panel", label: "CS_1", unit: "On/off", meaning: "Costa sensibile DX e SX.", fw: null },
  { id: "wp-c2", category: "work-panel", label: "C_2", unit: "On/off", meaning: "Thumbwheel.", fw: null },
  { id: "wp-c3", category: "work-panel", label: "C_3", unit: "On/off", meaning: "Pulsante carico.", fw: null },
  { id: "wp-c4", category: "work-panel", label: "C_4", unit: "On/off", meaning: "Pulsante scarico.", fw: null },
  { id: "wp-at1", category: "work-panel", label: "Cmd AT_1", unit: "On/off", meaning: "Comando attuatore verticale.", fw: null },
  { id: "wp-at2", category: "work-panel", label: "Cmd AT_2", unit: "On/off", meaning: "Comando attuatore orizzontale.", fw: null },
  { id: "wp-cmdm5", category: "work-panel", label: "Cmd M_5", unit: "", meaning: "Comando motore Gambe Piedi.", fw: null },
  { id: "wp-m5c", category: "work-panel", label: "M_5", unit: "°C", meaning: "Temperatura motore Gambe Piedi.", fw: null },
  { id: "wp-cmdm6", category: "work-panel", label: "Cmd M_6", unit: "", meaning: "Comando motore Gambe Testa.", fw: null },
  { id: "wp-m6c", category: "work-panel", label: "M_6", unit: "°C", meaning: "Temperatura motore Gambe Testa.", fw: null },
  { id: "wp-loadlvla2", category: "work-panel", label: "Load Lvl A_2", unit: "Deg", meaning: "Altezza di carico salvata della Gamba Testa.", fw: null },
  { id: "wp-loadlvla1", category: "work-panel", label: "Load Lvl A_1", unit: "Deg", meaning: "Altezza di carico salvata della Gamba Piedi.", fw: null },

  // --- Rostro ---------------------------------------------------------
  { id: "ro-at1a", category: "rostro", label: "AT_1", unit: "A", meaning: "Corrente attuatore verticale.", fw: null },
  { id: "ro-at2a", category: "rostro", label: "AT_2", unit: "A", meaning: "Corrente attuatore orizzontale.", fw: null },
  { id: "ro-l3", category: "rostro", label: "L_3", unit: "Cnt", meaning: "Sensore allineamento slitta/barella verticale.", fw: null },
  { id: "ro-l4", category: "rostro", label: "L_4", unit: "Cnt", meaning: "Sensore allineamento rostro/barella orizzontale.", fw: null },
  { id: "ro-at1p", category: "rostro", label: "AT_1", unit: "%", meaning: "Posizione attuale AT_1.", fw: null },
  { id: "ro-at2p", category: "rostro", label: "AT_2", unit: "%", meaning: "Posizione attuale AT_2.", fw: null },
  { id: "ro-workat1", category: "rostro", label: "Work AT_1", unit: "%", meaning: "Posizione impostata lavoro AT_1.", fw: null },
  { id: "ro-idleat1", category: "rostro", label: "Idle AT_1", unit: "%", meaning: "Posizione impostata riposo AT_1.", fw: null },
  { id: "ro-workat2", category: "rostro", label: "Work AT_2", unit: "%", meaning: "Posizione impostata lavoro AT_2.", fw: null },
  { id: "ro-idleat2", category: "rostro", label: "Idle AT_2", unit: "%", meaning: "Posizione impostata riposo AT_2.", fw: null },
  { id: "ro-r1", category: "rostro", label: "R_1", unit: "On/off", meaning: "Reed magnetico sfera.", fw: null },
  { id: "ro-r2", category: "rostro", label: "R_2", unit: "On/off", meaning: "Reed magnetico 10g.", fw: null },
  { id: "ro-fc1", category: "rostro", label: "FC_1", unit: "On/off", meaning: "Micro finecorsa orizzontale.", fw: null },
  { id: "ro-fc2", category: "rostro", label: "FC_2", unit: "On/off", meaning: "Micro finecorsa verticale.", fw: null },
  { id: "ro-l1", category: "rostro", label: "L_1", unit: "On/off", meaning: "Fotocellula presenza piano.", fw: null },
  { id: "ro-l2", category: "rostro", label: "L_2", unit: "On/off", meaning: "Fotocellula catarifrangente slitta.", fw: null }
];

/* ---------------------------------------------------------------------
   SIMULATORE — MENU PRINCIPALE DEL DISPOSITIVO
   Ogni voce rappresenta un'icona del menu reale di Spark.
   kind: "category" → apre una schermata dati (riusa LEGEND_CATEGORIES/MENU_LEGEND)
         "motors"   → apre lo speciale selettore ECU MT LEFT/RIGHT
         "info"     → schermata semplice con la sola spiegazione (legendId
                      punta a una voce di MENU_LEGEND, categoria "menu-principale")
   ------------------------------------------------------------------- */
const SIMULATOR_MENU = [
  { id: "calibration", label: "Calibration", icon: "compass", kind: "category", category: "calibrazione" },
  { id: "motors", label: "ECU MT", icon: "motor", kind: "motors" },
  { id: "rostro", label: "ECU RST", icon: "rostro", kind: "category", category: "rostro" },
  { id: "hmi", label: "HMI", icon: "hmi", kind: "info", legendId: "mp-hmi" },
  { id: "back", label: "Indietro", icon: "back", kind: "action", action: "boot" },
  { id: "workpanel", label: "Work Panel", icon: "workpanel", kind: "category", category: "work-panel" },
  { id: "parametri", label: "Parametri", icon: "params", kind: "info", legendId: "mp-parametri" },
  { id: "faults", label: "Faults", icon: "faults", kind: "info", legendId: "mp-faults" },
  { id: "poweroff", label: "Power Off", icon: "power", kind: "info", legendId: "mp-poweroff" }
];

/* Versioni firmware mostrate nella schermata di avvio del simulatore (solo scenografia) */
const SIMULATOR_BOOT_INFO = [
  { label: "HW", value: "v.8.2.1.0" },
  { label: "ECU ROSTRO", value: "v.3.1.0.0" },
  { label: "ECU MT LEFT", value: "v.4.1.0.3" },
  { label: "ECU MT RIGHT", value: "v.4.1.0.3" },
  { label: "BLE", value: "v.2.5" }
];
const CHECKLISTS = [
  {
    id: "checklist-esempio",
    title: "Checklist di esempio",
    fw: null,
    items: [
      "Primo punto di controllo",
      "Secondo punto di controllo",
      "Terzo punto di controllo"
    ]
  }
];

/* ---------------------------------------------------------------------
   COLLAUDO
   ------------------------------------------------------------------- */
const COLLAUDO = [
  {
    id: "collaudo-esempio",
    title: "Procedura di collaudo di esempio",
    fw: null,
    steps: [
      { title: "Step 1", detail: "Descrizione dello step di collaudo." },
      { title: "Step 2", detail: "Descrizione dello step di collaudo." }
    ]
  }
];

/* ---------------------------------------------------------------------
   DOCUMENTI
   ------------------------------------------------------------------- */
const DOCUMENTS = {
  "7.9": [
    { title: "Manuale utente — FW 7.9", type: "PDF", url: "#" },
    { title: "Note di rilascio — FW 7.9", type: "PDF", url: "#" }
  ],
  "8.2": [
    { title: "Manuale utente — FW 8.2.x.x", type: "PDF", url: "#" },
    { title: "Note di rilascio — FW 8.2.x.x", type: "PDF", url: "#" }
  ]
};

/* ---------------------------------------------------------------------
   TESTI INTERFACCIA (predisposizione multilingua)
   ------------------------------------------------------------------- */
const I18N = {
  it: {
    appName: "Spark Doc Hub",
    tagline: "Centro documentazione, checklist e collaudo",
    nav_home: "Home",
    nav_legend: "Leggenda Menu",
    nav_simulator: "Simulatore",
    nav_checklist: "Checklist",
    nav_collaudo: "Collaudo",
    nav_documents: "Documenti",
    fw_label: "Versione firmware",
    home_intro: "Tutto quello che serve per configurare, controllare e collaudare Spark, organizzato per versione firmware.",
    legend_intro: "Seleziona una voce del menu Spark per vederne il significato. Usa questa sezione per esercitarti a riconoscere le voci prima di usare il prodotto.",
    simulator_intro: "Naviga tra le schermate come sul dispositivo reale. Tocca una voce per vederne il significato.",
    sim_tap_to_start: "Tocca lo schermo per iniziare",
    sim_back_to_menu: "Menu",
    sim_side_left: "SX",
    sim_side_right: "DX",
    checklist_intro: "Le checklist operative da seguire passo passo.",
    collaudo_intro: "La procedura di collaudo del prodotto.",
    documents_intro: "Documentazione disponibile per la versione firmware selezionata.",
    empty_state: "Contenuti in arrivo per questa sezione.",
    search_placeholder: "Cerca una voce…",
    access_title: "Livelli di accesso",
    lang_it: "Italiano",
    lang_fr: "Français",
    lang_es: "Español",
    lang_soon: "presto disponibile"
  },
  fr: {},
  es: {}
};
