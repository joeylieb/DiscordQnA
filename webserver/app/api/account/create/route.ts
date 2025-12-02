import {NextRequest, NextResponse} from "next/server";
import {RegistrationResponseJSON, verifyRegistrationResponse} from "@simplewebauthn/server";
import {IUser, User} from "@src/schema/user.ts";
import {dbConnect, getNextUID} from "@src/utils/db.ts";
import {cookies} from "next/headers";
import {UserID} from "@src/utils/username.ts";

export async function POST(req: NextRequest){
    const body: {attResp: RegistrationResponseJSON} = await req.json();
    const cookieData = await cookies();
    if(!body.attResp) return NextResponse.json({error: "Invalid Registration Data"}, {status: 400});

    if(!cookieData.has("regChallenge")) return NextResponse.json({error: "Cannot find your challenge cookies"}, {status: 501});
    const userChallenges: {challenge: string, userID: string}  = JSON.parse(cookieData.get("regChallenge")!.value);

    if(!cookieData.has("proposedUserData")) return NextResponse.json({error: "Cannot find your user cookies"}, {status: 501});
    const userData: UserID = JSON.parse(cookieData.get("proposedUserData")!.value)

    let verification;

    try {
        verification = await verifyRegistrationResponse({
            response: body.attResp,
            expectedChallenge: userChallenges.challenge,
            expectedOrigin: process.env.RP_ORIGIN!,
            expectedRPID: process.env.RP_ID!
        });
    } catch(err: any) {
        console.error(err);
        return NextResponse.json({error: err.message}, {status: 400});
    }

    const guaranteedUID = await getNextUID()

    const userModel = new User<IUser>({
        username: userData.username,
        uid: guaranteedUID,
        dateCreated: userData.date,
        passkeys: [{
            id: verification.registrationInfo!.credential.id,
            publicKey: verification.registrationInfo!.credential.publicKey,
            webauthnUserID: userChallenges.userID,
            counter: verification.registrationInfo!.credential.counter,
            transports: verification.registrationInfo!.credential.transports,
            deviceType: verification.registrationInfo!.credentialDeviceType,
            backedUp: verification.registrationInfo!.credentialBackedUp
        }],
        purchasedAnswerer: false,
        fullID: userData.fullID
    });

    await userModel.save();

    return NextResponse.json({success: verification.verified, status: 200});

}