const User = require('../model/user-model');
const api = require('../api/api');
const Game = require('../model/game-model');
const Message = require('../twilio/send');
const async = require('async');
const circular = require('circular-json');

module.exports.sendParse = async function () {
    var users = await getUsers();
    var games = await getGames();
    api.getData().then((gameData) => {
        const gameArray = gameData.scoreboard.gameScore
        gameArray.forEach((gameCurr) => {
            const gameId = gameCurr.game.ID;
            console.log(gameId);

            //for each game 
            //if it is finished
                //check if that shit is in the game mongo db
                    //if it is peel
                    //else 
                        //for each user check if the game matches
                            //if yes, send
                //check again if it is int he game db
                    //if yes peel
                    //if no add



                //if (games.length > 0) {
                    // games.forEach((game) => {
                    //     console.log(game);
                    //     if (gameId === game.game) {
                    //         console.log('GAME FOUND EXITING');
                    //         return 0;
                    //     }
                    users.forEach((user) => {
                        console.log(user.firstName);
                        
                        console.log(user.team === gameCurr.game.awayTeam.Abbreviation, gameCurr.game.awayTeam.Abbreviation)
                        console.log(user.team === gameCurr.game.homeTeam.Abbreviation, gameCurr.game.homeTeam.Abbreviation)

                        if (user.team === gameCurr.game.awayTeam.Abbreviation || user.team === gameCurr.game.homeTeam.Abbreviation) {
                            console.log('SENDING MESSAGE');
                            //Message.send(user.mobile, gameNFL.game.homeTeam.City, gameNFL.game.homeTeam.Name, gameNFL.game.awayTeam.City, gameNFL.game.awayTeam.Name, gameNFL.homeScore, gameNFL.awayScore, null );

                            var game = new Game({
                                game: gameId
                            })
                            game.save().then((gameSaved) => {
                                console.log(gameSaved);
                            }).catch(() => {
                                console.log(e);
                            })
                        }
                    });
                //});
            //}





        });
        //check if game is in game database
        //if it is then return 0
        //else keep going


        //search database for all people who have game hometeam and awayteam
        //send message for each person in the array


        //check if game is in game database
        //if it is return 0
        //else add it
    });






}


function getUsers() {
    console.log('y')
    return User.find({}).then((users) => {
        console.log(users);
        return users;
    }).catch(() => {
        console.log('error');
        return 'an error occured users';
    })

}

function getGames() {
    console.log('y')
    return Game.find({}).then((games) => {
        console.log(games);
        return games;
    }).catch(() => {
        console.log('error');
        return 'an error occured games';
    })

}
// api.getData().then((result) => {
//     var gameScoreArray = result.scoreboard.gameScore;
//     async.forEach(gameScoreArray, function (gameNFL, callback) {
//         console.log('hello');
//         console.log(`Parsing ${gameNFL.game.homeTeam.Abbreviation} vs ${gameNFL.game.awayTeam.Abbreviation}`);
//         if (gameNFL.isCompleted === "true") {
//             console.log('going into game');
//             Game.findOne({
//                 game: gameNFL.game.ID
//             }).then((game) => {
//                 if (game) {
//                     console.log('Game found. Exiting.')
//                     return 0;
//                 } else {
//                     console.log('Game NOT in db')
//                 }
//             })

//check if game is in game database
//if it is then return 0
//else keep going



// User.find({
//     team: gameNFL.game.awayTeam.Abbreviation,
//     team: gameNFL.game.homeTeam.Abbreviation
// }).then((users) => {
//     console.log('checking users for common team')
//     async.forEach(users, (user) => {
//         console.log('text sent');
//         //Message.send(user.mobile, gameNFL.game.homeTeam.City, gameNFL.game.homeTeam.Name, gameNFL.game.awayTeam.City, gameNFL.game.awayTeam.Name, gameNFL.homeScore, gameNFL.awayScore, null );
//     })
// }).catch(() => {
//     console.log('nothing found')
// })

//search database for all people who have game hometeam and awayteam
//send message for each person in the array


// Game.findOne({
//     game: gameNFL.game.ID
// }).then((game) => {
//     if (game) {
//         return 0;
//     } else {
//         var game = new Game({
//             game: gameNFL.game.ID
//         })
//     }
// })
//check if game is in game database
//if it is return 0
//else add it

//             }
//         })
//     }).catch((e) => {
//         console.log(e);
//     });




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







// async.forEach(Object.keys(parsedListenJSON), function forAllUsers(userName, callback) {
//     var songs = parsedListenJSON[userName];
//     //var currentUser;
//     //console.log(userName + " -> " + songs);
//     var userQuery = User.findOne({'name': userName})
//     userQuery.then(function(user){
//         //console.log("user_id: " + user["_id"]);
//         //console.log(songs);
//         //currentUser = user;
//         async.forEach(songs, function runSongQuery(songName, smallback) {
//           //console.log(songName);
//           var songQuery = Song.findOne({'name': songName})
//           songQuery.then(function(song){
//             //console.log("user_id: " + user["_id"]);
//             //console.log("song_id: " + song["_id"]);
//             // need to ensure we have both the user_id and song_id
//             api_request = "http://localhost:3001/listen/" + user["_id"] + "/" + song["_id"];
//             console.log(api_request);
//             // listen/user_id/song_id
//             //.post('http://localhost:3001/listen/0/1')
//             request
//                 .post(api_request)
//                 .end(function(err, res){
//                   expect(res.status).to.equal(200);
//                   smallback()
//                 });

//           });
//         }, function allSongs(err) {
//           callback();
//         })
//       });
// }, function allUserNames(err) {
//   done()
// })