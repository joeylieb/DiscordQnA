import {model, Schema} from "mongoose";

export interface IQuestion {
    id: string,
    question: string,
    nameQ: string,
    timeAsked: number,
    answered: boolean,
    answer: string | null,
}

const questionSchema = new Schema<IQuestion>({
    id: {type: String, required: true},
    question: {type: String, required: true},
    nameQ: {type: String, required: true},
    timeAsked: {type: Number, required: true},
    answered: {type: Boolean, required: true},
    answer: String
});

export const Question = model<IQuestion>('Question', questionSchema);