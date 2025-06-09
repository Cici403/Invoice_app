const { ipcMain, dialog } = require("electron");
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

let db;
const dbPath = path.join(app.getPath("userData"), "datenbank.sqlite");

async function initDatabase() {
  try {
    const SQL = await initSqlJs();
    let data = new Uint8Array();

    if (fs.existsSync(dbPath)) {
      data = new Uint8Array(fs.readFileSync(dbPath));
    }

    db = new SQL.Database(data);
    createTables();
  } catch (err) {
    console.error("Datenbankfehler:", err);
  }
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS artikel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bezeichnung TEXT NOT NULL,
      preis_netto REAL NOT NULL,
      mwst REAL DEFAULT 19
    );
    // ... restliche Tabellen
  `);
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// IPC-Handler wie zuvor registrieren
// ...

// Datenbank initialisieren
initDatabase();

// Periodisch speichern
setInterval(saveDatabase, 5000);
