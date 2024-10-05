const express = require('express');

const router = express();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  content TEXT
)`);

db.run(`INSERT OR IGNORE into tickets (name, content) values 
('ticket1', 'cinema'),
('ticket2','theatre')`
);

router.get('/', (req, res) => {
  db.all('SELECT * FROM tickets', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;