import mongoose from 'mongoose';

let gameSchema = new mongoose.Schema({
    game: Number
});

export const Game = mongoose.model('Game', gameSchema)

export function gameExists(game) {
    let Game = this;
    return Game.findOne({game}).then((game) => {
        if(game) {
            console.log('game found');
            return Promise.reject();
        } else {
            console.log('game not found');
            Promise.resolve();
        }
    })
}

