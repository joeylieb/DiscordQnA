import {NextRequest, NextResponse} from "next/server";
import {generateAuthenticationOptions} from "@simplewebauthn/server";
import {cookies} from "next/headers";

export async function GET(req: NextRequest){
    const cookieData = await cookies();

    const options = await generateAuthenticationOptions({
        rpID: process.env.RP_ID!
    });

    cookieData.set('authChallenge', JSON.stringify({challenge: options.challenge}), {secure: true})

    return NextResponse.json({data: options});
}