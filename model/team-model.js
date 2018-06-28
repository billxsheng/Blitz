const mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    email: String,
    mobile: Number,
    team: String
});

var Team = module.statics = module.exports = mongoose.model('Team', teamSchema);

module.statics.userExists = function(email) {
    var Team = this;
    return Team.findOne({email}).then((user) => {
        if(user) {
            console.log('user found');
            return Promise.reject();
        } else {
            console.log('user not found');

            Promise.resolve();
        }
    })
};



