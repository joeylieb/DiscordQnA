import {NextRequest, NextResponse} from "next/server";
import "../../../../src/utils/envConfig.ts";
import {generateRegistrationOptions} from "@simplewebauthn/server";
import {addChallenge} from "@src/utils/challenges.ts";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    if(!searchParams.get("name")) return NextResponse.json({error: "No name provided"}, {status: 400});
    const options = await generateRegistrationOptions({
        rpID: process.env.RP_ID!,
        rpName: process.env.RP_NAME!,
        userName: searchParams.get("name")!,
        attestationType: "none"
    });

    addChallenge(searchParams.get("name")!, options)

    return NextResponse.json({data: options}, {status: 200});
}