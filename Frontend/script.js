// Wartet bis HTML vollständig geladen wird
document.addEventListener("DOMContentLoaded", function () {

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
    restoreElements(); // Wiederherstellen der gespeicherten Events

    let button = document.getElementById("saveBtn");        // Button mit der ID saveBtn wird aufgerufen, Klick-Event-Listener hinzugefügt
    button.addEventListener("click", addElement);           // der die Funktion addElement aufruft, wenn der Button geklickt wird.

    async function addElement(event) {                      //https://uhahne.github.io/GIS/lecture/server-request/3 fetch, Promise, async
        event.preventDefault();                             //verhindert das Standardverhalten des Buttons
        console.log("Speichern-Button geklickt");           //Konsole wird angezeigt 'Speichern-Button geklickt'

        let eventNameField = document.getElementById("nameofevent");    //Eingabefelder werden mit der ID ranngeholt
        let startDateField = document.getElementById("startofevent");
        let endDateField = document.getElementById("endofevent");

        let startDate = formatDate(startDateField.value);           //Datum wird formatiert
        let endDate = formatDate(endDateField.value);

        let container = document.getElementById("forum");           //Cointer Element mit der ID 'forum' wird ausgewählt
        let p = document.createElement("p");                        //neues P Element wird erstellt

        p.textContent = `${startDate} - ${endDate}: ${eventNameField.value} `;  //mit folgenden formatierten Werten

        let deleteBtn = document.createElement("button");              //Lösch-Button wird erstellt und hinzugefügt
        deleteBtn.textContent = "delete";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", function () {              //Klick- Event Listener wird zum Lösch-Button hinzugefügt.
            container.removeChild(p);                                  //Beim Klciken wird Element aus dem Container gelöscht
            saveElements();                                            //Aktueller Stand wird gespeichert
        });

        p.appendChild(deleteBtn);                                       //Lösch Button wird neben dem Text angezeigt
        container.insertBefore(p, document.getElementById("formular")); //Text wird oberhalb eingefügt

        eventNameField.value = "";  // Nach Hinzufügen werden die Textfelder wieder geleert
        startDateField.value = "";
        endDateField.value = "";

        await saveElements();       //Aktueller Stand wird gespeichert
                                    //Da die Funktion saveElements ein Promise zurückgibt, wird await verwendet, 
                                    //um sicherzustellen, dass die Funktion vollständig ausgeführt wird
    }                               //Daten asynchron auf dem Server gespeichert

    function formatDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }
        return `${day}.${month}.${year}`;
    }

    async function saveElements() {                                             
        let events = [];                                                           //leeres Array wird angelegt
        let container = document.getElementById("forum");                          //Container mit der ID'forum' wird ausgewählt

        let eventElements = container.querySelectorAll("p");            // alle p Elemente werden dem Container 'eventElements' hinzugefügt

        eventElements.forEach(function (eventElement) {                 
            let eventText = eventElement.textContent.replace("delete", ""); //für jedes p Element in 'eventElements' wird der Text extrahiert
            events.push(eventText);                                         //'delete' Text wird entfernt und der bereinigte Text wird an das Array zurückgegeben.
        });

        console.log("Speichern der Events:", events);

        try {                                                                   //https://uhahne.github.io/GIS/lecture/server-request/9
            let response = await fetch('http://127.0.0.1:3000/api/events', {       //fetch-Request wird an die URL gesendet
                method: 'POST',                                                    //Daten liegen im JSON-Format vor
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(events)                      //body enthält die events, die in einen JSON-String umgewandelt wurden.
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);  //Wenn der Status nicht ok ist, wird eine Fehlermeldung geworfen
            }

            console.log("Events erfolgreich gespeichert");
        } catch (error) {
            console.error('Error saving events:', error);
        }
    }

    async function restoreElements() {                                              //Daten vom Server werden abgerufen und auf der Website angezeigt.
        try {
            let response = await fetch('http://127.0.0.1:3000/api/events');         //fetch-Request wird an die URL gesendet
            let events = await response.json();                                     //wartet die Antwort des Servers ab

            console.log("Wiederhergestellte Events:", events);                      

            let container = document.getElementById("forum");                       //Container mit der ID'forum' wird ausgewählt

            events.forEach(function (eventText) {                                   //Für jedes Event-Text im events-Array wird:
                let p = document.createElement("p");                                //p Element hinzugefügt und Event-Text als Inhalt hinzugefügt
                p.textContent = `${eventText} `;

                let deleteBtn = document.createElement("button");                   //Button mit Namen Delete erstellt
                deleteBtn.textContent = "delete";                                   
                deleteBtn.classList.add("deleteBtn");                               //Button hat ein Event-Click-Listener
                deleteBtn.addEventListener("click", async function () {             
                    container.removeChild(p);                                       //Beim klicken wird aus dem Cointainer entfernt
                    await saveElements();                                           //await stellt sicher, dass das Speichern abgeschlossen ist, 
                                                                                    //bevor die Ausführung fortgesetzt wird. Bedeutet das die Daten auf dem Server aktualisiert werden.
                });

                p.appendChild(deleteBtn);       //p-Element (mit dem Event-Text und dem delete-Button) wird in den Container 'forum' eingefügt.
                container.appendChild(p);
            });
        } catch (error) {
            console.error('Error restoring events:', error); //Wenn ein Fehler beim abrufen oder Verarbeiten auftritt, kommt Fehlermeldung
        }
    }
});

/*  restoreElements();

    let button = document.getElementById("saveBtn");
    button.addEventListener("click", addElement);

    async function addElement(event) {
        event.preventDefault();

        let eventNameField = document.getElementById("nameofevent");
        let startDateField = document.getElementById("startofevent");
        let endDateField = document.getElementById("endofevent");

        let startDate = formatDate(startDateField.value);
        let endDate = formatDate(endDateField.value);

        let container = document.getElementById("forum");
        let p = document.createElement("p");

        p.textContent = `${startDate} - ${endDate}: ${eventNameField.value} `;

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "delete";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", function () {
            container.removeChild(p);
            saveElements();
        });

        p.appendChild(deleteBtn);
        container.insertBefore(p, document.getElementById("formular"));

        eventNameField.value = "";
        startDateField.value = "";
        endDateField.value = "";

        await saveElements();
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }

        if (month < 10) {
            month = "0" + month;
        }
        return `${day}.${month}.${year}`;
    }

    async function saveElements() {
        let events = [];
        let container = document.getElementById("forum");

        let eventElements = container.querySelectorAll("p");

        eventElements.forEach(function (eventElement) {
            let eventText = eventElement.textContent.replace("delete", "");
            events.push(eventText);
        });

        try {
            await fetch('http://127.0.0.1:3000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(events)
            });
        } catch (error) {
            console.error('Error saving events:', error);
        }
    }

    async function restoreElements() {
        try {
            let response = await fetch('http://127.0.0.1:3000/api/events');
            let events = await response.json();

            let container = document.getElementById("forum");

            events.forEach(function (eventText) {
                let p = document.createElement("p");
                p.textContent = `${eventText} `;

                let deleteBtn = document.createElement("button");
                deleteBtn.textContent = "delete";
                deleteBtn.classList.add("deleteBtn");
                deleteBtn.addEventListener("click", async function () {
                    container.removeChild(p);
                    await saveElements();
                });

                p.appendChild(deleteBtn);
                container.appendChild(p);
            });
        } catch (error) {
            console.error('Error restoring events:', error);
        }
    }
});


  //______________________________________________________________________________________________________________
    // Überprüft, ob Daten vorhanden sind
restoreElements();

let button = document.getElementById("saveBtn");
button.addEventListener("click", addElement);

// Funktion, wenn der Button geklickt wird
function addElement(event) {
    // Seite wird nicht neu geladen
    event.preventDefault();

    // Textfelder bei IDs holen
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

    // Delete Button erstellen
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click", function () {
        container.removeChild(p);
        saveElements(); // Daten werden aktualisiert, wenn ein Event gelöscht wird
    });

    // Delete Button wird hinzugefügt
    p.appendChild(deleteBtn);

    // Text wird oberhalb eingefügt
    container.insertBefore(p, document.getElementById("formular"));

    // Nach Eingabe wird Textfeld geleert
    eventNameField.value = "";
    startDateField.value = "";
    endDateField.value = "";

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

    if (month < 10) {
        month = "0" + month;
    }
    return day + "." + month + "." + year;
}

function saveElements() {
    let events = []; //Array wird erstellt
    let container = document.getElementById("forum"); // HTML- ELement mit der ID = forum wird gesucht und container zugewiesen

    let eventElements = container.querySelectorAll("p"); //Alle p Elemente des Containers werden eventElement hinzugefügt

    eventElements.forEach(function (eventElement) {
        let eventText = eventElement.textContent.replace("delete", ""); //Für jedes p Element wird der Textinhalt aufgerufen und das Wort delete enfternt.
        events.push(eventText); //Anschließend wird es in das Array 'events' eingefügt
    });

    localStorage.setItem("events", JSON.stringify(events));
    // Wird im LocalStorage, als JSON, unter "events" gespeichert
}

function restoreElements() {
    let events = JSON.parse(localStorage.getItem("events"));

    if (events) {
        let container = document.getElementById("forum");
        // Eintrag "events" wird aus dem LocalStorage gelesen und als JSON geparst.
        // Ergebnis wird der Variable 'events' zugewiesen

        events.forEach(function (eventText) {
            let p = document.createElement("p"); // Für jedes Ereignis wird ein neues p Element erstellt.
            p.textContent = eventText + " "; // Eingabetext + Leerzeichen

            // Delete Button erstellen
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "delete";
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.addEventListener("click", function () {
                container.removeChild(p);
                saveElements(); // Daten werden aktualisiert, wenn ein Event gelöscht wird
            });

            p.appendChild(deleteBtn);
            container.appendChild(p); // die von oben neue p Elemente werden im container eingefügt
        });
    }
}
});


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
});*/

// _____________________________________________________________________________________________________________
// Footer erstellen

function createFooter() {
    let footer = document.createElement("footer");
    footer.innerHTML = "Seite erstellt bei Lena Uttinger";
    
    document.body.appendChild(footer);
}
createFooter();
// _____________________________________________________________________________________________________________