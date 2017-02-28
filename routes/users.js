var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
	console.log()
	let name = req.param('username');
	let password = req.param('password');
	if(name == 123 && password == 123){

	}
	res.json( {
			name:name,
			id:name,
			rs:1,
			token:'token',
			avatar:'images/login-image.png'
		})
  // res.send('respond with a resource');
});

module.exports = router;
