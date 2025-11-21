import {NextRequest, NextResponse} from "next/server";
import "../../../../src/utils/envConfig.ts";
import {generateRegistrationOptions} from "@simplewebauthn/server";
import {cookies} from "next/headers";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const cookiesHead = await cookies();
    if(!searchParams.get("name")) return NextResponse.json({error: "No name provided"}, {status: 400});
    const options = await generateRegistrationOptions({
        rpID: process.env.RP_ID!,
        rpName: process.env.RP_NAME!,
        userName: searchParams.get("name")!,
        attestationType: "none"
    });

    cookiesHead.set('regChallenge',JSON.stringify({challenge: options.challenge, userID: options.user.id}), {secure: true});

    return NextResponse.json({data: options}, {status: 200});
}