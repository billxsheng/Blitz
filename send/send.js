const User = require('../model/user-model');
const api = require('../api/api');
const Game = require('../model/game-model');
const Message = require('../twilio/send');

module.exports.sendParse = async function () {
    var users = await getUsers();
    var games = await getGames();
    api.getData().then((gameData) => {
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
            //if game is finished
            if (gameStatus === 'true') {
                var gameExists = games.filter(game => (game.game == gameId));
                if (gameExists.length === 0) {
                    users.forEach((userArr) => {
                        console.log(userArr.team === awayTeamAB, awayTeamAB);
                        console.log(userArr.team === homeTeamAB, homeTeamAB);
                        if ((userArr.team === awayTeamAB) || (userArr.team === homeTeamAB)) {
                            //Message.send(userArr.mobile, homeTeam.City, homeTeam.Name, awayTeam.City, awayTeam.Name, homeScore, awayScore, null);
                            console.log('SMS Sent');
                        }
                    })
                    saveGame(gameId);
                }
            }
        });
    });
}

async function saveGame(id) {
    var activeGames = await getGames();
    const gameExists = activeGames.filter(game => (game.game === id));
    if (gameExists.length === 0) {
        var game = new Game({
            game: id
        })
        game.save().then((game) => {
            console.log('Game saved to DB.', game);
        }).catch((e) => {
            console.log(e);
        })
    }
}


function getUsers() {
    return User.find({}).then((users) => {
        return users;
    }).catch(() => {
        console.log('error');
        return 'an error occured users';
    })

}

function getGames() {
    return Game.find({}).then((games) => {
        return games;
    }).catch(() => {
        console.log('error');
        return 'an error occured games';
    })

}

