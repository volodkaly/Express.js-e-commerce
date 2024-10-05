const express = require('express');

const router = express();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db');






router.get('/', async (req, res) => {



    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        content TEXT
      )`);
      
    db.run(`INSERT OR IGNORE into books (name, content) values 
      ('book1', 'good book'),
      ('book2','bad book'),
      ('book3','usual book')`
      );


    db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });

  
});

module.exports = router;