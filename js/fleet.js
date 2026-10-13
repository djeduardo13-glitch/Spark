/* =========================================================================
   SPARK DOC HUB — PARCO SPARK-UC (da "RELAZIONE SPARK.xlsx", 13/10/2026)
   -------------------------------------------------------------------------
   Un record per ogni SPARK-UC installato. La cartella di manutenzione è
   sempre quella dell'SN SPARK-UC. I dati servono a:
   - mostrare le cartelle S/N anche prima del primo report (index.html);
   - precompilare il modulo di manutenzione (manutenzione-form.html?sn=...).
   Per aggiungere un SPARK basta aggiungere un oggetto a SPARK_FLEET.
   Campi: sn (come scritto sulla targhetta), cliente, fs, supporto {tipo, sn},
   barellini [{tipo, sn}], powerPack, extra [codici elementi aggiuntivi].
   ========================================================================= */

/* Menu a tendina del modulo (Foglio2) */
const TIPI_SUPPORTO = ["EDEN04-SPARK", "EDEN-BS8 070", "OPTIMUS-XP 067", "SIDESLIDE-SPARK"];
const TIPI_BARELLINO = ["STR001", "STR002_001"];

const SPARK_FLEET = [
  {
    sn: "5104", cliente: "AMBULANCES DUBOIS AGEZ", fs: "22 26063",
    supporto: { tipo: "EDEN-BS8 070", sn: "59586" },
    barellini: [], powerPack: "", extra: []
  },
  {
    sn: "22 25999", cliente: "OURSON BLEU", fs: "31370",
    supporto: { tipo: "EDEN04-SPARK", sn: "22 24796" },
    barellini: [{ tipo: "STR002", sn: "10114" }], powerPack: "30587",
    extra: ["TAB723", "IV-P-DX654"]
  },
  {
    sn: "56809", cliente: "OURSON BLEU", fs: "56810",
    supporto: { tipo: "EDEN-BS8 070", sn: "55282" },
    barellini: [{ tipo: "STR001", sn: "56812" }], powerPack: "55341",
    extra: ["TAB723", "IV-P-DX654"]
  },
  {
    sn: "56808", cliente: "OURSON BLEU", fs: "56811",
    supporto: { tipo: "EDEN-BS8 070", sn: "55283" },
    barellini: [{ tipo: "STR001", sn: "56813" }], powerPack: "55342",
    extra: ["TAB723", "IV-P-DX654"]
  },
  {
    sn: "58424", cliente: "CHU DE REIMS", fs: "58425",
    supporto: { tipo: "EDEN-BS8 070", sn: "55284" },
    barellini: [{ tipo: "STR001", sn: "58426" }, { tipo: "STR002_001", sn: "" }], powerPack: "55345",
    extra: ["TAB723", "IV-P-DX654"]
  },
  {
    sn: "59024", cliente: "NORMANDY AMBULANCES", fs: "58999",
    supporto: { tipo: "SIDESLIDE-SPARK", sn: "57350" },
    barellini: [{ tipo: "STR001", sn: "59088" }, { tipo: "STR002_001", sn: "" }], powerPack: "55321",
    extra: ["TAB723", "IV-P-DX654", "H-RAIL593", "F-RAIL594"]
  },
  {
    sn: "59025", cliente: "NORMANDY AMBULANCES", fs: "59000",
    supporto: { tipo: "SIDESLIDE-SPARK", sn: "57351" },
    barellini: [{ tipo: "STR002_001", sn: "" }], powerPack: "55322",
    extra: ["TAB723", "IV-P-DX654", "H-RAIL593", "F-RAIL594"]
  },
  {
    sn: "61278", cliente: "ASV AMBULANCES", fs: "61201",
    supporto: { tipo: "SIDESLIDE-SPARK", sn: "58549" },
    barellini: [{ tipo: "STR001", sn: "61277" }], powerPack: "",
    extra: ["HE811", "TAB723", "IV-P-DX654-S"]
  },
  {
    sn: "42495", cliente: "DISNEY", fs: "62497",
    supporto: { tipo: "SIDESLIDE-SPARK", sn: "61306" },
    barellini: [{ tipo: "STR001", sn: "62496" }, { tipo: "STR002_001", sn: "" }], powerPack: "",
    extra: ["TAB723", "IV-P-DX654-S"]
  }
];

/* Stessa pulizia usata dal modulo per il nome della cartella/file */
function sparkSnKey(sn) {
  return String(sn || "").trim().replace(/[^a-zA-Z0-9_-]+/g, "").toUpperCase();
}

function sparkFindUnit(sn) {
  const key = sparkSnKey(sn);
  if (!key) return null;
  return SPARK_FLEET.find(u => sparkSnKey(u.sn) === key) || null;
}

/* Codice elemento aggiuntivo -> chiave della casella nel modulo (es. "IV-P-DX654-S" -> "extra-ivpdx654s") */
function sparkExtraKey(code) {
  return "extra-" + String(code).toLowerCase().replace(/[^a-z0-9]/g, "");
}
