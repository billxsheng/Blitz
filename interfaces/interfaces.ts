import { Document } from "mongoose";

export interface IUser extends Document {
    firstName:  String;
    lastName: String;
    email: String;
    password: String;
    team: String;
    mobile: Number; 
    updateTeam();
}

export interface IGame extends Document {
    game: Number;
}