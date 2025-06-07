// HTML für Vertriebsmodul
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

// Vertriebsmodul initialisieren
window.initVertriebModule = () => {
  // Kunden und Artikel laden
  const kunden = db.prepare("SELECT * FROM kunden").all();
  const artikel = db.prepare("SELECT * FROM artikel").all();

  const kundenSelect = document.getElementById("kunden-select");
  kundenSelect.innerHTML = kunden.map((k) => `<option value="${k.id}">${k.name}</option>`).join("");

  const artikelSelect = document.getElementById("artikel-select");
  artikelSelect.innerHTML = artikel.map((a) => `<option value="${a.id}">${a.bezeichnung} (${a.preis_netto.toFixed(2)}€)</option>`).join("");

  window.positionen = [];
};

// Artikel zur Rechnung hinzufügen
window.addPosition = () => {
  const artikelId = parseInt(document.getElementById("artikel-select").value);
  const menge = parseInt(document.getElementById("menge-input").value);

  const artikel = db.prepare("SELECT * FROM artikel WHERE id = ?").get(artikelId);

  window.positionen.push({
    artikelId,
    bezeichnung: artikel.bezeichnung,
    menge,
    einzelpreis: artikel.preis_netto,
    gesamt: artikel.preis_netto * menge,
  });

  updatePositionenTabelle();
};

// Rechnung speichern
window.saveRechnung = () => {
  const kundenId = parseInt(document.getElementById("kunden-select").value);
  const gesamtNetto = window.positionen.reduce((sum, p) => sum + p.gesamt, 0);

  // Rechnungskopf speichern
  const rechnungStmt = db.prepare(`
    INSERT INTO rechnungen (kunden_id, gesamt_netto)
    VALUES (?, ?)
  `);
  const rechnung = rechnungStmt.run(kundenId, gesamtNetto);

  // Positionen speichern
  const positionStmt = db.prepare(`
    INSERT INTO rechnungspositionen 
    (rechnung_id, artikel_id, menge, einzelpreis)
    VALUES (?, ?, ?, ?)
  `);

  window.positionen.forEach((p) => {
    positionStmt.run(rechnung.lastInsertRowid, p.artikelId, p.menge, p.einzelpreis);
  });

  alert("Rechnung gespeichert!");
  window.positionen = [];
  updatePositionenTabelle();
};

// Hilfsfunktion: Positionstabelle aktualisieren
function updatePositionenTabelle() {
  const body = document.getElementById("positionen-body");
  const gesamtNettoEl = document.getElementById("gesamt-netto");

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

  const gesamtNetto = window.positionen.reduce((sum, p) => sum + p.gesamt, 0);
  gesamtNettoEl.textContent = gesamtNetto.toFixed(2);
}
