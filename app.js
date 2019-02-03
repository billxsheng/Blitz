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
const send = require('./send/send');

//mongodb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Blitz');

//express app
const app = express();

//body-parser stuff
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

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


var inputCheck = function (req, res, next) {
    if (req.body.email === "") {
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

var accountCheck = function (req, res, next) {
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
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
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
        passport.authenticate('local-login')
    ],
    function (req, res) {
        res.redirect('/profile')
    });


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

setInterval(() => {
    send.sendParse();
}, 300000);


app.listen(port, () => {
    console.log(`app now up on port ${port}`);
});


