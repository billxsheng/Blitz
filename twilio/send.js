var keys = require('../db/keys');

var accountSid = keys.twilio.accountSid;
var authToken = keys.twilio.authToken;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


exports.send = function(mobile, homeTeam, awayTeam, homeScore, awayScore, other) {
    client.messages.create({
        body:`Blitz: 
                Final Score:
                ${awayTeam}: ${awayScore}
                ${homeTeam}: ${homeScore}`,
        to:  mobile,
        from: keys.twilio.twilioNum
    }).then((message) => {
        console.log(message.sid);
    });
}

