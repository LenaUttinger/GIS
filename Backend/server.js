//Setup
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());                    //Ermöglicht Cross-Origin-Anfragen. Wenn ein Webclient eine Ressource von einer anderen Domäne als der aktuellen Domäne anfordert
app.use(bodyParser.json());         //Parsen von JSON-Daten im Request-Body.

// SQLite database setup
const dbPath = path.resolve(__dirname, 'events.db'); // Pfad zur SQLite-Datenbank
const db = new sqlite3.Database(dbPath);

// Falls die Datenbank nicht existiert, wird sie erstellt
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT)");

    // Beispiel-Datensatz einfügen, um sicherzustellen, dass die Tabelle Daten enthält
    db.run("INSERT INTO events (event) VALUES (?)", "01.01.2023 - 02.01.2023: Neujahr-Party");
});

// Route zum Abrufen der Evente
app.get('/api/events', (req, res) => {                                 //Definiert eine GET-Route zum Abrufen der Events
    db.all("SELECT event FROM events", [], (err, rows) => {            //Führt eine SQL-Abfrage aus, um alle Events abzurufen.
        if (err) {
            res.status(500).send(err.message);                          //Fehlermeldung
            return;
        }
        res.json(rows.map(row => row.event));                       //Andernfalls werden die Events als JSON zurückgegeben.
    });
});

//Route zum Speichern der Evente
app.post('/api/events', (req, res) => {                             //Definiert eine POST-Route zum Speichern der Events.
    const events = req.body;                                        //Liest die Events aus dem Request-Body.

    db.serialize(() => {                                            //Löscht alle vorhandenen Events und fügt die neuen Events ein.
        db.run("DELETE FROM events");
        const stmt = db.prepare("INSERT INTO events (event) VALUES (?)");
        events.forEach(event => {
            stmt.run(event);
        });
        stmt.finalize();                                            //Schließt die vorbereitete Anweisung.
    });

    res.status(200).send("Events saved successfully");
});

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`); 
});