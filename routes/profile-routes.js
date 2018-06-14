const router = require('express').Router();
const hbs = require('hbs');
const querystring = require('querystring');
const url = require('url');   
const bodyParser = require('body-parser');
const data = require('../api/api'); 
const Team = require('../model/team-model');


router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const authCheck = (req, res, next) => {
    if(!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', ensureAuthenticated, (req, res) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query);
    res.render('profile', {
        firstName: query.fn,
        lastName: query.ln,
        email: query.email
    });
});

router.post('/save', urlencodedParser, (req, res) => {
    console.log(req.body);
    console.log(req.query);
    if(req.body.mobile === "") {
        console.log('error detected');
        res.redirect('profile', {
            error: "Please enter a valid phone number."
        });
    } else {
        Team.userExists(req.body.mobile).then(() => {
            var team = new Team();
            team.email = req.query.email;
            team.mobile = req.body.mobile;
            team.team = req.body.team
            console.log(team);
            team.save().then(() => {
                res.send('Successfully created new team!'); 
            });
        }).catch((e) => {
            //update
            console.log(e);
            res.send('User information updated!');
        });
    }
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.render('login', {
            error:"You are not logged in."
        })
    }   
}

module.exports = router;