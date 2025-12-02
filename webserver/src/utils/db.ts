import "./envConfig.ts";
import {connect, Mongoose} from "mongoose";
import {Counter} from "@src/schema/uidCount.ts";

export async function dbConnect(): Promise<Mongoose> {
    try {
        await Counter.findOne();
    } catch (error) {
        const roughEstimate = 4;
        const newCounter = new Counter({ currentUID: roughEstimate -1 });
        newCounter.save();
        console.log("Created UID counter");
    }
    return await connect(process.env.MONGOURI!);
}

export async function getNextUID(): Promise<number> {
    await dbConnect();
    const counterDoc = await Counter.findOneAndUpdate(
        {},
        { $inc: { currentUID: 1 } },
        { new: true }
    );
    return counterDoc.currentUID;
}

export async function roughEstimateUID(): Promise<number> {
    console.log(process.env.WEBSOCKET_URL! + "/api/util/member-count")
    const rawData = await fetch(process.env.WEBSOCKET_URL! + "/api/util/member-count");
    const data = await rawData.json();
    return data.amount + 1;
}