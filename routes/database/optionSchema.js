var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionSchema = new Schema({
	scrip : { type: String, required: true },
	spot : { type: Number, required: true },
	date : { type: Date, required: true },
	expiry : { type: Date, required: true },
	strike : { type: Number, required: true },
	type : { type: String, required: true },
	chain : {
		price : { type: Number, required: true },
		iv : { type: Number, required: true },
		volume : { type: Number, required: true },
		oi : { type: Number, required: true },
		change_in_oi : { type: Number, required: true }
	},
	greeks : {
		delta : { type: Number, required: true },
		gamma : { type: Number, required: true },
		rho : { type: Number, required: true },
		theta : { type: Number, required: true },
		vega : { type: Number, required: true }
	}
});

module.exports.optionSchema = optionSchema;