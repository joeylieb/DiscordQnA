import "@src/utils/envConfig";
import {connect, Model, Mongoose} from "mongoose";
import {IUser, User} from "@src/schema/user";

async function dbConnect(): Promise<Mongoose> {
       return await connect(process.env.MONGOURI!);
}

async function userDB(): Promise<Model<IUser>> {
    await dbConnect();
    return User;
}