var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	username: { type : String, default : '' },
	 _jewelry: [{ type: ObjectId, ref: 'Jewelry' }]
	createdAt: { type : Date, default : Date.now }
})

exports.Jewelry = mongoose.model('Jewelry', Jewelry);