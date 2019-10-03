import User from '../model/user.model';
import MSFConnect from '../api/api';
import Game from '../model/game.model';
// const Message = require('../twilio/config');

export default class SendSMS {
    msfConnect: MSFConnect;
    constructor() {
        this.msfConnect = new MSFConnect();
    }

    async sendParse() {
        let users = await this.getUsers();
        let games = await this.getGames();
        this.msfConnect.getData().then((gameData) => {
            const gameArray = gameData.scoreboard.gameScore
            //for each game
            gameArray.forEach((gameCurr) => {
                const gameId = gameCurr.game.ID;
                const gameStatus = gameCurr.isCompleted;
                const awayTeamAB = gameCurr.game.awayTeam.Abbreviation;
                const homeTeamAB = gameCurr.game.homeTeam.Abbreviation;
                const awayTeam = gameCurr.game.awayTeam;
                const homeTeam = gameCurr.game.homeTeam;
                const awayScore = gameCurr.awayScore;
                const homeScore = gameCurr.homeScore;
                console.log(`Parsing game ${gameId}.`);
                console.log(gameStatus);
                if (gameStatus === 'true') {
                    let gameExists = games.filter(game => (game.game == gameId));
                    if (gameExists.length === 0) {
                        users.forEach((userArr) => {
                            console.log(userArr.team === awayTeamAB, awayTeamAB);
                            console.log(userArr.team === homeTeamAB, homeTeamAB);
                            if ((userArr.team === awayTeamAB) || (userArr.team === homeTeamAB)) {
                                console.log('SMS Sent');
                            }
                        })
                        this.saveGame(gameId);
                    }
                }
            });
        });
    }

    private async saveGame(id) {
        let activeGames = await this.getGames();
        const gameExists = activeGames.filter(game => (game.game === id));
        if (gameExists.length === 0) {
            let game = new Game({
                game: id
            })
            game.save().then((game) => {
                console.log('Game saved to DB.', game);
            }).catch((e) => {
                console.log(e);
            })
        }
    }

    getUsers() {
        return User.find({}).then((users) => {
            return users;
        })
    }
    
    getGames() {
        return Game.find({}).then((games) => {
            return games;
        })
    }
    
}
