import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/interfaces';

const UserSchema: Schema = new mongoose.Schema({
        firstName:  String,
        lastName: String,
        email: String,
        password: String,
        team: String,
        mobile: Number    
});

export interface IUserModel extends Model<IUser> {
    updateTeam(email: String, mobile: Number, team: String);
    findByCredentials(email: String, password: String);
    emailVeri(email: String);
    getUserById(email: String, callback: Function);
}

export default mongoose.model<IUser, IUserModel>('User', UserSchema);

UserSchema.method('emailVeri', function(email) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if(user) {
            return Promise.reject();
        }
    })
});

UserSchema.method('findByCredentials', function(email, password) {
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
});

UserSchema.method('updateTeam', function(email, mobile, team) {
    console.log('Updating Team');
    console.log(mobile);
    return this.UserSchema.findOneAndUpdate({email: email}, {mobile: mobile, team: team}, (err, res) => {
        if(err) {
            console.log(err);
        }
    });
});

UserSchema.method('getUserById', function(email, callback) {
    let query = {email: email};
    return this.UserSchema.findOne(query, callback);
})