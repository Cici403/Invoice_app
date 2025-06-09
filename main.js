const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const db = require("./db");
console.log("🔍 db.js geladen:", db); // Sollte NICHT `undefined` sein!

const preloadTestPath = path.join(__dirname, "scripts", "preload.js");

if (fs.existsSync(preloadTestPath)) {
  console.log("✅ preload.js existiert und kann gelesen werden!");
} else {
  console.error("❌ preload.js fehlt oder kann nicht gelesen werden!");
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.resolve(__dirname, "scripts", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html")); // 🔥 Lade `index.html` aus dem Hauptverzeichnis

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

// 📌 Statische Dateien sicher bereitstellen
app.setPath("userData", __dirname);

// 🔹 **Optimierte `load-html`-Funktion → Entfernt doppeltes `html/html/`!**
ipcMain.handle("load-html", async (_, filePath) => {
  try {
    const fullPath = path.join(__dirname, "html", filePath.replace(/^html\//, "")); // ✅ Entfernt doppeltes `html/`
    return fs.readFileSync(fullPath, "utf-8");
  } catch (error) {
    console.error(`❌ Fehler beim Laden von ${filePath}:`, error);
    throw error;
  }
});

// 🔹 **Optimierte `load-js`-Funktion → Lädt JavaScript aus `/scripts/`!**
ipcMain.handle("load-js", async (_, filePath) => {
  try {
    const fullPath = path.join(__dirname, "scripts", filePath);
    return fs.readFileSync(fullPath, "utf-8");
  } catch (error) {
    console.error(`❌ Fehler beim Laden von ${filePath}:`, error);
    throw error;
  }
});

// 📌 **IPC-Handler für Datenbank-Abfragen**
ipcMain.handle("get-kunden", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM kunden", (err, rows) => {
      if (err) {
        console.error("❌ Fehler beim Abrufen der Kunden:", err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("get-artikel", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM artikel", (err, rows) => {
      if (err) {
        console.error("❌ Fehler beim Abrufen der Artikel:", err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("save-artikel", async (event, bezeichnung, preis, mwst) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO artikel (name, preis, mwst) VALUES (?, ?, ?)", [bezeichnung, preis, mwst], function (err) {
      if (err) {
        console.error("❌ Fehler beim Speichern des Artikels:", err.message);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
});

// 🔹 Sicherstellen, dass Electron bereit ist
app.whenReady().then(() => setTimeout(createWindow, 500));
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

console.log("🔍 Prüfe db.js Pfad:", path.join(__dirname, "db.js"));
