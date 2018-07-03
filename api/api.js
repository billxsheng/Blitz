const MySportsFeeds = require('mysportsfeeds-node');
const keys = require("../db/keys");
const request = require('request');
const httpTransport = require('https');

var msf = new MySportsFeeds("1.2", true);

var msf = new MySportsFeeds("1.2", true, null);

msf.authenticate("billxsheng", keys.api.password);

var today = new Date();

exports.getData = function () {

    // return msf.getData('nfl', '2017-2018-regular', 'scoreboard', 'json', {
    //     fordate: today.getFullYear() +
    //         ('0' + parseInt(today.getMonth() + 1)).slice(-2) +
    //         ('0' + today.getDate()).slice(-2),
    //     force: true
    // });

    return msf.getData('nfl', '2017-2018-regular', 'scoreboard', 'json', {
        fordate: '20170917',
        force: true
    });


}

