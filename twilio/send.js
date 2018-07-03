var keys = require('../db/keys');

var accountSid = keys.twilio.accountSid;
var authToken = keys.twilio.authToken;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


exports.send = function(mobile, homeTeamCity, homeTeamName, awayTeamCity, awayTeamName, homeScore, awayScore, other) {
    client.messages.create({
        body:`Blitz: 
                Final Score:
                ${awayTeamCity} ${awayTeamName}: ${awayScore}
                ${homeTeamName} ${homeTeamCity}: ${homeScore}`,
        to:  mobile,
        from: keys.twilio.twilioNum
    }).then((message) => {
        console.log(message.sid);
    });
}

