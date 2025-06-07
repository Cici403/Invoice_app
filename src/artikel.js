const db = require("./database");

window.artikelModuleHTML = () => `
  <div class="artikel-module">
    <h2>Artikelverwaltung</h2>
    
    <div class="form-section">
      <h3>Neuer Artikel</h3>
      <input type="text" id="artikel-bezeichnung" placeholder="Bezeichnung" required>
      <input type="number" id="artikel-preis" placeholder="Preis (netto)" step="0.01" min="0" required>
      <input type="number" id="artikel-mwst" placeholder="MwSt (%)" value="19" min="0" max="100" step="0.1">
      <button onclick="saveArtikel()">Artikel speichern</button>
    </div>
    
    <div class="artikel-table">
      <table>
        <thead>
          <tr>
            <th>Bezeichnung</th>
            <th>Preis (netto)</th>
            <th>MwSt</th>
          </tr>
        </thead>
        <tbody id="artikel-body"></tbody>
      </table>
    </div>
  </div>
`;

// Artikelmodul initialisieren
window.initArtikelModule = () => {
  updateArtikelTabelle();
};

// Artikel speichern
window.saveArtikel = () => {
  const bezeichnung = document.getElementById("artikel-bezeichnung").value;
  const preis = parseFloat(document.getElementById("artikel-preis").value);
  const mwst = parseFloat(document.getElementById("artikel-mwst").value) || 19;

  const stmt = db.prepare(`
    INSERT INTO artikel (bezeichnung, preis_netto, mwst)
    VALUES (?, ?, ?)
  `);

  stmt.run(bezeichnung, preis, mwst);
  alert("Artikel gespeichert!");
  updateArtikelTabelle();

  // Formular leeren
  document.getElementById("artikel-bezeichnung").value = "";
  document.getElementById("artikel-preis").value = "";
  document.getElementById("artikel-mwst").value = "19";
};

// Hilfsfunktion: Artikeltabelle aktualisieren
function updateArtikelTabelle() {
  const artikel = db.prepare("SELECT * FROM artikel").all();
  const body = document.getElementById("artikel-body");

  body.innerHTML = artikel
    .map(
      (a) => `
    <tr>
      <td>${a.bezeichnung}</td>
      <td>${a.preis_netto.toFixed(2)}€</td>
      <td>${a.mwst}%</td>
    </tr>
  `
    )
    .join("");
}
