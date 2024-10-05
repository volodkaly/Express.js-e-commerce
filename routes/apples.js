const express = require('express');

const router = express();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db');



db.run(`CREATE TABLE IF NOT EXISTS apples (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  content TEXT
)`);

db.run(`INSERT OR IGNORE into apples (name, content) values 
('apple1', 'good apple'),
('apple2','bad apple'),
('apple3','usual apple')`
);


router.get('/', (req, res) => {
  db.all('SELECT * FROM apples', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;