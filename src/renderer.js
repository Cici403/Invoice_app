const db = require("./database");

// Modul-Lader
window.loadModule = (moduleName) => {
  const container = document.getElementById("module-container");

  switch (moduleName) {
    case "vertrieb":
      container.innerHTML = window.vertriebModuleHTML();
      window.initVertriebModule();
      break;
    case "kontakte":
      container.innerHTML = window.kontakteModuleHTML();
      window.initKontakteModule();
      break;
    case "artikel":
      container.innerHTML = window.artikelModuleHTML();
      window.initArtikelModule();
      break;
  }
};
