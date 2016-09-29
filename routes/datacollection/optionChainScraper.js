"use strict";

var webdriver = require('selenium-webdriver');
var cheerio = require('cheerio');
var fs = require('fs');
var path =require('path');
var sleep = require('sleep');

//Initializing the selenium webdriver to use 'chrome'
var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();

var urlArray = JSON.parse(fs.readFileSync(path.join(__dirname,'url-config.json')));

//function for generating random number between range 
// inclusive min & inclusive max
var getRandomNumber = function(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

//Recursive function which calls the random url from the 'urlArray' and remove the same
//from the array after each iteration.
var getOptionChain = function(tmplen,tmpArray){

	var index = getRandomNumber(0,tmplen-1);
	console.log("Index : "+index+" ==> "+JSON.stringify(tmpArray[index],null,4));
	browser.get(tmpArray[index].url);
	var source = browser.getPageSource();

	//source as promise
	source.then(function (src) {
    
	    var $ = cheerio.load(src);

		scrapeMoneyControl($);

		tmpArray.splice(index,1);
		tmplen = tmplen-1;
		console.log("New array : "+JSON.stringify(tmpArray,null,4));
		
		if(tmplen !== 0){

			var intrvl = getRandomNumber(8,40);
			console.log("Time interval is "+intrvl+" seconds");
			sleep.sleep(intrvl);
			getOptionChain(tmplen,tmpArray);

		}

		console.log("END");

	});
	
};

var scrapeMoneyControl = function($){

	$('.tblopt tr').each(function(i,elem){

		var ltp = $(this).find('td').eq(0).find('strong').text();
		var strike = $(this).find('td').eq(5).find('span').text();
		console.log(strike+" : "+ltp);

	});

}


var scrapeNSE = function(){


}

getOptionChain(urlArray.length,urlArray);


console.log("END");