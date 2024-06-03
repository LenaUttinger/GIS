// Wartet bis HTML vollständig geladen wird
document.addEventListener("DOMContentLoaded", function() {
  // Funktion zum Header erstellen
  function createHeader() {
      let header = document.getElementById("myHeader");

      // Links erstellen
      let links = [
          { href: "index.html", text: "Startseite" },
          { href: "evente.html", text: "Evente" },
          { href: "anforderungen.html", text: "Anforderungen" },
          { href: "fuehrung.html", text: "Führung" },
          { href: "gildenregeln.html", text: "Gildenregeln" },
          { href: "kontakt.html", text: "Kontakt" }
      ];

      // Links zum Header hinzufügen
      links.forEach((link, index) => {
          let a = document.createElement("a");
          a.href = link.href;
          a.innerHTML = link.text;

          header.appendChild(a);

          // Trennzeichen
          if (index < links.length - 1) {
              let separator = document.createTextNode(" | ");
              header.appendChild(separator);
          }
      });
  }
  createHeader();
//____________________________________________________________________________________________________________________________

    // überprüft, ob Daten vorhanden sind
    restoreElements();

    let button = document.getElementById("saveBtn");
    button.addEventListener("click", addElement);

    // Funktion, wenn der Button geklickt wird
    function addElement(event) {
        //Seite wird nicht neu geladen
        event.preventDefault();

        // Textfeld bei IDs holen
        let eventNameField = document.getElementById("nameofevent");
        let startDateField = document.getElementById("startofevent");
        let endDateField = document.getElementById("endofevent");

        // Datum formatieren "Tag.Monat.Jahr"
        let startDate = formatDate(startDateField.value);
        let endDate = formatDate(endDateField.value);

        let container = document.getElementById("forum");

        let p = document.createElement("p");

        // Kontext 
        p.textContent = startDate + " - " + endDate + ": " + eventNameField.value + " ";

        // Text wird oberhalb eingefügt
        container.insertBefore(p, document.getElementById("formular"));

        // Nach Eingabe wird Textfeld geleert
        eventNameField.value = "";
        startDateField.value = "";
        endDateField.value = "";

        // Delete Button erstellen
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "delete";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", function() {
            container.removeChild(p); 
            saveElements(); // Daten werden aktualisiert, wenn ein Event gelöscht wird
        });

        // Delete Button wird hinzugefügt
        p.appendChild(deleteBtn);

        saveElements(); // Daten werden aktualisiert, wenn ein Event hinzugefügt wird
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // Im Datum wird eine "0" hinzugefügt
        if (day < 10) {
            day = "0" + day;
        }

        if (month <10){
            month = "0" + month;
        }
        return day + "." + month + "." + year;
    }

    function saveElements() {
        let formularContent = document.getElementById("formular").innerHTML;
        localStorage.setItem("formularContent", formularContent);
    }

    function restoreElements() {
        let formularContent = localStorage.getItem("formularContent");
        if (formularContent) {
            document.getElementById("formular").innerHTML = formularContent;
        }
    }
});

// _____________________________________________________________________________________________________________
// Footer erstellen

function createFooter() {
    let footer = document.createElement("footer");
    footer.innerHTML = "Seite erstellt bei Lena Uttinger";
    
    document.body.appendChild(footer);
}
createFooter();
// _____________________________________________________________________________________________________________