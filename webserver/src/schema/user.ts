import {model, Schema} from "mongoose";

export interface IUser {
    uuid: String,
    role: "Answerer" | "Quesioner",

}

const UserSchema = new Schema<IUser>({
    uuid: {type: String, unique: true, required: true},
    role: {type: String, required: true},
});

export const User = model<IUser>("User", UserSchema);