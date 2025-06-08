// renderer.js - Hauptlogik für Modulladung
window.loadModule = function (moduleName) {
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
