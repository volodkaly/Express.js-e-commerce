const express = require('express');
const router = express();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');


db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)`);

db.run(`INSERT OR IGNORE into users (name, email) values 
('john', 'john@new.com'),
('maria','maria@new.com'),
('peter','peter@new.com'),
('kate','kate@new.com')`
);


router.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
