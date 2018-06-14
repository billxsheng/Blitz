const mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    email: String,
    mobile: Number,
    team: String
});

var Team = module.statics = module.exports = mongoose.model('Team', teamSchema);

module.statics.userExists = function(phone) {
    var Team = this;
    return Team.findOne({phone}).then((user) => {
        if(user) {
            return Promise.reject();
        } else {
            Promise.resolve();
        }
    })
};



