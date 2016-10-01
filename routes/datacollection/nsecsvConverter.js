
//Converter Class
var Converter = require("csvtojson").Converter;
var fs=require("fs"); 
var moment = require('moment');
var OptionService = require("./../serviceprovider/OptionServiceProvider");

//CSV File Path or CSV String or Readable Stream Object
var csvFileName="./../../data/OPTSTK_SBIN_CE-250_03-07-2016_TO_30-09-2016.csv";

//new converter instance
var csvConverter=new Converter({});

//end_parsed will be emitted once parsing finished
csvConverter.on("end_parsed",function(jsonObj){
    
    console.log(jsonObj)
    for(var i=0; i<jsonObj.length; i++){

    	OptionService.processOptionValues(jsonObj[i]["Symbol"],jsonObj[i]["Underlying Value"],moment(jsonObj[i]["Expiry"],"DD-MMM-YYYY").format('YYYY-MM-DD')
    		,moment(jsonObj[i]["Date"],"DD-MMM-YYYY").format('YYYY-MM-DD'),jsonObj[i]["Strike Price"],jsonObj[i]["Option Type"]
    		,jsonObj[i]["No"][" of contracts"],jsonObj[i]["Open Int"],jsonObj[i]["Change in OI"],jsonObj[i]["Close"]);
    }
    

});

//read from file
fs.createReadStream(csvFileName).pipe(csvConverter);


//function(scrip,spot_price,expiry,cur_date,strike,type,volume,oi,change_in_oi,current_option_price){

	/*Symbol: 'SBIN',
    Date: '30-Sep-2016',
    Expiry: '27-Oct-2016',
    'Option Type': 'CE',
    'Strike Price': 250,
    Open: 8.55,
    High: 11,
    Low: 8.3,
    Close: 10.1,
    LTP: 10.3,
    'Settle Price': 10.1,
    No: { ' of contracts': 1423 },
    'Turnover in Lacs': 11093.6,
    'Premium Turnover in Lacs': 421.1,
    'Open Int': 1815000,
    'Change in OI': 147000,
    'Underlying Value': 251.25 }*/