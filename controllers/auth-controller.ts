import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import User from '../model/user.model';
import passport from 'passport';

class AuthController {
    public router = express.Router();
    private urlencodedParser;

    constructor() {
        this.initialize();
        this.initializeRoutes();
    }

    private initialize() {
        this.router.use(bodyParser.json());
        this.urlencodedParser = bodyParser.urlencoded({ extended: false });
    }

    private initializeRoutes() {
        this.router.get('/', this.start);
        this.router.get('/signup', this.getSignup);
        this.router.get('/logout', this.logout);
        this.router.get('/login', this.getLogin);
        this.router.post('/auth/signup', this.urlencodedParser, this.signup);
        this.router.post('/auth/login/redirect', [this.urlencodedParser, this.inputCheck, this.accountCheck, passport.authenticate('local-login')], this.authenticateLogin);
    }

    private capitalizeName(name) {
        let firstLetter = name.substr(0, 1).toUpperCase();
        let remaining = name.substr(1).toLowerCase();
        let newString = firstLetter + remaining
        return newString
    }

    private lcEmail(email) {
        let newEmail = email.toLowerCase();
        return newEmail;
    }

    private getLogin(req: express.Request, res: express.Response) {
        res.render('login');
    }

    private start(req: express.Request, res: express.Response) {
        res.render('/');
    }

    private getSignup(req: express.Request, res: express.Response) {
        res.render('signup');
    }

    private logout(req: express.Request, res: express.Response) {
        req.logout();
        res.redirect('/login');
    }

    private signup(req: express.Request, res: express.Response) {
        if (req.body.firstName === "" || req.body.lastName === "") {
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
        } else if (req.body.password.length < 6) {
            return res.render('signup', {
                error: "Password must be a minimum of 6 characters."
            });
        } else if (req.body.passwordConf === "") {
            return res.render('signup', {
                error: "Please confirm your password."
            });
        } else if (req.body.password != req.body.passwordConf) {
            return res.render('signup', {
                error: "Passwords do not match."
            });
        };
        console.log('after validation');
        let user = new User();
        user.firstName = this.capitalizeName(req.body.firstName);
        user.lastName = this.capitalizeName(req.body.lastName);
        user.email = this.lcEmail(req.body.email);
        user.mobile = null;
        user.team = null;
        user.password = req.body.password;
        User.emailVeri(req.body.email).then(() => {
            console.log(1);
        }).catch(() => {
            return res.render('signup', {
                error: 'Email already in use.'
            });
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
            });
        });
    };

    private authenticateLogin(req: express.Request, res: express.Response) {
        res.redirect('/profile')
    }

    private inputCheck(req, res, next) {
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

    private accountCheck(req, res, next) {
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
};

export default AuthController;