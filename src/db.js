// src/db.js
let db;
let dbInitialized = false;
const dbReadyCallbacks = [];

window.initDatabase = async function () {
  if (dbInitialized) return true;

  try {
    console.log("Starte Datenbankinitialisierung...");
    const sqlite3 = await import("@sqlite.org/sqlite-wasm");
    console.log("SQLite-WASM geladen");

    db = new sqlite3.oo1.DB("datenbank.db", "ct");
    console.log("Datenbankdatei geöffnet");

    db.exec(`
      CREATE TABLE IF NOT EXISTS kunden (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        adresse TEXT,
        email TEXT,
        telefon TEXT
      );
      
      CREATE TABLE IF NOT EXISTS artikel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bezeichnung TEXT NOT NULL,
        preis_netto REAL NOT NULL,
        mwst REAL DEFAULT 19
      );
      
      CREATE TABLE IF NOT EXISTS rechnungen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kunden_id INTEGER NOT NULL,
        datum TEXT DEFAULT CURRENT_DATE,
        gesamt_netto REAL,
        FOREIGN KEY(kunden_id) REFERENCES kunden(id)
      );
      
      CREATE TABLE IF NOT EXISTS rechnungspositionen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rechnung_id INTEGER NOT NULL,
        artikel_id INTEGER NOT NULL,
        menge INTEGER NOT NULL,
        einzelpreis REAL NOT NULL,
        FOREIGN KEY(rechnung_id) REFERENCES rechnungen(id),
        FOREIGN KEY(artikel_id) REFERENCES artikel(id)
      );
    `);

    dbInitialized = true;
    console.log("Datenbank vollständig initialisiert");

    // Alle wartenden Callbacks aufrufen
    dbReadyCallbacks.forEach((callback) => callback());
    dbReadyCallbacks.length = 0;

    return true;
  } catch (err) {
    console.error("Fehler bei der Datenbankinitialisierung:", err);
    return false;
  }
};

window.db = {
  query: (sql, params = []) => {
    if (!dbInitialized) throw new Error("Datenbank nicht initialisiert");
    return db.exec(sql, params);
  },
  run: (sql, params = []) => {
    if (!dbInitialized) throw new Error("Datenbank nicht initialisiert");
    db.run(sql, params);
    return db.exec("SELECT last_insert_rowid() AS id")[0].values[0][0];
  },
  ready: (callback) => {
    if (dbInitialized) callback();
    else dbReadyCallbacks.push(callback);
  },
};

// Initialisierung starten
window.initDatabase();
