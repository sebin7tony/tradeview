

var moment = require('moment');
var cp = require('child_process')
//Importing the database service provider
var MongoServiceProvider = require('/../database/MongoServiceProvider.js');

var output = {};

var tmp = {
	scrip : "SBI",
	date : moment().format('YYYY MM DD'),
	expiry : moment().format('YYYY MM DD'),
	strike : 275,
	type : "CE",
	price : 123,
	iv : 234,
	volume : 432,
	oi : 43,
	change_in_oi : 34,
	delta : 0.12,
	gamma : 0.32,
	rho : -23.3,
	theta : -0.67,
	vega : 123	
};


/*{
    "scrip": "SBI",
    "spot_price": 248.95,
    "date": "2016-09-27",
    "expiry": "2016-09-29",
    "strike": 265,
    "type": "CE",
    "volume": 1,
    "oi": 1,
    "change_in_oi": 1,
    "current_option_price": 0.15,
    "iv": 0.4801,
    "delta": 0.0422,
    "gamma": 0.0102,
    "rho": 0.0006,
    "theta": -0.202,
    "vega": 0.0166
}*/



/*scrip : optionValues.scrip,
		price : optionValues.spot_price,
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
		}*/


output.processOptionValues = function(scrip,spot_price,expiry,cur_date,strike,type,volume,oi,change_in_oi,current_option_price){

	var tmpOptionValues = {};

	if(scrip !== "" |scrip !== undefined ){

		tmpOptionValues["scrip"] = scrip; 
	}
	else{

		console.log("Unexpected parametes");
	}

	if(spot_price !== undefined ){

		tmpOptionValues["spot_price"] = spot_price; 
	}
	else{

		console.log("Unexpected parametes strike");
	}


	if( moment(cur_date,'YYYY-MM-DD').isValid()){

		tmpOptionValues["date"] = cur_date; 
	}
	else{

		console.log("Expiry passed is not in right format");
	}
	
	if( moment(expiry,'YYYY-MM-DD').isValid()){

		tmpOptionValues["expiry"] = expiry; 
	}
	else{

		console.log("Expiry passed is not in right format");
	}
	
	if(strike !== undefined ){

		tmpOptionValues["strike"] = strike; 
	}
	else{

		console.log("Unexpected parametes strike");
	}

	if(type !== "" |type !== undefined ){

		tmpOptionValues["type"] = type; 
	}
	else{

		console.log("Unexpected parametes");
	}

	if(volume !== undefined ){

		tmpOptionValues["volume"] = volume; 
	}
	else{

		console.log("Unexpected parametes");
	}
 
	if(oi !== undefined ){

		tmpOptionValues["oi"] = oi; 
	}
	else{

		console.log("Unexpected parametes");
	}

	if(change_in_oi !== undefined ){

		tmpOptionValues["change_in_oi"] = change_in_oi; 
	}
	else{

		console.log("Unexpected parametes");
	}

	if(current_option_price !== undefined ){

		tmpOptionValues["current_option_price"] = current_option_price; 
	}
	else{

		console.log("Unexpected parametes");
	}

	// Building string to pass to python option calculator
	var string_to_pass = '{"type" : "'+tmpOptionValues["type"]+'","spot_price" : '+ tmpOptionValues["spot_price"] +',"strike" : '+tmpOptionValues["strike"]+',"current_date" : "'+tmpOptionValues["date"]+'","expiry_date" : "'+tmpOptionValues["expiry"]+'","current_option_price" : '+tmpOptionValues["current_option_price"]+'}\n';


	//code for python script to return
	var child = cp.exec('python OptionCalculator.py',function(error, stdout, stderr){

		if(error){

			console.log(error);
		}
		
		var output = JSON.parse(stdout);

		tmpOptionValues["iv"] = output['iv'];
		tmpOptionValues["delta"] = output['greeks']['delta'];	
		tmpOptionValues["gamma"] = output['greeks']['gamma'];
		tmpOptionValues["rho"] = output['greeks']['rho'];
		tmpOptionValues["theta"] = output['greeks']['theta'];
		tmpOptionValues["vega"] = output['greeks']['vega'];

		//console.log(JSON.stringify(tmpOptionValues,null,4));
		MongoServiceProvider.saveOptionValues(tmpOptionValues)

	});

	child.stdin.setEncoding('utf-8');
	child.stdout.setEncoding('utf-8');
	//child.stdout.pipe(process.stdout);
	child.stdin.write(string_to_pass);

};

output.processOptionValues("BHEL",144.35,"2016-10-06","2016-09-27",150.00,"CE",995000,1445000,365000,4.30);

//MongoServiceProvider.saveOptionValues(tmp)




