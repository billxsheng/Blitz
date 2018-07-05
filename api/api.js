const MySportsFeeds = require('mysportsfeeds-node');
const keys = require("../db/keys");

var msf = new MySportsFeeds("1.2", true);

var msf = new MySportsFeeds("1.2", true, null);

msf.authenticate("billxsheng", keys.api.password);

var today = new Date();




exports.getData = function () {

    return msf.getData('nfl', '2017-2018-regular', 'scoreboard', 'json', {
        fordate: today.getFullYear() +
            ('0' + parseInt(today.getMonth() + 1)).slice(-2) +
            ('0' + today.getDate()).slice(-2),
        force: true
    });
    
}

