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

/* ---------------------------------------------------------------------
   MANUTENZIONE — cronologia per numero di serie (SN)
   Ogni chiave è un SN (matricola Spark). Il valore è l'elenco delle
   manutenzioni già fatte per quell'unità: data + file scaricabile.
   Il modulo vuoto da compilare è in manutenzione-form.html (fuori da qui):
   quando lo esporti in PDF, il file scaricato è già nominato con l'SN
   che hai inserito — mandamelo e lo aggiungo qui, nella cartella giusta.
   ------------------------------------------------------------------- */
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
    tagline: "Centro documentazione, manutenzione e collaudo",
    nav_home: "Home",
    nav_simulator: "Simulatore",
    nav_checklist: "Manutenzione",
    nav_collaudo: "Collaudo",
    nav_documents: "Documenti",
    fw_label: "Versione firmware",
    home_intro: "Tutto quello che serve per configurare, controllare e collaudare Spark, organizzato per versione firmware.",
    simulator_intro: "Naviga tra le schermate come sul dispositivo reale. Tocca una voce per vederne il significato.",
    sim_mode_panel: "Pannello Spark",
    sim_mode_map: "Mappa Componenti",
    map_intro: "Scegli una vista, poi muoviti con le dita (o il mouse) e tocca un'etichetta per vederne il significato.",
    map_reset: "Reimposta",
    sim_card_desc: "Naviga il pannello Spark come sul dispositivo reale e fai pratica.",
    sim_locked_msg: "Il simulatore è disponibile solo con firmware 8.2.x.x selezionato in alto.",
    sim_tap_to_start: "Tocca lo schermo per iniziare",
    sim_back_to_menu: "Menu",
    sim_side_left: "SX",
    sim_side_right: "DX",
    checklist_intro: "Cronologia delle manutenzioni già effettuate, organizzata per numero di serie (SN).",
    maint_card_desc: "Cronologia delle manutenzioni per numero di serie e nuova checklist da compilare.",
    new_maint_btn: "Nuova manutenzione",
    maint_empty: "Nessuna manutenzione caricata ancora. Compila una nuova checklist e mandamela: la aggiungo qui, organizzata per SN.",
    collaudo_intro: "La procedura di collaudo del prodotto.",
    documents_intro: "Documentazione disponibile per la versione firmware selezionata.",
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
