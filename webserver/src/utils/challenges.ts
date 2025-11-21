import {PublicKeyCredentialCreationOptionsJSON} from "@simplewebauthn/server";

export const challengesStored = new Map<string, PublicKeyCredentialCreationOptionsJSON>

export function addChallenge(username: string, challenge: PublicKeyCredentialCreationOptionsJSON) {
    console.log("adding challenge for " + username)
    challengesStored.set(username, challenge)
}

export function getChallenge(username: string) {
    return challengesStored.get(username) ?? null;
}