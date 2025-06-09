const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Fehler beim Verbinden zur Datenbank:", err.message);
  } else {
    console.log("✅ Verbunden mit SQLite.");
    initDatabase();
  }
});

// Funktion zum Erstellen der Tabellen
function initDatabase() {
  const tables = [
    `
      CREATE TABLE IF NOT EXISTS artikel (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          preis REAL NOT NULL
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS rechnungen (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          kunden_id INTEGER NOT NULL,
          datum TEXT DEFAULT CURRENT_DATE,
          gesamt_netto REAL,
          FOREIGN KEY(kunden_id) REFERENCES kunden(id)
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS rechnungspositionen (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rechnung_id INTEGER NOT NULL,
          artikel_id INTEGER NOT NULL,
          menge INTEGER NOT NULL,
          einzelpreis REAL NOT NULL,
          FOREIGN KEY(rechnung_id) REFERENCES rechnungen(id),
          FOREIGN KEY(artikel_id) REFERENCES artikel(id)
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS kunden (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          adresse TEXT,
          email TEXT,
          telefon TEXT
      )
    `,
  ];

  tables.forEach((query, index) => {
    db.run(query, (err) => {
      if (err) {
        console.error(`❌ Fehler beim Erstellen der Tabelle ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Tabelle ${index + 1} erfolgreich erstellt.`);
      }
    });
  });
}

module.exports = db;
