let benutzerDaten = [];

// Funktion zum Herunterladen der CSV-Vorlage
function downloadCSV() {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "name,email,password\n"
    + "Max Mustermann,max@mustermann.ch,pass1234\n"
    + "Anna Beispiel,anna@beispiel.ch,abc12345\n"
    + "Frank Test,frank@test.ch,xyz98765";
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Benutzerliste_Vorlage.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// CSV-Datei lesen und Daten in JSON umwandeln
document.getElementById('csvFileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        benutzerDaten = results.data;
        console.log("CSV-Daten geladen:", benutzerDaten);
      },
      error: (error) => {
        console.error("WARNUNG: Lesen der CSV-Datei nicht möglich:", error);
      }
    });
  }
});

async function generatePDF() {
  const organisation = document.getElementById('organisation').value;

  if (!organisation) {
    alert("Bitte eine Organisation eingeben.");
    return;
  }

  if (benutzerDaten.length === 0) {
    alert("Bitte zuerst CSV-Datei hochladen.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Titel und Einleitung hinzufügen (Text bleibt schwarz)
  doc.setFontSize(18);
  doc.text(`Zugangsblatt für ${organisation}`, 20, 20);
  doc.setFontSize(12);
  doc.text("Hier sind alle Anmeldedaten für die Benutzer", 20, 30);

  // Tabelle erstellen und Daten hinzufügen
  const tableData = benutzerDaten.map((benutzer) => [
    benutzer.name,
    benutzer.email,
    benutzer.password
  ]);

  doc.autoTable({
    head: [["Name", "E-Mail", "Passwort"]],
    body: tableData,
    startY: 40,
    theme: "grid",
    headStyles: {
      fillColor: "008000", // Blau für Tabellenkopf
      textColor: "#FFFFFF"  // Weißer Text im Tabellenkopf
    }
  });

  // Sicherheits-Hinweis hinzufügen
  doc.text("Bitte bewahren Sie dieses Zugangsblatt sicher auf und geben sie es keinem den sie nicht Vertrauen.", 20, doc.lastAutoTable.finalY + 10);

  // PDF speichern
  doc.save(`Zugangsblatt_${organisation}.pdf`);
  location.reload
}