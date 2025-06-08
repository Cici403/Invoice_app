// kontakte.js - Kundenmodul
window.kontakteModuleHTML = () => `
  <div class="kontakte-module">
    <h2>Kundenverwaltung</h2>
    
    <div class="form-section">
      <h3>Neuer Kunde</h3>
      <input type="text" id="kunde-name" placeholder="Name" required>
      <input type="text" id="kunde-adresse" placeholder="Adresse">
      <input type="email" id="kunde-email" placeholder="Email">
      <input type="tel" id="kunde-telefon" placeholder="Telefon">
      <button onclick="saveKunde()">Kunde speichern</button>
    </div>
    
    <div class="kunden-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Adresse</th>
            <th>Email</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody id="kunden-body"></tbody>
      </table>
    </div>
  </div>
`;

window.initKontakteModule = () => {
  updateKundenTabelle();
};

window.saveKunde = () => {
  const name = document.getElementById("kunde-name").value;
  const adresse = document.getElementById("kunde-adresse").value;
  const email = document.getElementById("kunde-email").value;
  const telefon = document.getElementById("kunde-telefon").value;

  window.db.run("INSERT INTO kunden (name, adresse, email, telefon) VALUES (?, ?, ?, ?)", [name, adresse, email, telefon]);

  alert("Kunde gespeichert!");
  updateKundenTabelle();

  // Formular leeren
  document.getElementById("kunde-name").value = "";
  document.getElementById("kunde-adresse").value = "";
  document.getElementById("kunde-email").value = "";
  document.getElementById("kunde-telefon").value = "";
};

function updateKundenTabelle() {
  const kunden = window.db.query("SELECT * FROM kunden");
  const body = document.getElementById("kunden-body");

  if (kunden.length === 0) {
    body.innerHTML = '<tr><td colspan="4">Keine Kunden gefunden</td></tr>';
    return;
  }

  body.innerHTML = kunden[0].values
    .map(
      (k) => `
    <tr>
      <td>${k[1]}</td>
      <td>${k[2] || "-"}</td>
      <td>${k[3] || "-"}</td>
      <td>${k[4] || "-"}</td>
    </tr>
  `
    )
    .join("");
}
