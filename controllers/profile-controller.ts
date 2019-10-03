import router from 'express';
import bodyParser from 'body-parser';
import User from '../model/user.model';
import express from 'express';

class ProfileController {
    public router = express.Router();
    private urlencodedParser;

    constructor() {
        this.initialize();
        this.initializeRoutes();
    }

    initialize() {
        router.use(bodyParser.json());
        this.urlencodedParser = bodyParser.urlencoded({
            extended: false
        });
    }

    initializeRoutes() {
        this.router.get('/profile/', this.ensureAuthenticated, this.getProfile);
        this.router.post('/profile/save', this.urlencodedParser, this.saveUser)
    }

    private getProfile(req: express.Request, res: express.Response) {
        if (req.user.mobile === null || req.user.team === null) {
            res.render('profile', {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                mobile: 'Not assigned!',
                team: 'Not selected!'
            });
        } else {
            res.render('profile', {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                mobile: req.user.mobile,
                team: req.user.team
            });
        }
    }

    private saveUser(req: express.Request, res: express.Response) {
        console.log(req.body);
        console.log(req.query);
        if (req.body.mobile === "") {
            console.log('error detected');
            res.render('profile', {
                error: "Please enter a valid phone number."
            });
        } else {
            console.log(req.body, 'b4');

            User.updateTeam(req.user.email, req.body.mobile, req.body.team).then((user) => {
                console.log(req.body, 'after');
                res.render('profile', {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    mobile: user.mobile,
                    team: user.team
                });
            }).catch((e) => {
                console.log(e);
            });
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
    }

    private authCheck(req, res, next) {
        if (!req.user) {
            res.redirect('/auth/login');
        } else {
            next();
        }
    };

    private ensureAuthenticated(req, res, next) {
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
}

export default ProfileController;