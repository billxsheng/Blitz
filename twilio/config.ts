import { keys } from '../db/keys';
import twilio from 'twilio';

export class TwilioConfig {
    private client;

    constructor() {
        let accountSid = keys.twilio.accountSid;
        let authToken = keys.twilio.authToken;
        this.client = twilio(accountSid, authToken);
    }

    send(mobile, homeTeamCity, homeTeamName, awayTeamCity, awayTeamName, homeScore, awayScore, other) {
        console.log('twilio method called')
        console.log(mobile);
        this.client.messages.create({
            body: `
            Blitz 
                    FINAL
                    ${awayTeamCity} ${awayTeamName}: ${awayScore}
                    ${homeTeamCity} ${homeTeamName}: ${homeScore}`,
            to: mobile,
            from: keys.twilio.twilioNum
        }).then((message) => {
            console.log(message.sid);
        });
    } 
}
