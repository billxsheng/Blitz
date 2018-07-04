const router = require('express').Router();
const bodyParser = require('body-parser');
const Team = require('../model/team-model');


router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('profile', {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
    });
});

router.post('/save', urlencodedParser, (req, res) => {
    console.log(req.body);
    console.log(req.query);
    if (req.body.mobile === "") {
        console.log('error detected');
        res.render('profile', {
            error: "Please enter a valid phone number."
        });
    } else {
        Team.userExists(req.body.email).then(() => {
            var team = new Team();
            team.email = req.query.email;
            team.mobile = Math.trunc(req.body.mobile);
            team.team = req.body.team
            console.log(team);
            team.save().then(() => {
                res.send('New user information added!');
            });
        }).catch(() => {
            Team.findOneAndUpdate({
                email: req.body.email
            }, {
                email: req.query.email,
                mobile: Math.trunc(req.body.mobile),
                team: req.body.team
            }, (err, res) => {
                if (err) {
                    console.log('An error occurred.')
                } 
            })
            res.send('User information successfully updated!')
        })
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('yes');
        return next();
    } else {
        console.log('no');
        res.render('login', {
            error: "You are not logged in."
        })
    }
}

module.exports = router;