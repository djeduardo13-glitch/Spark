/* =========================================================================
   SPARK DOC HUB — STORAGE (cartelle di manutenzione, per SN)
   -------------------------------------------------------------------------
   Ogni file salvato (PDF di manutenzione o altro) viene tenuto nel
   browser (IndexedDB), raggruppato per SN. Non serve un server: tutto
   resta su questo dispositivo/browser. Condiviso tra
   manutenzione-form.html (che salva il PDF) e index.html (che mostra
   le cartelle e permette di aggiungere altri file in futuro).
   ========================================================================= */

const SPARK_DB_NAME = "SparkManutenzioneDB";
const SPARK_DB_VERSION = 1;
const SPARK_STORE = "files";

function sparkOpenDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SPARK_DB_NAME, SPARK_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(SPARK_STORE)) {
        const store = db.createObjectStore(SPARK_STORE, { keyPath: "id", autoIncrement: true });
        store.createIndex("sn", "sn", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* Salva un file (Blob) dentro la cartella dell'SN indicato.
   { sn, filename, mimeType, blob, kind } -> id del record creato */
async function sparkSaveFile({ sn, filename, mimeType, blob, kind }) {
  const cleanSn = String(sn || "").trim();
  if (!cleanSn) throw new Error("SN mancante");
  const db = await sparkOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SPARK_STORE, "readwrite");
    const store = tx.objectStore(SPARK_STORE);
    const record = {
      sn: cleanSn,
      filename,
      mimeType: mimeType || "application/octet-stream",
      blob,
      kind: kind || "altro",
      addedAt: new Date().toISOString()
    };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* Restituisce tutte le cartelle: { "SN123": [file, file, ...], ... }
   ordinate dal file più recente al più vecchio. */
async function sparkGetAllFolders() {
  const db = await sparkOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SPARK_STORE, "readonly");
    const req = tx.objectStore(SPARK_STORE).getAll();
    req.onsuccess = () => {
      const files = req.result || [];
      const folders = {};
      files.forEach(f => {
        if (!folders[f.sn]) folders[f.sn] = [];
        folders[f.sn].push(f);
      });
      Object.keys(folders).forEach(sn => {
        folders[sn].sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
      });
      resolve(folders);
    };
    req.onerror = () => reject(req.error);
  });
}

/* Elimina un singolo file dalla sua cartella, dato l'id del record. */
async function sparkDeleteFile(id) {
  const db = await sparkOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SPARK_STORE, "readwrite");
    tx.objectStore(SPARK_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
