// 🔹 Initialisiere die geladenen Module global
window.loadedModules = {};

async function init() {
  console.log(`🔍 Wird init() ausgeführt? window.initStarted = ${window.initStarted}`);

  if (window.initStarted) return;
  window.initStarted = true;
  console.log("🚀 Initialisierung gestartet...");

  document.getElementById("loading-screen").style.display = "flex";

  const firstModule = "artikel"; // 🔹 Lade beim Start nur das erste Modul
  console.log(`📌 Lade Standard-Modul: ${firstModule}`);
  await loadModule(firstModule);

  document.getElementById("loading-screen").style.display = "none";
  console.log("✅ App vollständig geladen!");
}

window.initStarted = false;

function loadModule(moduleName) {
  console.log(`🕵️ loadModule() aufgerufen für: ${moduleName}`);
  console.trace();

  console.log(`📌 Modul ${moduleName} wird geladen...`);

  const htmlPath = `html/${moduleName}.html`;
  console.log(`🕵️ Lade HTML: ${htmlPath}`);

  return window.api
    .loadHTML(htmlPath)
    .then((html) => {
      const container = document.getElementById("module-container");

      if (!container) {
        console.error("❌ Fehler: module-container nicht gefunden!");
        return;
      }

      console.log(`📌 Vorheriger Inhalt von module-container:`, container.innerHTML);
      container.innerHTML = html;
      console.log(`✅ Neuer Inhalt von module-container:`, container.innerHTML);

      // 🔹 Stelle sicher, dass der Inhalt sichtbar ist
      container.style.display = "block";
      container.style.opacity = "1";
      container.scrollIntoView({ behavior: "smooth" });

      // 🔥 Markierung des Moduls zurücksetzen, damit es erneut geladen werden kann
      window.loadedModules[moduleName] = false;
    })
    .catch((error) => {
      console.error(`❌ Fehler beim Laden des Moduls ${moduleName}:`, error);
    });
}

// 🔹 Sicherstellen, dass `artikel-btn` existiert & erst nach `DOMContentLoaded` ausgeführt wird
document.addEventListener("DOMContentLoaded", () => {
  const artikelBtn = document.getElementById("artikel-btn");

  if (artikelBtn) {
    artikelBtn.addEventListener("click", () => {
      if (!window.loadedModules["artikel"]) {
        console.log("🕵️ Lade Artikel-Modul durch Klick...");
        loadModule("artikel");
      } else {
        console.log("⚠ Artikel-Modul bereits geladen, kein erneutes Laden.");
      }
    });
  } else {
    console.error("❌ Fehler: Button 'artikel-btn' nicht gefunden!");
  }
});
