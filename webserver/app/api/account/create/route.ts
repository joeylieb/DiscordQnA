import {NextRequest, NextResponse} from "next/server";
import {RegistrationResponseJSON, verifyRegistrationResponse} from "@simplewebauthn/server";
import {User} from "@src/schema/user.ts";
import {dbConnect} from "@src/utils/db.ts";
import {cookies} from "next/headers";

export async function POST(req: NextRequest){
    const body: {username: string, uid: number, dateCreated: number, attResp: RegistrationResponseJSON} = await req.json();
    const cookieData = await cookies();
    if(!body.username || !body.uid || !body.dateCreated ) return NextResponse.json({error: "Invalid username or uid or date"}, {status: 500});
    if(!body.attResp) return NextResponse.json({error: "Invalid Registration Data"}, {status: 400});


    if(!cookieData.has("regChallenge")) return NextResponse.json({error: "Cannot find your challenge cookies"}, {status: 501});
    const userDataRaw = cookieData.get("regChallenge")!.value;
    const userData: {challenge: string, userID: string} = JSON.parse(userDataRaw);
    let verification;

    try {
        verification = await verifyRegistrationResponse({
            response: body.attResp,
            expectedChallenge: userData.challenge,
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
            webauthnUserID: userData.userID,
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