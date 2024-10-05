const express = require('express');

const router = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../database.db');

router.get('/',(req,res)=>res.send('crown1,crown2'));

module.exports = router;