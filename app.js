const express = require('express');
const profileRoutes = require('./routes/profile-routes');
const authRoutes = require('./routes/auth-routes');
const mongoose = require('mongoose');
const keys = require('./db/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const path = require('path');
const User = require('./model/user-model');
const bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;  
const url = require('url');    
const cookieParser = require('cookie-parser');
const api = require('./api/api');
const Game = require('./model/game-model');
const Team = require('./model/team-model');
const Message = require('./twilio/send');
//mongodb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Blitz');

//express app
const app = express();

//body-parser stuff
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//deploy 
const port = process.env.PORT || 3000

//getting statics
app.use(express.static(path.join(__dirname, '/views')));

//cookie session
app.use(cookieParser(keys.cookie.session));


app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.cookie.session]
}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set up view engine
app.set('view engine', 'hbs');

//setup routes
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);

//route to first page
app.get('/', (req, res) => {
    res.render("start");
});

//login page route
app.get('/login', (req, res) => {
    res.render('login');
});

// app.get('/profile', (req, res) => {
//     res.render('profile', {
//         email: req.body.email,
//         firstName: req.user.firstName,
//         lastName: req.user.lastName
//     }); 
// });

//serialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//deserialize 
passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});


var inputCheck = function(req, res, next) {
    if(req.body.email === "") {
        return res.render('login', {
            error: "Please enter a valid email."
        })
    } else if (req.body.password === "") {
        return res.render('login', {
            error: "Please enter a valid password."
        })
    }
    next();
};

var accountCheck = function(req, res, next) {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        if (user) {
           next();
        }
    }).catch(() => {
        return res.render('login', {
            error: "Account not found."
        })
    });
}

//passport middleware
passport.use('local-login', new LocalStrategy({
    usernameField: "email", passwordField: "password", passReqToCallback: true
},
    function (req, username, password, done) {
        User.findByCredentials(req.body.email, req.body.password).then((user) => {
            if (user) {
                done(null, user);
            }
        }).catch(() => {
            done(null, false);
        });
    }
));

//Login POST 
app.post('/login/redirect', [urlencodedParser, inputCheck, accountCheck,
    passport.authenticate('local-login')],
    function (req, res) {
        console.log('redirect');
        res.redirect(url.format({
            pathname:"/profile/",
            query: {
                "fn": req.user.firstName,
                "ln": req.user.lastName,
                "email": req.body.email
            }
        }));
    });


app.get('/logout', (req, res) => {
    req.logout();
    res.render('login');
});

//setInterval(() => {
    var data = api.getData().then((result) => {
        for(i = 0; i < result.scoreboard.gameScore.length; i++ ) {
            console.log(result.scoreboard);
            console.log(`Parsing ${result.scoreboard.gameScore[i].game.homeTeam.Abbreviation} vs ${result.scoreboard.gameScore[i].game.awayTeam.Abbreviation}`)
            if(result.scoreboard.gameScore[i].isCompleted === "true") {
                console.log(i);
                //check if game is in array
                    //if game is in array dont do anything
                    //if game is not in array
                        var gameJSON = result.scoreboard.gameScore.game
                        Team.find({team: gameJSON.awayTeam.Abbreviation} || {team: gameJSON.homeTeam.Abbreviation}).array.forEach(user => {
                            console.log(user);
                            //Message.send(user.mobile, gameJSON.homeTeam.City, gameJSON.homeTeam.Name, gameJSON.awayTeam.City, gameJSON.awayTeam.Name, null);
                        });
                        //for each user check if the teams match  .find(team).foreach
                            //if they do match, send custom message
                            //if they do not match dont do anything
                        //add game to array








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
                
                
            } else {
                console.log('Game still in progress');
            }
       
       
       
       
       
       
       
       
       
       
       
        }


    }).catch((e) => {
        console.log(e);
    })
    

    //for each game that finishes
        //check if finished game is in arrayChecked
        //fetch teams involved
            //rotate through users 
                //if user matches team send text

//}, 1000);

    

app.listen(port, () => {
    console.log(`app now up on port ${port}`);
});