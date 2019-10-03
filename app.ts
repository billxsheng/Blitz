import express from 'express';
import bodyParser from 'body-parser';
import User from './model/user.model';
import profileRoutes from './controllers/profile-controller';
import authRoutes from './controllers/auth-controller';
import mongoose from 'mongoose';
import { keys } from './db/keys';
import cookieSession from 'cookie-session';
import passport from 'passport';
import path from 'path';
import LocalStrategy from 'passport-local';
import cookieParser from 'cookie-parser';
import SendSMS from './send/send';

class App {
    public app: express.Application;
    private port;
    private send;

    constructor(controllers) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.send = new SendSMS();

        this.initializeControllers(controllers);
        this.initialize();
        this.connectToDB();
        this.auth();
        this.runJob();
    }

    private initializeControllers(controllers) {
        controllers.array.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }

    private connectToDB() {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Blitz');
    }

    private initialize() {
        this.app.use(bodyParser.json());
        let urlencodedParser = bodyParser.urlencoded({
            extended: false
        });
        this.app.use(express.static(path.join(__dirname, '/views')));
        this.app.use(cookieParser(keys.cookie.session));
        this.app.use(cookieSession({
            maxAge: 24 * 60 * 60 * 1000,
            keys: [keys.cookie.session]
        }));
        this.app.set('view engine', 'hbs');
        this.app.use('/profile', profileRoutes);
        this.app.use('/auth', authRoutes);
    }

    private auth() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });
        passport.deserializeUser(function (id, done) {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });
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
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`app now up on port ${this.port}`);
        });
    }

    private runJob() {
        setInterval(() => {
            this.send.sendParse();
        }, 300000);
    }
};

export default App;

