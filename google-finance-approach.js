const express = require('express')
const app = express()
const sha256 = require('sha256')
const api_key = 'egsewsabj082clgl'
const api_secret = 'zr03ngqmde9m0hi19k31wu9mhh8bp94c'
const request = require('request')
const rp = require('request-promise-native')
const bodyParser = require('body-parser')
const session = require('client-sessions')
const curl = require('curlrequest');
const cheerio = require('cheerio');

//wget https://www.reuters.com/finance/stocks/financial-highlights/HDBK.NS
//wget http://finance.google.com/finance/info?client=ig&q=APPL,FB

/*
var options = {
    url: 'https://finance.google.com/finance?q=8306&ei=dD59WrmoJMWh0ASjt7noDw'
  , verbose: true
  , stderr: true
};
 
curl.request(options, function (err, data) {
    //.. 
    console.log(data)
});
*/

var fs = require('fs'); //finance?q=8306
fs.readFile('finance?q=8306', 'utf8', function(err, contents) {
    //console.log(contents);
    var lines = contents.split("\n")
    for(var lineindex = 0; lineindex < lines.length; lineindex++){
    	if(lines[lineindex].includes("setCompanyId("))
    	{
    		//console.log(lines[lineindex])
    		var companyid = lines[lineindex].replace("setCompanyId(","")
    		companyid = companyid.replace(");","")
    		console.log(companyid)
    	}
    }
});
 
console.log('after calling readFile');

var mapping = [
{
	'area': 'Valuation Ratios',
	'data': [
	{
		'id': 'P/E Ratio (TTM)',
		'range': [53, 54, 55]
	},
	{
		'id': 'P/E High - Last 5 Yrs.',
		'range': [56, 57, 58]
	}
	]
}
]

fs.readFile('HDBK.NS', 'utf8', function(err, contents) {
    //console.log(contents);
     const $ = cheerio.load(contents);
     /*
     $('h2.title').text('Hello there!')
     $('h2').addClass('welcome');
     $.html();
     */
     //console.log($('.moduleBody').html()) //moduleHeader
     //console.log($('.stripe').text()) 
     //console.log($('.data')[54].text())
     console.log($('.data')[53].children[0].data)
});