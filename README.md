# Spark Doc Hub

Web app installabile (PWA) per documentazione, simulatore, manutenzione e collaudo di **SPARK-UC**, **SPARK-FS** e **STR-000**.
Funziona anche offline grazie al service worker.

## Struttura

| Percorso | Contenuto |
|---|---|
| `index.html` | Pagina principale dell'hub |
| `manutenzione-form.html` | Modulo di manutenzione (stampa / PDF) |
| `taratura-peso.html` | Procedura di taratura peso |
| `js/data.js` | Dati: componenti, errori, parametri, sequenze operative |
| `js/app.js` | Logica dell'interfaccia |
| `js/storage.js`, `js/fleet.js` | Salvataggio locale e parco macchine |
| `js/issues.js` | Segnalazioni: problemi del prodotto, soluzioni, export PDF/Excel e backup |
| `js/vendor/` | Librerie esterne (html2pdf) |
| `css/style.css` | Stili |
| `assets/` | Logo, icone app e documenti PDF dei componenti |
| `manifest.json` | Configurazione PWA |
| `sw.js` | Service worker (cache offline) |

## Aggiornare l'app

Quando modifichi file HTML, JS o CSS, incrementa `CACHE_NAME` in `sw.js`
(es. `spark-doc-hub-v21` → `spark-doc-hub-v22`) così i dispositivi scaricano la versione nuova.

---
STEM S.r.l.
