import mongoose, { Schema, Model } from 'mongoose';
import { IGame } from '../interfaces/interfaces';

const GameSchema: Schema = new mongoose.Schema({
    game: Number
});

export interface IGameModel extends Model<IGame> {
    gameExists(game: Number);
}

export default mongoose.model<IGame>('User', GameSchema);

GameSchema.method('gameExists', function(game) {
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
});