const router = require('express').Router();
const passport = require('passport');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const User = require('../model/user-model');
var localStrategy = require('passport-local').Strategy;
var mongoose1 = require('../db/mongoose');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

//body-parser stuff
router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//auth login
router.get('/signupredirect', (req, res) => {
    res.render('signupredirect');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/signup/local', urlencodedParser, (req, res) => {
    if(req.body.firstName === "" || req.body.lastName === "") {
        return res.render('signup', {
            error: "Please enter a valid name."
        });
    } else if (req.body.email === "") {
        return res.render('signup', {
            error: "Please enter a valid email."
        });
    } else if (req.body.password === "") {
        return res.render('signup', {
            error: "Please enter a valid password."
        });
    } else if(req.body.password.length < 6) {
        return res.render('signup', {
            error: "Password must be a minimum of 6 characters."
        });
    } else if(req.body.passwordConf === "") {
        return res.render('signup', {
            error: "Please confirm your password."
        });
    } else if(req.body.password != req.body.passwordConf) {
        return res.render('signup', {
            error: "Passwords do not match."
        });
    };
    console.log('after validation');
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName =req.body.lastName;
    user.email = req.body.email;
    //username
    user.password = req.body.password;
    User.emailVeri(req.body.email).then(() => {
        console.log(1);
    }).catch(() => {
        return res.render('signup', {
            error: 'Email already in use.'
        })
    });

    console.log('before', user);
    bcrypt.genSalt(10, (err, salt) => {
        console.log('gensalt', salt);
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            console.log('after', user);
            user.save().then(() => {
                res.render('login');
            });
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //       user: 'billxsheng@gmail.com',
            //       pass: ''
            //     }
            //   });
            //   var mailOptions = {
            //     from: 'youremail@gmail.com',
            //     to: user.email,
            //     subject: 'Sending Email using Node.js',
            //     text: 'ezpz'
            //   };
        });
    });
}); 

//google callback route
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});

//auth with google
router.get('/google', passport.authenticate("google", {
    scope: ['profile']
}), (req, res) => {
    //handle with passport
    res.send('logging in with google');
});


module.exports = router;