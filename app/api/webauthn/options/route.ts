import {NextResponse} from "next/server";
import "@src/utils/envConfig";

export async function GET(req: Request) {
    return NextResponse.json({message: "balls"});
}