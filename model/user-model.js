const mongoose = require('mongoose');
//const bcrypt = require('bcrypt-nodejs');
const bcrypt = require('bcrypt');



var userSchema = mongoose.Schema({
        firstName:  String,
        lastName: String,
        email: String,
        password: {
            type: String
        },
        team: String,
        mobile: Number    
});

var User = module.statics = module.exports = mongoose.model('User', userSchema);

module.statics.emailVeri = function(email) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if(user) {
            return Promise.reject();
        }
    })
};


module.statics.findByCredentials = function(email, password) {
    var User = this;
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

module.exports.updateTeam = function(email, mobile, team) {
    console.log('Updating Team');
    return User.findOneAndUpdate({email: email}, {mobile: mobile, team: team}, (err, res) => {
        if(err) {
            console.log(err);
        }
    });
}

module.exports.getUserById = function(email, callback) {
var query = {email: email};
return User.findOne(query, callback);
};

