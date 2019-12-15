import mongoose, { Schema } from 'mongoose';
import { IGame } from '../interfaces/interfaces';

const GameSchema: Schema = new mongoose.Schema({
// const GameSchema = new mongoose.Schema({
    game: Number
});

export default mongoose.model<IGame>('User', GameSchema);

GameSchema.method('gameExists', function(game) {
    let Game = this;
    return Game.findOne({game}).then((game) => {
        if(game) {
            return Promise.reject();
        } else {
            Promise.resolve();
        }
    })
});