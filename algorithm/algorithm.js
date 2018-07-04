const User = require('../model/user-model');
const api = require('../api/api');
const Game = require('../model/game-model');
const Message = require('../twilio/send');
const async = require('async');

module.exports.intervalAlg = function () {
    console.log('algorithm entered')
    api.getData().then((result) => {
        console.log(result);
        const gameJSON = result.scoreboard.gameScore[i];
        var gameScoreArray = result.scoreboard.gameScore;
        async.forEach(gameScoreArray, function (gameNFL, callback) {
            console.log(`Parsing ${gameNFL.game.homeTeam.Abbreviation} vs ${gameNFL.game.awayTeam.Abbreviation}`);
            if (gameNFL.isCompleted === "true") {
                console.log(gameNFL);
                Game.findOne({
                    game: gameNFL.game.ID
                }).then((game) => {
                    if (game) {
                        console.log('Game found. Exiting.')
                        return 0;
                    }
                })

                //check if game is in game database
                //if it is then return 0
                //else keep going



                User.find({
                    team: gameJSON.game.awayTeam.Abbreviation,
                    team: gameJSON.game.homeTeam.Abbreviation
                }).then((users) => {
                    async.forEach(users, (user) => {
                        Message.send(user.mobile, gameNFL.game.homeTeam.City, gameNFL.game.homeTeam.Name, gameNFL.game.awayTeam.City, gameNFL.game.awayTeam.Name, gameNFL.homeScore, gameNFL.awayScore, null );
                    })
                });

                //search database for all people who have game hometeam and awayteam
                //send message for each person in the array


                Game.findOne({
                    game: gameNFL.game.ID
                }).then((game) => {
                    if (game) {
                        return 0;
                    } else {
                        var game = new Game({
                            game: gameNFL.game.ID
                        })
                    }
                })
                //check if game is in game database
                //if it is return 0
                //else add it
                callback();
            }
        })
    })
}


// api.getData().then((result) => {
//     function asyncLoop(i, callback) {
//         if (i < result.scoreboard.gameScore.length) {
//             console.log(`Parsing ${result.scoreboard.gameScore[i].game.homeTeam.Abbreviation} vs ${result.scoreboard.gameScore[i].game.awayTeam.Abbreviation}`)
//             if (result.scoreboard.gameScore[i].isCompleted === "true") {
//                 console.log(i);
//                 var gameJSON = result.scoreboard.gameScore[i]

//                 Game.findOne({game: gameJSON.game.ID}).then((game) => {
//                     if(game) {
//                         console.log('0 returned');
//                         return 0;
//                     } else {
//                         console.log(gameJSON.game.ID);
//                         User.find({
//                             team: gameJSON.game.awayTeam.Abbreviation
//                         ,
//                             team: gameJSON.game.homeTeam.Abbreviation
//                         }).then((users) => {
//                             console.log(users + 'USERS ARRAY');
//                             console.log(gameJSON.game.awayTeam.Abbreviation);
//                             console.log(gameJSON.game.homeTeam.Abbreviation);
//                             users.forEach((user) => {
//                                 console.log(user);
//Message.send(user.mobile, gameJSON.game.homeTeam.City, gameJSON.game.homeTeam.Name, gameJSON.game.awayTeam.City, gameJSON.game.awayTeam.Name, gameJSON.homeScore, gameJSON.awayScore, null );
// })
// var game = new Game({
//     game: gameJSON.game.ID
// })

// game.save().then((game) => {
//     console.log(`Game with ID: ${game.game} saved to DB.`)
// }).catch((e) => {
//     console.log('Error! Game not saved to DB.');
// });

//                         })
//                     }
//                 }).catch(() => {

//                 })

//             } else {
//                 console.log('Game still in progress');
//             }

//             asyncLoop( i + 1, callback );

//         } else {
//             callback();
//         }
//     }

//     asyncLoop( 0, () => {

//     });


// }).catch((e) => {
//     console.log(e);
// })

















// gameCheck().then(() => {
//     console.log('text sent to ' + result.scoreboard.gameScore[i].game.ID)
//     //send text
// }).catch(() => {
//     console.log(1);
// });

// newGameCheck().then(() => {
//     var game = new Game({
//         game: result.scoreboard.gameScore[i].game.ID
//     });
//     game.save().then(() => {
//         console.log('Game saved to DB!')
//     });
// }).catch(() => {

// });

// async function gameCheck() {
//     await Game.gameExists(result.scoreboard.gameScore[i].game.ID)
// }

// async function newGameCheck() {
//     await Game.gameExists(result.scoreboard.gameScore[i].game.ID)
// }







