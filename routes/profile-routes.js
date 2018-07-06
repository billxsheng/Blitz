const router = require('express').Router();
const bodyParser = require('body-parser');
const User = require('../model/user-model');


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
        email: req.user.email,
        mobile: req.user.mobile,
        team: req.user.team
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
        console.log(req.body, 'b4');

        User.updateTeam(req.user.email, req.body.mobile, req.body.team).then(() => {
            console.log(req.body, 'after');
            res.send('User information successfully updated!')
        }).catch((e) => {
            console.log(e);
        }) ;
        // Team.userExists(req.body.email).then(() => {
        //     console.log(req.user.email + "email");
        //     var team = new Team();
        //     team.email = req.user.email;
        //     team.mobile = Math.trunc(req.body.mobile);
        //     team.team = req.body.team
        //     console.log(team);
        //     team.save().then(() => {
        //         res.send('New user information added!');
        //     });
        // }).catch(() => {
        //     console.log(req.user.email + "email");
        //     Team.findOneAndUpdate({
        //         email: req.body.email
        //     }, {
        //         email: req.query.email,
        //         mobile: Math.trunc(req.body.mobile),
        //         team: req.body.team
        //     }, (err, res) => {
        //         if (err) {
        //             console.log('An error occurred.')
        //         } 
        //     })
        //     res.send('User information successfully updated!')
        // })
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