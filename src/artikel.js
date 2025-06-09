window.artikelModuleHTML = () => `
  <div class="artikel-module">
    <h2>Artikelverwaltung</h2>
    
    <div class="form-section">
      <h3>Neuer Artikel</h3>
      <input type="text" id="artikel-bezeichnung" placeholder="Bezeichnung" required>
      <input type="number" id="artikel-preis" placeholder="Preis (netto)" step="0.01" min="0" required>
      <button onclick="saveArtikel()">Speichern</button>
    </div>
    
    <div class="artikel-table">
      <table>
        <thead>
          <tr>
            <th>Bezeichnung</th>
            <th>Preis (netto)</th>
          </tr>
        </thead>
        <tbody id="artikel-body"></tbody>
      </table>
    </div>
  </div>
`;

window.initArtikelModule = () => {
  updateArtikelTabelle();
};

window.saveArtikel = async () => {
  const bezeichnung = document.getElementById('artikel-bezeichnung').value;
  const preis = parseFloat(document.getElementById('artikel-preis').value);
  
  if (!bezeichnung || isNaN(preis)) {
    await window.api.showDialog('Bitte alle Felder ausfüllen!');
    return;
  }

  try {
    const id = await window.api.runDB(
      'INSERT INTO artikel (bezeichnung, preis_netto) VALUES (?, ?)',
      [bezeichnung, preis]
    );
    
    if (id) {
      await window.api.showDialog(`Artikel ${bezeichnung} gespeichert!`);
      updateArtikelTabelle();
      document.getElementById('artikel-bezeichnung').value = '';
      document.getElementById('artikel-preis').value = '';
    }
  } catch (err) {
    console.error('Speicherfehler:', err);
    await window.api.showDialog('Fehler beim Speichern des Artikels!');
  }
};

async function updateArtikelTabelle() {
  try {
    const artikel = await window.api.queryDB('SELECT * FROM artikel');
    const body = document.getElementById('artikel-body');
    
    body.innerHTML = artikel.length > 0 
      ? artikel.map(a => `
          <tr>
            <td>${a.bezeichnung}</td>
            <td>${a.preis_netto.toFixed(2)}€</td>
          </tr>
        `).join('')
      : '<tr><td colspan="2">Keine Artikel vorhanden</td></tr>';
  } catch (err) {
    console.error('Fehler beim Laden der Artikel:', err);
  }
}
