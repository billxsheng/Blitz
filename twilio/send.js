var keys = require('../db/keys');

var accountSid = keys.twilio.accountSid;
var authToken = keys.twilio.authToken;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
//test
client.messages.create({
    body:`Blitz: `,
    to:  keys.twilio.personalNum,
    from: keys.twilio.twilioNum
}).then((message) => {
    console.log(message.sid);
});

module.exports = {
    client
}