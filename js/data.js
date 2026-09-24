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
  { id: "work-panel", label: "Work Panel", splitAfter: "wp-linked" },
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
  { id: "mp-indietro", category: "menu-principale", label: "Tornare indietro", unit: "", min: null, max: null, meaning: "Riporta alla schermata utilizzatori.", fw: null },
  { id: "mp-workpanel", category: "menu-principale", label: "Work Panel", unit: "", min: null, max: null, meaning: "Settaggio altezza di carico e visualizzazione stati in tempo reale.", fw: null },
  { id: "mp-parametri", category: "menu-principale", label: "Parametri", unit: "", min: null, max: null, meaning: "Settaggio e visualizzazione dei parametri.", fw: null },
  { id: "mp-faults", category: "menu-principale", label: "Faults", unit: "", min: null, max: null, meaning: "Visualizzazione degli errori registrati.", fw: null },
  { id: "mp-poweroff", category: "menu-principale", label: "Power Off", unit: "", min: null, max: null, meaning: "Spegnimento del sistema.", fw: null },
  { id: "mp-calibration", category: "menu-principale", label: "Calibration", unit: "", min: null, max: null, meaning: "Calibrazione dello zero macchina.", fw: null },
  { id: "mp-motors", category: "menu-principale", label: "Motors (ECU MT)", unit: "", min: null, max: null, meaning: "Modalità manuale e visualizzazione dei parametri dei motori.", fw: null },
  { id: "mp-rostro", category: "menu-principale", label: "Rostro (ECU RST)", unit: "", min: null, max: null, meaning: "Regolazione degli attuatori e visualizzazione del laser.", fw: null },
  { id: "mp-hmi", category: "menu-principale", label: "HMI", unit: "", min: null, max: null, meaning: "Visualizzazione di vari parametri dell'interfaccia.", fw: null },

  // --- Calibrazione ---------------------------------------------------
  { id: "cal-a1", category: "calibrazione", label: "A_1", unit: "cnt", min: null, max: null, meaning: "Gradi di inclinazione sensore angolare DX (Gambe Piedi) — Tutto giù 2560, tutto su 640.", fw: null },
  { id: "cal-pr1", category: "calibrazione", label: "PR_1", unit: "cnt", min: null, max: null, meaning: "Sensore di pressione DX (Gambe Piedi).", fw: null },
  { id: "cal-a2", category: "calibrazione", label: "A_2", unit: "cnt", min: null, max: null, meaning: "Gradi di inclinazione sensore angolare SX (Gambe Testa) — Tutto giù 2600, tutto su 680.", fw: null },
  { id: "cal-pr2", category: "calibrazione", label: "PR_2", unit: "cnt", min: null, max: null, meaning: "Sensore di pressione SX (Gambe Testa).", fw: null },
  { id: "cal-po1", category: "calibrazione", label: "PO_1", unit: "mm", min: "0.00", max: "45.0", meaning: "Potenziometro lato Piedi DX.", fw: null },
  { id: "cal-po2", category: "calibrazione", label: "PO_2", unit: "mm", min: "0.00", max: "45.0", meaning: "Potenziometro lato Piedi SX.", fw: null },
  { id: "cal-po3", category: "calibrazione", label: "PO_3", unit: "mm", min: "0.00", max: "45.0", meaning: "Potenziometro lato Testa DX.", fw: null },
  { id: "cal-po4", category: "calibrazione", label: "PO_4", unit: "mm", min: "0.00", max: "45.0", meaning: "Potenziometro lato Testa SX.", fw: null },
  { id: "cal-m5c", category: "calibrazione", label: "M_5", unit: "°C", min: null, max: null, meaning: "Temperatura motore Gambe lato Piedi.", fw: null },
  { id: "cal-m6c", category: "calibrazione", label: "M_6", unit: "°C", min: null, max: null, meaning: "Temperatura motore Gambe lato Testa.", fw: null },
  { id: "cal-pwm", category: "calibrazione", label: "PWM MT DRIVER", unit: "%", min: "0", max: "100", meaning: "Potenza motori.", fw: null },
  { id: "cal-m6a", category: "calibrazione", label: "M_6", unit: "A", min: "0", max: null, meaning: "Corrente motore Gambe lato Testa.", fw: null },
  { id: "cal-m3a", category: "calibrazione", label: "M_3", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota lato Testa DX.", fw: null },
  { id: "cal-m4a", category: "calibrazione", label: "M_4", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota lato Testa SX.", fw: null },
  { id: "cal-m5a", category: "calibrazione", label: "M_5", unit: "A", min: "0", max: null, meaning: "Corrente motore Gambe lato Piedi.", fw: null },
  { id: "cal-m1a", category: "calibrazione", label: "M_1", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota lato Piedi DX.", fw: null },
  { id: "cal-m2a", category: "calibrazione", label: "M_2", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota lato Piedi SX.", fw: null },

  // --- Scheda Motori SX -------------------------------------------------
  { id: "msx-a2", category: "motori-sx", label: "A_2", unit: "cnt", min: null, max: null, meaning: "Gradi di inclinazione sensore angolare SX (Gambe Testa) — Tutto giù 2620, tutto su 630.", fw: null },
  { id: "msx-pr2", category: "motori-sx", label: "PR_2", unit: "cnt", min: null, max: null, meaning: "Sensore di pressione SX (Gambe Testa).", fw: null },
  { id: "msx-po2", category: "motori-sx", label: "PO_2", unit: "mm", min: "0.0", max: "45.5", meaning: "Potenziometro lato Piedi SX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "msx-po4", category: "motori-sx", label: "PO_4", unit: "mm", min: "0.0", max: "45.5", meaning: "Potenziometro lato Testa SX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "msx-m6c", category: "motori-sx", label: "M_6", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Gambe lato Testa.", fw: null },
  { id: "msx-m2c", category: "motori-sx", label: "M_2", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Ruota lato Piedi SX.", fw: null },
  { id: "msx-m4c", category: "motori-sx", label: "M_4", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Ruota lato Testa SX.", fw: null },
  { id: "msx-pwm", category: "motori-sx", label: "PWM MT DRIVER", unit: "%", min: "0", max: "100", meaning: "Potenza motori.", fw: null },
  { id: "msx-m6a", category: "motori-sx", label: "M_6", unit: "A", min: "0", max: null, meaning: "Corrente motore Gambe lato Testa.", fw: null },
  { id: "msx-m2a", category: "motori-sx", label: "M_2", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota lato Piedi SX.", fw: null },
  { id: "msx-m4a", category: "motori-sx", label: "M_4", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota lato Testa SX.", fw: null },
  { id: "msx-ev2", category: "motori-sx", label: "EV_2", unit: "A", min: "0", max: null, meaning: "Corrente elettrovalvola lato SX (Gamba Testa).", fw: null },
  { id: "msx-f2", category: "motori-sx", label: "F_2", unit: "A", min: "0", max: null, meaning: "Corrente freno Ruota lato Piedi SX.", fw: null },
  { id: "msx-f4", category: "motori-sx", label: "F_4", unit: "A", min: "0", max: null, meaning: "Corrente freno Ruota lato Testa SX.", fw: null },

  // --- Scheda Motori DX -------------------------------------------------
  { id: "mdx-a1", category: "motori-dx", label: "A_1", unit: "cnt", min: null, max: null, meaning: "Gradi di inclinazione sensore angolare DX (Gambe Piedi) — Tutto giù 2605, tutto su 670.", fw: null },
  { id: "mdx-pr1", category: "motori-dx", label: "PR_1", unit: "cnt", min: null, max: null, meaning: "Sensore di pressione DX (Gambe Piedi).", fw: null },
  { id: "mdx-po1", category: "motori-dx", label: "PO_1", unit: "mm", min: "0.0", max: "45.5", meaning: "Potenziometro lato Piedi DX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "mdx-po3", category: "motori-dx", label: "PO_3", unit: "mm", min: "0.0", max: "45.5", meaning: "Potenziometro lato Testa DX — Chiuso 0.0, aperto 45.4.", fw: null },
  { id: "mdx-m5c", category: "motori-dx", label: "M_5", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Gambe Piedi.", fw: null },
  { id: "mdx-m1c", category: "motori-dx", label: "M_1", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Ruota Piedi DX.", fw: null },
  { id: "mdx-m3c", category: "motori-dx", label: "M_3", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Ruota Testa DX.", fw: null },
  { id: "mdx-pwm", category: "motori-dx", label: "PWM MT DRIVER", unit: "%", min: "0", max: "100", meaning: "Potenza motori.", fw: null },
  { id: "mdx-m5a", category: "motori-dx", label: "M_5", unit: "A", min: "0", max: null, meaning: "Corrente motore Gambe Piedi.", fw: null },
  { id: "mdx-m1a", category: "motori-dx", label: "M_1", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota Piedi DX.", fw: null },
  { id: "mdx-m3a", category: "motori-dx", label: "M_3", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota Testa DX.", fw: null },
  { id: "mdx-ev1", category: "motori-dx", label: "EV_1", unit: "A", min: "0", max: null, meaning: "Corrente elettrovalvola DX (Gambe Piedi).", fw: null },
  { id: "mdx-f1", category: "motori-dx", label: "F_1", unit: "A", min: "0", max: null, meaning: "Corrente freno Ruota Piedi DX.", fw: null },
  { id: "mdx-f3", category: "motori-dx", label: "F_3", unit: "A", min: "0", max: null, meaning: "Corrente freno Ruota Testa DX.", fw: null },

  // --- Work Panel ---------------------------------------------------
  { id: "wp-a1", category: "work-panel", label: "A_1", unit: "Deg", min: "0.0", max: "70.0", meaning: "Gradi di inclinazione sensore angolare DX (Gambe Piedi) — Tutto giù 0.0, tutto su 70.0.", fw: null },
  { id: "wp-a2", category: "work-panel", label: "A_2", unit: "Deg", min: "0.0", max: "70.0", meaning: "Gradi di inclinazione sensore angolare SX (Gambe Testa) — Tutto giù 0.0, tutto su 70.0.", fw: null },
  { id: "wp-pr1", category: "work-panel", label: "PR_1", unit: "Bar", min: "0", max: null, meaning: "Sensore di pressione DX (Gambe Piedi).", fw: null },
  { id: "wp-pr2", category: "work-panel", label: "PR_2", unit: "Bar", min: "0", max: null, meaning: "Sensore di pressione SX (Gambe Testa).", fw: null },
  { id: "wp-m5", category: "work-panel", label: "M_5", unit: "A", min: "0", max: null, meaning: "Corrente motore Gambe Piedi.", fw: null },
  { id: "wp-m1", category: "work-panel", label: "M_1", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota Piedi DX.", fw: null },
  { id: "wp-m2", category: "work-panel", label: "M_2", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota Piedi SX.", fw: null },
  { id: "wp-m6", category: "work-panel", label: "M_6", unit: "A", min: "0", max: null, meaning: "Corrente motore Gambe Testa.", fw: null },
  { id: "wp-m3", category: "work-panel", label: "M_3", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota Testa DX.", fw: null },
  { id: "wp-m4", category: "work-panel", label: "M_4", unit: "A", min: "0", max: null, meaning: "Corrente motore Ruota Testa SX.", fw: null },
  { id: "wp-l3", category: "work-panel", label: "L_3", unit: "Cnt", min: null, max: null, meaning: "Sensore allineamento slitta/barella verticale.", fw: null },
  { id: "wp-l4", category: "work-panel", label: "L_4", unit: "Cnt", min: null, max: null, meaning: "Sensore distanza allineamento rostro/barella orizzontale.", fw: null },
  { id: "wp-has", category: "work-panel", label: "HAS", unit: "", min: null, max: null, meaning: "Stato allineamento orizzontale.", fw: null },
  { id: "wp-g1", category: "work-panel", label: "G_1", unit: "Deg", min: null, max: null, meaning: "Gradi inclinazione giroscopio — Testa su 80.5, Piedi su 14.1, Orizzontale 47.0.", fw: null },
  { id: "wp-bt1", category: "work-panel", label: "BT_1", unit: "%", min: "0", max: "100", meaning: "Livello di carica batteria.", fw: null },
  { id: "wp-linked", category: "work-panel", label: "LINKED", unit: "", min: null, max: null, meaning: "Stato macchina.", fw: null },
  { id: "wp-r1", category: "work-panel", label: "R_1", unit: "On/off", min: null, max: null, meaning: "Reed magnetico sfera.", fw: null },
  { id: "wp-r2", category: "work-panel", label: "R_2", unit: "On/off", min: null, max: null, meaning: "Reed magnetico 10g.", fw: null },
  { id: "wp-r3", category: "work-panel", label: "R_3", unit: "On/off", min: null, max: null, meaning: "Reed magnetico barelli.", fw: null },
  { id: "wp-fc1", category: "work-panel", label: "FC_1", unit: "On/off", min: null, max: null, meaning: "Micro finecorsa orizzontale.", fw: null },
  { id: "wp-fc2", category: "work-panel", label: "FC_2", unit: "On/off", min: null, max: null, meaning: "Micro finecorsa verticale.", fw: null },
  { id: "wp-l1", category: "work-panel", label: "L_1", unit: "On/off", min: null, max: null, meaning: "Fotocellula presenza piano.", fw: null },
  { id: "wp-l2", category: "work-panel", label: "L_2", unit: "On/off", min: null, max: null, meaning: "Fotocellula catarifrangente slitta.", fw: null },
  { id: "wp-cs1", category: "work-panel", label: "CS_1", unit: "On/off", min: null, max: null, meaning: "Costa sensibile DX e SX.", fw: null },
  { id: "wp-c2", category: "work-panel", label: "C_2", unit: "On/off", min: null, max: null, meaning: "Thumbwheel.", fw: null },
  { id: "wp-c3", category: "work-panel", label: "C_3", unit: "On/off", min: null, max: null, meaning: "Pulsante carico.", fw: null },
  { id: "wp-c4", category: "work-panel", label: "C_4", unit: "On/off", min: null, max: null, meaning: "Pulsante scarico.", fw: null },
  { id: "wp-at1", category: "work-panel", label: "Cmd AT_1", unit: "On/off", min: null, max: null, meaning: "Comando attuatore verticale.", fw: null },
  { id: "wp-at2", category: "work-panel", label: "Cmd AT_2", unit: "On/off", min: null, max: null, meaning: "Comando attuatore orizzontale.", fw: null },
  { id: "wp-cmdm5", category: "work-panel", label: "Cmd M_5", unit: "On/off", min: "0", max: "4000", meaning: "Comando motore Gambe Piedi.", fw: null },
  { id: "wp-m5c", category: "work-panel", label: "M_5", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Gambe Piedi.", fw: null },
  { id: "wp-cmdm6", category: "work-panel", label: "Cmd M_6", unit: "On/off", min: "0", max: "4000", meaning: "Comando motore Gambe Testa.", fw: null },
  { id: "wp-m6c", category: "work-panel", label: "M_6", unit: "°C", min: "0", max: null, meaning: "Temperatura motore Gambe Testa.", fw: null },
  { id: "wp-loadlvla2", category: "work-panel", label: "Load Lvl A_2", unit: "Deg", min: "10.0", max: "70.0", meaning: "Altezza di carico salvata della Gamba Testa.", fw: null },
  { id: "wp-loadlvla1", category: "work-panel", label: "Load Lvl A_1", unit: "Deg", min: "10.0", max: "70.0", meaning: "Altezza di carico salvata della Gamba Piedi.", fw: null },

  // --- Rostro ---------------------------------------------------------
  { id: "ro-at1a", category: "rostro", label: "AT_1", unit: "A", min: "0", max: null, meaning: "Corrente attuatore verticale.", fw: null },
  { id: "ro-at2a", category: "rostro", label: "AT_2", unit: "A", min: "0", max: null, meaning: "Corrente attuatore orizzontale.", fw: null },
  { id: "ro-l3", category: "rostro", label: "L_3", unit: "Cnt", min: null, max: null, meaning: "Sensore allineamento slitta/barella verticale.", fw: null },
  { id: "ro-l4", category: "rostro", label: "L_4", unit: "Cnt", min: null, max: null, meaning: "Sensore allineamento rostro/barella orizzontale.", fw: null },
  { id: "ro-at1p", category: "rostro", label: "AT_1", unit: "%", min: null, max: null, meaning: "Posizione attuale AT_1.", fw: null },
  { id: "ro-at2p", category: "rostro", label: "AT_2", unit: "%", min: null, max: null, meaning: "Posizione attuale AT_2.", fw: null },
  { id: "ro-workat1", category: "rostro", label: "Work AT_1", unit: "%", min: "6.5", max: "10.5", meaning: "Posizione impostata lavoro AT_1.", fw: null },
  { id: "ro-idleat1", category: "rostro", label: "Idle AT_1", unit: "%", min: "6.5", max: "10.5", meaning: "Posizione impostata riposo AT_1.", fw: null },
  { id: "ro-workat2", category: "rostro", label: "Work AT_2", unit: "%", min: "6.5", max: "10.5", meaning: "Posizione impostata lavoro AT_2.", fw: null },
  { id: "ro-idleat2", category: "rostro", label: "Idle AT_2", unit: "%", min: "6.5", max: "10.5", meaning: "Posizione impostata riposo AT_2.", fw: null },
  { id: "ro-r1", category: "rostro", label: "R_1", unit: "On/off", min: null, max: null, meaning: "Reed magnetico sfera.", fw: null },
  { id: "ro-r2", category: "rostro", label: "R_2", unit: "On/off", min: null, max: null, meaning: "Reed magnetico 10g.", fw: null },
  { id: "ro-fc1", category: "rostro", label: "FC_1", unit: "On/off", min: null, max: null, meaning: "Micro finecorsa orizzontale.", fw: null },
  { id: "ro-fc2", category: "rostro", label: "FC_2", unit: "On/off", min: null, max: null, meaning: "Micro finecorsa verticale.", fw: null },
  { id: "ro-l1", category: "rostro", label: "L_1", unit: "On/off", min: null, max: null, meaning: "Fotocellula presenza piano.", fw: null },
  { id: "ro-l2", category: "rostro", label: "L_2", unit: "On/off", min: null, max: null, meaning: "Fotocellula catarifrangente slitta.", fw: null }
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
  { id: "parametri", label: "Parametri", icon: "params", kind: "paramscreen" },
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

/* ---------------------------------------------------------------------
   ICONE REALI DEL PRODOTTO
   Man mano che mi mandi le icone vere (foto/screenshot del pulsante),
   le salvo in assets/icons/ e aggiungo una riga qui con la stessa chiave
   usata in SIMULATOR_MENU (icon: "..."). Finché una chiave non è presente
   qui, il simulatore usa l'icona SVG generica di riserva.
   ------------------------------------------------------------------- */
const SIMULATOR_ICON_IMAGES = {
  back: "assets/icons/back.png",
  workpanel: "assets/icons/workpanel.png",
  params: "assets/icons/params.png",
  faults: "assets/icons/faults.png",
  power: "assets/icons/power.png",
  compass: "assets/icons/calibration.png",
  motor: "assets/icons/motor.png",
  rostro: "assets/icons/rostro.png",
  hmi: "assets/icons/hmi.png"
};

/* ---------------------------------------------------------------------
   MAPPA COMPONENTI — "Legenda utenze" (R00 del 16/06/2026)
   UTENZE: dizionario globale id -> descrizione (indipendente dalla vista:
   uno stesso componente può comparire, ed essere cliccabile, in più viste).
   ------------------------------------------------------------------- */
const UTENZE = {
  C_5:  "TELECAMERA",
  LD_3: "SCHEDA LUCE FRONTALE - FISSA",
  L_1:  "FOTOCELLULA PRESENZA PIANO (ON/OFF)",
  L_2:  "FOTOCELLULA SLITTA (CATARIFRANGENTE) (ON/OFF)",
  L_3:  "SENSORE DISTANZA - ALLINEAMENTO SLITTA/BARELLA VERTICALE",
  AT_1: "SERVOMOTORE SBLOCCO SLITTA - PERNI VERTICALI",
  AT_2: "SERVOMOTORE SBLOCCO SFERA - PERNO ORIZZONTALE",
  FC_1: "MICRO FINECORSA ORIZZONTALE",
  FC_2: "MICRO FINECORSA VERTICALE",
  L_4:  "SENSORE DISTANZA ALLINEAMENTO ROSTRO/BARELLA ORIZZONTALE",
  R_1:  "REED MAGNETICO SFERA",
  C_1:  "DISPLAY LCD 7\"",
  C_2:  "THUMBWHEEL",
  C_3:  "PULSANTE - CARICO",
  C_4:  "PULSANTE - SCARICO",
  CS_1: "COSTA SENSIBILE DX e SX",
  EV_1: "ELETTROVALVOLA LATO DX (GAMBA PIEDI)",
  EV_2: "ELETTROVALVOLA LATO SX (GAMBA TESTA)",
  M_5:  "MOTORE BRUSHLESS GAMBE POSTERIORI (POS. ANTERIORE)",
  M_6:  "MOTORE BRUSHLESS GAMBE ANTERIORI (POS. POSTERIORE)",
  LD_1: "SCHEDA LUCE DX - FISSA",
  LD_2: "SCHEDA LUCE SX - FISSA",
  PR_1: "SENSORE DI PRESSIONE LATO DX (GAMBA PIEDI)",
  PR_2: "SENSORE DI PRESSIONE LATO SX (GAMBA TESTA)",
  R_3:  "REED MAGNETICO BARELLINO",
  R_2:  "REED MAGNETICO 10G",
  RF_1: "LETTORE RFID",
  A_1:  "SENSORE ANGOLARE LATO DX (GAMBA PIEDI)",
  A_2:  "SENSORE ANGOLARE LATO SX (GAMBA TESTA)",
  B_1:  "SEGNALATORE ACUSTICO",
  BT_1: "BATTERIA",
  F_1:  "FRENO PIEDE POSTERIORE DX",
  F_3:  "FRENO PIEDE ANTERIORE DX",
  F_2:  "FRENO PIEDE POSTERIORE SX",
  F_4:  "FRENO PIEDE ANTERIORE SX",
  G_1:  "INCLINOMETRO - GIROSCOPIO",
  M_1:  "MOTORE BRUSHLESS PIEDE POST. DX",
  M_3:  "MOTORE BRUSHLESS PIEDE ANT. DX",
  M_2:  "MOTORE BRUSHLESS PIEDE POST. SX",
  M_4:  "MOTORE BRUSHLESS PIEDE ANT. SX",
  PO_1: "POTENZIOMETRO POS PIEDE POSTERIORE DX",
  PO_3: "POTENZIOMETRO POS PIEDE ANTERIORE DX",
  PO_2: "POTENZIOMETRO POS PIEDE POSTERIORE SX",
  PO_4: "POTENZIOMETRO POS PIEDE ANTERIORE SX"
};

const SENSOR_DETAILS = {
  R_1: { cavo: "DIS0019098 - Reed 1", tipo: "Magnetico", intro: "Segnala che la sfera è posizionata correttamente all'interno della slitta superiore del rostro.", bullets: ["Consenso discesa: autorizza lo SPARK ad abbassarsi fino a raggiungere FC_1.", "Vincolo di sicurezza: se R_1 si disattiva in qualsiasi posizione del carico (a causa dell'allontanamento del magnete dalla slitta superiore), interrompe immediatamente qualsiasi operazione in corso."], dove: "Scheda rostro - DIS0016202" },
  R_2: { cavo: "DIS0019099 - Reed 2", tipo: "Magnetico", intro: "Segnala che i ganci 10G (sistema di aggancio lato rostro) sono correttamente chiusi e impegnati.", bullets: ["Display: quando attivo, compare il lucchetto verde \"10G\" sull'HMI.", "Logica stati: atteso nello stato L_W_SLED_POS_3 (attesa reed 2 attivo – ganci 10G) durante il ciclo di carico."], dove: "Scheda rostro - DIS0016202" },
  R_3: { cavo: "DIS0019098", tipo: "Magnetico", intro: "Segnala che entrambi i ganci dedicati al vincolo del barellino sono correttamente chiusi.", bullets: ["Display: quando entrambi i reed R_3 sono attivi, si attiva il lucchetto verde del barellino sull'HMI"], dove: "Scheda gateway - DIS0020986" },
  FC_1: { cavo: "DIS0019100 - Fine corsa 1", tipo: "Meccanico", intro: "Segnala che lo SPARK si è abbassato fino a raggiungere la posizione orizzontale desiderata per iniziare la fase di carico.", bullets: ["Logica stati: è il target di discesa durante L_W_LINK_TOUCH_H (attesa pressione switch orizzontale). Una volta premuto, la macchina procede alla discesa verticale verso FC_2."], dove: "Scheda rostro - DIS0016202" },
  FC_2: { cavo: "DIS0019101- Fine corsa 2", tipo: "Meccanico", intro: "Segnala che lo SPARK ha raggiunto il fine corsa meccanico verticale.", bullets: ["Consenso discesa verso R_1: una volta attivato FC_2, la macchina ha il consenso per abbassarsi ulteriormente fino a sentire R_1.", "Logica stati: è il target di discesa durante L_W_LINK_TOUCH_V (scende automaticamente fino alla pressione switch verticale)."], dove: "Scheda rostro - DIS0016202" },
  L_1: { cavo: "DIS0019382 - Laser 1 (SENDISLAS)", tipo: "Laser ON - OFF", intro: "Fotocellula di presenza piano: rileva la presenza della slitta intermedia nella zona del rostro.", bullets: ["Quando rileva la slitta, disattiva il servomotore AT_1 (sblocco slitta – perni verticali).", "Logica stati: durante L_W_SLED_POS_1 la macchina attende che L_1 venga disattivato (slitta non più rilevata) per poi procedere a disattivare i perni verticali. Durante U_W_POS_1 attende che L_1 sia disattivato per passare alla discesa gambe lato testa."], dove: "Scheda rostro - DIS0016202" },
  L_2: { cavo: "DIS0019026 - Laser 2 ", tipo: "Laser sensore striscia", intro: "Fotocellula catarifrangente per rilevamento della striscia riflettente sulla slitta.", bullets: ["In fase di CARICO: quando viene impegnato dalla striscia, comanda il sollevamento delle gambe lato piedi.", "In fase di SCARICO: quando il segnale della striscia non è più rilevato, comanda l'abbassamento delle gambe lato piedi.", "Logica stati: durante L_W_SLED_POS_2 la macchina attende che L_2 venga attivato per procedere al sollevamento gambe lato piedi (L_W_F_LEG_UP). Durante U_W_POS_2 attende che L_2 venga attivato prima di attivare la discesa gambe lato piedi."], dove: "Scheda rostro - DIS0016202" },
  L_3: { cavo: "DIS0019383 - Laser 3 (SENDISLAS30200)", tipo: "Laser distanza ", intro: "Sensore di distanza per il controllo in continuo dell'allineamento verticale tra la barella e la slitta.", bullets: ["Allineamento: verifica in continuo l'inclinazione della barella rispetto alla slitta e comanda le gambe lato piedi per mantenere l'allineamento.", "Logica stati: attivo durante L_W_ADJ_LVL_LEG_F: la macchina si porta al valore laser impostato come parametro muovendo le gambe lato piedi; una volta allineata registra l'angolo HMI e lo mantiene attivando i perni verticali del rostro."], dove: "Scheda rostro - DIS0016202" },
  L_4: { cavo: "(SENDISLAS30200)", tipo: "Laser distanza ", intro: "Sensore di distanza per il controllo in continuo dell'allineamento orizzontale della barella.", bullets: ["Funzione: verifica che il carico avvenga in modo dritto, controllando l'allineamento orizzontale barella/rostro durante la fase di avvicinamento"], dove: "Scheda display - DIS0016201" },
  PO_1: { cavo: "DIS0019110", tipo: "Potenziometro lineare", intro: "Misurano la posizione angolare del piede rispetto alla gamba sul lato DX.", bullets: ["Riferimento: i potenziometri prendono riferimento dal sensore angolare (A_1 e A_2) presente nelle gambe per garantire l'allineamento piedi/gambe.", "Utilizzo: la posizione letta dai potenziometri è usata dal controllo motori DX (M_1, M_3) per il posizionamento preciso dei piedi durante tutte le fasi di carico/scarico e orizzontalizzazione."], dove: "Schede motori DX e SX - DIS0016204" },
  PO_2: { cavo: "DIS0019110", tipo: "Potenziometro lineare", intro: "Misurano la posizione angolare del piede rispetto alla gamba sul lato DX.", bullets: ["Riferimento: i potenziometri prendono riferimento dal sensore angolare (A_1 e A_2) presente nelle gambe per garantire l'allineamento piedi/gambe.", "Utilizzo: la posizione letta dai potenziometri è usata dal controllo motori DX (M_1, M_3) per il posizionamento preciso dei piedi durante tutte le fasi di carico/scarico e orizzontalizzazione."], dove: "Schede motori DX e SX - DIS0016204" },
  PO_3: { cavo: "DIS0019110", tipo: "Potenziometro lineare", intro: "Misurano la posizione angolare del piede rispetto alla gamba sul lato DX.", bullets: ["Riferimento: i potenziometri prendono riferimento dal sensore angolare (A_1 e A_2) presente nelle gambe per garantire l'allineamento piedi/gambe.", "Utilizzo: la posizione letta dai potenziometri è usata dal controllo motori DX (M_1, M_3) per il posizionamento preciso dei piedi durante tutte le fasi di carico/scarico e orizzontalizzazione."], dove: "Schede motori DX e SX - DIS0016204" },
  PO_4: { cavo: "DIS0019110", tipo: "Potenziometro lineare", intro: "Misurano la posizione angolare del piede rispetto alla gamba sul lato DX.", bullets: ["Riferimento: i potenziometri prendono riferimento dal sensore angolare (A_1 e A_2) presente nelle gambe per garantire l'allineamento piedi/gambe.", "Utilizzo: la posizione letta dai potenziometri è usata dal controllo motori DX (M_1, M_3) per il posizionamento preciso dei piedi durante tutte le fasi di carico/scarico e orizzontalizzazione."], dove: "Schede motori DX e SX - DIS0016204" },
  A_1: { cavo: null, tipo: "Analogico", intro: "Misurano l'angolo delle gambe rispetto al riferimento orizzontale.", bullets: ["Riferimento per i potenziometri: i sensori angolari A_1 e A_2 sono il riferimento principale per l'allineamento piedi/gambe (utilizzati dai potenziometri).", "Logica stati: usati in HEAD_DOWN e FEET_DOWN per determinare quando la gamba raggiunge il punto minimo (angolo = 0); in HORIZONTAL e AUTO_HORIZONTAL per livellare le gambe allo stesso angolo (±1°); in L_W_H_LEG_UP e L_W_RECOVERY_H_LEG per verificare che le gambe lato testa abbiano raggiunto angolo = 0; durante U_W_LEG_DISCH_PRS per verificare che l'angolo sia maggiore dell'angolo di carico."], dove: "Schede motori DX e SX - DIS0016204" },
  A_2: { cavo: null, tipo: "Analogico", intro: "Misurano l'angolo delle gambe rispetto al riferimento orizzontale.", bullets: ["Riferimento per i potenziometri: i sensori angolari A_1 e A_2 sono il riferimento principale per l'allineamento piedi/gambe (utilizzati dai potenziometri).", "Logica stati: usati in HEAD_DOWN e FEET_DOWN per determinare quando la gamba raggiunge il punto minimo (angolo = 0); in HORIZONTAL e AUTO_HORIZONTAL per livellare le gambe allo stesso angolo (±1°); in L_W_H_LEG_UP e L_W_RECOVERY_H_LEG per verificare che le gambe lato testa abbiano raggiunto angolo = 0; durante U_W_LEG_DISCH_PRS per verificare che l'angolo sia maggiore dell'angolo di carico."], dove: "Schede motori DX e SX - DIS0016204" },
  PR_1: { cavo: null, tipo: "Analogico", intro: "Misurano la pressione idraulica nel sistema delle gambe.", bullets: ["Logica stati: durante U_W_LEG_DISCH_PRS la macchina attende che la pressione superi 10 bar (e che l'angolo superi la soglia prevista) per confermare il contatto con il piano e procedere alla registrazione dell'angolo di inclinazione della slitta.", "Controllo in U_W_DIS_LINK: verifica che la pressione sia maggiore di un valore X prima di procedere allo sgancio della slitta.", "Avvio controllo pressione: si attiva all'inizio di U_W_LEG_DWN_F."], dove: "Schede motori DX e SX - DIS0016204" },
  PR_2: { cavo: null, tipo: "Analogico", intro: "Misurano la pressione idraulica nel sistema delle gambe.", bullets: ["Logica stati: durante U_W_LEG_DISCH_PRS la macchina attende che la pressione superi 10 bar (e che l'angolo superi la soglia prevista) per confermare il contatto con il piano e procedere alla registrazione dell'angolo di inclinazione della slitta.", "Controllo in U_W_DIS_LINK: verifica che la pressione sia maggiore di un valore X prima di procedere allo sgancio della slitta.", "Avvio controllo pressione: si attiva all'inizio di U_W_LEG_DWN_F."], dove: "Schede motori DX e SX - DIS0016204" },
};

/* Viste della mappa componenti. Ogni hotspot: {id, x, y} con x/y in
   percentuale rispetto all'immagine (0-100), per restare allineati
   anche con zoom/pan. */
const MAP_VIEWS = [
  {
    id: "rostro-1", label: "Rostro (1/2)", image: "assets/utenze/rostro-1.png",
    hotspots: [
      { id: "C_5", x: 72.9, y: 11.1 },
      { id: "LD_3", x: 71.3, y: 21.8 },
      { id: "L_1", x: 23.3, y: 58.0 },
      { id: "L_3", x: 43.8, y: 59.0 }
    ]
  },
  {
    id: "rostro-2", label: "Rostro (2/2)", image: "assets/utenze/rostro-2.png",
    hotspots: [
      { id: "FC_2", x: 33.0, y: 33.1 },
      { id: "L_4", x: 52.5, y: 45.4 },
      { id: "FC_1", x: 75.9, y: 46.6 },
      { id: "AT_1", x: 33.6, y: 57.2 },
      { id: "AT_2", x: 56.1, y: 68.4 },
      { id: "R_1", x: 16.1, y: 76.4 }
    ]
  },
  {
    id: "alto", label: "Alto", image: "assets/utenze/alto.png",
    hotspots: [
      { id: "LD_2", x: 52.6, y: 10.2 },
      { id: "R_3", x: 35.9, y: 33.1 },
      { id: "R_3", x: 70.5, y: 31.7 },
      { id: "EV_2", x: 45.2, y: 34.1 },
      { id: "M_6", x: 45.2, y: 46.1 },
      { id: "CS_1", x: 9.0, y: 35.1 },
      { id: "C_2", x: 17.4, y: 35.1 },
      { id: "PR_2", x: 53.6, y: 40.0 },
      { id: "LD_3", x: 86.8, y: 51.5 },
      { id: "CS_1", x: 9.0, y: 51.8 },
      { id: "C_1", x: 17.5, y: 51.8 },
      { id: "C_4", x: 13.4, y: 67.5 },
      { id: "C_3", x: 22.0, y: 67.5 },
      { id: "LD_1", x: 52.6, y: 92.6 },
      { id: "L_2", x: 63.9, y: 37.5 },
      { id: "RF_1", x: 64.2, y: 45.2 },
      { id: "R_2", x: 71.2, y: 44.2 },
      { id: "R_2", x: 71.5, y: 53.8 },
      { id: "PR_1", x: 51.2, y: 60.6 },
      { id: "M_5", x: 60.2, y: 56.7 },
      { id: "EV_1", x: 60.2, y: 65.4 }
    ]
  },
  {
    id: "lato-dx", label: "Lato DX", image: "assets/utenze/lato-dx.png",
    hotspots: [
      { id: "M_5", x: 60.0, y: 7.3 },
      { id: "EV_1", x: 60.0, y: 13.9 },
      { id: "LD_3", x: 91.3, y: 8.1 },
      { id: "A_1", x: 48.6, y: 11.1 },
      { id: "LD_1", x: 48.6, y: 17.7 },
      { id: "G_1", x: 8.3, y: 11.3 },
      { id: "R_2", x: 70.2, y: 15.0 },
      { id: "BT_1", x: 16.3, y: 21.2 },
      { id: "B_1", x: 48.8, y: 24.6 },
      { id: "F_1", x: 32.8, y: 51.9 },
      { id: "F_3", x: 64.7, y: 52.0 },
      { id: "PO_1", x: 27.1, y: 58.8 },
      { id: "PO_3", x: 70.6, y: 58.8 },
      { id: "M_1", x: 23.5, y: 65.6 },
      { id: "M_3", x: 74.2, y: 65.6 }
    ]
  },
  {
    id: "lato-sx", label: "Lato SX", image: "assets/utenze/lato-sx.png",
    hotspots: [
      { id: "M_6", x: 62.8, y: 10.6 },
      { id: "EV_2", x: 62.8, y: 17.8 },
      { id: "R_3", x: 72.3, y: 10.6 },
      { id: "R_3", x: 32.5, y: 10.8 },
      { id: "LD_3", x: 6.7, y: 11.4 },
      { id: "A_2", x: 51.1, y: 14.7 },
      { id: "LD_2", x: 51.1, y: 21.9 },
      { id: "L_2", x: 41.6, y: 15.9 },
      { id: "R_2", x: 29.0, y: 19.0 },
      { id: "BT_1", x: 83.4, y: 25.0 },
      { id: "F_4", x: 34.7, y: 59.4 },
      { id: "F_2", x: 67.7, y: 59.4 },
      { id: "PO_4", x: 28.4, y: 66.9 },
      { id: "PO_2", x: 73.8, y: 66.9 },
      { id: "M_4", x: 25.1, y: 74.2 },
      { id: "M_2", x: 77.5, y: 74.3 }
    ]
  }
];

const PARAMETERS = [
  {
    name: "MAX MT SPEED", default: "3500", max: "4000", min: "500", res: "1", unit: "rpm",
    desc: [
      { t: "p", h: "Questo parametro rappresenta la velocità di rotazione massima dei motori per il movimento delle gambe (lato testa e piedi) durante la movimentazione libera (FREE, rostro non vincolato alla slitta)." }
    ]
  },
  {
    name: "MAX SPEED MT HEAD UP", default: "3000", max: "4000", min: "500", res: "1", unit: "rpm",
    desc: [
      { t: "p", h: "Rappresenta la velocità di movimentazione delle gambe lato testa in fase di salita durante il carico della barella." }
    ]
  },
  {
    name: "MAX SPEED MT HEAD DOWN", default: "3000", max: "4000", min: "500", res: "1", unit: "rpm",
    desc: [
      { t: "p", h: "Rappresenta la velocità di riferimento per il movimento delle gambe lato testa durante la fase di scarico della barella." },
      { t: "p", h: "Da questo valore si ottengono altre velocità di riferimento per le gambe lato testa. Sono calcolate come percentuali dell'80% e del 50% della suddetta velocità." },
      { t: "p", h: "L'80% della MAX SPEED MT HEAD DOWN è utilizzata per muovere le gambe verso il basso durante:" },
      { t: "ul", items: ["La fase di livellamento in cui la barella equalizza gli angoli delle gambe: abbassa le gambe del lato più vicino al suolo.", "La fase di scarico: dopo che il laser 1 si disimpegna fino a che le ruote raggiungono il suolo (touch down) e dopo lo sgancio dalla slitta con l'attuatore orizzontale."] },
      { t: "p", h: "Il 50% della MAX SPEED MT HEAD DOWN è utilizzata quando necessario (angolo gambe lato testa &lt; angolo di carico lato testa) per raggiungere l'angolo di carico memorizzato abbassando le gambe lato testa." }
    ]
  },
  {
    name: "MAX SPEED MT FEET UP", default: "3000", max: "4000", min: "500", res: "1", unit: "rpm",
    desc: [
      { t: "p", h: "Rappresenta la velocità di movimentazione delle gambe lato piedi in fase di salita durante il carico della barella, da quando i laser 1 e 2 sono impegnati a quando le gambe lato piedi sono completamente salite." }
    ]
  },
  {
    name: "MAX SPEED MT FEET DOWN", default: "3000", max: "4000", min: "500", res: "1", unit: "rpm",
    desc: [
      { t: "p", h: "Rappresenta la velocità di riferimento per il movimento delle gambe lato piedi durante la fase di scarico della barella." },
      { t: "p", h: "Da questo valore si ottengono altre velocità di riferimento per le gambe lato piedi. Sono calcolate come percentuali dell'80% e del 50% della suddetta velocità." },
      { t: "p", h: "L'80% della MAX SPEED MT FEET DOWN è utilizzata per muovere le gambe verso il basso durante:" },
      { t: "ul", items: ["La fase di livellamento in cui la barella equalizza gli angoli delle gambe: abbassa le gambe del lato più vicino al suolo."] },
      { t: "p", h: "Il 50% della MAX SPEED MT FEET DOWN è utilizzata quando necessario (angolo gambe lato piedi &lt; angolo di carico lato piedi) per raggiungere l'angolo di carico memorizzato abbassando le gambe lato piedi." }
    ]
  },
  {
    name: "START STEP PLANE DWN", default: "15", max: "50", min: "0", res: "1", unit: "step/10ms",
    desc: [
      { t: "p", h: "Questo parametro permette di regolare <strong>l'accelerazione</strong> (gradino positivo, START) delle gambe in fase di <strong>discesa</strong> del piano barella (PLANE DOWN). Più è alto il valore del parametro e maggiore sarà la velocità con cui le valvole proporzionali si apriranno per raggiungere il target (% corrente) impostato dall'HMI." }
    ]
  },
  {
    name: "STOP STEP PLANE DWN", default: "10", max: "50", min: "0", res: "1", unit: "step/10ms",
    desc: [
      { t: "p", h: "Questo parametro permette di regolare la <strong>decelerazione</strong> delle gambe (gradino negativo, STOP) in fase di <strong>discesa</strong> del piano barella (PLANE DOWN). Più è alto il valore del parametro e maggiore sarà la velocità con cui le valvole proporzionali si chiuderanno per raggiungere il target (% corrente) impostato dall'HMI." },
      { t: "p", h: "Il sistema di controllo prevede un filtro che temporalmente addolcisce le variazioni del riferimento delle valvole, ciò consente di avere variazioni di velocità di discesa più o meno dolci." }
    ]
  },
  {
    name: "START STEP PLANE UP", default: "100", max: "500", min: "0", res: "1", unit: "step/10ms",
    desc: [
      { t: "p", h: "Questo parametro permette di regolare <strong>l'accelerazione</strong> (gradino positivo, START) delle gambe in fase di <strong>salita</strong> del piano barella (PLANE UP). Più è alto il valore del parametro e maggiore sarà la velocità con cui i motori accelereranno per raggiungere il target (rpm) impostato dall'HMI." }
    ]
  },
  {
    name: "STOP STEP PLANE UP", default: "80", max: "500", min: "0", res: "1", unit: "step/10ms",
    desc: [
      { t: "p", h: "Questo parametro permette di regolare la <strong>decelerazione</strong> delle gambe (gradino negativo, STOP) in fase di <strong>salita</strong> del piano barella (PLANE UP). Più è alto il valore del parametro e maggiore sarà la velocità con cui i motori rallenteranno per raggiungere il target (rpm) impostato dall'HMI." },
      { t: "p", h: "Il sistema di controllo prevede un filtro che temporalmente addolcisce le variazioni del riferimento di velocità dei motori, ciò consente di avere variazioni di velocità di salita più o meno dolci." },
      { t: "img", src: "assets/params/filtraggio-temporale.png", caption: "Filtraggio temporale del comando delle gambe (vale per tutti e 4 i parametri START/STOP STEP PLANE)" }
    ]
  },
  {
    name: "HEAVY LOAD SPEED", default: "1000", max: "4000", min: "500", res: "1", unit: "rpm",
    desc: [
      { t: "p", h: "Al fine di rendere più sicura la movimentazione a carichi elevati è stata implementata una funzione lineare che riduce la velocità massima dei motori all'aumentare del carico." },
      { t: "img", src: "assets/params/velocita-pressione.png", caption: "Velocità massima in funzione della pressione media" },
      { t: "p", h: "I due parametri HEAVY LOAD SPEED e HEAVY LOAD PRESS individuano un punto nel piano cartesiano velocità/pressione idraulica (vedi figura) che permette di stabilire quanto diminuisce la velocità massima all'aumentare della pressione media dell'olio idraulico. In questo modo è possibile regolare la pendenza della retta." },
      { t: "p", h: "In riferimento alla figura, V0 = 4000 rpm e P0 = 10 bar, mentre V1 = HEAVY LOAD SPEED e P1 = HEAVY LOAD PRESS." },
      { t: "p", h: "Questa funzione segue il seguente comportamento:" },
      { t: "formula", lines: ["V(p) = m·p + V0   se P0 < p < P1   dove m = (V1 − V0) / (P1 − P0)", "V(p) = V0   se p ≤ P0", "V(p) = V1   se p ≥ P1"] }
    ]
  },
  {
    name: "HEAVY LOAD PRESS", default: "80", max: "150", min: "10", res: "1", unit: "bar",
    desc: [
      { t: "p", h: "Al fine di rendere più sicura la movimentazione a carichi elevati è stata implementata una funzione lineare che riduce la velocità massima dei motori all'aumentare del carico." },
      { t: "img", src: "assets/params/velocita-pressione.png", caption: "Velocità massima in funzione della pressione media" },
      { t: "p", h: "I due parametri HEAVY LOAD SPEED e HEAVY LOAD PRESS individuano un punto nel piano cartesiano velocità/pressione idraulica (vedi figura) che permette di stabilire quanto diminuisce la velocità massima all'aumentare della pressione media dell'olio idraulico. In questo modo è possibile regolare la pendenza della retta." },
      { t: "p", h: "In riferimento alla figura, V0 = 4000 rpm e P0 = 10 bar, mentre V1 = HEAVY LOAD SPEED e P1 = HEAVY LOAD PRESS." },
      { t: "p", h: "Questa funzione segue il seguente comportamento:" },
      { t: "formula", lines: ["V(p) = m·p + V0   se P0 < p < P1   dove m = (V1 − V0) / (P1 − P0)", "V(p) = V0   se p ≤ P0", "V(p) = V1   se p ≥ P1"] }
    ]
  },
  {
    name: "ACT VER WORK POS", default: "10.7", max: "15.0", min: "6.5", res: "0.1", unit: "% dutycycle",
    desc: [
      { t: "p", h: "Questo parametro indica la quota di <strong>lavoro</strong> per l'attuatore verticale (AT_1), espressa in % del dutycycle del segnale di controllo dell'attuatore. L'attuatore verticale è in posizione di lavoro quando deve sganciare la slitta." }
    ]
  },
  {
    name: "ACT VER IDLE POS", default: "10.7", max: "15.0", min: "6.5", res: "0.1", unit: "% dutycycle",
    desc: [
      { t: "p", h: "Questo parametro indica la quota di <strong>riposo</strong> per l'attuatore verticale (AT_1), espressa in % del dutycycle del segnale di controllo dell'attuatore. L'attuatore verticale è in posizione di riposo quando <strong>non</strong> deve sganciare la slitta." }
    ]
  },
  {
    name: "ACT HOR WORK POS", default: "10.7", max: "15.0", min: "6.5", res: "0.1", unit: "% dutycycle",
    desc: [
      { t: "p", h: "Questo parametro indica la quota di <strong>lavoro</strong> per l'attuatore orizzontale (AT_2), espressa in % del dutycycle del segnale di controllo dell'attuatore. L'attuatore orizzontale è in posizione di lavoro quando deve liberare il rostro dalla slitta." }
    ]
  },
  {
    name: "ACT HOR IDLE POS", default: "10.7", max: "15.0", min: "6.5", res: "0.1", unit: "% dutycycle",
    desc: [
      { t: "p", h: "Questo parametro indica la quota di <strong>riposo</strong> per l'attuatore orizzontale (AT_2), espressa in % del dutycycle del segnale di controllo dell'attuatore. L'attuatore orizzontale è in posizione di riposo quando <strong>non</strong> deve liberare il rostro dalla slitta." }
    ]
  },
  {
    name: "LASER POS REF", default: "1380", max: "2000", min: "1000", res: "1", unit: "ADC counts",
    desc: [
      { t: "p", h: "Per assicurare che il piano della barella sia allineato a quello di carico è stato predisposto un laser analogico (L_3) che misura la distanza tra il rostro e il piano su cui scorre la slitta di carico. Il valore del parametro LASER POS REF è il valore del segnale generato da L_3 quando il piano barella è parallelo a quello di carico, espresso in conteggi della conversione da analogico a digitale (ADC counts). La risoluzione è di circa 0.05 mm a conteggio." },
      { t: "p", h: "Questo parametro è utilizzato in fase di carico per allineare il piano della barella al piano di carico: ciò avviene quando il rostro è vincolato alla slitta e le gambe lato testa sono completamente alzate. In questa situazione, modificando l'altezza da terra del lato piedi, il sistema osserva il segnale di L_3 cercando di raggiungere il valore impostato da LASER POS REF." },
      { t: "p", h: "Il sistema smetterà di inseguire il valore di riferimento se il valore assoluto dell'errore (L_3 − LASER POS REF) è inferiore a 15 conteggi (circa 0.57 mm)." },
      { t: "p", h: "Da prove sperimentali si è notata la necessità di compensare le flessioni della struttura della barella con carichi elevati; quindi è stata introdotta una <strong>funzione di correzione</strong> che, all'aumentare della pressione idraulica del lato piedi, riduce il riferimento dato da LASER POS REF." },
      { t: "p", h: "Nota: in questa situazione il lato testa è sollevato da terra con il rostro appoggiato alla slitta; per questa funzione la pressione di riferimento lato piedi è mediata su 50 punti campionati a 10ms." },
      { t: "p", h: "Se la pressione lato piedi è superiore a 25 bar, la suddetta funzione riduce il valore di riferimento di 6 conteggi (0.228 mm) ogni 10 bar, per un massimo di 150 conteggi (5.7 mm)." },
      { t: "p", h: "Siccome il valore massimo di pressione è 150 bar, la correzione massima sarà = [(150 − 25) × 0.6] × 0.038 = <strong>2.85 mm</strong>. Nota: il laser L_3 ha una risoluzione di 0.038 mm ogni conteggio." }
    ]
  },
  {
    name: "LASER UNLOAD DELTA", default: "50", max: "2000", min: "0", res: "1", unit: "ADC counts",
    desc: [
      { t: "p", h: "Questo valore viene utilizzato nella fase di scarico." },
      { t: "p", h: "Quando il laser digitale L_2 viene disimpegnato, le gambe lato piedi scendono fino a raggiungere il suolo (TOUCHDOWN); da questo punto in poi il movimento continua con lo scopo di alzare il lato piedi fino a che il valore di L_3 è ad una distanza (DELTA) dal suo <strong>minimo relativo</strong> pari o superiore al parametro LASER UNLOAD DELTA. Ciò ha lo scopo di portare il rostro in appoggio alla slitta sollevando i rulli lato piedi dal piano di carico: questo evita il salto verso il basso della barella quando la slitta viene sganciata ed estratta. Contemporaneamente, questo parametro aumenta l'inclinazione della barella per il resto della fase di scarico, per facilitarne l'estrazione." },
      { t: "p", h: "Cosa succede in fase di scarico: quando L_2 viene disimpegnato e il rostro si trova sollevato dal piano della slitta, i rulli del fondo lato piedi appoggiano al piano di carico e rappresentano il fulcro della leva di primo genere che ha come estremità la sfera del rostro e il lato piedi. Al termine del touchdown delle ruote lato piedi, il movimento delle gambe lato piedi non viene interrotto, in modo che la sfera del rostro si avvicini al piano della slitta fino a raggiungerlo e i rulli si allontanino dal piano di carico. Il sistema riconosce quando il fulcro passa alla sfera del rostro individuando il <strong>minimo relativo</strong> del segnale del laser L_3. Il movimento delle gambe lato piedi viene interrotto quando una delle due condizioni sopra descritte è soddisfatta." }
    ]
  },
  {
    name: "HORIZ ALIGN WINDOW", default: "300", max: "1000", min: "50", res: "1", unit: "ADC counts",
    desc: [
      { t: "p", h: "Parametro espresso in conteggi (ADC counts), è utilizzato per settare la tolleranza dell'allarme di disallineamento orizzontale, che si basa sulla misura del laser analogico orizzontale (L_4). Questo parametro indica quanto la misura L_4 può variare rispetto al valore di riferimento (HORIZ ALIGN CENTER) prima che si attivi il suddetto allarme." }
    ]
  },
  {
    name: "HORIZ ALIGN CENTER", default: "1000", max: "3000", min: "300", res: "1", unit: "ADC counts",
    desc: [
      { t: "p", h: "Parametro espresso in conteggi (ADC counts), è utilizzato per settare il valore del laser L_4 quando i due assi longitudinali della barella e della slitta di carico sono allineati. Questo parametro e quello HORIZ ALIGN WINDOW vengono utilizzati per gestire l'allarme di disallineamento orizzontale secondo questa logica:" },
      { t: "formula", lines: ["threshold_high = HORIZ ALIGN CENTER + HORIZ ALIGN WINDOW", "threshold_low  = HORIZ ALIGN CENTER − HORIZ ALIGN WINDOW", "se (value_L_4 < threshold_low) o (value_L_4 > threshold_high) → Allarme = ON", "altrimenti → Allarme = OFF"] }
    ]
  },
  {
    name: "UNLOAD INCLINATION OFFSET", default: null, max: null, min: null, res: null, unit: "",
    desc: [
      { t: "p", h: "Rappresenta il massimo angolo di alzata dal piano (misurato tramite il laser L_3) durante la fase di scarico." },
      { t: "p", h: "Nota: nel documento tecnico dei parametri HMI questo parametro risultava segnato come rimosso in una revisione precedente. Non avendo per ora i valori di default/min/max, sono mostrati vuoti: se mi fornisci quei dati li aggiungo." }
    ]
  },
  {
    name: "UNLINK ANGLE DIFF MAX", default: "5", max: "20", min: "0", res: "0.1", unit: "degree",
    desc: [
      { t: "p", h: "Questo parametro è utilizzato nella fase di scarico: quando le ruote delle gambe lato testa hanno raggiunto il suolo, il sistema controlla la differenza tra l'angolo gambe lato piedi e lato testa. Se la differenza tra i due è maggiore del parametro UNLINK ANGLE DIFF MAX, il sistema non procede con lo sgancio del rostro dalla slitta mediante l'attuatore orizzontale (ACT 2) e informa l'utente mediante un messaggio di errore (L200)." },
      { t: "p", h: "Quando questo avviene significa che le ruote lato testa sono appoggiate ad una superficie che è ad una quota maggiore rispetto a quella su cui appoggiano le ruote del lato piedi — con molta probabilità le ruote sono appoggiate ad un gradino, un marciapiede o un ostacolo non previsto. In queste condizioni, procedere con lo sgancio dalla slitta rappresenta un potenziale rischio di effettuare un brusco salto." }
    ]
  },
  {
    name: "POWER-OFF TIME", default: "1200", max: "32000", min: "0", res: "1", unit: "s",
    desc: [
      { t: "p", h: "È il tempo (secondi) che deve trascorrere dall'ultima interazione affinché il sistema si spenga autonomamente." },
      { t: "p", h: "Il valore 0 disabilita questa funzionalità." }
    ]
  },
  {
    name: "FREE WORK PRESS THR", default: "30", max: "150", min: "20", res: "1", unit: "bar",
    desc: [
      { t: "p", h: "Rappresenta il valore in bar della pressione idraulica media tra lato testa e lato piedi che permette di identificare se la barella è con paziente o senza paziente." }
    ]
  },
  {
    name: "LEG POSITION SENS MODEL", default: "1", max: "1", min: "0", res: "1", unit: "N.A.",
    desc: [
      { t: "p", h: "Identifica il tipo di sensore per misurare l'angolo delle gambe installato sul lato testa e piedi." },
      { t: "ul", items: ["0 = VERTI-X 05E6-709-221-202", "1 = RFD-4021-609-211-401"] }
    ]
  },
  {
    name: "MIN INCLINATION IMU ERR", default: "0.5", max: "2", min: "0", res: "0.1", unit: "degree",
    desc: [
      { t: "p", h: "Questo parametro viene utilizzato durante la fase di carico e scarico, quando la correzione dell'allineamento verticale del piano barella con quello di carico è affidata alla piattaforma inerziale (IMU)." },
      { t: "p", h: "Questo parametro rappresenta la tolleranza di correzione del suddetto allineamento: se il valore assoluto dell'errore di allineamento è inferiore a questo parametro, il sistema non correggerà l'altezza lato piedi." },
      { t: "p", h: "L'inclinazione della barella lungo l'asse longitudinale viene controllata dalla piattaforma inerziale (IMU) quando:" },
      { t: "ul", items: ["in carico, dopo che la slitta è stata sganciata (gambe lato testa completamente retratte e allineamento con laser concluso);", "in scarico, dopo che la slitta è stata sganciata, quindi è avvenuto il touchdown del lato piedi e si è conclusa la fase di allineamento in scarico portando la sfera del rostro in appoggio (vedi parametro LASER UNLOAD DELTA)."] }
    ]
  },
  {
    name: "ACTUATOR MOVING TIME", default: "0", max: "9.99", min: "0", res: "0.01", unit: "s",
    desc: [
      { t: "p", h: "Serve per indicare quanto tempo (secondi) occorre attendere dopo l'attivazione dell'attuatore <strong>orizzontale</strong> (AT_2) per considerarne conclusa la movimentazione (tempo di attuazione)." }
    ]
  },
  {
    name: "SWITCH RELEASE TIME", default: "0", max: "9.99", min: "0", res: "0.01", unit: "s",
    desc: [
      { t: "p", h: "Rappresenta il ritardo con cui il sistema considera il pulsante di carico o scarico rilasciato: se il rilascio del pulsante di carico o scarico avviene per un tempo inferiore a questo parametro, il sistema non lo considera." },
      { t: "p", h: "Serve per filtrare rilasci brevi, tipicamente non voluti, che possono generare stop fastidiosi delle fasi di carico o scarico." }
    ]
  },
  {
    name: "SW.REL. ALARM ENABLE", default: "0", max: "1", min: "0", res: "1", unit: "N.A.",
    desc: [
      { t: "p", h: "Permette di abilitare (1) o disabilitare (0) l'allarme di rilascio dei pulsanti di carico e scarico nelle fasi di carico e scarico." }
    ]
  },
  {
    name: "WEIGHT OFFSET", default: "32.42", max: "327.67", min: "-327.68", res: "0.01", unit: "N.A.",
    desc: [
      { t: "p", h: "Questi parametri sono utilizzati dalla funzione di calcolo del peso paziente (weight measure)." },
      { t: "p", h: "Servono per la formula che calcola il peso misurando la pressione idraulica (bar) lato testa e piedi, secondo la seguente formula:" },
      { t: "formula", lines: ["peso = [(pressione testa + pressione piedi) − WEIGHT OFFSET] × WEIGHT GAIN"] }
    ]
  },
  {
    name: "WEIGHT GAIN", default: "0.43", max: "327.67", min: "-327.68", res: "0.01", unit: "N.A.",
    desc: [
      { t: "p", h: "Questi parametri sono utilizzati dalla funzione di calcolo del peso paziente (weight measure)." },
      { t: "p", h: "Servono per la formula che calcola il peso misurando la pressione idraulica (bar) lato testa e piedi, secondo la seguente formula:" },
      { t: "formula", lines: ["peso = [(pressione testa + pressione piedi) − WEIGHT OFFSET] × WEIGHT GAIN"] }
    ]
  },
  {
    name: "SYSTEM SERIAL NUMBER", default: "0", max: "9999999", min: "0", res: "1", unit: "N.A.",
    desc: [
      { t: "p", h: "Rappresenta il numero seriale che identifica la barella." }
    ]
  },
  {
    name: "LOAD TOTAL CYCLES", default: "0", max: "9999999", min: "0", res: "1", unit: "N.A.",
    desc: [
      { t: "p", h: "Indica quanti cicli completi di <strong>carico</strong> sono stati effettuati dalla barella." }
    ]
  },
  {
    name: "UNLOAD TOTAL CYCLES", default: "0", max: "9999999", min: "0", res: "1", unit: "N.A.",
    desc: [
      { t: "p", h: "Indica quanti cicli completi di <strong>scarico</strong> sono stati effettuati dalla barella." }
    ]
  },
  {
    name: "PAIRING EDEN SN", default: "0", max: "9999999", min: "0", res: "1", unit: "N.A.",
    desc: [
      { t: "p", h: "Questo parametro permette di indicare il serial number del dispositivo EDEN BS8 a cui lo Spark deve collegarsi (bluetooth) per le operazioni di carico e scarico. Per disabilitare l'uso del dispositivo EDEN BS8 e di tutte le funzionalità relative, occorre impostare il serial number a 0: in questo caso lo Spark implementerà lo scarico e il carico nella modalità tradizionale." }
    ]
  },
  {
    name: "HIGH LOAD LEVEL ANGLE LEG", default: "75.0", max: "75.0", min: "60.0", res: "0.1", unit: "degree",
    desc: [
      { t: "p", h: "Rappresenta la soglia dell'angolo gambe oltre la quale il sistema disabilita alcuni controlli che impedirebbero lo scarico o il carico quando queste operazioni sono eseguite ad altezze vicine al limite massimo di estensione delle gambe. La fase di livellamento del lato piedi è bloccante per procedere con le operazioni di carico/scarico (vedi stati L_W_ADJ_LVL_LEG_F, U_W_POS_2, U_W_NO_BUMP): se le gambe lato piedi raggiungono il valore massimo, ad esempio a causa dell'estrema altezza a cui si trova il piano di carico, il sistema si bloccherebbe in attesa del livellamento del piano. Ma se il valore di questo parametro è inferiore al valore dell'angolo massimo raggiungibile dalle gambe (esempio: massimo raggiungibile di 69 gradi e HIGH LOAD LEVEL ANGLE LEG di 68.5) allora il sistema considererà comunque raggiunto il livellamento e procederà con le fasi successive." },
      { t: "p", h: "Se il valore di questo parametro è maggiore o uguale al valore massimo raggiungibile dall'angolo gambe, questa funzionalità di bypass verrà disabilitata; se invece si vuole abilitarla occorre impostare un valore leggermente inferiore al valore massimo raggiungibile (qualche decimo di grado in meno)." }
    ]
  },
  {
    name: "HIGH LOAD LEVEL WHEELS LEN", default: "50.0", max: "50.0", min: "44.0", res: "0.1", unit: "mm",
    desc: [
      { t: "p", h: "Rappresenta la soglia dell'estensione dell'attuatore di posizione ruote oltre la quale il sistema disabilita alcuni controlli che impedirebbero lo scarico o il carico quando queste operazioni sono eseguite ad altezze vicine al limite massimo di estensione delle gambe e degli attuatori delle ruote." },
      { t: "p", h: "Anche la lunghezza dell'attuatore di posizione delle ruote può bloccare l'estensione dell'attuatore delle gambe: siccome gli assi di rotazione orizzontale delle ruote devono essere mantenuti perpendicolari al terreno, se una o più ruote raggiungono la loro massima quota (45 mm), anche l'estensione delle gambe viene fermata. Se il carico e lo scarico avvengono con piani di carico inclinati, è possibile che alcuni attuatori della posizione delle ruote raggiungano il loro valore massimo e quindi impediscano il procedere delle operazioni (vedi stati L_W_ADJ_LVL_LEG_F, U_W_POS_2, U_W_NO_BUMP); ma se il valore di HIGH LOAD LEVEL WHEELS LEN è inferiore al valore di massima estensione (45 mm) (esempio: 44.5) allora il sistema considererà comunque raggiunto il livellamento e procederà con le fasi successive. Se invece si vuole mantenere disabilitata questa funzionalità, occorre impostare un valore maggiore o uguale a 45 mm." }
    ]
  },
  {
    name: "MAX LEG ANGLE", default: "69.0", max: "71.0", min: "68.0", res: "0.1", unit: "degree",
    desc: [
      { t: "p", h: "Indica il valore massimo dell'angolo raggiungibile dalle gambe. Va definito in fase di collaudo in modo da permettere la massima escursione ma, contemporaneamente, evitare che gli attuatori idraulici raggiungano il finecorsa alla massima estensione, con conseguente inutile e dannoso sforzo meccanico." }
    ]
  },
];

/* ---------------------------------------------------------------------
   SCHERMATA PARAMETRI DEL SIMULATORE (Pannello Spark)
   Come sul dispositivo reale: i parametri sono divisi in 2 pagine.
   I nomi devono corrispondere esattamente a "name" in PARAMETERS.
   ------------------------------------------------------------------- */
const PARAM_PAGES = {
  1: [
    "MAX MT SPEED", "ACT VER WORK POS", "ACT VER IDLE POS", "ACT HOR WORK POS",
    "ACT HOR IDLE POS", "LASER POS REF", "LASER UNLOAD DELTA", "UNLINK ANGLE DIFF MAX",
    "POWER-OFF TIME", "UNLOAD INCLINATION OFFSET", "MIN INCLINATION IMU ERR",
    "ACTUATOR MOVING TIME", "SWITCH RELEASE TIME", "WEIGHT OFFSET", "WEIGHT GAIN",
    "PAIRING EDEN SN", "HIGH LOAD LEVEL ANGLE LEG", "HIGH LOAD LEVEL WHEELS LEN", "MAX LEG ANGLE"
  ],
  2: [
    "MAX SPEED MT HEAD UP", "MAX SPEED MT HEAD DOWN", "MAX SPEED MT FEET UP", "MAX SPEED MT FEET DOWN",
    "START STEP PLANE DWN", "STOP STEP PLANE DWN", "START STEP PLANE UP", "STOP STEP PLANE UP",
    "HEAVY LOAD SPEED", "HEAVY LOAD PRESS", "HORIZ ALIGN WINDOW", "HORIZ ALIGN CENTER",
    "FREE WORK PRESS THR", "LEG POSITION SENS MODEL", "SW.REL. ALARM ENABLE",
    "SYSTEM SERIAL NUMBER", "LOAD TOTAL CYCLES", "UNLOAD TOTAL CYCLES", "TIME AND DATE"
  ]
};

/* Etichetta breve (come apparirebbe sull'HMI) mostrata sotto il nome nella
   schermata del simulatore. Fonte: documento riassuntivo parametri (1.pdf). */
const PARAM_SHORT_DESC = {
  "MAX MT SPEED": "Velocità di salita (RPM)",
  "MAX SPEED MT HEAD UP": "Velocità di salita gambe testa in carico (RPM)",
  "MAX SPEED MT HEAD DOWN": "Velocità di discesa gambe testa in scarico (RPM)",
  "MAX SPEED MT FEET UP": "Velocità di salita gambe piedi in carico (RPM)",
  "MAX SPEED MT FEET DOWN": "Velocità di discesa gambe piedi in scarico (RPM)",
  "START STEP PLANE DWN": "Rampa inizio discesa",
  "STOP STEP PLANE DWN": "Rampa fine discesa",
  "START STEP PLANE UP": "Rampa inizio salita",
  "STOP STEP PLANE UP": "Rampa fine salita",
  "HEAVY LOAD SPEED": "Velocità di riferimento con carico massimo (RPM)",
  "HEAVY LOAD PRESS": "Pressione di riferimento per taglio velocità (bar)",
  "ACT VER WORK POS": "Posizione di lavoro AT_1",
  "ACT VER IDLE POS": "Posizione di riposo AT_1",
  "ACT HOR WORK POS": "Posizione di lavoro AT_2",
  "ACT HOR IDLE POS": "Posizione di riposo AT_2",
  "LASER POS REF": "Distanza L_3 in posizione orizzontale",
  "LASER UNLOAD DELTA": "Valore di incremento L_3 per allineamento in scarico",
  "HORIZ ALIGN WINDOW": "Tolleranza di riferimento centraggio slitta (L_4)",
  "HORIZ ALIGN CENTER": "Posizione di riferimento centraggio slitta (L_4)",
  "UNLINK ANGLE DIFF MAX": "Differenza massima tra angolo gambe in scarico",
  "POWER-OFF TIME": "Tempo spegnimento automatico in s (0 = mai)",
  "FREE WORK PRESS THR": "Pressione di riferimento per determinare se c'è un paziente",
  "LEG POSITION SENS MODEL": "Cambia parametri in base al sensore utilizzato per le gambe",
  "UNLOAD INCLINATION OFFSET": "Massimo angolo di alzata dal piano in scarico (L_3)",
  "MIN INCLINATION IMU ERR": "Sensibilità compensazione in fase di scarico",
  "ACTUATOR MOVING TIME": "Tempo che AT_2 impiega per ritornare in posizione (in scarico)",
  "SWITCH RELEASE TIME": "Tempo tra rilascio fisico e rilascio logico pulsanti IN/OUT",
  "SW.REL. ALARM ENABLE": "Allarme rilascio pulsanti IN/OUT (1=ON / 0=OFF)",
  "WEIGHT OFFSET": "Offset di pressione (bar) per il calcolo del peso paziente",
  "WEIGHT GAIN": "Guadagno (gain) usato nella formula di calcolo del peso",
  "SYSTEM SERIAL NUMBER": "Matricola SPARK-UC",
  "LOAD TOTAL CYCLES": "Numero di cicli di carico",
  "UNLOAD TOTAL CYCLES": "Numero di cicli di scarico",
  "TIME AND DATE": "Impostazione data e ora del sistema"
};

const ERRORS = [
  { code: "L001", cat: "L", catLabel: "Ciclo carico/scarico", text: "CONTROLLO REED 1 AVVIO SCARICO FALLITO: durante la fase di avvio scarico lo stato del sensore Reed non è valido." },
  { code: "L002", cat: "L", catLabel: "Ciclo carico/scarico", text: "R1 non attivo o R2 attivo in modo inatteso in UNLOAD WAIT POS 1." },
  { code: "L003", cat: "L", catLabel: "Ciclo carico/scarico", text: "Stato attivo inatteso di R2 o S2 quando R1 non è attivo, in START LOAD." },
  { code: "L004", cat: "L", catLabel: "Ciclo carico/scarico", text: "L1 non attivo in modo inatteso in LOAD WAIT POS 2." },
  { code: "L005", cat: "L", catLabel: "Ciclo carico/scarico", text: "R1 non attivo in modo inatteso in LOAD WAIT POS 2." },
  { code: "L006", cat: "L", catLabel: "Ciclo carico/scarico", text: "L1 non attivo e L2 attivo in modo inatteso in START UNLOAD." },
  { code: "L007", cat: "L", catLabel: "Ciclo carico/scarico", text: "Pressione gambe lato piedi troppo bassa (ruote piedi non a terra) in START UNLOAD." },
  { code: "L008", cat: "L", catLabel: "Ciclo carico/scarico", text: "Stato R1 non attivo inatteso in UNLOAD WAIT POS 2." },
  { code: "L009", cat: "L", catLabel: "Ciclo carico/scarico", text: "L'angolo delle gambe lato piedi ha raggiunto il valore meccanico massimo, in UNLOAD LEG DOWN FEET." },
  { code: "L010", cat: "L", catLabel: "Ciclo carico/scarico", text: "Stato R1 non attivo inatteso in UNLOAD WAIT LEG DOWN FEET." },
  { code: "L011", cat: "L", catLabel: "Ciclo carico/scarico", text: "L'angolo delle gambe lato piedi ha raggiunto il valore meccanico massimo, in UNLOAD NO BUMP." },
  { code: "L012", cat: "L", catLabel: "Ciclo carico/scarico", text: "Stato R1 non attivo inatteso in UNLOAD NO BUMP." },
  { code: "L013", cat: "L", catLabel: "Ciclo carico/scarico", text: "L'angolo gambe lato piedi o lato testa ha raggiunto il valore minimo consentito, in LOAD WAIT LINK TOUCH V." },
  { code: "L014", cat: "L", catLabel: "Ciclo carico/scarico", text: "Recupero angolo gambe lato testa fallito, in WAIT RECOVERY H LEG UP." },
  { code: "L015", cat: "L", catLabel: "Ciclo carico/scarico", text: "Stato R1 non attivo inatteso in WAIT ADJ LEG LEG F." },
  { code: "L016", cat: "L", catLabel: "Ciclo carico/scarico", text: "Angolo gambe lato testa troppo elevato per il recupero, in WAIT ADJ LEG F." },
  { code: "L017", cat: "L", catLabel: "Ciclo carico/scarico", text: "R1 non attivo o L1 attivo in modo inatteso, in WAIT H LEG UP." },
  { code: "L018", cat: "L", catLabel: "Ciclo carico/scarico", text: "R1 non attivo in modo inatteso in LOAD WAIT SLED POS 1." },
  { code: "L019", cat: "L", catLabel: "Ciclo carico/scarico", text: "L'angolo delle gambe lato piedi ha raggiunto il valore meccanico massimo, in UNLOAD LEG DOWN H." },
  { code: "L020", cat: "L", catLabel: "Ciclo carico/scarico", text: "Scarico della pressione gambe lato piedi non completato in tempo, in UNLOAD WAIT DISCHARGE LEG PRESSURE." },
  { code: "L200", cat: "L", catLabel: "Ciclo carico/scarico", text: "RUOTE LATO TESTA TROPPO DISTANTI DAL SUOLO: il trattenimento della slitta viene disabilitato per evitare un salto troppo brusco." },
  { code: "W002", cat: "W", catLabel: "Avviso", text: "Un pacchetto dati cloud è stato scartato perché il buffer dati è pieno." },
  { code: "E010", cat: "E", catLabel: "Errore di sistema", text: "Comunicazione CAN bus persa con ECU Motore Destro." },
  { code: "E011", cat: "E", catLabel: "Errore di sistema", text: "Comunicazione CAN bus persa con ECU Motore Sinistro." },
  { code: "E012", cat: "E", catLabel: "Errore di sistema", text: "Comunicazione CAN bus persa con ECU Rostro." },
  { code: "E020", cat: "E", catLabel: "Errore di sistema", text: "Errore di inizializzazione dell'unità inerziale (IMU)." },
  { code: "E021", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Posizione ruota lato testa destra." },
  { code: "E023", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Posizione ruota lato piedi destra." },
  { code: "E024", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Posizione ruota lato testa sinistra." },
  { code: "E026", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Posizione ruota lato piedi sinistra." },
  { code: "E028", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Tensione di alimentazione sensori lato destro." },
  { code: "E029", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Tensione di alimentazione sensori lato destro." },
  { code: "E030", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Tensione di alimentazione sensori lato sinistro." },
  { code: "E031", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Tensione di alimentazione sensori lato sinistro." },
  { code: "E032", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Posizione gamba lato piedi." },
  { code: "E033", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Posizione gamba lato piedi." },
  { code: "E034", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Posizione gamba lato testa." },
  { code: "E035", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Posizione gamba lato testa." },
  { code: "E036", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Sensore di pressione lato piedi." },
  { code: "E037", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Sensore di pressione lato piedi." },
  { code: "E038", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Sensore di pressione lato testa." },
  { code: "E039", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Sensore di pressione lato testa." },
  { code: "E040", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Motore ruota lato testa destra." },
  { code: "E041", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Motore ruota lato testa destra." },
  { code: "E042", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Motore ruota lato piedi destra." },
  { code: "E043", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Motore ruota lato piedi destra." },
  { code: "E044", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Motore gamba lato piedi." },
  { code: "E045", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Motore gamba lato piedi." },
  { code: "E046", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Motore ruota lato testa sinistra." },
  { code: "E047", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Motore ruota lato testa sinistra." },
  { code: "E048", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Motore ruota lato piedi sinistra." },
  { code: "E049", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Motore ruota lato piedi sinistra." },
  { code: "E050", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Motore gamba lato testa." },
  { code: "E051", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Motore gamba lato testa." },
  { code: "E052", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Freno lato testa destra." },
  { code: "E053", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Freno lato testa destra." },
  { code: "E054", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Freno lato piedi destra." },
  { code: "E055", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Freno lato piedi destra." },
  { code: "E056", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Freno lato testa sinistra." },
  { code: "E057", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Freno lato testa sinistra." },
  { code: "E058", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Freno lato piedi sinistra." },
  { code: "E059", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Freno lato piedi sinistra." },
  { code: "E060", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Elettrovalvola lato piedi." },
  { code: "E061", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Elettrovalvola lato piedi." },
  { code: "E062", cat: "E", catLabel: "Errore di sistema", text: "Valore sotto soglia — Elettrovalvola lato testa." },
  { code: "E063", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia — Elettrovalvola lato testa." },
  { code: "E064", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia sul sense-out del cicalino (buzzer) lato sinistro." },
  { code: "E065", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia sul sense-out del cicalino (buzzer) lato destro." },
  { code: "E066", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia sul sense-out del LED lato sinistro." },
  { code: "E067", cat: "E", catLabel: "Errore di sistema", text: "Valore sopra soglia sul sense-out del LED lato destro." },
  { code: "E100", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Motore gamba lato testa." },
  { code: "E101", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Motore ruota lato testa sinistra." },
  { code: "E102", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Motore ruota lato piedi sinistra." },
  { code: "E103", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Motore gamba lato piedi." },
  { code: "E104", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Motore ruota lato testa destra." },
  { code: "E105", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Motore ruota lato piedi destra." },
  { code: "E106", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Attuatore verticale." },
  { code: "E107", cat: "E", catLabel: "Errore di sistema", text: "Sovracorrente — Attuatore orizzontale." },
  { code: "E108", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Motore gamba lato testa." },
  { code: "E109", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Motore ruota lato testa sinistra." },
  { code: "E110", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Motore ruota lato piedi sinistra." },
  { code: "E111", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Motore gamba lato piedi." },
  { code: "E112", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Motore ruota lato testa destra." },
  { code: "E113", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Motore ruota lato piedi destra." },
  { code: "E114", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Attuatore verticale." },
  { code: "E115", cat: "E", catLabel: "Errore di sistema", text: "Sovratemperatura — Attuatore orizzontale." },
  { code: "E116", cat: "E", catLabel: "Errore di sistema", text: "Incoerenza nella posizione delle ruote." },
  { code: "E117", cat: "E", catLabel: "Errore di sistema", text: "Pulsante di carico (IN) bloccato/incastrato." },
  { code: "E118", cat: "E", catLabel: "Errore di sistema", text: "Pulsante di scarico (OUT) bloccato/incastrato." },
  { code: "E119", cat: "E", catLabel: "Errore di sistema", text: "Thumbwheel bloccato/incastrato." },
  { code: "E120", cat: "E", catLabel: "Errore di sistema", text: "Guasto di inizializzazione — ECU Motore Sinistro." },
  { code: "E121", cat: "E", catLabel: "Errore di sistema", text: "Guasto di inizializzazione — ECU Motore Destro." },
  { code: "E122", cat: "E", catLabel: "Errore di sistema", text: "Guasto di inizializzazione — ECU Rostro." },
  { code: "E123", cat: "E", catLabel: "Errore di sistema", text: "Guasto di calibrazione — ECU Motore Sinistro." },
  { code: "E124", cat: "E", catLabel: "Errore di sistema", text: "Guasto di calibrazione — ECU Motore Destro." },
  { code: "E125", cat: "E", catLabel: "Errore di sistema", text: "Guasto di calibrazione — ECU Rostro." },
  { code: "E126", cat: "E", catLabel: "Errore di sistema", text: "Sovratensione — Thumbwheel." },
  { code: "E127", cat: "E", catLabel: "Errore di sistema", text: "Sottotensione — Thumbwheel." },
  { code: "E128", cat: "E", catLabel: "Errore di sistema", text: "Errore di connessione persa con EDEN." },
  { code: "E129", cat: "E", catLabel: "Errore di sistema", text: "Errore di posizione EDEN." },
  { code: "E130", cat: "E", catLabel: "Errore di sistema", text: "Livello del segnale thumbwheel troppo basso." },
  { code: "E131", cat: "E", catLabel: "Errore di sistema", text: "Livello del segnale thumbwheel troppo alto." },
  { code: "E132", cat: "E", catLabel: "Errore di sistema", text: "Corto circuito o carico aperto sull'uscita K15 dell'ECU quando attiva (ON)." },
  { code: "E133", cat: "E", catLabel: "Errore di sistema", text: "Corto circuito verso l'alimentazione sull'uscita K15 dell'ECU quando disattiva (OFF)." },
  { code: "E134", cat: "E", catLabel: "Errore di sistema", text: "Corto circuito o carico aperto sull'uscita OPT quando attiva (ON)." },
  { code: "E135", cat: "E", catLabel: "Errore di sistema", text: "Corto circuito verso l'alimentazione sull'uscita OPT quando disattiva (OFF)." },
  { code: "E136", cat: "E", catLabel: "Errore di sistema", text: "Guasto — Attuatore verticale bloccato/incastrato." },
];

/* ---------------------------------------------------------------------
   MANUTENZIONE — cronologia per numero di serie (SN)
   Ogni chiave è un SN (matricola Spark). Il valore è l'elenco delle
   manutenzioni già fatte per quell'unità: data + file scaricabile.
   Il modulo vuoto da compilare è in manutenzione-form.html (fuori da qui):
   quando lo esporti in PDF, il file scaricato è già nominato con l'SN
   che hai inserito — mandamelo e lo aggiungo qui, nella cartella giusta.
   ------------------------------------------------------------------- */
/* ---------------------------------------------------------------------
   PROCEDURE GUIDATE — guide passo-passo per la sezione Manutenzione.
   Riscritte in forma guidata a partire dai documenti STEM (non sono
   una copia 1:1 del PDF originale). "source" è solo un riferimento
   interno al documento di origine.
   ------------------------------------------------------------------- */
/* ---------------------------------------------------------------------
   PROCEDURE GUIDATE (Manutenzione)
   Campo opzionale "category" per raggruppare nella UI: "calibrazioni" |
   "regolazioni" | "sostituzioni" | "diagnostica". Le procedure senza
   "category" vengono mostrate in un gruppo "Altre procedure" — nessuna
   procedura esistente è stata riclassificata a forza in questa fase.
   ------------------------------------------------------------------- */
const PROCEDURES = [
  {
    id: "altezza-carico",
    title: "Configurazione altezza di carico",
    source: "IS000039 R00",
    intro: "Come impostare e salvare l'altezza di carico di Spark rispetto al ricettacolo del veicolo.",
    steps: [
      {
        title: "Sgancia il ricettacolo",
        detail: "Estrai completamente il ricettacolo e l'assieme slitta intermedio dall'assieme slitta base. Assicurati che siano entrambi completamente sganciati prima di procedere.",
        img: "assets/manutenzione/altezza-carico/step1.jpg"
      },
      {
        title: "Regola l'altezza",
        detail: "Premi e tieni premute contemporaneamente le due coste sensibili, poi regola l'altezza usando il thumbwheel (su/giù) sul telecomando.",
        img: "assets/manutenzione/altezza-carico/step2.jpg"
      },
      {
        title: "Verifica la quota di 20 mm",
        detail: "Posiziona Spark all'altezza corretta: deve esserci uno spazio di esattamente 20 mm tra la sfera del rostro e il piano inferiore del ricettacolo. Misura con un metro.",
        img: "assets/manutenzione/altezza-carico/step3.jpg"
      },
      {
        title: "Entra nel menu Parametri",
        detail: "Per salvare l'altezza appena impostata, premi il pulsante \"Impostazioni\" (icona utensili) sullo schermo di Spark.",
        img: "assets/manutenzione/altezza-carico/step4.jpg"
      },
      {
        title: "Accedi con il PIN",
        detail: "Inserisci il PIN di accesso 151010 sul tastierino numerico e conferma premendo il segno di spunta.",
        img: "assets/manutenzione/altezza-carico/step5.jpg"
      },
      {
        title: "Vai alla schermata di salvataggio",
        detail: "Premi il pulsante Home, poi premi il pulsante con l'icona dell'ambulanza per aprire la schermata dedicata al salvataggio dell'altezza di carico.",
        img: "assets/manutenzione/altezza-carico/step6.jpg"
      },
      {
        title: "Salva l'altezza",
        detail: "Tieni premuto sul pulsante \"altezza di carico\" finché non senti il segnale acustico di conferma: l'altezza è stata salvata.",
        img: "assets/manutenzione/altezza-carico/step8.jpg"
      },
      {
        title: "Torna al menu principale",
        detail: "Premi il pulsante a forma di ingranaggio per tornare alla schermata dei parametri.",
        img: "assets/manutenzione/altezza-carico/step9.jpg"
      },
      {
        title: "Esci dal menu Parametri",
        detail: "Premi la freccia indietro per uscire e tornare alla schermata principale di Spark. La configurazione è completata.",
        img: "assets/manutenzione/altezza-carico/step10.jpg"
      }
    ]
  }
];

const MAINTENANCE_RECORDS = {
  // "SN12345": [
  //   { date: "2026-09-13", title: "Manutenzione ordinaria", url: "manutenzione/SN12345/manutenzione_SN12345_2026-09-13.pdf" }
  // ]
};

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
    { title: "Manuale utente — FW 7.9", type: "PDF", url: "#", category: "manuali" },
    { title: "Note di rilascio — FW 7.9", type: "PDF", url: "#", category: "firmware" }
  ],
  "8.2": [
    { title: "Manuale utente — FW 8.2.x.x", type: "PDF", url: "#", category: "manuali" },
    { title: "Note di rilascio — FW 8.2.x.x", type: "PDF", url: "#", category: "firmware" }
  ]
};

/* ---------------------------------------------------------------------
   TESTI INTERFACCIA (predisposizione multilingua)
   ------------------------------------------------------------------- */
const I18N = {
  it: {
    appName: "Spark Doc Hub",
    tagline: "Centro documentazione, manutenzione e collaudo",
    nav_home: "Home",
    nav_simulator: "Tecnico",
    nav_checklist: "Manutenzione",
    nav_collaudo: "Collaudo",
    nav_documents: "Documenti",
    fw_label: "Versione firmware",
    home_intro: "Tutto quello che serve per configurare, controllare e collaudare Spark, organizzato per versione firmware.",
    simulator_intro: "Tutto quello che serve per conoscere la macchina: simulatore HMI, parametri, errori, mappa componenti e sensori.",
    sim_mode_panel: "Simulatore HMI",
    sim_panel_intro: "Riproduce lo schermo del pannello Spark: naviga i menu come sul dispositivo reale.",
    sim_mode_map: "Mappa Componenti",
    map_intro: "Scegli una vista, poi muoviti con le dita (o il mouse) e tocca un'etichetta per vederne il significato.",
    map_reset: "Reimposta",
    sim_mode_params: "Parametri",
    sim_mode_errors: "Errori",
    sim_mode_components: "Componenti",
    params_intro: "Elenco parametri settabili da menu HMI: nome, default, min, max, risoluzione e descrizione completa.",
    errors_intro: "Codici di errore/allarme del sistema, tradotti in italiano. Cerca per codice o per parola.",
    components_intro: "Scheda tecnica di ogni componente/sensore: cosa fa, dove si trova, come si verifica.",
    components_empty: "Sezione in preparazione: i contenuti verranno aggiunti qui componente per componente.",
    error_search_placeholder: "Cerca un codice o una parola…",
    global_search_placeholder: "Cerca un errore (codice o parola) o un parametro…",
    global_search_no_results: "Nessun risultato",
    global_search_error_tag: "Errore",
    global_search_param_tag: "Parametro",
    search_placeholder: "Cerca un parametro…",
    sim_card_desc: "Simulatore HMI, parametri, errori, mappa componenti e sensori: tutto per conoscere la macchina.",
    sim_locked_msg: "Il simulatore è disponibile solo con firmware 8.2.x.x selezionato in alto.",
    sim_tap_to_start: "Tocca lo schermo per iniziare",
    sim_back_to_menu: "Menu",
    sim_side_left: "SX",
    sim_side_right: "DX",
    checklist_intro: "Cronologia delle manutenzioni già effettuate, organizzata per numero di serie (SN).",
    maint_card_desc: "Cronologia delle manutenzioni per numero di serie e nuova checklist da compilare.",
    new_maint_btn: "Nuova manutenzione",
    procedures_heading: "Procedure guidate",
    proc_cat_calibrazioni: "Calibrazioni",
    proc_cat_regolazioni: "Regolazioni",
    proc_cat_sostituzioni: "Sostituzioni",
    proc_cat_diagnostica: "Diagnostica",
    proc_cat_altro: "Altre procedure",
    sn_history_heading: "Cronologia per numero di serie",
    back_to_procedures: "Torna alle procedure",
    maint_empty: "Nessuna manutenzione caricata ancora. Compila una nuova checklist e mandamela: la aggiungo qui, organizzata per SN.",
    collaudo_intro: "La procedura di collaudo del prodotto.",
    documents_intro: "Documentazione disponibile per la versione firmware selezionata.",
    doc_cat_manuali: "Manuali",
    doc_cat_tecnica: "Documentazione tecnica",
    doc_cat_firmware: "Firmware / Release",
    doc_cat_schemi: "Schemi e disegni",
    doc_cat_altro: "Altri documenti",
    empty_state: "Contenuti in arrivo per questa sezione.",
    access_title: "Livelli di accesso",
    lang_it: "Italiano",
    lang_fr: "Français",
    lang_es: "Español",
    lang_soon: "presto disponibile"
  },
  fr: {},
  es: {}
};
