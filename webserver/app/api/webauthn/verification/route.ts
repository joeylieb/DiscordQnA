import {NextRequest, NextResponse, userAgent} from "next/server";
import {cookies, headers} from "next/headers";
import {
    AuthenticationResponseJSON,
    verifyAuthenticationResponse,
    verifyRegistrationResponse
} from "@simplewebauthn/server";
import {dbConnect} from "@src/utils/db.ts";
import {IUser, User} from "@src/schema/user.ts";
import {Session} from "@src/schema/session.ts";


export async function POST(req: NextRequest){
    const cookieData = await cookies();
    const headerData = await headers();
    const {device} = userAgent(req)
    let body: AuthenticationResponseJSON;

    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({info: "Cancelled"}, {status: 200})
    }

    await dbConnect();

    const userObj: IUser | null = await User.findOne({passkeys: {$elemMatch: {webauthnUserID: body.response.userHandle}}});
    if(!userObj) return NextResponse.json({error: "User does not exist"}, {status: 404});
    if(!cookieData.has("authChallenge")) return NextResponse.json({error: "Could not find auth cookie"}, {status: 500});

    const {challenge} = JSON.parse(cookieData.get("authChallenge")!.value)
    const passkey = userObj.passkeys.find(
        p => p.webauthnUserID === body.response.userHandle
    );
    if(!passkey) return NextResponse.json({error: "Cannot find your passkey"}, {status: 500})

    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: challenge,
            expectedOrigin: process.env.RP_ORIGIN!,
            expectedRPID: process.env.RP_ID!,
            credential: {
                id: passkey.id,
                publicKey: new Uint8Array(passkey.publicKey.buffer as ArrayBuffer),
                counter: passkey.counter,
                transports: passkey.transports
            }
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }

    if(verification.verified){
        const sessionID = crypto.randomUUID()
        const newSession = new Session({
            sessionID,
            userAgent: headerData.get("user-agent")!,
            expiresAt: new Date(Date.now() + (5 * 24 * 60 * 60 * 1000)),
            userID: userObj.username
        });
        newSession.save();
        cookieData.set('sessionID', sessionID, {
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        })
        return NextResponse.json({success: verification.verified}, {status: 200})
    }


    return NextResponse.json({success: verification.verified}, {status: 200})

}