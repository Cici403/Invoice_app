// src/artikel.js
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

window.initArtikelModule = () => {
  // Sicherstellen, dass DB bereit ist
  window.db.ready(() => {
    updateArtikelTabelle();
  });
};

window.saveArtikel = () => {
  // Sicherstellen, dass DB bereit ist
  window.db.ready(() => {
    const bezeichnung = document.getElementById("artikel-bezeichnung").value;
    const preis = parseFloat(document.getElementById("artikel-preis").value);
    const mwst = parseFloat(document.getElementById("artikel-mwst").value) || 19;

    if (!bezeichnung || isNaN(preis)) {
      alert("Bitte alle Pflichtfelder ausfüllen!");
      return;
    }

    try {
      const id = window.db.run("INSERT INTO artikel (bezeichnung, preis_netto, mwst) VALUES (?, ?, ?)", [bezeichnung, preis, mwst]);
      console.log("Artikel gespeichert mit ID:", id);

      updateArtikelTabelle();

      // Formular leeren
      document.getElementById("artikel-bezeichnung").value = "";
      document.getElementById("artikel-preis").value = "";
      document.getElementById("artikel-mwst").value = "19";
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern des Artikels!");
    }
  });
};

function updateArtikelTabelle() {
  try {
    const result = window.db.query("SELECT * FROM artikel");
    const body = document.getElementById("artikel-body");

    if (!result || result.length === 0 || !result[0].values) {
      body.innerHTML = '<tr><td colspan="3">Keine Artikel gefunden</td></tr>';
      return;
    }

    body.innerHTML = result[0].values
      .map(
        (artikel) => `
      <tr>
        <td>${artikel[1]}</td>
        <td>${artikel[2].toFixed(2)}€</td>
        <td>${artikel[3]}%</td>
      </tr>
    `
      )
      .join("");
  } catch (err) {
    console.error("Fehler beim Laden der Artikel:", err);
    setTimeout(updateArtikelTabelle, 500); // Erneut versuchen
  }
}
