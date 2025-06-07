// Use module.exports instead of redeclaring db
const Database = require("better-sqlite3");
const dbInstance = new Database("datenbank.db");

dbInstance.exec(`
  CREATE TABLE IF NOT EXISTS kunden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    adresse TEXT,
    email TEXT,
    telefon TEXT
  );
  
  // ... rest of your table creation code ...
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

module.exports = dbInstance; // Export the instance
