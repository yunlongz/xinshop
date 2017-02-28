var express = require('express');
var router = express.Router();
var format = require('date-format');
let date = format('yyyyMMdd', new Date());
var router = express.Router();
require('express-mongoose');


/* GET users listing. */
router.get('/contacts', function(req, res, next) {
	
    res.send('Data inited'); 
  // res.send('respond with a resource');
});

module.exports = router;
