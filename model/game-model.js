const mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    game: Number
});

var Game = module.statics = module.exports = mongoose.model('Game', gameSchema);

module.statics.gameExists = function(game) {
    var Game = this;
    return Game.findOne({game}).then((game) => {
        if(game) {
            return Promise.reject();
        } else {
            Promise.resolve();
        }
    })
};
