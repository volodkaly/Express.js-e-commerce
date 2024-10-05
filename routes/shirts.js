const express = require('express');
router = express();

router.get('/',(req,res)=>res.json('shirt1, shirt2'));

module.exports = router;