import names from "../../names.json";
import {Buffer} from "buffer";
import {blake3} from "@noble/hashes/blake3"

function randomPrefix(): string { return names.randomNames[Math.floor(Math.random() * names.randomNames.length)]; }

export function usernameGenerator(uid: number) {
    const currentDate = Math.floor(Date.now() / 1000);
    return {
        username: randomPrefix() + "@" + Buffer.from(blake3(`${uid+1}-${currentDate}`)).toString("hex").slice(0,10),
        date: currentDate
    };
}
