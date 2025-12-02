import {model, models, Schema} from "mongoose";

export interface ICounter {
    currentUID: number,
}

const CounterSchema = new Schema({
    currentUID: {type: Number, default: 0},
});

export const Counter = models.Counter || model<ICounter>("Counter", CounterSchema);