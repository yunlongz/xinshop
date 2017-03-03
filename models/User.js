var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = new Schema({
	username: { type : String, default : '' },
	 _jewelry: [{ type: ObjectId, ref: 'Jewelry' }],
	createdAt: { type : Date, default : Date.now }
})

exports.User = mongoose.model('User', User);