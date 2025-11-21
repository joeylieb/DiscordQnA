import {model, models, Schema} from "mongoose";
import {AuthenticatorTransportFuture, CredentialDeviceType} from "@simplewebauthn/server";

interface Passkey {
    id: Base64URLString,
    publicKey: Uint8Array,
    webauthnUserID: Base64URLString,
    counter: number,
    deviceType: CredentialDeviceType,
    backedUp: boolean,
    transports?: AuthenticatorTransportFuture[]
}

export interface IUser {
    uid: number,
    username: string,
    purchasedAnswerer: boolean,
    passkeys: Passkey[],
    dateCreated: number
}

const UserSchema = new Schema<IUser>({
    uid: {type: Number, unique: true, required: true},
    username: {type: String, required: true},
    purchasedAnswerer: {type: Boolean, required: true},
    passkeys: Array,
    dateCreated: {type: Number, required: true},
});

export const User = models.User || model<IUser>("User", UserSchema);