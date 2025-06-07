const db = require("./database");
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

// Kontaktmodul initialisieren
window.initKontakteModule = () => {
  updateKundenTabelle();
};

// Kunde speichern
window.saveKunde = () => {
  const name = document.getElementById("kunde-name").value;
  const adresse = document.getElementById("kunde-adresse").value;
  const email = document.getElementById("kunde-email").value;
  const telefon = document.getElementById("kunde-telefon").value;

  const stmt = db.prepare(`
    INSERT INTO kunden (name, adresse, email, telefon)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(name, adresse, email, telefon);
  alert("Kunde gespeichert!");
  updateKundenTabelle();

  // Formular leeren
  document.getElementById("kunde-name").value = "";
  document.getElementById("kunde-adresse").value = "";
  document.getElementById("kunde-email").value = "";
  document.getElementById("kunde-telefon").value = "";
};

// Hilfsfunktion: Kundentabelle aktualisieren
function updateKundenTabelle() {
  const kunden = db.prepare("SELECT * FROM kunden").all();
  const body = document.getElementById("kunden-body");

  body.innerHTML = kunden
    .map(
      (k) => `
    <tr>
      <td>${k.name}</td>
      <td>${k.adresse || "-"}</td>
      <td>${k.email || "-"}</td>
      <td>${k.telefon || "-"}</td>
    </tr>
  `
    )
    .join("");
}
