document.addEventListener("DOMContentLoaded", function() {
    // Function to create the header
    function createHeader() {
      let header = document.getElementById("myHeader");
  
      // Links erstellen
      let links = [
        { href: "index.html", text: "Hauptseite" },
        { href: "evente.html", text: "Evente" },
        { href: "anforderungen.html", text: "Anforderungen" },
        { href: "fuehrung.html", text: "Führung" },
        { href: "gildenregeln.html", text: "Gildenregeln" },
        { href: "kontakt.html", text: "Kontakt" },
      ];
  
      // Links zum Header hinzufügen
      links.forEach((link, index) => {
        let a = document.createElement("a");
        a.href = link.href;
        a.innerHTML = link.text;
  
        // Füge das Linkelement zum Header hinzu
        header.appendChild(a);
  
        // Füge das Trennzeichen " | " hinzu, außer für das letzte Element
        if (index < links.length - 1) {
          let separator = document.createTextNode(" | ");
          header.appendChild(separator);
        }
      });
    }
    createHeader();
  

    let button = document.getElementById("saveBtn");
    button.addEventListener("click", addElement);

    // Define the function to execute when the button is clicked
    function addElement(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the text field elements by their IDs
        let eventNameField = document.getElementById("nameofevent");
        let startDateField = document.getElementById("startofevent");
        let endDateField = document.getElementById("endofevent");

        // Format the date in German format "Tag.Monat.Jahr"
        let startDate = formatDate(startDateField.value);
        let endDate = formatDate(endDateField.value);

        // Get the container element that contains the input field and the button
        let container = document.getElementById("forum");

        // Create a new paragraph element
        let p = document.createElement("p");

        // Set the text content of the paragraph
        p.textContent = startDate + " - " + endDate + ": " + eventNameField.value + " ";

        // Insert the new paragraph above the input field
        container.insertBefore(p, document.getElementById("formular"));

        // Clear the text fields after adding the paragraph
        eventNameField.value = "";
        startDateField.value = "";
        endDateField.value = "";

        // Create a delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "delete";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", function() {
            container.removeChild(p); // Remove the paragraph when delete button is clicked
        });

        // Append the delete button to the paragraph
        p.appendChild(deleteBtn);
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // Füge führende Null hinzu, falls der Tag einstellig ist
        if (day < 10) {
            day = "0" + day;
        }
        
        if (month <10){
            month = "0" + month;
        }
        return day + "." + month + "." + year;
    }
});

function createFooter() {
    let footer = document.createElement("footer");
    footer.innerHTML = "Seite erstellt bei Lena Uttinger";

    // Append the footer to the body
    document.body.appendChild(footer);
}
createFooter();