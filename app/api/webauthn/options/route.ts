import {NextResponse} from "next/server";
import "@src/utils/envConfig";
import {generateAuthenticationOptions} from "@simplewebauthn/server";

export async function GET(req: Request) {
    // const options = await generateAuthenticationOptions({
    //     rpID:
    //     authenticatorSelection: {
    //
    //     }
    // })
}