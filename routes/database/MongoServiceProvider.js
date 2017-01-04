// Author : Sebin Tony                                                                                     //
//                                                                                                         //
// This is a module that deals with all the database related functions. So this module should act as the   // 
// service provider to other modules. And all database related calls has to go through this layer.         // 
//                                                                                                         //

//Importing all the mongoose models defined
var Models = require('./models.js');
var output = {};


// Saving Option Values to Mongo Database
// @param - optionValues is a js object holding all values of option chain
// including the greeks.
output.saveOptionValues = function(optionValues){

	if(optionValues.scrip === "" | optionValues.expiry === "" | optionValues.strike === 0 | optionValues.type === "" ){

		console.log("Please check the input values");
	}

	if(optionValues.scrip === undefined | optionValues.expiry === undefined | optionValues.date === undefined | optionValues.spot_price === undefined | optionValues.strike === undefined | optionValues.type === undefined | 
		optionValues.current_option_price === undefined | optionValues.iv === undefined | optionValues.volume === undefined | optionValues.oi === undefined | 
		optionValues.change_in_oi === undefined | optionValues.delta === undefined | optionValues.gamma === undefined | 
		optionValues.rho === undefined | optionValues.theta === undefined | optionValues.vega === undefined ) {

		console.log("Undefined argument value in saveOption method");
	}

	//Creating the Model for mongoose
	var OptionModel = Models.OptionHolder({
		scrip : optionValues.scrip,
		spot : optionValues.spot_price,
		date : optionValues.date,
		expiry : optionValues.expiry,
		strike : optionValues.strike,
		type : optionValues.type,
		chain : {
			price : optionValues.current_option_price,
			iv : optionValues.iv,
			volume : optionValues.volume,
			oi : optionValues.oi,
			change_in_oi : optionValues.change_in_oi
		},
		greeks : {
			delta : optionValues.delta,
			gamma : optionValues.gamma,
			rho : optionValues.rho,
			theta : optionValues.theta,
			vega : optionValues.vega
		}	
	});


	//Saving model to MongoDB
	OptionModel.save(function(error){

		if(error){
			
			console.log("Error : "+error);
		}
		else{

			console.log("Option Values are saved to database successfully");	
		}
		//closing mongodb connection
		//Models.closeMongoDB();
		
	});

}


module.exports = output; 