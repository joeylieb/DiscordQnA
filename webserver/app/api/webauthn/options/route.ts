import {NextRequest, NextResponse} from "next/server";
import "../../../../src/utils/envConfig.ts";
import {generateRegistrationOptions} from "@simplewebauthn/server";
import {cookies} from "next/headers";
import {usernameGenerator} from "@src/utils/username.ts";
import {roughEstimateUID} from "@src/utils/db.ts";

export async function GET(req: NextRequest) {
    const cookiesHead = await cookies();
    const currentUID = await roughEstimateUID();
    const userData = await usernameGenerator(currentUID);
    const options = await generateRegistrationOptions({
        rpID: process.env.RP_ID!,
        rpName: process.env.RP_NAME!,
        userName: userData.username,
        attestationType: "none"
    });

    cookiesHead.set('regChallenge',JSON.stringify({challenge: options.challenge, userID: options.user.id}), {secure: true});
    cookiesHead.set('proposedUserData', JSON.stringify(userData))

    return NextResponse.json({data: options}, {status: 200});
}