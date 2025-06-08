// vertrieb.js - Vertriebsmodul
window.vertriebModuleHTML = () => `
  <div class="vertrieb-module">
    <h2>Rechnung erstellen</h2>
    
    <div class="form-section">
      <h3>Kunde auswählen</h3>
      <select id="kunden-select"></select>
    </div>
    
    <div class="form-section">
      <h3>Artikel hinzufügen</h3>
      <select id="artikel-select"></select>
      <input type="number" id="menge-input" min="1" value="1">
      <button onclick="addPosition()">Hinzufügen</button>
    </div>
    
    <div class="positionen-table">
      <table>
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Menge</th>
            <th>Einzelpreis (netto)</th>
            <th>Gesamt (netto)</th>
          </tr>
        </thead>
        <tbody id="positionen-body"></tbody>
      </table>
    </div>
    
    <div class="summen">
      <p>Gesamtnetto: <span id="gesamt-netto">0.00</span> €</p>
    </div>
    
    <button onclick="saveRechnung()">Rechnung speichern</button>
  </div>
`;

window.initVertriebModule = () => {
  // Kunden und Artikel laden
  let kunden = window.db.query("SELECT * FROM kunden");
  let artikel = window.db.query("SELECT * FROM artikel");

  let kundenSelect = document.getElementById("kunden-select");
  kundenSelect.innerHTML = kunden[0]?.values.map((kunde) => `<option value="${kunde[0]}">${kunde[1]}</option>`).join("");

  let artikelSelect = document.getElementById("artikel-select");
  artikelSelect.innerHTML = artikel[0]?.values.map((art) => `<option value="${art[0]}">${art[1]} (${art[2]}€)</option>`).join("");

  window.positionen = [];
};

window.addPosition = () => {
  let artikelId = parseInt(document.getElementById("artikel-select").value);
  let menge = parseInt(document.getElementById("menge-input").value);

  let artikel = window.db.query(`SELECT * FROM artikel WHERE id = ${artikelId}`);
  if (artikel.length === 0) return;

  const artData = artikel[0].values[0];

  window.positionen.push({
    artikelId,
    bezeichnung: artData[1],
    menge,
    einzelpreis: artData[2],
    gesamt: artData[2] * menge,
  });

  updatePositionenTabelle();
};

window.saveRechnung = () => {
  let kundenId = parseInt(document.getElementById("kunden-select").value);
  let gesamtNetto = window.positionen.reduce((sum, p) => sum + p.gesamt, 0);

  // Rechnungskopf speichern
  const rechnungId = window.db.run("INSERT INTO rechnungen (kunden_id, gesamt_netto) VALUES (?, ?)", [kundenId, gesamtNetto]);

  // Positionen speichern
  window.positionen.forEach((p) => {
    window.db.run("INSERT INTO rechnungspositionen (rechnung_id, artikel_id, menge, einzelpreis) VALUES (?, ?, ?, ?)", [
      rechnungId,
      p.artikelId,
      p.menge,
      p.einzelpreis,
    ]);
  });

  alert("Rechnung gespeichert!");
  window.positionen = [];
  updatePositionenTabelle();
};

function updatePositionenTabelle() {
  let body = document.getElementById("positionen-body");
  let gesamtNettoEl = document.getElementById("gesamt-netto");

  body.innerHTML = window.positionen
    .map(
      (p) => `
    <tr>
      <td>${p.bezeichnung}</td>
      <td>${p.menge}</td>
      <td>${p.einzelpreis.toFixed(2)}€</td>
      <td>${p.gesamt.toFixed(2)}€</td>
    </tr>
  `
    )
    .join("");

  let gesamtNetto = window.positionen.reduce((sum, p) => sum + p.gesamt, 0);
  gesamtNettoEl.textContent = gesamtNetto.toFixed(2);
}
