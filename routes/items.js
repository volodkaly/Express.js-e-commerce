var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db');


router.get('/', (req, res) => {
    
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        content TEXT
      )`, (err) => {
      if (err) {
        res.status(500).json({ error: 'Database error during table creation' });
        return;
      }
      
      
      db.run(`INSERT OR IGNORE INTO items (name, content) VALUES 
        ('item1', 'good item'),
        ('item2', 'bad item'),
        ('item3', 'usual item')`, (err) => {
        if (err) {
          res.status(500).json({ error: 'Database error during data insertion' });
          return;
        }
        
        
        db.all('SELECT * FROM items', (err, rows) => {
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