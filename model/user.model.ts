import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/interfaces';

const UserSchema: Schema = new mongoose.Schema({
        firstName:  String,
        lastName: String,
        email: String,
        password: {
            type: String
        },
        team: String,
        mobile: Number    
});

export default mongoose.model<IUser>('User', UserSchema);

export function emailVeri(email) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if(user) {
            return Promise.reject();
        }
    })
} 

export function findByCredentials(email, password) {
    let User = this;
    return User.findOne({email: email}).then((user) => {
        console.log(user);
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                console.log(res);
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    });
} 

export function updateTeam(email, mobile, team) {
    console.log('Updating Team');
    console.log(mobile);
    return this.UserSchema.findOneAndUpdate({email: email}, {mobile: mobile, team: team}, (err, res) => {
        if(err) {
            console.log(err);
        }
    });
} 

export function getUserById(email, callback) {
    let query = {email: email};
    return this.UserSchema.findOne(query, callback);
};

