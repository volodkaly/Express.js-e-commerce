const express = require('express');

const router = express();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db');






router.get('/', (req, res) => {

  // Create table if it does not exist
  db.run(`CREATE TABLE IF NOT EXISTS balls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    content TEXT
  )`, (err) => {
    if (err) {
      res.status(500).json({ error: 'Database error during table creation' });
      return;
    }
    
    // Insert values if they do not already exist
    db.run(`INSERT OR IGNORE INTO balls (name, content) VALUES 
      ('ball1', 'good ball'),
      ('ball2', 'bad ball'),
      ('ball3', 'usual ball')`, (err) => {
      if (err) {
        res.status(500).json({ error: 'Database error during table insert' });
        return;
      }

      // Retrieve and send data from the table
      db.all('SELECT * FROM balls', (err, rows) => {
        if (err) {
          res.status(500).json({ error: 'Database error' });
          return;
        }
        res.json(rows);
      });
    });
  });
});


module.exports = router;