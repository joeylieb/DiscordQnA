import {model, models, Schema} from "mongoose";

interface ISession {
    sessionID: string,
    userAgent: string,
    expiresAt: Date,
    userID: string
}

const SessionSchema = new Schema({
    sessionID: {type: String, required: true},
    userAgent: {type: String, required: true},
    expiresAt: {type: Date, required: true},
    userID: {type: String, required: true},
});

export const Session = models.Session || model<ISession>("Session", SessionSchema);