console.log("✅ artikel.js erfolgreich geladen!");

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateArtikelTabelle, 100); // 🔹 Gibt der HTML-Struktur etwas Zeit zum Laden
});

function updateArtikelTabelle() {
  window.api
    .getArtikel()
    .then((artikel) => {
      const body = document.getElementById("artikel-body");
      body.innerHTML = artikel
        .map(
          (artikel) => `
      <tr>
        <td>${artikel.bezeichnung}</td>
        <td>${artikel.preis.toFixed(2)}€</td>
        <td>${artikel.mwst}%</td>
        <td>
          <button class="edit" onclick="editArtikel(${artikel.id})">Bearbeiten</button>
          <button class="delete" onclick="deleteArtikel(${artikel.id})">Löschen</button>
        </td>
      </tr>
    `
        )
        .join("");
    })
    .catch((err) => {
      console.error("❌ Fehler beim Laden der Artikel:", err);
    });
}

function saveArtikel() {
  const bezeichnung = document.getElementById("artikel-bezeichnung").value.trim();
  const preis = parseFloat(document.getElementById("artikel-preis").value);

  if (!bezeichnung || isNaN(preis) || preis <= 0) {
    console.error("❌ Fehler: Ungültige Eingaben!");
    return;
  }

  console.log(`✅ Speichere Artikel: ${bezeichnung}, Preis: ${preis}€`);

  window.api
    .saveArtikel(bezeichnung, preis)
    .then(() => {
      updateArtikelTabelle(); // 🔹 Nach dem Speichern direkt die Tabelle neu laden
    })
    .catch((err) => {
      console.error("❌ Fehler beim Speichern in SQL:", err);
    });

  document.getElementById("artikel-bezeichnung").value = "";
  document.getElementById("artikel-preis").value = "";
}

function deleteArtikel(id) {
  window.api
    .deleteArtikel(id)
    .then(() => {
      updateArtikelTabelle(); // 🔹 Nach Löschen die Tabelle aktualisieren
      console.log(`🗑️ Artikel ${id} aus SQL gelöscht.`);
    })
    .catch((err) => {
      console.error("❌ Fehler beim Löschen:", err);
    });
}

function editArtikel(id) {
  const bezeichnung = prompt("Neue Bezeichnung eingeben:");
  const preis = parseFloat(prompt("Neuer Preis eingeben:"));
  const mwst = parseFloat(prompt("Neue MwSt eingeben:"));

  if (!bezeichnung || isNaN(preis) || isNaN(mwst)) {
    console.error("❌ Fehler: Ungültige Eingaben!");
    return;
  }

  console.log(`✏️ Bearbeite Artikel ${id}: ${bezeichnung}, ${preis}€, MwSt: ${mwst}%`);

  window.api
    .editArtikel(id, bezeichnung, preis, mwst)
    .then(() => {
      updateArtikelTabelle(); // 🔹 Nach Bearbeiten die Tabelle neu laden
    })
    .catch((err) => {
      console.error("❌ Fehler beim Bearbeiten:", err);
    });
}
