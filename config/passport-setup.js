const passport = require('passport');
const keys = require("../db/keys.js");
const User = require('./../model/user-model');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
