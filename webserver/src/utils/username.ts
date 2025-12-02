import {Buffer} from "buffer";
import {blake3} from "@noble/hashes/blake3"

async function randomPrefix(): Promise<string> {
    const namesText = await fetch("/randomwords.txt").then((res) => res.text());
    const names = namesText.split("\n")
    return names[Math.floor(Math.random() * names.length)];
}

export interface UserID {
    fullID: string,
    username: string,
    date: number,
    uid: number
}

export async function usernameGenerator(uid: number): Promise<UserID> {
    const currentDate = Math.floor(Date.now() / 1000);
    const fullID = Buffer.from(blake3(`${uid+1}-${currentDate}`)).toString("hex")
    const prefix = await randomPrefix();
    const tld = await randomTLD();
    return {
        fullID,
        username: prefix + "@" + fullID.slice(0,10) + "." + tld,
        date: currentDate,
        uid
    };
}

export async function randomTLD(){
    const tldRaw = await fetch("/tlds.txt");
    const tld = await tldRaw.text();
    const tldList = tld.split("\n").map((tld) => (tld.toLowerCase()));
    return tldList[Math.floor(Math.random() * tldList.length)];
}
