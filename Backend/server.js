const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database setup
const dbPath = path.resolve(__dirname, 'events.db'); // Pfad zur SQLite-Datenbank
const db = new sqlite3.Database(dbPath);

// Falls die Datenbank nicht existiert, wird sie erstellt
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT)");

    // Beispiel-Datensatz einfügen, um sicherzustellen, dass die Tabelle Daten enthält
    db.run("INSERT INTO events (event) VALUES (?)", "01.01.2023 - 02.01.2023: New Year Celebration");
});

// Routes
app.get('/api/events', (req, res) => {
    db.all("SELECT event FROM events", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows.map(row => row.event));
    });
});

app.post('/api/events', (req, res) => {
    const events = req.body;

    db.serialize(() => {
        db.run("DELETE FROM events");
        const stmt = db.prepare("INSERT INTO events (event) VALUES (?)");
        events.forEach(event => {
            stmt.run(event);
        });
        stmt.finalize();
    });

    res.status(200).send("Events saved successfully");
});

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});