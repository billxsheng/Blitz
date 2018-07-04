const mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    game: Number
});

var Game = module.statics = module.exports = mongoose.model('Game', gameSchema);

module.statics.gameExists = function(game) {
    var Game = this;
    return Game.findOne({game}).then((game) => {
        if(game) {
            console.log('game found');
            return Promise.reject();
        } else {
            console.log('game not found');
            Promise.resolve();
        }
    })
};
