import {NextRequest, NextResponse} from "next/server";
import {RegistrationResponseJSON, verifyRegistrationResponse} from "@simplewebauthn/server";
import {challengesStored, getChallenge} from "@src/utils/challenges.ts";
import {User} from "@src/schema/user.ts";
import {dbConnect} from "@src/utils/db.ts";

export async function POST(req: NextRequest){
    const body: {username: string, uid: number, dateCreated: number, attResp: RegistrationResponseJSON} = await req.json();
    if(!body.username || !body.uid || !body.dateCreated ) return NextResponse.json({error: "Invalid username or uid or date"}, {status: 500});
    if(!body.attResp) return NextResponse.json({error: "Invalid Registration Data"}, {status: 400});


    let verification;
    console.log("pid:", process.pid, "size:", challengesStored.size);
    const challenge = getChallenge(body.username);

    if(!challenge) return NextResponse.json({error: "Could not find challenge via username"}, {status: 500})

    try {
        verification = await verifyRegistrationResponse({
            response: body.attResp,
            expectedChallenge: getChallenge(body.username)!.challenge,
            expectedOrigin: process.env.RP_ORIGIN!,
            expectedRPID: process.env.RP_ID!
        });
    } catch(err: any) {
        console.error(err);
        return NextResponse.json({error: err.message}, {status: 400});
    }

    await dbConnect()

    const userModel = new User({
        username: body.username,
        uid: body.uid,
        dateCreated: body.dateCreated,
        passkeys: [{
            id: verification.registrationInfo!.credential.id,
            publicKey: verification.registrationInfo!.credential.publicKey,
            webauthnUserID: challenge.user.id,
            counter: verification.registrationInfo!.credential.counter,
            transports: verification.registrationInfo!.credential.transports,
            deviceType: verification.registrationInfo!.credentialDeviceType,
            backedUp: verification.registrationInfo!.credentialBackedUp
        }],
        purchasedAnswerer: false
    });

    await userModel.save();

    return NextResponse.json({success: verification.verified, status: 200});

}