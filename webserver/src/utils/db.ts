import "./envConfig.ts";
import {connect, Model, Mongoose} from "mongoose";
import {IUser, User} from "../schema/user.ts";

async function dbConnect(): Promise<Mongoose> {
       return await connect(process.env.MONGOURI!);
}

async function userDB(): Promise<Model<IUser>> {
    await dbConnect();
    return User;
}