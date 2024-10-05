const express = require('express');

const router = express();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db');


router.get('/', (req, res) => {
    
    db.run(`CREATE TABLE IF NOT EXISTS eggs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        content TEXT
      )`, (err) => {
      if (err) {
        res.status(500).json({ error: 'Database error during table creation' });
        return;
      }
      
      
      db.run(`INSERT OR IGNORE INTO eggs (name, content) VALUES 
        ('egg1', 'good egg'),
        ('egg2', 'bad egg'),
        ('egg3', 'usual egg')`, (err) => {
        if (err) {
          res.status(500).json({ error: 'Database error during data insertion' });
          return;
        }
        
        
        db.all('SELECT * FROM eggs', (err, rows) => {
          if (err) {
            res.status(500).json({ error: 'Database error during data retrieval' });
            return;
          }
          res.json(rows);
        });
      });
    });
  });


module.exports = router;
