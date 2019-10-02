import {keys} from "../db/keys"
import MySportsFeeds from 'mysportsfeeds-node';

export default class MSFConnect {
    private msf;

    constructor() {
        this.msf = new MySportsFeeds("1.2", true, null);
        this.msf.authenticate("billxsheng", keys.api.password);
    }

    getData() {
        let today = new Date();
        return this.msf.getData('nfl', '2017-2018-regular', 'scoreboard', 'json', {
            fordate: today.getFullYear() +
                ('0' + (today.getMonth() + 1)).slice(-2) +
                ('0' + today.getDate()).slice(-2),
            force: true
        });  
    }
}

