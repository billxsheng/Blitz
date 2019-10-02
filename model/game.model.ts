import mongoose, { Schema } from 'mongoose';
import { IGame } from '../interfaces/interfaces';

const GameSchema: Schema = new mongoose.Schema({
    game: Number
});

export default mongoose.model<IGame>('User', GameSchema);

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

