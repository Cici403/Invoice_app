const { contextBridge, ipcRenderer } = require("electron");
const db = require("./db.js");

console.log("✅ preload.js wurde geladen!");

contextBridge.exposeInMainWorld("api", {
  // 🔹 HTML-Modul laden (direkt ohne `replace()`)
  loadHTML: (filePath) => ipcRenderer.invoke("load-html", filePath),

  // 🔹 JavaScript-Modul laden (stellt sicher, dass der Pfad korrekt ist)
  loadJS: (filePath) => {
    const fixedPath = filePath.startsWith("scripts/") ? filePath : `scripts/${filePath}`;
    console.log(`✅ Lade JavaScript: ${fixedPath}`); // Debugging-Log zur Kontrolle
    return ipcRenderer.invoke("load-js", fixedPath);
  },

  // 🔹 API für Datenbankabfragen
  getKunden: () => ipcRenderer.invoke("get-kunden"),
  getArtikel: () => ipcRenderer.invoke("get-artikel"),
  saveArtikel: (bezeichnung, preis, mwst) => ipcRenderer.invoke("save-artikel", bezeichnung, preis, mwst),
  editArtikel: (id, bezeichnung, preis, mwst) => ipcRenderer.invoke("edit-artikel", id, bezeichnung, preis, mwst),
  deleteArtikel: (id) => ipcRenderer.invoke("delete-artikel", id),
});

console.log("✅ Preload-APIs bereit!");
