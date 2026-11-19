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
| `js/vendor/` | Librerie esterne (html2pdf) |
| `css/style.css` | Stili |
| `assets/` | Logo, icone app e documenti PDF dei componenti |
| `manifest.json` | Configurazione PWA |
| `sw.js` | Service worker (cache offline) |

## Aggiungere contenuti

Quasi tutti i contenuti si modificano solo in `js/data.js`, aggiungendo oggetti agli array esistenti
(non serve toccare `app.js` o `style.css`).

### Errori per versione FW

| Array | Versione FW | Note |
|---|---|---|
| `ERRORS` | FW 8.2.x.x | Elenco di riferimento: componenti (`ERROR_COMPONENTS`) e diagnostica (`ERROR_DIAGNOSTICS`) sono collegati a questi codici. |
| `ERRORS_79` | FW 7.9 | Mostrato solo quando in alto è selezionato FW 7.9. |

Ogni voce di `ERRORS_79` ha il campo `ref` con il codice equivalente in `ERRORS`:
componenti collegati e diagnostica vengono letti da lì, quindi restano identici tra le due versioni.
Quando aggiungi un errore FW 7.9, verifica che il codice indicato in `ref` esista in `ERRORS`.

## Aggiornare l'app

Quando modifichi file HTML, JS o CSS, incrementa `CACHE_NAME` in `sw.js`
(es. `spark-doc-hub-v21` → `spark-doc-hub-v22`) così i dispositivi scaricano la versione nuova.

---
STEM S.r.l.
