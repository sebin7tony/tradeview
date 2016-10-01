var mongoose = require("mongoose");
var Options = require("./optionSchema.js");

var dbURI = "mongodb://localhost:27017/myFirstMB";

//Connect to the database
mongoose.connect(dbURI);
//Get the db connection instance
var db = mongoose.connection;

// When successfully connected
db.on('connected', function () {

  	console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
db.on('error',function (err) {  
  
  	console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
db.on('disconnected', function () {  
  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

var closeMongoDB = function(){

	mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected'); 
    process.exit(0); 
  });
}



//define the models
var OptionHolder = mongoose.model('OptionHolder',Options.optionSchema);


module.exports.OptionHolder = OptionHolder; 
module.exports.closeMongoDB = closeMongoDB; 