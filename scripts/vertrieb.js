// src/vertrieb.js
window.api.getKunden().then((kunden) => {
  console.log("Kunden-Daten:", kunden);
});

window.api.getArtikel().then((artikel) => {
  console.log("Artikel-Daten:", artikel);
});

function loadVertriebModule() {
  document.getElementById("module-container").innerHTML = window.vertriebModuleHTML();
  window.initVertriebModule();
}

// Funktion zur HTML-Darstellung des Vertriebsmoduls
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

window.initVertriebModule = async () => {
  const kunden = await window.api.getKunden();
  const artikel = await window.api.getArtikel();

  const kundenSelect = document.getElementById("kunden-select");
  kundenSelect.innerHTML = kunden.map((kunde) => `<option value="${kunde.id}">${kunde.name}</option>`).join("");

  const artikelSelect = document.getElementById("artikel-select");
  artikelSelect.innerHTML = artikel.map((art) => `<option value="${art.id}">${art.bezeichnung} (${art.preis_netto}€)</option>`).join("");

  window.positionen = [];
};

window.addPosition = async () => {
  const artikelId = parseInt(document.getElementById("artikel-select").value);
  const menge = parseInt(document.getElementById("menge-input").value);

  if (!artikelId || menge <= 0) {
    alert("Bitte Artikel auswählen und eine gültige Menge eingeben!");
    return;
  }

  const artikel = await window.api.getArtikelById(artikelId);
  if (!artikel) return;

  window.positionen.push({
    artikelId,
    bezeichnung: artikel.bezeichnung,
    menge,
    einzelpreis: artikel.preis_netto,
    gesamt: artikel.preis_netto * menge,
  });

  updatePositionenTabelle();
};

window.saveRechnung = async () => {
  const kundenId = parseInt(document.getElementById("kunden-select").value);
  if (!kundenId || window.positionen.length === 0) {
    alert("Bitte einen Kunden auswählen und mindestens einen Artikel hinzufügen!");
    return;
  }

  const rechnungId = await window.api.saveRechnung(kundenId, window.positionen);
  alert(`Rechnung erfolgreich gespeichert mit ID: ${rechnungId}`);

  window.positionen = [];
  updatePositionenTabelle();
};

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
