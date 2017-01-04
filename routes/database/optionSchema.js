var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionSchema = new Schema({
	scrip : { type: String, required: true },
	spot : { type: Number },
	date : { type: Date, required: true },
	expiry : { type: Date, required: true },
	strike : { type: Number, required: true },
	type : { type: String, required: true },
	chain : {
		price : { type: Number, required: true },
		iv : { type: Number },
		volume : { type: Number},
		oi : { type: Number},
		change_in_oi : { type: Number }
	},
	greeks : {
		delta : { type: Number },
		gamma : { type: Number },
		rho : { type: Number },
		theta : { type: Number },
		vega : { type: Number }
	}
});

module.exports.optionSchema = optionSchema;