import "./envConfig.ts";
import {connect, Model, Mongoose} from "mongoose";
import {IUser, User} from "../schema/user.ts";

export async function dbConnect(): Promise<Mongoose> {
       return await connect(process.env.MONGOURI!);
}

export async function userDB(): Promise<Model<IUser>> {
    await dbConnect();
    return User;
}