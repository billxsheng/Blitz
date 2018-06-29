const MySportsFeeds = require('mysportsfeeds-node');
const keys = require("../db/keys");
const request = require('request');

var msf = new MySportsFeeds("1.2", true, null);

msf.authenticate("billxsheng", keys.api.password);


var data = module.statics = module.exports;

var data = msf.getData('nfl', '2015-2016-regular', 'cumulative_player_stats', 'json', {team: 'dallas-cowboys'});

//var data = request.get('https://api.mysportsfeeds.com/v1.2/pull/nfl/{2017-regular}/scoreboard.{json}?fordate={20170907}', (err, res, body) => {
 

console.log(data);


//var data = msf.getData('nba', '2017-2018-regular', 'scoreboard', 'json', {} );





// (function(callback) {
//     'use strict';
// const httpTransport = require('https');
//     const responseEncoding = 'utf8';
//     const httpOptions = {
//         hostname: 'www.mysportsfeeds.com',
//         port: '443',
//         path: "/v1.2/pull/nhl/{season-name}/scoreboard.{format}?fordate={for-date}",
//         method: 'GET',
//         headers: {"Authorization":"Basic " + btoa( "billxsheng"  + ":" + keys.api.password)}
//     };
//     httpOptions.headers['User-Agent'] = 'node ' + process.version;
 
//     const request = httpTransport.request(httpOptions, (res) => {
//         let responseBufs = [];
//         let responseStr = '';
        
//         res.on('data', (chunk) => {
//             if (Buffer.isBuffer(chunk)) {
//                 responseBufs.push(chunk);
//             }
//             else {
//                 responseStr = responseStr + chunk;            
//             }
//         }).on('end', () => {
//             responseStr = responseBufs.length > 0 ? 
//                 Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
            
//             callback(null, res.statusCode, res.headers, responseStr);
//         });
        
//     })
//     .setTimeout(0)
//     .on('error', (error) => {
//         callback(error);
//     });
//     request.write("")
//     request.end();
// })((error, statusCode, headers, body) => {
//     console.log('ERROR:', error); 
//     console.log('STATUS:', statusCode);
//     console.log('HEADERS:', JSON.stringify(headers));
//     console.log('BODY:', body);
// });
