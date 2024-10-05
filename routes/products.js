var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.db');

router.get('/', (req, res) => {
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE)`, (err) => {
        if (err) {
            return res.send(err); 
        }

        db.run(`INSERT OR IGNORE INTO products (name) VALUES ('product1')`, (err) => {
            if (err) {
                return res.send(err);
            }

            db.all(`SELECT * FROM products`, (err, rows) => {
                if (err) {
                    return res.send(err);
                }

                res.json(rows);
            });
        });
    });
});

 module.exports = router;