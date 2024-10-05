const express = require('express');

const router = express();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db');


router.get('/', (req, res) => {
    
    db.run(`CREATE TABLE IF NOT EXISTS papers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        content TEXT
      )`, (err) => {
      if (err) {
        res.status(500).json({ error: 'Database error during table creation' });
        return;
      }
      
      
      db.run(`INSERT OR IGNORE INTO papers (name, content) VALUES 
        ('paper1', 'good paper'),
        ('paper2', 'bad paper'),
        ('paper3', 'usual paper')`, (err) => {
        if (err) {
          res.status(500).json({ error: 'Database error during data insertion' });
          return;
        }
        
        
        db.all('SELECT * FROM papers', (err, rows) => {
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