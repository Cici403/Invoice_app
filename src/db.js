import initSQLJs from "sql.js";
import * as Buffer from "buffer";
import * as process from "process";

window.Buffer = Buffer.Buffer;
window.process = process;

let db;

export const initDB = async () => {
  try {
    const SQL = await initSQLJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    db = new SQL.Database();

    // Tabellen erstellen
    db.run(`
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

    return db;
  } catch (err) {
    console.error("Datenbankinitialisierungsfehler:", err);
    throw err;
  }
};

export const queryDB = (sql, params = []) => {
  return db.exec(sql, params);
};

export const runDB = (sql, params = []) => {
  db.run(sql, params);
  return db.exec("SELECT last_insert_rowid() AS id")[0].values[0][0];
};
