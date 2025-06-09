// src/kontakte.js
window.api.getKunden().then((kunden) => {
  console.log("Kunden-Daten:", kunden);
});

function loadKontakteModule() {
  document.getElementById("module-container").innerHTML = window.kontakteModuleHTML();
  window.initKontakteModule();
}

// Funktion zur HTML-Darstellung des Kundenmoduls
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

// Funktion zur Initialisierung des Moduls
window.initKontakteModule = () => {
  updateKundenTabelle();
};

// Funktion zum Speichern eines neuen Kunden
window.saveKunde = () => {
  const name = document.getElementById("kunde-name").value.trim();
  const adresse = document.getElementById("kunde-adresse").value.trim();
  const email = document.getElementById("kunde-email").value.trim();
  const telefon = document.getElementById("kunde-telefon").value.trim();

  if (!name) {
    alert("Bitte einen Namen eingeben!");
    return;
  }

  window.api
    .saveKunde(name, adresse, email, telefon)
    .then(() => {
      console.log("Kunde erfolgreich gespeichert!");
      updateKundenTabelle();

      // Formular zurücksetzen
      document.getElementById("kunde-name").value = "";
      document.getElementById("kunde-adresse").value = "";
      document.getElementById("kunde-email").value = "";
      document.getElementById("kunde-telefon").value = "";
    })
    .catch((err) => {
      console.error("Fehler beim Speichern des Kunden:", err);
      alert("Fehler beim Speichern!");
    });
};

// Funktion zum Laden der Kundenliste
function updateKundenTabelle() {
  window.api
    .getKunden()
    .then((kunden) => {
      const body = document.getElementById("kunden-body");
      if (!kunden.length) {
        body.innerHTML = '<tr><td colspan="4">Keine Kunden gefunden</td></tr>';
        return;
      }

      body.innerHTML = kunden
        .map(
          (kunde) => `
      <tr>
        <td>${kunde.name}</td>
        <td>${kunde.adresse || "-"}</td>
        <td>${kunde.email || "-"}</td>
        <td>${kunde.telefon || "-"}</td>
      </tr>
    `
        )
        .join("");
    })
    .catch((err) => {
      console.error("Fehler beim Laden der Kunden:", err);
      alert("Fehler beim Laden!");
    });
}
